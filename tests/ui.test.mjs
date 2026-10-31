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
import crypto from 'node:crypto';
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
suite('Abhaengigkeiten sind auch ausserhalb des Firmennetzes erreichbar');

await test('package-lock.json nennt keine interne Registry', async () => {
  // Auf dem Arbeitsrechner steht npm auf die Artifactory-Spiegelung
  // jfrog.cgm.ag. Ein dort erzeugter Lockfile traegt diese URL in jedem
  // "resolved"-Feld - und GitHub Actions kommt da nicht hin. Der Lauf
  // scheitert dann in "Abhaengigkeiten installieren", also bevor ein
  // einziger Test laeuft, und die Browser-Tests gelten als uebersprungen
  // statt als rot. Genau so ist der erste CI-Lauf dieses Repos gescheitert.
  //
  // Die Spiegelung liefert dieselben Pakete; nur die Adresse darf nicht
  // mitwandern. Geprueft wird auf jede Nicht-npmjs-Quelle, nicht nur auf
  // jfrog - der naechste Spiegel heisst anders.
  const lock = lies('package-lock.json');
  const quellen = [...lock.matchAll(/"resolved":\s*"([^"]+)"/g)].map((m) => m[1]);
  assert(quellen.length > 0, 'Keine resolved-Eintraege im Lockfile gefunden');
  const intern = quellen.filter((u) => !u.startsWith('https://registry.npmjs.org/'));
  assertEqual(intern, [], 'Nicht oeffentlich erreichbare Paketquelle im Lockfile');
});

await test('die Testabhaengigkeit ist auf eine Version festgenagelt', async () => {
  // Ohne Pinning zieht CI irgendwann eine neuere Playwright-Fassung, die einen
  // anderen Chromium-Build erwartet - und der Lauf scheitert an etwas, das mit
  // dem Code nichts zu tun hat.
  const pkg = JSON.parse(lies('package.json'));
  const v = (pkg.devDependencies || {}).playwright;
  assert(v, 'playwright fehlt in devDependencies');
  assert(/^\d+\.\d+\.\d+$/.test(v), 'playwright ist nicht exakt festgelegt: ' + v);
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

await test('das Homescreen-Icon gehoert zu diesem Projekt', async () => {
  // Bis v18 waren icon-192.png, icon-512.png und icon.svg Kopien aus jerico:
  // auf dem Homescreen stand "JERICO RH02374" mit einem Dog Ring. Mitgekommen
  // beim Kopieren in v1 - derselbe Fall wie die Zeilenenden (Regel 12).
  const svg = lies('icon.svg');
  assert(/MUSTANG/.test(svg), 'icon.svg nennt das Fahrzeug nicht');
  const fremdText = svg.match(/JERICO|RH02374|BOSS|BUILD LOG|ASSEMBLY MANUAL/g);
  assertEqual(fremdText, null, 'Text eines Schwesterprojekts in icon.svg');

  // SHA-256 der Icons aus jerico und gt40-engine (Stand 2026-10-24). Eine
  // Erlaubnisliste ginge hier nicht - das eigene Icon darf sich aendern.
  const fremd = {
    d2def98c735ce1ad7099e95c3d2c70034141b47ebef98d0d37a17adc03897b8d: 'jerico icon-192',
    fe81cd12b4f8c9799aed78630240961cfb5c99a77333d2f0dea82946b0feefe8: 'jerico icon-512',
    a19853858a9530ad6c7c4a6ef7007563e2357d0b27b22132fd8a8af945e009b1: 'gt40 icon-192',
    '91a8ec51e5e64cacb3d6253506291a681d9591fa3c17a41435aed03837c80473': 'gt40 icon-512'
  };
  for (const [datei, groesse] of [['icon-192.png', 192], ['icon-512.png', 512]]) {
    const b = fs.readFileSync(path.join(REPO_ROOT, datei));
    const h = crypto.createHash('sha256').update(b).digest('hex');
    assert(!fremd[h], datei + ' ist das Icon aus ' + fremd[h]);
    // Die Groesse steht im PNG-Kopf; sie muss zur Angabe im Manifest passen.
    assertEqual([b.readUInt32BE(16), b.readUInt32BE(20)], [groesse, groesse], 'Abmessung von ' + datei);
  }
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

// ---------------------------------------------------------------------------
suite('v22: Neue Versionen erreichen jede offene Seite (wie gt40-engine v114, jerico v44)');

const ALLE_SEITEN = fs.readdirSync(REPO_ROOT).filter((f) => f.endsWith('.html')).sort();

await test('Jede Seite laedt aktualisieren.js, nur dort wird der Service Worker angemeldet', async () => {
  // Bis v21 meldete app.js den Service Worker nur an - eine offene Seite
  // behielt ihren Code, bis man sie von Hand neu lud.
  const ohne = ALLE_SEITEN.filter((f) => !/<script src="aktualisieren\.js"><\/script>/.test(lies(f)));
  const anmelder = fs.readdirSync(REPO_ROOT).filter((f) => /\.(html|js)$/.test(f) && f !== 'sw.js')
    .filter((f) => /serviceWorker\.register\(/.test(lies(f)));
  assertEqual(ohne, [], 'Seiten ohne aktualisieren.js');
  assertEqual(anmelder, ['aktualisieren.js'], 'Dateien, die den Service Worker anmelden');
  assert(/'\.\/aktualisieren\.js'/.test(lies('sw.js')), 'sw.js haelt aktualisieren.js nicht vor');
});

for (const file of ALLE_SEITEN) {
  await test(file + ': eine neue Version laedt erst neu, wenn kein Feld mehr in Arbeit ist', async () => {
    const p = await open(file);
    const r = await p.page.evaluate(async () => {
      window.__neu = 0;
      Aktualisieren.neuLaden = () => { window.__neu++; };
      // Ein eigenes, sichtbares Feld - ein zugeklapptes bekommt keinen Fokus.
      const el = document.createElement('input');
      document.body.prepend(el);
      el.focus();
      if (document.activeElement !== el) return { testaufbau: 'kein Fokus' };
      Aktualisieren.neueVersion();
      await new Promise((res) => setTimeout(res, 1500));
      const beimTippen = window.__neu;
      el.blur();
      await new Promise((res) => setTimeout(res, 1500));
      return { beimTippen, danach: window.__neu };
    });
    await p.close();
    assertEqual(r, { beimTippen: 0, danach: 1 }, 'Neu geladen waehrend / nach der Eingabe');
  });
}

// ---------------------------------------------------------------------------
suite('v24: iOS zoomt nicht in die Eingabefelder');

for (const file of ALLE_SEITEN) {
  await test(file + ': jedes Eingabefeld hat mindestens 16 px Schrift', async () => {
    // Unter 16 px vergroessert iOS die Seite beim Antippen - mitten in der
    // Messung (Pruefung aus Mechanikersicht, 2026-10-28). Gemessen wird der
    // berechnete Wert, nicht das Stylesheet: es zaehlt, was ankommt.
    const p = await open(file);
    const r = await p.page.evaluate(() => {
      const felder = [...document.querySelectorAll('input, select, textarea')]
        .filter((e) => !['checkbox', 'radio', 'range', 'hidden', 'button', 'submit', 'file', 'color'].includes(e.type));
      return {
        anzahl: felder.length,
        zuKlein: felder.map((e) => ({ f: e.dataset.field || e.id || e.name || e.className || e.tagName,
                                       px: parseFloat(getComputedStyle(e).fontSize) }))
          .filter((x) => x.px < 16)
          .map((x) => x.f + ' ' + x.px + 'px')
      };
    });
    await p.close();
    assertEqual(r.zuKlein, [], 'Eingabefelder unter 16 px (' + r.anzahl + ' geprueft)');
  });
}


// ---------------------------------------------------------------------------
suite('aktualisieren.js: eine gescheiterte Versionspruefung ist kein Fehler');

await test('aktualisieren.js ist wortgleich mit den Schwesterprojekten (Pruefsumme)', async () => {
  // Dieselbe Zahl steht in gt40-engine, jerico und alignment. Wer die Datei
  // aendert, uebernimmt die Aenderung in alle drei und ersetzt die Zahl.
  const crypto = await import('node:crypto');
  const t = fs.readFileSync(path.join(REPO_ROOT, 'aktualisieren.js'), 'utf8').replace(/\r\n/g, '\n');
  assertEqual(crypto.createHash('sha256').update(t).digest('hex').slice(0, 16), '79d600c070070c13', 'Pruefsumme');
});

await test('ohne Netz landet die Versionspruefung nicht im Fehlerprotokoll', async () => {
  // 30./31.10.: "Failed to update a ServiceWorker" stand nachts in allen drei
  // Fehlerprotokollen - reg.update() ohne Netz, abgelehntes Promise, nicht
  // abgefangen. Jeder Eintrag ging zudem mit in die Cloud.
  const ctx = await browser.newContext({ serviceWorkers: 'block' });
  await ctx.addInitScript(() => {
    window.__updates = 0;
    const reg = { update() { window.__updates++; return Promise.reject(new TypeError('Failed to update a ServiceWorker for scope')); } };
    Object.defineProperty(navigator, 'serviceWorker', { configurable: true,
      value: { controller: null, addEventListener() {}, register: () => Promise.resolve(reg) } });
  });
  const page = await ctx.newPage();
  const abgelehnt = [];
  page.on('console', (m) => { if (/Failed to update/.test(m.text())) abgelehnt.push(m.text()); });
  await page.goto(base + '/index.html');
  await page.waitForTimeout(500);
  const r = await page.evaluate(async () => {
    let unbehandelt = 0;
    window.addEventListener('unhandledrejection', () => { unbehandelt++; });
    document.dispatchEvent(new Event('visibilitychange'));
    await new Promise((res) => setTimeout(res, 400));
    const log = (window.ErrorLog && ErrorLog.alle) ? ErrorLog.alle() : [];
    return { updates: window.__updates, unbehandelt,
             eintraege: log.filter((e) => /ServiceWorker/.test(String(e.nachricht || ''))).length };
  });
  await ctx.close();
  assert(r.updates > 0, 'Testaufbau: update() wurde nie aufgerufen');
  assertEqual([r.unbehandelt, r.eintraege], [0, 0], 'unbehandelte Ablehnungen / Eintraege im Fehlerprotokoll');
});

} finally {
  await browser.close();
  server.close();
}

process.exit(summary() === 0 ? 0 : 1);
