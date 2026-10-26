// Tests fuer abgleich.js - der Ablauf des Geraeteabgleichs, ohne Browser.
//
// Der Gist ist nachgebaut: er zaehlt Lese- und Schreibzugriffe, kann Fehler
// liefern und merkt sich, wie viele Zugriffe gleichzeitig liefen. Die
// Mischregeln selbst sind nicht Gegenstand dieser Datei - sie stehen in
// field-sync.js, status.js, diagnose.js und haben eigene Tests. Hier geht es
// um den Ablauf: lesen vor schreiben, einmal statt dreimal, nichts still.
//
// Lokal: node tests/abgleich.test.mjs

import fs from 'node:fs';
import path from 'node:path';
import { REPO_ROOT, suite, test, assert, assertEqual, summary } from './helpers.mjs';

// --- Umgebung ---------------------------------------------------------------
globalThis.localStorage = {
  _d: {},
  getItem(k) { return Object.prototype.hasOwnProperty.call(this._d, k) ? this._d[k] : null; },
  setItem(k, v) { this._d[k] = String(v); },
  removeItem(k) { delete this._d[k]; },
  clear() { this._d = {}; }
};
Object.defineProperty(globalThis, 'navigator', {
  value: { userAgent: 'Test', onLine: true }, configurable: true, writable: true
});
const dok = new EventTarget();
dok.hidden = false;
globalThis.document = dok;
globalThis.sessionStorage = {
  _d: {},
  getItem(k) { return Object.prototype.hasOwnProperty.call(this._d, k) ? this._d[k] : null; },
  setItem(k, v) { this._d[k] = String(v); }
};
globalThis.APP_VERSION = 'v20';

let verbunden = true;
globalThis.isGistConfigured = () => verbunden;
globalThis.getGistConfig = () => ({ token: 'tok' });
globalThis.FIXED_GIST_ID = 'G1';

const protokoll = [];
globalThis.ErrorLog = { add: (m, d) => protokoll.push({ m, d }) };

// --- Nachgebauter Gist --------------------------------------------------------
const gist = {};
function gistLeeren() {
  gist.files = {}; gist.get = 0; gist.patch = 0; gist.laufend = 0; gist.maxLaufend = 0;
  gist.fehlerGet = null; gist.fehlerPatch = null; gist.letzterPatch = null; gist.raw = {};
  gist.reihenfolge = [];
}
function antwort(status, text) {
  return { ok: status >= 200 && status < 300, status,
           text: async () => text, json: async () => JSON.parse(text) };
}
globalThis.fetch = async (url, opt = {}) => {
  gist.laufend++;
  gist.maxLaufend = Math.max(gist.maxLaufend, gist.laufend);
  await new Promise((r) => setTimeout(r, 5));
  try {
    if (url.startsWith('https://raw.')) return antwort(200, gist.raw[url] || '');
    const methode = opt.method || 'GET';
    gist.reihenfolge.push(methode);
    if (methode === 'GET') {
      gist.get++;
      if (gist.fehlerGet) return antwort(gist.fehlerGet, 'Bad credentials');
      return antwort(200, JSON.stringify({ files: gist.files }));
    }
    gist.patch++;
    gist.letzterPatch = JSON.parse(opt.body);
    if (gist.fehlerPatch) return antwort(gist.fehlerPatch, 'Server Error');
    for (const [name, f] of Object.entries(gist.letzterPatch.files)) {
      gist.files[name] = { filename: name, content: f.content };
    }
    return antwort(200, '{}');
  } finally {
    gist.laufend--;
  }
};

function lade(datei) {
  new Function(fs.readFileSync(path.join(REPO_ROOT, datei), 'utf8'))();
}
lade('field-sync.js');
lade('abgleich.js');
const A = globalThis.Abgleich;
const F = globalThis.FieldSync;

/** Ein Kanal mit Stand im Speicher. mischen: Vereinigung, lokal gewinnt. */
function kanal(datei, start, mischen) {
  const k = {
    datei, stand: start,
    lokal: () => k.stand,
    mischen: mischen || ((c, l) => ({ ...c, ...l })),
    uebernehmen: (d) => { k.stand = d; }
  };
  A.anmelden(k);
  return k;
}

function frisch() {
  A._zuruecksetzen();
  gistLeeren();
  protokoll.length = 0;
  verbunden = true;
  navigator.onLine = true;
}

try {

// ---------------------------------------------------------------------------
suite('Lesen vor Schreiben');

await test('ein Wert, den nur die Cloud hat, geht beim Schreiben nicht verloren', async () => {
  // Das ist der Fehler aus v17: saveData() schrieb den lokalen Stand in den
  // Gist, ohne ihn zu lesen. Geraet B kannte druck_lf nicht - und loeschte ihn
  // damit aus der Cloud.
  frisch();
  const vonA = F.mergeIntoExisting({}, { druck_lf: '2.2' }, { now: 1000 });
  gist.files['m.json'] = { filename: 'm.json', content: JSON.stringify(vonA) };
  const k = kanal('m.json', F.mergeIntoExisting({}, { druck_rf: '2.3' }, { now: 2000 }), F.mergeRecords);

  const r = await A.jetzt();
  const imGist = JSON.parse(gist.files['m.json'].content);
  assert(r.ok, 'Lauf gescheitert: ' + r.fehler);
  assertEqual([imGist.druck_lf, imGist.druck_rf], ['2.2', '2.3'], 'Cloud nach dem Schreiben');
  assertEqual([k.stand.druck_lf, k.stand.druck_rf], ['2.2', '2.3'], 'lokal nach dem Lauf');
  assertEqual(gist.reihenfolge, ['GET', 'PATCH'], 'Reihenfolge der Zugriffe');
});

await test('vorher() sichert offene Eingaben, bevor gelesen wird', async () => {
  frisch();
  const spur = [];
  A.anmelden({
    datei: 'v.json', lokal: () => ({ x: 1 }), mischen: (c, l) => l,
    uebernehmen: () => {}, vorher: () => spur.push('vorher:' + gist.get)
  });
  await A.jetzt();
  assertEqual(spur, ['vorher:0'], 'vorher() lief nicht vor dem Lesen');
});

// ---------------------------------------------------------------------------
suite('Ein Lauf fuer alle Kanaele');

await test('drei Kanaele: ein Lesen, ein Schreiben', async () => {
  // Bis v17 las und schrieb jeder Kanal fuer sich.
  frisch();
  kanal('a.json', { a: 1 }); kanal('b.json', { b: 1 }); kanal('c.json', { c: 1 });
  const r = await A.jetzt();
  assertEqual([gist.get, gist.patch], [1, 1], 'Zugriffe');
  assertEqual(Object.keys(gist.letzterPatch.files).sort(), ['a.json', 'b.json', 'c.json'], 'geschriebene Dateien');
  assertEqual(r.geschrieben.length, 3, 'gemeldete Dateien');
});

await test('was die Cloud schon hat, wird nicht geschrieben', async () => {
  frisch();
  gist.files['a.json'] = { filename: 'a.json', content: JSON.stringify({ a: 1 }) };
  kanal('a.json', { a: 1 });
  kanal('b.json', { b: 2 });
  await A.jetzt();
  assertEqual(Object.keys(gist.letzterPatch.files), ['b.json'], 'nur die geaenderte Datei');

  gistLeeren();
  gist.files['a.json'] = { filename: 'a.json', content: JSON.stringify({ a: 1 }) };
  gist.files['b.json'] = { filename: 'b.json', content: JSON.stringify({ b: 2 }) };
  await A.jetzt();
  assertEqual(gist.patch, 0, 'Geschrieben, obwohl nichts neu war');
});

await test('Verwaltungsangaben allein loesen kein Schreiben aus', async () => {
  // mergeRecords stempelt bei jedem Mischen das Geraeteregister. Zaehlte das
  // als Aenderung, schriebe jeder Fokuswechsel in den Gist.
  frisch();
  const st = F.mergeIntoExisting({}, { x: '1' }, { now: 1000 });
  gist.files['m.json'] = { filename: 'm.json', content: JSON.stringify(st) };
  kanal('m.json', JSON.parse(JSON.stringify(st)), F.mergeRecords);
  const r = await A.jetzt();
  assertEqual([gist.patch, r.geaendert.length], [0, 0], 'Schreiben / Aenderungen');
});

await test('ein leerer Kanal legt keine leere Datei an', async () => {
  frisch();
  kanal('leer.json', { _savedAt: 'x' });
  await A.jetzt();
  assertEqual(gist.patch, 0, 'Leere Datei geschrieben');
});

// ---------------------------------------------------------------------------
suite('Wer etwas erfahren muss, erfaehrt es');

await test('Kanaele mit neuem lokalen Stand werden gemeldet - nur diese', async () => {
  frisch();
  gist.files['neu.json'] = { filename: 'neu.json', content: JSON.stringify({ fremd: 1 }) };
  kanal('neu.json', { eigen: 1 });
  kanal('gleich.json', { g: 1 });
  gist.files['gleich.json'] = { filename: 'gleich.json', content: JSON.stringify({ g: 1 }) };
  let gemeldet = null;
  const hoerer = (e) => { gemeldet = e.detail.kanaele; };
  document.addEventListener('daten-abgeglichen', hoerer);
  await A.jetzt();
  document.removeEventListener('daten-abgeglichen', hoerer);
  assertEqual(gemeldet, ['neu.json'], 'gemeldete Kanaele');
});

await test('ohne Aenderung keine Meldung', async () => {
  frisch();
  gist.files['g.json'] = { filename: 'g.json', content: JSON.stringify({ g: 1 }) };
  kanal('g.json', { g: 1 });
  let gemeldet = false;
  const hoerer = () => { gemeldet = true; };
  document.addEventListener('daten-abgeglichen', hoerer);
  await A.jetzt();
  document.removeEventListener('daten-abgeglichen', hoerer);
  assertEqual(gemeldet, false, 'Meldung ohne Aenderung - jede Seite zeichnete grundlos neu');
});

// ---------------------------------------------------------------------------
suite('Kein Fehler bleibt still');

await test('Lesefehler: nichts geschrieben, Status im Protokoll', async () => {
  // Ohne gelesenen Stand darf nicht geschrieben werden - sonst waere es
  // wieder das Schreiben ohne Lesen.
  frisch();
  gist.fehlerGet = 401;
  kanal('a.json', { a: 1 });
  const r = await A.jetzt();
  assertEqual(r.ok, false, 'Lauf gilt als erfolgreich');
  assertEqual(gist.patch, 0, 'Trotz Lesefehler geschrieben');
  assertEqual(protokoll.length, 1, 'Eintraege im Protokoll');
  assertEqual(protokoll[0].d.status, 401, 'Status im Protokoll');
  assertEqual(A.zustand().stand, 'fehler', 'Zustand');
});

await test('Schreibfehler: Status und Antworttext im Protokoll', async () => {
  // status.js und diagnose.js prueften die Antwort beim Schreiben nicht.
  frisch();
  gist.fehlerPatch = 500;
  kanal('a.json', { a: 1 });
  const r = await A.jetzt();
  assertEqual(r.ok, false, 'Lauf gilt als erfolgreich');
  assertEqual(protokoll.length, 1, 'Eintraege im Protokoll');
  assertEqual([protokoll[0].d.status, protokoll[0].d.antwort], [500, 'Server Error'], 'Detail');
});

await test('eine unlesbare Datei im Gist wird nicht ueberschrieben', async () => {
  // Sonst ersetzte der lokale Stand still, was in der Cloud stand - auch
  // wenn dort nur ein Zeichen kaputt ist.
  frisch();
  gist.files['a.json'] = { filename: 'a.json', content: '{kaputt' };
  kanal('a.json', { a: 1 });
  const r = await A.jetzt();
  assertEqual([r.ok, gist.patch], [false, 0], 'Ergebnis / Schreibzugriffe');
  assert(/unlesbar/.test(protokoll[0].m), 'Protokoll: ' + (protokoll[0] || {}).m);
});

await test('eine gekuerzte Datei wird vollstaendig nachgeladen', async () => {
  // Ab 1 MB liefert die Gist-API nur einen Anfang - der darf nicht gemischt
  // werden.
  frisch();
  gist.files['a.json'] = { filename: 'a.json', content: '{"a":', truncated: true,
                           raw_url: 'https://raw.example/a.json' };
  gist.raw['https://raw.example/a.json'] = JSON.stringify({ a: 1, voll: true });
  const k = kanal('a.json', { b: 2 });
  const r = await A.jetzt();
  assert(r.ok, 'Lauf gescheitert: ' + r.fehler);
  assertEqual(k.stand.voll, true, 'Die volle Fassung wurde nicht gelesen');
});

// ---------------------------------------------------------------------------
suite('Ein Lauf nach dem anderen');

await test('Laeufe ueberlappen nicht, und angeforderte gehen nicht verloren', async () => {
  // Zwei Laeufe nebeneinander lesen denselben Stand und schreiben beide -
  // der zweite ueberschreibt den ersten. Drei Anforderungen waehrend eines
  // Laufs brauchen genau einen Folgelauf, nicht drei.
  frisch();
  const k = kanal('a.json', { n: 0 });
  const p1 = A.jetzt();
  k.stand = { n: 1 }; A.jetzt();
  k.stand = { n: 2 }; A.jetzt();
  k.stand = { n: 3 }; const p4 = A.jetzt();
  await p1; await p4;
  assertEqual(gist.maxLaufend, 1, 'gleichzeitige Zugriffe');
  assertEqual(gist.get, 2, 'Laeufe (einer plus genau ein Folgelauf)');
  assertEqual(JSON.parse(gist.files['a.json'].content).n, 3, 'der letzte Stand ist angekommen');
});

await test('planen() sammelt Eingaben zu einem Lauf', async () => {
  frisch();
  A.BUENDELN_MS = 200;      // im Betrieb 3 s
  kanal('a.json', { a: 1 });
  A.planen(); A.planen(); A.planen();
  await new Promise((r) => setTimeout(r, 600));
  assertEqual(gist.get, 1, 'Laeufe nach dreimal planen()');
});

const warte = (ms) => new Promise((r) => setTimeout(r, ms));

// ---------------------------------------------------------------------------
suite('v20: nicht hochgeladen - vormerken, nachholen, wiederholen');

await test('planen() merkt vor, ein gelungener Lauf loescht das Merkzeichen', async () => {
  frisch();
  A.BUENDELN_MS = 50;
  kanal('a.json', { a: 1 });
  A.planen();
  const vorher = A.ungesendet();
  await warte(300);
  assertEqual([vorher, A.ungesendet(), A.zustand().ungesendet], [true, false, false], 'Merkzeichen vorher / nachher / im Zustand');
});

await test('kommt waehrend eines Laufs Neues dazu, bleibt das Merkzeichen stehen', async () => {
  frisch();
  A.BUENDELN_MS = 10000;
  kanal('a.json', { a: 1 });
  const p = A.hochladen();
  A.planen();                       // Eingabe waehrend des Laufs
  await p;
  assertEqual(A.ungesendet(), true, 'Merkzeichen nach dem Lauf');
  A._zuruecksetzen();
});

await test('nach einem Schreibfehler wird wiederholt, bis es ankommt', async () => {
  // gt40-engine, 2026-10-24: das iPad bekam 409 - und versuchte es nie wieder.
  frisch();
  A.WIEDERHOLEN_MS = [50];
  kanal('a.json', { a: 1 });
  gist.fehlerPatch = 409;
  const r = await A.hochladen();
  gist.fehlerPatch = null;
  await warte(300);
  assertEqual([r.ok, gist.patch >= 2, A.ungesendet()], [false, true, false], 'erster Lauf / wiederholt / Merkzeichen');
  assertEqual(JSON.parse(gist.files['a.json'].content).a, 1, 'Wert im Gist');
});

await test('ohne Liegengebliebenes wird nach einem Fehler nicht wiederholt', async () => {
  frisch();
  A.WIEDERHOLEN_MS = [50];
  kanal('a.json', { a: 1 });
  gist.fehlerGet = 500;
  await A.jetzt();
  await warte(300);
  assertEqual(gist.get, 1, 'Lesezugriffe');
});

await test('bei "zu viele Anfragen" (403) wird fruehestens nach GEBREMST_MS wiederholt', async () => {
  frisch();
  A.WIEDERHOLEN_MS = [20];
  A.GEBREMST_MS = 500;
  kanal('a.json', { a: 1 });
  gist.fehlerPatch = 403;
  await A.hochladen();
  gist.fehlerPatch = null;
  await warte(250);
  const frueh = gist.patch;
  await warte(600);
  assertEqual([frueh, gist.patch >= 2], [1, true], 'Schreibversuche nach 250 ms / spaeter wiederholt');
});

// ---------------------------------------------------------------------------
suite('v20: ein alter Tab schreibt nicht ueber Neueres');

await test('hat eine neuere Version geschrieben: nichts geschrieben, nichts uebernommen, einmal neu laden', async () => {
  // gt40-engine, 2026-10-25, 04:57: ein vergessener Tab mit altem Code
  // schrieb seinen Stand ueber die Werte vom Vorabend.
  frisch();
  sessionStorage._d = {};
  let neu = 0;
  A.neuLaden = () => { neu++; };
  gist.files['a.json'] = { filename: 'a.json', content: JSON.stringify({ x: 'neu', _neuesteVersion: 'v999' }) };
  const k = kanal('a.json', { y: 'lokal' });
  const r = await A.hochladen();
  await A.jetzt();
  await warte(1800);
  assertEqual([r.grund, gist.patch, JSON.stringify(k.stand), neu, A.ungesendet()],
    ['veraltet', 0, JSON.stringify({ y: 'lokal' }), 1, true], 'Grund / Schreibvorgaenge / lokal / neu geladen / Merkzeichen');
});

await test('nach dem Neuladen wird fuer dieselbe Version nicht noch einmal neu geladen', async () => {
  // Ist die ausgelieferte Seite selbst aelter als die Cloud (Version
  // zurueckgenommen, Cache), kaeme sonst nach jedem Neuladen das naechste.
  frisch();
  sessionStorage._d = { abgleich_neugeladen: 'v999' };     // wie nach dem ersten Neuladen
  let neu = 0;
  A.neuLaden = () => { neu++; };
  gist.files['a.json'] = { filename: 'a.json', content: JSON.stringify({ x: 'neu', _neuesteVersion: 'v999' }) };
  kanal('a.json', { y: 'lokal' });
  const r = await A.hochladen();
  await warte(1800);
  assertEqual([r.grund, gist.patch, neu], ['veraltet', 0, 0], 'Grund / Schreibvorgaenge / neu geladen');
});

await test('auf derselben Seite gibt es fuer eine neuere Version genau eine Meldung', async () => {
  frisch();
  sessionStorage._d = {};
  const meldungen = [];
  globalThis.showToast = (m) => meldungen.push(m);
  A.neuLaden = () => {};
  gist.files['a.json'] = { filename: 'a.json', content: JSON.stringify({ x: 'neu', _neuesteVersion: 'v999' }) };
  kanal('a.json', { y: 'lokal' });
  await A.hochladen(); await A.jetzt(); await A.jetzt();
  delete globalThis.showToast;
  assertEqual(meldungen.length, 1, 'Meldungen: ' + meldungen.join(' | '));
});

await test('jeder Schreibvorgang traegt die eigene Version, eine aeltere blockiert nicht', async () => {
  frisch();
  gist.files['a.json'] = { filename: 'a.json', content: JSON.stringify({ x: 'alt', _neuesteVersion: 'v1' }) };
  kanal('a.json', { y: 'lokal' });
  await A.hochladen();
  const c = JSON.parse(gist.files['a.json'].content);
  assertEqual([c._neuesteVersion, c.x, c.y], ['v20', 'alt', 'lokal'], 'Version / fremder Wert / eigener Wert');
});

// ---------------------------------------------------------------------------
suite('v20: zwei Geraete fast gleichzeitig');

await test('die Nachpruefung schreibt nach, was ein anderes Geraet ueberschrieben hat', async () => {
  // Ein Gist kennt kein bedingtes Schreiben: liest B, bevor A geschrieben
  // hat, schreibt B einen Stand ohne A.
  frisch();
  A.NACHPRUEFEN_MS = 100;
  kanal('a.json', { a: 1 });
  await A.hochladen();
  gist.files['a.json'] = { filename: 'a.json', content: JSON.stringify({ b: 2 }) };   // B schreibt ohne A
  await warte(400);
  const c = JSON.parse(gist.files['a.json'].content);
  assertEqual([c.a, c.b], [1, 2], 'Gist nach der Nachpruefung');
});

await test('die Nachpruefung laeuft hoechstens NACHPRUEFEN_MAX-mal in Folge', async () => {
  frisch();
  A.NACHPRUEFEN_MS = 30;
  A.NACHPRUEFEN_MAX = 2;
  const k = kanal('a.json', { n: 0 });
  // Jeder Lauf findet etwas Neues - etwa zwei Geraete mit falscher Uhr.
  k.lokal = () => ({ n: Date.now() });
  await A.hochladen();
  await warte(500);
  assertEqual(gist.patch, 3, 'Schreibvorgaenge (einer plus zwei Nachpruefungen)');
});

// ---------------------------------------------------------------------------
suite('Ohne Verbindung kein Netzzugriff');

await test('nicht verbunden: kein Zugriff, Zustand "lokal"', async () => {
  frisch();
  verbunden = false;
  kanal('a.json', { a: 1 });
  const r = await A.jetzt();
  assertEqual([gist.get, gist.patch, r.grund, A.zustand().stand], [0, 0, 'lokal', 'lokal'], 'Ergebnis');
});

await test('offline: kein Zugriff, kein Fehler im Protokoll', async () => {
  // Ein Funkloch in der Box ist kein Fehler.
  frisch();
  navigator.onLine = false;
  kanal('a.json', { a: 1 });
  const r = await A.jetzt();
  assertEqual([gist.get, r.grund, protokoll.length], [0, 'offline', 0], 'Ergebnis');
});

// ---------------------------------------------------------------------------
suite('Leer ist keine Aenderung');

await test('ein nie ausgefuelltes Feld bekommt keinen Zeitstempel', async () => {
  // Bis v17 stempelte ein frisches Geraet jedes leere Feld mit "jetzt" - und
  // beim Mischen gewann dieses Leer gegen den Wert eines anderen Geraets.
  const vonA = F.mergeIntoExisting({}, { druck_lf: '2.2' }, { now: 1000 });
  const frischesB = F.mergeIntoExisting({}, { druck_lf: '' }, { now: 2000 });
  assertEqual(frischesB._fieldTimes.druck_lf, undefined, 'Zeitstempel fuer ein leeres Feld');
  assertEqual(F.mergeRecords(vonA, frischesB).druck_lf, '2.2', 'Wert nach dem Mischen');
});

await test('ein bewusst geleertes Feld bleibt geleert (Regel 9, 9c)', async () => {
  // Seit v19 mit der Liste der beruehrten Felder - so speichert app.js.
  const vonA = F.mergeIntoExisting({}, { druck_lf: '2.2' }, { now: 1000 });
  const geleert = F.mergeIntoExisting(vonA, { druck_lf: '' }, { now: 2000, beruehrt: { druck_lf: true } });
  assertEqual(geleert._fieldTimes.druck_lf, 2000, 'Zeitstempel des Leerens');
  assertEqual(geleert._geleert.druck_lf, 2000, 'Vermerk des Leerens');
  assertEqual([F.mergeRecords(vonA, geleert).druck_lf, F.mergeRecords(geleert, vonA).druck_lf], ['', ''],
    'Wert nach dem Mischen (lokal geleert / in der Cloud geleert)');
});

await test('ein nur leer angezeigtes Feld loescht nichts (Regel 9c)', async () => {
  // Ein Feld, das erst nach dem Eintragen erzeugt wird, steht leer da, ohne
  // dass jemand es geleert hat (messblatt.js). Bis v18 wurde dieses Leer
  // gestempelt und gewann gegen den Wert.
  const vonA = F.mergeIntoExisting({}, { druck_lf: '2.2' }, { now: 1000 });
  const angezeigt = F.mergeIntoExisting(vonA, { druck_lf: '' }, { now: 2000, beruehrt: {} });
  assertEqual([angezeigt.druck_lf, angezeigt._fieldTimes.druck_lf], ['2.2', 1000], 'Wert / Stempel');
});

await test('ein Leer ohne Vermerk schlaegt keinen Wert, auch wenn es juenger ist (Regel 9c)', async () => {
  // So sieht ein Leer aus, das alter Code oder ein nur angezeigtes Feld
  // gestempelt hat.
  const wert = { druck_lf: '2.2', _fieldTimes: { druck_lf: 1000 } };
  const leer = { druck_lf: '', _fieldTimes: { druck_lf: 2000 } };
  assertEqual([F.mergeRecords(wert, leer).druck_lf, F.mergeRecords(leer, wert).druck_lf], ['2.2', '2.2'], 'Wert nach dem Mischen');
});

await test('ein gestempelter Wert schlaegt Altbestand ohne Stempel', async () => {
  // In gt40-engine gewann bis v107 ein veralteter Stand, der irgendein
  // anderes Feld speicherte, alle Felder ohne Stempel.
  const gestempelt = { druck_lf: '2.2', _fieldTimes: { druck_lf: 1000 }, _savedAt: '2026-10-25T10:00:00Z' };
  const veraltet = { druck_lf: '1.8', x: '1', _fieldTimes: { x: 5000 }, _savedAt: '2026-10-26T10:00:00Z' };
  assertEqual([F.mergeRecords(gestempelt, veraltet).druck_lf, F.mergeRecords(veraltet, gestempelt).druck_lf],
    ['2.2', '2.2'], 'Wert nach dem Mischen');
});

} finally {
  // nichts aufzuraeumen
}

process.exit(summary() === 0 ? 0 : 1);
