// Tests fuer anleitung.html - die Arbeitsanleitung mit Schrittkarten.
//
// Massstab ist das Zielbild (docs/zielbild/). Geprueft wird, was ein
// Mechaniker am Auto tut: Karte antippen, lesen, Wert eintragen, Schritt
// abhaken, Phase melden - mit echten Klicks und gemessener Sichtbarkeit.
// Eine gesetzte Klasse allein sagt nicht, dass man etwas sieht (jerico v27).
//
// Die Pruefungen der Kartenregeln laufen ueber alle Karten der Seite. Kommt
// eine Phase dazu, gelten sie fuer sie mit, ohne dass hier etwas zu aendern
// ist.
//
// Lokal: node tests/anleitung.test.mjs

import fs from 'node:fs';
import path from 'node:path';
import {
  REPO_ROOT, startServer, browserStarten, neuerKontext,
  suite, test, assert, assertEqual, summary
} from './helpers.mjs';

const { server, base } = await startServer();
const browser = await browserStarten();
const ZIELBILD = fs.readFileSync(path.join(REPO_ROOT, 'docs', 'zielbild', 'index.html'), 'utf8');

async function oeffne(ctx, datei) {
  const page = await ctx.newPage();
  const fehler = [];
  page.on('pageerror', (e) => fehler.push(e.message));
  page.on('dialog', (d) => d.accept());
  await page.goto(base + '/' + (datei || 'anleitung.html'));
  await page.waitForTimeout(400);
  return { page, fehler };
}

/** Sichtbar heisst: im Layout, mit Flaeche. */
async function sichtbar(page, sel) {
  const box = await page.locator(sel).first().boundingBox();
  return !!box && box.width > 0 && box.height > 0;
}

/** Phase und Karte oeffnen wie ein Mensch: Banner antippen, Titel antippen. */
async function karteOeffnen(page, phase, schritt) {
  const body = '#phase' + phase + 'body';
  const zu = await page.$eval(body, (b) => b.classList.contains('collapsed'));
  if (zu) await page.click('#phase' + phase + ' .phase-banner');
  await page.click('#anl_' + schritt + '_card .step-title');
}

try {

// ---------------------------------------------------------------------------
suite('Die Seite laedt');

await test('ohne Skriptfehler, mit Phase 0 und ihren sieben Schritten', async () => {
  const ctx = await neuerKontext(browser);
  const { page, fehler } = await oeffne(ctx);
  assertEqual(fehler, [], 'Skriptfehler');
  assertEqual(await page.locator('#phase0 .step-card').count(), 7, 'Schritte in Phase 0');
  await ctx.close();
});

// ---------------------------------------------------------------------------
suite('Kartenregeln aus dem Zielbild (gelten fuer jede Karte)');

await test('jeder Schritt steht so im Zielbild, Nummer und Titel gleich', async () => {
  const ctx = await neuerKontext(browser);
  const { page } = await oeffne(ctx);
  const titel = await page.$$eval('.step-card .step-title', (ts) => ts.map((t) => t.childNodes[0].textContent.trim()));
  const fehlt = titel.filter((t) => {
    const nr = t.split(' ')[0], rest = t.slice(nr.length + 1);
    return !ZIELBILD.includes("['" + nr + "','" + rest + "'");
  });
  assertEqual(fehlt, [], 'Schritt nicht im Zielbild');
  await ctx.close();
});

await test('Bloecke in der Reihenfolge des Zielbilds, mit Ziel, Fertig-wenn und Zeitbedarf', async () => {
  // Zielbild, Erklaerung 2: Ziel · Werkzeug · Vorbereitung · Handgriffe ·
  // Messen · Fertig, wenn · Wenn nicht · Tipps · Sicherheit · Anzugsmomente ·
  // Zeitbedarf · Warum.
  const REIHE = ['ziel', 'tools', 'prereq', 'measure', 'release', 'abw', 'tips', 'warning', 'torque', 'time', 'warum'];
  const ctx = await neuerKontext(browser);
  const { page } = await oeffne(ctx);
  const karten = await page.$$eval('.step-card', (ks) => ks.map((k) => ({
    id: k.id,
    bloecke: Array.from(k.querySelectorAll('.guide-grid > .guide-block')).map((b) => {
      const h = b.querySelector('h4');
      if (h) return h.className;
      return b.querySelector('details.warum') ? 'warum' : '?';
    })
  })));
  const falsch = [];
  for (const k of karten) {
    for (const pflicht of ['ziel', 'release', 'time']) {
      if (!k.bloecke.includes(pflicht)) falsch.push(k.id + ' ohne ' + pflicht);
    }
    // Reihenfolge: prereq darf zweimal (Vorbereitung, Handgriffe) stehen.
    let zuletzt = -1;
    for (const b of k.bloecke) {
      const i = REIHE.indexOf(b);
      if (i < 0) { falsch.push(k.id + ' unbekannter Block ' + b); continue; }
      if (i < zuletzt) falsch.push(k.id + ' Block ' + b + ' an falscher Stelle');
      zuletzt = i;
    }
  }
  assertEqual(falsch, [], 'Kartenaufbau');
  await ctx.close();
});

await test('jedes Feld, das eine Karte nennt, gibt es in messwerte.js', async () => {
  const ctx = await neuerKontext(browser);
  const { page } = await oeffne(ctx);
  const fehlend = await page.evaluate(() => {
    const out = [];
    document.querySelectorAll('[data-messtabelle]').forEach((el) => {
      const r = el.getAttribute('data-raeder') === '4' ? ['_lf', '_rf', '_lr', '_rr'] : ['_lf', '_rf'];
      el.getAttribute('data-messtabelle').split(/\s+/).filter(Boolean).forEach((b) => {
        r.forEach((s) => { if (!Messwerte.feld(b + s)) out.push(b + s); });
      });
    });
    document.querySelectorAll('[data-messfelder]').forEach((el) => {
      el.getAttribute('data-messfelder').split(/\s+/).filter(Boolean).forEach((id) => {
        if (!Messwerte.feld(id)) out.push(id);
      });
    });
    return out;
  });
  assertEqual(fehlend, [], 'unbekannte Felder');
  await ctx.close();
});

await test('kein Feld steht zweimal auf der Seite', async () => {
  // Zwei Felder mit derselben Kennung schreiben gegeneinander - wer zuletzt
  // gesammelt wird, gewinnt, und das ist nicht das, in das getippt wurde.
  const ctx = await neuerKontext(browser);
  const { page } = await oeffne(ctx);
  const doppelt = await page.evaluate(() => {
    const n = {};
    document.querySelectorAll('[data-field]').forEach((el) => {
      n[el.dataset.field] = (n[el.dataset.field] || 0) + 1;
    });
    return Object.keys(n).filter((k) => n[k] > 1);
  });
  assertEqual(doppelt, [], 'doppelte data-field');
  await ctx.close();
});

await test('jeder Baustein, den eine Karte nennt, hat einen Inhalt', async () => {
  const ctx = await neuerKontext(browser);
  const { page } = await oeffne(ctx);
  const leer = await page.$$eval('div[data-baustein]', (bs) =>
    bs.filter((b) => !b.querySelector('details.baustein li')).map((b) => b.getAttribute('data-baustein')));
  assertEqual(leer, [], 'Baustein ohne Inhalt');
  await ctx.close();
});

await test('jede Quellenmarke traegt einen Beleg im Titel (Regel 5)', async () => {
  const html = fs.readFileSync(path.join(REPO_ROOT, 'anleitung.html'), 'utf8');
  // Die Legende oben erklaert die Kuerzel und belegt nichts - sie steht vor
  // den Bausteinen.
  const rest = html.slice(html.indexOf('<template data-baustein'));
  const marken = rest.match(/<span class="src src-[a-d]"[^>]*>/g) || [];
  assert(marken.length > 20, 'Marken gefunden: ' + marken.length);
  const ohne = marken.filter((m) => !/title="[^"]{3,}"/.test(m));
  assertEqual(ohne, [], 'Marken ohne Beleg');
});

await test('kein Anzugsmoment ohne Quelle: ohne Marke steht es als offen da', async () => {
  const ctx = await neuerKontext(browser);
  const { page } = await oeffne(ctx);
  const zeilen = await page.evaluate(() =>
    Array.from(document.querySelectorAll('h4.torque')).flatMap((h) =>
      Array.from(h.parentElement.querySelectorAll('.spec-line')).map((z) => ({
        was: z.textContent.trim(),
        wert: z.querySelector('.spec-val').textContent.trim(),
        quelle: !!z.querySelector('.src')
      }))));
  const geraten = zeilen.filter((z) => z.wert !== 'offen' && !z.quelle);
  assertEqual(geraten, [], 'Anzugsmoment ohne Quelle');
  await ctx.close();
});

await test('kein Verweis auf einen anderen Reiter (Zielbild Regel 3)', async () => {
  const html = fs.readFileSync(path.join(REPO_ROOT, 'anleitung.html'), 'utf8');
  const inhalt = html.slice(html.indexOf('<template data-baustein'), html.indexOf('<div class="modal-overlay"'));
  const links = (inhalt.match(/href="[^"#][^"]*"/g) || []);
  const woerter = (inhalt.match(/\b(Messblatt|Handbuch|Bind-Seite|Reiter Werkstatt)\b/g) || []);
  assertEqual(links.concat(woerter), [], 'Verweise aus den Karten hinaus');
});

// ---------------------------------------------------------------------------
suite('Bedienung mit echten Klicks');

await test('Banner oeffnet die Phase, Titel oeffnet die Karte sichtbar, zweites Antippen schliesst', async () => {
  const ctx = await neuerKontext(browser);
  const { page } = await oeffne(ctx);
  assert(!(await sichtbar(page, '#anl_0_2_card')), 'Phase ist anfangs zu');
  await page.click('#phase0 .phase-banner');
  assert(await sichtbar(page, '#anl_0_2_card'), 'Phase nach dem Antippen offen');
  const guide = '#anl_0_2_card .step-guide';
  assert(!(await sichtbar(page, guide)), 'Karte ist anfangs zu');
  await page.click('#anl_0_2_card .step-title');
  assert(await sichtbar(page, guide), 'Karte nach dem Antippen offen');
  assert(await sichtbar(page, '#anl_0_2_card [data-field="st_uca_vorn_lf"]'), 'Feld sichtbar');
  await page.click('#anl_0_2_card .step-title');
  assert(!(await sichtbar(page, guide)), 'Karte nach zweitem Antippen zu');
  await ctx.close();
});

await test('der Weiter-Knopf oeffnet den naechsten offenen Schritt', async () => {
  const ctx = await neuerKontext(browser);
  const { page } = await oeffne(ctx);
  assert(await sichtbar(page, '#anlWeiter'), 'Weiter-Knopf sichtbar');
  assert((await page.textContent('#anlWeiter')).includes('0.1'), 'zeigt 0.1');
  await page.click('#anlWeiter');
  assert(await sichtbar(page, '#anl_0_1_card .step-guide'), '0.1 ist offen');
  await page.click('[data-field="anl_0_1"]'); await page.click('[data-field="anl_0_1"]');
  assert((await page.textContent('#anlWeiter')).includes('0.2'), 'nach 0.1 erledigt: zeigt 0.2');
  await ctx.close();
});

await test('der Schrittstatus geht offen -> in Arbeit -> erledigt und ist gespeichert', async () => {
  const ctx = await neuerKontext(browser);
  const { page } = await oeffne(ctx);
  await page.click('#phase0 .phase-banner');
  const knopf = '[data-field="anl_0_3"]';
  await page.click(knopf);
  assertEqual(await page.getAttribute(knopf, 'value'), 'wip', 'nach dem ersten Tipp');
  await page.click(knopf);
  assertEqual(await page.getAttribute(knopf, 'value'), 'done', 'nach dem zweiten Tipp');
  await page.waitForTimeout(1000);   // autoSave wartet 800 ms
  // Gespeichert schon vor dem Verlassen der Seite - beim Neuladen speichert
  // app.js ohnehin (pagehide), das allein wuerde einen fehlenden autoSave
  // verdecken (Gegenprobe, Regel 7a).
  assertEqual(await page.evaluate(() => FieldSync.lesen().anl_0_3), 'done', 'gespeichert ohne Seitenwechsel');
  await page.reload();
  await page.waitForTimeout(400);
  assertEqual(await page.getAttribute(knopf, 'value'), 'done', 'nach dem Neuladen');
  assert((await page.textContent('#phase0 [data-phasen-stand]')).startsWith('1/7'), 'Banner zaehlt 1/7');
  await ctx.close();
});

await test('erledigt zuruecksetzen nur nach Rueckfrage', async () => {
  const ctx = await neuerKontext(browser);
  const page = await ctx.newPage();
  await page.goto(base + '/anleitung.html'); await page.waitForTimeout(400);
  await page.click('#phase0 .phase-banner');
  const knopf = '[data-field="anl_0_4"]';
  await page.click(knopf); await page.click(knopf);
  page.once('dialog', (d) => d.dismiss());
  await page.click(knopf);
  assertEqual(await page.getAttribute(knopf, 'value'), 'done', 'abgelehnt: bleibt erledigt');
  page.once('dialog', (d) => d.accept());
  await page.click(knopf);
  assertEqual(await page.getAttribute(knopf, 'value'), 'offen', 'bestaetigt: offen');
  await ctx.close();
});

// ---------------------------------------------------------------------------
suite('Eingetragene Werte wirken (Regel 8)');

await test('ein Textfeld aus Phase 0 steht danach im Messblatt', async () => {
  const ctx = await neuerKontext(browser);
  const { page } = await oeffne(ctx);
  await karteOeffnen(page, 0, '0_1');
  await page.click('[data-field="best_bj_oben"]');
  await page.keyboard.type('Moog K8136');
  await page.waitForTimeout(1000);
  const mb = await oeffne(ctx, 'messblatt.html');
  assertEqual(await mb.page.$eval('[data-field="best_bj_oben"]', (el) => el.value), 'Moog K8136', 'Wert im Messblatt');
  await ctx.close();
});

await test('ein Wert aus dem Messblatt steht beim Oeffnen in der Anleitung', async () => {
  const ctx = await neuerKontext(browser);
  const mb = await oeffne(ctx, 'messblatt.html');
  await mb.page.evaluate(() => {
    document.querySelectorAll('#blattListe .section-body').forEach((b) => b.classList.remove('collapsed'));
  });
  await mb.page.click('[data-field="best_einpresstiefe"]');
  await mb.page.keyboard.type('6');
  await mb.page.waitForTimeout(1000);
  const { page } = await oeffne(ctx);
  await karteOeffnen(page, 0, '0_6');
  assertEqual(await page.$eval('[data-field="best_einpresstiefe"]', (el) => el.value), '6', 'Wert in der Anleitung');
  await ctx.close();
});

await test('v30: ein Einsteller meldet die Verstellung mit altem und neuem Wert', async () => {
  const ctx = await neuerKontext(browser);
  const { page } = await oeffne(ctx);
  await karteOeffnen(page, 0, '0_2');
  const feld = '[data-field="st_uca_vorn_lf"]';
  await page.click(feld); await page.keyboard.type('31,5'); await page.keyboard.press('Tab');
  await page.click(feld); await page.keyboard.press('Control+A'); await page.keyboard.type('33'); await page.keyboard.press('Tab');
  const j = await page.evaluate(() => Status.journal().map((e) => ({ g: e.groesse, w: e.werte })));
  assertEqual(j, [{ g: 'castor', w: { st_uca_vorn_lf: ['', '33'] } }], 'Journal');
  const text = await page.evaluate(() => Status.verlaufText(Status.journal()[0].werte));
  assertEqual(text, 'UCA Heim vorn, Gewindelänge LF (leer) \u2192 33 mm', 'Verlaufstext');
  await ctx.close();
});

await test('v30: der alte Wert ist der, der vorher im Feld stand', async () => {
  // Ein schon erfasster Einsteller wird verstellt: 31,5 -> 33. Ohne das
  // Merken beim Antippen stuende "(leer) -> 33" im Journal.
  const ctx = await neuerKontext(browser);
  const page = await ctx.newPage();
  await page.goto(base + '/anleitung.html'); await page.waitForTimeout(300);
  await page.evaluate((k) => localStorage.setItem(k, JSON.stringify({ st_uca_vorn_lf: '31,5' })),
    await page.evaluate(() => FieldSync.STORAGE_KEY));
  await page.reload(); await page.waitForTimeout(400);
  await karteOeffnen(page, 0, '0_2');
  const feld = '[data-field="st_uca_vorn_lf"]';
  assertEqual(await page.$eval(feld, (el) => el.value), '31,5', 'vorher im Feld');
  await page.click(feld); await page.keyboard.press('Control+A'); await page.keyboard.type('33'); await page.keyboard.press('Tab');
  const w = await page.evaluate(() => Status.journal()[0].werte);
  assertEqual(w, { st_uca_vorn_lf: ['31,5', '33'] }, 'alt -> neu');
  await ctx.close();
});

await test('ein Befund- oder Textfeld meldet keine Verstellung', async () => {
  const ctx = await neuerKontext(browser);
  const { page } = await oeffne(ctx);
  await karteOeffnen(page, 0, '0_4');
  await page.click('[data-field="best_ubolts"]'); await page.keyboard.type('1/2" UNF'); await page.keyboard.press('Tab');
  assertEqual(await page.evaluate(() => Status.journal().length), 0, 'kein Journaleintrag');
  await ctx.close();
});

// ---------------------------------------------------------------------------
suite('Technik fuer kuenftige Phasen (Zielbild 3a)');

/** Eine Karte, wie sie spaetere Phasen bringen, in die Seite setzen. */
async function testkarte(page, html) {
  await page.evaluate((h) => {
    const d = document.createElement('div');
    d.innerHTML = h;
    document.getElementById('anleitung').appendChild(d.firstElementChild);
    Anleitung.aufbauen(document.getElementById('test-phase'));
  }, html);
}

await test('L-R bei Winkeln: gelb ueber 1/4 Grad, rot ueber 1/2 Grad (Ford)', async () => {
  const ctx = await neuerKontext(browser);
  const { page } = await oeffne(ctx);
  await testkarte(page, '<div class="phase" id="test-phase"><div data-messtabelle="al_camber"></div></div>');
  const zelle = '#test-phase .anl-diff';
  async function setze(l, r) {
    await page.fill('#test-phase [data-field="al_camber_lf"]', l);
    await page.fill('#test-phase [data-field="al_camber_rf"]', r);
    return page.$eval(zelle, (z) => ({ t: z.textContent.trim(), k: z.className, f: getComputedStyle(z).color }));
  }
  const ok = await setze('-2,0', '-2,2');
  assertEqual([ok.t, /anl-gelb|anl-rot/.test(ok.k)], ['0.20', false], '0,2: ohne Farbe');
  const gelb = await setze('-2,0', '-2,4');
  assert(/anl-gelb/.test(gelb.k) && gelb.f !== ok.f, '0,4: gelb ' + JSON.stringify(gelb));
  const grenze = await setze('-2,0', '-2,5');
  assert(/anl-gelb/.test(grenze.k), '0,5: noch gelb (Grenze erreicht, nicht ueberschritten)');
  const rot = await setze('-2,0', '-2,6');
  assert(/anl-rot/.test(rot.k) && rot.f !== gelb.f, '0,6: rot ' + JSON.stringify(rot));
  await ctx.close();
});

await test('L-R in mm wird nicht eingefaerbt', async () => {
  const ctx = await neuerKontext(browser);
  const { page } = await oeffne(ctx);
  await karteOeffnen(page, 0, '0_2');
  await page.fill('[data-field="st_uca_vorn_lf"]', '30');
  await page.fill('[data-field="st_uca_vorn_rf"]', '35');
  const k = await page.$eval('#anl_0_2_card .anl-diff', (z) => z.className);
  assert(!/anl-gelb|anl-rot/.test(k), 'mm-Differenz eingefaerbt: ' + k);
  await ctx.close();
});

await test('v31: Befunde sind eine Auswahl ok / nicht ok, ohne L-R-Spalte', async () => {
  const ctx = await neuerKontext(browser);
  const { page } = await oeffne(ctx);
  await karteOeffnen(page, 1, '1_2');
  const r = await page.$eval('#anl_1_2_card table', (t) => ({
    kopf: Array.from(t.querySelectorAll('th')).map((x) => x.textContent),
    optionen: Array.from(t.querySelector('select[data-field="mech_kg_oben_lf"]').options).map((o) => o.textContent)
  }));
  assertEqual(r.kopf, ['Wert', 'LF', 'RF'], 'Kopf ohne L-R');
  assertEqual(r.optionen, ['\u2013', 'ok', 'nicht ok'], 'Auswahl');
  await page.selectOption('[data-field="mech_kg_oben_lf"]', 'nicht ok');
  await page.waitForTimeout(1000);
  assertEqual(await page.evaluate(() => FieldSync.lesen().mech_kg_oben_lf), 'nicht ok', 'gespeichert');
  assertEqual(await page.evaluate(() => Status.journal().length), 0, 'Befund meldet keine Verstellung');
  await ctx.close();
});

await test('vier Raeder: Tabelle mit LF, RF, LR, RR ohne L-R', async () => {
  const ctx = await neuerKontext(browser);
  const { page } = await oeffne(ctx);
  await testkarte(page, '<div class="phase" id="test-phase"><div data-messtabelle="rh" data-raeder="4"></div></div>');
  const r = await page.$eval('#test-phase table', (t) => ({
    kopf: Array.from(t.querySelectorAll('th')).map((x) => x.textContent),
    felder: Array.from(t.querySelectorAll('[data-field]')).map((x) => x.dataset.field)
  }));
  assertEqual(r.kopf, ['Wert', 'LF', 'RF', 'LR', 'RR'], 'Kopf');
  assertEqual(r.felder, ['rh_lf', 'rh_rf', 'rh_lr', 'rh_rr'], 'Felder');
  await ctx.close();
});

await test('"neu messen" am Schritt folgt aus der veralteten Phase', async () => {
  // Phase 6 erledigt, dann ein Shim (Castor) verstellt: laut Matrix sind
  // Camber und Spur neu zu messen. Der Schritt, der Camber liefert, traegt
  // die Marke - der, der nur KPI liefert, nicht.
  const ctx = await neuerKontext(browser);
  const { page } = await oeffne(ctx);
  await testkarte(page, '<div class="phase" id="test-phase" data-phase="phase6">'
    + '<div class="step-card" id="t1" data-liefert="camber"><div class="step-header"><span class="step-title">T1 Camber</span></div></div>'
    + '<div class="step-card" id="t2" data-liefert="kpi"><div class="step-header"><span class="step-title">T2 KPI</span></div></div>'
    + '<div class="phase-abschluss" data-anl-phase="phase6"></div></div>');
  await page.click('#test-phase [data-anl-setzen]');
  assertEqual(await page.evaluate(() => Status.stufe('phase6')), 'done', 'Phase gemeldet');
  assertEqual(await page.locator('#test-phase .anl-neu-messen').count(), 0, 'vorher keine Marke');
  await page.evaluate(() => { Status.eintragen('castor', 'Test'); Anleitung.markieren(); });
  assert(await sichtbar(page, '#t1 .anl-neu-messen'), 'Camber-Schritt traegt "neu messen"');
  assertEqual(await page.locator('#t2 .anl-neu-messen').count(), 0, 'KPI-Schritt nicht');
  assert((await page.textContent('#test-phase .phase-abschluss')).includes('veraltet'), 'Abschluss sagt veraltet');
  await ctx.close();
});

await test('"Phase als erledigt melden" setzt den Phasenstatus - die Werkstatt sieht es', async () => {
  const ctx = await neuerKontext(browser);
  const { page } = await oeffne(ctx);
  await page.click('#phase0 .phase-banner');
  const knopf = '#phase0 .phase-abschluss [data-anl-setzen]';
  assert(await sichtbar(page, knopf), 'Knopf sichtbar');
  await page.click(knopf);
  assertEqual(await page.evaluate(() => Status.stufe('phase0')), 'done', 'Status');
  await page.waitForTimeout(300);
  const w = await oeffne(ctx, 'werkstatt.html');
  assertEqual(await w.page.evaluate(() => Status.stufe('phase0')), 'done', 'in der Werkstatt');
  await ctx.close();
});

} finally {
  await browser.close();
  server.close();
}

summary();
