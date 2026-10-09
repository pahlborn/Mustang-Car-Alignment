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
suite('Der Regelkreis in der Anzeige');

await test('Camber eintragen: drei Phasen werden als veraltet markiert', async () => {
  const p = await oeffne('werkstatt.html');
  const r = await p.page.evaluate(`(() => {
    ${ALLES_ERLEDIGT}
    Status.eintragen('camber', 'Platte 2');
    werkstattZeichnen();
    return [...document.querySelectorAll('#phasenListe .section')]
      .filter((s) => s.textContent.includes('veraltet'))
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

await test('Reifendruck laesst den Balken stehen', async () => {
  const p = await oeffne('index.html');
  const r = await p.page.evaluate(`(() => {
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
