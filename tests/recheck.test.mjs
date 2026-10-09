// Tests fuer recheck.js - die Abhaengigkeiten zwischen Messgroessen.
//
// Der Kern ist die Bijektion gegen handbuch/02_WORKFLOW.md Abschnitt 27:
// jede Zeile der Markdown-Tabelle kommt in MATRIX vor, und jeder Eintrag in
// MATRIX kommt in der Tabelle vor. Ohne die zweite Richtung koennten die
// Listen gegeneinander verrutschen - genau dafuer gibt es im Schwesterprojekt
// jerico den belege-Mechanismus in reference.js.
//
// Laeuft ohne Browser.
//
// Lokal: node tests/recheck.test.mjs

import fs from 'node:fs';
import path from 'node:path';
import { REPO_ROOT, suite, test, assert, assertEqual, summary } from './helpers.mjs';

// recheck.js ist ein Browser-Modul ohne export. Es haengt sich an globalThis.
const quelle = fs.readFileSync(path.join(REPO_ROOT, 'recheck.js'), 'utf8');
new Function(quelle)();
const R = globalThis.Recheck;

const WORKFLOW = fs.readFileSync(
  path.join(REPO_ROOT, 'handbuch', '02_WORKFLOW.md'), 'utf8');

/** Die Tabellenzeilen aus Abschnitt 27, roh. */
function matrixZeilen() {
  const start = WORKFLOW.indexOf('## 27.');
  assert(start > -1, 'Abschnitt 27 nicht in 02_WORKFLOW.md gefunden');
  const ende = WORKFLOW.indexOf('## 28.', start);
  const block = WORKFLOW.slice(start, ende > -1 ? ende : undefined);

  return block.split(/\r?\n/)
    .filter((z) => z.trim().startsWith('|'))
    .map((z) => z.trim().replace(/^\||\|$/g, '').split('|').map((s) => s.trim()))
    .filter((sp) => sp.length === 3 && !/^-+$/.test(sp[0]) && sp[0] !== 'Änderung');
}

try {

// ---------------------------------------------------------------------------
suite('Die Matrix steht nur an einer Stelle');

await test('jede Zeile der Handbuchtabelle kommt in MATRIX vor', async () => {
  // Richtung 1. Wer eine Zeile im Handbuch ergaenzt und den Code vergisst,
  // bekommt eine Abhaengigkeit, die nie ausgewertet wird.
  const zeilen = matrixZeilen();
  assert(zeilen.length > 0, 'Keine Tabellenzeilen in Abschnitt 27 gefunden');

  const fehlend = [];
  for (const [aenderung, folgt, wirkung] of zeilen) {
    const treffer = R.MATRIX.find(
      (m) => m.zeile === aenderung && m.folgt === folgt && m.wirkung === wirkung);
    if (!treffer) fehlend.push(aenderung + ' -> ' + folgt + ' [' + wirkung + ']');
  }
  assertEqual(fehlend, [], 'Im Handbuch, aber nicht in recheck.js MATRIX');
});

await test('jeder MATRIX-Eintrag kommt in der Handbuchtabelle vor', async () => {
  // Richtung 2. Ohne sie koennte im Code eine Abhaengigkeit stehen, die im
  // Handbuch nie beschlossen wurde - und niemand faende sie beim Nachlesen.
  const zeilen = matrixZeilen();
  const fehlend = [];
  for (const m of R.MATRIX) {
    const treffer = zeilen.find(
      ([a, f, w]) => a === m.zeile && f === m.folgt && w === m.wirkung);
    if (!treffer) fehlend.push(m.zeile + ' -> ' + m.folgt + ' [' + m.wirkung + ']');
  }
  assertEqual(fehlend, [], 'In recheck.js, aber nicht im Handbuch');
});

await test('die Tabelle hat genauso viele Zeilen wie MATRIX Eintraege', async () => {
  // Ohne diese Pruefung koennten beide Richtungen erfuellt sein und trotzdem
  // eine Zeile doppelt stehen.
  assertEqual(R.MATRIX.length, matrixZeilen().length,
    'Anzahl MATRIX-Eintraege und Tabellenzeilen');
});

await test('nur die beiden beschlossenen Wirkungen kommen vor', async () => {
  const unbekannt = [...new Set(R.MATRIX.map((m) => m.wirkung))]
    .filter((w) => w !== 'neu messen' && w !== 'mitmessen');
  assertEqual(unbekannt, [], 'Unbekannte Wirkung in MATRIX');
});

await test('jedes ggf. im Handbuch steht auch als ggf. im Code', async () => {
  // Das vorangestellte "ggf." ist die schwaechste Stufe. Wer es beim
  // Abschreiben uebersieht, macht aus einer Moeglichkeit einen Pruefauftrag.
  const fehlend = [];
  for (const m of R.MATRIX) {
    const imText = m.folgt.includes('ggf.');
    const imCode = m.ggf.length > 0;
    if (imText !== imCode) {
      fehlend.push(m.zeile + ' -> ' + m.folgt + ' (Text: ' + imText + ', Code: ' + imCode + ')');
    }
  }
  assertEqual(fehlend, [], 'ggf. in Text und Code stimmen nicht ueberein');
});

// ---------------------------------------------------------------------------
suite('Die Kaskade');

await test('eine Aenderung erreicht auch mittelbar Betroffenes', async () => {
  // blattfeder -> ride_height -> corner_weight -> alignment -> ...
  // Ohne Kaskade bliebe es bei der ersten Stufe stehen.
  const b = R.betroffen('blattfeder');
  assert(b.neu.includes('ride_height'), 'erste Stufe fehlt: ride_height');
  assert(b.neu.includes('corner_weight'), 'zweite Stufe fehlt: corner_weight');
  assert(b.neu.includes('toe'), 'dritte Stufe fehlt: toe');
  assert(b.neu.includes('steering_center'), 'vierte Stufe fehlt: steering_center');
});

await test('die propagierenden Kanten sind zyklenfrei', async () => {
  // Der Zyklus, um den es ging, war ride_height <-> corner_weight. Seit
  // "Corner Weight -> Ride Height" als mitmessen eingestuft ist, propagiert
  // die Rueckrichtung nicht mehr - der Zyklus ist dadurch verschwunden.
  //
  // Dieser Test haelt das fest. Entsteht spaeter ein neuer Zyklus, laeuft
  // betroffen() nicht etwa falsch, sondern gar nicht mehr zurueck: ein
  // haengender Test sieht aus wie ein langsamer. Lieber hier eine klare
  // Aussage.
  //
  // Der Zyklusschutz in betroffen() bleibt trotzdem drin. Er kostet nichts
  // und ist die Absicherung fuer genau den Fall, den dieser Test meldet.
  const graph = {};
  for (const m of R.MATRIX) {
    if (!graph[m.groesse]) graph[m.groesse] = [];
    for (const z of m.neu) {
      graph[m.groesse].push(...(R.SAMMEL[z] || [z]));
    }
  }

  const grau = new Set(), fertig = new Set(), zyklen = [];
  function lauf(knoten, pfad) {
    if (grau.has(knoten)) {
      zyklen.push(pfad.slice(pfad.indexOf(knoten)).concat(knoten).join(' -> '));
      return;
    }
    if (fertig.has(knoten)) return;
    grau.add(knoten);
    for (const k of (graph[knoten] || [])) lauf(k, pfad.concat(knoten));
    grau.delete(knoten);
    fertig.add(knoten);
  }
  for (const k of Object.keys(graph)) lauf(k, []);

  assertEqual(zyklen, [], 'Zyklus unter den propagierenden Kanten');
});

await test('betroffen() kehrt zurueck und liefert die Kette', async () => {
  const b = R.betroffen('ride_height');
  assert(Array.isArray(b.neu), 'betroffen() ist nicht zurueckgekehrt');
  assert(b.neu.includes('corner_weight'), 'corner_weight fehlt');
});

await test('die geaenderte Groesse steht nicht in ihrer eigenen Liste', async () => {
  // Ueber den Zyklus landet ride_height sonst bei sich selbst - und die
  // Anzeige verlangte, die gerade vorgenommene Aenderung nachzumessen.
  for (const g of ['ride_height', 'corner_weight', 'camber', 'toe']) {
    const b = R.betroffen(g);
    assert(!b.neu.includes(g), g + ' steht in seiner eigenen neu-Liste');
    assert(!b.mit.includes(g), g + ' steht in seiner eigenen mit-Liste');
    assert(!b.ggf.includes(g), g + ' steht in seiner eigenen ggf-Liste');
  }
});

await test('mitmessen pflanzt sich nicht fort', async () => {
  // DAS ist der Grund fuer die dritte Spalte. Reifendruck verschiebt die
  // Fahrhoehe um Millimeter. Liefe das weiter, kaeme ueber
  // ride_height -> corner_weight -> alignment das halbe Setup auf die Liste -
  // und eine Anzeige, die das zweimal behauptet, glaubt niemand mehr.
  const b = R.betroffen('reifen_druck');
  assertEqual(b.neu, [], 'Reifendruck entwertet nichts');
  assert(b.mit.includes('ride_height'), 'ride_height fehlt bei mitmessen');
  assert(!b.mit.includes('corner_weight'),
    'corner_weight ist ueber die Kette hereingerutscht');
  assert(!b.neu.includes('toe'), 'toe ist ueber die Kette hereingerutscht');

  const p = R.phasenNach('reifen_druck');
  assertEqual(p.veraltet, [], 'Eine Druckkorrektur entwertet keine Phase');
  assert(p.mitmessen.length > 0, 'Aber sie erzeugt Mitmess-Vermerke');
});

await test('ggf. pflanzt sich ebenfalls nicht fort', async () => {
  // camber -> ggf. radlasten. Wuerde das weiterlaufen, erzeugte eine
  // Moeglichkeit eine Kette von Gewissheiten.
  const b = R.betroffen('camber');
  assert(b.ggf.includes('radlasten'), 'radlasten fehlt bei ggf');
  assert(!b.neu.includes('arb_preload'),
    'arb_preload ist ueber die ggf-Kante hereingerutscht');
});

await test('die staerkere Stufe gewinnt', async () => {
  // Eine Groesse, die neu zu messen ist, braucht keinen zusaetzlichen
  // Mitmess- oder ggf-Vermerk - sonst stuende sie zweimal in der Anzeige.
  for (const g of R.MATRIX.map((m) => m.groesse)) {
    const b = R.betroffen(g);
    const doppelt = b.mit.filter((x) => b.neu.includes(x))
      .concat(b.ggf.filter((x) => b.neu.includes(x)));
    assertEqual(doppelt, [], g + ': Groesse steht in zwei Stufen gleichzeitig');
  }
});

await test('Sammelbegriffe werden aufgeloest', async () => {
  // Die Matrix schreibt "Alignment". Als Einzelgroesse waere das ein Blatt,
  // an dem die Kaskade endet - und Castor, Camber und Toe blieben unberuehrt.
  const b = R.betroffen('corner_weight');
  for (const g of R.SAMMEL.alignment) {
    assert(b.neu.includes(g), 'Alignment nicht aufgeloest, ' + g + ' fehlt');
  }
  assert(!b.neu.includes('alignment'), 'Sammelbegriff steht noch als Groesse da');
});

// ---------------------------------------------------------------------------
suite('Phasen');

await test('alle 19 Phasen sind erfasst, 0 bis 18', async () => {
  assertEqual(R.PHASEN.length, 19, 'Anzahl Phasen');
  assertEqual(R.PHASEN.map((p) => p.nr), [...Array(19).keys()], 'Phasennummern');
});

await test('jede Phase hat eine eindeutige Kennung', async () => {
  const ids = R.PHASEN.map((p) => p.id);
  const doppelt = ids.filter((x, i) => ids.indexOf(x) !== i);
  assertEqual(doppelt, [], 'Doppelte Phasenkennung');
});

await test('jede Phase kommt in 02_WORKFLOW.md vor', async () => {
  // Die Titel sind verkuerzt; geprueft wird die Phasennummer in einer
  // Ueberschrift - "## 13. Phase 10 - Bump Steer".
  const fehlend = R.PHASEN
    .filter((p) => !new RegExp('^## \\d+\\. Phase ' + p.nr + ' ', 'm').test(WORKFLOW))
    .map((p) => 'Phase ' + p.nr);
  assertEqual(fehlend, [], 'Phase ohne Abschnitt im Workflow');
});

await test('Phase 9 und 14 liefern nichts und koennen nie veralten', async () => {
  // Phase 9 ist eine Pruefschleife - und zwar genau diese Matrix in Prosa.
  // Phase 14 ist die Settling-Prozedur. Beide erzeugen keinen eigenen
  // Messwert, koennen also auch keinen verlieren. Im Fortschrittsbalken
  // zaehlen sie trotzdem mit.
  assertEqual(R.phase('phase9').liefert, [], 'Phase 9 liefert etwas');
  assertEqual(R.phase('phase14').liefert, [], 'Phase 14 liefert etwas');

  for (const g of R.MATRIX.map((m) => m.groesse)) {
    const p = R.phasenNach(g);
    const alle = [...p.veraltet, ...p.mitmessen, ...p.hinweis].map((x) => x.id);
    assert(!alle.includes('phase9'), 'Phase 9 taucht nach ' + g + ' auf');
    assert(!alle.includes('phase14'), 'Phase 14 taucht nach ' + g + ' auf');
  }
});

await test('jede andere Phase legt mindestens eine Groesse fest', async () => {
  const leer = R.PHASEN
    .filter((p) => p.nr !== 9 && p.nr !== 14 && !p.liefert.length)
    .map((p) => 'Phase ' + p.nr);
  assertEqual(leer, [], 'Phase ohne Messgroesse');
});

await test('eine Phase steht in hoechstens einer Ergebnisliste', async () => {
  for (const g of R.MATRIX.map((m) => m.groesse)) {
    const p = R.phasenNach(g);
    const alle = [...p.veraltet, ...p.mitmessen, ...p.hinweis].map((x) => x.id);
    const doppelt = alle.filter((x, i) => alle.indexOf(x) !== i);
    assertEqual(doppelt, [], g + ': Phase in mehreren Listen');
  }
});

// ---------------------------------------------------------------------------
suite('Der Anwendungsfall, fuer den das Modul gebaut wurde');

await test('Camber nachgestellt: Toe und Final Alignment werden veraltet', async () => {
  // Reifentemperatur auf der Strecke gemessen, Camber passt nicht, Camber
  // wird nachgestellt. Was ist danach noch gueltig?
  const p = R.phasenNach('camber');
  const veraltet = p.veraltet.map((x) => x.nr);

  assert(veraltet.includes(13), 'Phase 13 Final Front Alignment muss veralten');
  assert(veraltet.includes(6), 'Phase 6 Initial Front Alignment muss veralten');

  // Und das ist der Punkt: die Hinterachse bleibt unberuehrt. Eine Anzeige,
  // die hier auch Driveline und Full Lock aufzaehlt, kostet einen halben
  // Messnachmittag fuer nichts.
  assert(!veraltet.includes(16), 'Phase 16 Driveline darf nicht veralten');
  assert(!veraltet.includes(17), 'Phase 17 Full Lock darf nicht veralten');
  assert(!veraltet.includes(5), 'Phase 5 Hinterachsreferenz darf nicht veralten');

  // Radlasten stehen als "ggf." in der Matrix - Hinweis, kein Pruefauftrag.
  const hinweis = p.hinweis.map((x) => x.nr);
  assert(hinweis.includes(15), 'Phase 15 Final Scaling als Hinweis erwartet');
});

await test('Blattfeder getauscht: fast alles muss neu', async () => {
  // Die Gegenprobe zum Camber-Fall. Hier ist die lange Kette richtig.
  const veraltet = R.phasenNach('blattfeder').veraltet.map((x) => x.nr);
  for (const nr of [4, 5, 7, 13, 15, 16]) {
    assert(veraltet.includes(nr), 'Phase ' + nr + ' muss nach Federwechsel veralten');
  }
});

await test('Wedge korrigiert: nur die Driveline', async () => {
  const p = R.phasenNach('wedge');
  assertEqual(p.veraltet.map((x) => x.nr), [16],
    'Wedge beruehrt ausschliesslich Phase 16');
});

await test('jede Groesse der Matrix hat eine Wirkung auf mindestens eine Phase', async () => {
  // Eine Abhaengigkeit, die nirgends ankommt, ist tote Buchfuehrung. Entweder
  // fehlt die Groesse in PHASE_LIEFERT, oder die Zeile ist ueberfluessig.
  const ohne = [];
  for (const g of [...new Set(R.MATRIX.map((m) => m.groesse))]) {
    const p = R.phasenNach(g);
    if (!p.veraltet.length && !p.mitmessen.length && !p.hinweis.length) ohne.push(g);
  }
  assertEqual(ohne, [], 'Matrix-Groesse ohne Wirkung auf eine Phase');
});

} finally {
  // kein Server, kein Browser
}

process.exit(summary() === 0 ? 0 : 1);
