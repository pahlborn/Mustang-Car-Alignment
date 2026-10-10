// Tests fuer kapitel.js, markdown.js und handbuch.html.
//
// Drei Schwerpunkte:
//
//   Registry   jede Datei genau einmal, Einordnung wie in 01_ARCHITECTURE 3
//   Renderer   alle 29 Kapitel ohne Fehler, und nichts davon ausfuehrbar
//   Seite      Verzeichnis, Kapitelansicht, Querverweise
//
// Lokal: node tests/handbuch.test.mjs

import fs from 'node:fs';
import path from 'node:path';
import {
  startServer, browserStarten, neuerKontext, REPO_ROOT,
  suite, test, assert, assertEqual, summary
} from './helpers.mjs';

new Function(fs.readFileSync(path.join(REPO_ROOT, 'kapitel.js'), 'utf8'))();
new Function(fs.readFileSync(path.join(REPO_ROOT, 'markdown.js'), 'utf8'))();
const K = globalThis.Kapitel;
const M = globalThis.Markdown;

const HB = path.join(REPO_ROOT, 'handbuch');
const IM_VERZEICHNIS = fs.readdirSync(HB).filter((f) => f.endsWith('.md'));
const ARCH = fs.readFileSync(path.join(HB, '01_ARCHITECTURE.md'), 'utf8');

const { server, base } = await startServer();
const browser = await browserStarten();

async function oeffne(suffix) {
  const ctx = await neuerKontext(browser);
  const page = await ctx.newPage();
  const fehler = [];
  page.on('pageerror', (e) => fehler.push(e.message));
  await page.goto(base + '/handbuch.html' + (suffix || ''));
  await page.waitForTimeout(700);
  return { ctx, page, fehler, close: () => ctx.close() };
}

try {

// ---------------------------------------------------------------------------
suite('Die Registry kennt jede Datei genau einmal');

await test('jede Datei im Verzeichnis steht in der Registry', async () => {
  const inReg = K.DATEIEN.map((d) => d.datei);
  const fehlend = IM_VERZEICHNIS.filter((f) => !inReg.includes(f));
  assertEqual(fehlend, [], 'Datei ohne Eintrag in der Registry');
});

await test('jeder Registry-Eintrag hat eine Datei', async () => {
  // Gegenrichtung: ein Eintrag ohne Datei erzeugt einen Verweis ins Leere.
  const fehlend = K.DATEIEN.map((d) => d.datei).filter((f) => !IM_VERZEICHNIS.includes(f));
  assertEqual(fehlend, [], 'Eintrag ohne Datei');
});

await test('keine Datei steht zweimal', async () => {
  const d = K.DATEIEN.map((x) => x.datei);
  const doppelt = d.filter((x, i) => d.indexOf(x) !== i);
  assertEqual(doppelt, [], 'Datei mehrfach in der Registry');
});

await test('jede Datei hat eine bekannte Ebene', async () => {
  const ids = K.EBENEN.map((e) => e.id);
  const falsch = K.DATEIEN.filter((d) => !ids.includes(d.ebene))
    .map((d) => d.datei + ': ' + d.ebene);
  assertEqual(falsch, [], 'Unbekannte Ebene');
});

await test('jede Ebene traegt mindestens eine Datei', async () => {
  const leer = K.EBENEN.filter((e) => !K.proEbene(e.id).length).map((e) => e.id);
  assertEqual(leer, [], 'Leere Ebene');
});

await test('die Kennungen sind eindeutig und URL-tauglich', async () => {
  const ids = K.DATEIEN.map((d) => K.kennung(d.datei));
  const doppelt = ids.filter((x, i) => ids.indexOf(x) !== i);
  assertEqual(doppelt, [], 'Doppelte Kennung');
  const falsch = ids.filter((i) => !/^[a-z0-9-]+$/.test(i));
  assertEqual(falsch, [], 'Kennung mit unzulaessigen Zeichen');
});

// ---------------------------------------------------------------------------
suite('Die Einordnung stammt aus 01_ARCHITECTURE 3');

await test('jedes Fachkapitel steht im Ebenenmodell des Handbuchs', async () => {
  // Das Modell dort nennt die Dateien verkuerzt - CHAPTER_FRONT_GEOMETRY
  // statt des vollen Namens. Geprueft wird darum der Namensanfang.
  const block = ARCH.slice(ARCH.indexOf('## 3. Ebenenmodell'),
                           ARCH.indexOf('## 4. Kapitelraster'));
  const fehlend = K.DATEIEN
    .filter((d) => d.datei.startsWith('CHAPTER_'))
    .filter((d) => {
      const stamm = d.datei.replace(/\.md$/, '');
      // Laengste Verkuerzung suchen, die im Modell vorkommt.
      for (let n = stamm.length; n >= 14; n--) {
        if (block.includes(stamm.slice(0, n))) return false;
      }
      return true;
    })
    .map((d) => d.datei);
  assertEqual(fehlend, [], 'Kapitel nicht im Ebenenmodell');
});

await test('die Autoritaeten tragen den Rang aus 01_ARCHITECTURE 2', async () => {
  // Dort steht die Rangfolge: bei Widerspruch gilt CONVENTIONS vor
  // 00_PROJECT vor 02_WORKFLOW. Eine falsche Reihenfolge hier waere eine
  // stille Umkehr dieser Entscheidung.
  const block = ARCH.slice(ARCH.indexOf('### Autorit'), ARCH.indexOf('### Erg'));
  const imHandbuch = [...block.matchAll(/\|\s*(\d)\s*\|\s*\[`([^`]+)`\]/g)]
    .map((m) => ({ rang: Number(m[1]), datei: m[2] }));
  assert(imHandbuch.length === 3, 'Es muessen drei Autoritaeten sein, waren '
    + imHandbuch.length);

  for (const a of imHandbuch) {
    const e = K.eintrag(a.datei);
    assert(e, a.datei + ' fehlt in der Registry');
    assertEqual(e.rang, a.rang, 'Rang von ' + a.datei);
  }

  // Und keine weitere Datei darf einen Rang tragen.
  const zuviel = K.DATEIEN.filter((d) => d.rang && !imHandbuch.some((a) => a.datei === d.datei))
    .map((d) => d.datei);
  assertEqual(zuviel, [], 'Datei mit Rang, die keine Autoritaet ist');
});

await test('die Leitfragen stehen so im Ebenenmodell', async () => {
  const block = ARCH.slice(ARCH.indexOf('## 3. Ebenenmodell'),
                           ARCH.indexOf('## 4. Kapitelraster'));
  const fehlend = K.EBENEN
    .filter((e) => e.nr >= 1 && e.nr <= 3)
    .filter((e) => !block.includes(e.frage))
    .map((e) => e.nr + ': ' + e.frage);
  assertEqual(fehlend, [], 'Leitfrage weicht vom Handbuch ab');
});

await test('historische Dokumente sind als solche markiert', async () => {
  // MIGRATION nennt sich selbst "Temporaeres Migrations- und
  // Auditprotokoll", LEGACY traegt es im Namen. Wer sie liest, soll wissen,
  // dass sie nicht den heutigen Zustand beschreiben.
  for (const datei of ['MIGRATION_1-3.md', 'LEGACY_REAR_AXLE_LEAF_SPRINGS_PINION.md']) {
    const e = K.eintrag(datei);
    assert(e, datei + ' fehlt');
    assertEqual(e.historisch, true, datei + ' ist nicht als historisch markiert');
  }
  // Und kein Fachkapitel faelschlich.
  const falsch = K.DATEIEN.filter((d) => d.historisch && d.datei.startsWith('CHAPTER_'))
    .map((d) => d.datei);
  assertEqual(falsch, [], 'Fachkapitel als historisch markiert');
});

// ---------------------------------------------------------------------------
suite('Kopfdaten werden gelesen, nicht abgeschrieben');

await test('jede Datei hat genau eine H1-Zeile', async () => {
  const falsch = [];
  for (const f of IM_VERZEICHNIS) {
    const n = fs.readFileSync(path.join(HB, f), 'utf8')
      .split(/\r?\n/).filter((z) => /^# \S/.test(z)).length;
    if (n !== 1) falsch.push(f + ': ' + n);
  }
  assertEqual(falsch, [], 'Datei ohne genau eine H1');
});

await test('aus jeder Datei laesst sich ein Titel lesen', async () => {
  const ohne = IM_VERZEICHNIS
    .filter((f) => !K.kopf(fs.readFileSync(path.join(HB, f), 'utf8')).titel)
    .map((f) => f);
  assertEqual(ohne, [], 'Kein Titel gefunden');
});

await test('die Registry enthaelt keine abgeschriebenen Titel', async () => {
  // Titel und Rolle werden geladen. Stuenden sie hier, liefen sie beim
  // ersten Umbenennen auseinander.
  const mitTitel = K.DATEIEN.filter((d) => d.titel || d.rolle).map((d) => d.datei);
  assertEqual(mitTitel, [], 'Abgeschriebener Titel in der Registry');
});

// ---------------------------------------------------------------------------
suite('Der Markdown-Renderer');

await test('alle 29 Kapitel rendern ohne Fehler', async () => {
  const fehler = [];
  for (const f of IM_VERZEICHNIS) {
    try {
      const h = M.rendern(fs.readFileSync(path.join(HB, f), 'utf8'), {});
      if (!h.length) fehler.push(f + ': leer');
    } catch (e) { fehler.push(f + ': ' + e.message); }
  }
  assertEqual(fehler, [], 'Renderfehler');
});

await test('nichts Gerendertes ist ausfuehrbar', async () => {
  // Zuerst escapen, dann auszeichnen. Ein Kapitel, das <script> enthaelt,
  // soll das Wort zeigen und nichts tun.
  const treffer = [];
  for (const f of IM_VERZEICHNIS) {
    const h = M.rendern(fs.readFileSync(path.join(HB, f), 'utf8'), {});
    if (/<script|<iframe|\son\w+\s*=/i.test(h)) treffer.push(f);
  }
  assertEqual(treffer, [], 'Ausfuehrbares im gerenderten HTML');

  const b = M.rendern('Ein <script>alert(1)</script> Versuch');
  assert(/&lt;script&gt;/.test(b), 'script nicht escaped: ' + b);
});

await test('Markdown in Codespannen bleibt Text', async () => {
  const h = M.inline('Beispiel `**nicht fett**` und **doch fett**');
  assert(/<code>\*\*nicht fett\*\*<\/code>/.test(h), 'Code wurde ausgewertet: ' + h);
  assert(/<strong>doch fett<\/strong>/.test(h), 'Fettdruck fehlt: ' + h);
});

await test('Tabellen werden zu Tabellen', async () => {
  const h = M.rendern('| A | B |\n|---|---|\n| 1 | 2 |');
  assert(/<table/.test(h), 'Keine Tabelle: ' + h);
  assert(/<th>A<\/th>/.test(h), 'Kopfzelle fehlt');
  assert(/<td>1<\/td>/.test(h), 'Datenzelle fehlt');
});

await test('Blockzitate werden ausgezeichnet', async () => {
  // Im Handbuch tragen sie die Warnungen - sie duerfen nicht als Absatz
  // untergehen.
  const h = M.rendern('> **Achtung:** Das ist wichtig.');
  assert(/<blockquote>/.test(h), 'Kein Blockzitat: ' + h);
  assert(/<strong>Achtung:<\/strong>/.test(h), 'Auszeichnung darin fehlt');
});

await test('Links auf Kapitel werden umgebogen', async () => {
  const h = M.inline('siehe [`CONVENTIONS.md`](CONVENTIONS.md) \u00a79',
    { kapitelLink: (f) => 'handbuch.html?d=' + f });
  assert(/href="handbuch\.html\?d=CONVENTIONS\.md"/.test(h), 'Link nicht umgebogen: ' + h);
});

await test('ein Link ohne Ziel bleibt Text', async () => {
  // Relative Pfade in Verzeichnisse, die es auf der Seite nicht gibt -
  // ein toter Link ist schlechter als keiner.
  const h = M.inline('siehe [die Quelle](../docs/quellen/A-11.pdf)', {});
  assert(!/<a /.test(h), 'Toter Link erzeugt: ' + h);
  assert(/die Quelle/.test(h), 'Text verloren: ' + h);
});

await test('Kontrollkaestchen bleiben lesbar', async () => {
  const h = M.rendern('- [ ] offen\n- [x] erledigt');
  assert(/\u2610 offen/.test(h), 'Leeres Kaestchen: ' + h);
  assert(/\u2611 erledigt/.test(h), 'Gesetztes Kaestchen: ' + h);
});

await test('Ueberschriften beginnen im Text bei h2', async () => {
  // H1 bleibt dem Seitentitel vorbehalten - sonst konkurrieren zwei
  // Hauptueberschriften miteinander.
  const uu = [];
  const h = M.rendern('# Titel\n\n## Abschnitt', { ueberschriften: uu });
  assert(!/<h1/.test(h), 'H1 im Fliesstext: ' + h);
  assert(/<h2 id=/.test(h), 'H1 nicht zu H2 geworden');
  assertEqual(uu.length, 2, 'Ueberschriften gesammelt');
  assertEqual(uu[0].stufe, 1, 'Stufe der ersten');
});

await test('Anker sind eindeutig und URL-tauglich', async () => {
  assertEqual(M.anker('5. Umgang mit Werten'), '5-umgang-mit-werten', 'Anker');
  assertEqual(M.anker('Stellgr\u00f6\u00dfe'), 'stellgroesse', 'Umlaute');
});

// ---------------------------------------------------------------------------
suite('Die Suche ueber die Kapitel');

await test('ein Begriff wird in mehreren Kapiteln gefunden', async () => {
  const p = await oeffne();
  const r = await p.page.evaluate(async () => {
    await Kapitel.alleLaden();
    const t = Kapitel.suchen('Bump Steer');
    return { dateien: t.length, erste: t[0] ? t[0].datei : null,
             hatUmfeld: t[0] ? !!t[0].stellen[0].umfeld : false };
  });
  await p.close();
  assert(r.dateien > 3, 'Nur ' + r.dateien + ' Kapitel gefunden');
  assert(r.hatUmfeld, 'Keine Textstelle mitgeliefert');
});

await test('unter zwei Zeichen wird nicht gesucht', async () => {
  const p = await oeffne();
  const n = await p.page.evaluate(async () => {
    await Kapitel.alleLaden();
    return Kapitel.suchen('B').length;
  });
  await p.close();
  assertEqual(n, 0, 'Bei einem Zeichen wurde gesucht');
});

await test('das Umfeld zeigt den Fundort, nicht nur den Dateinamen', async () => {
  // Ein Dateiname allein sagt nicht, ob sich das Oeffnen lohnt.
  const text = 'Der Nachlauf, auch Castor genannt, wirkt beim Einlenken.';
  const u = K._umfeld(text, text.indexOf('Castor'), 6);
  assert(/Castor/.test(u), 'Fundstelle fehlt im Umfeld');
  assert(u.length > 10, 'Umfeld zu knapp: ' + u);
});

// ---------------------------------------------------------------------------
suite('Die Seite');

await test('handbuch.html laedt ohne Fehler', async () => {
  const p = await oeffne();
  const fehler = p.fehler.slice();
  await p.close();
  assertEqual(fehler, [], 'Fehler beim Laden');
});

await test('das Verzeichnis zeigt alle Ebenen und Kapitel', async () => {
  const p = await oeffne();
  await p.page.waitForTimeout(800);
  const r = await p.page.evaluate(() => ({
    ebenen: document.querySelectorAll('#hbInhalt .section').length,
    eintraege: document.querySelectorAll('.hb-eintrag').length
  }));
  await p.close();
  assertEqual(r.ebenen, K.EBENEN.length, 'Ebenen');
  assertEqual(r.eintraege, K.DATEIEN.length, 'Kapitel');
});

await test('jeder Eintrag verweist auf ein vorhandenes Kapitel', async () => {
  const p = await oeffne();
  await p.page.waitForTimeout(800);
  const ziele = await p.page.evaluate(() =>
    [...document.querySelectorAll('.hb-eintrag')].map((a) => a.getAttribute('href')));
  await p.close();

  const bekannt = K.DATEIEN.map((d) => d.datei);
  const falsch = ziele.filter((h) => {
    const m = h.match(/\?d=(.+)$/);
    return !m || !bekannt.includes(decodeURIComponent(m[1]));
  });
  assertEqual(falsch, [], 'Verweis auf ein unbekanntes Kapitel');
});

await test('ein Kapitel laesst sich oeffnen', async () => {
  const p = await oeffne('?d=CONVENTIONS.md');
  await p.page.waitForTimeout(600);
  const r = await p.page.evaluate(() => ({
    titel: (document.querySelector('.hb-kopf h1') || {}).textContent || '',
    tabellen: document.querySelectorAll('.hb-text table').length,
    text: document.querySelector('.hb-text').textContent.length,
    seitentitel: document.title
  }));
  await p.close();
  assert(/Conventions/i.test(r.titel), 'Titel: ' + r.titel);
  assert(r.tabellen >= 4, 'Nur ' + r.tabellen + ' Tabellen gerendert');
  assert(r.text > 5000, 'Text zu kurz: ' + r.text);
  assert(/Conventions/i.test(r.seitentitel), 'Seitentitel nicht gesetzt');
});

await test('eine Autoritaet nennt ihren Rang', async () => {
  const p = await oeffne('?d=CONVENTIONS.md');
  await p.page.waitForTimeout(600);
  const t = await p.page.textContent('#hbInhalt');
  await p.close();
  assert(/Autorit\u00e4t Rang 1/.test(t), 'Rang wird nicht genannt');
});

await test('ein historisches Dokument warnt', async () => {
  const p = await oeffne('?d=MIGRATION_1-3.md');
  await p.page.waitForTimeout(600);
  const t = await p.page.textContent('#hbInhalt');
  await p.close();
  assert(/fr\u00fcheren oder vor\u00fcbergehenden Stand/.test(t),
    'Keine Warnung bei einem historischen Dokument');
});

await test('Querverweise fuehren ins naechste Kapitel', async () => {
  // Das Handbuch verlinkt querbeet. Als normale Links wuerden sie den Leser
  // aus der Anwendung tragen.
  const p = await oeffne('?d=02_WORKFLOW.md');
  await p.page.waitForTimeout(600);
  const r = await p.page.evaluate(() => {
    const links = [...document.querySelectorAll('.hb-text a')]
      .map((a) => a.getAttribute('href'));
    return { gesamt: links.length,
             insHandbuch: links.filter((h) => h.startsWith('handbuch.html?d=')).length };
  });
  await p.close();
  assert(r.insHandbuch > 5, 'Nur ' + r.insHandbuch + ' Querverweise umgebogen');
});

await test('ein langes Kapitel bekommt ein Inhaltsverzeichnis', async () => {
  const p = await oeffne('?d=02_WORKFLOW.md');
  await p.page.waitForTimeout(600);
  const r = await p.page.evaluate(() => {
    const toc = document.querySelector('.hb-toc');
    return { da: !!toc, punkte: toc ? toc.querySelectorAll('li').length : 0 };
  });
  await p.close();
  assertEqual(r.da, true, 'Kein Inhaltsverzeichnis');
  assert(r.punkte > 20, 'Nur ' + r.punkte + ' Punkte');
});

await test('eine unbekannte Datei zeigt das Verzeichnis', async () => {
  // Kein Fehler, sondern der Weg zurueck. Ein alter Lesezeichen-Link soll
  // nicht ins Nichts fuehren.
  const p = await oeffne('?d=GIBTESNICHT.md');
  await p.page.waitForTimeout(800);
  const n = await p.page.evaluate(() => document.querySelectorAll('.hb-eintrag').length);
  await p.close();
  assertEqual(n, K.DATEIEN.length, 'Statt des Verzeichnisses kam etwas anderes');
});

await test('alle Kapitel stehen im Service-Worker-Cache', async () => {
  // Sie werden zur Laufzeit gelesen - ohne Cache ist das Handbuch offline
  // nicht da.
  const sw = fs.readFileSync(path.join(REPO_ROOT, 'sw.js'), 'utf8');
  const fehlend = IM_VERZEICHNIS.filter((f) => !sw.includes("'./handbuch/" + f + "'"));
  assertEqual(fehlend, [], 'Kapitel fehlt im Cache');
});

} finally {
  await browser.close();
  server.close();
}

process.exit(summary() === 0 ? 0 : 1);
