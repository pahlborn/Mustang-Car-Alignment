// Tests fuer anleitung.html - die Arbeitsanleitung mit Schrittkarten.
//
// Geprueft wird, was ein Mechaniker am Auto tut: Karte antippen, lesen,
// Wert eintragen, Schritt abhaken. Mit echten Klicks und gemessener
// Sichtbarkeit - eine gesetzte Klasse allein sagt nicht, dass man etwas
// sieht (jerico v27).
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

async function oeffne(ctx, datei) {
  const page = await ctx.newPage();
  const fehler = [];
  page.on('pageerror', (e) => fehler.push(e.message));
  await page.goto(base + '/' + (datei || 'anleitung.html'));
  await page.waitForTimeout(400);
  return { page, fehler };
}

/** Sichtbar heisst: im Layout, mit Flaeche. */
async function sichtbar(page, sel) {
  const box = await page.locator(sel).first().boundingBox();
  return !!box && box.width > 0 && box.height > 0;
}

try {

// ---------------------------------------------------------------------------
suite('Die Seite laedt');

await test('ohne Skriptfehler, mit allen Karten von Phase 6', async () => {
  const ctx = await neuerKontext(browser);
  const { page, fehler } = await oeffne(ctx);
  assertEqual(fehler, [], 'Skriptfehler');
  const karten = await page.locator('#phase6 .step-card').count();
  assertEqual(karten, 9, 'Schrittkarten in Phase 6');
  await ctx.close();
});

await test('jedes Messfeld, das eine Karte nennt, gibt es in messwerte.js', async () => {
  const ctx = await neuerKontext(browser);
  const { page } = await oeffne(ctx);
  const fehlend = await page.evaluate(() => {
    const out = [];
    document.querySelectorAll('[data-messtabelle]').forEach((el) => {
      el.getAttribute('data-messtabelle').split(/\s+/).filter(Boolean).forEach((b) => {
        ['_lf', '_rf'].forEach((s) => { if (!Messwerte.feld(b + s)) out.push(b + s); });
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

// ---------------------------------------------------------------------------
suite('Bedienung mit echten Klicks');

await test('Antippen des Titels oeffnet die Karte sichtbar, zweites Antippen schliesst sie', async () => {
  const ctx = await neuerKontext(browser);
  const { page } = await oeffne(ctx);
  const guide = '#anl_6_4_card .step-guide';
  assert(!(await sichtbar(page, guide)), 'Karte ist anfangs zu');
  await page.click('#anl_6_4_card .step-title');
  assert(await sichtbar(page, guide), 'Karte nach dem Antippen offen');
  assert(await sichtbar(page, '#anl_6_4_card [data-field="al_castor_lf"]'), 'Castor-Feld sichtbar');
  await page.click('#anl_6_4_card .step-title');
  assert(!(await sichtbar(page, guide)), 'Karte nach zweitem Antippen zu');
  await ctx.close();
});

await test('der Pfeil rechts oeffnet die Karte ebenso', async () => {
  const ctx = await neuerKontext(browser);
  const { page } = await oeffne(ctx);
  await page.click('#anl_6_8_card .guide-toggle');
  assert(await sichtbar(page, '#anl_6_8_card [data-field="toe_f"]'), 'Spurfeld sichtbar');
  await ctx.close();
});

await test('der Schrittstatus geht offen -> in Arbeit -> erledigt und ueberlebt das Neuladen', async () => {
  const ctx = await neuerKontext(browser);
  const { page } = await oeffne(ctx);
  const knopf = '[data-field="anl_6_1"]';
  await page.click(knopf);
  assertEqual(await page.getAttribute(knopf, 'value'), 'wip', 'nach dem ersten Tipp');
  await page.click(knopf);
  assertEqual(await page.getAttribute(knopf, 'value'), 'done', 'nach dem zweiten Tipp');
  await page.waitForTimeout(1000);   // autoSave wartet 800 ms
  // Gespeichert schon vor dem Verlassen der Seite - beim Neuladen speichert
  // app.js ohnehin (pagehide), das allein wuerde einen fehlenden autoSave
  // verdecken (Gegenprobe, Regel 7a).
  assertEqual(await page.evaluate(() => FieldSync.lesen().anl_6_1), 'done', 'gespeichert ohne Seitenwechsel');
  await page.reload();
  await page.waitForTimeout(400);
  assertEqual(await page.getAttribute(knopf, 'value'), 'done', 'nach dem Neuladen');
  const farbe = await page.$eval(knopf, (b) => getComputedStyle(b).backgroundColor);
  assert(farbe !== 'rgb(255, 255, 255)', 'erledigt ist farbig, nicht weiss: ' + farbe);
  await ctx.close();
});

await test('erledigt zuruecksetzen nur nach Rueckfrage', async () => {
  const ctx = await neuerKontext(browser);
  const { page } = await oeffne(ctx);
  const knopf = '[data-field="anl_6_2"]';
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

await test('ein Castor-Wert aus der Anleitung steht danach im Messblatt', async () => {
  const ctx = await neuerKontext(browser);
  const { page } = await oeffne(ctx);
  await page.click('#anl_6_4_card .step-title');
  await page.click('[data-field="al_castor_lf"]');
  await page.keyboard.type('3,25');
  await page.waitForTimeout(1000);
  const mb = await oeffne(ctx, 'messblatt.html');
  const wert = await mb.page.$eval('[data-field="al_castor_lf"]', (el) => el.value);
  assertEqual(wert, '3,25', 'Wert im Messblatt');
  await ctx.close();
});

await test('ein Wert aus dem Messblatt steht beim Oeffnen in der Anleitung', async () => {
  const ctx = await neuerKontext(browser);
  const mb = await oeffne(ctx, 'messblatt.html');
  await mb.page.evaluate(() => {
    document.querySelectorAll('#blattListe .section-body').forEach((b) => b.classList.remove('collapsed'));
  });
  await mb.page.click('[data-field="al_camber_rf"]');
  await mb.page.keyboard.type('-1,75');
  await mb.page.waitForTimeout(1000);
  const { page } = await oeffne(ctx);
  await page.click('#anl_6_6_card .step-title');
  assertEqual(await page.$eval('[data-field="al_camber_rf"]', (el) => el.value), '-1,75', 'Wert in der Anleitung');
  await ctx.close();
});

await test('L-R-Differenz wird gerechnet und ueber 1/4 Grad rot', async () => {
  const ctx = await neuerKontext(browser);
  const { page } = await oeffne(ctx);
  await page.click('#anl_6_6_card .step-title');
  await page.click('[data-field="al_camber_lf"]'); await page.keyboard.type('-2,0');
  await page.click('[data-field="al_camber_rf"]'); await page.keyboard.type('-2,1');
  const zelle = '#anl_6_6_card .anl-diff';
  assertEqual((await page.textContent(zelle)).trim(), '0.10', 'Differenz 0,1');
  const ok = await page.$eval(zelle, (el) => getComputedStyle(el).color);
  await page.fill('[data-field="al_camber_rf"]', '');
  await page.click('[data-field="al_camber_rf"]'); await page.keyboard.type('-2,5');
  assertEqual((await page.textContent(zelle)).trim(), '0.50', 'Differenz 0,5');
  const rot = await page.$eval(zelle, (el) => getComputedStyle(el).color);
  assert(ok !== rot, 'Farbe wechselt ueber 1/4 Grad: ' + ok + ' / ' + rot);
  await ctx.close();
});

await test('Gesamtspur wird aus F und R gerechnet, plus heisst Vorspur', async () => {
  const ctx = await neuerKontext(browser);
  const { page } = await oeffne(ctx);
  await page.click('#anl_6_8_card .step-title');
  await page.click('[data-field="toe_f"]'); await page.keyboard.type('1500');
  await page.click('[data-field="toe_r"]'); await page.keyboard.type('1501,6');
  const t = await page.textContent('#anl_6_8_card [data-anl-toe]');
  assert(t.includes('1.6 mm') && t.includes('Vorspur'), 'Anzeige: ' + t);
  await ctx.close();
});

await test('ein neuer Shim-Wert meldet sich als Verstellung, ein Messwert nicht', async () => {
  const ctx = await neuerKontext(browser);
  const { page } = await oeffne(ctx);
  await page.click('#anl_6_4_card .step-title');
  await page.click('[data-field="al_castor_rf"]'); await page.keyboard.type('3');
  await page.keyboard.press('Tab');
  const nachMessung = await page.evaluate(() => Status.journal().length);
  assertEqual(nachMessung, 0, 'Messwert meldet nichts');
  await page.click('#anl_6_3_card .step-title');
  await page.click('[data-field="st_shim_vorn_lf"]'); await page.keyboard.type('4,8');
  await page.keyboard.press('Tab');
  const j = await page.evaluate(() => Status.journal().map((e) => e.groesse));
  assertEqual(j, ['castor'], 'Shim meldet Castor');
  await ctx.close();
});

// ---------------------------------------------------------------------------
suite('Phasenstatus');

await test('"Phase als erledigt melden" setzt Phase 6 - die Werkstatt sieht es', async () => {
  const ctx = await neuerKontext(browser);
  const { page } = await oeffne(ctx);
  await page.click('#anl_6_9_card .step-title');
  const knopf = '#anl_6_9_card [data-anl-setzen]';
  assert(await sichtbar(page, knopf), 'Knopf sichtbar');
  await page.click(knopf);
  assertEqual(await page.evaluate(() => Status.stufe('phase6')), 'done', 'Status');
  assert((await page.textContent('#anl_6_9_card [data-anl-phase]')).includes('erledigt'), 'Anzeige erledigt');
  await page.waitForTimeout(300);
  const w = await oeffne(ctx, 'werkstatt.html');
  assertEqual(await w.page.evaluate(() => Status.stufe('phase6')), 'done', 'in der Werkstatt');
  await ctx.close();
});

// ---------------------------------------------------------------------------
suite('Quellen (Regel 5)');

await test('jede Quellenmarke traegt einen Beleg im Titel', async () => {
  const html = fs.readFileSync(path.join(REPO_ROOT, 'anleitung.html'), 'utf8');
  // Die Legende oben erklaert die Kuerzel und belegt nichts - sie steht
  // ausserhalb von #phase6.
  const phase = html.slice(html.indexOf('id="phase6"'));
  const marken = phase.match(/<span class="src src-[a-d]"[^>]*>/g) || [];
  assert(marken.length > 20, 'Marken gefunden: ' + marken.length);
  const ohne = marken.filter((m) => !/title="[^"]{3,}"/.test(m));
  assertEqual(ohne, [], 'Marken ohne Beleg');
});

await test('kein Anzugsmoment ohne Quelle: ohne Marke steht es als offen da', async () => {
  // Fords Tabelle (Part 3-6) ist im Scan nicht lesbar. Ein Wert hier waere
  // geraten - es sei denn, er traegt eine Quellenmarke.
  const ctx = await neuerKontext(browser);
  const { page } = await oeffne(ctx);
  const zeilen = await page.evaluate(() =>
    Array.from(document.querySelectorAll('h4.torque')).flatMap((h) =>
      Array.from(h.parentElement.querySelectorAll('.spec-line')).map((z) => ({
        wert: z.querySelector('.spec-val').textContent.trim(),
        quelle: !!z.querySelector('.src')
      }))));
  assert(zeilen.length >= 4, 'Anzugsmomente gefunden: ' + zeilen.length);
  const geraten = zeilen.filter((z) => z.wert !== 'offen' && !z.quelle);
  assertEqual(geraten, [], 'Anzugsmoment ohne Quelle');
  await ctx.close();
});

} finally {
  await browser.close();
  server.close();
}

summary();
