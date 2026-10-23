// Tests fuer bind-warnung.js: der Bind-Befund auf den Seiten, die ihn nicht
// selbst rechnen.
//
// bind.test.mjs prueft die Rechnung, bind-ui.test.mjs die Bind-Seite. Hier
// geht es um die zwei Stellen, an denen man arbeitet, ohne die Bind-Seite zu
// oeffnen: Werkstatt und Uebersicht. Projektregel 1 gilt dort genauso.
//
// Die Feldnamen des Seeds werden im Browser aus Bind.feldRadlast() gebaut -
// nicht als Zeichenkette hier. Sonst stuenden sie an zwei Orten und liefen
// beim naechsten Umbenennen auseinander (Arbeitsregel 4).
//
// Lokal: node tests/bind-warnung.test.mjs

import fs from 'node:fs';
import path from 'node:path';
import {
  startServer, REPO_ROOT, browserStarten, neuerKontext,
  suite, test, assert, assertEqual, summary
} from './helpers.mjs';

const { server, base } = await startServer();
const browser = await browserStarten();

const SEITEN = ['werkstatt.html', 'index.html'];

/** Messreihe sauber: plus/minus 1 kg je Ecke, drei Durchgaenge. */
const SAUBER = `(() => {
  const reihen = [[400, 380, 300, 290], [401, 379, 300, 290], [400, 380, 301, 290]];
  const d = {};
  reihen.forEach((r, i) => {
    Bind.RAEDER.forEach((rad, k) => { d[Bind.feldRadlast(i + 1, rad)] = r[k]; });
  });
  localStorage.setItem(FieldSync.STORAGE_KEY, JSON.stringify(d));
})()`;

/** Messreihe mit Bind: LF wandert im zweiten Durchgang um 20 kg. */
const MIT_BIND = `(() => {
  const reihen = [[400, 380, 300, 290], [420, 360, 310, 280], [400, 380, 300, 290]];
  const d = {};
  reihen.forEach((r, i) => {
    Bind.RAEDER.forEach((rad, k) => { d[Bind.feldRadlast(i + 1, rad)] = r[k]; });
  });
  localStorage.setItem(FieldSync.STORAGE_KEY, JSON.stringify(d));
})()`;

/** Nur 6.3: zwischen A und B wandert Last, B und C sind gleich. */
const LATERAL = `(() => {
  const reihen = { a: [400, 380, 300, 290], b: [430, 350, 300, 290], c: [430, 350, 300, 290] };
  const d = {};
  ['a', 'b', 'c'].forEach((m) => {
    Bind.RAEDER.forEach((rad, k) => { d[Bind.feldLateral(m, rad)] = reihen[m][k]; });
  });
  localStorage.setItem(FieldSync.STORAGE_KEY, JSON.stringify(d));
})()`;

async function oeffne(datei) {
  const ctx = await neuerKontext(browser);
  const page = await ctx.newPage();
  const fehler = [];
  page.on('pageerror', (e) => fehler.push(e.message));
  await page.goto(base + '/' + datei);
  await page.waitForTimeout(400);
  return { ctx, page, fehler, close: () => ctx.close() };
}

/** Speicher setzen und neu laden, damit der Befund beim Laden entsteht. */
async function mitStand(page, aufbau) {
  await page.evaluate(aufbau);
  await page.reload();
  await page.waitForTimeout(400);
}

function stand(page) {
  return page.evaluate(() => {
    const el = document.getElementById('bindWarnung');
    if (!el) return { vorhanden: false, versteckt: true, text: '', verweise: [] };
    return {
      vorhanden: true,
      versteckt: el.hidden,
      text: el.textContent,
      // Der Weg nach vorn gehoert dazu: eine Anzeige, die nur mahnt, hilft
      // in der Box nicht weiter. Geprueft wird das Ziel des Ankers, nicht
      // der Text - textContent traegt kein href.
      verweise: [...el.querySelectorAll('a')].map((a) => a.getAttribute('href'))
    };
  });
}

try {

// ---------------------------------------------------------------------------
suite('Die Seiten tragen den Befund');

for (const datei of SEITEN) {
  await test(datei + ' laedt bind.js und bind-warnung.js', async () => {
    const p = await oeffne(datei);
    const r = await p.page.evaluate(() => ({
      bind: typeof window.Bind,
      warnung: typeof window.bindWarnungZeichnen,
      lesen: typeof (window.FieldSync || {}).lesen
    }));
    const fehler = p.fehler.slice();
    await p.close();
    assertEqual(fehler, [], 'Fehler beim Laden von ' + datei);
    assertEqual(r.bind, 'object', 'Bind fehlt auf ' + datei);
    assertEqual(r.warnung, 'function', 'bindWarnungZeichnen fehlt auf ' + datei);
    assertEqual(r.lesen, 'function', 'FieldSync.lesen fehlt auf ' + datei);
  });

  await test(datei + ' hat einen Platz fuer den Befund', async () => {
    const p = await oeffne(datei);
    const hat = await p.page.evaluate(() => !!document.getElementById('bindWarnung'));
    await p.close();
    assert(hat, 'Kein #bindWarnung in ' + datei);
  });
}

await test('die Warnung steht vor der Arbeit, nicht darunter', async () => {
  // Der Sinn der Anzeige ist, dass man sie sieht, bevor man eintraegt. Unter
  // der Eingriffstabelle waere sie eine Fussnote.
  const p = await oeffne('werkstatt.html');
  const r = await p.page.evaluate(() => {
    const w = document.getElementById('bindWarnung');
    const arbeit = document.getElementById('sec-eingriff');
    return { vorArbeit: !!(w.compareDocumentPosition(arbeit) & Node.DOCUMENT_POSITION_FOLLOWING) };
  });
  const p2 = await oeffne('index.html');
  const inStatus = await p2.page.evaluate(() => !!document.querySelector('#sec-bereit #bindWarnung'));
  await p.close(); await p2.close();
  assert(r.vorArbeit, 'Der Befund steht in der Werkstatt unter der Eingriffstabelle');
  assert(inStatus, 'Der Befund steht auf der Uebersicht nicht bei der Bereitschaft');
});

// ---------------------------------------------------------------------------
suite('Ohne Messung: offen, nicht gesperrt');

for (const datei of SEITEN) {
  await test(datei + ' meldet den fehlenden Test als offen', async () => {
    // Leer ist eine Aussage (Arbeitsregel 9): kein Test heisst nicht
    // "kein Bind". Die Anzeige sagt das und nennt den Weg dorthin.
    const p = await oeffne(datei);
    const r = await stand(p.page);
    await p.close();
    assert(r.vorhanden, 'Kein Platz fuer den Befund');
    assertEqual(r.versteckt, false, 'Die Anzeige schweigt, obwohl nichts geprueft ist');
    assert(/noch nicht durchgef\u00fchrt/i.test(r.text), 'Der offene Test wird nicht genannt: ' + r.text);
    assert(!/Bind-Befund/.test(r.text), 'Ohne Befund darf nicht gesperrt gemeldet werden: ' + r.text);
    assert(r.verweise.includes('bind.html'), 'Kein Verweis auf die Bind-Seite: ' + r.verweise.join(', '));
  });
}

// ---------------------------------------------------------------------------
suite('Bestandener Test: die Anzeige schweigt');

for (const datei of SEITEN) {
  await test(datei + ' schweigt nach bestandenem Test', async () => {
    const p = await oeffne(datei);
    await mitStand(p.page, SAUBER);

    // Erst der Befund selbst: der Testfall muss wirklich bestehen, sonst
    // prueft die Anzeige darunter etwas anderes als gedacht.
    const bf = await p.page.evaluate(() => {
      const b = Bind.befund(FieldSync.lesen());
      return { geprueft: b.geprueft, sperrt: b.sperrt, gruende: b.gruende };
    });
    const r = await stand(p.page);
    await p.close();

    assert(bf.geprueft, 'Der Testfall gilt nicht als geprueft');
    assertEqual(bf.sperrt, false, 'Der saubere Testfall sperrt: ' + bf.gruende.join('; '));
    assertEqual(r.versteckt, true, 'Die Anzeige meldet trotz bestandenem Test etwas: ' + r.text);
    assertEqual(r.text.trim(), '', 'Die Anzeige traegt noch Text');
  });
}

// ---------------------------------------------------------------------------
suite('Gefundener Bind: Warnung mit Grund');

await test('die streuende Radlast wird beziffert', async () => {
  const p = await oeffne('werkstatt.html');
  await mitStand(p.page, MIT_BIND);
  const r = await stand(p.page);
  await p.close();
  assertEqual(r.versteckt, false, 'Die Warnung ist versteckt');
  assert(/Bind-Befund/.test(r.text), 'Kein Sperrhinweis: ' + r.text);
  assert(/Radlasten streuen 1\.46 %/.test(r.text), 'Der Grund fehlt oder ist falsch: ' + r.text);
  assert(r.verweise.includes('bind.html'), 'Kein Verweis auf die Bind-Seite: ' + r.verweise.join(', '));
});

await test('eine verspannte Hinterachse sperrt auch ohne 6.1', async () => {
  // Zweiter Sperrweg in Bind.befund(). Ohne diesen Test waere nur der erste
  // abgedeckt - und der zweite faellt still aus.
  const p = await oeffne('index.html');
  await mitStand(p.page, LATERAL);
  const r = await stand(p.page);
  await p.close();
  assertEqual(r.versteckt, false, 'Die Warnung ist versteckt');
  assert(/Panhard/.test(r.text), 'Die Deutung wird nicht genannt: ' + r.text);
});

await test('die zweite laterale Deutung wird woertlich genannt', async () => {
  // A ~ B, B != C -> "Laenge falsch". Der Satz steht im Handbuch mit
  // Auszeichnung; Bind.befund() streift sie ab, und die Anzeige darf sie
  // nicht als Text mitnehmen.
  const p = await oeffne('index.html');
  const r = await p.page.evaluate(`(() => {
    const d = {};
    const reihen = { a: [400, 380, 300, 290], b: [400, 380, 300, 290], c: [430, 350, 300, 290] };
    ['a', 'b', 'c'].forEach((m) => {
      Bind.RAEDER.forEach((rad, k) => { d[Bind.feldLateral(m, rad)] = reihen[m][k]; });
    });
    localStorage.setItem(FieldSync.STORAGE_KEY, JSON.stringify(d));
    bindWarnungZeichnen();
    const el = document.getElementById('bindWarnung');
    return { text: el.textContent,
             li: [...el.querySelectorAll('li')].map((x) => x.textContent).join(' | ') };
  })()`);
  await p.close();
  assert(/Panhard-L\u00e4nge falsch/.test(r.li), 'Die Deutung fehlt: ' + r.text);
  assert(!/<[a-zA-Z]/.test(r.li), 'Auszeichnung steht als Text im Befund: ' + r.li);
});

// ---------------------------------------------------------------------------
suite('Die Warnung sperrt nicht die Bedienung');

await test('der Statusknopf arbeitet trotz Bind weiter', async () => {
  // Projektregel 1 verlangt, dass man den Bind-Befund sieht - nicht, dass die
  // Seite die Arbeit verweigert. Ein Geraet, das sich sperrt, waere in der
  // Boxengasse unbrauchbar, und eine Anzeige, die man nicht umgehen kann,
  // wird abgeschaltet statt gelesen.
  const p = await oeffne('werkstatt.html');
  await mitStand(p.page, MIT_BIND);
  const knopf = '#phasenListe .step-status[data-phase="phase4"]';
  assertEqual(await p.page.getAttribute(knopf, 'value'), '', 'Ausgangsstufe');
  await p.page.click(knopf);
  await p.page.waitForTimeout(200);
  const r = await p.page.evaluate((sel) => ({
    stufe: document.querySelector(sel).value,
    warnung: document.getElementById('bindWarnung').hidden
  }), knopf);
  await p.close();
  assertEqual(r.stufe, 'wip', 'Der Statusknopf reagiert bei Bind nicht mehr');
  assertEqual(r.warnung, false, 'Die Warnung ist beim Abhaken verschwunden');
});

// ---------------------------------------------------------------------------
suite('Der Befund folgt dem Speicher');

await test('ein Reiter holt den neuen Stand beim Zurueckkommen', async () => {
  // Wer auf dem Bind-Blatt misst und zurueckwechselt, soll nicht neu laden
  // muessen - der Befund wird ohnehin bei jedem Zeichnen aus dem Speicher
  // gerechnet, es gibt keinen zweiten Stand, der nachziehen muesste.
  const p = await oeffne('index.html');
  const vorher = await stand(p.page);
  const nachher = await p.page.evaluate(`(() => {
    ${MIT_BIND}
    window.dispatchEvent(new Event('focus'));
    const el = document.getElementById('bindWarnung');
    return { versteckt: el.hidden, text: el.textContent };
  })()`);
  await p.close();
  assertEqual(vorher.versteckt, false, 'Vorher war die Anzeige schon leer');
  assert(/noch nicht durchgef\u00fchrt/i.test(vorher.text), 'Vorher fehlte der offene Test');
  assertEqual(nachher.versteckt, false, 'Die Warnung ist nach dem Wechsel nicht da');
  assert(/Bind-Befund/.test(nachher.text), 'Der neue Stand wird nicht uebernommen: ' + nachher.text);
});

// ---------------------------------------------------------------------------
suite('Eine Kennung, ein Name');

await test('die Speicherkennung steht nur in field-sync.js', async () => {
  // Sie stand in app.js, bind-ui.js, bumpsteer-ui.js und messblatt.js je
  // einmal. Vier Kopien derselben Zeichenkette sind vier Orte, an denen eine
  // davon stehen bleiben kann. Geprueft wird das Anfuehrungszeichen: ein
  // Literal im Code, nicht das Wort in einem Kommentar.
  const dateien = fs.readdirSync(REPO_ROOT).filter((f) => f.endsWith('.js'));
  const mitLiteral = dateien.filter((f) => f !== 'field-sync.js'
    && /['"]chassisSetup['"]/.test(fs.readFileSync(path.join(REPO_ROOT, f), 'utf8')));
  assertEqual(mitLiteral, [], 'Speicherkennung als Literal ausserhalb von field-sync.js');
  assert(/['"]chassisSetup['"]/.test(fs.readFileSync(path.join(REPO_ROOT, 'field-sync.js'), 'utf8')),
    'field-sync.js nennt die Kennung nicht mehr');
});

await test('bind-warnung.js nennt keinen Bind-Feldnamen', async () => {
  // Die Namen kommen aus Bind.feld*. Sonst liefe die Anzeige beim naechsten
  // Umbenennen ins Leere - und zwar still, weil sie dann nur noch "offen"
  // meldet.
  const src = fs.readFileSync(path.join(REPO_ROOT, 'bind-warnung.js'), 'utf8');
  const treffer = src.match(/bind_(cw|cb|lat|hy)_/g);
  assertEqual(treffer, null, 'Feldname in bind-warnung.js: ' + (treffer || []).join(', '));
  assert(src.includes('Bind.befund'), 'bind-warnung.js rechnet nicht mit Bind.befund');
});

await test('bind-warnung.js ist offline dabei', async () => {
  // Eine Datei, die nicht im Cache steht, fehlt genau dann, wenn es darauf
  // ankommt. Geprueft wird jede ausgelieferte Skriptdatei - sw.js selbst
  // laedt der Browser, nicht der Service Worker.
  const sw = fs.readFileSync(path.join(REPO_ROOT, 'sw.js'), 'utf8');
  const skripte = fs.readdirSync(REPO_ROOT)
    .filter((f) => f.endsWith('.js') && f !== 'sw.js');
  const fehlend = skripte.filter((f) => !sw.includes("'./" + f + "'"));
  assertEqual(fehlend, [], 'Skript fehlt in urlsToCache');
});

} finally {
  await browser.close();
  server.close();
}

process.exit(summary() === 0 ? 0 : 1);
