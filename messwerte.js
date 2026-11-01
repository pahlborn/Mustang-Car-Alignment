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

  // ---- Mechanik pruefen (Phase 1, seit v31) ----------------------------------
  // Ergebnisse: ok / nicht ok. "nicht ok" heisst Stopp-Regel (02_WORKFLOW 4).
  function ergebnis(id, label, rad) {
    return feld({ id: 'mech_' + id, gruppe: 'mechanik', art: 'mess', typ: 'ergebnis',
                  label: label, rad: rad });
  }
  RAEDER.forEach(function (r) { ergebnis('radlager_' + r.toLowerCase(), 'Radlager', r); });
  VORN.forEach(function (r) {
    ergebnis('kg_oben_' + r.toLowerCase(), 'Oberes Kugelgelenk', r);
    ergebnis('kg_unten_' + r.toLowerCase(), 'Unteres Kugelgelenk', r);
  });
  ergebnis('lenkung', 'Lenkung ohne Spiel, alles fest');
  ergebnis('va_schrauben', 'Querlenker, Strut Rods, Stabi fest, Lager ohne Spiel');
  ergebnis('ha', 'Hinterachse fest, Buchsen ohne Spiel');
  ergebnis('raeder_bremse', 'Bremse frei, Räder und Reifen ohne Schaden');
  ergebnis('lager_fahrhoehe', 'Gummi- und Kunststofflager in Fahrhöhe angezogen');
  feld({ id: 'mech_einfahr_km', gruppe: 'mechanik', art: 'mess',
         label: 'Erste Ausfahrt, gefahrene Strecke', einheit: 'km', regel: 'numeric:0:2000' });
  ergebnis('nachgezogen', 'Nach der Ausfahrt nachgezogen, Lackstriche unverändert');

  // ---- Anleitung, Phasen 2-22 (seit v32) ------------------------------------
  // Uebernommen aus den Schrittkarten. Messwerte, die eine spaetere Phase
  // erneut misst, haben eine eigene Kennung (al12_castor neben al_castor):
  // es sind zwei Messungen, nicht ein Wert an zwei Orten. Einsteller haben
  // eine Kennung und stehen in jeder Karte, die sie verstellt.
  // phase-02
  feld({id: "pad_boden_lf",gruppe: "pad",art: "mess",rad: "LF",label: "Boden tiefer als höchster Platz",einheit: "mm",regel: "numeric:0:100",grenze: "höchster Platz = 0",messmittel: "Schlauchwaage oder Richtscheit + Wasserwaage"});
  feld({id: "pad_boden_rf",gruppe: "pad",art: "mess",rad: "RF",label: "Boden tiefer als höchster Platz",einheit: "mm",regel: "numeric:0:100",grenze: "höchster Platz = 0",messmittel: "Schlauchwaage oder Richtscheit + Wasserwaage"});
  feld({id: "pad_boden_lr",gruppe: "pad",art: "mess",rad: "LR",label: "Boden tiefer als höchster Platz",einheit: "mm",regel: "numeric:0:100",grenze: "höchster Platz = 0",messmittel: "Schlauchwaage oder Richtscheit + Wasserwaage"});
  feld({id: "pad_boden_rr",gruppe: "pad",art: "mess",rad: "RR",label: "Boden tiefer als höchster Platz",einheit: "mm",regel: "numeric:0:100",grenze: "höchster Platz = 0",messmittel: "Schlauchwaage oder Richtscheit + Wasserwaage"});
  feld({id: "pad_platte_lf",gruppe: "pad",art: "stell",rad: "LF",label: "Ausgleichspaket, Gesamtdicke",einheit: "mm",regel: "numeric:0:100",groesse: "pad_ebene",messmittel: "Messschieber"});
  feld({id: "pad_platte_rf",gruppe: "pad",art: "stell",rad: "RF",label: "Ausgleichspaket, Gesamtdicke",einheit: "mm",regel: "numeric:0:100",groesse: "pad_ebene",messmittel: "Messschieber"});
  feld({id: "pad_platte_lr",gruppe: "pad",art: "stell",rad: "LR",label: "Ausgleichspaket, Gesamtdicke",einheit: "mm",regel: "numeric:0:100",groesse: "pad_ebene",messmittel: "Messschieber"});
  feld({id: "pad_platte_rr",gruppe: "pad",art: "stell",rad: "RR",label: "Ausgleichspaket, Gesamtdicke",einheit: "mm",regel: "numeric:0:100",groesse: "pad_ebene",messmittel: "Messschieber"});
  feld({id: "pad_h_drehteller",gruppe: "pad",art: "mess",label: "Höhe Drehteller CG/6",einheit: "mm",regel: "numeric:0:200",messmittel: "Messschieber, Boden bis Oberkante Teller"});
  feld({id: "pad_h_waage",gruppe: "pad",art: "mess",label: "Höhe Longacre-Waage",einheit: "mm",regel: "numeric:0:200",messmittel: "Messschieber, Boden bis Oberkante Wiegeplatte"});
  feld({id: "pad_h_hinten",gruppe: "pad",art: "stell",label: "Höhe hintere Unterlagen",einheit: "mm",regel: "numeric:0:200",grenze: "gleich Höhe Drehteller",groesse: "pad_ebene",messmittel: "Messschieber"});
  feld({id: "pad_kontrolle_lf",gruppe: "pad",art: "mess",rad: "LF",label: "Höhe nach Wiederaufbau, gegen LF",einheit: "mm",regel: "numeric:-50:50",grenze: "LF = 0",messmittel: "Schlauchwaage"});
  feld({id: "pad_kontrolle_rf",gruppe: "pad",art: "mess",rad: "RF",label: "Höhe nach Wiederaufbau, gegen LF",einheit: "mm",regel: "numeric:-50:50",grenze: "LF = 0",messmittel: "Schlauchwaage"});
  feld({id: "pad_kontrolle_lr",gruppe: "pad",art: "mess",rad: "LR",label: "Höhe nach Wiederaufbau, gegen LF",einheit: "mm",regel: "numeric:-50:50",grenze: "LF = 0",messmittel: "Schlauchwaage"});
  feld({id: "pad_kontrolle_rr",gruppe: "pad",art: "mess",rad: "RR",label: "Höhe nach Wiederaufbau, gegen LF",einheit: "mm",regel: "numeric:-50:50",grenze: "LF = 0",messmittel: "Schlauchwaage"});
  feld({id: "pad_schnur",gruppe: "pad",art: "mess",typ: 'ergebnis',label: "Schnurprobe: Schnüre berühren sich ohne Druck"});
  // phase-03
  feld({id: "st_endlink_lf",gruppe: "stell",art: "stell",rad: "LF",label: "Stabi-Endlink, Länge",einheit: "mm",regel: "numeric:0:500",grenze: "Schraube geht ohne Kraft durch (3.2, 8.2)",groesse: "stabilisator",messmittel: "Maßband oder Messschieber, Mitte Auge bis Mitte Auge"});
  feld({id: "st_endlink_rf",gruppe: "stell",art: "stell",rad: "RF",label: "Stabi-Endlink, Länge",einheit: "mm",regel: "numeric:0:500",grenze: "Schraube geht ohne Kraft durch (3.2, 8.2)",groesse: "stabilisator",messmittel: "Maßband oder Messschieber, Mitte Auge bis Mitte Auge"});
  feld({id: "ha_panhard_laenge",gruppe: "hinterachse",art: "stell",label: "Panhard, Länge",einheit: "mm",regel: "numeric:0:2000",grenze: "Bolzen passt ohne Kraft (Projektregel)",groesse: "panhard_laenge",messmittel: "Maßband, Mitte Gelenk bis Mitte Gelenk"});
  // phase-04
  feld({id: "rh_punkt_vorn",gruppe: "ridehoehe",art: "mess",label: "Messpunkt vorn, links und rechts gleich",grenze: "fest, nicht an beweglichen Teilen (4.1)",messmittel: "Körner oder Lackstift, Foto",platzhalter: "Lage am Rahmen in Worten"});
  feld({id: "rh_punkt_hinten",gruppe: "ridehoehe",art: "mess",label: "Messpunkt hinten, links und rechts gleich",grenze: "fest, nicht an beweglichen Teilen (4.1)",messmittel: "Körner oder Lackstift, Foto",platzhalter: "Lage am Rahmen in Worten"});
  feld({id: "rhw_lf",gruppe: "ridehoehe",art: "mess",rad: "LF",label: "Fahrhöhe Wiederholung",einheit: "mm",regel: "numeric:0:500",grenze: "Vergleich mit 4.2; Grenze offen",messmittel: "Maßband, Bezug Aufstandsebene"});
  feld({id: "rhw_rf",gruppe: "ridehoehe",art: "mess",rad: "RF",label: "Fahrhöhe Wiederholung",einheit: "mm",regel: "numeric:0:500",grenze: "Vergleich mit 4.2; Grenze offen",messmittel: "Maßband, Bezug Aufstandsebene"});
  feld({id: "rhw_lr",gruppe: "ridehoehe",art: "mess",rad: "LR",label: "Fahrhöhe Wiederholung",einheit: "mm",regel: "numeric:0:500",grenze: "Vergleich mit 4.2; Grenze offen",messmittel: "Maßband, Bezug Aufstandsebene"});
  feld({id: "rhw_rr",gruppe: "ridehoehe",art: "mess",rad: "RR",label: "Fahrhöhe Wiederholung",einheit: "mm",regel: "numeric:0:500",grenze: "Vergleich mit 4.2; Grenze offen",messmittel: "Maßband, Bezug Aufstandsebene"});
  feld({id: "anschl_lf",gruppe: "ridehoehe",art: "mess",rad: "LF",label: "Abstand Anschlagpuffer",einheit: "mm",regel: "numeric:0:300",grenze: "Mindestabstand offen",messmittel: "Messschieber oder Stahllineal"});
  feld({id: "anschl_rf",gruppe: "ridehoehe",art: "mess",rad: "RF",label: "Abstand Anschlagpuffer",einheit: "mm",regel: "numeric:0:300",grenze: "Mindestabstand offen",messmittel: "Messschieber oder Stahllineal"});
  feld({id: "anschl_lr",gruppe: "ridehoehe",art: "mess",rad: "LR",label: "Abstand Anschlagpuffer",einheit: "mm",regel: "numeric:0:300",grenze: "Mindestabstand offen",messmittel: "Messschieber oder Stahllineal"});
  feld({id: "anschl_rr",gruppe: "ridehoehe",art: "mess",rad: "RR",label: "Abstand Anschlagpuffer",einheit: "mm",regel: "numeric:0:300",grenze: "Mindestabstand offen",messmittel: "Messschieber oder Stahllineal"});
  // phase-05
  feld({id: "ha_radstand_l",gruppe: "hinterachse",art: "mess",label: "Radstand links",einheit: "mm",regel: "numeric:2000:3500",grenze: "Unterschied L/R offen",messmittel: "Senklot und Maßband, Radmitte zu Radmitte"});
  feld({id: "ha_radstand_r",gruppe: "hinterachse",art: "mess",label: "Radstand rechts",einheit: "mm",regel: "numeric:2000:3500",grenze: "Unterschied L/R offen",messmittel: "Senklot und Maßband, Radmitte zu Radmitte"});
  feld({id: "ha_bezug_l",gruppe: "hinterachse",art: "mess",label: "Rahmenpunkt vorn links bis Radmitte hinten links",einheit: "mm",regel: "numeric:500:5000",grenze: "Vergleich mit rechts",messmittel: "Senklot und Maßband"});
  feld({id: "ha_bezug_r",gruppe: "hinterachse",art: "mess",label: "Rahmenpunkt vorn rechts bis Radmitte hinten rechts",einheit: "mm",regel: "numeric:500:5000",grenze: "Vergleich mit links",messmittel: "Senklot und Maßband"});
  feld({id: "ha_schubwinkel",gruppe: "hinterachse",art: "mess",label: "Schubwinkel (Betrag)",einheit: "°",regel: "numeric:0:5",grenze: "offen; Richtung aus Maß links/rechts",messmittel: "gerechnet: (L − R) ÷ Spurweite hinten × 57,3"});
  feld({id: "ha_seite_l",gruppe: "hinterachse",art: "mess",label: "Rahmen hinten links bis Radmitte links, quer",einheit: "mm",regel: "numeric:0:1000",grenze: "Versatz = (L − R) ÷ 2; Grenze offen",messmittel: "Senklot und Maßband"});
  feld({id: "ha_seite_r",gruppe: "hinterachse",art: "mess",label: "Rahmen hinten rechts bis Radmitte rechts, quer",einheit: "mm",regel: "numeric:0:1000",grenze: "Versatz = (L − R) ÷ 2; Grenze offen",messmittel: "Senklot und Maßband"});
  feld({id: "ha_panhard_h_chassis",gruppe: "hinterachse",art: "mess",label: "Panhard Höhe Gelenkmitte Chassisseite",einheit: "mm",regel: "numeric:0:1000",grenze: "über Aufstandsebene",messmittel: "Maßband, wie Fahrhöhe 4.2"});
  feld({id: "ha_panhard_h_achse",gruppe: "hinterachse",art: "mess",label: "Panhard Höhe Gelenkmitte Achsseite",einheit: "mm",regel: "numeric:0:1000",grenze: "über Aufstandsebene",messmittel: "Maßband, wie Fahrhöhe 4.2"});
  feld({id: "ha_panhard_winkel",gruppe: "hinterachse",art: "mess",label: "Panhard Winkel zur Waagerechten",einheit: "°",regel: "numeric:0:45",grenze: "Sollwert offen",messmittel: "gerechnet: arcsin(Höhenunterschied ÷ Länge)"});
  feld({id: "dl5_getriebe",gruppe: "antrieb",art: "mess",label: "Getriebe Neigung (Phase 5)",einheit: "°",regel: "numeric:0:20",grenze: "nur Ausgangsstand, Bewertung Phase 16",messmittel: "Winkelmesser 1/4° (fehlt) oder TREMEC-App"});
  feld({id: "dl5_getriebe_ri",gruppe: "antrieb",art: "mess",label: "Getriebe Richtung",grenze: "UP = steigt von vorn nach hinten",platzhalter: "UP oder DOWN"});
  feld({id: "dl5_welle",gruppe: "antrieb",art: "mess",label: "Kardanwelle Neigung (Phase 5)",einheit: "°",regel: "numeric:0:20",grenze: "nur Ausgangsstand, Bewertung Phase 16",messmittel: "Winkelmesser 1/4° (fehlt) oder TREMEC-App"});
  feld({id: "dl5_welle_ri",gruppe: "antrieb",art: "mess",label: "Kardanwelle Richtung",grenze: "UP = steigt von vorn nach hinten",platzhalter: "UP oder DOWN"});
  feld({id: "dl5_achse",gruppe: "antrieb",art: "mess",label: "Hinterachse/Ritzel Neigung (Phase 5)",einheit: "°",regel: "numeric:0:20",grenze: "nur Ausgangsstand, Bewertung Phase 16",messmittel: "Winkelmesser 1/4° (fehlt) oder TREMEC-App"});
  feld({id: "dl5_achse_ri",gruppe: "antrieb",art: "mess",label: "Hinterachse/Ritzel Richtung",grenze: "UP = steigt von vorn nach hinten",platzhalter: "UP oder DOWN"});
  feld({id: "dl5_messmittel",gruppe: "antrieb",art: "mess",label: "Gemessen mit",grenze: "App ist nur Behelf",platzhalter: "Winkelmesser oder TREMEC-App"});
  // phase-07
  feld({id: "cw7a_lf",gruppe: "radlast",art: "mess",rad: "LF",label: "Erstes Wiegen A",einheit: "kg",regel: "numeric:0:1500",grenze: "Spanne je Ecke unter 0,5 % der Gesamtmasse (Projektfestlegung)",messmittel: "Longacre Corner-Weight-Waagen"});
  feld({id: "cw7a_rf",gruppe: "radlast",art: "mess",rad: "RF",label: "Erstes Wiegen A",einheit: "kg",regel: "numeric:0:1500",grenze: "Spanne je Ecke unter 0,5 % der Gesamtmasse (Projektfestlegung)",messmittel: "Longacre Corner-Weight-Waagen"});
  feld({id: "cw7a_lr",gruppe: "radlast",art: "mess",rad: "LR",label: "Erstes Wiegen A",einheit: "kg",regel: "numeric:0:1500",grenze: "Spanne je Ecke unter 0,5 % der Gesamtmasse (Projektfestlegung)",messmittel: "Longacre Corner-Weight-Waagen"});
  feld({id: "cw7a_rr",gruppe: "radlast",art: "mess",rad: "RR",label: "Erstes Wiegen A",einheit: "kg",regel: "numeric:0:1500",grenze: "Spanne je Ecke unter 0,5 % der Gesamtmasse (Projektfestlegung)",messmittel: "Longacre Corner-Weight-Waagen"});
  feld({id: "cw7b_lf",gruppe: "radlast",art: "mess",rad: "LF",label: "Erstes Wiegen B",einheit: "kg",regel: "numeric:0:1500",grenze: "Spanne je Ecke unter 0,5 % der Gesamtmasse (Projektfestlegung)",messmittel: "Longacre Corner-Weight-Waagen"});
  feld({id: "cw7b_rf",gruppe: "radlast",art: "mess",rad: "RF",label: "Erstes Wiegen B",einheit: "kg",regel: "numeric:0:1500",grenze: "Spanne je Ecke unter 0,5 % der Gesamtmasse (Projektfestlegung)",messmittel: "Longacre Corner-Weight-Waagen"});
  feld({id: "cw7b_lr",gruppe: "radlast",art: "mess",rad: "LR",label: "Erstes Wiegen B",einheit: "kg",regel: "numeric:0:1500",grenze: "Spanne je Ecke unter 0,5 % der Gesamtmasse (Projektfestlegung)",messmittel: "Longacre Corner-Weight-Waagen"});
  feld({id: "cw7b_rr",gruppe: "radlast",art: "mess",rad: "RR",label: "Erstes Wiegen B",einheit: "kg",regel: "numeric:0:1500",grenze: "Spanne je Ecke unter 0,5 % der Gesamtmasse (Projektfestlegung)",messmittel: "Longacre Corner-Weight-Waagen"});
  feld({id: "cw7c_lf",gruppe: "radlast",art: "mess",rad: "LF",label: "Erstes Wiegen C",einheit: "kg",regel: "numeric:0:1500",grenze: "Spanne je Ecke unter 0,5 % der Gesamtmasse (Projektfestlegung)",messmittel: "Longacre Corner-Weight-Waagen"});
  feld({id: "cw7c_rf",gruppe: "radlast",art: "mess",rad: "RF",label: "Erstes Wiegen C",einheit: "kg",regel: "numeric:0:1500",grenze: "Spanne je Ecke unter 0,5 % der Gesamtmasse (Projektfestlegung)",messmittel: "Longacre Corner-Weight-Waagen"});
  feld({id: "cw7c_lr",gruppe: "radlast",art: "mess",rad: "LR",label: "Erstes Wiegen C",einheit: "kg",regel: "numeric:0:1500",grenze: "Spanne je Ecke unter 0,5 % der Gesamtmasse (Projektfestlegung)",messmittel: "Longacre Corner-Weight-Waagen"});
  feld({id: "cw7c_rr",gruppe: "radlast",art: "mess",rad: "RR",label: "Erstes Wiegen C",einheit: "kg",regel: "numeric:0:1500",grenze: "Spanne je Ecke unter 0,5 % der Gesamtmasse (Projektfestlegung)",messmittel: "Longacre Corner-Weight-Waagen"});
  // phase-08
  feld({id: "cw8a_lf",gruppe: "radlast",art: "mess",rad: "LF",label: "Stabi angeschlossen A",einheit: "kg",regel: "numeric:0:1500",grenze: "Spanne je Ecke unter 0,5 % der Gesamtmasse (Projektfestlegung)",messmittel: "Longacre Corner-Weight-Waagen"});
  feld({id: "cw8a_rf",gruppe: "radlast",art: "mess",rad: "RF",label: "Stabi angeschlossen A",einheit: "kg",regel: "numeric:0:1500",grenze: "Spanne je Ecke unter 0,5 % der Gesamtmasse (Projektfestlegung)",messmittel: "Longacre Corner-Weight-Waagen"});
  feld({id: "cw8a_lr",gruppe: "radlast",art: "mess",rad: "LR",label: "Stabi angeschlossen A",einheit: "kg",regel: "numeric:0:1500",grenze: "Spanne je Ecke unter 0,5 % der Gesamtmasse (Projektfestlegung)",messmittel: "Longacre Corner-Weight-Waagen"});
  feld({id: "cw8a_rr",gruppe: "radlast",art: "mess",rad: "RR",label: "Stabi angeschlossen A",einheit: "kg",regel: "numeric:0:1500",grenze: "Spanne je Ecke unter 0,5 % der Gesamtmasse (Projektfestlegung)",messmittel: "Longacre Corner-Weight-Waagen"});
  feld({id: "cw8b_lf",gruppe: "radlast",art: "mess",rad: "LF",label: "Stabi angeschlossen B",einheit: "kg",regel: "numeric:0:1500",grenze: "Spanne je Ecke unter 0,5 % der Gesamtmasse (Projektfestlegung)",messmittel: "Longacre Corner-Weight-Waagen"});
  feld({id: "cw8b_rf",gruppe: "radlast",art: "mess",rad: "RF",label: "Stabi angeschlossen B",einheit: "kg",regel: "numeric:0:1500",grenze: "Spanne je Ecke unter 0,5 % der Gesamtmasse (Projektfestlegung)",messmittel: "Longacre Corner-Weight-Waagen"});
  feld({id: "cw8b_lr",gruppe: "radlast",art: "mess",rad: "LR",label: "Stabi angeschlossen B",einheit: "kg",regel: "numeric:0:1500",grenze: "Spanne je Ecke unter 0,5 % der Gesamtmasse (Projektfestlegung)",messmittel: "Longacre Corner-Weight-Waagen"});
  feld({id: "cw8b_rr",gruppe: "radlast",art: "mess",rad: "RR",label: "Stabi angeschlossen B",einheit: "kg",regel: "numeric:0:1500",grenze: "Spanne je Ecke unter 0,5 % der Gesamtmasse (Projektfestlegung)",messmittel: "Longacre Corner-Weight-Waagen"});
  feld({id: "cw8c_lf",gruppe: "radlast",art: "mess",rad: "LF",label: "Stabi angeschlossen C",einheit: "kg",regel: "numeric:0:1500",grenze: "Spanne je Ecke unter 0,5 % der Gesamtmasse (Projektfestlegung)",messmittel: "Longacre Corner-Weight-Waagen"});
  feld({id: "cw8c_rf",gruppe: "radlast",art: "mess",rad: "RF",label: "Stabi angeschlossen C",einheit: "kg",regel: "numeric:0:1500",grenze: "Spanne je Ecke unter 0,5 % der Gesamtmasse (Projektfestlegung)",messmittel: "Longacre Corner-Weight-Waagen"});
  feld({id: "cw8c_lr",gruppe: "radlast",art: "mess",rad: "LR",label: "Stabi angeschlossen C",einheit: "kg",regel: "numeric:0:1500",grenze: "Spanne je Ecke unter 0,5 % der Gesamtmasse (Projektfestlegung)",messmittel: "Longacre Corner-Weight-Waagen"});
  feld({id: "cw8c_rr",gruppe: "radlast",art: "mess",rad: "RR",label: "Stabi angeschlossen C",einheit: "kg",regel: "numeric:0:1500",grenze: "Spanne je Ecke unter 0,5 % der Gesamtmasse (Projektfestlegung)",messmittel: "Longacre Corner-Weight-Waagen"});
  // phase-10
  feld({id: "bump10_ref_lf",gruppe: "bumpsteer",art: "mess",rad: "LF",label: "Referenzhöhe Boden bis Messpunkt",einheit: "mm",regel: "numeric:0:600",grenze: "vor dem Anheben gemessen, Nullpunkt der Bump-Steer-Messung",messmittel: "Messband, Boden bis unteres Kugelgelenk"});
  feld({id: "bump10_ref_rf",gruppe: "bumpsteer",art: "mess",rad: "RF",label: "Referenzhöhe Boden bis Messpunkt",einheit: "mm",regel: "numeric:0:600",grenze: "vor dem Anheben gemessen, Nullpunkt der Bump-Steer-Messung",messmittel: "Messband, Boden bis unteres Kugelgelenk"});
  // phase-11
  feld({id: "cg11_m50_lf",gruppe: "camberkurve",art: "mess",rad: "LF",label: "Camber bei −50 mm",einheit: "°",regel: "numeric:-10:10",grenze: "kein Sollwert",messmittel: "Dunlop CG/4"});
  feld({id: "cg11_m50_rf",gruppe: "camberkurve",art: "mess",rad: "RF",label: "Camber bei −50 mm",einheit: "°",regel: "numeric:-10:10",grenze: "kein Sollwert",messmittel: "Dunlop CG/4"});
  feld({id: "cg11_m25_lf",gruppe: "camberkurve",art: "mess",rad: "LF",label: "Camber bei −25 mm",einheit: "°",regel: "numeric:-10:10",grenze: "kein Sollwert",messmittel: "Dunlop CG/4"});
  feld({id: "cg11_m25_rf",gruppe: "camberkurve",art: "mess",rad: "RF",label: "Camber bei −25 mm",einheit: "°",regel: "numeric:-10:10",grenze: "kein Sollwert",messmittel: "Dunlop CG/4"});
  feld({id: "cg11_0_lf",gruppe: "camberkurve",art: "mess",rad: "LF",label: "Camber bei 0 mm (Fahrhöhe)",einheit: "°",regel: "numeric:-10:10",grenze: "kein Sollwert",messmittel: "Dunlop CG/4"});
  feld({id: "cg11_0_rf",gruppe: "camberkurve",art: "mess",rad: "RF",label: "Camber bei 0 mm (Fahrhöhe)",einheit: "°",regel: "numeric:-10:10",grenze: "kein Sollwert",messmittel: "Dunlop CG/4"});
  feld({id: "cg11_p25_lf",gruppe: "camberkurve",art: "mess",rad: "LF",label: "Camber bei +25 mm",einheit: "°",regel: "numeric:-10:10",grenze: "kein Sollwert",messmittel: "Dunlop CG/4"});
  feld({id: "cg11_p25_rf",gruppe: "camberkurve",art: "mess",rad: "RF",label: "Camber bei +25 mm",einheit: "°",regel: "numeric:-10:10",grenze: "kein Sollwert",messmittel: "Dunlop CG/4"});
  feld({id: "cg11_p50_lf",gruppe: "camberkurve",art: "mess",rad: "LF",label: "Camber bei +50 mm",einheit: "°",regel: "numeric:-10:10",grenze: "kein Sollwert",messmittel: "Dunlop CG/4"});
  feld({id: "cg11_p50_rf",gruppe: "camberkurve",art: "mess",rad: "RF",label: "Camber bei +50 mm",einheit: "°",regel: "numeric:-10:10",grenze: "kein Sollwert",messmittel: "Dunlop CG/4"});
  // phase-12
  feld({id: "al12_castor_lf",gruppe: "alignment",art: "mess",rad: "LF",label: "Castor endgültig",einheit: "°",regel: "numeric:-15:15",grenze: "L/R max. 1/2°, bevorzugt 1/4° (Ford)",messmittel: "Dunlop CG/5 + CG/6"});
  feld({id: "al12_castor_rf",gruppe: "alignment",art: "mess",rad: "RF",label: "Castor endgültig",einheit: "°",regel: "numeric:-15:15",grenze: "L/R max. 1/2°, bevorzugt 1/4° (Ford)",messmittel: "Dunlop CG/5 + CG/6"});
  feld({id: "al12_camber_lf",gruppe: "alignment",art: "mess",rad: "LF",label: "Camber endgültig",einheit: "°",regel: "numeric:-10:10",grenze: "L/R max. 1/2°, bevorzugt 1/4° (Ford)",messmittel: "Dunlop CG/4"});
  feld({id: "al12_camber_rf",gruppe: "alignment",art: "mess",rad: "RF",label: "Camber endgültig",einheit: "°",regel: "numeric:-10:10",grenze: "L/R max. 1/2°, bevorzugt 1/4° (Ford)",messmittel: "Dunlop CG/4"});
  feld({id: "al12_kpi_lf",gruppe: "alignment",art: "mess",rad: "LF",label: "KPI endgültig",einheit: "°",regel: "numeric:-20:20",grenze: "Diagnosewert, kein Sollwert",messmittel: "Dunlop CG/5 + CG/6"});
  feld({id: "al12_kpi_rf",gruppe: "alignment",art: "mess",rad: "RF",label: "KPI endgültig",einheit: "°",regel: "numeric:-20:20",grenze: "Diagnosewert, kein Sollwert",messmittel: "Dunlop CG/5 + CG/6"});
  feld({id: "al12_lenkmitte",gruppe: "alignment",art: "mess",typ: 'ergebnis',label: "Lenkungsmitte: Getriebe mittig, Center Link links/rechts gleich",messmittel: "Dunlop CG/5 + CG/6"});
  feld({id: "toe12_f",gruppe: "toe",art: "mess",label: "Spur endgültig: Abstand vorn F",einheit: "mm",regel: "numeric:0:3000",messmittel: "Longacre Toe Plates"});
  feld({id: "toe12_r",gruppe: "toe",art: "mess",label: "Spur endgültig: Abstand hinten R",einheit: "mm",regel: "numeric:0:3000",messmittel: "Longacre Toe Plates"});
  feld({id: "toe12_einzel_lf",gruppe: "toe",art: "mess",rad: "LF",label: "Einzelspur LF (Schnur: vorn − hinten)",einheit: "mm",regel: "numeric:-20:20",grenze: "plus = Vorspur; am Felgenhorn gemessen",messmittel: "Schnüre + Stahllineal"});
  feld({id: "toe12_einzel_rf",gruppe: "toe",art: "mess",rad: "RF",label: "Einzelspur RF (Schnur: vorn − hinten)",einheit: "mm",regel: "numeric:-20:20",grenze: "plus = Vorspur; am Felgenhorn gemessen",messmittel: "Schnüre + Stahllineal"});
  // phase-13
  feld({id: "ack_aussen_rf",gruppe: "alignment",art: "mess",rad: "RF",label: "Linkskurve: RF (außen), wenn LF 20° zeigt",einheit: "°",regel: "numeric:0:45",grenze: "Sollwert Ford Part 3-6: offen",messmittel: "Dunlop CG/6 Drehteller"});
  feld({id: "ack_aussen_lf",gruppe: "alignment",art: "mess",rad: "LF",label: "Rechtskurve: LF (außen), wenn RF 20° zeigt",einheit: "°",regel: "numeric:0:45",grenze: "Sollwert Ford Part 3-6: offen",messmittel: "Dunlop CG/6 Drehteller"});
  // phase-14
  feld({id: "al14_castor_lf",gruppe: "alignment",art: "mess",rad: "LF",label: "Castor Kontrolle",einheit: "°",regel: "numeric:-15:15",grenze: "Vergleich mit 12.2",messmittel: "Dunlop CG/5 + CG/6"});
  feld({id: "al14_castor_rf",gruppe: "alignment",art: "mess",rad: "RF",label: "Castor Kontrolle",einheit: "°",regel: "numeric:-15:15",grenze: "Vergleich mit 12.2",messmittel: "Dunlop CG/5 + CG/6"});
  feld({id: "al14_camber_lf",gruppe: "alignment",art: "mess",rad: "LF",label: "Camber Kontrolle",einheit: "°",regel: "numeric:-10:10",grenze: "Vergleich mit 12.3",messmittel: "Dunlop CG/4"});
  feld({id: "al14_camber_rf",gruppe: "alignment",art: "mess",rad: "RF",label: "Camber Kontrolle",einheit: "°",regel: "numeric:-10:10",grenze: "Vergleich mit 12.3",messmittel: "Dunlop CG/4"});
  feld({id: "toe14_f",gruppe: "toe",art: "mess",label: "Spur Kontrolle: Abstand vorn F",einheit: "mm",regel: "numeric:0:3000",grenze: "Vergleich mit 12.6",messmittel: "Longacre Toe Plates"});
  feld({id: "toe14_r",gruppe: "toe",art: "mess",label: "Spur Kontrolle: Abstand hinten R",einheit: "mm",regel: "numeric:0:3000",grenze: "Vergleich mit 12.6",messmittel: "Longacre Toe Plates"});
  // phase-15
  feld({id: "cw15a_lf",gruppe: "radlast",art: "mess",rad: "LF",label: "Endgültig wiegen A",einheit: "kg",regel: "numeric:0:1500",grenze: "Spanne je Ecke unter 0,5 % der Gesamtmasse (Projektfestlegung)",messmittel: "Longacre Corner-Weight-Waagen"});
  feld({id: "cw15a_rf",gruppe: "radlast",art: "mess",rad: "RF",label: "Endgültig wiegen A",einheit: "kg",regel: "numeric:0:1500",grenze: "Spanne je Ecke unter 0,5 % der Gesamtmasse (Projektfestlegung)",messmittel: "Longacre Corner-Weight-Waagen"});
  feld({id: "cw15a_lr",gruppe: "radlast",art: "mess",rad: "LR",label: "Endgültig wiegen A",einheit: "kg",regel: "numeric:0:1500",grenze: "Spanne je Ecke unter 0,5 % der Gesamtmasse (Projektfestlegung)",messmittel: "Longacre Corner-Weight-Waagen"});
  feld({id: "cw15a_rr",gruppe: "radlast",art: "mess",rad: "RR",label: "Endgültig wiegen A",einheit: "kg",regel: "numeric:0:1500",grenze: "Spanne je Ecke unter 0,5 % der Gesamtmasse (Projektfestlegung)",messmittel: "Longacre Corner-Weight-Waagen"});
  feld({id: "cw15b_lf",gruppe: "radlast",art: "mess",rad: "LF",label: "Endgültig wiegen B",einheit: "kg",regel: "numeric:0:1500",grenze: "Spanne je Ecke unter 0,5 % der Gesamtmasse (Projektfestlegung)",messmittel: "Longacre Corner-Weight-Waagen"});
  feld({id: "cw15b_rf",gruppe: "radlast",art: "mess",rad: "RF",label: "Endgültig wiegen B",einheit: "kg",regel: "numeric:0:1500",grenze: "Spanne je Ecke unter 0,5 % der Gesamtmasse (Projektfestlegung)",messmittel: "Longacre Corner-Weight-Waagen"});
  feld({id: "cw15b_lr",gruppe: "radlast",art: "mess",rad: "LR",label: "Endgültig wiegen B",einheit: "kg",regel: "numeric:0:1500",grenze: "Spanne je Ecke unter 0,5 % der Gesamtmasse (Projektfestlegung)",messmittel: "Longacre Corner-Weight-Waagen"});
  feld({id: "cw15b_rr",gruppe: "radlast",art: "mess",rad: "RR",label: "Endgültig wiegen B",einheit: "kg",regel: "numeric:0:1500",grenze: "Spanne je Ecke unter 0,5 % der Gesamtmasse (Projektfestlegung)",messmittel: "Longacre Corner-Weight-Waagen"});
  feld({id: "cw15c_lf",gruppe: "radlast",art: "mess",rad: "LF",label: "Endgültig wiegen C",einheit: "kg",regel: "numeric:0:1500",grenze: "Spanne je Ecke unter 0,5 % der Gesamtmasse (Projektfestlegung)",messmittel: "Longacre Corner-Weight-Waagen"});
  feld({id: "cw15c_rf",gruppe: "radlast",art: "mess",rad: "RF",label: "Endgültig wiegen C",einheit: "kg",regel: "numeric:0:1500",grenze: "Spanne je Ecke unter 0,5 % der Gesamtmasse (Projektfestlegung)",messmittel: "Longacre Corner-Weight-Waagen"});
  feld({id: "cw15c_lr",gruppe: "radlast",art: "mess",rad: "LR",label: "Endgültig wiegen C",einheit: "kg",regel: "numeric:0:1500",grenze: "Spanne je Ecke unter 0,5 % der Gesamtmasse (Projektfestlegung)",messmittel: "Longacre Corner-Weight-Waagen"});
  feld({id: "cw15c_rr",gruppe: "radlast",art: "mess",rad: "RR",label: "Endgültig wiegen C",einheit: "kg",regel: "numeric:0:1500",grenze: "Spanne je Ecke unter 0,5 % der Gesamtmasse (Projektfestlegung)",messmittel: "Longacre Corner-Weight-Waagen"});
  feld({id: "cw15_lf",gruppe: "radlast",art: "mess",rad: "LF",label: "Radlast endgültig (Mittelwert)",einheit: "kg",regel: "numeric:0:1500",grenze: "Vergleich mit dem Mittelwert aus 7.4",messmittel: "Longacre Corner-Weight-Waagen"});
  feld({id: "cw15_rf",gruppe: "radlast",art: "mess",rad: "RF",label: "Radlast endgültig (Mittelwert)",einheit: "kg",regel: "numeric:0:1500",grenze: "Vergleich mit dem Mittelwert aus 7.4",messmittel: "Longacre Corner-Weight-Waagen"});
  feld({id: "cw15_lr",gruppe: "radlast",art: "mess",rad: "LR",label: "Radlast endgültig (Mittelwert)",einheit: "kg",regel: "numeric:0:1500",grenze: "Vergleich mit dem Mittelwert aus 7.4",messmittel: "Longacre Corner-Weight-Waagen"});
  feld({id: "cw15_rr",gruppe: "radlast",art: "mess",rad: "RR",label: "Radlast endgültig (Mittelwert)",einheit: "kg",regel: "numeric:0:1500",grenze: "Vergleich mit dem Mittelwert aus 7.4",messmittel: "Longacre Corner-Weight-Waagen"});
  feld({id: "rh15_lf",gruppe: "ridehoehe",art: "mess",rad: "LF",label: "Fahrhöhe endgültig",einheit: "mm",regel: "numeric:0:500",grenze: "Messpunkt aus 4.1",messmittel: "Messband"});
  feld({id: "rh15_rf",gruppe: "ridehoehe",art: "mess",rad: "RF",label: "Fahrhöhe endgültig",einheit: "mm",regel: "numeric:0:500",grenze: "Messpunkt aus 4.1",messmittel: "Messband"});
  feld({id: "rh15_lr",gruppe: "ridehoehe",art: "mess",rad: "LR",label: "Fahrhöhe endgültig",einheit: "mm",regel: "numeric:0:500",grenze: "Messpunkt aus 4.1",messmittel: "Messband"});
  feld({id: "rh15_rr",gruppe: "ridehoehe",art: "mess",rad: "RR",label: "Fahrhöhe endgültig",einheit: "mm",regel: "numeric:0:500",grenze: "Messpunkt aus 4.1",messmittel: "Messband"});
  // phase-16
  feld({id: "dl16_getriebe",gruppe: "antrieb",art: "mess",label: "Neigung Getriebe-Ausgang",einheit: "°",regel: "numeric:-15:15",grenze: "UP = plus, DOWN = minus; auf 1/4° (Spicer)",messmittel: "Winkelmesser 1/4° (fehlt) oder TREMEC-App"});
  feld({id: "dl16_welle",gruppe: "antrieb",art: "mess",label: "Neigung Kardanwelle",einheit: "°",regel: "numeric:-15:15",grenze: "UP = plus, DOWN = minus; auf 1/4° (Spicer)",messmittel: "Winkelmesser 1/4° (fehlt) oder TREMEC-App"});
  feld({id: "dl16_pinion",gruppe: "antrieb",art: "mess",label: "Neigung Hinterachse (Pinion)",einheit: "°",regel: "numeric:-15:15",grenze: "UP = plus, DOWN = minus; auf 1/4° (Spicer)",messmittel: "Winkelmesser 1/4° (fehlt) oder TREMEC-App"});
  feld({id: "dl16_wedge_grad",gruppe: "antrieb",art: "stell",label: "Keil Blattfeder–Achse",einheit: "°",regel: "numeric:0:10",grenze: "0 = kein Keil",groesse: "wedge"});
  feld({id: "dl16_wedge_lage",gruppe: "antrieb",art: "stell",label: "Keil: dicke Seite",groesse: "wedge",platzhalter: "vorn / hinten / kein Keil"});
  feld({id: "dl16_rpm",gruppe: "antrieb",art: "mess",label: "Höchste Drehzahl der Kardanwelle",einheit: "1/min",regel: "numeric:0:9000",grenze: "für die Spicer-Tabelle, nur nötig über 3°",messmittel: "Drehzahlmesser im direkten Gang"});
  feld({id: "dl16_befund",gruppe: "antrieb",art: "mess",typ: 'ergebnis',label: "Antriebsstrang nach Spicer-Regeln",grenze: "je Gelenk 1/2° bis 3°, Unterschied max. 1°"});
  // phase-17
  feld({id: "fg17_l_kotfluegel",gruppe: "freigaengigkeit",art: "mess",typ: 'ergebnis',label: "Voll links: Reifen – Kotflügel und Innenkotflügel",grenze: "beide Vorderräder, nichts berührt"});
  feld({id: "fg17_l_rahmen",gruppe: "freigaengigkeit",art: "mess",typ: 'ergebnis',label: "Voll links: Reifen – Rahmen",grenze: "beide Vorderräder, nichts berührt"});
  feld({id: "fg17_l_stabi",gruppe: "freigaengigkeit",art: "mess",typ: 'ergebnis',label: "Voll links: Reifen – Stabi",grenze: "beide Vorderräder, nichts berührt"});
  feld({id: "fg17_l_schlauch",gruppe: "freigaengigkeit",art: "mess",typ: 'ergebnis',label: "Voll links: Bremsschlauch frei, nicht gespannt",grenze: "beide Vorderräder"});
  feld({id: "fg17_l_spurstange",gruppe: "freigaengigkeit",art: "mess",typ: 'ergebnis',label: "Voll links: Spurstange frei",grenze: "beide Seiten"});
  feld({id: "fg17_l_anschlag",gruppe: "freigaengigkeit",art: "mess",typ: 'ergebnis',label: "Voll links: Lenkanschlag begrenzt den Einschlag",grenze: "nicht das Lenkgetriebe"});
  feld({id: "fg17_l_notiz",gruppe: "freigaengigkeit",art: "mess",label: "Voll links: engste Stelle",platzhalter: "Rad, Ort, Abstand in mm"});
  feld({id: "fg17_r_kotfluegel",gruppe: "freigaengigkeit",art: "mess",typ: 'ergebnis',label: "Voll rechts: Reifen – Kotflügel und Innenkotflügel",grenze: "beide Vorderräder, nichts berührt"});
  feld({id: "fg17_r_rahmen",gruppe: "freigaengigkeit",art: "mess",typ: 'ergebnis',label: "Voll rechts: Reifen – Rahmen",grenze: "beide Vorderräder, nichts berührt"});
  feld({id: "fg17_r_stabi",gruppe: "freigaengigkeit",art: "mess",typ: 'ergebnis',label: "Voll rechts: Reifen – Stabi",grenze: "beide Vorderräder, nichts berührt"});
  feld({id: "fg17_r_schlauch",gruppe: "freigaengigkeit",art: "mess",typ: 'ergebnis',label: "Voll rechts: Bremsschlauch frei, nicht gespannt",grenze: "beide Vorderräder"});
  feld({id: "fg17_r_spurstange",gruppe: "freigaengigkeit",art: "mess",typ: 'ergebnis',label: "Voll rechts: Spurstange frei",grenze: "beide Seiten"});
  feld({id: "fg17_r_anschlag",gruppe: "freigaengigkeit",art: "mess",typ: 'ergebnis',label: "Voll rechts: Lenkanschlag begrenzt den Einschlag",grenze: "nicht das Lenkgetriebe"});
  feld({id: "fg17_r_notiz",gruppe: "freigaengigkeit",art: "mess",label: "Voll rechts: engste Stelle",platzhalter: "Rad, Ort, Abstand in mm"});
  // strecke
  feld({id: "trk_strecke",gruppe: "strecke",art: "stell",typ: "text",label: "Strecke und Fahrtrichtung",platzhalter: "z. B. Pannoniaring, im Uhrzeigersinn"});
  feld({id: "trk_bedingungen",gruppe: "strecke",art: "mess",typ: "text",label: "Wetter, Luft- und Asphalttemperatur",platzhalter: "trocken / feucht / nass, Luft … °C, Asphalt … °C"});
  feld({id: "trk_reifensatz",gruppe: "strecke",art: "stell",typ: "text",label: "Reifensatz am Stint",platzhalter: "TYRE-…, Heat Cycles bisher …"});
  feld({id: "trk_tank_start",gruppe: "strecke",art: "stell",label: "Tank vor dem Stint",einheit: "l",regel: "numeric:0:120",grenze: "bei A und B gleich"});
  feld({id: "trk_shore_lf",gruppe: "strecke",art: "mess",rad: "LF",label: "Shore-Härte kalt, Mittel aus innen/Mitte/außen",einheit: "Shore A",regel: "numeric:0:100",grenze: "nur kalt vergleichen",messmittel: "Shore-A-Durometer"});
  feld({id: "trk_shore_rf",gruppe: "strecke",art: "mess",rad: "RF",label: "Shore-Härte kalt, Mittel aus innen/Mitte/außen",einheit: "Shore A",regel: "numeric:0:100",grenze: "nur kalt vergleichen",messmittel: "Shore-A-Durometer"});
  feld({id: "trk_shore_lr",gruppe: "strecke",art: "mess",rad: "LR",label: "Shore-Härte kalt, Mittel aus innen/Mitte/außen",einheit: "Shore A",regel: "numeric:0:100",grenze: "nur kalt vergleichen",messmittel: "Shore-A-Durometer"});
  feld({id: "trk_shore_rr",gruppe: "strecke",art: "mess",rad: "RR",label: "Shore-Härte kalt, Mittel aus innen/Mitte/außen",einheit: "Shore A",regel: "numeric:0:100",grenze: "nur kalt vergleichen",messmittel: "Shore-A-Durometer"});
  feld({id: "trk_shore_temp",gruppe: "strecke",art: "mess",label: "Lufttemperatur bei der Shore-Messung",einheit: "°C",regel: "numeric:-20:60"});
  feld({id: "trk_verzoegerung",gruppe: "strecke",art: "mess",label: "Anhalten bis erste Druckmessung",einheit: "s",regel: "numeric:0:1800",grenze: "jedes Mal möglichst gleich"});
  feld({id: "trk_reifenbild_lf",gruppe: "strecke",art: "mess",rad: "LF",typ: "text",label: "Reifenbild",platzhalter: "innen / Mitte / außen, Auffälligkeiten"});
  feld({id: "trk_reifenbild_rf",gruppe: "strecke",art: "mess",rad: "RF",typ: "text",label: "Reifenbild",platzhalter: "innen / Mitte / außen, Auffälligkeiten"});
  feld({id: "trk_reifenbild_lr",gruppe: "strecke",art: "mess",rad: "LR",typ: "text",label: "Reifenbild",platzhalter: "innen / Mitte / außen, Auffälligkeiten"});
  feld({id: "trk_reifenbild_rr",gruppe: "strecke",art: "mess",rad: "RR",typ: "text",label: "Reifenbild",platzhalter: "innen / Mitte / außen, Auffälligkeiten"});
  feld({id: "trk_rundenzeiten",gruppe: "strecke",art: "mess",typ: "text",label: "Rundenzeiten des Stints",platzhalter: "Runde 2: 2:01,4 · Runde 3: 1:59,8 · …"});
  feld({id: "trk_beste_runde",gruppe: "strecke",art: "mess",typ: "text",label: "Beste Runde",platzhalter: "m:ss,s"});
  feld({id: "trk_tank_ende",gruppe: "strecke",art: "mess",label: "Tank nach dem Stint",einheit: "l",regel: "numeric:0:120"});
  feld({id: "trk_gefuehl_bremsen",gruppe: "strecke",art: "mess",typ: "text",label: "Fahrgefühl: Bremsen",platzhalter: "stabil? zieht? Heck unruhig?"});
  feld({id: "trk_gefuehl_einlenken",gruppe: "strecke",art: "mess",typ: "text",label: "Fahrgefühl: Einlenken und Kurveneingang",platzhalter: "spontan? träge? schiebt? Heck kommt?"});
  feld({id: "trk_gefuehl_mitte",gruppe: "strecke",art: "mess",typ: "text",label: "Fahrgefühl: Kurvenmitte",platzhalter: "untersteuert / übersteuert / neutral"});
  feld({id: "trk_gefuehl_ausgang",gruppe: "strecke",art: "mess",typ: "text",label: "Fahrgefühl: Gasgeben und Kurvenausgang",platzhalter: "Traktion? schiebt? Heck kommt?"});
  feld({id: "trk_gefuehl_schnell",gruppe: "strecke",art: "mess",typ: "text",label: "Fahrgefühl: schnelle Kurven und Geraden",platzhalter: "stabil? nervös? Lenkkorrekturen?"});
  feld({id: "trk_gefuehl_kerbs",gruppe: "strecke",art: "mess",typ: "text",label: "Fahrgefühl: Kerbs und Bodenwellen",platzhalter: "versetzt? springt? Lenkrad schlägt?"});
  feld({id: "trk_gefuehl_lenkkraft",gruppe: "strecke",art: "mess",typ: "text",label: "Fahrgefühl: Lenkkraft",platzhalter: "leicht / gut / am Ende des Stints anstrengend"});
  feld({id: "trk_plan_aenderung",gruppe: "strecke",art: "mess",typ: "text",label: "Geplante Änderung (genau eine)",platzhalter: "was, wo, von … auf …"});
  feld({id: "trk_plan_erwartung",gruppe: "strecke",art: "mess",typ: "text",label: "Was erwartest du?",platzhalter: "z. B. weniger Schieben in der Kurvenmitte"});
  feld({id: "trk_plan_neben",gruppe: "strecke",art: "mess",typ: "text",label: "Mögliche Nebenwirkung",platzhalter: "was könnte schlechter werden"});
  feld({id: "trk_plan_erfolg",gruppe: "strecke",art: "mess",typ: "text",label: "Woran erkennst du Erfolg?",platzhalter: "Messgröße: Temperatur, Rundenzeit, Fahrgefühl in Kurve …"});
  feld({id: "trk_aenderung_ist",gruppe: "strecke",art: "mess",typ: "text",label: "Tatsächlich verstellt",platzhalter: "was, Wert vorher → Wert nachher, Uhrzeit"});
  feld({id: "trk_ab_bedingungen",gruppe: "strecke",art: "mess",typ: "text",label: "Was war bei B anders als bei A?",platzhalter: "Reifen, Tank, Wetter, Verkehr, Runden, Fahrer"});
  feld({id: "trk_ab_ergebnis",gruppe: "strecke",art: "mess",typ: "auswahl",label: "A/B-Ergebnis",optionen: ["besser","schlechter","neutral","nicht aussagekräftig"]});
  feld({id: "trk_ab_begruendung",gruppe: "strecke",art: "mess",typ: "text",label: "Begründung",platzhalter: "woran festgemacht: Messgröße aus 21.1"});

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
