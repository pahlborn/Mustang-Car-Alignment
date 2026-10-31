/**
 * messwerte.js - Messgroessen, ihre Felder und die Formeln darauf.
 *
 * ZWEI ARTEN VON WERT
 *
 * Das Alignment Sheet trennt sie ausdruecklich:
 *
 *   Stellgroesse   was eingestellt ist - Plattennummer, Shimdicke,
 *                  Umdrehungen am Heim-Gelenk. Macht das Setup
 *                  reproduzierbar, ist aber keine Winkelangabe.
 *   Messgroesse    was dabei herauskommt - Castor, Camber, Toe.
 *
 * Wer beides vermischt, schreibt einen Sollwert in ein Feld, das einen
 * Istwert tragen soll. `art` haelt sie auseinander.
 *
 * FORMELN
 *
 * Alle aus CONVENTIONS.md abgeschrieben, Abschnitt 9 (Toe) und 11 (Corner
 * Weight). tests/messwerte.test.mjs prueft sie gegen die dort notierten
 * Gleichungen - kein Wert und keine Formel an zwei Orten.
 *
 * KEINE VORGABEWERTE
 *
 * Die Felder tragen Einheit, Grenze und Messmittel, aber keine Sollwerte.
 * Die Baseline des Fahrzeugs hat bis heute keine belegte Herkunft; sie als
 * Vorgabe einzutragen hiesse, eine ungeprüfte Zahl zur Referenz zu machen.
 */
(function (global) {
  'use strict';

  // ===========================================================================
  // Radpositionen - CONVENTIONS.md 2
  // ===========================================================================
  var RAEDER = ['LF', 'RF', 'LR', 'RR'];
  var VORN = ['LF', 'RF'];

  // ===========================================================================
  // FELDER
  // ---------------------------------------------------------------------------
  // `id`       Feldname im Speicher, zugleich data-field
  // `gruppe`   Messblatt-Abschnitt
  // `art`      'stell' oder 'mess' - siehe Kopfkommentar
  // `groesse`  Kennung aus recheck.js. Nur bei art 'stell' meldet eine
  //            Aenderung sich selbst und entwertet die Phasen - das ist eine
  //            Verstellung. Bei art 'mess' ordnet sie nur zu: Messen
  //            verstellt nichts (seit v23).
  // `einheit`  wird angezeigt, nicht mitgespeichert
  // `regel`    fuer validation.js
  // `grenze`   Projektgrenze als Text, aus dem Template
  // ===========================================================================
  var FELDER = [];

  function feld(o) { FELDER.push(o); return o; }

  // ---- Kopfdaten ------------------------------------------------------------
  feld({ id: 'ms_datum',      gruppe: 'kopf', art: 'stell', label: 'Datum', typ: 'date' });
  feld({ id: 'ms_baseline',   gruppe: 'kopf', art: 'stell', label: 'Baseline-ID',
         platzhalter: 'BL-JJJJMMTT-NN' });
  feld({ id: 'ms_pad',        gruppe: 'kopf', art: 'stell', label: 'Setup-Pad-Version' });
  feld({ id: 'ms_reifensatz', gruppe: 'kopf', art: 'stell', label: 'Reifensatz-ID',
         platzhalter: 'TYRE-...' });
  feld({ id: 'ms_fahrer_kg',  gruppe: 'kopf', art: 'stell', label: 'Fahrer / Ballast',
         einheit: 'kg', regel: 'numeric:0:200' });
  feld({ id: 'ms_fuel_l',     gruppe: 'kopf', art: 'stell', label: 'Kraftstoff',
         einheit: 'l', regel: 'numeric:0:120' });

  // ---- Stellgroessen Vorderachse -------------------------------------------
  // Aus TEMPLATE_ALIGNMENT_SHEET 1.1 bis 1.4. Das sind die Griffe, die es an
  // diesem Fahrzeug wirklich gibt - nicht mehr und nicht weniger.
  VORN.forEach(function (r) {
    // Gewindelaenge statt "Umdrehungen ab Anschlag" (v30): Zum Zaehlen der
    // Umdrehungen muesste man das Gelenk verdrehen - das waere schon eine
    // Verstellung (Pruefung 2026-10-30). Gemessen wird das sichtbare Gewinde.
    feld({ id: 'st_uca_vorn_' + r.toLowerCase(), gruppe: 'stell', art: 'stell', rad: r,
           label: 'UCA Heim vorn, Gewindelänge', einheit: 'mm', regel: 'numeric:0:100',
           grenze: 'L/R gleich (Street or Track); nicht verdrehen',
           messmittel: 'Messschieber, Rohrstirnfläche bis Schulter Gelenkkopf',
           groesse: 'castor' });
    feld({ id: 'st_uca_hinten_' + r.toLowerCase(), gruppe: 'stell', art: 'stell', rad: r,
           label: 'UCA Heim hinten, Gewindelänge', einheit: 'mm', regel: 'numeric:0:100',
           grenze: 'L/R gleich (Street or Track); nicht verdrehen',
           messmittel: 'Messschieber, Rohrstirnfläche bis Schulter Gelenkkopf',
           groesse: 'castor' });
    feld({ id: 'st_shim_vorn_' + r.toLowerCase(), gruppe: 'stell', art: 'stell', rad: r,
           label: 'Shim vorderer Bolzen', einheit: 'mm', regel: 'numeric:0:14.3',
           grenze: 'Paket max. 9/16" = 14,3 mm (Ford)', groesse: 'castor' });
    feld({ id: 'st_shim_hinten_' + r.toLowerCase(), gruppe: 'stell', art: 'stell', rad: r,
           label: 'Shim hinterer Bolzen', einheit: 'mm', regel: 'numeric:0:14.3',
           // castor, nicht camber: 1/32" an einem Bolzen verstellt Castor um
           // etwa 1/2 Grad (Ford Shop Manual 1966, A-11). Die Castor-Zeile der
           // Matrix zieht Camber und Toe mit; bis v22 entfiel hier der Castor.
           grenze: 'Paket max. 9/16" = 14,3 mm (Ford)', groesse: 'castor' });
    feld({ id: 'st_lca_platte_' + r.toLowerCase(), gruppe: 'stell', art: 'stell', rad: r,
           label: 'LCA Camber Kit Platte', einheit: 'Nr.', regel: 'integer:1:5',
           grenze: '#1 = Serienposition', groesse: 'camber' });
    feld({ id: 'st_strut_' + r.toLowerCase(), gruppe: 'stell', art: 'stell', rad: r,
           label: 'Strut Rod Einstellmass', einheit: 'mm', regel: 'numeric:0:400',
           groesse: 'castor' });
  });

  // ---- Fahrzeugkonstanten ---------------------------------------------------
  // Die Werte aus 00_PROJECT.md 8.2, aus denen sich die Balanceverteilung
  // rechnen laesst. Drei davon nennt das Handbuch eigens als blockierend:
  // motion_ratio_front, leaf_spacing_rear und cg_height.
  //
  // Sie stehen hier, weil sie gemessen werden muessen - einmal, aber gruendlich.
  // Ohne sie bleibt jede Balanceaussage eine Schaetzung.
  feld({ id: 'spring_front_rate', gruppe: 'konstanten', art: 'stell',
         label: 'Federrate vorn', einheit: 'lb/in', regel: 'numeric:0:1200',
         grenze: 'je Feder \u2013 Herstellerangabe in lb/in' });
  feld({ id: 'motion_ratio_front', gruppe: 'konstanten', art: 'mess',
         label: 'Motion Ratio vorn', einheit: '\u2013', regel: 'numeric:0:2',
         grenze: 'geht quadratisch in die Radrate ein',
         messmittel: 'Rad anheben, Federl\u00e4ngen\u00e4nderung messen' });
  feld({ id: 'track_front', gruppe: 'konstanten', art: 'mess',
         label: 'Spurweite vorn', einheit: 'mm', regel: 'numeric:1000:2000',
         messmittel: 'Radmitte zu Radmitte' });
  feld({ id: 'track_rear', gruppe: 'konstanten', art: 'mess',
         label: 'Spurweite hinten', einheit: 'mm', regel: 'numeric:1000:2000',
         messmittel: 'Radmitte zu Radmitte' });
  feld({ id: 'leaf_rate', gruppe: 'konstanten', art: 'stell',
         label: 'Blattfederrate', einheit: 'lb/in', regel: 'numeric:0:600',
         grenze: 'je Feder \u2013 Herstellerangabe in lb/in' });
  feld({ id: 'leaf_spacing_rear', gruppe: 'konstanten', art: 'mess',
         label: 'Federabstand hinten', einheit: 'mm', regel: 'numeric:500:1800',
         grenze: 'Blattfedermitten, nicht die Spurweite',
         messmittel: 'Mitte zu Mitte der Blattfedern' });
  feld({ id: 'wheelbase', gruppe: 'konstanten', art: 'mess',
         label: 'Radstand', einheit: 'mm', regel: 'numeric:2000:3500',
         messmittel: 'beide Seiten einzeln' });
  feld({ id: 'mass_total_raceready', gruppe: 'konstanten', art: 'mess',
         label: 'Masse race-ready', einheit: 'kg', regel: 'numeric:500:2500',
         messmittel: 'Longacre Corner-Weight-Waagen, Summe' });
  feld({ id: 'cg_height', gruppe: 'konstanten', art: 'mess',
         label: 'Schwerpunkth\u00f6he', einheit: 'mm', regel: 'numeric:200:1000',
         grenze: 'geht linear in das Rollmoment ein',
         messmittel: 'Waagenmessung mit angehobener Achse' });

  // ---- Alignment ------------------------------------------------------------
  VORN.forEach(function (r) {
    feld({ id: 'al_castor_' + r.toLowerCase(), gruppe: 'alignment', art: 'mess', rad: r,
           label: 'Castor', einheit: '\u00b0', regel: 'numeric:-15:15',
           grenze: 'L/R max. 1/2\u00b0, bevorzugt 1/4\u00b0', groesse: 'castor',
           messmittel: 'Dunlop CG/5 + CG/6' });
    feld({ id: 'al_camber_' + r.toLowerCase(), gruppe: 'alignment', art: 'mess', rad: r,
           label: 'Camber', einheit: '\u00b0', regel: 'numeric:-10:10',
           grenze: 'L/R max. 1/2\u00b0, bevorzugt 1/4\u00b0', groesse: 'camber',
           messmittel: 'Dunlop CG/4' });
    feld({ id: 'al_kpi_' + r.toLowerCase(), gruppe: 'alignment', art: 'mess', rad: r,
           label: 'KPI / SAI', einheit: '\u00b0', regel: 'numeric:-20:20',
           grenze: 'Diagnosewert', messmittel: 'Dunlop CG/5 + CG/6' });
  });

  // ---- Toe ------------------------------------------------------------------
  // F und R sind die beiden Abstaende der Toe Plates, D die Messbasis.
  // CONVENTIONS 7: Total Toe = R - F, positiv = Toe-in.
  feld({ id: 'toe_f', gruppe: 'toe', art: 'mess', label: 'Front distance F',
         einheit: 'mm', regel: 'numeric:0:3000', groesse: 'toe',
         messmittel: 'Longacre Toe Plates' });
  feld({ id: 'toe_r', gruppe: 'toe', art: 'mess', label: 'Rear distance R',
         einheit: 'mm', regel: 'numeric:0:3000', groesse: 'toe',
         messmittel: 'Longacre Toe Plates' });
  feld({ id: 'toe_d', gruppe: 'toe', art: 'mess', label: 'Messbasis D',
         einheit: 'mm', regel: 'numeric:1:1000',
         grenze: 'ohne D keine Winkelumrechnung (CONVENTIONS 9)' });

  // ---- Ride Height ----------------------------------------------------------
  RAEDER.forEach(function (r) {
    feld({ id: 'rh_' + r.toLowerCase(), gruppe: 'ridehoehe', art: 'mess', rad: r,
           label: 'Ride Height', einheit: 'mm', regel: 'numeric:0:500',
           groesse: 'ride_height',
           grenze: 'Messpunkt dokumentieren (CONVENTIONS 12)' });
  });

  // ---- Radlasten ------------------------------------------------------------
  RAEDER.forEach(function (r) {
    feld({ id: 'cw_' + r.toLowerCase(), gruppe: 'radlast', art: 'mess', rad: r,
           label: 'Radlast', einheit: 'kg', regel: 'numeric:0:1500',
           groesse: 'corner_weight', messmittel: 'Longacre Corner-Weight-Waagen' });
  });

  // ---- Reifen ---------------------------------------------------------------
  RAEDER.forEach(function (r) {
    feld({ id: 'tp_kalt_' + r.toLowerCase(), gruppe: 'reifen', art: 'stell', rad: r,
           label: 'Kaltdruck', einheit: 'bar', regel: 'numeric:0:5',
           groesse: 'reifen_druck' });
    feld({ id: 'tp_warm_' + r.toLowerCase(), gruppe: 'reifen', art: 'mess', rad: r,
           label: 'Warmdruck', einheit: 'bar', regel: 'numeric:0:5' });
  });

  // Pyrometer: drei Punkte je Reifen. CHAPTER_TIRE_MECHANICS 287 - sie
  // beantworten zwei verschiedene Fragen, die nicht vermischt werden duerfen:
  // das Innen-Aussen-Gefaelle den Camber, Mitte gegen Schultern den Druck.
  RAEDER.forEach(function (r) {
    ['innen', 'mitte', 'aussen'].forEach(function (pos) {
      feld({ id: 'py_' + pos + '_' + r.toLowerCase(), gruppe: 'pyrometer', art: 'mess',
             rad: r, punkt: pos, label: 'Temperatur ' + pos, einheit: '\u00b0C',
             regel: 'numeric:0:200', messmittel: 'Longacre Einstich-Pyrometer' });
    });
  });

  // ---- Bestand nach dem Umbau (Phase 0, seit v30) ----------------------------
  // Was laut 00_PROJECT.md noch "offen" ist, wird hier am Auto abgelesen.
  // `typ: 'text'` sind Freitextfelder (Teilenummern), keine Zahlen.
  function bestand(id, label, o) {
    o = o || {};
    var f = { id: 'best_' + id, gruppe: 'bestand', art: 'mess', label: label };
    for (var k in o) f[k] = o[k];
    if (!f.regel && !f.typ) f.typ = 'text';
    return feld(f);
  }
  bestand('bj_oben', 'Kugelgelenk oben (Moog), Teilenummer', { messmittel: 'Prägung oder Rechnung' });
  bestand('bj_unten', 'Kugelgelenk unten (Howe), Teilenummer', { messmittel: 'Prägung oder Rechnung' });
  bestand('feder_vorn', 'Feder vorn, Hersteller und Teilenummer', { messmittel: 'Rechnung' });
  bestand('stabi_vorn', 'Stabi vorn, Teilenummer', { messmittel: 'Rechnung' });
  bestand('stabi_hebel', 'Stabi vorn, Hebelarm bis Endlink', { einheit: 'mm', regel: 'numeric:50:600',
          messmittel: 'Maßband, Mitte Stabi-Rohr bis Mitte Endlink-Bohrung' });
  VORN.forEach(function (r) {
    bestand('drop_' + r.toLowerCase(), 'Shelby Drop, Versatz alt zu neu', { rad: r, typ: 'text',
            einheit: 'mm', platzhalter: 'tiefer … / nach hinten …',
            messmittel: 'Messschieber, Bohrungsmitte zu Bohrungsmitte' });
  });
  bestand('abw_va', 'Abweichungen Vorderachse');
  bestand('lenkgetriebe', 'Lenkgetriebe, Hersteller und Teilenummer', { messmittel: 'Typenschild' });
  bestand('pitman', 'Lenkstockhebel (Pitman Arm), Teilenummer');
  bestand('idler', 'Zwischenhebel (Idler Arm), Teilenummer');
  bestand('center_link', 'Mittelstange (Center Link), Teilenummer');
  bestand('spurstange', 'Innere Spurstangenköpfe und Hülsen');
  bestand('achsschenkel', 'Achsschenkel, Gussnummer und Bremsenart');
  bestand('abw_lenkung', 'Abweichungen Lenkung');
  bestand('ubolts', 'U-Bolts, Federplatten, Keil', { platzhalter: 'Ø, Gewinde, Hersteller, Keil ja/nein' });
  bestand('panhard_version', 'Panhard, Version und Merkmale', { platzhalter: 'Löcher je Halter, Lochabstand, Lagerart' });
  bestand('stabi_hinten', 'Stabi hinten', { platzhalter: 'nicht vorhanden / Teilenummer, Ø' });
  bestand('daempfer_hinten', 'Dämpfer hinten, Abstimmung', { platzhalter: 'Street / Sport / Race' });
  bestand('abw_ha', 'Abweichungen Hinterachse');
  bestand('kardan_rohr', 'Kardanwelle, Rohrdurchmesser', { einheit: 'mm', regel: 'numeric:50:120',
          messmittel: 'Messschieber oder Umfang ÷ 3,14' });
  bestand('kreuzgelenk', 'Kreuzgelenke, Baureihe', { platzhalter: 'Aufdruck oder Büchsen-Ø / Maß über Büchsen' });
  bestand('abw_antrieb', 'Abweichungen Antriebsstrang');
  bestand('reifen_alter', 'Reifen, DOT-Datum je Position', { platzhalter: 'LF …, RF …, LR …, RR …' });
  bestand('einpresstiefe', 'Einpresstiefe (ET)', { einheit: 'mm', regel: 'numeric:-50:80',
          grenze: 'Rückabstand minus halbe Gesamtbreite', messmittel: 'Prägung oder Richtscheit und Maßband' });
  bestand('abw_raeder', 'Abweichungen Räder und Reifen');
  bestand('waage_modell', 'Longacre-Waage, Modell', { messmittel: 'Typenschild der Anzeige' });
  bestand('pyrometer_modell', 'Pyrometer, Modell', { messmittel: 'Typenschild' });

  // Einsteller, die in Phase 0 zum ersten Mal erfasst werden. Eine spaetere
  // Aenderung (Phase 3, 5, 10) meldet sich als Verstellung.
  VORN.forEach(function (r) {
    feld({ id: 'st_distanz_' + r.toLowerCase(), gruppe: 'stell', art: 'stell', rad: r,
           label: 'Bump-Steer-Kit, Distanzstapel', einheit: 'mm', regel: 'numeric:0:60',
           messmittel: 'Messschieber, Gesamthöhe des Stapels', groesse: 'tie_rod_hoehe' });
  });
  feld({ id: 'st_panhard_loch', gruppe: 'stell', art: 'stell', typ: 'text',
         label: 'Panhard, benutztes Loch', platzhalter: 'Rahmen … / Achse … (von oben gezählt)',
         groesse: 'panhard_hoehe' });

  var _nachId = {};
  for (var i = 0; i < FELDER.length; i++) _nachId[FELDER[i].id] = FELDER[i];

  function feldVon(id) { return _nachId[id] || null; }

  function gruppe(name) {
    return FELDER.filter(function (f) { return f.gruppe === name; });
  }

  function alleGruppen() {
    var gesehen = {}, out = [];
    for (var i = 0; i < FELDER.length; i++) {
      if (!gesehen[FELDER[i].gruppe]) { gesehen[FELDER[i].gruppe] = true; out.push(FELDER[i].gruppe); }
    }
    return out;
  }

  // ===========================================================================
  // Formeln - CONVENTIONS.md 9 und 11
  // ===========================================================================

  function zahl(v) {
    if (v === null || v === undefined || v === '') return null;
    var n = parseFloat(String(v).replace(',', '.'));
    return isNaN(n) ? null : n;
  }

  /**
   * Total Toe aus den beiden Plattenabstaenden.
   *
   * CONVENTIONS 7: `Total Toe = R - F`, positiv = Toe-in.
   */
  function totalToe(f, r) {
    var vf = zahl(f), vr = zahl(r);
    if (vf === null || vr === null) return null;
    return vr - vf;
  }

  /**
   * Toe in Grad.
   *
   * CONVENTIONS 9: `a = atan(delta / D)`. Ohne D keine Umrechnung - die
   * Konvention sagt ausdruecklich "Keine Winkelumrechnung ohne definierte
   * Geometrie". Ein Naeherungswert ohne Messbasis waere geraten.
   */
  function toeGrad(deltaMm, dMm) {
    var d = zahl(deltaMm), basis = zahl(dMm);
    if (d === null || basis === null || basis <= 0) return null;
    return Math.atan(d / basis) * 180 / Math.PI;
  }

  /**
   * Radlastauswertung.
   *
   * CONVENTIONS 11, alle sechs Prozentangaben. `Cross % = (RF + LR) / Total`.
   *
   * Die Interpretationsregel dort: 50 % Cross ist ein symmetrischer
   * Ausgangspunkt, kein universeller Sollwert. An diesem Fahrzeug ist Cross
   * ohnehin nicht gezielt einstellbar - es fehlen hoehenverstellbare
   * Federauflagen. Das Blatt dient der Diagnose.
   */
  function radlasten(w) {
    var lf = zahl(w.LF), rf = zahl(w.RF), lr = zahl(w.LR), rr = zahl(w.RR);
    if (lf === null || rf === null || lr === null || rr === null) return null;
    var total = lf + rf + lr + rr;
    if (total <= 0) return null;
    function p(x) { return x / total * 100; }
    return {
      total: total,
      front: p(lf + rf), rear: p(lr + rr),
      links: p(lf + lr), rechts: p(rf + rr),
      cross: p(rf + lr), gegenCross: p(lf + rr)
    };
  }

  /**
   * Links-Rechts-Differenz einer Messgroesse.
   *
   * Das Alignment Sheet fuehrt sie als eigene Spalte mit Grenze: max. 1/2
   * Grad, bevorzugt 1/4. Darum wird sie gerechnet und nicht abgeschrieben.
   */
  function differenz(links, rechts) {
    var l = zahl(links), r = zahl(rechts);
    if (l === null || r === null) return null;
    return l - r;
  }

  /**
   * Pyrometer-Auswertung.
   *
   * CHAPTER_TIRE_MECHANICS 287: die drei Punkte beantworten ZWEI Fragen, die
   * nicht vermischt werden duerfen.
   *
   *   camberGefaelle  innen minus aussen - Hinweis auf den Camber
   *   druckWoelbung   Mitte minus Mittel der Schultern - Hinweis auf den Druck
   *
   * Bewusst keine Bewertung: ob ein Gefaelle zu gross ist, haengt von Strecke
   * und Reifen ab. CHAPTER_TRACKS 57 - auf rechtslastigen Strecken ist eine
   * L/R-Differenz normal und kein Setupfehler.
   */
  function reifentemperatur(innen, mitte, aussen) {
    var i = zahl(innen), m = zahl(mitte), a = zahl(aussen);
    if (i === null || m === null || a === null) return null;
    return {
      mittel: (i + m + a) / 3,
      camberGefaelle: i - a,
      druckWoelbung: m - (i + a) / 2
    };
  }

  /**
   * Spanne mehrerer Durchgaenge.
   *
   * Das Scale Sheet verlangt drei Durchgaenge mit Spalte "max - min". Eine
   * grosse Spanne heisst: die Messung ist nicht reproduzierbar, und dann hat
   * der Mittelwert keine Aussage.
   */
  function spanne(werte) {
    var zahlen = werte.map(zahl).filter(function (x) { return x !== null; });
    if (zahlen.length < 2) return null;
    return Math.max.apply(null, zahlen) - Math.min.apply(null, zahlen);
  }

  global.Messwerte = {
    RAEDER: RAEDER,
    VORN: VORN,
    FELDER: FELDER,
    feld: feldVon,
    gruppe: gruppe,
    alleGruppen: alleGruppen,
    zahl: zahl,
    totalToe: totalToe,
    toeGrad: toeGrad,
    radlasten: radlasten,
    differenz: differenz,
    reifentemperatur: reifentemperatur,
    spanne: spanne
  };
})(typeof window !== 'undefined' ? window : globalThis);
