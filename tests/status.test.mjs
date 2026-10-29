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
lade('field-sync.js');
lade('bind.js');
lade('status.js');

const R = globalThis.Recheck;
const S = globalThis.Status;
const B = globalThis.Bind;
const F = globalThis.FieldSync;

/**
 * Bind-Messreihe nach 6.1 in den Felddatensatz schreiben. Die Feldnamen
 * kommen aus Bind.feldRadlast(), nicht als Zeichenkette von hier.
 */
function bindReihe(reihen) {
  const d = {};
  reihen.forEach((r, i) => {
    B.RAEDER.forEach((rad, k) => { d[B.feldRadlast(i + 1, rad)] = r[k]; });
  });
  localStorage.setItem(F.STORAGE_KEY, JSON.stringify(d));
}
/** Plus/minus 1 kg je Ecke - bestanden. */
const BIND_SAUBER = [[400, 380, 300, 290], [401, 379, 300, 290], [400, 380, 301, 290]];
/** LF wandert um 20 kg, 1,46 % der Gesamtmasse - Bind. */
const BIND_GEFUNDEN = [[400, 380, 300, 290], [420, 360, 310, 280], [400, 380, 300, 290]];

/** Sauberer Anfang vor jedem Test - sonst traegt der vorige seinen Stand weiter. */
function zuruecksetzen() {
  localStorage.clear();
  S._setzeRoh({ version: 1, phasen: {}, journal: {} });
  uhr = 1_700_000_000_000;
}

/** Alle Phasen erledigt und der Bind-Test bestanden - das ist "alles". */
function allesErledigt() {
  bindReihe(BIND_SAUBER);
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

// ---------------------------------------------------------------------------
suite('Ohne bestandenen Bind-Test ist nichts bereit');

await test('alle Phasen erledigt, Bind-Test nicht erfasst: nicht bereit', async () => {
  // Arbeitsregel 9: kein Test heisst nicht "kein Bind". Ein Setup ohne
  // Test ist nicht fertig, man weiss nur nicht, ob es taugt.
  zuruecksetzen();
  for (const p of R.PHASEN) S.setzen(p.id, 'done');
  const r = S.rennstreckenbereit();
  assertEqual(S.fortschritt().prozent, 100, 'Der Balken zaehlt die Phasen, nicht den Test');
  assertEqual(r.bereit, false, 'bereit ohne Bind-Test');
  assert(r.grund.some((g) => /Bind-Test \(6\.1\) nicht erfasst/.test(g)),
    'Der fehlende Test wird nicht genannt: ' + r.grund.join(', '));
});

await test('alle Phasen erledigt, Bind gefunden: nicht bereit, mit Grund', async () => {
  // Projektregel 6: keine Setup-Schluesse aus Messungen mit bekanntem Bind.
  zuruecksetzen();
  bindReihe(BIND_GEFUNDEN);
  for (const p of R.PHASEN) S.setzen(p.id, 'done');
  const r = S.rennstreckenbereit();
  assertEqual(r.bereit, false, 'bereit trotz Bind');
  assertEqual(r.bind.sperrt, true, 'Der Testfall sperrt nicht');
  assert(r.grund.some((g) => /^Bind-Befund: Radlasten streuen 1\.46 %/.test(g)),
    'Der Bind-Grund fehlt oder ist falsch: ' + r.grund.join(', '));
});

await test('fehlt bind.js, ist das kein Bestehen', async () => {
  // Eine Sicherheitspruefung, die bei fehlender Grundlage durchwinkt, ist
  // keine. Wer bind.js auf einer Seite vergisst, soll "nicht bereit" sehen,
  // nicht "bereit".
  zuruecksetzen();
  allesErledigt();
  const echt = globalThis.Bind;
  delete globalThis.Bind;
  let r;
  try { r = S.rennstreckenbereit(); } finally { globalThis.Bind = echt; }
  assertEqual(r.bereit, false, 'bereit ohne bind.js');
  assert(r.grund.some((g) => /nicht ermittelbar/.test(g)),
    'Der Grund fehlt: ' + r.grund.join(', '));
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
suite('v25: eine spaetere Phase ersetzt eine fruehe');

/**
 * Der Ablauf nach 02_WORKFLOW, Phase 0 bis 18 in Reihenfolge, mit den
 * Eingriffen, die er selbst vorsieht: Shims in Phase 6 und 13, Balance
 * (Ride Height) in Phase 8. Eine Minute zwischen allen Schritten.
 */
function durchlauf({ phase5Bestaetigt }) {
  bindReihe(BIND_SAUBER);
  for (const p of R.PHASEN) {
    uhr += 60_000;
    if (p.nr === 6) S.eintragen('camber', 'Shims, grobes Ausrichten');
    if (p.nr === 8) S.eintragen('ride_height', 'Balance');
    if (p.nr === 9 && phase5Bestaetigt) S.setzen('phase5', 'done');
    if (p.nr === 13) S.eintragen('castor', 'Shims, finales Ausrichten');
    uhr += 60_000;
    S.setzen(p.id, 'done');
  }
}
const veraltetNr = () => S.uebersicht().filter((p) => p.veraltet).map((p) => p.nr);

await test('wer den Ablauf einhaelt, kommt auf 100 Prozent', async () => {
  // Bis v24 standen danach Phase 3 und 6 als veraltet da - ersetzt durch
  // Phase 13, nicht ungueltig (Pruefung aus Mechanikersicht, 2026-10-29).
  zuruecksetzen();
  durchlauf({ phase5Bestaetigt: true });
  assertEqual(veraltetNr(), [], 'Veraltete Phasen');
  assertEqual(S.fortschritt().prozent, 100, 'Prozent');
  assertEqual(S.rennstreckenbereit().bereit, true, 'bereit');
});

await test('ohne erneute Bestaetigung bleibt genau Phase 5 veraltet', async () => {
  // Die Hinterachsreferenz hat keine spaetere Phase mit denselben Groessen.
  // Nach der Balance in Phase 8 muss sie in Phase 9 neu bestaetigt werden.
  zuruecksetzen();
  durchlauf({ phase5Bestaetigt: false });
  assertEqual(veraltetNr(), [5], 'Veraltete Phasen');
});

await test('Camber an der Strecke: 13 neu abhaken ersetzt auch 6', async () => {
  zuruecksetzen();
  durchlauf({ phase5Bestaetigt: true });
  uhr += 60_000;
  S.eintragen('camber', 'Strecke');
  const nachher = veraltetNr();
  assert(nachher.includes(6) && nachher.includes(13), 'Nach der Aenderung: ' + nachher);
  assertEqual(nachher, [3, 6, 13], 'Nach der Aenderung');

  uhr += 60_000;
  S.setzen('phase13', 'done');
  assertEqual(veraltetNr(), [], 'Nach erneutem Abhaken von Phase 13');
});

await test('nur eine SPAETERE Phase ersetzt: 3 und 6 neu abhaken laesst 13 veraltet', async () => {
  // 3 und 6 zusammen liefern alles, was die Aenderung in Phase 13 trifft
  // (Camber, Toe, Lenkungsmitte). Mit nur Phase 6 bliebe 13 schon wegen der
  // Lenkungsmitte veraltet - der Test haette den Fehler nicht unterschieden
  // (Regel 7d; aufgefallen an der gruenen Gegenprobe).
  zuruecksetzen();
  durchlauf({ phase5Bestaetigt: true });
  uhr += 60_000;
  S.eintragen('camber', 'Strecke');
  uhr += 60_000;
  S.setzen('phase3', 'done');
  S.setzen('phase6', 'done');
  assertEqual(veraltetNr(), [13], 'Fruehere Phasen duerfen Phase 13 nicht ersetzen');
});

await test('eine Aenderung NACH der spaeteren Phase macht die fruehe wieder veraltet', async () => {
  // Genau der Fall, den die Abdeckung nicht schlucken darf: Phase 13 gibt
  // es im Ablauf, sie ist erledigt - aber vor der Aenderung.
  zuruecksetzen();
  durchlauf({ phase5Bestaetigt: true });
  uhr += 60_000;
  S.eintragen('castor', 'Shim nach Phase 13');
  const alt = veraltetNr();
  assert(alt.includes(6), 'Phase 6 nicht veraltet: ' + alt);
  assert(alt.includes(13), 'Phase 13 nicht veraltet: ' + alt);
});

await test('dieselbe Millisekunde: die Reihenfolge entscheidet, nicht der Zufall', async () => {
  // Regel 7b. Die Uhr steht still; now() zaehlt hoch.
  for (const zuerst of ['aenderung', 'abhaken']) {
    zuruecksetzen();
    for (const p of R.PHASEN) if (p.nr <= 12) S.setzen(p.id, 'done');
    if (zuerst === 'aenderung') { S.eintragen('castor'); S.setzen('phase13', 'done'); }
    else { S.setzen('phase13', 'done'); S.eintragen('castor'); }
    const sechs = S.pruefen('phase6').veraltet;
    assertEqual(sechs, zuerst === 'abhaken',
      'Phase 6 bei ' + zuerst + ' zuerst: veraltet=' + sechs);
  }
});

await test('wegen nennt nur, was nicht abgedeckt ist', async () => {
  // Ride Height nach Phase 13 und 15: Phase 4 ist ueber Phase 15 ersetzt,
  // Phase 5 nicht. Die Groessen in wegen muessen das widerspiegeln.
  zuruecksetzen();
  for (const p of R.PHASEN) if (p.nr <= 14) S.setzen(p.id, 'done');
  uhr += 60_000;
  S.eintragen('ride_height');
  uhr += 60_000;
  S.setzen('phase15', 'done');
  const vier = S.pruefen('phase4');
  const fuenf = S.pruefen('phase5');
  assertEqual(vier.veraltet, false, 'Phase 4 (durch 15 ersetzt)');
  assertEqual(fuenf.veraltet, true, 'Phase 5');
  const felder = fuenf.wegen.flatMap((w) => w.felder);
  assert(felder.length > 0 && felder.every((g) => R.PHASEN[5].liefert.includes(g)),
    'wegen von Phase 5: ' + felder);
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
