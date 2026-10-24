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
  kanal('a.json', { a: 1 });
  A.planen(); A.planen(); A.planen();
  await new Promise((r) => setTimeout(r, 1000));
  assertEqual(gist.get, 1, 'Laeufe nach dreimal planen()');
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

await test('ein bewusst geleertes Feld bleibt geleert (Regel 9)', async () => {
  const vonA = F.mergeIntoExisting({}, { druck_lf: '2.2' }, { now: 1000 });
  const geleert = F.mergeIntoExisting(vonA, { druck_lf: '' }, { now: 2000 });
  assertEqual(geleert._fieldTimes.druck_lf, 2000, 'Zeitstempel des Leerens');
  assertEqual(F.mergeRecords(vonA, geleert).druck_lf, '', 'Wert nach dem Mischen');
});

} finally {
  // nichts aufzuraeumen
}

process.exit(summary() === 0 ? 0 : 1);
