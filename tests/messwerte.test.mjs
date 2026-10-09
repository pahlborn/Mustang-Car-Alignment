// Tests fuer messwerte.js - Feldregistry und die Formeln darauf.
//
// Die Formeln stehen in CONVENTIONS.md, Abschnitt 7, 9 und 11. Hier wird
// geprueft, dass der Code sie einhaelt - und dass die Felder zu dem passen,
// was die Templates verlangen.
//
// Laeuft ohne Browser.
//
// Lokal: node tests/messwerte.test.mjs

import fs from 'node:fs';
import path from 'node:path';
import { REPO_ROOT, suite, test, assert, assertEqual, summary } from './helpers.mjs';

new Function(fs.readFileSync(path.join(REPO_ROOT, 'recheck.js'), 'utf8'))();
new Function(fs.readFileSync(path.join(REPO_ROOT, 'messwerte.js'), 'utf8'))();
const M = globalThis.Messwerte;
const R = globalThis.Recheck;

const KONV = fs.readFileSync(path.join(REPO_ROOT, 'handbuch', 'CONVENTIONS.md'), 'utf8');

/** Zahlenvergleich mit Toleranz - Gleitkomma. */
function nahe(a, b, eps = 1e-9) {
  assert(a !== null && a !== undefined, 'Ergebnis ist null');
  assert(Math.abs(a - b) < eps, 'erwartet ' + b + ', war ' + a);
}

try {

// ---------------------------------------------------------------------------
suite('Die Felder');

await test('jedes Feld hat eine eindeutige Kennung', async () => {
  const ids = M.FELDER.map((f) => f.id);
  const doppelt = ids.filter((x, i) => ids.indexOf(x) !== i);
  assertEqual(doppelt, [], 'Doppelte Feldkennung');
});

await test('jedes Feld ist entweder Stellgroesse oder Messgroesse', async () => {
  // Das Alignment Sheet trennt sie ausdruecklich: Stellgroessen beschreiben
  // den Zustand der Hardware, Messgroessen das Ergebnis. Wer beides
  // vermischt, schreibt einen Sollwert in ein Feld fuer einen Istwert.
  const falsch = M.FELDER.filter((f) => f.art !== 'stell' && f.art !== 'mess')
    .map((f) => f.id);
  assertEqual(falsch, [], 'Feld ohne gueltige Art');
});

await test('jede data-groesse kennt recheck.js', async () => {
  // Ein Feld, das eine erfundene Groesse meldet, entwertet nichts - die
  // Meldung verpufft, und niemand merkt es.
  const bekannt = R.alleGroessen();
  const unbekannt = [...new Set(M.FELDER.filter((f) => f.groesse).map((f) => f.groesse))]
    .filter((g) => !bekannt.includes(g));
  assertEqual(unbekannt, [], 'Feld meldet eine Groesse, die recheck.js nicht kennt');
});

await test('jede Validierungsregel ist eine, die validation.js versteht', async () => {
  const quelle = fs.readFileSync(path.join(REPO_ROOT, 'validation.js'), 'utf8');
  const falsch = M.FELDER.filter((f) => f.regel)
    .filter((f) => {
      const art = f.regel.split(':')[0];
      return !quelle.includes("'" + art + "'") && !quelle.includes('"' + art + '"');
    })
    .map((f) => f.id + ': ' + f.regel);
  assertEqual(falsch, [], 'Unbekannte Validierungsregel');
});

await test('die vier Radpositionen entsprechen den Konventionen', async () => {
  assertEqual(M.RAEDER, ['LF', 'RF', 'LR', 'RR'], 'Radpositionen');
  for (const r of M.RAEDER) {
    assert(KONV.includes('`' + r + '`') || KONV.includes(r),
      'Radposition ' + r + ' steht nicht in CONVENTIONS.md');
  }
});

await test('Messgroessen tragen ihr Messmittel', async () => {
  // "Kein Sollwert ohne Quelle" gilt auch rueckwaerts: wer einen Wert
  // eintraegt, muss wissen, womit er gemessen wurde. Sonst sind zwei
  // Messreihen nicht vergleichbar.
  const ohne = M.FELDER
    .filter((f) => f.art === 'mess' && ['alignment', 'radlast', 'pyrometer'].includes(f.gruppe))
    .filter((f) => !f.messmittel)
    .map((f) => f.id);
  assertEqual(ohne, [], 'Messfeld ohne Messmittel');
});

await test('die Vorderachs-Stellgroessen decken die vorhandene Hardware ab', async () => {
  // Nur was es am Fahrzeug gibt - AGENTS Regel 6. Vier Griffe nennt das
  // Alignment Sheet: UCA-Heimgelenke, UCA-Shims, LCA Camber Kit, Strut Rods.
  const ids = M.gruppe('stell').map((f) => f.id);
  for (const teil of ['uca_vorn', 'uca_hinten', 'shim_vorn', 'shim_hinten',
                      'lca_platte', 'strut']) {
    assert(ids.some((i) => i.includes(teil)), 'Stellgroesse fehlt: ' + teil);
  }
  // Und beide Seiten, sonst liesse sich keine Symmetrie pruefen.
  for (const r of ['lf', 'rf']) {
    assert(ids.some((i) => i.endsWith('_' + r)), 'Seite fehlt: ' + r);
  }
});

await test('keine Stellgroesse traegt einen Vorgabewert', async () => {
  // Die Baseline hat keine belegte Herkunft. Sie als Vorgabe einzutragen
  // hiesse, eine ungepruefte Zahl zur Referenz zu machen - AGENTS Regel 5.
  const mitVorgabe = M.FELDER.filter((f) => f.vorgabe !== undefined || f.standard !== undefined)
    .map((f) => f.id);
  assertEqual(mitVorgabe, [], 'Feld mit Vorgabewert');
});

// ---------------------------------------------------------------------------
suite('Toe - CONVENTIONS 7 und 9');

await test('Total Toe = R minus F', async () => {
  nahe(M.totalToe(1450, 1453), 3);
  nahe(M.totalToe(1453, 1450), -3);
  nahe(M.totalToe(1450, 1450), 0);
});

await test('positiv ist Toe-in', async () => {
  // CONVENTIONS 7. Das Vorzeichen falsch herum waere nicht etwa ungenau,
  // sondern das Gegenteil - und am Fahrzeug sofort spuerbar.
  assert(M.totalToe(1450, 1453) > 0, 'Hinten weiter = Toe-in = positiv');
});

await test('der Winkel folgt a = atan(delta / D)', async () => {
  const d = M.toeGrad(3, 381);
  nahe(d, Math.atan(3 / 381) * 180 / Math.PI, 1e-12);
  nahe(d, 0.45116, 1e-4);
});

await test('ohne Messbasis kein Winkel', async () => {
  // CONVENTIONS 9: "Keine Winkelumrechnung ohne definierte Geometrie."
  // Ein Naeherungswert ohne D waere geraten.
  assertEqual(M.toeGrad(3, ''), null, 'Leere Messbasis');
  assertEqual(M.toeGrad(3, 0), null, 'Messbasis null');
  assertEqual(M.toeGrad(3, -1), null, 'Negative Messbasis');
  assertEqual(M.toeGrad('', 381), null, 'Kein Toe-Wert');
});

await test('die Kleinwinkelnaeherung stimmt mit dem Arcustangens ueberein', async () => {
  // CONVENTIONS 9 nennt beide. Bei praxisueblichen Werten duerfen sie nicht
  // nennenswert auseinanderlaufen - sonst waere eine der beiden falsch
  // notiert.
  for (const mm of [0.5, 1, 2, 3, 5]) {
    const exakt = M.toeGrad(mm, 381);
    const naeh = (mm / 381) * 57.3;
    assert(Math.abs(exakt - naeh) < 0.002,
      mm + ' mm: exakt ' + exakt + ' vs. genaehert ' + naeh);
  }
});

// ---------------------------------------------------------------------------
suite('Radlasten - CONVENTIONS 11');

await test('alle sechs Prozentangaben', async () => {
  const r = M.radlasten({ LF: 310, RF: 305, LR: 290, RR: 295 });
  nahe(r.total, 1200);
  nahe(r.front, (310 + 305) / 1200 * 100);
  nahe(r.rear, (290 + 295) / 1200 * 100);
  nahe(r.links, (310 + 290) / 1200 * 100);
  nahe(r.rechts, (305 + 295) / 1200 * 100);
  nahe(r.cross, (305 + 290) / 1200 * 100);
  nahe(r.gegenCross, (310 + 295) / 1200 * 100);
});

await test('Cross ist RF plus LR, nicht LF plus RR', async () => {
  // Die Verwechslung waere nicht auffaellig - beide liegen nah beieinander -
  // und wuerde jede Diagonalbetrachtung umkehren.
  //
  // Die Zahlen muessen so gewaehlt sein, dass sich die beiden Diagonalen
  // unterscheiden. Der erste Anlauf nahm 400/300/300/200: beide Summen
  // ergeben 600, und der Test haette eine Vertauschung durchgelassen. Die
  // letzte Assertion haelt genau das fest.
  const r = M.radlasten({ LF: 400, RF: 350, LR: 300, RR: 200 });
  nahe(r.cross, (350 + 300) / 1250 * 100);
  nahe(r.gegenCross, (400 + 200) / 1250 * 100);
  assert(r.cross !== r.gegenCross, 'Testfall unterscheidet die beiden nicht');
});

await test('Front plus Rear ergibt hundert Prozent', async () => {
  const r = M.radlasten({ LF: 317, RF: 298, LR: 281, RR: 304 });
  nahe(r.front + r.rear, 100, 1e-9);
  nahe(r.links + r.rechts, 100, 1e-9);
  nahe(r.cross + r.gegenCross, 100, 1e-9);
});

await test('ein perfekt symmetrisches Fahrzeug hat 50 Prozent Cross', async () => {
  const r = M.radlasten({ LF: 300, RF: 300, LR: 300, RR: 300 });
  nahe(r.cross, 50);
});

await test('eine fehlende Radlast ergibt kein Ergebnis', async () => {
  // Drei von vier Werten ergeben keine sinnvolle Summe. Lieber nichts als
  // eine Zahl, die aussieht, als sei sie vollstaendig.
  assertEqual(M.radlasten({ LF: 310, RF: 305, LR: 290, RR: '' }), null, 'Ein Wert fehlt');
  assertEqual(M.radlasten({ LF: 0, RF: 0, LR: 0, RR: 0 }), null, 'Alles null');
});

await test('Komma und Punkt sind beide zulaessig', async () => {
  // Auf einem deutschen Telefon tippt man ein Komma.
  nahe(M.zahl('2,5'), 2.5);
  nahe(M.zahl('2.5'), 2.5);
  const r = M.radlasten({ LF: '310,5', RF: 305, LR: 290, RR: 295 });
  nahe(r.total, 1200.5);
});

// ---------------------------------------------------------------------------
suite('Differenz und Spanne');

await test('die L/R-Differenz ist links minus rechts', async () => {
  nahe(M.differenz(-2.1, -1.9), -0.2);
  assertEqual(M.differenz('', 2), null, 'Ein Wert fehlt');
});

await test('die Spanne zeigt, ob die Messung reproduzierbar war', async () => {
  // Das Scale Sheet verlangt drei Durchgaenge mit Spalte "max - min". Eine
  // grosse Spanne heisst: der Mittelwert hat keine Aussage.
  nahe(M.spanne([310, 312, 309]), 3);
  nahe(M.spanne(['310', '312,5', '309']), 3.5);
  assertEqual(M.spanne([310]), null, 'Ein einzelner Wert hat keine Spanne');
  assertEqual(M.spanne(['', '']), null, 'Leere Werte');
});

// ---------------------------------------------------------------------------
suite('Pyrometer - zwei Fragen, nicht eine');

await test('Camber-Gefaelle und Druck-Woelbung werden getrennt ausgewiesen', async () => {
  // CHAPTER_TIRE_MECHANICS 287: die drei Punkte beantworten zwei
  // verschiedene Fragen, die nicht vermischt werden duerfen. Eine einzelne
  // Kennzahl waere schon die halbe Diagnose, und zwar eine ungepruefte.
  const t = M.reifentemperatur(82, 76, 68);
  nahe(t.camberGefaelle, 14);
  nahe(t.druckWoelbung, 76 - 75);
  nahe(t.mittel, (82 + 76 + 68) / 3);
});

await test('gleichmaessige Temperatur ergibt beide Kennzahlen null', async () => {
  const t = M.reifentemperatur(75, 75, 75);
  nahe(t.camberGefaelle, 0);
  nahe(t.druckWoelbung, 0);
});

await test('zu hoher Druck zeigt sich als Woelbung, nicht als Gefaelle', async () => {
  // Mitte heiss, Schultern kuehl - das ist Druck, nicht Camber.
  const t = M.reifentemperatur(70, 85, 70);
  nahe(t.camberGefaelle, 0, 1e-9);
  assert(t.druckWoelbung > 10, 'Woelbung nicht erkannt: ' + t.druckWoelbung);
});

await test('zu viel Camber zeigt sich als Gefaelle, nicht als Woelbung', async () => {
  const t = M.reifentemperatur(90, 80, 70);
  nahe(t.camberGefaelle, 20);
  nahe(t.druckWoelbung, 0, 1e-9);
});

await test('ein fehlender Messpunkt ergibt kein Ergebnis', async () => {
  assertEqual(M.reifentemperatur(82, 76, ''), null, 'Aussen fehlt');
});

} finally {
  // kein Server, kein Browser
}

process.exit(summary() === 0 ? 0 : 1);
