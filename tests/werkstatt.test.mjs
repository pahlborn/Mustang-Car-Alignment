// Tests fuer werkstatt.html und die Fortschrittsanzeige auf der Startseite.
//
// Hier wird geprueft, was status.test.mjs nicht sehen kann: ob das Gerechnete
// auch ankommt. Ein Eingabefeld ohne Wirkung ist eine Falle - wer misst und
// eintraegt, erwartet, dass die Anzeige folgt.
//
// Lokal: node tests/werkstatt.test.mjs

import {
  startServer, browserStarten, neuerKontext,
  suite, test, assert, assertEqual, summary
} from './helpers.mjs';

const { server, base } = await startServer();
const browser = await browserStarten();

async function oeffne(datei) {
  const ctx = await neuerKontext(browser);
  const page = await ctx.newPage();
  const fehler = [];
  page.on('pageerror', (e) => fehler.push(e.message));
  await page.goto(base + '/' + datei);
  await page.waitForTimeout(500);
  return { ctx, page, fehler, close: () => ctx.close() };
}

/** Alle Phasen auf erledigt setzen, danach neu zeichnen. */
const ALLES_ERLEDIGT = `
  for (const p of Recheck.PHASEN) Status.setzen(p.id, 'done');
  werkstattZeichnen();
`;

/**
 * Bind-Messreihe nach 6.1 in den Speicher. Ohne bestandenen Test ist seit
 * v15 nichts rennstreckenbereit. Feldnamen aus Bind.feldRadlast().
 */
function bindReihe(reihen) {
  return `(() => {
    const d = {};
    ${JSON.stringify(reihen)}.forEach((r, i) => {
      Bind.RAEDER.forEach((rad, k) => { d[Bind.feldRadlast(i + 1, rad)] = r[k]; });
    });
    localStorage.setItem(FieldSync.STORAGE_KEY, JSON.stringify(d));
  })();`;
}
const BIND_SAUBER = bindReihe([[400, 380, 300, 290], [401, 379, 300, 290], [400, 380, 301, 290]]);
const BIND_GEFUNDEN = bindReihe([[400, 380, 300, 290], [420, 360, 310, 280], [400, 380, 300, 290]]);

try {

// ---------------------------------------------------------------------------
suite('Die Seiten laden');

for (const datei of ['index.html', 'werkstatt.html']) {
  await test(datei + ' laedt ohne Fehler', async () => {
    const p = await oeffne(datei);
    const fehler = p.fehler.slice();
    await p.close();
    assertEqual(fehler, [], 'Fehler beim Laden von ' + datei);
  });
}

// ---------------------------------------------------------------------------
suite('Die Phasen kommen aus recheck.js, nicht aus dem Markup');

await test('alle 19 Phasen werden dargestellt', async () => {
  const p = await oeffne('werkstatt.html');
  const n = await p.page.evaluate(() =>
    document.querySelectorAll('#phasenListe .section').length);
  await p.close();
  assertEqual(n, 19, 'Anzahl dargestellter Phasen');
});

await test('jede Phase traegt ihren Statusknopf', async () => {
  const p = await oeffne('werkstatt.html');
  const n = await p.page.evaluate(() =>
    document.querySelectorAll('#phasenListe .step-status[data-phase]').length);
  await p.close();
  assertEqual(n, 19, 'Anzahl Statusknoepfe');
});

await test('die Auswahlliste nennt nur Groessen mit Wirkung', async () => {
  // Ein Eintrag, der keine Phase beruehrt, waere ein Knopf, der nichts tut.
  const p = await oeffne('werkstatt.html');
  const r = await p.page.evaluate(() => {
    const werte = [...document.querySelectorAll('#eingriffGroesse option')]
      .map((o) => o.value).filter(Boolean);
    return {
      werte,
      ohneWirkung: werte.filter((g) => {
        const f = Recheck.phasenNach(g);
        return !f.veraltet.length && !f.mitmessen.length && !f.hinweis.length;
      })
    };
  });
  await p.close();
  assert(r.werte.length > 0, 'Keine Auswahl gebaut');
  assertEqual(r.ohneWirkung, [], 'Auswahl enthaelt Groessen ohne Wirkung');
});

// ---------------------------------------------------------------------------
suite('Der Statusknopf wirkt');

await test('ein Klick zaehlt die Stufe weiter und bleibt erhalten', async () => {
  const p = await oeffne('werkstatt.html');
  const knopf = '#phasenListe .step-status[data-phase="phase4"]';

  assertEqual(await p.page.getAttribute(knopf, 'value'), '', 'Ausgangsstufe');
  await p.page.click(knopf);
  assertEqual(await p.page.getAttribute(knopf, 'value'), 'wip', 'Nach einem Klick');
  await p.page.click(knopf);
  assertEqual(await p.page.getAttribute(knopf, 'value'), 'done', 'Nach zwei Klicks');

  // Neu laden: der Stand muss stehen. Ohne das waere der Knopf Dekoration.
  await p.page.reload();
  await p.page.waitForTimeout(400);
  assertEqual(await p.page.getAttribute(knopf, 'value'), 'done', 'Nach dem Neuladen');
  await p.close();
});

await test('eine aufgeklappte Phase bleibt beim Abhaken offen', async () => {
  // Zwei Dinge auf einmal, und beide sind schon schiefgegangen:
  //
  //   1. Der Statusknopf liegt im section-header, der aufs Klicken klappt.
  //      Ohne stopPropagation setzt ein Klick den Status UND klappt zu.
  //   2. Das Neuzeichnen baut die Liste per innerHTML komplett neu auf. Ohne
  //      Sicherung des Klappzustands ist danach alles zu - ausgerechnet die
  //      Phase, an der man gerade arbeitet.
  //
  // Die erste Fassung dieses Tests hat nur gegen eine geschlossene Phase
  // geprueft und blieb deshalb auch dann gruen, als beides kaputt war.
  const p = await oeffne('werkstatt.html');

  await p.page.click('#sec-phase4 .section-header h2');
  await p.page.waitForTimeout(150);
  const offen = await p.page.evaluate(() =>
    !document.querySelector('#sec-phase4 .section-body').classList.contains('collapsed'));
  assert(offen, 'Die Phase liess sich nicht aufklappen');

  await p.page.click('#phasenListe .step-status[data-phase="phase4"]');
  await p.page.waitForTimeout(250);
  const r = await p.page.evaluate(() => ({
    nochOffen: !document.querySelector('#sec-phase4 .section-body').classList.contains('collapsed'),
    stufe: document.querySelector('#phasenListe .step-status[data-phase="phase4"]').value
  }));
  await p.close();

  assertEqual(r.stufe, 'wip', 'Der Status wurde nicht gesetzt');
  assertEqual(r.nochOffen, true, 'Die Phase ist beim Abhaken zugeklappt');
});

await test('der Statusklick loest kein Auf- und Zuklappen aus', async () => {
  // Die Pruefung darueber sieht nur das Ergebnis - und das ist auch dann
  // richtig, wenn toggleSection faelschlich mitlaeuft, weil das Sichern des
  // Klappzustands den Schaden auffaengt. Zwei Mechanismen fuer dieselbe
  // Sache, von denen einer stillschweigend ausfallen kann.
  //
  // Hier wird deshalb der Vorgang selbst beobachtet: nach einem Klick auf
  // den Statusknopf darf toggleSection gar nicht erst aufgerufen werden.
  const p = await oeffne('werkstatt.html');
  const spur = await p.page.evaluate(() => {
    const gerufen = [];
    const echt = window.toggleSection;
    window.toggleSection = function (h) { gerufen.push('toggleSection'); return echt(h); };
    document.querySelector('#phasenListe .step-status[data-phase="phase4"]').click();
    return gerufen;
  });
  await p.close();
  assertEqual(spur, [], 'toggleSection lief beim Statusklick mit');
});

await test('eine geschlossene Phase bleibt beim Abhaken geschlossen', async () => {
  // Gegenrichtung: der Klappzustand wird gesichert, nicht erzwungen.
  const p = await oeffne('werkstatt.html');
  await p.page.click('#phasenListe .step-status[data-phase="phase5"]');
  await p.page.waitForTimeout(250);
  const zu = await p.page.evaluate(() =>
    document.querySelector('#sec-phase5 .section-body').classList.contains('collapsed'));
  await p.close();
  assertEqual(zu, true, 'Die Phase ist beim Abhaken aufgeklappt');
});

// ---------------------------------------------------------------------------
suite('Jede Phase zeigt, was zu tun ist');

await test('jede Phase traegt ihren Abschnitt aus 02_WORKFLOW.md', async () => {
  const p = await oeffne('werkstatt.html');
  await p.page.waitForSelector('#phasenListe .phase-handbuch', { state: 'attached', timeout: 5000 });
  const r = await p.page.evaluate(() => ({
    mit: document.querySelectorAll('#phasenListe .section .phase-handbuch').length,
    phase1: document.querySelector('#sec-phase1 .phase-handbuch').textContent,
    phase3: document.querySelector('#sec-phase3 .phase-handbuch').textContent,
    quelle: document.querySelector('#sec-phase1 .phase-quelle a').getAttribute('href')
  }));
  const fehler = p.fehler.slice();
  await p.close();
  assertEqual(fehler, [], 'Fehler beim Laden');
  assertEqual(r.mit, 19, 'Phasen mit Handbuchtext');
  assert(/Radlager/.test(r.phase1) && /Stop-Regel/.test(r.phase1),
    'Phase 1 zeigt ihre Pruefliste nicht: ' + r.phase1.slice(0, 120));
  assert(/Schranke: Bind-Test vor Phase 4/.test(r.phase3), 'Phase 3 nennt die Schranke nicht');
  assertEqual(r.quelle, 'handbuch.html?d=02_WORKFLOW.md', 'Verweis auf die Quelle');
});

await test('keine id kommt auf der Seite doppelt vor', async () => {
  // "Ziel", "Vorgehen", "Projektregel" stehen in vielen Phasen. Ohne
  // Praefix bekaemen sie dieselbe id, und ein Sprung dorthin landete in
  // der falschen Phase.
  const p = await oeffne('werkstatt.html');
  await p.page.waitForSelector('#phasenListe .phase-handbuch', { state: 'attached', timeout: 5000 });
  const doppelt = await p.page.evaluate(() => {
    const ids = [...document.querySelectorAll('[id]')].map((e) => e.id);
    return [...new Set(ids.filter((x, i) => ids.indexOf(x) !== i))];
  });
  await p.close();
  assertEqual(doppelt, [], 'Doppelte ids');
});

await test('fehlt das Handbuch, bleibt die Werkstatt bedienbar', async () => {
  // Offline ohne Cache, oder eine umbenannte Datei: die Phasen muessen
  // trotzdem stehen, der Statusknopf trotzdem wirken.
  const ctx = await neuerKontext(browser);
  const page = await ctx.newPage();
  const fehler = [];
  page.on('pageerror', (e) => fehler.push(e.message));
  await page.route('**/handbuch/02_WORKFLOW.md', (route) => route.abort());
  await page.goto(base + '/werkstatt.html');
  await page.waitForTimeout(600);
  const knopf = '#phasenListe .step-status[data-phase="phase4"]';
  await page.click(knopf);
  const r = await page.evaluate((sel) => ({
    phasen: document.querySelectorAll('#phasenListe .section').length,
    text: document.querySelectorAll('#phasenListe .phase-handbuch').length,
    stufe: document.querySelector(sel).value
  }), knopf);
  await ctx.close();
  assertEqual(fehler, [], 'Unbehandelter Fehler ohne Handbuch');
  assertEqual(r.phasen, 19, 'Phasen ohne Handbuch');
  assertEqual(r.text, 0, 'Handbuchtext, obwohl die Datei fehlt');
  assertEqual(r.stufe, 'wip', 'Der Statusknopf wirkt nicht');
});

// ---------------------------------------------------------------------------
suite('Die Bind-Schranke nach Phase 3');

/** Schranke und Marken nach dem Zeichnen auslesen. */
const SCHRANKE_LESEN = `
  werkstattZeichnen();
  const s = document.getElementById('bindSchranke');
  const vor = s && s.previousElementSibling, nach = s && s.nextElementSibling;
  return {
    da: !!s,
    vor: vor && vor.id, nach: nach && nach.id,
    text: s ? s.textContent : '',
    warnt: !!(s && s.classList.contains('warning-box')),
    verweis: s ? [...s.querySelectorAll('a')].map((a) => a.getAttribute('href')) : [],
    markiert: [...document.querySelectorAll('#phasenListe .section')]
      .filter((x) => x.querySelector('.bind-zuerst')).map((x) => x.id)
  };
`;

await test('ohne Test: Schranke zwischen 3 und 4, Phasen 4-18 markiert', async () => {
  const p = await oeffne('werkstatt.html');
  const r = await p.page.evaluate(`(() => { ${SCHRANKE_LESEN} })()`);
  await p.close();
  assert(r.da, 'Keine Schranke in der Phasenliste');
  assertEqual([r.vor, r.nach], ['sec-phase3', 'sec-phase4'], 'Lage der Schranke');
  assert(/noch nicht erfasst/i.test(r.text), 'Der fehlende Test wird nicht genannt: ' + r.text);
  assert(r.verweis.includes('bind.html'), 'Kein Weg zur Bind-Seite');
  const erwartet = [];
  for (let n = 4; n <= 18; n++) erwartet.push('sec-phase' + n);
  assertEqual(r.markiert, erwartet, 'Markierte Phasen');
});

await test('bestanden: keine Marke, die Schranke sagt es', async () => {
  const p = await oeffne('werkstatt.html');
  const r = await p.page.evaluate(`(() => { ${BIND_SAUBER} ${SCHRANKE_LESEN} })()`);
  await p.close();
  assert(/bestanden/i.test(r.text), 'Schranke: ' + r.text);
  assertEqual(r.warnt, false, 'Die Schranke warnt trotz bestandenem Test');
  assertEqual(r.markiert, [], 'Marken trotz bestandenem Test');
});

await test('Bind gefunden: Schranke warnt mit Grund, Phasen bleiben markiert', async () => {
  const p = await oeffne('werkstatt.html');
  const r = await p.page.evaluate(`(() => { ${BIND_GEFUNDEN} ${SCHRANKE_LESEN} })()`);
  await p.close();
  assertEqual(r.warnt, true, 'Die Schranke warnt nicht');
  assert(/Radlasten streuen 1\.46 %/.test(r.text), 'Der Grund fehlt: ' + r.text);
  assertEqual(r.markiert.length, 15, 'Anzahl markierter Phasen');
});

await test('die Schranke folgt dem Speicher beim Zurueckkommen', async () => {
  // Gemessen wird auf bind.html, oft in einem zweiten Reiter.
  const p = await oeffne('werkstatt.html');
  const r = await p.page.evaluate(`(() => {
    ${BIND_SAUBER}
    window.dispatchEvent(new Event('focus'));
    return { text: document.getElementById('bindSchranke').textContent,
             marken: document.querySelectorAll('#phasenListe .bind-zuerst').length };
  })()`);
  await p.close();
  assert(/bestanden/i.test(r.text), 'Die Schranke zieht nicht nach: ' + r.text);
  assertEqual(r.marken, 0, 'Marken stehen noch');
});

// ---------------------------------------------------------------------------
suite('Der Regelkreis in der Anzeige');

await test('Camber eintragen: drei Phasen werden als veraltet markiert', async () => {
  const p = await oeffne('werkstatt.html');
  const r = await p.page.evaluate(`(() => {
    ${ALLES_ERLEDIGT}
    Status.eintragen('camber', 'Platte 2');
    werkstattZeichnen();
    // Die Marke, nicht das Wort: seit v17 steht in jeder Karte Handbuchtext,
    // und ein "veraltet" darin wuerde hier mitzaehlen.
    return [...document.querySelectorAll('#phasenListe .section')]
      .filter((s) => s.querySelector('.marke-veraltet'))
      .map((s) => s.id);
  })()`);
  await p.close();
  assertEqual(r, ['sec-phase3', 'sec-phase6', 'sec-phase13'], 'Markierte Phasen');
});

await test('die Vorschau sagt vorher, was passieren wird', async () => {
  // Ohne sie waere der Knopf eine Blackbox: man traegt etwas ein und sieht
  // erst danach, dass zehn Phasen umschlagen.
  const p = await oeffne('werkstatt.html');
  const r = await p.page.evaluate(() => {
    const sel = document.getElementById('eingriffGroesse');
    sel.value = 'blattfeder';
    sel.dispatchEvent(new Event('change', { bubbles: true }));
    const box = document.getElementById('eingriffWirkung');
    return { sichtbar: box.style.display !== 'none', text: box.textContent };
  });
  await p.close();
  assert(r.sichtbar, 'Die Vorschau bleibt versteckt');
  assert(/Phase\(n\) neu messen/.test(r.text), 'Vorschau nennt die Wirkung nicht: ' + r.text);
});

await test('Journaleintrag und Ruecknahme wirken sofort', async () => {
  const p = await oeffne('werkstatt.html');
  const r = await p.page.evaluate(`(() => {
    ${ALLES_ERLEDIGT}
    const id = Status.eintragen('blattfeder');
    werkstattZeichnen();
    const mit = Status.fortschritt().veraltet;
    Status.zuruecknehmen(id);
    werkstattZeichnen();
    return { mit, ohne: Status.fortschritt().veraltet,
             zeilen: document.querySelectorAll('#journalListe .spec-item').length };
  })()`);
  await p.close();
  assert(r.mit > 0, 'Der Federwechsel hat nichts bewirkt');
  assertEqual(r.ohne, 0, 'Nach der Ruecknahme ist noch etwas veraltet');
  assertEqual(r.zeilen, 0, 'Der zurueckgenommene Eintrag steht noch im Journal');
});

await test('ein Feld mit data-groesse meldet sich selbst', async () => {
  // Der zweite Weg: in der Werkstatt traegt man Messwerte ein, ohne an einen
  // Knopf zu denken.
  const p = await oeffne('werkstatt.html');
  const r = await p.page.evaluate(() => {
    const el = document.createElement('input');
    el.dataset.groesse = 'camber';
    document.body.appendChild(el);
    const vorher = Status.journal().length;
    el.value = '-2.0';
    el.dispatchEvent(new Event('change', { bubbles: true }));
    return { vorher, nachher: Status.journal().length };
  });
  await p.close();
  assertEqual(r.nachher, r.vorher + 1, 'Das Feld hat sich nicht gemeldet');
});

// ---------------------------------------------------------------------------
suite('Die Startseite beantwortet die eine Frage');

await test('ohne Daten: "noch nichts erfasst", nicht "nicht bereit"', async () => {
  // Das ist eine andere Aussage. Ein leerer Stand ist kein Mangel.
  const p = await oeffne('index.html');
  const t = await p.page.textContent('#bereitAussage');
  await p.close();
  assert(/noch nichts erfasst/i.test(t), 'Erwartet wurde der Leerzustand, da stand: ' + t);
});

await test('alles erledigt: rennstreckenbereit, Balken auf 100 Prozent', async () => {
  const p = await oeffne('index.html');
  const r = await p.page.evaluate(`(() => {
    ${BIND_SAUBER}
    for (const ph of Recheck.PHASEN) Status.setzen(ph.id, 'done');
    uebersichtZeichnen();
    return {
      text: document.getElementById('bereitAussage').textContent,
      breite: document.getElementById('overallFill').style.width,
      violett: document.getElementById('overallFill').classList.contains('progress-stale')
    };
  })()`);
  await p.close();
  assert(/Rennstreckenbereit/i.test(r.text), 'Aussage: ' + r.text);
  assertEqual(r.breite, '100%', 'Balkenbreite');
  assertEqual(r.violett, false, 'Der Balken ist eingefaerbt, obwohl nichts veraltet ist');
});

await test('nach einer Camber-Aenderung faellt der Balken zurueck', async () => {
  // DIE Frage, wegen der dieses Projekt einen Fortschrittsbalken hat.
  const p = await oeffne('index.html');
  const r = await p.page.evaluate(`(() => {
    for (const ph of Recheck.PHASEN) Status.setzen(ph.id, 'done');
    Status.eintragen('camber');
    uebersichtZeichnen();
    return {
      text: document.getElementById('bereitAussage').textContent,
      breite: document.getElementById('overallFill').style.width,
      violett: document.getElementById('overallFill').classList.contains('progress-stale'),
      liste: document.getElementById('veraltetListe').textContent,
      verweise: [...document.querySelectorAll('#veraltetListe a')].map((a) => a.getAttribute('href'))
    };
  })()`);
  await p.close();

  assert(/Nicht rennstreckenbereit/i.test(r.text), 'Aussage: ' + r.text);
  assert(/veraltet/i.test(r.text), 'Der Grund wird nicht genannt: ' + r.text);
  assert(r.breite !== '100%', 'Der Balken steht noch auf ' + r.breite);
  assertEqual(r.violett, true, 'Der Balken ist nicht als veraltet eingefaerbt');
  assert(/Final Front Alignment/.test(r.liste), 'Phase 13 fehlt in der Liste');

  // Und der Weg nach vorn: jede genannte Phase ist anklickbar. Eine Anzeige,
  // die nur mahnt, hilft in der Box nicht weiter.
  assert(r.verweise.length > 0, 'Keine Verweise in die Werkstatt');
  assert(r.verweise.every((h) => h.startsWith('werkstatt.html#sec-phase')),
    'Verweise zeigen nicht auf die Phasen: ' + r.verweise.join(', '));
});

await test('alle Phasen erledigt, aber Bind: nicht rennstreckenbereit', async () => {
  // Der Balken zaehlt Phasen und steht auf 100 Prozent - die Aussage
  // darueber nicht. Ein Setup unter Bind ist nicht fertig, sondern
  // unbrauchbar (Projektregel 6).
  const p = await oeffne('index.html');
  const r = await p.page.evaluate(`(() => {
    ${BIND_GEFUNDEN}
    for (const ph of Recheck.PHASEN) Status.setzen(ph.id, 'done');
    uebersichtZeichnen();
    return {
      text: document.getElementById('bereitAussage').textContent,
      breite: document.getElementById('overallFill').style.width
    };
  })()`);
  await p.close();
  assert(/Nicht rennstreckenbereit/i.test(r.text), 'Aussage: ' + r.text);
  assert(/Bind-Befund/.test(r.text), 'Der Bind wird als Grund nicht genannt: ' + r.text);
  assertEqual(r.breite, '100%', 'Der Balken zaehlt die Phasen');
});

await test('alle Phasen erledigt, kein Bind-Test: nicht rennstreckenbereit', async () => {
  const p = await oeffne('index.html');
  const t = await p.page.evaluate(`(() => {
    for (const ph of Recheck.PHASEN) Status.setzen(ph.id, 'done');
    uebersichtZeichnen();
    return document.getElementById('bereitAussage').textContent;
  })()`);
  await p.close();
  assert(/Nicht rennstreckenbereit/i.test(t), 'Aussage: ' + t);
  assert(/Bind-Test \(6\.1\) nicht erfasst/.test(t), 'Der fehlende Test wird nicht genannt: ' + t);
});

await test('Reifendruck laesst den Balken stehen', async () => {
  const p = await oeffne('index.html');
  const r = await p.page.evaluate(`(() => {
    ${BIND_SAUBER}
    for (const ph of Recheck.PHASEN) Status.setzen(ph.id, 'done');
    Status.eintragen('reifen_druck');
    uebersichtZeichnen();
    return {
      breite: document.getElementById('overallFill').style.width,
      text: document.getElementById('bereitAussage').textContent
    };
  })()`);
  await p.close();
  assertEqual(r.breite, '100%', 'Eine Druckkorrektur hat den Balken bewegt');
  assert(/Rennstreckenbereit/i.test(r.text), 'Aussage: ' + r.text);
});

await test('der Stand ueberlebt den Seitenwechsel', async () => {
  // Beide Seiten lesen denselben Status; eine zweite Rechnung auf der
  // Startseite waere ein Wert an zwei Orten.
  //
  // Wichtig: EIN Browserkontext fuer beide Seiten. Jeder newContext() bekommt
  // einen eigenen, leeren localStorage - zwei Kontexte koennten sich gar
  // nichts mitteilen, und der Test wuerde etwas pruefen, das es so nicht
  // gibt. Genau darauf ist diese Pruefung beim ersten Lauf hereingefallen.
  const ctx = await neuerKontext(browser);
  const page = await ctx.newPage();
  const fehler = [];
  page.on('pageerror', (e) => fehler.push(e.message));

  await page.goto(base + '/werkstatt.html');
  await page.waitForTimeout(400);
  await page.evaluate(`(() => {
    ${ALLES_ERLEDIGT}
    Status.eintragen('camber');
  })()`);

  await page.goto(base + '/index.html');
  await page.waitForTimeout(400);
  const t = await page.textContent('#overallText');
  const aussage = await page.textContent('#bereitAussage');
  await ctx.close();

  assertEqual(fehler, [], 'Fehler beim Seitenwechsel');
  assert(/veraltet/.test(t), 'Die Startseite kennt den Stand der Werkstatt nicht: ' + t);
  assert(/Nicht rennstreckenbereit/i.test(aussage), 'Aussage: ' + aussage);
});

} finally {
  await browser.close();
  server.close();
}

process.exit(summary() === 0 ? 0 : 1);
