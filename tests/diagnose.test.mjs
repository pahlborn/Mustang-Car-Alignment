// Tests fuer diagnose.js - Symptomcodes, Diagnosehierarchie, Change Impact
// Sheet.
//
// Drei Abschriften aus dem Handbuch, alle in beide Richtungen geprueft:
//
//   SYMPTOME + FLAGS  CONVENTIONS.md 18
//   HIERARCHIE        CHAPTER_HANDLING_DIAGNOSIS_DECISION_TREE.md 5
//   MATRIX            CHAPTER_HANDLING_DIAGNOSIS_DECISION_TREE.md 29
//   SHEET             CHAPTER_HANDLING_DIAGNOSIS_DECISION_TREE.md 22
//
// Laeuft ohne Browser.
//
// Lokal: node tests/diagnose.test.mjs

import fs from 'node:fs';
import path from 'node:path';
import { REPO_ROOT, suite, test, assert, assertEqual, summary } from './helpers.mjs';

let uhr = 1_700_000_000_000;
const echteNow = Date.now;

globalThis.localStorage = {
  _d: {},
  getItem(k) { return Object.prototype.hasOwnProperty.call(this._d, k) ? this._d[k] : null; },
  setItem(k, v) { this._d[k] = String(v); },
  removeItem(k) { delete this._d[k]; },
  clear() { this._d = {}; }
};
Object.defineProperty(globalThis, 'navigator', {
  value: { onLine: false }, configurable: true, writable: true
});
Date.now = () => uhr;

new Function(fs.readFileSync(path.join(REPO_ROOT, 'diagnose.js'), 'utf8'))();
const D = globalThis.Diagnose;

const KONV = fs.readFileSync(
  path.join(REPO_ROOT, 'handbuch', 'CONVENTIONS.md'), 'utf8');
const BAUM = fs.readFileSync(
  path.join(REPO_ROOT, 'handbuch', 'CHAPTER_HANDLING_DIAGNOSIS_DECISION_TREE.md'), 'utf8');

function abschnitt(text, von, bis) {
  const a = text.indexOf(von);
  assert(a > -1, 'Abschnitt nicht gefunden: ' + von);
  const b = text.indexOf(bis, a);
  return text.slice(a, b > -1 ? b : undefined);
}

/** Die Zeilen der Entscheidungsmatrix aus Abschnitt 29. */
function matrixZeilen() {
  return abschnitt(BAUM, '## 29. Entscheidungsmatrix', '## 30.')
    .split(/\r?\n/)
    .filter((z) => z.trim().startsWith('|'))
    .map((z) => z.trim().replace(/^\||\|$/g, '').split('|').map((s) => s.trim()))
    .filter((sp) => sp.length === 4 && !/^-+$/.test(sp[0]) && sp[0] !== 'Symptom');
}

function zuruecksetzen() {
  localStorage.clear();
  D._setzeRoh({ version: 1, hypothesen: {} });
  uhr = 1_700_000_000_000;
}

try {

// ---------------------------------------------------------------------------
suite('Symptomcodes stehen nur in CONVENTIONS.md 18');

await test('jeder Code des Handbuchs kommt im Modul vor', async () => {
  // Nur die Zeilen der Aufzaehlung, nicht jeder Grossbuchstabe in
  // Backticks: der Abschnitt erklaert am Ende noch `US` = Understeer und
  // `OS` = Oversteer. Das sind Abkuerzungen in einer Legende, keine Codes -
  // ein Test, der sie mitnimmt, verlangt zwei Symptome, die es nicht gibt.
  const block = abschnitt(KONV, '## 18. Symptomcodes', '## 19.');
  const codes = block.split(/\r?\n/)
    .filter((z) => /^- `[A-Z]/.test(z.trim()))
    .map((z) => z.trim().match(/`([^`]+)`/)[1]);
  assert(codes.length >= 12, 'Nur ' + codes.length + ' Codes gefunden');

  const imModul = D.SYMPTOME.map((s) => s.code).concat(D.FLAGS.map((f) => f.code));
  const fehlend = codes.filter((c) => !imModul.includes(c));
  assertEqual(fehlend, [], 'Im Handbuch, aber nicht im Modul');
});

await test('jeder Code des Moduls kommt im Handbuch vor', async () => {
  // Gegenrichtung: ein erfundener Code waere ein Symptom, das niemand
  // beschlossen hat - und beim Nachlesen nicht auffindbar.
  const block = abschnitt(KONV, '## 18. Symptomcodes', '## 19.');
  const imModul = D.SYMPTOME.map((s) => s.code).concat(D.FLAGS.map((f) => f.code));
  const fehlend = imModul.filter((c) => !block.includes('`' + c + '`'));
  assertEqual(fehlend, [], 'Im Modul, aber nicht im Handbuch');
});

await test('kein Code nennt ein Bauteil', async () => {
  // "Der Code beschreibt das Symptom, nicht dessen Ursache" - CONVENTIONS 18.
  // Ein Code namens CAMBER-PROBLEM waere schon die halbe Diagnose, und zwar
  // eine ungepruefte.
  const bauteile = ['CAMBER', 'TOE', 'CASTOR', 'PANHARD', 'SPRING', 'DAMPER', 'FEDER'];
  const verdaechtig = D.SYMPTOME.map((s) => s.code)
    .filter((c) => bauteile.some((b) => c.includes(b)));
  assertEqual(verdaechtig, [], 'Symptomcode nennt ein Bauteil');
});

// ---------------------------------------------------------------------------
suite('Die Diagnosehierarchie steht nur im Kapitel');

await test('alle fuenf Stufen in der richtigen Reihenfolge', async () => {
  // Die Reihenfolge IST der Inhalt. Wer bei D anfaengt, stellt Geometrie an
  // einem Fahrzeug ein, das vielleicht nur ein ausgeschlagenes Lager hat.
  assertEqual(D.HIERARCHIE.map((h) => h.key), ['A', 'B', 'C', 'D', 'E'], 'Stufen');
});

await test('jede Stufe traegt den Titel aus dem Kapitel', async () => {
  const block = abschnitt(BAUM, '## 5. Diagnosehierarchie', '## 6.');
  const fehlend = D.HIERARCHIE.filter((h) => {
    const titel = h.titel.replace(/ae/g, '\u00e4').replace(/oe/g, '\u00f6').replace(/ue/g, '\u00fc');
    return !block.includes('### ' + h.key + '. ' + h.titel)
        && !block.includes('### ' + h.key + '. ' + titel);
  }).map((h) => h.key + '. ' + h.titel);
  assertEqual(fehlend, [], 'Stufentitel weicht vom Kapitel ab');
});

await test('Geometrie ist Stufe D, nicht frueher', async () => {
  // Das ist der fachliche Kern: Alignment ist im Prioritaetsmodell des
  // Workflows Rang sieben von acht. Wer es auf Stufe A oder B zoege,
  // kehrte die Hierarchie um.
  const d = D.stufe('D');
  assert(/Geometrie/.test(d.titel), 'Stufe D heisst nicht Geometrie');
  for (const g of ['Camber', 'Castor', 'Toe', 'Bump Steer']) {
    assert(d.punkte.includes(g), g + ' fehlt in Stufe D');
  }
  // Und nicht gleichzeitig weiter vorn.
  for (const k of ['A', 'B', 'C']) {
    const s = D.stufe(k);
    assert(!s.punkte.includes('Camber'), 'Camber steht schon in Stufe ' + k);
  }
});

await test('die Stop-Regel haengt an Stufe A', async () => {
  const mitStopp = D.HIERARCHIE.filter((h) => h.stopp).map((h) => h.key);
  assertEqual(mitStopp, ['A'], 'Stop-Regel an der falschen Stufe');
});

// ---------------------------------------------------------------------------
suite('Die Entscheidungsmatrix steht nur im Kapitel');

await test('jede Zeile der Tabelle kommt im Modul vor', async () => {
  const zeilen = matrixZeilen();
  assert(zeilen.length > 0, 'Keine Tabellenzeilen gefunden');

  const fehlend = [];
  for (const [symptom, erst, danach, nicht] of zeilen) {
    const t = D.MATRIX.find((m) => m.zeile === symptom);
    if (!t) { fehlend.push(symptom + ' (fehlt ganz)'); continue; }
    if (t.erst !== erst) fehlend.push(symptom + ' erst: "' + t.erst + '" statt "' + erst + '"');
    if (t.danach !== danach) fehlend.push(symptom + ' danach');
    if (t.nichtSofort !== nicht) fehlend.push(symptom + ' nichtSofort');
  }
  assertEqual(fehlend, [], 'Abweichung zwischen Kapitel und Modul');
});

await test('jeder Moduleintrag kommt in der Tabelle vor', async () => {
  const zeilen = matrixZeilen().map((sp) => sp[0]);
  const fehlend = D.MATRIX.map((m) => m.zeile).filter((z) => !zeilen.includes(z));
  assertEqual(fehlend, [], 'Im Modul, aber nicht in der Tabelle');
});

await test('die Tabelle hat genauso viele Zeilen wie das Modul Eintraege', async () => {
  assertEqual(D.MATRIX.length, matrixZeilen().length, 'Zeilenzahl');
});

await test('jeder Symptomcode findet seine Matrixzeile', async () => {
  // Ein Code ohne Zeile waere ein Knopf, der zu nichts fuehrt.
  const alle = D.SYMPTOME.map((s) => s.code).concat(D.FLAGS.map((f) => f.code));
  const ohne = alle.filter((c) => !D.matrixFuer(c));
  assertEqual(ohne, [], 'Symptomcode ohne Eintrag in der Entscheidungsmatrix');
});

await test('kein Code haengt an zwei Zeilen', async () => {
  const gesehen = {};
  const doppelt = [];
  for (const m of D.MATRIX) {
    for (const c of m.codes) {
      if (gesehen[c]) doppelt.push(c);
      gesehen[c] = true;
    }
  }
  assertEqual(doppelt, [], 'Code in mehreren Matrixzeilen');
});

await test('die Spalte "nicht sofort aendern" ist ueberall gefuellt', async () => {
  // Die wertvollste Spalte: sie nennt den naheliegenden Griff, der die
  // Ursache nur verdeckt.
  const leer = D.MATRIX.filter((m) => !m.nichtSofort || !m.nichtSofort.trim())
    .map((m) => m.zeile);
  assertEqual(leer, [], 'Matrixzeile ohne Warnung');
});

// ---------------------------------------------------------------------------
suite('Das Change Impact Sheet');

await test('jedes Feld des Kapitels kommt im Modul vor', async () => {
  // Nur die Zeilen im Codeblock - der Einleitungssatz "Vor jeder Aenderung:"
  // endet ebenfalls auf einen Doppelpunkt, ist aber kein Feld.
  const block = abschnitt(BAUM, '## 22. Change Impact Sheet', '## 23.');
  const code = block.slice(block.indexOf('```text') + 7, block.lastIndexOf('```'));
  const imKapitel = [...code.matchAll(/^([A-Z][^:\n]*):/gm)].map((m) => m[1].trim());
  assert(imKapitel.length >= 10, 'Nur ' + imKapitel.length + ' Felder gefunden');

  // Umlaute im Kapitel, ae/oe/ue im Modul - beides auf eine Form bringen.
  const norm = (s) => s.toLowerCase()
    .replace(/\u00e4/g, 'ae').replace(/\u00f6/g, 'oe').replace(/\u00fc/g, 'ue')
    .replace(/\u00df/g, 'ss').replace(/[^a-z?]/g, '');
  const imModul = D.SHEET.map((f) => norm(f.label));
  const fehlend = imKapitel.filter((f) => !imModul.includes(norm(f)));
  assertEqual(fehlend, [], 'Feld im Kapitel, aber nicht im Modul');
});

await test('"Messgroesse fuer Erfolg" ist Pflicht', async () => {
  // Ohne sie ist der naechste Stint nicht auswertbar, egal wie er ausgeht.
  assert(D.SHEET.some((f) => f.key === 'messgroesse'), 'Feld fehlt');
  zuruecksetzen();
  const id = D.anlegen('MID-US');
  assert(D.fehlendeFelder(id).includes('messgroesse'),
    'Das Feld wird nicht als fehlend gemeldet');
});

await test('ein leer gelassenes Feld gilt nicht als ausgefuellt', async () => {
  zuruecksetzen();
  const id = D.anlegen('MID-US');
  for (const f of D.SHEET) D.sheetSetzen(id, f.key, '   ');
  assertEqual(D.fehlendeFelder(id).length, D.SHEET.length,
    'Leerzeichen zaehlen als Inhalt');
});

await test('vollstaendig ausgefuellt: keine Luecke mehr', async () => {
  zuruecksetzen();
  const id = D.anlegen('MID-US');
  for (const f of D.SHEET) D.sheetSetzen(id, f.key, 'x');
  assertEqual(D.fehlendeFelder(id), [], 'Es fehlt noch etwas');
});

// ---------------------------------------------------------------------------
suite('Die Hierarchie wird erzwungen, nicht nur beschrieben');

await test('eine frische Hypothese darf nichts aendern', async () => {
  zuruecksetzen();
  const id = D.anlegen('MID-US');
  const r = D.darfAendern(id);
  assertEqual(r.erlaubt, false, 'Aenderung sofort erlaubt');
  assertEqual(r.offen, ['A', 'B', 'C', 'D', 'E'], 'Offene Stufen');
});

await test('Stufen abhaken gibt den Weg schrittweise frei', async () => {
  zuruecksetzen();
  const id = D.anlegen('MID-US');
  D.stufePruefen(id, 'A', true);
  D.stufePruefen(id, 'B', true);
  assertEqual(D.darfAendern(id).offen, ['C', 'D', 'E'], 'Nach A und B');

  for (const k of ['C', 'D', 'E']) D.stufePruefen(id, k, true);
  assertEqual(D.darfAendern(id).erlaubt, true, 'Nach allen Stufen');
});

await test('eine Stufe laesst sich auch wieder oeffnen', async () => {
  // Wer feststellt, dass die Reifenprüfung doch nicht taugte, muss
  // zurueckgehen koennen.
  zuruecksetzen();
  const id = D.anlegen('MID-US');
  for (const k of ['A', 'B', 'C', 'D', 'E']) D.stufePruefen(id, k, true);
  assertEqual(D.darfAendern(id).erlaubt, true, 'Ausgangslage');

  D.stufePruefen(id, 'C', false);
  assertEqual(D.darfAendern(id).erlaubt, false, 'Wieder gesperrt');
  assertEqual(D.darfAendern(id).offen, ['C'], 'Offene Stufe');
});

await test('die Stop-Regel sperrt auch bei vollstaendiger Hierarchie', async () => {
  // Abschnitt 25: bei mechanischem Spiel, Reifenschaden oder nicht
  // reproduzierbaren Messdaten wird nicht weiter getuned. Das steht ueber
  // allem anderen - auch ueber einer sauber abgearbeiteten Hierarchie.
  zuruecksetzen();
  const id = D.anlegen('BUMP-INSTABILITY');
  for (const k of ['A', 'B', 'C', 'D', 'E']) D.stufePruefen(id, k, true);
  assertEqual(D.darfAendern(id).erlaubt, true, 'Ausgangslage');

  D.stoppSetzen(id, true);
  const r = D.darfAendern(id);
  assertEqual(r.erlaubt, false, 'Stop-Regel wirkt nicht');
  assert(/reparieren/.test(r.grund), 'Grund: ' + r.grund);
});

await test('die Stop-Regel laesst sich zuruecknehmen', async () => {
  zuruecksetzen();
  const id = D.anlegen('MID-US');
  for (const k of ['A', 'B', 'C', 'D', 'E']) D.stufePruefen(id, k, true);
  D.stoppSetzen(id, true);
  D.stoppSetzen(id, false);
  assertEqual(D.darfAendern(id).erlaubt, true, 'Nach der Reparatur');
});

// ---------------------------------------------------------------------------
suite('Hypothesen verwalten');

await test('anlegen, finden, verwerfen', async () => {
  zuruecksetzen();
  const id = D.anlegen('ENTRY-OS', ['L/R-ASYMMETRY']);
  assertEqual(D.alle().length, 1, 'Eine Hypothese');
  assertEqual(D.eine(id).code, 'ENTRY-OS', 'Code');
  assertEqual(D.eine(id).flags, ['L/R-ASYMMETRY'], 'Flags');

  uhr += 1000;
  D.verwerfen(id);
  assertEqual(D.alle().length, 0, 'Verworfen');
  assertEqual(D.eine(id), null, 'Nicht mehr auffindbar');
});

await test('eine verworfene Hypothese bleibt ein Grabstein', async () => {
  zuruecksetzen();
  const id = D.anlegen('MID-US');
  uhr += 1000;
  D.verwerfen(id);
  assertEqual(D._roh().hypothesen[id].del, true, 'Kein Grabstein gesetzt');
});

await test('"nicht aussagekraeftig" ist ein gleichwertiges Ergebnis', async () => {
  // 02_WORKFLOW.md 25: "Nicht aussagekraeftig ist ein valides Ergebnis und
  // darf dokumentiert werden." Also ein eigener Knopf, kein Freitext.
  const keys = D.ERGEBNISSE.map((e) => e.key);
  assert(keys.includes('unklar'), 'Ergebnis fehlt');
  assert(keys.includes('besser') && keys.includes('schlechter') && keys.includes('neutral'),
    'Die anderen drei fehlen');

  zuruecksetzen();
  const id = D.anlegen('MID-US');
  D.ergebnisSetzen(id, 'unklar');
  assertEqual(D.eine(id).ergebnis, 'unklar', 'Ergebnis wurde nicht gesetzt');
});

await test('eine abgeschlossene Hypothese verlaesst die offene Liste', async () => {
  zuruecksetzen();
  const a = D.anlegen('MID-US');
  uhr += 1000;
  D.anlegen('ENTRY-OS');
  assertEqual(D.alle(true).length, 2, 'Zwei offene');

  D.ergebnisSetzen(a, 'besser');
  assertEqual(D.alle(true).length, 1, 'Eine offen');
  assertEqual(D.alle().length, 2, 'Beide noch vorhanden');
});

await test('juengste Hypothese zuerst', async () => {
  zuruecksetzen();
  D.anlegen('MID-US');
  uhr += 60_000;
  D.anlegen('ENTRY-OS');
  assertEqual(D.alle().map((h) => h.code), ['ENTRY-OS', 'MID-US'], 'Reihenfolge');
});

await test('gespeicherter Stand ueberlebt das Neuladen', async () => {
  zuruecksetzen();
  const id = D.anlegen('MID-US');
  D.stufePruefen(id, 'A', true);
  D.sheetSetzen(id, 'hypothese', 'Aussenrad verliert Contact Patch');

  D._setzeRoh({ version: 1, hypothesen: {} });
  D._laden();

  const h = D.eine(id);
  assert(h, 'Hypothese ist verschwunden');
  assertEqual(h.geprueft.A, true, 'Stufe A');
  assertEqual(h.sheet.hypothese, 'Aussenrad verliert Contact Patch', 'Sheet-Feld');
});

await test('pro Schluessel gewinnt der juengere Eintrag', async () => {
  const a = { hypothesen: { h1: { code: 'MID-US', m: 100 } } };
  const b = { hypothesen: { h1: { code: 'ENTRY-OS', m: 200 } } };
  assertEqual(D._mischen(a, b).hypothesen.h1.code, 'ENTRY-OS', 'Der juengere gewinnt');
  assertEqual(D._mischen(b, a).hypothesen.h1.code, 'ENTRY-OS', 'Auch andersherum');
});

} finally {
  Date.now = echteNow;
}

process.exit(summary() === 0 ? 0 : 1);
