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
  // `groesse`  Kennung aus recheck.js. Nur wo es eine gibt: eine Aenderung
  //            daran meldet sich dann selbst und entwertet die Phasen.
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
    feld({ id: 'st_uca_vorn_' + r.toLowerCase(), gruppe: 'stell', art: 'stell', rad: r,
           label: 'UCA Heim vorn', einheit: 'U ab Anschlag', regel: 'numeric:0:30',
           groesse: 'castor' });
    feld({ id: 'st_uca_hinten_' + r.toLowerCase(), gruppe: 'stell', art: 'stell', rad: r,
           label: 'UCA Heim hinten', einheit: 'U ab Anschlag', regel: 'numeric:0:30',
           groesse: 'castor' });
    feld({ id: 'st_shim_vorn_' + r.toLowerCase(), gruppe: 'stell', art: 'stell', rad: r,
           label: 'Shim vorderer Bolzen', einheit: 'mm', regel: 'numeric:0:14.3',
           grenze: 'Paket max. 9/16" = 14,3 mm (Ford)', groesse: 'castor' });
    feld({ id: 'st_shim_hinten_' + r.toLowerCase(), gruppe: 'stell', art: 'stell', rad: r,
           label: 'Shim hinterer Bolzen', einheit: 'mm', regel: 'numeric:0:14.3',
           grenze: 'Paket max. 9/16" = 14,3 mm (Ford)', groesse: 'camber' });
    feld({ id: 'st_lca_platte_' + r.toLowerCase(), gruppe: 'stell', art: 'stell', rad: r,
           label: 'LCA Camber Kit Platte', einheit: 'Nr.', regel: 'integer:1:5',
           grenze: '#1 = Serienposition', groesse: 'camber' });
    feld({ id: 'st_strut_' + r.toLowerCase(), gruppe: 'stell', art: 'stell', rad: r,
           label: 'Strut Rod Einstellmass', einheit: 'mm', regel: 'numeric:0:400',
           groesse: 'castor' });
  });

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
