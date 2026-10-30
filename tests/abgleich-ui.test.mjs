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
const PROTOKOLL = 'mustang-chassis-setup-errors.json';

// --- Nachgebauter Gist --------------------------------------------------------
let gist = {};
let stoerung = { get: 0, patch: 0 };
let verzoegerung = { get: 0 };      // Antwortzeit beim Lesen, fuer Eingaben waehrend eines Laufs
let schreibvorgaenge = [];          // Dateinamen je PATCH
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
    if (verzoegerung.get) await new Promise((r) => setTimeout(r, verzoegerung.get));
    if (stoerung.get) return route.fulfill({ status: stoerung.get, headers: CORS, body: 'nope' });
    return route.fulfill({ status: 200, headers: CORS, contentType: 'application/json',
                           body: JSON.stringify({ files: gist }) });
  }
  if (m === 'PATCH') {
    if (stoerung.patch) return route.fulfill({ status: stoerung.patch, headers: CORS, body: 'Server Error' });
    const b = JSON.parse(req.postData() || '{}');
    schreibvorgaenge.push(Object.keys(b.files || {}));
    for (const [name, f] of Object.entries(b.files || {})) gist[name] = { filename: name, content: f.content };
    return route.fulfill({ status: 200, headers: CORS, contentType: 'application/json', body: '{}' });
  }
  return route.fulfill({ status: 405, headers: CORS });
}

function neuerGist() { gist = {}; stoerung = { get: 0, patch: 0 }; verzoegerung = { get: 0 }; schreibvorgaenge = []; }
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
  // Seit v21 ist auch das Fehlerprotokoll ein Kanal.
  assertEqual(diag, ['mustang-chassis-diagnose.json', PROTOKOLL, MESS, STATUS], 'Kanaele auf diagnose.html');
  assertEqual(werk, [PROTOKOLL, MESS, STATUS], 'Kanaele auf werkstatt.html');
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

// ---------------------------------------------------------------------------
suite('v19: Leeren, Eingaben waehrend eines Laufs, Import');

await test('ein bewusst geleertes Feld bleibt leer und kommt so beim anderen Geraet an', async () => {
  neuerGist();
  const a = await geraet('messblatt.html');
  const [f1] = await zweiFelder(a.page);
  await tippe(a.page, f1, '9.5');
  assert(await warte(() => imGist(MESS)[f1] === '9.5'), 'Wert von A kam nicht an');
  await tippe(a.page, f1, '');
  assert(await warte(() => imGist(MESS)[f1] === ''), 'Das Leeren kam nicht im Gist an');
  await a.close();
  const b = await geraet('messblatt.html');
  const wert = await b.page.inputValue('[data-field="' + f1 + '"]');
  await b.close();
  assertEqual(wert, '', 'Feld auf Geraet B');
});

await test('ein nur leer angezeigtes Feld loescht nichts', async () => {
  neuerGist();
  const a = await geraet('messblatt.html');
  const [f1] = await zweiFelder(a.page);
  await tippe(a.page, f1, '4.4');
  assert(await warte(() => imGist(MESS)[f1] === '4.4'), 'Wert von A kam nicht an');
  await a.close();
  const b = await geraet('messblatt.html');
  await b.page.evaluate((f) => {
    document.querySelector('[data-field="' + f + '"]').value = '';      // ohne Eingabe
    return saveData();
  }, f1);
  await b.page.waitForTimeout(500);
  const lokal = await b.page.evaluate((f) => FieldSync.lesen()[f], f1);
  await b.close();
  assertEqual([lokal, imGist(MESS)[f1]], ['4.4', '4.4'], 'Wert lokal / im Gist');
});

await test('was waehrend eines Laufs eingegeben wird, ueberschreibt der Lauf nicht', async () => {
  // Bis v18 schuetzte anwenden() nur das Feld mit dem Fokus. Wer tippte und
  // dann woanders hintippte, sah den alten Wert zurueckspringen.
  neuerGist();
  const a = await geraet('messblatt.html');
  const [f1, f2] = await zweiFelder(a.page);
  await tippe(a.page, f1, 'alt');
  assert(await warte(() => imGist(MESS)[f1] === 'alt'), 'Wert kam nicht an');
  await a.page.waitForTimeout(1500);
  // Ein anderes Geraet traegt etwas ein - der naechste Lauf bringt Neues.
  const stand = imGist(MESS);
  stand[f2] = 'vom anderen Geraet';
  stand._fieldTimes = Object.assign({}, stand._fieldTimes, { [f2]: Date.now() + 60000 });
  gist[MESS] = { filename: MESS, content: JSON.stringify(stand) };
  verzoegerung.get = 700;
  const r = await a.page.evaluate(async ([f1, f2]) => {
    const lauf = Abgleich.jetzt();
    await new Promise((res) => setTimeout(res, 150));
    const el = document.querySelector('[data-field="' + f1 + '"]');
    el.value = 'getippt'; el.dispatchEvent(new Event('input', { bubbles: true }));
    if (document.activeElement) document.activeElement.blur();
    await lauf;
    return { direkt: el.value, anderes: document.querySelector('[data-field="' + f2 + '"]').value };
  }, [f1, f2]);
  verzoegerung.get = 0;
  assert(await warte(() => imGist(MESS)[f1] === 'getippt'), 'Eingabe kam nicht im Gist an');
  await a.close();
  assertEqual(r.anderes, 'vom anderen Geraet', 'Testaufbau: der Lauf hat Neues gebracht');
  assertEqual(r.direkt, 'getippt', 'Feld direkt nach dem Lauf');
});

await test('ein Import geht in die Cloud', async () => {
  // Bis v18 blieb er auf dem Geraet, bis zufaellig ein Lauf kam.
  neuerGist();
  const a = await geraet('messblatt.html');
  const [f1] = await zweiFelder(a.page);
  await a.page.evaluate((f) => {
    const datei = { felder: { [f]: '6.6', _fieldTimes: { [f]: Date.now() - 1000 } } };
    importJSON({ target: { files: [new File([JSON.stringify(datei)], 'sicherung.json')], value: '' } });
  }, f1);
  const angekommen = await warte(() => imGist(MESS)[f1] === '6.6');
  await a.close();
  assert(angekommen, 'Import kam nicht im Gist an');
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

await test('v20: der Kopf sagt "Nicht hochgeladen", und es wird von selbst nachgeholt', async () => {
  // gt40-engine, 2026-10-24: nach einem 409 blieben die Werte nur auf dem
  // iPad, und der Kopf sagte weiter "Cloud Sync".
  neuerGist();
  const a = await geraet('messblatt.html');
  const [f1] = await zweiFelder(a.page);
  await a.page.evaluate(() => { Abgleich.WIEDERHOLEN_MS = [1500]; Abgleich.BUENDELN_MS = 300; });
  stoerung.patch = 409;
  await tippe(a.page, f1, '3.3');
  const badge = () => a.page.evaluate(() => (document.querySelector('#syncBadge .sync-badge') || {}).textContent || '');
  const sichtbar = await warte(async () => /Nicht hochgeladen/.test(await badge()));
  stoerung.patch = 0;
  const angekommen = await warte(() => imGist(MESS)[f1] === '3.3');
  const weg = await warte(async () => !/Nicht hochgeladen/.test(await badge()));
  await a.close();
  assert(sichtbar, 'Der Kopf zeigte nicht "Nicht hochgeladen"');
  assert(angekommen, 'Der Wert wurde nicht nachgeholt');
  assert(weg, 'Der Kopf zeigt nach dem Nachholen weiter "Nicht hochgeladen"');
});

await test('v21: das Fehlerprotokoll schreibt nicht selbst, geht mit dem naechsten Lauf und vereinigt die Geraete', async () => {
  // Bis v20 schrieb jeder Fehler sofort und ungelesen in den Gist.
  neuerGist();
  gist[PROTOKOLL] = { filename: PROTOKOLL, content: JSON.stringify([
    { zeit: '2026-10-20T10:00:00.000Z', geraet: 'dev-anderes', nachricht: 'vom anderen Geraet' }]) };
  const a = await geraet('messblatt.html');
  await a.page.waitForTimeout(2500);           // Lauf und Nachpruefung beim Oeffnen
  const vorher = schreibvorgaenge.length;
  await a.page.evaluate(async () => {
    for (let i = 0; i < 3; i++) ErrorLog.add('Testfehler ' + i);
    await new Promise((r) => setTimeout(r, 1000));
  });
  const ohneLauf = schreibvorgaenge.slice(vorher).filter((d) => d.includes(PROTOKOLL)).length;
  await a.page.evaluate(() => Abgleich.jetzt());
  const proto = imGist(PROTOKOLL);
  await a.close();
  assertEqual(ohneLauf, 0, 'Schreibvorgaenge nur durch Fehler');
  const liste = proto.eintraege || [];
  assert(liste.some((e) => e.nachricht === 'vom anderen Geraet'), 'Eintrag des anderen Geraets verloren');
  assertEqual(liste.filter((e) => /^Testfehler/.test(e.nachricht)).length, 3, 'Eigene Eintraege im Spiegel');
});

await test('v21: das Fehlerprotokoll geht spaetestens nach PROTOKOLL_MS hoch', async () => {
  neuerGist();
  const a = await geraet('messblatt.html');
  await a.page.waitForTimeout(2500);
  await a.page.evaluate(async () => {
    Abgleich.PROTOKOLL_MS = 300;
    ErrorLog.add('allein');
  });
  const angekommen = await warte(() => ((imGist(PROTOKOLL).eintraege) || []).some((e) => e.nachricht === 'allein'));
  await a.close();
  assert(angekommen, 'Fehlerprotokoll wurde nicht nachgereicht');
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

// ---------------------------------------------------------------------------
suite('v26: Verbinden - eine gescheiterte Suche legt keinen zweiten Gist an');

/**
 * Ein frisches Geraet ohne Token verbindet sich ueber den Dialog. Gestubbt
 * sind GET /user, die Gist-Liste und POST /gists - der ganze Weg, der bis
 * v25 nie geprueft war (in jerico genauso, bis v28).
 */
async function verbinde({ liste = 200, vorhanden = false, anlegen = 201 } = {}) {
  neuerGist();
  const ctx = await neuerKontext(browser);
  const posts = [];
  await ctx.route('https://api.github.com/**', async (route) => {
    const req = route.request();
    const u = new URL(req.url());
    if (req.method() === 'OPTIONS') return route.fulfill({ status: 204, headers: CORS });
    if (u.pathname === '/user') return route.fulfill({ status: 200, headers: CORS, contentType: 'application/json', body: '{"login":"pahlborn"}' });
    if (u.pathname === '/gists' && req.method() === 'GET') {
      if (liste !== 200) return route.fulfill({ status: liste, headers: CORS, contentType: 'application/json', body: '{"message":"Resource not accessible by personal access token"}' });
      const l = vorhanden ? [{ id: 'VORHANDEN', files: { [MESS]: { filename: MESS } } }] : [];
      return route.fulfill({ status: 200, headers: CORS, contentType: 'application/json', body: JSON.stringify(u.searchParams.get('page') === '1' ? l : []) });
    }
    if (u.pathname === '/gists' && req.method() === 'POST') {
      posts.push(req.postData());
      if (anlegen !== 201) return route.fulfill({ status: anlegen, headers: CORS, contentType: 'application/json', body: '{"message":"Not Found"}' });
      return route.fulfill({ status: 201, headers: CORS, contentType: 'application/json', body: '{"id":"NEU"}' });
    }
    return gistRoute(route);
  });
  const page = await ctx.newPage();
  await page.goto(base + '/index.html');
  await page.waitForTimeout(400);
  const r = await page.evaluate(async () => {
    openSettings();
    document.getElementById('ghToken').value = 'tok';
    await saveSettings();
    return {
      gid: localStorage.getItem('chassis_gist_id'),
      meldung: document.getElementById('toast').textContent,
      status: (document.getElementById('connectionStatus') || {}).textContent || '',
      protokoll: ErrorLog.alle().map((e) => JSON.stringify(e)).join('\n')
    };
  });
  await ctx.close();
  return { ...r, posts };
}

await test('Liste nicht lesbar: kein neuer Gist, Grund und Status in der Meldung', async () => {
  const r = await verbinde({ liste: 403 });
  assertEqual(r.posts.length, 0, 'Trotz gescheiterter Suche angelegt');
  assertEqual(r.gid, null, 'Gist-ID gesetzt');
  assert(/403/.test(r.meldung) && /Resource not accessible/.test(r.meldung), 'Meldung ohne Grund: ' + r.meldung);
  assert(/Gist-Berechtigung/.test(r.meldung), 'Kein Hinweis auf die Berechtigung: ' + r.meldung);
  assert(/findGistByFilename/.test(r.protokoll) && /403/.test(r.protokoll), 'Nicht im Protokoll: ' + r.protokoll.slice(0, 200));
  assert(!/suche Datenspeicher/i.test(r.status), 'Statuszeile behauptet eine Suche: ' + r.status);
});

await test('vorhandener Gist wird gefunden, nicht neu angelegt', async () => {
  const r = await verbinde({ vorhanden: true });
  assertEqual(r.posts.length, 0, 'Angelegt, obwohl vorhanden');
  assertEqual(r.gid, 'VORHANDEN', 'Gist-ID');
  assert(/Verbunden als pahlborn/.test(r.meldung), 'Erfolgsmeldung: ' + r.meldung);
});

await test('nichts gefunden, Anlegen verweigert: Grund in der Meldung', async () => {
  const r = await verbinde({ anlegen: 404 });
  assertEqual(r.posts.length, 1, 'Anlegen nicht versucht');
  assertEqual(r.gid, null, 'Gist-ID gesetzt');
  assert(/angelegt/.test(r.meldung) && /404/.test(r.meldung), 'Meldung: ' + r.meldung);
});

await test('nichts gefunden, Anlegen klappt: neuer Gist verbunden', async () => {
  const r = await verbinde({});
  assertEqual(r.posts.length, 1, 'Anlegen');
  assertEqual(r.gid, 'NEU', 'Gist-ID');
});

} finally {
  await browser.close();
  server.close();
}

process.exit(summary() === 0 ? 0 : 1);
