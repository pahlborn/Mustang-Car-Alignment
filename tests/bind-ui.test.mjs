// Tests fuer bind.html - ob das Gerechnete auch ankommt.
//
// Der Kern: das Urteil steht VOR den Feldern und es sperrt sichtbar. Ein
// Bind-Test, dessen Ergebnis man erst nach dem Messen liest, verhindert
// nichts - und die Projektregel 1 (Kapitel 8) haengt genau daran.
//
// Lokal: node tests/bind-ui.test.mjs

import fs from 'node:fs';
import path from 'node:path';
import {
  startServer, REPO_ROOT, browserStarten, neuerKontext,
  suite, test, assert, assertEqual, summary
} from './helpers.mjs';

const { server, base } = await startServer();
const browser = await browserStarten();

async function oeffne() {
  const ctx = await neuerKontext(browser);
  const page = await ctx.newPage();
  const fehler = [];
  page.on('pageerror', (e) => fehler.push(e.message));
  await page.goto(base + '/bind.html');
  await page.waitForTimeout(500);
  return { ctx, page, fehler, close: () => ctx.close() };
}

/** Felder setzen und das Auswerte-Ereignis ausloesen. */
const SETZEN = (paare) => `(() => {
  const p = ${JSON.stringify(paare)};
  for (const k in p) {
    const el = document.querySelector('[data-field="' + k + '"]');
    if (!el) return 'Feld fehlt: ' + k;
    el.value = p[k];
    el.dispatchEvent(new Event('input', { bubbles: true }));
  }
  return 'ok';
})()`;

function radlasten(quelle) {
  // quelle: { '1': [lf,rf,lr,rr], ... }
  const p = {};
  for (const d in quelle) {
    ['lf', 'rf', 'lr', 'rr'].forEach((r, i) => {
      p['bind_cw_' + d + '_' + r] = String(quelle[d][i]);
    });
  }
  return p;
}

const SAUBER = radlasten({ 1: [310, 305, 290, 295], 2: [311, 304, 290, 296], 3: [310, 305, 291, 294] });
const MIT_BIND = radlasten({ 1: [310, 305, 290, 295], 2: [325, 292, 301, 282], 3: [312, 303, 288, 297] });

try {

// ---------------------------------------------------------------------------
suite('Die Seite laedt');

await test('bind.html laedt ohne Fehler', async () => {
  const p = await oeffne();
  const fehler = p.fehler.slice();
  await p.close();
  assertEqual(fehler, [], 'Fehler beim Laden');
});

await test('die vier Verfahren und die Projektregeln sind da', async () => {
  const p = await oeffne();
  const r = await p.page.evaluate(() => ({
    secs: ['sec-bind-vor', 'sec-bind-61', 'sec-bind-62', 'sec-bind-63',
           'sec-bind-64', 'sec-bind-regeln'].map((id) => !!document.getElementById(id)),
    text: document.getElementById('bindListe').textContent
  }));
  await p.close();
  assertEqual(r.secs, [true, true, true, true, true, true], 'Abschnitte fehlen');
  assert(/Reproduzierbarkeit der Radlasten/.test(r.text), '6.1 fehlt');
  assert(/Camber-Bind/.test(r.text), '6.2 fehlt');
  assert(/Laterale/.test(r.text), '6.3 fehlt');
  assert(/Hysterese/.test(r.text), '6.4 fehlt');
});

await test('kein Feld traegt eine fremde Messgroesse', async () => {
  // Die Bind-Felder sind keiner Groesse der Recheck-Matrix zugeordnet -
  // Corner Weight waere die naechstliegende, aber eine Bind-Messung ist
  // keine Corner-Weight-Erfassung. Ein data-groesse hier wuerde Phasen
  // entwerten, die niemand angefasst hat.
  const p = await oeffne();
  const n = await p.page.evaluate(() => document.querySelectorAll('[data-groesse]').length);
  await p.close();
  assertEqual(n, 0, 'Feld mit data-groesse');
});

// ---------------------------------------------------------------------------
suite('Das Urteil steht vor den Feldern und sperrt sichtbar');

await test('ohne Messung gilt nicht "kein Bind", sondern "nicht geprueft"', async () => {
  const p = await oeffne();
  const r = await p.page.evaluate(() => ({
    text: document.getElementById('bindUrteil').textContent,
    urteilVorListe: document.querySelector('.container').innerHTML.indexOf('bindUrteil')
      < document.querySelector('.container').innerHTML.indexOf('bindListe')
  }));
  await p.close();
  assert(/Noch nicht gepr/.test(r.text), 'Text: ' + r.text.slice(0, 120));
  assert(/drei vollst/.test(r.text), 'Der Hinweis auf drei Durchgaenge fehlt');
  assert(r.urteilVorListe, 'Das Urteil steht nicht vor den Feldern');
});

await test('eine saubere Messung gibt die Arbeit frei', async () => {
  const p = await oeffne();
  await p.page.evaluate(SETZEN(SAUBER));
  const t = await p.page.evaluate(() => document.getElementById('bindUrteil').textContent);
  await p.close();
  assert(/m\u00f6glich/.test(t), 'Text: ' + t.slice(0, 200));
  assert(!/gesperrt/.test(t), 'Falsch gesperrt: ' + t.slice(0, 200));
});

await test('Streuung ueber einem Prozent sperrt mit Begruendung', async () => {
  const p = await oeffne();
  await p.page.evaluate(SETZEN(MIT_BIND));
  const t = await p.page.evaluate(() => document.getElementById('bindUrteil').textContent);
  await p.close();
  assert(/gesperrt/.test(t), 'Nicht gesperrt: ' + t.slice(0, 200));
  assert(/streuen/.test(t), 'Der Grund fehlt');
  assert(/1 %/.test(t), 'Die Schwelle wird nicht genannt');
});

// ---------------------------------------------------------------------------
suite('Was das Kapitel offen laesst, wird nicht bewertet');

await test('das Diagonalmass wird ausgewiesen, ohne Schwelle', async () => {
  const p = await oeffne();
  await p.page.evaluate(SETZEN(SAUBER));
  const r = await p.page.evaluate(() => ({
    text: document.getElementById('bindRepro').textContent,
    urteil: document.getElementById('bindUrteil').textContent
  }));
  await p.close();
  assert(/Wandert Last diagonal/.test(r.text), 'Der Diagonalabschnitt fehlt');
  assert(/Keine Schwelle/.test(r.text), 'Der Vorbehalt fehlt');
  assert(!/gesperrt/.test(r.urteil), 'Das Diagonalmass hat gesperrt');
});

await test('die Hysterese nennt keinen Grenzwert', async () => {
  const p = await oeffne();
  await p.page.evaluate(SETZEN({
    bind_hy_belastet_l: '180', bind_hy_entlastet_l: '184',
    bind_hy_belastet_r: '181', bind_hy_entlastet_r: '185'
  }));
  const t = await p.page.evaluate(() => document.getElementById('bindHy').textContent);
  await p.close();
  assert(/Keine absolute Schwelle/.test(t), 'Vorbehalt fehlt: ' + t.slice(0, 160));
  assert(/normal/.test(t), 'Die Einordnung fuer Blattfedern fehlt');
});

// ---------------------------------------------------------------------------
suite('Die Ergebnisse erscheinen');

await test('die laterale Deutung wird genannt', async () => {
  const p = await oeffne();
  await p.page.evaluate(SETZEN({
    bind_lat_a_lf: '310', bind_lat_a_rf: '305', bind_lat_a_lr: '290', bind_lat_a_rr: '295',
    bind_lat_b_lf: '310', bind_lat_b_rf: '305', bind_lat_b_lr: '290', bind_lat_b_rr: '295',
    bind_lat_c_lf: '310', bind_lat_c_rf: '305', bind_lat_c_lr: '275', bind_lat_c_rr: '310'
  }));
  const t = await p.page.evaluate(() => document.getElementById('bindLat').textContent);
  await p.close();
  assert(/Panhard-L\u00e4nge/.test(t), 'Deutung fehlt: ' + t.slice(0, 200));
});

await test('die Radlaststreuung wird je Ecke beziffert', async () => {
  const p = await oeffne();
  await p.page.evaluate(SETZEN(SAUBER));
  const t = await p.page.evaluate(() => document.getElementById('bindRepro').textContent);
  await p.close();
  assert(/0\.167/.test(t), 'Die groesste Streuung fehlt: ' + t.slice(0, 300));
  assert(/Gesamtmasse/.test(t), 'Der Bezug auf die Gesamtmasse fehlt');
});

await test('die Voraussetzungen zaehlen sich mit', async () => {
  const p = await oeffne();
  const vor = await p.page.evaluate(() => document.getElementById('bindVorStand').textContent);
  await p.page.evaluate(() => {
    for (const id of ['bind_vor_raceready', 'bind_vor_pad', 'bind_vor_arb', 'bind_vor_lenkung']) {
      const el = document.querySelector('[data-field="' + id + '"]');
      el.checked = true;
      el.dispatchEvent(new Event('change', { bubbles: true }));
    }
  });
  const nach = await p.page.evaluate(() => document.getElementById('bindVorStand').textContent);
  await p.close();
  assert(/4 von 4/.test(vor), 'Ausgangsstand: ' + vor);
  assert(/Alle Voraussetzungen/.test(nach), 'Endstand: ' + nach);
});

// ---------------------------------------------------------------------------
suite('Die Feldnamen stehen nur in bind.js');

await test('bind-ui.js wiederholt keinen Feldnamen', async () => {
  // Sonst gibt es den Namen an zwei Orten (Arbeitsregel 4), und die Anzeige
  // liefe beim naechsten Umbenennen ins Leere.
  const quelle = fs.readFileSync(path.join(REPO_ROOT, 'bind-ui.js'), 'utf8')
    .split(/\r?\n/).filter((z) => !/^\s*(\/\/|\*|\/\*)/.test(z)).join('\n');
  for (const muster of ['bind_cw_', 'bind_cb_', 'bind_lat_', 'bind_hy_']) {
    assert(!quelle.includes(muster), 'Feldname in bind-ui.js: ' + muster);
  }
  assert(/Bind\.feldRadlast/.test(quelle), 'feldRadlast wird nicht benutzt');
  assert(/Bind\.feldCamber/.test(quelle), 'feldCamber wird nicht benutzt');
  assert(/Bind\.feldLateral/.test(quelle), 'feldLateral wird nicht benutzt');
  assert(/Bind\.feldHysterese/.test(quelle), 'feldHysterese wird nicht benutzt');
});

} finally {
  await browser.close();
  server.close();
}

process.exit(summary() === 0 ? 0 : 1);
