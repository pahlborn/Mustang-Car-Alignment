// Tests fuer bumpsteer.js und die Bump-Steer-Seite.
//
// Zwei Schwerpunkte:
//
//   Rechnen   Kennwerte, Monotonie, Nulldurchgang, Symmetrie
//   Pruefen   ob die MESSUNG taugt - Arretierung, Nullpunktkontrolle. Eine
//             Kurve aus einer Messung, bei der sich die Lenkung bewegt hat,
//             ist kein Befund, sondern Rauschen.
//
// Und eine Pruefung, die kein Rechenfehler ist, sondern eine Haltung: es darf
// keinen Zielwert geben. Das Template sagt "Bump Steer wird minimiert, nicht
// auf einen Zahlenwert eingestellt", und der frueher diskutierte Richtwert
// steht dort ausdruecklich als nicht belegt.
//
// Lokal: node tests/bumpsteer.test.mjs

import fs from 'node:fs';
import path from 'node:path';
import {
  startServer, browserStarten, neuerKontext, REPO_ROOT,
  suite, test, assert, assertEqual, summary
} from './helpers.mjs';

new Function(fs.readFileSync(path.join(REPO_ROOT, 'bumpsteer.js'), 'utf8'))();
const B = globalThis.BumpSteer;

const TPL = fs.readFileSync(
  path.join(REPO_ROOT, 'handbuch', 'TEMPLATE_BUMP_STEER_SHEET.md'), 'utf8');
const KONV = fs.readFileSync(
  path.join(REPO_ROOT, 'handbuch', 'CONVENTIONS.md'), 'utf8');

const { server, base } = await startServer();
const browser = await browserStarten();

async function oeffne() {
  const ctx = await neuerKontext(browser);
  const page = await ctx.newPage();
  const fehler = [];
  page.on('pageerror', (e) => fehler.push(e.message));
  await page.goto(base + '/bumpsteer.html');
  await page.waitForTimeout(500);
  await page.evaluate(() => {
    document.querySelectorAll('#bsListe .section-header').forEach((h) => {
      h.classList.remove('collapsed');
      const b = h.nextElementSibling;
      if (b) b.classList.remove('collapsed');
    });
  });
  return { ctx, page, fehler, close: () => ctx.close() };
}

/** Messreihe als Datenobjekt. */
function reihe(seite, paare) {
  const d = {};
  for (const [w, v] of paare) d[B.feldName(seite, w)] = v;
  return d;
}

function nahe(a, b, eps = 1e-9) {
  assert(a !== null && a !== undefined, 'Ergebnis ist null');
  assert(Math.abs(a - b) < eps, 'erwartet ' + b + ', war ' + a);
}

try {

// ---------------------------------------------------------------------------
suite('Die Vorgaben stammen aus dem Handbuch');

await test('die Federwegstufen stehen im Template', async () => {
  // Das Template setzt fuer negative Werte ein echtes Minuszeichen (U+2212),
  // nicht den Bindestrich-Minus aus dem Code. Beide auf eine Form bringen -
  // sonst meldet der Test sechs fehlende Stufen, die alle dastehen.
  const text = TPL.replace(/\u2212/g, '-');
  const fehlend = B.STUFEN
    .filter((w) => w !== 0)
    .filter((w) => !text.includes('| ' + (w > 0 ? '+' : '') + w + ' mm'));
  assertEqual(fehlend, [], 'Stufe nicht im Template');
});

await test('die Feinstufen stehen ebenfalls dort', async () => {
  // "Bei auffaelligem Verhalten zusaetzliche Punkte bei +/-3 mm und +/-9 mm."
  assert(/\u00b13 mm und \u00b19 mm/.test(TPL), 'Feinstufen nicht im Template');
  assertEqual(B.FEIN.sort((a, b) => a - b), [-9, -3, 3, 9], 'Feinstufen');
});

await test('die Geraetetoleranz ist belegt', async () => {
  assert(/auf \*\*0,1 mm\*\* genau/.test(TPL), 'Toleranz nicht im Template');
  assertEqual(B.GERAETETOLERANZ_MM, 0.1, 'Toleranz');
});

await test('die Vorzeichen folgen CONVENTIONS 10', async () => {
  const block = KONV.slice(KONV.indexOf('## 10. Bump Steer'), KONV.indexOf('## 11.'));
  assert(/positiver Federweg = \*\*Bump/.test(block), 'Federweg-Konvention nicht gefunden');
  assert(B.STUFEN[0] < 0 && B.STUFEN[B.STUFEN.length - 1] > 0,
    'Stufen laufen nicht von Droop nach Bump');
  assertEqual(B.STUFEN[Math.floor(B.STUFEN.length / 2)], 0, 'Nullpunkt in der Mitte');
});

await test('es gibt keinen Zielwert im Code', async () => {
  // Das Template: "Der frueher diskutierte Richtwert von ca. 0,020 Zoll je
  // 1 Zoll Federweg ist nicht belegt und wird nicht als Ziel verwendet."
  //
  // Ein Grenzwert im Code waere genau die Zahl, die es dort nicht gibt -
  // und die Anzeige wuerde bewerten, wo sie nur messen darf.
  // Kommentarzeilen ausnehmen: dort steht die Begruendung, warum es keinen
  // Zielwert gibt - und die darf das Wort nennen. Geprueft wird der Code.
  const quelle = [
    fs.readFileSync(path.join(REPO_ROOT, 'bumpsteer.js'), 'utf8'),
    fs.readFileSync(path.join(REPO_ROOT, 'bumpsteer-chart.js'), 'utf8')
  ].join('\n')
    .split(/\r?\n/)
    .filter((z) => !/^\s*(\/\/|\*|\/\*)/.test(z))
    .join('\n');

  for (const wort of ['ZIELWERT', 'GRENZWERT', 'MAX_AUSSCHLAG', 'TOLERANZ_TOE',
                      'zielband', '0.02,', '0,020']) {
    assert(!quelle.includes(wort), 'Zielwert im Code gefunden: ' + wort);
  }
  assert(/nicht belegt/.test(TPL), 'Das Template sagt das nicht mehr');
});

// ---------------------------------------------------------------------------
suite('Kennwerte');

await test('Ausschlag ist max minus min', async () => {
  const p = B.punkte(reihe('LF', [[-25, -0.3], [0, 0], [25, 0.4]]), 'LF');
  const k = B.kennwerte(p);
  nahe(k.maxToeIn, 0.4);
  nahe(k.maxToeOut, -0.3);
  nahe(k.ausschlag, 0.7);
});

await test('das Arbeitsfenster begrenzt die Auswertung', async () => {
  // "Ein Toe-Ausschlag bei -50 mm ist bedeutungslos, wenn die Aufhaengung
  // dort nie arbeitet."
  const p = B.punkte(reihe('LF',
    [[-50, -2.0], [-25, -0.3], [0, 0], [25, 0.4], [50, 1.8]]), 'LF');
  nahe(B.kennwerte(p).ausschlag, 3.8);
  nahe(B.kennwerte(p, { von: -25, bis: 25 }).ausschlag, 0.7);
});

await test('eine monotone Kurve wird erkannt', async () => {
  const p = B.punkte(reihe('LF', [[-25, -0.3], [-12, -0.15], [0, 0], [12, 0.2], [25, 0.4]]), 'LF');
  assertEqual(B.kennwerte(p).monoton, true, 'monoton');
});

await test('ein Richtungswechsel wird erkannt', async () => {
  // Nicht-monoton ist ein eigener Befund - nicht dasselbe wie ein grosser
  // Ausschlag.
  const p = B.punkte(reihe('LF', [[-25, 0.5], [-12, -0.4], [0, 0], [12, -0.4], [25, 0.5]]), 'LF');
  assertEqual(B.kennwerte(p).monoton, false, 'Richtungswechsel nicht erkannt');
});

await test('Rauschen unterhalb der Geraetetoleranz gilt nicht als Wechsel', async () => {
  // Das BGR310 ist auf 0,1 mm genau. Ohne diese Ausnahme meldet jede
  // Messreihe einen Richtungswechsel.
  const p = B.punkte(reihe('LF',
    [[-25, 0], [-12, 0.03], [0, 0], [12, 0.02], [25, 0.3]]), 'LF');
  assertEqual(B.kennwerte(p).monoton, true, 'Rauschen als Wechsel gewertet');
});

await test('die Steigung um Null nimmt die naechsten Punkte beidseits', async () => {
  const p = B.punkte(reihe('LF', [[-25, -1], [-6, -0.06], [0, 0], [6, 0.06], [25, 1]]), 'LF');
  nahe(B.kennwerte(p).steigungUmNull, 0.12 / 12);
});

await test('der Nulldurchgang wird interpoliert', async () => {
  const p = B.punkte(reihe('LF', [[-12, -0.2], [12, 0.2]]), 'LF');
  nahe(B.kennwerte(p).nulldurchgang, 0);

  const q = B.punkte(reihe('LF', [[0, -0.2], [12, 0.2]]), 'LF');
  nahe(B.kennwerte(q).nulldurchgang, 6);
});

await test('ein einzelner Punkt ergibt keine Kennwerte', async () => {
  const p = B.punkte(reihe('LF', [[0, 0]]), 'LF');
  assertEqual(B.kennwerte(p), null, 'Ein Punkt reicht nicht');
});

await test('leere Felder entfallen, die Reihe bleibt brauchbar', async () => {
  const d = reihe('LF', [[-25, -0.3], [0, 0], [25, 0.4]]);
  d[B.feldName('LF', 12)] = '';
  const p = B.punkte(d, 'LF', true);
  assertEqual(p.length, 3, 'Leeres Feld wurde mitgezaehlt');
});

await test('Komma als Dezimaltrennzeichen', async () => {
  const p = B.punkte(reihe('LF', [[-25, '-0,3'], [25, '0,4']]), 'LF');
  nahe(B.kennwerte(p).ausschlag, 0.7);
});

// ---------------------------------------------------------------------------
suite('Symmetrie zwischen den Seiten');

await test('gleiche Kurven ergeben keine Differenz', async () => {
  const paare = [[-25, -0.3], [0, 0], [25, 0.4]];
  const s = B.symmetrie(B.punkte(reihe('LF', paare), 'LF'),
                        B.punkte(reihe('RF', paare), 'RF'));
  nahe(s.maxDifferenz, 0);
  assertEqual(s.gleicheRichtung, true, 'Richtung');
});

await test('eine Abweichung wird beziffert', async () => {
  const s = B.symmetrie(
    B.punkte(reihe('LF', [[-25, -0.3], [0, 0], [25, 0.4]]), 'LF'),
    B.punkte(reihe('RF', [[-25, -0.3], [0, 0], [25, 1.1]]), 'RF'));
  nahe(s.maxDifferenz, 0.7, 1e-9);
});

await test('gegenlaeufige Kurven werden als solche gemeldet', async () => {
  // Asymmetrie ist ein eigener Befund - moegliche Ursachen nennt das
  // Template, gedeutet wird hier nichts.
  const s = B.symmetrie(
    B.punkte(reihe('LF', [[-25, -0.5], [0, 0], [25, 0.8]]), 'LF'),
    B.punkte(reihe('RF', [[-25, 0.8], [0, 0], [25, -0.5]]), 'RF'));
  assertEqual(s.gleicheRichtung, false, 'Gegenlauf nicht erkannt');
});

// ---------------------------------------------------------------------------
suite('Die Messung wird geprueft, nicht nur gerechnet');

await test('fehlende A5-Pruefung ist ein Fehler', async () => {
  // "Dies ist der wichtigste Handgriff vor der Messung. Er dauert zehn
  // Sekunden und entscheidet, ob die ganze Messreihe verwertbar ist."
  const d = reihe('LF', [[-25, -0.3], [0, 0], [25, 0.4]]);
  const b = B.pruefen(d, 'LF');
  assert(b.some((x) => x.art === 'fehler' && /Arretierung/.test(x.text)),
    'A5 wird nicht angemahnt');
});

await test('ein verrutschter Nullpunkt macht die Reihe unbrauchbar', async () => {
  // "Nach dem Durchfahren muss die Messuhr am Nullpunkt wieder 0 zeigen.
  // Tut sie das nicht, hat sich etwas bewegt - meist die Lenkung."
  const d = reihe('LF', [[-25, -0.3], [0, 0], [25, 0.4]]);
  d['bs_a5_geprueft'] = true;
  d['bs_null_lf_bump'] = '0.35';
  d['bs_null_lf_droop'] = '0.02';

  const b = B.pruefen(d, 'LF');
  const fehler = b.filter((x) => x.art === 'fehler');
  assertEqual(fehler.length, 1, 'Genau ein Fehler erwartet');
  assert(/Bump/.test(fehler[0].text), 'Die Richtung wird nicht genannt');
  assert(/Lenkung/.test(fehler[0].text), 'Die wahrscheinliche Ursache fehlt');
});

await test('eine Abweichung in der Geraetetoleranz ist kein Fehler', async () => {
  // 0,05 mm liegen im Rahmen - das Template sagt es ausdruecklich.
  const d = reihe('LF', [[-25, -0.3], [0, 0], [25, 0.4]]);
  d['bs_a5_geprueft'] = true;
  d['bs_null_lf_bump'] = '0.05';
  d['bs_null_lf_droop'] = '-0.04';
  assertEqual(B.pruefen(d, 'LF').filter((x) => x.art === 'fehler'), [],
    'Toleranzwert als Fehler gewertet');
});

await test('eine fehlende Nullpunktkontrolle wird angemahnt', async () => {
  // Beide Richtungen eigens - die Kontrolle gehoert nach jedem Durchgang.
  // Gezaehlt wird gezielt, nicht die Gesamtzahl der Warnungen: die Reihe ist
  // hier auch zu kurz, und das ist ein eigener Befund.
  const d = reihe('LF', [[-25, -0.3], [0, 0], [25, 0.4]]);
  d['bs_a5_geprueft'] = true;
  const w = B.pruefen(d, 'LF')
    .filter((x) => x.art === 'warnung' && /Nullpunktkontrolle/.test(x.text));
  assertEqual(w.length, 2, 'Beide Richtungen muessen angemahnt werden');
  assert(w.some((x) => /Bump/.test(x.text)), 'Bump fehlt');
  assert(w.some((x) => /Droop/.test(x.text)), 'Droop fehlt');
});

await test('eine zu kurze Reihe wird angemahnt', async () => {
  const d = reihe('LF', [[0, 0], [25, 0.4]]);
  d['bs_a5_geprueft'] = true;
  assert(B.pruefen(d, 'LF').some((x) => /Messpunkte/.test(x.text)),
    'Kurze Reihe nicht angemahnt');
});

await test('eine saubere Messung erzeugt keinen Fehler', async () => {
  const d = reihe('LF',
    [[-25, -0.3], [-12, -0.15], [-6, -0.08], [0, 0], [6, 0.08], [12, 0.18], [25, 0.4]]);
  d['bs_a5_geprueft'] = true;
  d['bs_null_lf_bump'] = '0';
  d['bs_null_lf_droop'] = '0';
  assertEqual(B.pruefen(d, 'LF').filter((x) => x.art === 'fehler'), [], 'Fehler');
  assertEqual(B.pruefen(d, 'LF').filter((x) => x.art === 'warnung'), [], 'Warnung');
});

// ---------------------------------------------------------------------------
suite('Die Seite');

await test('bumpsteer.html laedt ohne Fehler', async () => {
  const p = await oeffne();
  const fehler = p.fehler.slice();
  await p.close();
  assertEqual(fehler, [], 'Fehler beim Laden');
});

await test('alle Federwegstufen haben Felder fuer beide Seiten', async () => {
  const p = await oeffne();
  const fehlend = await p.page.evaluate(() => {
    const fehlt = [];
    for (const s of BumpSteer.SEITEN) {
      for (const w of BumpSteer.stufen(true)) {
        const id = BumpSteer.feldName(s, w);
        if (!document.querySelector('[data-field="' + id + '"]')) fehlt.push(id);
      }
    }
    return fehlt;
  });
  await p.close();
  assertEqual(fehlend, [], 'Feld fehlt');
});

await test('die Pruefpunkte stehen vor der Messreihe', async () => {
  // A5 entscheidet, ob die Reihe verwertbar ist. Wer sie erst nach dem
  // Messen liest, hat umsonst gemessen.
  const p = await oeffne();
  const r = await p.page.evaluate(() => {
    const alle = [...document.querySelectorAll('#bsListe .section')].map((s) => s.id);
    return { vorbereitung: alle.indexOf('sec-bs-vorbereitung'),
             messung: alle.indexOf('sec-bs-messung') };
  });
  await p.close();
  assert(r.vorbereitung > -1 && r.messung > -1, 'Abschnitt fehlt');
  assert(r.vorbereitung < r.messung, 'Die Vorbereitung steht nicht vor der Messung');
});

await test('eine Messreihe erzeugt die Kurve', async () => {
  const p = await oeffne();
  const r = await p.page.evaluate(() => {
    for (const [w, v] of [[-25, -0.3], [-12, -0.15], [0, 0], [12, 0.2], [25, 0.4]]) {
      const el = document.querySelector('[data-field="' + BumpSteer.feldName('LF', w) + '"]');
      el.value = String(v);
    }
    bumpsteerZeichnen();
    const c = document.getElementById('bsChart');
    const reihen = { LF: BumpSteer.punkte(
      Object.fromEntries([...document.querySelectorAll('[data-field]')]
        .map((e) => [e.dataset.field, e.value])), 'LF', true) };
    return {
      canvasBreite: c.width,
      punkte: reihen.LF.length,
      kennwerte: document.getElementById('bsKennwerte').textContent
    };
  });
  await p.close();
  assert(r.canvasBreite > 0, 'Canvas hat keine Breite');
  assertEqual(r.punkte, 5, 'Punkte');
  assert(/Gesamtausschlag/.test(r.kennwerte), 'Kennwerte fehlen');
  assert(/0[.,]70/.test(r.kennwerte), 'Ausschlag stimmt nicht: ' + r.kennwerte);
});

await test('ohne A5-Haken erscheint die Warnung in der Anzeige', async () => {
  const p = await oeffne();
  const t = await p.page.evaluate(() => {
    for (const [w, v] of [[-25, -0.3], [0, 0], [25, 0.4]]) {
      document.querySelector('[data-field="' + BumpSteer.feldName('LF', w) + '"]').value = String(v);
    }
    bumpsteerZeichnen();
    return document.getElementById('bsBefunde').textContent;
  });
  await p.close();
  assert(/Arretierung/.test(t), 'Die Warnung fehlt in der Anzeige: ' + t);
});

await test('die Seite nennt keinen Zielwert', async () => {
  const p = await oeffne();
  const t = await p.page.evaluate(() => document.body.textContent);
  await p.close();
  assert(/minimiert/.test(t), 'Der Grundsatz steht nicht auf der Seite');
  assert(/nicht belegt/.test(t), 'Der Hinweis auf den unbelegten Richtwert fehlt');
});

await test('ein Messwert meldet sich beim Phasenstatus', async () => {
  const p = await oeffne();
  const r = await p.page.evaluate(() => {
    for (const ph of Recheck.PHASEN) Status.setzen(ph.id, 'done');
    const el = document.querySelector('[data-field="' + BumpSteer.feldName('LF', 12) + '"]');
    el.value = '0.2';
    el.dispatchEvent(new Event('change', { bubbles: true }));
    return {
      journal: Status.journal().length,
      veraltet: Status.uebersicht().filter((x) => x.veraltet).map((x) => x.nr)
    };
  });
  await p.close();
  assertEqual(r.journal, 1, 'Das Feld hat sich nicht gemeldet');
  assert(r.veraltet.includes(10), 'Phase 10 Bump Steer muss veralten');
});

await test('ein Wert ueberlebt das Neuladen', async () => {
  const ctx = await neuerKontext(browser);
  const page = await ctx.newPage();
  await page.goto(base + '/bumpsteer.html');
  await page.waitForTimeout(400);
  await page.evaluate(() => {
    document.querySelectorAll('#bsListe .section-body').forEach((b) => b.classList.remove('collapsed'));
  });

  const feld = '[data-field="' + B.feldName('RF', -12) + '"]';
  await page.fill(feld, '-0.18');
  await page.waitForTimeout(1200);

  await page.reload();
  await page.waitForTimeout(700);
  const v = await page.inputValue(feld);
  await ctx.close();
  assertEqual(v, '-0.18', 'Wert nach dem Neuladen');
});

await test('ein gesetzter Haken ueberlebt das Neuladen', async () => {
  // Kontrollkaestchen werden anders gespeichert als Textfelder - das ist
  // schon einmal auseinandergelaufen.
  const ctx = await neuerKontext(browser);
  const page = await ctx.newPage();
  await page.goto(base + '/bumpsteer.html');
  await page.waitForTimeout(400);
  await page.evaluate(() => {
    document.querySelectorAll('#bsListe .section-body').forEach((b) => b.classList.remove('collapsed'));
  });

  await page.check('[data-field="bs_a5_geprueft"]');
  await page.waitForTimeout(1200);
  await page.reload();
  await page.waitForTimeout(700);
  const an = await page.isChecked('[data-field="bs_a5_geprueft"]');
  await ctx.close();
  assertEqual(an, true, 'Haken nach dem Neuladen');
});

} finally {
  await browser.close();
  server.close();
}

process.exit(summary() === 0 ? 0 : 1);
