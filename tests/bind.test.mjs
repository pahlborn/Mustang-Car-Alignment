// Tests fuer bind.js - die vier Bind-Tests aus CHAPTER_BIND_DIAGNOSIS.md 6.
//
// Bind ist eine Verspannung, die verhindert, dass sich die Aufhaengung in
// ihre kraeftefreie Lage setzt. Das Glossar sagt dazu: "Bind erzeugt keine
// Fehlermeldung. Erst die Wiederholungsmessung verraet ihn. Wer bei
// vorhandenem Bind Setup-Arbeit macht, optimiert gegen ein Rauschen."
//
// Darum prueft dieses Modul nicht nur, sondern sperrt - Projektregel 1 aus
// Kapitel 8: "Ohne bestandenen Test keine Zehntelarbeit."
//
// Laeuft ohne Browser.
//
// Lokal: node tests/bind.test.mjs

import fs from 'node:fs';
import path from 'node:path';
import { REPO_ROOT, suite, test, assert, assertEqual, summary } from './helpers.mjs';

new Function(fs.readFileSync(path.join(REPO_ROOT, 'bind.js'), 'utf8'))();
const B = globalThis.Bind;

const KAP = fs.readFileSync(
  path.join(REPO_ROOT, 'handbuch', 'CHAPTER_BIND_DIAGNOSIS.md'), 'utf8');

function nahe(a, b, eps = 1e-9) {
  assert(a !== null && a !== undefined, 'Ergebnis ist null');
  assert(Math.abs(a - b) < eps, 'erwartet ' + b + ', war ' + a);
}

/** Drei Durchgaenge als Datensatz. */
function reihen(...saetze) {
  const d = {};
  saetze.forEach((w, i) => {
    B.RAEDER.forEach((r, k) => { d[B.feldRadlast(i + 1, r)] = w[k]; });
  });
  return d;
}

const SAUBER = reihen([310, 305, 290, 295], [311, 304, 290, 296], [310, 305, 291, 294]);

try {

// ---------------------------------------------------------------------------
suite('Die Schwellen stammen aus dem Kapitel');

await test('0,5 und 1 Prozent stehen so im Handbuch', async () => {
  assert(/0,5\s*%\s*der Gesamtmasse/.test(KAP), 'Untere Schwelle nicht im Kapitel');
  assert(/\|\s*\*\*>\s*1\s*%\*\*/.test(KAP), 'Obere Schwelle nicht im Kapitel');
  assertEqual(B.SCHWELLE_GUT, 0.5, 'Untere Schwelle');
  assertEqual(B.SCHWELLE_BIND, 1.0, 'Obere Schwelle');
});

await test('sie sind als Projektfestlegung markiert', async () => {
  // Keine Herstellerangabe - das Kapitel sagt es ausdruecklich, und es
  // gehoert in den Code, damit niemand sie fuer belegt haelt.
  assert(/Projektfestlegung/.test(KAP), 'Der Vermerk fehlt im Kapitel');
  const quelle = fs.readFileSync(path.join(REPO_ROOT, 'bind.js'), 'utf8');
  assert(/Projektfestlegung/.test(quelle), 'Der Vermerk fehlt im Code');
});

await test('die drei Bewertungsstufen entsprechen der Tabelle', async () => {
  assertEqual(B.bewerten(0.4), 'gut', 'unter 0,5 %');
  assertEqual(B.bewerten(0.5), 'grenzwertig', 'genau 0,5 %');
  assertEqual(B.bewerten(0.9), 'grenzwertig', 'zwischen 0,5 und 1 %');
  assertEqual(B.bewerten(1.0), 'grenzwertig', 'genau 1 %');
  assertEqual(B.bewerten(1.1), 'bind', 'ueber 1 %');
});

await test('nur die oberste Stufe sperrt', async () => {
  assertEqual(B.BEWERTUNG.gut.sperrt, false, 'gut');
  assertEqual(B.BEWERTUNG.grenzwertig.sperrt, false, 'grenzwertig');
  assertEqual(B.BEWERTUNG.bind.sperrt, true, 'bind');
});

// ---------------------------------------------------------------------------
suite('6.1 Reproduzierbarkeit');

await test('die Streuung wird je Ecke auf die Gesamtmasse bezogen', async () => {
  const r = B.reproduzierbarkeit(SAUBER);
  const rr = r.ecken.find((e) => e.rad === 'RR');
  nahe(rr.spanne, 2);                       // 296 - 294
  nahe(rr.prozent, 2 / 1200 * 100, 1e-9);   // Gesamtmasse aus Durchgang A
  nahe(r.maxProzent, rr.prozent, 1e-9);
});

await test('eine saubere Reihe gilt als gut', async () => {
  const r = B.reproduzierbarkeit(SAUBER);
  assertEqual(r.bewertung, 'gut', 'Bewertung');
  assertEqual(r.vollstaendig, true, 'Drei Durchgaenge');
});

await test('starke Streuung ergibt Bind', async () => {
  const r = B.reproduzierbarkeit(
    reihen([310, 305, 290, 295], [325, 292, 301, 282], [312, 303, 288, 297]));
  assertEqual(r.bewertung, 'bind', 'Bewertung');
});

await test('zwei Durchgaenge reichen nicht fuer die Aussage', async () => {
  // Das Kapitel verlangt drei. Mit zweien laesst sich eine Spanne bilden,
  // aber keine Aussage ueber Reproduzierbarkeit treffen.
  const r = B.reproduzierbarkeit(reihen([310, 305, 290, 295], [311, 304, 290, 296]));
  assert(r, 'Mit zwei Durchgaengen wird gar nicht gerechnet');
  assertEqual(r.vollstaendig, false, 'Zwei gelten als vollstaendig');
  assertEqual(r.durchgaenge, 2, 'Anzahl');
});

await test('ein Durchgang ergibt nichts', async () => {
  assertEqual(B.reproduzierbarkeit(reihen([310, 305, 290, 295])), null, 'Ein Durchgang');
  assertEqual(B.reproduzierbarkeit({}), null, 'Leer');
});

await test('eine unvollstaendige Ecke laesst den Durchgang entfallen', async () => {
  // Drei von vier Werten ergeben keine brauchbare Summe - der Durchgang
  // zaehlt nicht mit, statt mit einer Luecke zu rechnen.
  const d = reihen([310, 305, 290, 295], [311, 304, 290, 296], [310, 305, 291, 294]);
  delete d[B.feldRadlast(2, 'RF')];
  const r = B.reproduzierbarkeit(d);
  assertEqual(r.durchgaenge, 2, 'Der unvollstaendige Durchgang zaehlt mit');
});

// ---------------------------------------------------------------------------
suite('6.1 Zusatz: wandert Last diagonal?');

await test('die drei Masse stehen so im Kapitel', async () => {
  assert(/Diagonalma/.test(KAP), 'Diagonalmass nicht im Kapitel');
  assert(/L\u00e4ngsma/.test(KAP), 'Laengsmass nicht im Kapitel');
  assert(/Querma/.test(KAP), 'Quermass nicht im Kapitel');
});

await test('das Diagonalmass folgt der Formel', async () => {
  // D = (dLF + dRR) - (dRF + dLR), alles gegenueber Messung A.
  const r = B.reproduzierbarkeit(
    reihen([300, 300, 300, 300], [310, 290, 290, 310]));
  const x = r.richtungen.proDurchgang[0];
  nahe(x.diagonal, (10 + 10) - (-10 + -10));   // 40
  nahe(x.laengs, (10 + -10) - (-10 + 10));     // 0
  nahe(x.quer, (10 + -10) - (-10 + 10));       // 0
});

await test('reines Messrauschen erzeugt kein grosses Diagonalmass', async () => {
  // Der eigentliche Grund fuer die Umstellung: die frueher vorgesehene
  // Auswertung ueber das Cross Weight in Prozent schlug bei dieser Reihe
  // an, weil die Gesamtmasse um 1 kg schwankt und damit der Nenner.
  const r = B.reproduzierbarkeit(SAUBER);
  assert(r.richtungen.maxDiagonal < 5,
    'Diagonalmass bei Rauschen: ' + r.richtungen.maxDiagonal);
  assert(r.masse.spanne <= 1, 'Gesamtmasse schwankt staerker als gedacht');
});

await test('eine Diagonalverspannung hebt sich deutlich ab', async () => {
  // Zwei Ecken drücken, die diagonal gegenueberliegenden entlasten -
  // Laengs und Quer bleiben ruhig. Genau diese Signatur beschreibt das
  // Kapitel.
  const r = B.reproduzierbarkeit(
    reihen([310, 305, 290, 295], [322, 293, 278, 307], [311, 304, 289, 296]));
  assert(r.richtungen.maxDiagonal > 40, 'Diagonalmass: ' + r.richtungen.maxDiagonal);
  nahe(r.richtungen.maxLaengs, 0, 1e-9);
  nahe(r.richtungen.maxQuer, 0, 1e-9);
});

await test('eine Laengsverschiebung ist kein Diagonaleffekt', async () => {
  // Beide Vorderraeder mehr, beide hinteren weniger - das Fahrzeug setzt
  // sich anders, aber nichts ist verspannt.
  const r = B.reproduzierbarkeit(
    reihen([300, 300, 300, 300], [310, 310, 290, 290]));
  const x = r.richtungen.proDurchgang[0];
  nahe(x.diagonal, 0, 1e-9);
  nahe(x.laengs, 40, 1e-9);
});

await test('das Diagonalmass sperrt nicht', async () => {
  // Seine Schwelle ist im Kapitel ausdruecklich offen, bis reale
  // Messreihen vorliegen. Eine Zahl ohne Datengrundlage waere hier
  // genauso wertlos wie ein geratener Sollwert.
  assert(/Schwelle noch offen/.test(KAP), 'Der Vorbehalt fehlt im Kapitel');
  const d = reihen([310, 305, 290, 295], [322, 293, 278, 307], [311, 304, 289, 296]);
  const bf = B.befund(d);
  assert(bf.reproduzierbarkeit.richtungen.maxDiagonal > 40, 'Testfall taugt nicht');
  assertEqual(bf.sperrt, false, 'Das Diagonalmass hat gesperrt');
});

await test('es wird nicht mehr ueber Cross in Prozent ausgewertet', async () => {
  // Cross ist (RF + LR) / Total. Schwankt die Gesamtmasse, bewegt sich der
  // Nenner mit - und erzeugt eine scheinbare Streuung, ohne dass Last
  // gewandert waere.
  const quelle = fs.readFileSync(path.join(REPO_ROOT, 'bind.js'), 'utf8')
    .split(/\r?\n/).filter((z) => !/^\s*(\/\/|\*|\/\*)/.test(z)).join('\n');
  assert(!/crossSpanne|crossWerte|diagonalerEffekt/.test(quelle),
    'Die alte Cross-Auswertung steht noch im Code');
  assert(!/Streut das Cross Weight/.test(KAP),
    'Der alte Satz steht noch im Kapitel');
});

// ---------------------------------------------------------------------------
suite('6.2 Camber-Bind');

await test('die Differenz vorher/nachher wird ausgewiesen', async () => {
  const r = B.camberBind({
    bind_cb_vor_lf: 310, bind_cb_vor_rf: 305, bind_cb_vor_lr: 290, bind_cb_vor_rr: 295,
    bind_cb_nach_lf: 315, bind_cb_nach_rf: 306, bind_cb_nach_lr: 290, bind_cb_nach_rr: 295
  });
  const lf = r.ecken.find((e) => e.rad === 'LF');
  nahe(lf.differenz, 5);
  nahe(lf.prozent, 5 / 1200 * 100, 1e-9);
  nahe(r.maxProzent, 5 / 1200 * 100, 1e-9);
  assertEqual(r.bewertung, 'gut', 'Bewertung bei 0,42 %');
});

await test('eine fehlende Messung ergibt nichts', async () => {
  assertEqual(B.camberBind({ bind_cb_vor_lf: 310 }), null, 'Unvollstaendig');
});

// ---------------------------------------------------------------------------
suite('6.3 Laterale Ueberbestimmung');

await test('die vier Deutungen stehen so im Kapitel', async () => {
  assert(/kein lateraler Bind/.test(KAP), 'Deutung 1');
  assert(/verspannt eingebaut/.test(KAP), 'Deutung 2');
  assert(/Panhard-L\u00e4nge falsch/.test(KAP), 'Deutung 3');
  assert(/mehrfacher Bind/.test(KAP), 'Deutung 4');
  assertEqual(B.LATERAL_DEUTUNG.length, 4, 'Anzahl');
});

function lateral(a, b, c) {
  const d = {};
  [['a', a], ['b', b], ['c', c]].forEach(([m, w]) => {
    B.RAEDER.forEach((r, i) => { d['bind_lat_' + m + '_' + r.toLowerCase()] = w[i]; });
  });
  return B.lateral(d);
}

await test('A gleich B gleich C: kein Bind', async () => {
  const r = lateral([310, 305, 290, 295], [310, 305, 290, 295], [310, 305, 290, 295]);
  assertEqual(r.deutung.id, 'kein_bind', 'Deutung');
  assertEqual(r.deutung.sperrt, false, 'sperrt');
});

await test('A ungleich B, B gleich C: Panhard war verspannt eingebaut', async () => {
  const r = lateral([310, 305, 290, 295], [310, 305, 275, 310], [310, 305, 275, 310]);
  assertEqual(r.deutung.id, 'verspannt_eingebaut', 'Deutung');
  assertEqual(r.deutung.sperrt, true, 'sperrt');
});

await test('A gleich B, B ungleich C: Panhard-Laenge falsch', async () => {
  // Das Anschliessen selbst erzeugt die Verspannung - der Bolzen passt
  // nicht kraftfrei. Das Kapitel nennt es direkt sichtbare
  // Ueberbestimmung.
  const r = lateral([310, 305, 290, 295], [310, 305, 290, 295], [310, 305, 275, 310]);
  assertEqual(r.deutung.id, 'laenge_falsch', 'Deutung');
  assertEqual(r.deutung.sperrt, true, 'sperrt');
});

await test('alle verschieden: mehrfacher Bind', async () => {
  const r = lateral([310, 305, 290, 295], [320, 295, 280, 305], [300, 315, 300, 285]);
  assertEqual(r.deutung.id, 'mehrfach', 'Deutung');
  assertEqual(r.deutung.sperrt, true, 'sperrt');
});

await test('kleine Abweichungen gelten als gleich', async () => {
  // Unterhalb der Schwelle aus 6.1 - dieselbe Groessenordnung, dieselbe
  // Begruendung. Sonst meldete jede Messreihe mehrfachen Bind.
  const r = lateral([310, 305, 290, 295], [311, 304, 290, 296], [310, 306, 290, 294]);
  assertEqual(r.deutung.id, 'kein_bind', 'Deutung');
});

// ---------------------------------------------------------------------------
suite('6.4 Hysterese');

await test('die Differenz wird je Seite gebildet', async () => {
  const r = B.hysterese({
    bind_hy_belastet_l: 180, bind_hy_entlastet_l: 183,
    bind_hy_belastet_r: 181, bind_hy_entlastet_r: 183
  });
  nahe(r.seiten[0].hysterese, 3);
  nahe(r.seiten[1].hysterese, 2);
  nahe(r.differenz, 1);
  assertEqual(r.groessere, 'L', 'Die groessere Seite');
});

await test('gleiche Hysterese links und rechts ist unauffaellig', async () => {
  // Bei Blattfedern bauartbedingt normal - entscheidend ist die Symmetrie.
  const r = B.hysterese({
    bind_hy_belastet_l: 180, bind_hy_entlastet_l: 184,
    bind_hy_belastet_r: 181, bind_hy_entlastet_r: 185
  });
  nahe(r.differenz, 0);
  assertEqual(r.groessere, null, 'Keine Seite sticht hervor');
});

await test('die Hysterese wird nicht bewertet', async () => {
  // Das Kapitel nennt keine absolute Schwelle - nur, dass die Seiten
  // aehnlich sein sollen. Eine erfundene Grenze waere ein Sollwert ohne
  // Quelle.
  const quelle = fs.readFileSync(path.join(REPO_ROOT, 'bind.js'), 'utf8')
    .split(/\r?\n/).filter((z) => !/^\s*(\/\/|\*|\/\*)/.test(z)).join('\n');
  for (const wort of ['SCHWELLE_HYSTERESE', 'MAX_HYSTERESE', 'hysterese_grenze']) {
    assert(!quelle.includes(wort), 'Schwelle im Code: ' + wort);
  }
});

// ---------------------------------------------------------------------------
suite('Der Gesamtbefund sperrt die Setup-Arbeit');

await test('Projektregel 1 steht im Kapitel', async () => {
  assert(/Ohne bestandenen Test keine Zehntelarbeit/.test(KAP),
    'Die Regel fehlt im Kapitel');
  assert(/Keine Setup-Schl\u00fcsse\*\* aus Messungen mit bekanntem Bind/.test(KAP),
    'Regel 6 fehlt im Kapitel');
});

await test('eine saubere Messung sperrt nicht', async () => {
  const bf = B.befund(SAUBER);
  assertEqual(bf.sperrt, false, 'sperrt');
  assertEqual(bf.geprueft, true, 'geprueft');
  assertEqual(bf.gruende, [], 'Gruende');
});

await test('Streuung ueber einem Prozent sperrt', async () => {
  const bf = B.befund(
    reihen([310, 305, 290, 295], [325, 292, 301, 282], [312, 303, 288, 297]));
  assertEqual(bf.sperrt, true, 'sperrt');
  assert(/streuen/.test(bf.gruende[0]), 'Grund: ' + bf.gruende[0]);
  assert(/1 %/.test(bf.gruende[0]), 'Die Schwelle wird nicht genannt');
});

await test('ein lateraler Befund sperrt ebenfalls', async () => {
  const d = Object.assign({}, SAUBER);
  [['a', [310, 305, 290, 295]], ['b', [310, 305, 290, 295]], ['c', [310, 305, 275, 310]]]
    .forEach(([m, w]) => {
      B.RAEDER.forEach((r, i) => { d['bind_lat_' + m + '_' + r.toLowerCase()] = w[i]; });
    });
  const bf = B.befund(d);
  assertEqual(bf.sperrt, true, 'sperrt');
  assert(/Hinterachse/.test(bf.gruende.join(' ')), 'Grund fehlt');
});

await test('nicht geprueft ist etwas anderes als bestanden', async () => {
  // Ein fehlender Test sperrt nicht - er fehlt. Das wird eigens gemeldet,
  // damit niemand "nicht gesperrt" fuer "geprueft" haelt.
  const bf = B.befund({});
  assertEqual(bf.geprueft, false, 'geprueft');
  assertEqual(bf.sperrt, false, 'Ein fehlender Test sperrt');
});

await test('zwei Durchgaenge gelten noch nicht als geprueft', async () => {
  const bf = B.befund(reihen([310, 305, 290, 295], [311, 304, 290, 296]));
  assertEqual(bf.geprueft, false, 'Zwei Durchgaenge gelten als geprueft');
});

} finally {
  // kein Server, kein Browser
}

process.exit(summary() === 0 ? 0 : 1);
