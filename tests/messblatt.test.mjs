// Tests fuer messblatt.html.
//
// Zwei Dinge, die der Modultest nicht sehen kann:
//
//   1. ob eingetragene Werte wirken - AGENTS Regel 8. Ein Eingabefeld, dessen
//      Wert nirgends erscheint, ist eine Falle.
//   2. ob die Kopplung an recheck.js haelt: eine Camber-Aenderung im Feld
//      muss dieselben Phasen entwerten wie der Knopf in der Werkstatt.
//
// Lokal: node tests/messblatt.test.mjs

import {
  startServer, browserStarten, neuerKontext,
  suite, test, assert, assertEqual, summary
} from './helpers.mjs';

const { server, base } = await startServer();
const browser = await browserStarten();

async function oeffne(datei) {
  const ctx = await neuerKontext(browser);
  const page = await ctx.newPage();
  const fehler = [];
  page.on('pageerror', (e) => fehler.push(e.message));
  await page.goto(base + '/' + (datei || 'messblatt.html'));
  await page.waitForTimeout(500);
  await alleAufklappen(page);
  return { ctx, page, fehler, close: () => ctx.close() };
}

/**
 * Alle Abschnitte aufklappen.
 *
 * Die Seite startet eingeklappt - acht Abschnitte uebereinander waeren sonst
 * eine sehr lange Liste. Fuer den Test heisst das: erst oeffnen, sonst sind
 * die Felder zwar im DOM, aber nicht bedienbar, und page.fill wartet
 * dreissig Sekunden auf ein unsichtbares Element.
 */
async function alleAufklappen(page) {
  await page.evaluate(() => {
    document.querySelectorAll('#blattListe .section-header').forEach((h) => {
      h.classList.remove('collapsed');
      const b = h.nextElementSibling;
      if (b) b.classList.remove('collapsed');
    });
  });
  await page.waitForTimeout(80);
}

/** Feld fuellen und das input-Ereignis ausloesen. */
async function fuelle(page, id, wert) {
  await page.fill('[data-field="' + id + '"]', String(wert));
  await page.waitForTimeout(60);
}

try {

// ---------------------------------------------------------------------------
suite('Die Seite laedt');

await test('messblatt.html laedt ohne Fehler', async () => {
  const p = await oeffne();
  const fehler = p.fehler.slice();
  await p.close();
  assertEqual(fehler, [], 'Fehler beim Laden');
});

await test('jedes Feld der Registry steht auf der Seite', async () => {
  // Gegenrichtung zum Modultest: ein Feld, das nur in messwerte.js steht,
  // laesst sich nie ausfuellen.
  const p = await oeffne();
  const fehlend = await p.page.evaluate(() =>
    Messwerte.FELDER
      .filter((f) => !document.querySelector('[data-field="' + f.id + '"]'))
      .map((f) => f.id));
  await p.close();
  assertEqual(fehlend, [], 'Feld fehlt im Markup');
});

await test('kein Feld steht zweimal da', async () => {
  // Zwei Eingabefelder fuer denselben Messwert - in jerico neunmal passiert.
  const p = await oeffne();
  const doppelt = await p.page.evaluate(() => {
    const ids = [...document.querySelectorAll('[data-field]')].map((e) => e.dataset.field);
    return ids.filter((x, i) => ids.indexOf(x) !== i);
  });
  await p.close();
  assertEqual(doppelt, [], 'Doppeltes Eingabefeld');
});

await test('kein Feld traegt einen vorausgefuellten Wert', async () => {
  // Die Baseline hat keine belegte Herkunft. Ein vorausgefuelltes Feld
  // koennte als gemessen durchgehen.
  const p = await oeffne();
  const gefuellt = await p.page.evaluate(() =>
    [...document.querySelectorAll('[data-field]')]
      .filter((e) => e.value !== '').map((e) => e.dataset.field));
  await p.close();
  assertEqual(gefuellt, [], 'Feld ist vorausgefuellt');
});

// ---------------------------------------------------------------------------
suite('Abgeleitete Werte werden gerechnet, nicht eingetragen');

await test('Total Toe erscheint, sobald F und R stehen', async () => {
  const p = await oeffne();
  await fuelle(p.page, 'toe_f', '1450');
  await fuelle(p.page, 'toe_r', '1453');
  const t = await p.page.textContent('[data-gruppe="toe"]');
  await p.close();
  assert(/3[.,]00 mm/.test(t), 'Total Toe fehlt: ' + t);
  assert(/Toe-in/.test(t), 'Richtung wird nicht genannt');
});

await test('ohne Messbasis kein Winkel, aber ein Hinweis', async () => {
  // CONVENTIONS 9 verbietet die Umrechnung ohne D. Die Seite muss das sagen,
  // nicht stillschweigend nichts anzeigen.
  const p = await oeffne();
  await fuelle(p.page, 'toe_f', '1450');
  await fuelle(p.page, 'toe_r', '1453');
  const t = await p.page.textContent('[data-gruppe="toe"]');
  await p.close();
  assert(/ohne Messbasis/i.test(t), 'Der Hinweis fehlt: ' + t);
});

await test('mit Messbasis erscheint der Winkel', async () => {
  const p = await oeffne();
  await fuelle(p.page, 'toe_f', '1450');
  await fuelle(p.page, 'toe_r', '1453');
  await fuelle(p.page, 'toe_d', '381');
  const t = await p.page.textContent('[data-gruppe="toe"]');
  await p.close();
  assert(/0[.,]451/.test(t), 'Winkel fehlt oder stimmt nicht: ' + t);
});

await test('die vier Radlasten ergeben alle sechs Prozentwerte', async () => {
  const p = await oeffne();
  for (const [id, v] of [['cw_lf', 310], ['cw_rf', 305], ['cw_lr', 290], ['cw_rr', 295]]) {
    await fuelle(p.page, id, v);
  }
  const t = await p.page.textContent('[data-gruppe="radlast"]');
  await p.close();
  assert(/1200[.,]0 kg/.test(t), 'Total fehlt: ' + t);
  assert(/Cross/.test(t), 'Cross fehlt');
  assert(/49[.,]58/.test(t), 'Cross-Wert stimmt nicht: ' + t);
  assert(/kein Sollwert/.test(t), 'Die Interpretationsregel fehlt');
});

await test('drei von vier Radlasten ergeben noch nichts', async () => {
  const p = await oeffne();
  for (const [id, v] of [['cw_lf', 310], ['cw_rf', 305], ['cw_lr', 290]]) {
    await fuelle(p.page, id, v);
  }
  const t = await p.page.textContent('[data-gruppe="radlast"]');
  await p.close();
  assert(/Alle vier/.test(t), 'Es wird gerechnet, obwohl ein Wert fehlt: ' + t);
});

await test('die L/R-Differenz wird gerechnet', async () => {
  const p = await oeffne();
  await fuelle(p.page, 'al_camber_lf', '-2.1');
  await fuelle(p.page, 'al_camber_rf', '-1.9');
  const t = await p.page.evaluate(() => {
    const z = [...document.querySelectorAll('.mb-diff')]
      .find((e) => e.dataset.links === 'al_camber_lf');
    return z ? z.textContent : null;
  });
  await p.close();
  assert(t !== null, 'Keine Differenzspalte fuer Camber');
  assert(/-0[.,]20/.test(t), 'Differenz stimmt nicht: ' + t);
});

await test('die Pyrometer-Auswertung nennt beide Kennzahlen getrennt', async () => {
  const p = await oeffne();
  for (const [id, v] of [['py_innen_lf', 82], ['py_mitte_lf', 76], ['py_aussen_lf', 68]]) {
    await fuelle(p.page, id, v);
  }
  const t = await p.page.textContent('[data-gruppe="pyrometer"]');
  await p.close();
  assert(/Camber-Gef/.test(t), 'Camber-Gefaelle fehlt: ' + t);
  assert(/Druck-W/.test(t), 'Druck-Woelbung fehlt');
  assert(/14[.,]0 K/.test(t), 'Gefaelle stimmt nicht: ' + t);
});

await test('fuer abgeleitete Werte gibt es kein Eingabefeld', async () => {
  // Wer sie eintragen koennte, koennte sie auch falsch eintragen - und dann
  // stuende neben dem Messwert eine Zahl, die nicht zu ihm passt.
  const p = await oeffne();
  const verboten = await p.page.evaluate(() =>
    ['toe_total', 'cw_cross', 'cw_total', 'al_camber_diff']
      .filter((id) => document.querySelector('[data-field="' + id + '"]')));
  await p.close();
  assertEqual(verboten, [], 'Eingabefeld fuer einen gerechneten Wert');
});

// ---------------------------------------------------------------------------
suite('Eingetragene Werte wirken auf den Phasenstatus');

await test('ein Camber-Feld entwertet dieselben Phasen wie der Knopf', async () => {
  // DAS ist die Kopplung, um die es geht: in der Werkstatt traegt man
  // Messwerte ein, und der Status folgt von selbst.
  const p = await oeffne();
  const r = await p.page.evaluate(() => {
    for (const ph of Recheck.PHASEN) Status.setzen(ph.id, 'done');
    const vorher = Status.fortschritt().veraltet;

    const el = document.querySelector('[data-field="al_camber_lf"]');
    el.value = '-2.1';
    el.dispatchEvent(new Event('change', { bubbles: true }));

    return {
      vorher,
      nachher: Status.fortschritt().veraltet,
      phasen: Status.uebersicht().filter((x) => x.veraltet).map((x) => x.nr),
      journal: Status.journal().length
    };
  });
  await p.close();
  assertEqual(r.vorher, 0, 'Ausgangslage');
  assertEqual(r.journal, 1, 'Das Feld hat sich nicht gemeldet');
  assertEqual(r.phasen, [3, 6, 13], 'Andere Phasen als beim Knopf');
});

await test('ein Feld ohne data-groesse meldet nichts', async () => {
  // Die Messbasis D ist eine Angabe zum Messverfahren, kein Eingriff am
  // Fahrzeug. Sie darf nichts entwerten.
  const p = await oeffne();
  const r = await p.page.evaluate(() => {
    const el = document.querySelector('[data-field="toe_d"]');
    const hat = !!el.dataset.groesse;
    const vorher = Status.journal().length;
    el.value = '381';
    el.dispatchEvent(new Event('change', { bubbles: true }));
    return { hat, vorher, nachher: Status.journal().length };
  });
  await p.close();
  assertEqual(r.hat, false, 'Die Messbasis traegt eine data-groesse');
  assertEqual(r.nachher, r.vorher, 'Sie hat trotzdem gemeldet');
});

await test('jedes data-groesse-Attribut kennt recheck.js', async () => {
  const p = await oeffne();
  const unbekannt = await p.page.evaluate(() => {
    const bekannt = Recheck.alleGroessen();
    return [...new Set([...document.querySelectorAll('[data-groesse]')]
      .map((e) => e.dataset.groesse))].filter((g) => !bekannt.includes(g));
  });
  await p.close();
  assertEqual(unbekannt, [], 'Unbekannte Groesse im Markup');
});

// ---------------------------------------------------------------------------
suite('Speichern');

await test('ein eingetragener Wert ueberlebt das Neuladen', async () => {
  const ctx = await neuerKontext(browser);
  const page = await ctx.newPage();
  await page.goto(base + '/messblatt.html');
  await page.waitForTimeout(400);
  await alleAufklappen(page);

  await page.fill('[data-field="al_camber_lf"]', '-2.3');
  await page.waitForTimeout(1200);          // autoSave entprellt 800 ms

  await page.reload();
  await page.waitForTimeout(600);
  await alleAufklappen(page);
  const v = await page.inputValue('[data-field="al_camber_lf"]');
  await ctx.close();
  assertEqual(v, '-2.3', 'Wert nach dem Neuladen');
});

await test('ein geleertes Feld bleibt geleert', async () => {
  // "Leer ist eine Aussage" - AGENTS Regel 9. Vorher galt "leer gewinnt
  // nie", und ein geloeschter Messwert kam beim naechsten Laden zurueck.
  const ctx = await neuerKontext(browser);
  const page = await ctx.newPage();
  await page.goto(base + '/messblatt.html');
  await page.waitForTimeout(400);
  await alleAufklappen(page);

  await page.fill('[data-field="al_camber_rf"]', '-1.9');
  await page.waitForTimeout(1200);
  await page.fill('[data-field="al_camber_rf"]', '');
  await page.waitForTimeout(1200);

  await page.reload();
  await page.waitForTimeout(600);
  await alleAufklappen(page);
  const v = await page.inputValue('[data-field="al_camber_rf"]');
  await ctx.close();
  assertEqual(v, '', 'Der geloeschte Wert ist zurueckgekommen');
});

await test('die Validierung markiert einen unmoeglichen Wert', async () => {
  const p = await oeffne();
  const el = '[data-field="al_camber_lf"]';
  await p.page.fill(el, '-99');
  await p.page.evaluate((s) => document.querySelector(s).blur(), el);
  await p.page.waitForTimeout(200);
  const klassen = await p.page.getAttribute(el, 'class');
  await p.close();
  assert(/status-(error|warn)/.test(klassen || ''),
    '-99 Grad Camber wurde nicht beanstandet: ' + klassen);
});

await test('ein Komma wird als Dezimaltrennzeichen akzeptiert', async () => {
  // Auf einem deutschen Telefon tippt man ein Komma.
  const p = await oeffne();
  const el = '[data-field="al_camber_lf"]';
  await p.page.fill(el, '-2,3');
  await p.page.evaluate((s) => document.querySelector(s).blur(), el);
  await p.page.waitForTimeout(200);
  const r = await p.page.evaluate((s) => ({
    wert: document.querySelector(s).value,
    klassen: document.querySelector(s).className
  }), el);
  await p.close();
  assert(!/status-error/.test(r.klassen), 'Komma wurde beanstandet');
  assertEqual(r.wert, '-2.3', 'Komma wurde nicht normalisiert');
});

} finally {
  await browser.close();
  server.close();
}

process.exit(summary() === 0 ? 0 : 1);
