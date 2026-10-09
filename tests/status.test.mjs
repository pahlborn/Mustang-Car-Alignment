// Tests fuer status.js - Phasenstatus, Aenderungsjournal und der vierte
// Zustand `veraltet`.
//
// Laeuft ohne Browser. localStorage und Date.now werden nachgebildet, damit
// der Zeitvergleich pruefbar ist: ob eine Aenderung vor oder nach dem
// Abschluss einer Phase liegt, ist die ganze Logik.
//
// Lokal: node tests/status.test.mjs

import fs from 'node:fs';
import path from 'node:path';
import { REPO_ROOT, suite, test, assert, assertEqual, summary } from './helpers.mjs';

// --- Umgebung ---------------------------------------------------------------
let uhr = 1_700_000_000_000;
const echteNow = Date.now;

globalThis.localStorage = {
  _d: {},
  getItem(k) { return Object.prototype.hasOwnProperty.call(this._d, k) ? this._d[k] : null; },
  setItem(k, v) { this._d[k] = String(v); },
  removeItem(k) { delete this._d[k]; },
  clear() { this._d = {}; }
};
// navigator ist in neueren Node-Fassungen nur lesbar - also ueberschreiben
// statt zuweisen. Der Abgleich fragt onLine ab und soll hier nicht laufen.
Object.defineProperty(globalThis, 'navigator', {
  value: { onLine: false }, configurable: true, writable: true
});
Date.now = () => uhr;

function lade(datei) {
  new Function(fs.readFileSync(path.join(REPO_ROOT, datei), 'utf8'))();
}
lade('recheck.js');
lade('status.js');

const R = globalThis.Recheck;
const S = globalThis.Status;

/** Sauberer Anfang vor jedem Test - sonst traegt der vorige seinen Stand weiter. */
function zuruecksetzen() {
  localStorage.clear();
  S._setzeRoh({ version: 1, phasen: {}, journal: {} });
  uhr = 1_700_000_000_000;
}

function allesErledigt() {
  for (const p of R.PHASEN) S.setzen(p.id, 'done');
}

try {

// ---------------------------------------------------------------------------
suite('Die drei Stufen');

await test('der Statusknopf laeuft im Kreis', async () => {
  assertEqual(S.naechste(''), 'wip', 'offen -> in Arbeit');
  assertEqual(S.naechste('wip'), 'done', 'in Arbeit -> erledigt');
  assertEqual(S.naechste('done'), '', 'erledigt -> offen');
});

await test('aeltere Wahrheitswerte werden abgebildet', async () => {
  // Dieselbe Abbildung wie in den Schwesterprojekten - ein Datensatz aus
  // einer frueheren Fassung darf nicht als "offen" wieder auftauchen.
  for (const v of [true, 'true', 'on', 'done']) {
    assertEqual(S.normalisieren(v), 'done', String(v) + ' -> done');
  }
  assertEqual(S.normalisieren('unsinn'), '', 'Unbekanntes gilt als offen');
  assertEqual(S.normalisieren(undefined), '', 'Fehlendes gilt als offen');
});

await test('veraltet ist keine vierte Stufe zum Durchklicken', async () => {
  // Sonst koennte man sie von Hand setzen oder wegklicken, und sie stuende
  // neben dem Journal, aus dem sie sich ergibt.
  assertEqual(S.STUFEN, ['', 'wip', 'done'], 'Stufen');
  assert(!S.STUFEN.includes('veraltet'), 'veraltet steht in den Stufen');
});

// ---------------------------------------------------------------------------
suite('Der Fortschritt ueber die Werkstattphasen');

await test('leerer Stand: nichts erledigt, nicht bereit', async () => {
  zuruecksetzen();
  const f = S.fortschritt();
  assertEqual(f.erledigt, 0, 'erledigt');
  assertEqual(f.offen, 19, 'offen');
  assertEqual(f.prozent, 0, 'Prozent');
  assertEqual(S.rennstreckenbereit().bereit, false, 'bereit');
});

await test('alles erledigt: 100 Prozent und bereit', async () => {
  zuruecksetzen();
  allesErledigt();
  const f = S.fortschritt();
  assertEqual(f.erledigt, 19, 'erledigt');
  assertEqual(f.prozent, 100, 'Prozent');
  assertEqual(S.rennstreckenbereit().bereit, true, 'bereit');
});

await test('in Arbeit zaehlt halb', async () => {
  // Sonst steht der Balken tagelang still, waehrend jemand an einer Phase
  // arbeitet - und ein Balken, der sich nie bewegt, wird nicht angeschaut.
  zuruecksetzen();
  for (const p of R.PHASEN) S.setzen(p.id, 'wip');
  assertEqual(S.fortschritt().prozent, 50, 'Alles in Arbeit ergibt 50 Prozent');
});

// ---------------------------------------------------------------------------
suite('Der Regelkreis, fuer den das Ganze gebaut ist');

await test('Camber verstellt: der Balken faellt zurueck', async () => {
  zuruecksetzen();
  allesErledigt();
  assertEqual(S.fortschritt().prozent, 100, 'Ausgangslage');

  uhr += 60_000;                      // eine Minute spaeter
  S.eintragen('camber', 'Platte 2, LF');

  const f = S.fortschritt();
  assert(f.prozent < 100, 'Der Balken muss zurueckfallen, steht aber auf ' + f.prozent);
  assertEqual(f.veraltet, 3, 'Drei Phasen veraltet');
  assertEqual(S.rennstreckenbereit().bereit, false, 'Nicht mehr bereit');
});

await test('und zwar genau die drei richtigen Phasen', async () => {
  zuruecksetzen();
  allesErledigt();
  uhr += 60_000;
  S.eintragen('camber');

  const alt = S.uebersicht().filter((p) => p.veraltet).map((p) => p.nr);
  assertEqual(alt, [3, 6, 13], 'Veraltete Phasen');

  // Der Punkt der ganzen Uebung: die Hinterachse bleibt unberuehrt. Eine
  // Anzeige, die hier auch Driveline und Full Lock nennt, kostet einen
  // halben Messnachmittag fuer nichts.
  assert(!alt.includes(5), 'Phase 5 Hinterachsreferenz darf nicht veralten');
  assert(!alt.includes(16), 'Phase 16 Driveline darf nicht veralten');
  assert(!alt.includes(17), 'Phase 17 Full Lock darf nicht veralten');
});

await test('nach dem Neumessen ist das Fahrzeug wieder bereit', async () => {
  zuruecksetzen();
  allesErledigt();
  uhr += 60_000;
  S.eintragen('camber');
  assertEqual(S.fortschritt().veraltet, 3, 'Zwischenstand');

  uhr += 60_000;
  for (const nr of [3, 6, 13]) S.setzen('phase' + nr, 'done');

  assertEqual(S.fortschritt().veraltet, 0, 'Nichts mehr veraltet');
  assertEqual(S.rennstreckenbereit().bereit, true, 'Wieder bereit');
});

await test('eine Aenderung in derselben Millisekunde zaehlt', async () => {
  // Date.now() hat Millisekundenaufloesung. Wer 19 Phasen abhakt und direkt
  // danach einen Eingriff eintraegt, erzeugt leicht denselben Zeitstempel -
  // und der Vergleich "liegt die Aenderung nach dem Abschluss" entschied
  // dann gegen die Aenderung. Die Phase blieb gueltig, obwohl sie es nicht
  // war.
  //
  // Gefunden hat das nicht dieser Test, sondern der Browser-Test: dort
  // laeuft beides wirklich in derselben Millisekunde. Hier steht die
  // Pruefung nach, weil sie schneller ist und genauer sagt, worum es geht.
  zuruecksetzen();
  allesErledigt();
  S.eintragen('camber');          // keine Uhr weitergestellt

  assertEqual(S.fortschritt().veraltet, 3,
    'Bei gleichem Zeitstempel wurde die Aenderung verworfen');
});

await test('eine Aenderung VOR dem Abschluss zaehlt nicht', async () => {
  // Wer Camber verstellt und danach das Alignment neu macht, hat die Sache
  // erledigt. Ohne den Zeitvergleich bliebe die Phase fuer immer rot - und
  // damit waere die Anzeige nach dem ersten Eingriff dauerhaft unbrauchbar.
  zuruecksetzen();
  S.eintragen('camber');
  uhr += 60_000;
  allesErledigt();

  assertEqual(S.fortschritt().veraltet, 0, 'Aeltere Aenderung darf nicht nachwirken');
  assertEqual(S.rennstreckenbereit().bereit, true, 'bereit');
});

await test('Reifendruck entwertet nichts', async () => {
  // Der Grund fuer die dritte Spalte in der Matrix. Ohne sie liefe die Kette
  // Reifen -> Ride Height -> Corner Weight -> Alignment durch und machte aus
  // einer Druckkorrektur einen halben Werkstatttag.
  zuruecksetzen();
  allesErledigt();
  uhr += 60_000;
  S.eintragen('reifen_druck');

  assertEqual(S.fortschritt().veraltet, 0, 'Keine Phase veraltet');
  assertEqual(S.rennstreckenbereit().bereit, true, 'Bleibt bereit');

  const mit = S.uebersicht().filter((p) => p.mitmessen).map((p) => p.nr);
  assert(mit.length > 0, 'Aber es gibt Mitmess-Vermerke');
});

await test('Federwechsel entwertet fast alles', async () => {
  // Die Gegenprobe: hier ist die lange Kette richtig.
  zuruecksetzen();
  allesErledigt();
  uhr += 60_000;
  S.eintragen('blattfeder');

  const f = S.fortschritt();
  assert(f.veraltet >= 8, 'Nach einem Federwechsel bleibt wenig gueltig, war ' + f.veraltet);
});

await test('nur Erledigtes kann veralten', async () => {
  // Eine offene Phase ist nicht "veraltet", sie ist offen. Beides zugleich
  // waere in der Anzeige nicht unterscheidbar.
  zuruecksetzen();
  uhr += 60_000;
  S.eintragen('camber');
  assertEqual(S.fortschritt().veraltet, 0, 'Offene Phasen veralten nicht');
});

await test('Phase 9 und 14 veralten nie', async () => {
  // Sie erzeugen keinen eigenen Messwert, koennen also auch keinen verlieren.
  zuruecksetzen();
  allesErledigt();
  uhr += 60_000;
  for (const m of R.MATRIX) S.eintragen(m.groesse);

  for (const id of ['phase9', 'phase14']) {
    assertEqual(S.pruefen(id).veraltet, false, id + ' ist veraltet');
  }
});

// ---------------------------------------------------------------------------
suite('Das Journal');

await test('ein Eintrag taucht auf und laesst sich zuruecknehmen', async () => {
  zuruecksetzen();
  const id = S.eintragen('camber', 'Platte 2');
  assertEqual(S.journal().length, 1, 'Ein Eintrag');
  assertEqual(S.journal()[0].notiz, 'Platte 2', 'Notiz');

  uhr += 1000;
  S.zuruecknehmen(id);
  assertEqual(S.journal().length, 0, 'Kein Eintrag mehr');
});

await test('Zuruecknehmen macht die Phasen wieder gueltig', async () => {
  // Eine Fehleingabe muss sich korrigieren lassen, ohne dass der Balken
  // dauerhaft unten bleibt.
  zuruecksetzen();
  allesErledigt();
  uhr += 60_000;
  const id = S.eintragen('blattfeder');
  assert(S.fortschritt().veraltet > 0, 'Zwischenstand');

  uhr += 1000;
  S.zuruecknehmen(id);
  assertEqual(S.fortschritt().veraltet, 0, 'Nach der Ruecknahme wieder gueltig');
});

await test('ein zurueckgenommener Eintrag bleibt ein Grabstein', async () => {
  // Ohne Grabstein bringt das zweite Geraet ihn zurueck, und die Phase gilt
  // wieder als veraltet, obwohl sie es nicht ist.
  zuruecksetzen();
  const id = S.eintragen('camber');
  uhr += 1000;
  S.zuruecknehmen(id);

  const roh = S._roh();
  assert(roh.journal[id], 'Der Schluessel ist ganz verschwunden');
  assertEqual(roh.journal[id].del, true, 'Kein Grabstein gesetzt');
});

await test('das Journal steht juengste zuerst', async () => {
  zuruecksetzen();
  S.eintragen('camber');
  uhr += 60_000;
  S.eintragen('toe');
  uhr += 60_000;
  S.eintragen('wedge');

  assertEqual(S.journal().map((e) => e.groesse), ['wedge', 'toe', 'camber'], 'Reihenfolge');
});

await test('eine Messreihe erzeugt nicht vierzig Zeilen', async () => {
  // ausFeld() fasst Eintraege derselben Groesse innerhalb einer Minute
  // zusammen. Sonst steht nach dem Ausfuellen eines Messblatts das Journal
  // voll und man findet den einen Eingriff nicht mehr, auf den es ankommt.
  zuruecksetzen();
  for (let i = 0; i < 10; i++) { uhr += 2000; S.ausFeld('camber'); }
  assertEqual(S.journal().length, 1, 'Zusammengefasst');

  uhr += 120_000;                       // zwei Minuten Pause
  S.ausFeld('camber');
  assertEqual(S.journal().length, 2, 'Nach der Pause ein neuer Eintrag');
});

await test('das Zusammenfassen stempelt den Eintrag neu', async () => {
  // Sonst bliebe er auf dem alten Zeitpunkt stehen und eine Phase, die
  // zwischendurch abgeschlossen wurde, bliebe faelschlich gueltig.
  zuruecksetzen();
  S.ausFeld('camber');
  const ersterStand = S.journal()[0].zeit;
  uhr += 5000;
  S.ausFeld('camber');
  assert(S.journal()[0].zeit > ersterStand, 'Zeitstempel wurde nicht erneuert');
});

// ---------------------------------------------------------------------------
suite('Abgleich zwischen Geraeten');

await test('pro Schluessel gewinnt der juengere Eintrag', async () => {
  const a = { phasen: { phase1: { s: 'done', m: 100 } }, journal: {} };
  const b = { phasen: { phase1: { s: '', m: 200 } }, journal: {} };
  assertEqual(S._mischen(a, b).phasen.phase1.s, '', 'Der juengere gewinnt');
  assertEqual(S._mischen(b, a).phasen.phase1.s, '', 'Auch in der anderen Richtung');
});

await test('ein Grabstein ueberlebt den Abgleich', async () => {
  const lokal = { phasen: {}, journal: { c1: { g: 'camber', del: true, m: 200 } } };
  const cloud = { phasen: {}, journal: { c1: { g: 'camber', n: '', m: 100 } } };
  assertEqual(S._mischen(cloud, lokal).journal.c1.del, true,
    'Der geloeschte Eintrag ist zurueckgekommen');
});

await test('beide Seiten behalten ihre eigenen Eintraege', async () => {
  const a = { phasen: {}, journal: { c1: { g: 'camber', m: 100 } } };
  const b = { phasen: {}, journal: { c2: { g: 'toe', m: 100 } } };
  const m = S._mischen(a, b);
  assert(m.journal.c1 && m.journal.c2, 'Ein Eintrag ist verlorengegangen');
});

await test('gespeicherter Stand ueberlebt das Neuladen', async () => {
  zuruecksetzen();
  S.setzen('phase5', 'done');
  const id = S.eintragen('camber', 'Notiz');

  S._setzeRoh({ version: 1, phasen: {}, journal: {} });   // Speicher im Modul leeren
  S._laden();                                            // aus localStorage neu lesen

  assertEqual(S.stufe('phase5'), 'done', 'Phasenstatus');
  assertEqual(S.journal().length, 1, 'Journal');
  assertEqual(S.journal()[0].id, id, 'Journal-ID');
});

} finally {
  Date.now = echteNow;
}

process.exit(summary() === 0 ? 0 : 1);
