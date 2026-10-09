// Tests fuer diagnose.html - ob das Gerechnete auch ankommt.
//
// Der Kern: die Diagnosehierarchie muss in der Anzeige erzwungen werden, nicht
// nur im Modul. Ein Sheet, das sich trotz offener Stufe ausfuellen laesst,
// macht die ganze Reihenfolge zur Empfehlung.
//
// Lokal: node tests/diagnose-ui.test.mjs

import {
  startServer, browserStarten, neuerKontext,
  suite, test, assert, assertEqual, summary
} from './helpers.mjs';

const { server, base } = await startServer();
const browser = await browserStarten();

async function oeffne() {
  const ctx = await neuerKontext(browser);
  const page = await ctx.newPage();
  const fehler = [];
  page.on('pageerror', (e) => fehler.push(e.message));
  await page.goto(base + '/diagnose.html');
  await page.waitForTimeout(500);
  return { ctx, page, fehler, close: () => ctx.close() };
}

/** Hypothese anlegen und Karte aufklappen. */
const ANLEGEN = (code) => `(() => {
  const id = Diagnose.anlegen('${code}');
  diagnoseZeichnen();
  const sec = document.getElementById('sec-' + id);
  sec.querySelector('.section-header').classList.remove('collapsed');
  sec.querySelector('.section-body').classList.remove('collapsed');
  return id;
})()`;

try {

// ---------------------------------------------------------------------------
suite('Die Seite laedt');

await test('diagnose.html laedt ohne Fehler', async () => {
  const p = await oeffne();
  const fehler = p.fehler.slice();
  await p.close();
  assertEqual(fehler, [], 'Fehler beim Laden');
});

await test('alle zehn Symptomcodes stehen zur Auswahl', async () => {
  const p = await oeffne();
  const r = await p.page.evaluate(() => ({
    codes: [...document.querySelectorAll('#symptomWahl option')].map((o) => o.value).filter(Boolean),
    erwartet: Diagnose.SYMPTOME.map((s) => s.code)
  }));
  await p.close();
  assertEqual(r.codes, r.erwartet, 'Auswahlliste');
});

await test('die beiden Flags stehen als Kaestchen da', async () => {
  const p = await oeffne();
  const n = await p.page.evaluate(() => document.querySelectorAll('.diag-flag').length);
  await p.close();
  assertEqual(n, 2, 'Anzahl Flags');
});

// ---------------------------------------------------------------------------
suite('Die Entscheidungsmatrix wird gezeigt, bevor man etwas anlegt');

await test('die Vorschau nennt alle drei Spalten', async () => {
  // Besonders die dritte: sie nennt den naheliegenden Griff, der die Ursache
  // nur verdeckt. Wer sie erst nach dem Anlegen sieht, hat vielleicht schon
  // zum Schluessel gegriffen.
  const p = await oeffne();
  const r = await p.page.evaluate(() => {
    const sel = document.getElementById('symptomWahl');
    sel.value = 'MID-US';
    sel.dispatchEvent(new Event('change', { bubbles: true }));
    const box = document.getElementById('symptomVorschau');
    return { sichtbar: box.style.display !== 'none', text: box.textContent };
  });
  await p.close();
  assert(r.sichtbar, 'Vorschau bleibt versteckt');
  assert(/Zuerst pr/.test(r.text), 'Spalte "erst" fehlt');
  assert(/Danach/.test(r.text), 'Spalte "danach" fehlt');
  assert(/Nicht sofort/.test(r.text), 'Spalte "nicht sofort" fehlt: ' + r.text);
  assert(/Front Temp/.test(r.text), 'Inhalt stimmt nicht: ' + r.text);
});

// ---------------------------------------------------------------------------
suite('Die Hierarchie wird in der Anzeige erzwungen');

await test('eine frische Hypothese zeigt das Sheet gesperrt', async () => {
  const p = await oeffne();
  const r = await p.page.evaluate(`(() => {
    const id = ${ANLEGEN('MID-US')};
    const sec = document.getElementById('sec-' + id);
    return {
      gesperrt: !!sec.querySelector('.warning-box'),
      text: sec.textContent,
      felder: sec.querySelectorAll('.diag-feld').length
    };
  })()`);
  await p.close();
  assert(r.gesperrt, 'Keine Sperrmeldung');
  assert(/Gesperrt/.test(r.text), 'Text: ' + r.text.slice(0, 200));
  assertEqual(r.felder, 0, 'Die Sheet-Felder sind trotz Sperre da');
});

await test('alle fuenf Stufen stehen als Kaestchen da', async () => {
  const p = await oeffne();
  const r = await p.page.evaluate(`(() => {
    const id = ${ANLEGEN('MID-US')};
    const sec = document.getElementById('sec-' + id);
    return [...sec.querySelectorAll('.diag-stufe')].map((c) => c.dataset.stufe);
  })()`);
  await p.close();
  assertEqual(r, ['A', 'B', 'C', 'D', 'E'], 'Stufen in der Anzeige');
});

await test('erst nach allen Stufen erscheint das Sheet', async () => {
  const p = await oeffne();
  const r = await p.page.evaluate(`(() => {
    const id = ${ANLEGEN('MID-US')};
    for (const k of ['A','B','C','D','E']) Diagnose.stufePruefen(id, k, true);
    diagnoseZeichnen();
    const sec = document.getElementById('sec-' + id);
    sec.querySelector('.section-body').classList.remove('collapsed');
    return {
      felder: sec.querySelectorAll('.diag-feld').length,
      erwartet: Diagnose.SHEET.length,
      gesperrt: !!sec.querySelector('.warning-box')
    };
  })()`);
  await p.close();
  assertEqual(r.gesperrt, false, 'Noch gesperrt');
  assertEqual(r.felder, r.erwartet, 'Nicht alle Sheet-Felder da');
});

await test('die Stop-Regel sperrt auch bei vollstaendiger Hierarchie', async () => {
  // Sie steht ueber allem anderen. Wer bei mechanischem Spiel weiter
  // abstimmt, stellt ein Fahrzeug ein, das repariert gehoert.
  const p = await oeffne();
  const r = await p.page.evaluate(`(() => {
    const id = ${ANLEGEN('BUMP-INSTABILITY')};
    for (const k of ['A','B','C','D','E']) Diagnose.stufePruefen(id, k, true);
    Diagnose.stoppSetzen(id, true);
    diagnoseZeichnen();
    const sec = document.getElementById('sec-' + id);
    sec.querySelector('.section-body').classList.remove('collapsed');
    return { felder: sec.querySelectorAll('.diag-feld').length, text: sec.textContent };
  })()`);
  await p.close();
  assertEqual(r.felder, 0, 'Das Sheet ist trotz Stop-Regel offen');
  assert(/reparieren/.test(r.text), 'Der Grund wird nicht genannt');
});

await test('ein Klick auf das Kaestchen wirkt sofort', async () => {
  const p = await oeffne();
  const id = await p.page.evaluate(ANLEGEN('MID-US'));
  await p.page.click(`#sec-${id} .diag-stufe[data-stufe="A"]`);
  await p.page.waitForTimeout(200);
  const offen = await p.page.evaluate((i) => Diagnose.darfAendern(i).offen, id);
  await p.close();
  assertEqual(offen, ['B', 'C', 'D', 'E'], 'Stufe A wurde nicht uebernommen');
});

// ---------------------------------------------------------------------------
suite('Das Change Impact Sheet');

await test('die Zahl der offenen Felder wird genannt', async () => {
  const p = await oeffne();
  const t = await p.page.evaluate(`(() => {
    const id = ${ANLEGEN('MID-US')};
    for (const k of ['A','B','C','D','E']) Diagnose.stufePruefen(id, k, true);
    diagnoseZeichnen();
    const sec = document.getElementById('sec-' + id);
    sec.querySelector('.section-body').classList.remove('collapsed');
    return sec.textContent;
  })()`);
  await p.close();
  assert(/Noch 12 von 12 Feldern offen/.test(t), 'Zahl fehlt: ' + t.slice(0, 300));
  assert(/Messgr/.test(t), 'Der Hinweis auf die Messgroesse fehlt');
});

await test('Tippen speichert, ohne den Fokus zu stehlen', async () => {
  // Wer beim Schreiben den Fokus verliert, kann das Feld nicht ausfuellen.
  // Darum wird beim Tippen nur gespeichert, nicht neu gezeichnet.
  const p = await oeffne();
  const id = await p.page.evaluate(`(() => {
    const i = ${ANLEGEN('MID-US')};
    for (const k of ['A','B','C','D','E']) Diagnose.stufePruefen(i, k, true);
    diagnoseZeichnen();
    const sec = document.getElementById('sec-' + i);
    sec.querySelector('.section-body').classList.remove('collapsed');
    return i;
  })()`);

  const feld = `#sec-${id} .diag-feld[data-feld="hypothese"]`;
  await p.page.fill(feld, 'Aussenrad verliert Contact Patch');
  await p.page.waitForTimeout(700);

  const r = await p.page.evaluate((i) => ({
    gespeichert: Diagnose.eine(i).sheet.hypothese,
    fokusNoch: document.activeElement && document.activeElement.dataset.feld === 'hypothese'
  }), id);
  await p.close();

  assertEqual(r.gespeichert, 'Aussenrad verliert Contact Patch', 'Nicht gespeichert');
  assertEqual(r.fokusNoch, true, 'Der Fokus ist beim Tippen verlorengegangen');
});

await test('alle vier A/B-Ergebnisse stehen zur Wahl', async () => {
  const p = await oeffne();
  const r = await p.page.evaluate(`(() => {
    const id = ${ANLEGEN('MID-US')};
    for (const k of ['A','B','C','D','E']) Diagnose.stufePruefen(id, k, true);
    diagnoseZeichnen();
    const sec = document.getElementById('sec-' + id);
    sec.querySelector('.section-body').classList.remove('collapsed');
    return [...sec.querySelectorAll('.diag-ergebnis option')].map((o) => o.value);
  })()`);
  await p.close();
  for (const k of ['', 'besser', 'schlechter', 'neutral', 'unklar']) {
    assert(r.includes(k), 'Ergebnis fehlt: ' + (k || '(offen)'));
  }
});

// ---------------------------------------------------------------------------
suite('Hypothesen verwalten');

await test('eine abgeschlossene Hypothese wandert nach unten', async () => {
  const p = await oeffne();
  const r = await p.page.evaluate(`(() => {
    const id = ${ANLEGEN('MID-US')};
    const vorher = document.querySelectorAll('#hypothesenListe .section').length;
    Diagnose.ergebnisSetzen(id, 'besser');
    diagnoseZeichnen();
    return {
      vorher,
      offen: document.querySelectorAll('#hypothesenListe .section').length,
      fertig: document.querySelectorAll('#abgeschlossenListe .section').length
    };
  })()`);
  await p.close();
  assertEqual(r.vorher, 1, 'Ausgangslage');
  assertEqual(r.offen, 0, 'Noch in der offenen Liste');
  assertEqual(r.fertig, 1, 'Nicht in der abgeschlossenen Liste');
});

await test('eine aufgeklappte Karte bleibt beim Abhaken offen', async () => {
  // Dasselbe Problem wie auf der Werkstattseite, aus v3. Hier wird es von
  // vornherein mitgeprueft, nicht erst nachdem es jemandem auffaellt.
  const p = await oeffne();
  const r = await p.page.evaluate(`(() => {
    const id = ${ANLEGEN('MID-US')};
    const sec = () => document.getElementById('sec-' + id);
    const vorher = !sec().querySelector('.section-body').classList.contains('collapsed');
    sec().querySelector('.diag-stufe[data-stufe="A"]').click();
    return { vorher, id };
  })()`);
  await p.page.waitForTimeout(300);
  const nachher = await p.page.evaluate((i) =>
    !document.querySelector('#sec-' + i + ' .section-body').classList.contains('collapsed'), r.id);
  await p.close();
  assertEqual(r.vorher, true, 'Karte war nicht offen');
  assertEqual(nachher, true, 'Die Karte ist beim Abhaken zugeklappt');
});

await test('der Stand ueberlebt das Neuladen', async () => {
  const ctx = await neuerKontext(browser);
  const page = await ctx.newPage();
  await page.goto(base + '/diagnose.html');
  await page.waitForTimeout(400);

  const id = await page.evaluate(`(() => {
    const i = Diagnose.anlegen('ENTRY-OS', ['L/R-ASYMMETRY']);
    Diagnose.stufePruefen(i, 'A', true);
    Diagnose.sheetSetzen(i, 'hypothese', 'Trail Braking zu lang');
    return i;
  })()`);

  await page.reload();
  await page.waitForTimeout(400);
  const r = await page.evaluate((i) => {
    const h = Diagnose.eine(i);
    return h ? { code: h.code, a: !!h.geprueft.A, hyp: h.sheet.hypothese } : null;
  }, id);
  await ctx.close();

  assert(r, 'Hypothese ist verschwunden');
  assertEqual(r.code, 'ENTRY-OS', 'Code');
  assertEqual(r.a, true, 'Stufe A');
  assertEqual(r.hyp, 'Trail Braking zu lang', 'Sheet-Feld');
});

} finally {
  await browser.close();
  server.close();
}

process.exit(summary() === 0 ? 0 : 1);
