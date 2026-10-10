// Tests fuer Glossar, Nachschlagekarte und Suche.
//
// Zwei verschiedene Pruefarten:
//
//   Glossar   wird zur Laufzeit aus GLOSSAR.md gelesen. Geprueft wird der
//             Parser - findet er alle Begriffe, und ueberlebt er ein
//             abweichendes Format?
//   Referenz  ist eine Verkuerzung, keine Abschrift. Wortgleichheit laesst
//             sich nicht pruefen, wohl aber dass der Satz, auf den sie sich
//             stuetzt, noch in CONVENTIONS.md steht.
//
// Lokal: node tests/nachschlagen.test.mjs

import fs from 'node:fs';
import path from 'node:path';
import {
  startServer, browserStarten, neuerKontext, REPO_ROOT,
  suite, test, assert, assertEqual, summary
} from './helpers.mjs';

new Function(fs.readFileSync(path.join(REPO_ROOT, 'glossar.js'), 'utf8'))();
new Function(fs.readFileSync(path.join(REPO_ROOT, 'referenz.js'), 'utf8'))();
const G = globalThis.Glossar;
const R = globalThis.Referenz.REFERENZ;

new Function(fs.readFileSync(path.join(REPO_ROOT, 'kapitel.js'), 'utf8'))();
const K_ANZAHL = globalThis.Kapitel.DATEIEN.length;

const QUELLE = fs.readFileSync(path.join(REPO_ROOT, 'handbuch', 'GLOSSAR.md'), 'utf8');
const KONV = fs.readFileSync(path.join(REPO_ROOT, 'handbuch', 'CONVENTIONS.md'), 'utf8');
const zerlegt = G._zerlegen(QUELLE);

const { server, base } = await startServer();
const browser = await browserStarten();

async function oeffne(datei) {
  const ctx = await neuerKontext(browser);
  const page = await ctx.newPage();
  const fehler = [];
  page.on('pageerror', (e) => fehler.push(e.message));
  await page.goto(base + '/' + (datei || 'index.html'));
  await page.waitForTimeout(500);
  return { ctx, page, fehler, close: () => ctx.close() };
}

try {

// ---------------------------------------------------------------------------
suite('Das Glossar wird gelesen, nicht abgeschrieben');

await test('jeder Begriff der Datei kommt im Ergebnis vor', async () => {
  // Die Zaehlung im Handbuch ist die Vorgabe. Ein Parser, der einen Eintrag
  // verschluckt, faellt sonst nicht auf - 50 von 51 sieht aus wie 51.
  const imText = QUELLE.split(/\r?\n/)
    .filter((z) => /^###\s+\S/.test(z))
    .map((z) => z.replace(/^###\s+/, '').trim());

  const gefunden = zerlegt.eintraege.map((e) => e.begriff);
  const fehlend = imText.filter((b) => !gefunden.includes(b));
  assertEqual(fehlend, [], 'Begriff nicht erkannt');
  assertEqual(gefunden.length, imText.length, 'Anzahl Begriffe');
});

await test('kein Begriff kommt doppelt vor', async () => {
  // "Ein Begriff, eine Definition, ein Ort" - die Pflegeregel des Glossars.
  const b = zerlegt.eintraege.map((e) => e.begriff);
  const doppelt = b.filter((x, i) => b.indexOf(x) !== i);
  assertEqual(doppelt, [], 'Begriff mehrfach');
});

await test('jeder Begriff hat eine Kategorie und Inhalt', async () => {
  const leer = zerlegt.eintraege
    .filter((e) => !e.kategorie || !e.text || e.text.length < 20)
    .map((e) => e.begriff);
  assertEqual(leer, [], 'Begriff ohne Kategorie oder Inhalt');
});

await test('die erklaerenden Abschnitte sind keine Kategorien', async () => {
  // "Pflegeregel" erklaert das Schema, "Noch aufzunehmen" und "Definition of
  // Done" enthalten keine Definitionen. Als Filter waeren sie leer.
  const titel = zerlegt.kategorien.map((k) => k.titel);
  for (const t of ['Pflegeregel', 'Noch aufzunehmen', 'Definition of Done']) {
    assert(!titel.includes(t), t + ' steht als Kategorie da');
  }
  assert(titel.length >= 8, 'Nur ' + titel.length + ' Kategorien gefunden');
});

await test('jede Kategorie traegt mindestens einen Begriff', async () => {
  const leer = zerlegt.kategorien.filter((k) => !k.anzahl).map((k) => k.titel);
  assertEqual(leer, [], 'Leere Kategorie');
});

await test('die Kategoriezahlen summieren sich auf die Begriffszahl', async () => {
  const summe = zerlegt.kategorien.reduce((s, k) => s + k.anzahl, 0);
  assertEqual(summe, zerlegt.eintraege.length, 'Summe der Kategorien');
});

await test('der Parser verkraftet ein abweichendes Format', async () => {
  // Ein Begriff ohne Kategorie darueber, eine Kategorie ohne Nummer, ein
  // leerer Abschnitt. Nichts davon darf werfen.
  const seltsam = [
    '# Titel', '',
    '### Verwaister Begriff', 'Text ohne Kategorie.', '',
    '## Ohne Nummer', '',
    '### Richtiger Begriff', 'Inhalt.', '',
    '## 9. Leer', ''
  ].join('\n');

  let r;
  try { r = G._zerlegen(seltsam); }
  catch (e) { throw new Error('Parser wirft: ' + e.message); }

  assertEqual(r.eintraege.map((e) => e.begriff), ['Richtiger Begriff'],
    'Der verwaiste Begriff haette entfallen muessen');
  assertEqual(r.kategorien.map((k) => k.titel), ['Ohne Nummer'],
    'Leere Kategorie wurde nicht entfernt');
});

await test('die Suche findet Begriff und Inhalt', async () => {
  G._setze ? null : null;   // nichts - nur zur Deutlichkeit
  const alle = zerlegt.eintraege;
  const imBegriff = alle.filter((e) => e.suche.indexOf('camber') > -1);
  assert(imBegriff.length > 1, 'Camber kommt nur einmal vor - Suchfeld falsch gebaut?');
});

await test('Treffer im Begriff stehen vor Treffern im Text', async () => {
  // Wer "Camber" sucht, meint den Eintrag Camber - nicht die zwoelf anderen,
  // die ihn erwaehnen.
  const p = await oeffne();
  const r = await p.page.evaluate(async () => {
    await Glossar.laden();
    return Glossar.suchen('camber').slice(0, 3).map((e) => e.begriff);
  });
  await p.close();
  assert(/^Camber/.test(r[0]), 'Erster Treffer ist "' + r[0] + '"');
});

// ---------------------------------------------------------------------------
suite('Die Nachschlagekarte stuetzt sich auf die Konventionen');

await test('jeder Beleg steht in CONVENTIONS.md', async () => {
  const fehlend = [];
  for (const g of R.gruppen) {
    g.belege.forEach((b, i) => {
      if (b && !KONV.includes(b)) fehlend.push(g.id + '[' + i + ']: ' + b);
    });
  }
  assertEqual(fehlend, [], 'Beleg nicht in CONVENTIONS.md gefunden');
});

await test('kein Beleg geht in einem anderen Beleg auf', async () => {
  // Von einer Gegenprobe gefunden: "Cross % = (RF + LR) / Total" liess sich
  // zu "(LF + RR)" verfaelschen, ohne dass ein Test rot wurde. Die falsche
  // Fassung steht naemlich ebenfalls in CONVENTIONS.md - als Teil von
  // "Opposite Cross % = (LF + RR) / Total".
  //
  // Ein Beleg, der in einem anderen aufgeht, kann die beiden Zeilen nicht
  // auseinanderhalten: er ist dann erfuellt, egal welche gemeint war.
  // Geprueft wird das innerhalb einer Gruppe - zwischen Gruppen stoeren sich
  // gleichlautende Belege nicht.
  const schwach = [];
  for (const g of R.gruppen) {
    g.belege.forEach((b, i) => {
      if (!b) return;
      g.belege.forEach((anderer, j) => {
        if (i === j || !anderer || anderer === b) return;
        if (anderer.includes(b)) {
          schwach.push(g.id + ': "' + b + '" geht in "' + anderer + '" auf');
        }
      });
    });
  }
  assertEqual(schwach, [], 'Beleg kann seine Zeile nicht eindeutig belegen');
});

await test('gleiche Belege in einer Gruppe belegen nichts Einzelnes', async () => {
  // Die Evidenzklassen trugen sechsmal denselben Beleg "Evidenzgrade". Damit
  // war jede Zeile erfuellt, sobald das Wort irgendwo vorkam - die Zuordnung
  // Klasse zu Bedeutung war ungeprueft.
  const doppelt = [];
  for (const g of R.gruppen) {
    const gesehen = {};
    g.belege.forEach((b) => {
      if (!b) return;
      if (gesehen[b]) doppelt.push(g.id + ': "' + b + '" mehrfach');
      gesehen[b] = true;
    });
  }
  assertEqual(doppelt, [], 'Derselbe Beleg steht mehrfach in einer Gruppe');
});

await test('jede Zeile hat genau einen Beleg', async () => {
  // Ohne diese Pruefung koennten die Listen gegeneinander verrutschen: jeder
  // Beleg waere auffindbar, aber keiner gehoerte mehr zu seiner Zeile.
  const falsch = R.gruppen
    .filter((g) => g.zeilen.length !== g.belege.length)
    .map((g) => g.id + ': ' + g.zeilen.length + ' Zeilen, ' + g.belege.length + ' Belege');
  assertEqual(falsch, [], 'Zeilen und Belege laufen auseinander');
});

await test('jede Zeile hat so viele Zellen wie Spalten', async () => {
  const falsch = [];
  for (const g of R.gruppen) {
    g.zeilen.forEach((z, i) => {
      if (z.length !== g.spalten.length) {
        falsch.push(g.id + '[' + i + ']: ' + z.length + ' statt ' + g.spalten.length);
      }
    });
  }
  assertEqual(falsch, [], 'Zeile passt nicht zu den Spalten');
});

await test('die Radlastformeln stimmen mit messwerte.js ueberein', async () => {
  // Dieselben Formeln an zwei Orten - einmal gerechnet, einmal als Text.
  // Der Text muss die Rechnung beschreiben, sonst steht auf der Karte etwas
  // anderes, als die Seite ausgibt.
  const gruppe = R.gruppen.find((g) => g.id === 'ref-radlast');
  const cross = gruppe.zeilen.find((z) => z[0] === 'Cross %');
  assert(/RF \+ LR/.test(cross[1]), 'Cross-Formel auf der Karte: ' + cross[1]);

  const quelle = fs.readFileSync(path.join(REPO_ROOT, 'messwerte.js'), 'utf8');
  assert(/cross:\s*p\(rf \+ lr\)/.test(quelle),
    'messwerte.js rechnet Cross anders, als die Karte behauptet');
});

await test('die Evidenzgrade stimmen mit CONVENTIONS 16 ueberein', async () => {
  // In v1 standen im Stylesheet sechs Klassen A bis F mit frei erfundenen
  // Bedeutungen - "Ist-Befund am Fahrzeug", "eigener Messwert". Das Handbuch
  // kennt vier Grade, und zwar mit anderer Bedeutung. Fuenf Versionen lang
  // trug das Markup Kuerzel, die nichts belegten.
  //
  // Aufgefallen ist es erst, als die Nachschlagekarte sie gegen
  // CONVENTIONS.md belegen musste.
  const block = KONV.slice(KONV.indexOf('## 16. Evidenzgrade'), KONV.indexOf('## 17.'));
  const imHandbuch = [...block.matchAll(/^\|\s*`([A-Z])`\s*\|/gm)].map((m) => m[1]);
  assert(imHandbuch.length > 0, 'Keine Grade in CONVENTIONS 16 gefunden');

  const g = R.gruppen.find((x) => x.id === 'ref-evidenz');
  assert(g, 'Gruppe ref-evidenz fehlt');
  assertEqual(g.zeilen.map((z) => z[0]), imHandbuch, 'Grade auf der Karte');

  // Und im Stylesheet darf es keinen Grad geben, den das Handbuch nicht hat.
  const css = fs.readFileSync(path.join(REPO_ROOT, 'styles.css'), 'utf8');
  const imCss = [...css.matchAll(/\.src-([a-z])\s*\{/g)].map((m) => m[1].toUpperCase());
  const zuviel = imCss.filter((k) => !imHandbuch.includes(k));
  assertEqual(zuviel, [], 'Stylesheet kennt einen Grad, den CONVENTIONS nicht hat');
});

await test('Evidenzgrade werden nicht als Statusfarbe missbraucht', async () => {
  // Ein Grad ist eine Aussage ueber die Quelle eines Wertes. Als Farbtopf
  // fuer Statusanzeigen verwaessert er genau das - bis v5 stand an einer
  // offenen Diagnosehypothese ein "F" und an einem Messmittel ein "C".
  const dateien = ['werkstatt.js', 'diagnose-ui.js', 'messblatt.js',
                   'uebersicht.js', 'index.html', 'werkstatt.html',
                   'messblatt.html', 'diagnose.html'];
  const treffer = [];
  for (const d of dateien) {
    const inhalt = fs.readFileSync(path.join(REPO_ROOT, d), 'utf8');
    const m = inhalt.match(/class="src src-[a-f]"/g);
    if (m) treffer.push(d + ': ' + m.join(', '));
  }
  assertEqual(treffer, [], 'Evidenzgrad als Statusmarke verwendet');
});

await test('kein Vorzeichen steht verdreht da', async () => {
  // Ein verdrehtes Vorzeichen ist kein Messfehler, sondern das Gegenteil der
  // Aussage - und am Fahrzeug sofort spuerbar.
  const g = R.gruppen.find((x) => x.id === 'ref-vorzeichen');
  const camber = g.zeilen.find((z) => z[0] === 'Camber');
  assert(/innen/.test(camber[1]), 'Camber negativ: ' + camber[1]);
  assert(/au\u00dfen/.test(camber[2]), 'Camber positiv: ' + camber[2]);

  const toe = g.zeilen.find((z) => z[0] === 'Toe');
  assertEqual(toe[1], 'Toe-out', 'Toe negativ');
  assertEqual(toe[2], 'Toe-in', 'Toe positiv');
});

// ---------------------------------------------------------------------------
suite('Von jeder Seite erreichbar');

for (const datei of ['index.html', 'werkstatt.html', 'messblatt.html', 'diagnose.html']) {
  await test(datei + ' hat Knopfstapel und Suchfeld', async () => {
    const p = await oeffne(datei);
    const r = await p.page.evaluate(() => ({
      stapel: document.querySelectorAll('.fab-stack .fab-btn').length,
      suche: !!document.getElementById('sucheFeld')
    }));
    const fehler = p.fehler.slice();
    await p.close();
    assertEqual(fehler, [], 'Fehler beim Laden');
    assertEqual(r.stapel, 2, 'Knoepfe im Stapel');
    assertEqual(r.suche, true, 'Suchfeld fehlt');
  });
}

await test('der Stapel wird nicht doppelt gebaut', async () => {
  const p = await oeffne();
  const n = await p.page.evaluate(() => {
    // init() laeuft normalerweise einmal - ein zweiter Aufruf darf keinen
    // zweiten Stapel erzeugen.
    document.dispatchEvent(new Event('DOMContentLoaded'));
    return document.querySelectorAll('.fab-stack').length;
  });
  await p.close();
  assertEqual(n, 1, 'Mehrere Stapel');
});

// ---------------------------------------------------------------------------
suite('Das Glossar-Overlay');

await test('oeffnet und zeigt alle Begriffe', async () => {
  const p = await oeffne();
  await p.page.click('.fab-btn.glossar');
  await p.page.waitForTimeout(600);
  const r = await p.page.evaluate(() => ({
    offen: document.getElementById('ov-glossar').classList.contains('show'),
    eintraege: document.querySelectorAll('.glossar-eintrag').length,
    zahl: document.getElementById('glossarZahl').textContent
  }));
  await p.close();
  assertEqual(r.offen, true, 'Overlay nicht offen');
  assertEqual(r.eintraege, zerlegt.eintraege.length, 'Nicht alle Begriffe dargestellt');
  assert(/51/.test(r.zahl), 'Zaehler: ' + r.zahl);
});

await test('die Suche im Glossar filtert', async () => {
  const p = await oeffne();
  await p.page.click('.fab-btn.glossar');
  await p.page.waitForTimeout(600);
  await p.page.fill('#glossarSuche', 'bind');
  await p.page.waitForTimeout(200);
  const r = await p.page.evaluate(() => ({
    anzahl: document.querySelectorAll('.glossar-eintrag').length,
    erster: document.querySelector('.glossar-eintrag h3').textContent
  }));
  await p.close();
  assert(r.anzahl > 0 && r.anzahl < 51, 'Gefiltert auf ' + r.anzahl);
  assert(/Bind/i.test(r.erster), 'Erster Treffer: ' + r.erster);
});

await test('der Kategoriefilter wirkt', async () => {
  const p = await oeffne();
  await p.page.click('.fab-btn.glossar');
  await p.page.waitForTimeout(600);
  const r = await p.page.evaluate(() => {
    const kat = Glossar.kategorien()[0];
    glossarKategorie(kat.titel);
    return {
      erwartet: kat.anzahl,
      sichtbar: document.querySelectorAll('.glossar-eintrag').length
    };
  });
  await p.close();
  assertEqual(r.sichtbar, r.erwartet, 'Kategoriefilter');
});

await test('Markdown wird dargestellt, nicht als Zeichen ausgegeben', async () => {
  const p = await oeffne();
  await p.page.click('.fab-btn.glossar');
  await p.page.waitForTimeout(600);
  const r = await p.page.evaluate(() => {
    const e = document.querySelector('.glossar-eintrag');
    return { html: e.innerHTML, text: e.textContent };
  });
  await p.close();
  assert(/<strong>/.test(r.html), 'Fettdruck nicht umgesetzt');
  assert(!/\*\*/.test(r.text), 'Sternchen stehen noch im Text');
});

await test('HTML im Inhalt wird als Text dargestellt', async () => {
  const p = await oeffne();
  const r = await p.page.evaluate(() =>
    Nachschlagen.markdown('Ein <script>alert(1)</script> Versuch'));
  await p.close();
  assert(!/<script>/.test(r), 'Ungefiltertes HTML: ' + r);
  assert(/&lt;script&gt;/.test(r), 'Nicht escaped: ' + r);
});

// ---------------------------------------------------------------------------
suite('Die Nachschlagekarte als Overlay');

await test('oeffnet und zeigt alle Gruppen', async () => {
  const p = await oeffne();
  await p.page.click('.fab-btn.referenz');
  await p.page.waitForTimeout(300);
  const n = await p.page.evaluate(() =>
    document.querySelectorAll('#ov-referenz .ref-gruppe').length);
  await p.close();
  assertEqual(n, R.gruppen.length, 'Gruppen');
});

await test('eine Gruppe ohne Treffer verschwindet mit', async () => {
  // Sonst blieben leere Ueberschriften stehen.
  const p = await oeffne();
  await p.page.click('.fab-btn.referenz');
  await p.page.waitForTimeout(300);
  await p.page.fill('#referenzSuche', 'Cross');
  await p.page.waitForTimeout(200);
  const r = await p.page.evaluate(() => ({
    sichtbar: [...document.querySelectorAll('#ov-referenz .ref-gruppe')]
      .filter((g) => g.style.display !== 'none').length,
    zeilen: [...document.querySelectorAll('#ov-referenz .ref-zeile')]
      .filter((z) => z.style.display !== 'none').length
  }));
  await p.close();
  assert(r.sichtbar < 7, 'Alle Gruppen noch sichtbar');
  assert(r.zeilen > 0, 'Keine Zeile uebrig');
});

// ---------------------------------------------------------------------------
suite('Die Suche auf der Seite');

await test('hebt Treffer hervor und zaehlt sie', async () => {
  const p = await oeffne('werkstatt.html');
  const n = await p.page.evaluate(() => Nachschlagen.suchen('Phase'));
  const r = await p.page.evaluate(() => ({
    marken: document.querySelectorAll('mark.suche-treffer').length,
    aktiv: document.querySelectorAll('mark.suche-treffer.aktiv').length,
    zahl: document.getElementById('sucheZahl').textContent
  }));
  await p.close();
  assert(n > 0, 'Kein Treffer fuer "Phase"');
  assertEqual(r.marken, n, 'Marken und Zaehlung weichen ab');
  assertEqual(r.aktiv, 1, 'Genau ein Treffer muss aktiv sein');
  assert(/1 \/ /.test(r.zahl), 'Zaehler: ' + r.zahl);
});

await test('ein zweiter Lauf entfernt die alten Marken', async () => {
  // Ohne das stapeln sich die Hervorhebungen, und der Zaehler stimmt nicht
  // mehr mit dem ueberein, was man sieht.
  const p = await oeffne('werkstatt.html');
  const r = await p.page.evaluate(() => {
    Nachschlagen.suchen('Phase');
    const ersterLauf = document.querySelectorAll('mark.suche-treffer').length;
    Nachschlagen.suchen('Phase');
    return { ersterLauf, zweiterLauf: document.querySelectorAll('mark.suche-treffer').length };
  });
  await p.close();
  assertEqual(r.zweiterLauf, r.ersterLauf, 'Marken haben sich gestapelt');
});

await test('unter zwei Zeichen wird nicht gesucht', async () => {
  // Ein einzelner Buchstabe trifft fast jeden Textknoten - das waere kein
  // Ergebnis, sondern eine eingefaerbte Seite.
  const p = await oeffne('werkstatt.html');
  const n = await p.page.evaluate(() => Nachschlagen.suchen('P'));
  await p.close();
  assertEqual(n, 0, 'Bei einem Zeichen wurde gesucht');
});

await test('Leeren entfernt alle Marken', async () => {
  const p = await oeffne('werkstatt.html');
  const n = await p.page.evaluate(() => {
    Nachschlagen.suchen('Phase');
    sucheLeeren();
    return document.querySelectorAll('mark.suche-treffer').length;
  });
  await p.close();
  assertEqual(n, 0, 'Marken nach dem Leeren');
});

await test('ein Treffer in einem eingeklappten Abschnitt wird aufgeklappt', async () => {
  // Sonst springt man ins Nichts: der Treffer ist da, aber unsichtbar.
  const p = await oeffne('messblatt.html');
  const r = await p.page.evaluate(() => {
    document.querySelectorAll('#blattListe .section-body').forEach((b) => {
      b.classList.add('collapsed');
    });
    const n = Nachschlagen.suchen('Castor');
    const aktiv = document.querySelector('mark.suche-treffer.aktiv');
    const koerper = aktiv ? aktiv.closest('.section-body') : null;
    return { n, zu: koerper ? koerper.classList.contains('collapsed') : null };
  });
  await p.close();
  assert(r.n > 0, 'Kein Treffer fuer "Castor"');
  assertEqual(r.zu, false, 'Der Abschnitt blieb zugeklappt');
});

// ---------------------------------------------------------------------------
suite('Glossar und Handbuch als weitere Suchquellen');

await test('ein Glossarbegriff erscheint unter dem Suchfeld', async () => {
  // Die Suche auf der Seite findet nur, was gerade dasteht. Wer in der
  // Werkstatt nach "Thrust Angle" sucht, meint aber meist den Begriff.
  const p = await oeffne('werkstatt.html');
  const r = await p.page.evaluate(async () => {
    await Glossar.laden();
    Nachschlagen.suchen('Thrust Angle');
    const q = document.getElementById('sucheQuellen');
    return { sichtbar: q.style.display !== 'none', text: q.textContent };
  });
  await p.close();
  assert(r.sichtbar, 'Trefferliste bleibt versteckt');
  assert(/Glossar/.test(r.text), 'Keine Glossargruppe: ' + r.text.slice(0, 200));
  assert(/Thrust Angle/.test(r.text), 'Begriff fehlt');
});

await test('Kapiteltreffer nennen die Fundstelle, nicht nur den Titel', async () => {
  // Ein Kapitelname allein sagt nicht, ob sich das Oeffnen lohnt.
  const p = await oeffne('werkstatt.html');
  const r = await p.page.evaluate(async () => {
    await Kapitel.alleLaden();
    Nachschlagen.suchen('Bump Steer');
    const q = document.getElementById('sucheQuellen');
    return {
      text: q.textContent,
      stellen: q.querySelectorAll('.sq-stelle').length,
      verweise: [...q.querySelectorAll('a')].map((a) => a.getAttribute('href'))
    };
  });
  await p.close();
  assert(/Handbuch/.test(r.text), 'Keine Handbuchgruppe');
  assert(r.stellen > 0, 'Keine Textstelle mitgeliefert');
  assert(r.verweise.every((h) => h.startsWith('handbuch.html?d=')),
    'Verweis zeigt nicht ins Handbuch: ' + r.verweise.join(', '));
});

await test('die Markierungen im Text bleiben davon unberuehrt', async () => {
  // Zwei verschiedene Fragen, zwei Darstellungen: "wo steht das hier" und
  // "wo ist das erklaert". Die eine darf die andere nicht ersetzen.
  const p = await oeffne('werkstatt.html');
  const r = await p.page.evaluate(async () => {
    await Kapitel.alleLaden();
    const n = Nachschlagen.suchen('Phase');
    return { treffer: n, marken: document.querySelectorAll('mark.suche-treffer').length,
             quellen: document.getElementById('sucheQuellen').style.display !== 'none' };
  });
  await p.close();
  assert(r.marken > 0, 'Keine Markierungen im Text');
  assertEqual(r.marken, r.treffer, 'Zaehlung und Markierungen weichen ab');
  assert(r.quellen, 'Die weiteren Quellen fehlen');
});

await test('Leeren schliesst auch die Trefferliste', async () => {
  const p = await oeffne('werkstatt.html');
  const sichtbar = await p.page.evaluate(async () => {
    await Kapitel.alleLaden();
    Nachschlagen.suchen('Castor');
    sucheLeeren();
    return document.getElementById('sucheQuellen').style.display !== 'none';
  });
  await p.close();
  assertEqual(sichtbar, false, 'Trefferliste blieb stehen');
});

await test('ein Klick daneben schliesst die Trefferliste', async () => {
  // Sonst steht sie ueber dem Inhalt, den man gerade lesen wollte.
  //
  // Der Klick wird ausgeloest, nicht geklickt: page.click() wartet darauf,
  // dass die Stelle frei liegt - und die Trefferliste deckt sie gerade ab.
  // Genau das ist ja der Zustand, der hier geprueft wird.
  const p = await oeffne('werkstatt.html');
  const sichtbar = await p.page.evaluate(async () => {
    await Kapitel.alleLaden();
    Nachschlagen.suchen('Castor');
    document.getElementById('mainContent')
      .dispatchEvent(new MouseEvent('click', { bubbles: true }));
    return document.getElementById('sucheQuellen').style.display !== 'none';
  });
  await p.close();
  assertEqual(sichtbar, false, 'Trefferliste blieb nach dem Klick stehen');
});

await test('ein Wort ohne Treffer zeigt keine leere Liste', async () => {
  const p = await oeffne('werkstatt.html');
  const r = await p.page.evaluate(async () => {
    await Kapitel.alleLaden();
    await Glossar.laden();
    Nachschlagen.suchen('zwirbelwurst');
    const q = document.getElementById('sucheQuellen');
    return { sichtbar: q.style.display !== 'none', text: q.textContent };
  });
  await p.close();
  assertEqual(r.sichtbar, false, 'Leere Liste wird angezeigt: "' + r.text + '"');
});

await test('die Kapitel sind da, bevor jemand tippt', async () => {
  // Die uebrigen Tests rufen Kapitel.alleLaden() selbst auf - sie pruefen
  // damit das Suchen, nicht das Vorladen. Eine Gegenprobe zeigte das: mit
  // ausgebautem Vorladen blieben sie gruen, waehrend die Handbuchtreffer in
  // Wirklichkeit fehlten.
  //
  // Hier wird darum nur gewartet, wie ein Nutzer auch, und dann gesucht.
  const p = await oeffne('werkstatt.html');
  await p.page.waitForTimeout(1200);
  const r = await p.page.evaluate(() => {
    const geladen = Object.keys(Kapitel.geladen()).length;
    Nachschlagen.suchen('Castor');
    return { geladen, text: document.getElementById('sucheQuellen').textContent };
  });
  await p.close();
  assertEqual(r.geladen, K_ANZAHL, 'Kapitel wurden nicht vorgeladen');
  assert(/Handbuch/.test(r.text), 'Keine Handbuchtreffer ohne eigenes Laden');
});

await test('der Behaelter wird auf jeder Seite gebaut', async () => {
  for (const datei of ['index.html', 'werkstatt.html', 'messblatt.html',
                       'bumpsteer.html', 'diagnose.html', 'handbuch.html']) {
    const p = await oeffne(datei);
    const r = await p.page.evaluate(() => ({
      behaelter: document.querySelectorAll('#sucheQuellen').length,
      kapitel: typeof Kapitel !== 'undefined'
    }));
    await p.close();
    assertEqual(r.behaelter, 1, datei + ': Behaelter fehlt oder steht doppelt');
    assertEqual(r.kapitel, true, datei + ': kapitel.js nicht geladen');
  }
});

await test('die Suche fasst keine Skripte an', async () => {
  // Die erste Fassung dieses Tests suchte in #mainContent nach "function"
  // und prueft auf Marken in <script>. Dort stehen aber gar keine Skripte -
  // der Test war auch ohne Filter gruen und haette nie etwas gefunden.
  //
  // Jetzt wird ein Skript- und ein Stilblock eigens in den Suchbereich
  // gestellt, mit einem Wort, das sonst nirgends vorkommt.
  const p = await oeffne('werkstatt.html');
  const r = await p.page.evaluate(() => {
    const wurzel = document.getElementById('mainContent');
    const s = document.createElement('script');
    s.type = 'text/plain';
    s.textContent = 'var zwirbelwurst = 1;';
    wurzel.appendChild(s);
    const st = document.createElement('style');
    st.textContent = '/* zwirbelwurst */';
    wurzel.appendChild(st);

    const p2 = document.createElement('p');
    p2.textContent = 'sichtbare zwirbelwurst';
    wurzel.appendChild(p2);

    const treffer = Nachschlagen.suchen('zwirbelwurst');
    return {
      treffer,
      inSkript: wurzel.querySelectorAll('script mark, style mark').length
    };
  });
  await p.close();
  assertEqual(r.treffer, 1, 'Nur der sichtbare Treffer darf gezaehlt werden');
  assertEqual(r.inSkript, 0, 'Marke in einem Skript- oder Stilblock');
});

} finally {
  await browser.close();
  server.close();
}

process.exit(summary() === 0 ? 0 : 1);
