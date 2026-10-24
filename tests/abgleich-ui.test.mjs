// Tests fuer den Geraeteabgleich im Browser - mit zwei Geraeten.
//
// Zwei Browserkontexte sind zwei Geraete: jeder hat seinen eigenen
// localStorage. Beide sprechen mit demselben Gist, der hier in Node
// nachgebaut ist (page.route). So laesst sich pruefen, was der Modultest
// nicht sehen kann: ob ein Wert vom iPad auf dem PC ankommt, ob dabei auf
// dem PC nichts verloren geht, und ob die Anzeige nachzieht.
//
// Lokal: node tests/abgleich-ui.test.mjs

import fs from 'node:fs';
import path from 'node:path';
import {
  startServer, REPO_ROOT, browserStarten, neuerKontext,
  suite, test, assert, assertEqual, summary
} from './helpers.mjs';

const { server, base } = await startServer();
const browser = await browserStarten();

const MESS = 'mustang-chassis-setup.json';
const STATUS = 'mustang-chassis-status.json';

// --- Nachgebauter Gist --------------------------------------------------------
let gist = {};
let stoerung = { get: 0, patch: 0 };
const CORS = {
  'access-control-allow-origin': '*',
  'access-control-allow-methods': 'GET, PATCH, OPTIONS',
  'access-control-allow-headers': 'Authorization, Content-Type'
};

async function gistRoute(route) {
  const req = route.request();
  const m = req.method();
  if (m === 'OPTIONS') return route.fulfill({ status: 204, headers: CORS });
  if (m === 'GET') {
    if (stoerung.get) return route.fulfill({ status: stoerung.get, headers: CORS, body: 'nope' });
    return route.fulfill({ status: 200, headers: CORS, contentType: 'application/json',
                           body: JSON.stringify({ files: gist }) });
  }
  if (m === 'PATCH') {
    if (stoerung.patch) return route.fulfill({ status: stoerung.patch, headers: CORS, body: 'Server Error' });
    const b = JSON.parse(req.postData() || '{}');
    for (const [name, f] of Object.entries(b.files || {})) gist[name] = { filename: name, content: f.content };
    return route.fulfill({ status: 200, headers: CORS, contentType: 'application/json', body: '{}' });
  }
  return route.fulfill({ status: 405, headers: CORS });
}

function neuerGist() { gist = {}; stoerung = { get: 0, patch: 0 }; }
function imGist(datei) { return gist[datei] ? JSON.parse(gist[datei].content) : {}; }

/** Ein Geraet: eigener Kontext, mit dem Gist verbunden. */
async function geraet(datei) {
  const ctx = await neuerKontext(browser);
  await ctx.addInitScript(() => {
    localStorage.setItem('gh_token', 'tok');
    localStorage.setItem('chassis_gist_id', 'TESTGIST');
  });
  await ctx.route('https://api.github.com/**', gistRoute);
  const page = await ctx.newPage();
  const fehler = [];
  page.on('pageerror', (e) => fehler.push(e.message));
  await page.goto(base + '/' + datei);
  await bereit(page);
  return { ctx, page, fehler, close: () => ctx.close() };
}

/** Warten, bis der Lauf beim Oeffnen durch ist. */
function bereit(page) {
  return page.waitForFunction(() => {
    const z = window.Abgleich && Abgleich.zustand().stand;
    return z === 'ok' || z === 'fehler';
  }, null, { timeout: 8000 });
}

async function warte(bedingung, ms = 8000) {
  const t0 = Date.now();
  while (Date.now() - t0 < ms) {
    if (await bedingung()) return true;
    await new Promise((r) => setTimeout(r, 100));
  }
  return false;
}

/**
 * Eine Eingabe wie von Hand: Wert setzen, aufsteigendes input-Ereignis.
 * page.fill() geht nicht - die Felder liegen in zugeklappten Abschnitten,
 * und fill() wartet auf Sichtbarkeit. Ohne bubbles sieht der Lauscher am
 * Dokument das Ereignis nie (Regel 7, jerico).
 */
function tippe(page, feld, wert) {
  return page.evaluate(([f, w]) => {
    const el = document.querySelector('[data-field="' + f + '"]');
    el.value = w;
    el.dispatchEvent(new Event('input', { bubbles: true }));
  }, [feld, wert]);
}

/** Zwei Messfelder des Messblatts - aus der Seite, nicht als Zeichenkette hier. */
async function zweiFelder(page) {
  return page.$$eval('#blattListe input[data-field][inputmode="decimal"]',
    (els) => els.slice(0, 2).map((e) => e.dataset.field));
}

try {

// ---------------------------------------------------------------------------
suite('Jede Seite gleicht ab');

await test('abgleich.js steht auf jeder Seite vor status.js', async () => {
  // status.js meldet seinen Kanal beim Laden an. Steht abgleich.js dahinter,
  // gibt es nichts, wobei es sich anmelden koennte - und der Status gleicht
  // still nicht mehr ab.
  const falsch = fs.readdirSync(REPO_ROOT).filter((f) => f.endsWith('.html')).filter((f) => {
    const s = fs.readFileSync(path.join(REPO_ROOT, f), 'utf8');
    const a = s.indexOf('src="abgleich.js"'), b = s.indexOf('src="status.js"');
    return a < 0 || (b > -1 && a > b);
  });
  assertEqual(falsch, [], 'Seiten ohne abgleich.js vor status.js');
});

await test('Messwerte und Status sind ueberall angemeldet, Diagnose auf ihrer Seite', async () => {
  neuerGist();
  const g = await geraet('diagnose.html');
  const diag = await g.page.evaluate(() => Abgleich._kanaele().map((k) => k.datei).sort());
  await g.page.goto(base + '/werkstatt.html');
  await bereit(g.page);
  const werk = await g.page.evaluate(() => Abgleich._kanaele().map((k) => k.datei).sort());
  const fehler = g.fehler.slice();
  await g.close();
  assertEqual(fehler, [], 'Fehler beim Laden');
  assertEqual(diag, ['mustang-chassis-diagnose.json', MESS, STATUS], 'Kanaele auf diagnose.html');
  assertEqual(werk, [MESS, STATUS], 'Kanaele auf werkstatt.html');
});

// ---------------------------------------------------------------------------
suite('Was ein Geraet eintraegt, kommt beim anderen an');

await test('beim Oeffnen stehen die Werte des anderen Geraets im Feld', async () => {
  // Bis v17 nur nach "Jetzt abgleichen".
  neuerGist();
  const a = await geraet('messblatt.html');
  const [f1] = await zweiFelder(a.page);
  await tippe(a.page, f1, '123');
  assert(await warte(() => imGist(MESS)[f1] === '123'), 'Der Wert von A kam nicht im Gist an');
  await a.close();

  const b = await geraet('messblatt.html');
  const wert = await b.page.inputValue('[data-field="' + f1 + '"]');
  await b.close();
  assertEqual(wert, '123', 'Wert auf Geraet B');
});

await test('zwei Geraete, zwei Werte: keiner geht verloren', async () => {
  // DER Fehler aus v17. B ist schon offen, als A schreibt; dann schreibt B.
  // Frueher schrieb B seinen Stand ohne zu lesen - der Wert von A war aus dem
  // Gist verschwunden.
  neuerGist();
  const b = await geraet('messblatt.html');
  const a = await geraet('messblatt.html');
  const [f1, f2] = await zweiFelder(a.page);

  await tippe(a.page, f1, '11');
  assert(await warte(() => imGist(MESS)[f1] === '11'), 'A kam nicht im Gist an');

  await tippe(b.page, f2, '22');
  assert(await warte(() => imGist(MESS)[f2] === '22'), 'B kam nicht im Gist an');
  const cloud = imGist(MESS);
  const beiB = await b.page.inputValue('[data-field="' + f1 + '"]');
  await a.close(); await b.close();

  assertEqual([cloud[f1], cloud[f2]], ['11', '22'], 'Gist nach beiden Eingaben');
  assertEqual(beiB, '11', 'Der Wert von A steht bei B nicht im Feld');
});

await test('ein frisches Geraet loescht nichts', async () => {
  // Bis v17 stempelte ein frisches Geraet jedes leere Feld mit "jetzt", und
  // beim naechsten Mischen gewann dieses Leer gegen die Werte der anderen.
  neuerGist();
  const a = await geraet('messblatt.html');
  const [f1] = await zweiFelder(a.page);
  await tippe(a.page, f1, '7.5');
  assert(await warte(() => imGist(MESS)[f1] === '7.5'), 'A kam nicht im Gist an');
  await a.close();

  // B oeffnet eine Seite ohne dieses Feld, verlaesst sie, oeffnet das Messblatt.
  const b = await geraet('index.html');
  await b.page.goto(base + '/messblatt.html');
  await bereit(b.page);
  await b.page.evaluate(() => syncFromCloud());
  const wert = await b.page.inputValue('[data-field="' + f1 + '"]');
  await b.close();
  assertEqual(imGist(MESS)[f1], '7.5', 'Wert im Gist');
  assertEqual(wert, '7.5', 'Wert auf dem frischen Geraet');
});

await test('Phasenstatus kommt ohne eigene Aenderung an', async () => {
  // Bis v17 holte "Jetzt abgleichen" nur Messwerte; Status kam erst an, wenn
  // man selbst etwas abhakte.
  neuerGist();
  const b = await geraet('index.html');
  const a = await geraet('werkstatt.html');
  await a.page.click('#phasenListe .step-status[data-phase="phase4"]');
  assert(await warte(() => {
    const p = (imGist(STATUS).phasen || {}).phase4;
    return p && p.s === 'wip';
  }), 'Der Status von A kam nicht im Gist an');
  await b.page.evaluate(() => syncFromCloud());
  const t = await b.page.textContent('#overallText');
  await a.close(); await b.close();
  assert(/1 in Arbeit/.test(t), 'Die Uebersicht auf B kennt den Status nicht: ' + t);
});

// ---------------------------------------------------------------------------
suite('Die Anzeige zieht nach');

await test('Bind-Urteil und Schranke folgen dem Abgleich ohne Neuladen', async () => {
  // Bis v17 standen die neuen Werte nach dem Abgleich im Speicher, aber das
  // Urteil zeigte den alten Stand bis zum Neuladen.
  neuerGist();
  const b = await geraet('werkstatt.html');
  const vorher = await b.page.evaluate(() => document.getElementById('bindWarnung').hidden);

  const a = await geraet('bind.html');
  await a.page.evaluate(() => {
    const reihen = [[400, 380, 300, 290], [401, 379, 300, 290], [400, 380, 301, 290]];
    const d = {};
    reihen.forEach((r, i) => Bind.RAEDER.forEach((rad, k) => { d[Bind.feldRadlast(i + 1, rad)] = String(r[k]); }));
    FieldSync.anwenden(d);
    return saveData();
  });
  assert(await warte(() => Object.keys(imGist(MESS)).some((k) => /^bind_cw_3_/.test(k))),
    'Die Bind-Reihe kam nicht im Gist an');

  await b.page.evaluate(() => syncFromCloud());
  const nachher = await b.page.evaluate(() => ({
    warnung: document.getElementById('bindWarnung').hidden,
    schranke: document.getElementById('bindSchranke').textContent
  }));
  await a.close(); await b.close();
  assertEqual(vorher, false, 'Vorher stand kein Hinweis da');
  assertEqual(nachher.warnung, true, 'Die Warnung steht nach dem Abgleich noch');
  assert(/bestanden/.test(nachher.schranke), 'Die Schranke zieht nicht nach: ' + nachher.schranke);
});

// ---------------------------------------------------------------------------
suite('Fehler sind sichtbar');

await test('ein Schreibfehler steht im Protokoll und im Kopf', async () => {
  neuerGist();
  const a = await geraet('messblatt.html');
  const [f1] = await zweiFelder(a.page);
  stoerung.patch = 500;
  await tippe(a.page, f1, '5');
  await a.page.waitForFunction(() => Abgleich.zustand().stand === 'fehler', null, { timeout: 8000 });
  const r = await a.page.evaluate(() => ({
    badge: (document.querySelector('#syncBadge .sync-badge') || {}).textContent || '',
    eintraege: ErrorLog.alle().filter((e) => /Abgleich/.test(e.nachricht || e.msg || e.message || JSON.stringify(e)))
      .map((e) => JSON.stringify(e))
  }));
  await a.close();
  assert(/Sync-Fehler/.test(r.badge), 'Der Kopf zeigt keinen Fehler: ' + r.badge);
  assert(r.eintraege.length >= 1, 'Kein Eintrag im Fehlerprotokoll');
  assert(r.eintraege.some((e) => /500/.test(e)), 'Der Status fehlt im Protokoll: ' + r.eintraege.join(' | '));
});

await test('der Knopf meldet den Fehler, ohne ihn doppelt zu protokollieren', async () => {
  neuerGist();
  const a = await geraet('index.html');
  stoerung.get = 401;
  const r = await a.page.evaluate(async () => {
    const vorher = ErrorLog.alle().length;
    await syncFromCloud();
    const t = document.getElementById('toast');
    return { neu: ErrorLog.alle().length - vorher, toast: t ? t.textContent : '' };
  });
  await a.close();
  assert(/Sync-Fehler/.test(r.toast), 'Keine Meldung beim Knopf: ' + r.toast);
  assertEqual(r.neu, 1, 'Neue Eintraege im Protokoll');
});

} finally {
  await browser.close();
  server.close();
}

process.exit(summary() === 0 ? 0 : 1);
