// Tests fuer das Grundgeruest: Versionsbuchfuehrung und Seitenaufbau.
//
// Diese Datei waechst mit dem Projekt. Zum Start prueft sie nur, dass die drei
// Buchfuehrungsdateien zusammenpassen und die Seite ohne Fehler laedt - mehr
// gibt es noch nicht. Die Pruefungen stehen trotzdem ab v1 hier, weil sie
// nachtraeglich nichts geschuetzt haetten.
//
// Lokal: npm test

import fs from 'node:fs';
import path from 'node:path';
import {
  startServer, REPO_ROOT, browserStarten, neuerKontext,
  suite, test, assert, assertEqual, summary
} from './helpers.mjs';

const { server, base } = await startServer();
const browser = await browserStarten();
const PAGES = ['index.html'];

async function open(file) {
  const ctx = await neuerKontext(browser);
  const page = await ctx.newPage();
  const errors = [];
  page.on('pageerror', (e) => errors.push(e.message));
  await page.goto(base + '/' + file);
  await page.waitForTimeout(600);
  return { ctx, page, errors, close: () => ctx.close() };
}

function lies(datei) {
  return fs.readFileSync(path.join(REPO_ROOT, datei), 'utf8');
}

try {

// ---------------------------------------------------------------------------
suite('Version: eine Quelle, die nicht auseinanderlaufen kann');

await test('version.js und sw.js nennen dieselbe Version', async () => {
  // Ohne diese Pruefung liefert der Service Worker irgendwann einen anderen
  // Stand aus, als der Header anzeigt.
  const cacheName = (lies('sw.js').match(/CACHE_NAME\s*=\s*['"]([^'"]+)['"]/) || [])[1];
  const appVersion = (lies('version.js').match(/APP_VERSION\s*=\s*['"]([^'"]+)['"]/) || [])[1];
  assert(cacheName, 'CACHE_NAME nicht gefunden');
  assert(appVersion, 'APP_VERSION nicht gefunden');
  assertEqual(cacheName, 'chassis-' + appVersion,
    'sw.js (' + cacheName + ') passt nicht zu version.js (' + appVersion + ')');
});

await test('changelog.js kennt die aktuelle Version', async () => {
  const appVersion = (lies('version.js').match(/APP_VERSION\s*=\s*['"]([^'"]+)['"]/) || [])[1];
  assert(lies('changelog.js').includes("version: '" + appVersion + "'"),
    'Kein Changelog-Eintrag fuer ' + appVersion);
});

await test('version.js nennt einen Freigabezeitpunkt', async () => {
  const iso = (lies('version.js').match(/APP_BUILT\s*=\s*['"]([^'"]+)['"]/) || [])[1];
  assert(iso, 'APP_BUILT fehlt in version.js');
  assert(!isNaN(new Date(iso).getTime()), 'APP_BUILT ist kein gueltiges Datum: ' + iso);
});

await test('die Versionsfolge hat keine Luecke und keine Nummer zweimal', async () => {
  // In jerico ging v13 zweimal raus, zwoelf Minuten auseinander, beide mit
  // derselben Cache-Version. Im Journal standen dafuer zwei Eintraege mit
  // demselben 'version: v13' - und kein Test hat danach gesucht. Die Pruefung
  // darueber sieht nur, ob die oberste Nummer zu APP_VERSION passt; das war
  // die ganze Zeit erfuellt.
  //
  // Greift hier noch nicht, weil es erst einen Eintrag gibt. Steht trotzdem
  // schon da: ab v2 prueft sie etwas, und bis dahin kostet sie nichts.
  const versionen = [...lies('changelog.js').matchAll(/version: '(v\d+)'/g)].map((m) => m[1]);
  assert(versionen.length > 0, 'Kein Eintrag im Journal gefunden');

  const doppelt = versionen.filter((v, i) => versionen.indexOf(v) !== i);
  assertEqual(doppelt, [], 'Nummer mehrfach im Journal: ' + doppelt.join(', '));

  const nummern = versionen.map((v) => Number(v.slice(1)));
  const luecken = [];
  for (let i = 0; i < nummern.length - 1; i++) {
    for (let n = nummern[i] - 1; n > nummern[i + 1]; n--) luecken.push('v' + n);
  }
  assertEqual(luecken, [], 'Ohne Eintrag: ' + luecken.join(', '));
  assert(nummern.every((n, i) => i === 0 || n < nummern[i - 1]),
    'Die Eintraege stehen nicht absteigend: ' + nummern.join(', '));
});

await test('jeder benutzte Aenderungstyp hat eine Beschriftung', async () => {
  // Nicht gegen eine Liste erlaubter Typen pruefen, sondern gegen die
  // tatsaechlich benutzten: sonst faellt nicht auf, dass ein neuer Typ als
  // roher Schluessel dargestellt wird. Genau so war es in jerico bei
  // "verbessert" - 14 Eintraege ohne Beschriftung, weil TYPE_LABEL ihn nicht
  // kannte. Eine Erlaubnisliste haette den Fehler durchgelassen: ein
  // unbekannter Typ kommt darin einfach nicht vor.
  const p = await open('index.html');
  const r = await p.page.evaluate(() => {
    const labels = window.CHANGELOG_TYPE_LABEL || {};
    const benutzt = [...new Set(RELEASES.flatMap((rel) => rel.changes.map((c) => c.type)))];
    return { benutzt, ohneLabel: benutzt.filter((t) => !labels[t]) };
  });
  await p.close();

  assert(r.benutzt.length > 0, 'Kein Aenderungstyp im Journal gefunden');
  assertEqual(r.ohneLabel, [],
    'Aenderungstyp ohne Beschriftung - wird als roher Schluessel dargestellt');

  // Und die Farbe: ohne eigene Regel faellt der Badge farblos aus.
  const css = lies('styles.css');
  const ohneFarbe = r.benutzt.filter((t) => !css.includes('.cl-type.' + t + ' '));
  assertEqual(ohneFarbe, [], 'Aenderungstyp ohne eigene Farbe in styles.css');
});

await test('der Freigabezeitpunkt passt zum obersten Journal-Eintrag', async () => {
  // Es gibt keinen Build-Schritt, der APP_BUILT stempeln koennte. Ohne diese
  // Pruefung bleibt er beim naechsten Hochzaehlen stehen und behauptet ein
  // falsches Freigabedatum.
  const built = (lies('version.js').match(/APP_BUILT\s*=\s*['"]([^'"]+)['"]/) || [])[1];
  assert(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}[+-]\d{2}:\d{2}$/.test(built),
    'APP_BUILT ist kein ISO-8601 mit Zonenangabe: ' + built);

  const cl = lies('changelog.js');
  const ersterBlock = cl.slice(cl.indexOf('var RELEASES'), cl.indexOf('var RELEASES') + 400);
  const datum = (ersterBlock.match(/date:\s*'([^']+)'/) || [])[1];
  const zeit = (ersterBlock.match(/time:\s*'([^']+)'/) || [])[1];
  assertEqual(built.slice(0, 10), datum, 'APP_BUILT und das Datum des obersten Eintrags');
  assert(zeit, 'Der oberste Journal-Eintrag hat keine Uhrzeit');
  assertEqual(built.slice(11, 16), zeit, 'Uhrzeit in version.js und changelog.js');
});

await test('der Freigabezeitpunkt sieht in jeder Zeitzone gleich aus', async () => {
  // formatBuilt() rechnete in jerico mit new Date() in die Zeitzone des
  // Betrachters um. Derselbe Release stand in Berlin auf 05.01.2026, 07:09 und
  // in Los Angeles auf 04.01.2026, 22:09 - einen Tag vorher. Der Zeitpunkt
  // gehoert zum Release, nicht zum Leser.
  const p = await open('index.html');
  const r = await p.page.evaluate(() => ({
    mitZeit: formatBuilt('2026-01-05T07:09:00+01:00'),
    ohneZeit: formatBuilt('2026-01-05'),
    muell: formatBuilt('keine Zeitangabe'),
    quelle: formatBuilt.toString()
  }));
  await p.close();
  assertEqual(r.mitZeit, '05.01.2026, 07:09', 'Formatierung mit Uhrzeit');
  assertEqual(r.ohneZeit, '05.01.2026', 'Datum ohne Uhrzeit');
  assertEqual(r.muell, '', 'Unbrauchbare Eingabe ergibt nichts');
  assert(!r.quelle.includes('new Date'),
    'formatBuilt benutzt new Date - das rechnet in die Zone des Lesers um');
});

// ---------------------------------------------------------------------------
suite('Seitengeruest');

await test('sw.js listet nur Dateien, die es gibt', async () => {
  // cache.addAll ist atomar: eine einzige fehlende Datei laesst die gesamte
  // Installation scheitern - und damit den Offline-Betrieb. In jerico ist das
  // in v2 passiert, dort wegen Gross-/Kleinschreibung im Pfad.
  const sw = lies('sw.js');
  const liste = sw.slice(sw.indexOf('urlsToCache'), sw.indexOf('];', sw.indexOf('urlsToCache')));
  const pfade = [...liste.matchAll(/'\.\/([^']*)'/g)].map((m) => m[1]).filter(Boolean);
  assert(pfade.length > 0, 'Keine Pfade in urlsToCache gefunden');
  const fehlend = pfade.filter((p) => !fs.existsSync(path.join(REPO_ROOT, p)));
  assertEqual(fehlend, [], 'In sw.js gelistet, aber nicht vorhanden');
});

await test('sw.js cacht jede ausgelieferte Seite', async () => {
  // Gegenrichtung: eine neue Seite, die nicht in der Liste steht, ist offline
  // nicht da.
  const sw = lies('sw.js');
  const seiten = fs.readdirSync(REPO_ROOT).filter((f) => f.endsWith('.html'));
  assert(seiten.length > 0, 'Keine HTML-Seite im Wurzelverzeichnis');
  const fehlend = seiten.filter((s) => !sw.includes("'./" + s + "'"));
  assertEqual(fehlend, [], 'Seite fehlt in urlsToCache');
});

for (const file of PAGES) {
  await test(file + ' laedt ohne Fehler', async () => {
    const p = await open(file);
    const errors = p.errors.slice();
    await p.close();
    assertEqual(errors, [], 'Fehler beim Laden von ' + file);
  });

  await test(file + ' zeigt Version und Freigabezeitpunkt', async () => {
    const p = await open(file);
    const r = await p.page.evaluate(() => ({
      version: (document.getElementById('appVersion') || {}).textContent || '',
      built: (document.querySelector('.ht-built') || {}).textContent || ''
    }));
    await p.close();
    assert(/^v\d+$/.test(r.version.trim()), 'Versionsnummer im Header: "' + r.version + '"');
    assert(r.built.trim().length > 0, 'Freigabezeitpunkt im Header fehlt');
  });
}

} finally {
  await browser.close();
  server.close();
}

process.exit(summary() === 0 ? 0 : 1);
