// Tests fuer rollsteifigkeit.js.
//
// Die Formeln stehen in CHAPTER_SPRINGS_ROLL_STIFFNESS.md 3.1 bis 3.4 und
// werden dagegen geprueft - samt der Faktortabelle, die das Kapitel fuer das
// Motion Ratio angibt.
//
// Der wichtigste Test ist aber ein anderer: dass nichts gerechnet wird,
// solange ein Eingangswert fehlt. Vier Werte dieses Fahrzeugs sind nicht
// gemessen, und das Kapitel sagt ausdruecklich, dass jede Rechnung ohne sie
// eine Schaetzung waere. Eine plausibel aussehende Zahl traege sonst eine
// Balanceentscheidung, die auf einer Annahme beruht.
//
// Laeuft ohne Browser.
//
// Lokal: node tests/rollsteifigkeit.test.mjs

import fs from 'node:fs';
import path from 'node:path';
import { REPO_ROOT, suite, test, assert, assertEqual, summary } from './helpers.mjs';

new Function(fs.readFileSync(path.join(REPO_ROOT, 'rollsteifigkeit.js'), 'utf8'))();
const R = globalThis.Rollsteifigkeit;

const KAP = fs.readFileSync(
  path.join(REPO_ROOT, 'handbuch', 'CHAPTER_SPRINGS_ROLL_STIFFNESS.md'), 'utf8');
const PROJ = fs.readFileSync(path.join(REPO_ROOT, 'handbuch', '00_PROJECT.md'), 'utf8');

function nahe(a, b, eps = 1e-9) {
  assert(a !== null && a !== undefined, 'Ergebnis ist null');
  assert(Math.abs(a - b) < eps, 'erwartet ' + b + ', war ' + a);
}

/** Datensatz, bei dem alles vorliegt. Nur fuer die Rechenpruefung. */
function vollstaendig(extra) {
  return Object.assign({
    spring_front_rate: 30,
    motion_ratio_front: 0.6,
    track_front: 1430,
    leaf_rate: 175,
    leaf_spacing_rear: 1100
  }, extra || {});
}

try {

// ---------------------------------------------------------------------------
suite('Die Formeln stehen im Kapitel');

await test('k_Rad = k_Feder mal MR hoch zwei', async () => {
  assert(KAP.includes('k_Rad = k_Feder'), 'Formel nicht im Kapitel');
  nahe(R.radrate(100, 0.5), 25);
  nahe(R.radrate(100, 1), 100);
});

await test('die Faktortabelle des Kapitels stimmt', async () => {
  // Das Kapitel nennt fuenf Werte mit ihrem Faktor. Sie sind der Beleg
  // dafuer, dass das Quadrat gemeint ist und nicht der lineare Wert.
  const block = KAP.slice(KAP.indexOf('### 3.1 Motion Ratio'), KAP.indexOf('### 3.2'));
  const zeilen = [...block.matchAll(/\|\s*([01],\d{2})\s*\|\s*\*?\*?([01],\d{2})\*?\*?\s*\|/g)]
    .map((m) => [Number(m[1].replace(',', '.')), Number(m[2].replace(',', '.'))]);
  assert(zeilen.length >= 5, 'Nur ' + zeilen.length + ' Zeilen gefunden');

  for (const [mr, faktor] of zeilen) {
    const gerechnet = R.radrate(100, mr) / 100;
    assert(Math.abs(gerechnet - faktor) < 0.005,
      'MR ' + mr + ': Kapitel sagt ' + faktor + ', gerechnet ' + gerechnet.toFixed(3));
  }
});

await test('K_roll = k_Rad mal t hoch zwei durch zwei', async () => {
  assert(KAP.includes('K_roll,Feder = (k_Rad'), 'Formel nicht im Kapitel');
  // 10 N/mm = 10000 N/m, Spurweite 1,4 m: (10000 * 1,96) / 2 = 9800 Nm/rad
  const r = R.rollsteifigkeit(10, 1400);
  nahe(r.proRad, 9800, 1e-6);
  nahe(r.proGrad, 9800 / (180 / Math.PI), 1e-6);
});

await test('die Spurweite geht quadratisch ein', async () => {
  // Das Kapitel betont es eigens - es ist der Grund, warum das LCA Camber
  // Kit nicht nur Camber veraendert.
  const schmal = R.rollsteifigkeit(10, 1000);
  const breit = R.rollsteifigkeit(10, 2000);
  nahe(breit.proRad / schmal.proRad, 4, 1e-9);
});

await test('TLLTD = vorn geteilt durch die Summe', async () => {
  assert(KAP.includes('TLLTD = K_roll,vorn'), 'Formel nicht im Kapitel');
  const t = R.tlltd({ gesamtProGrad: 300, mitArb: false },
                    { gesamtProGrad: 100, mitArb: false });
  nahe(t.anteilVorn, 0.75);
  nahe(t.anteilHinten, 0.25);
});

await test('die beiden Anteile ergeben zusammen eins', async () => {
  const t = R.tlltd({ gesamtProGrad: 193, mitArb: false },
                    { gesamtProGrad: 323, mitArb: false });
  nahe(t.anteilVorn + t.anteilHinten, 1, 1e-12);
});

await test('der Stabilisator kommt additiv dazu', async () => {
  // Kapitel 3.3: K_roll,gesamt = K_roll,Feder + K_roll,Stabi. Er wirkt nur
  // bei gegensinnigem Federn, also genau bei Rollbewegung.
  assert(KAP.includes('K_roll,gesamt = K_roll,Feder + K_roll,Stabi'),
    'Formel nicht im Kapitel');
  const ohne = R.achse(30, 0.6, 1430, null);
  const mit = R.achse(30, 0.6, 1430, 400);
  nahe(mit.gesamtProGrad - ohne.gesamtProGrad, 400, 1e-9);
});

await test('M_roll = m mal a mal h_CG, linear in der Hoehe', async () => {
  assert(/M_roll\s*=\s*m\s*[\u00b7*]\s*a_y\s*[\u00b7*]\s*h_CG/.test(KAP)
      || KAP.includes('m � a_y � h_CG') || KAP.includes('h_CG'),
    'Formel nicht im Kapitel');
  const a = R.rollmoment(1200, 500, 1);
  const b = R.rollmoment(1200, 1000, 1);
  nahe(b / a, 2, 1e-9);
});

// ---------------------------------------------------------------------------
suite('Ohne Messwert wird nicht gerechnet');

await test('ein leerer Datensatz ergibt nichts', async () => {
  const a = R.auswerten({});
  assertEqual(a.vorn, null, 'Vorderachse');
  assertEqual(a.hinten, null, 'Hinterachse');
  assertEqual(a.tlltd, null, 'TLLTD');
  assertEqual(a.vollstaendig, false, 'vollstaendig');
});

await test('ein fehlendes Motion Ratio blockiert die ganze Kette', async () => {
  // Der kritischste fehlende Wert der Vorderachse - er geht quadratisch
  // ein. Ohne ihn ist aus der Federrate keine Rollsteifigkeit berechenbar.
  const d = vollstaendig();
  delete d.motion_ratio_front;
  const a = R.auswerten(d);
  assertEqual(a.vorn, null, 'Vorderachse trotz fehlendem MR berechnet');
  assertEqual(a.tlltd, null, 'TLLTD trotz fehlendem MR berechnet');
});

await test('ein fehlender Federabstand blockiert die Hinterachse', async () => {
  const d = vollstaendig();
  delete d.leaf_spacing_rear;
  const a = R.auswerten(d);
  assertEqual(a.hinten, null, 'Hinterachse trotz fehlendem Federabstand');
  assertEqual(a.tlltd, null, 'TLLTD');
});

await test('es wird kein Ersatzwert eingesetzt', async () => {
  // Weder ein Mittelwert noch ein "typischer" Wert. Das Kapitel sagt:
  // "Ohne diesen Wert ist jede Rechnung eine Schaetzung."
  const quelle = fs.readFileSync(path.join(REPO_ROOT, 'rollsteifigkeit.js'), 'utf8')
    .split(/\r?\n/).filter((z) => !/^\s*(\/\/|\*|\/\*)/.test(z)).join('\n');
  for (const wort of ['VORGABE', 'STANDARD_MR', 'ANNAHME', 'typisch', '|| 0.5', '|| 0.6']) {
    assert(!quelle.includes(wort), 'Ersatzwert im Code: ' + wort);
  }
});

await test('eine unsinnige Zahl wird nicht gerechnet', async () => {
  assertEqual(R.radrate(30, 0), null, 'Motion Ratio null');
  assertEqual(R.radrate(30, -0.6), null, 'Motion Ratio negativ');
  assertEqual(R.rollsteifigkeit(10, 0), null, 'Federbasis null');
  assertEqual(R.rollsteifigkeit(10, -1400), null, 'Federbasis negativ');
});

await test('die Blattfederrate wird von lb/in umgerechnet', async () => {
  // 00_PROJECT.md fuehrt leaf_rate als "175 lb/in je Feder" - eine
  // amerikanische Herstellerangabe. Wer sie ungerechnet als N/mm einsetzt,
  // bekommt eine um den Faktor 5,7 zu steife Hinterachse - und damit eine
  // Balanceaussage, die das Vorzeichen wechselt.
  //
  // Aufgefallen ist der Fehler durch den Test, der jedes Feld in
  // 00_PROJECT.md nachschlaegt: dabei kam heraus, dass es gar kein Feld
  // `spring_rear_rate` gibt, sondern `leaf_rate` - mit anderer Einheit.
  assert(PROJ.includes('lb/in'), 'Die Einheit steht nicht mehr im Handbuch');
  nahe(R.lbinNachNmm(175), 175 * 4.4482216 / 25.4, 1e-9);
  nahe(R.lbinNachNmm(175), 30.647, 1e-3);
  assertEqual(R.lbinNachNmm(''), null, 'Leerer Wert');
});

await test('jedes Feld traegt die Einheit, in der es im Handbuch steht', async () => {
  // Nicht die, in der gerechnet wird. Wer hier N/mm liest, obwohl dort
  // lb/in steht, traegt die falsche Zahl ein.
  const e = R.EINGANG.find((x) => x.feld === 'leaf_rate');
  assert(e, 'leaf_rate fehlt in der Liste');
  assertEqual(e.einheit, 'lb/in', 'Einheit von leaf_rate');
  assert(e.umrechnen, 'Die Umrechnung ist nicht vermerkt');
});

await test('Text statt Zahl ergibt nichts', async () => {
  assertEqual(R.zahl('ungefaehr 0,6'), null, 'Text');
  assertEqual(R.zahl(''), null, 'leer');
  assertEqual(R.zahl(undefined), null, 'fehlend');
  nahe(R.zahl('0,6'), 0.6);
});

// ---------------------------------------------------------------------------
suite('Die Luecken werden benannt, nicht nur gezaehlt');

await test('jeder fehlende Wert wird einzeln gemeldet', async () => {
  const f = R.fehlt({});
  assert(f.length >= 5, 'Nur ' + f.length + ' Luecken gemeldet');
  const felder = f.map((x) => x.feld);
  for (const n of ['spring_front_rate', 'motion_ratio_front', 'track_front',
                   'leaf_rate', 'leaf_spacing_rear']) {
    assert(felder.includes(n), 'Fehlt in der Meldung: ' + n);
  }
});

await test('jede Luecke nennt ihre Fundstelle im Handbuch', async () => {
  // Wer eine Luecke sieht, soll nicht suchen muessen, wo sie zu schliessen
  // ist.
  const ohne = R.EINGANG.concat(R.EINGANG_LASTTRANSFER)
    .filter((e) => !e.quelle).map((e) => e.feld);
  assertEqual(ohne, [], 'Eingangswert ohne Fundstelle');
});

await test('jedes genannte Feld gibt es in 00_PROJECT.md', async () => {
  // Ein Verweis auf ein Feld, das dort nicht steht, fuehrt ins Leere.
  const fehlend = R.EINGANG.concat(R.EINGANG_LASTTRANSFER)
    .filter((e) => !PROJ.includes('`' + e.feld + '`'))
    .map((e) => e.feld);
  assertEqual(fehlend, [], 'Feld nicht in 00_PROJECT.md');
});

await test('die drei blockierenden Werte sind dabei', async () => {
  // 00_PROJECT.md nennt sie eigens: motion_ratio_front als kritischsten
  // Wert der Vorderachse, leaf_spacing_rear als dessen Pendant hinten,
  // cg_height als wichtigsten Einzelwert des gesamten Projekts.
  const alle = R.EINGANG.concat(R.EINGANG_LASTTRANSFER).map((e) => e.feld);
  for (const n of ['motion_ratio_front', 'leaf_spacing_rear', 'cg_height']) {
    assert(alle.includes(n), 'Blockierender Wert fehlt: ' + n);
  }
});

await test('der Stabilisator wird nicht mitgerechnet', async () => {
  // Aus dem Durchmesser allein folgt keine Rate - dazu braeuchte es
  // Hebelarm und Torsionslaenge, und beide sind in 00_PROJECT.md offen.
  // Eine geschaetzte ARB-Rate waere genau die Zahl, die dieses Modul nicht
  // liefern soll.
  //
  // Das Ergebnis ist darum der reine Federanteil, und das wird vermerkt -
  // ohne den Vermerk saehe es vollstaendiger aus, als es ist.
  const a = R.auswerten(vollstaendig());
  assert(a.tlltd, 'Ohne ARB wird gar nicht gerechnet');
  assertEqual(a.tlltd.arbBeruecksichtigt, false, 'Es wird behauptet, der ARB sei dabei');

  // Auch mit eingetragenem Durchmesser bleibt es dabei.
  const b = R.auswerten(vollstaendig({ arb_front_dia: 25.4 }));
  assertEqual(b.tlltd.arbBeruecksichtigt, false,
    'Aus dem Durchmesser wurde eine Rate erfunden');
  assertEqual(b.tlltd.anteilVorn, a.tlltd.anteilVorn, 'Der Durchmesser hat gewirkt');
});

await test('der fehlende Hebelarm wird benannt', async () => {
  // Das Feld dafuer gibt es - arb_front_arm_length, in 00_PROJECT.md als
  // offen gefuehrt. Wer wissen will, warum der Stabilisator fehlt, soll es
  // dort finden.
  const e = R.EINGANG.find((x) => x.feld === 'arb_front_dia');
  assert(e, 'ARB-Durchmesser steht nicht in der Liste');
  assert(/Hebelarm/.test(e.hinweis), 'Der Grund wird nicht genannt: ' + e.hinweis);
  assert(PROJ.includes('`arb_front_arm_length`'),
    'Das Feld fuer den Hebelarm fehlt in 00_PROJECT.md');
});

// ---------------------------------------------------------------------------
suite('Die Wirkungsrichtung stimmt mit dem Kapitel ueberein');

await test('steifer vorn verschiebt TLLTD nach vorn', async () => {
  // Kapitel 3.4: "vorn steifer -> mehr Lasttransfer vorn -> mehr
  // Untersteuern". Die Richtung falsch herum waere nicht ungenau, sondern
  // das Gegenteil - und am Fahrzeug sofort spuerbar.
  //
  // Gestellt wird an der Federrate, nicht am Stabilisator: dessen Rate
  // laesst sich aus den vorhandenen Angaben nicht ermitteln.
  const weich = R.auswerten(vollstaendig());
  const hart = R.auswerten(vollstaendig({ spring_front_rate: 60 }));
  assert(hart.tlltd.anteilVorn > weich.tlltd.anteilVorn,
    'Haertere Feder vorn senkt den Anteil vorn');
});

await test('steifer hinten verschiebt TLLTD nach hinten', async () => {
  const weich = R.auswerten(vollstaendig());
  const hart = R.auswerten(vollstaendig({ leaf_rate: 350 }));
  assert(hart.tlltd.anteilVorn < weich.tlltd.anteilVorn,
    'Haertere Feder hinten erhoeht den Anteil vorn');
});

await test('ein engerer Federabstand senkt die Rollsteifigkeit hinten', async () => {
  // Kapitel 5.2: der Federabstand geht quadratisch ein - nicht die
  // Spurweite. Wer hinten die Spurweite einsetzte, bekaeme eine deutlich
  // zu hohe Rollsteifigkeit.
  const eng = R.auswerten(vollstaendig({ leaf_spacing_rear: 1000 }));
  const weit = R.auswerten(vollstaendig({ leaf_spacing_rear: 1400 }));
  assert(weit.hinten.gesamtProGrad > eng.hinten.gesamtProGrad,
    'Weiterer Federabstand ergibt nicht mehr Rollsteifigkeit');
  nahe(weit.hinten.gesamtProGrad / eng.hinten.gesamtProGrad, (1400 / 1000) ** 2, 1e-9);
});

await test('es gibt keinen Zielwert fuer TLLTD', async () => {
  // Das Kapitel nennt keinen. Es sagt nur, in welche Richtung eine
  // Aenderung wirkt - was richtig ist, sagt die Trackvalidierung.
  const quelle = fs.readFileSync(path.join(REPO_ROOT, 'rollsteifigkeit.js'), 'utf8')
    .split(/\r?\n/).filter((z) => !/^\s*(\/\/|\*|\/\*)/.test(z)).join('\n');
  for (const wort of ['ZIEL_TLLTD', 'TLLTD_SOLL', 'OPTIMAL', 'bewertung']) {
    assert(!quelle.includes(wort), 'Zielwert im Code: ' + wort);
  }
  // Und das Kapitel sagt es auch weiterhin so.
  assert(KAP.includes('Verteilung'), 'Das Kapitel spricht nicht mehr von der Verteilung');
});

} finally {
  // kein Server, kein Browser
}

process.exit(summary() === 0 ? 0 : 1);
