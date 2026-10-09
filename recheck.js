/**
 * recheck.js - was nach einer Aenderung erneut zu pruefen ist.
 *
 * Einzige Quelle der Abhaengigkeiten ist die Tabelle in
 * handbuch/02_WORKFLOW.md, Abschnitt 27 ("Was wann erneut geprueft werden
 * muss"). MATRIX unten ist eine Abschrift davon, Zeile fuer Zeile, und
 * tests/recheck.test.mjs prueft beide Richtungen:
 *
 *   - jede Zeile der Markdown-Tabelle kommt hier vor
 *   - jeder Eintrag hier kommt in der Markdown-Tabelle vor
 *
 * Ohne die zweite Richtung koennten die Listen gegeneinander verrutschen.
 * Das Verfahren ist aus dem belege-Mechanismus in jericos reference.js
 * uebernommen.
 *
 * WARUM DAS MODUL EXISTIERT
 *
 * Ein Motor, der zusammengebaut ist, bleibt zusammengebaut. Ein Fahrwerk
 * nicht. Wer Camber verstellt, entwertet damit Toe - die Messung gilt fuer
 * ein Fahrzeug, das es so nicht mehr gibt. Ein Fortschrittsbalken, der danach
 * auf 100 Prozent stehen bliebe, wuerde bei der einzigen Frage luegen, auf die
 * es ankommt: ist das Fahrzeug rennstreckenbereit.
 */
(function (global) {
  'use strict';

  // ===========================================================================
  // Sammelbegriffe
  // ---------------------------------------------------------------------------
  // Die Matrix nennt an zwei Stellen eine Gruppe statt einzelner Groessen.
  // Hier stehen sie einmal aufgeloest - nicht in der Matrix selbst, sonst
  // waere die Abschrift keine mehr.
  // ===========================================================================
  var SAMMEL = {
    alignment: ['castor', 'camber', 'toe']
  };

  function aufloesen(liste) {
    var out = [];
    for (var i = 0; i < liste.length; i++) {
      var g = liste[i];
      if (SAMMEL[g]) { out = out.concat(SAMMEL[g]); }
      else { out.push(g); }
    }
    return out;
  }

  // ===========================================================================
  // MATRIX - Abschrift von 02_WORKFLOW.md 27
  // ---------------------------------------------------------------------------
  // Ein Eintrag je Tabellenzeile. `zeile` und `folgt` sind wortgleich mit dem
  // Handbuch - sie sind der Beleg, den tests/recheck.test.mjs dort sucht.
  //
  // Drei Stufen, die sich im Verhalten unterscheiden:
  //
  //   neu      Spalte "neu messen". Der Wert gilt nicht mehr, die Phase wird
  //            `veraltet`. PFLANZT SICH FORT.
  //   mit      Spalte "mitmessen". Verschiebt sich, wird aber nicht ungueltig.
  //            Bleibt stehen, wo es auftritt.
  //   ggf      Vorangestelltes "ggf." in der rechten Spalte. Kann betroffen
  //            sein, muss nicht. Hinweis, kein Pruefauftrag. Bleibt stehen.
  //
  // Dass `mit` und `ggf` nicht weiterlaufen, ist der Kern: ohne das wuerde
  // eine Druckkorrektur ueber Reifen -> Ride Height -> Corner Weight ->
  // Alignment neun von siebzehn Phasen entwerten. Eine Anzeige, die das
  // zweimal behauptet, glaubt niemand mehr - und dann schuetzt sie nichts.
  // ===========================================================================
  var MATRIX = [
    {
      groesse: 'ride_height', zeile: 'Ride Height',
      folgt: 'Corner Weight, Camber, Toe, Panhard, ggf. Castor/Bump Steer',
      wirkung: 'neu messen',
      neu: ['corner_weight', 'camber', 'toe', 'lateral_position'],
      mit: [], ggf: ['castor', 'bump_steer']
    },
    {
      groesse: 'corner_weight', zeile: 'Corner Weight',
      folgt: 'Ride Height',
      wirkung: 'mitmessen',
      neu: [], mit: ['ride_height'], ggf: []
    },
    {
      groesse: 'corner_weight', zeile: 'Corner Weight',
      folgt: 'Alignment',
      wirkung: 'neu messen',
      neu: ['alignment'], mit: [], ggf: []
    },
    {
      groesse: 'castor', zeile: 'Castor',
      folgt: 'Camber, Toe, Freigängigkeit',
      wirkung: 'neu messen',
      neu: ['camber', 'toe', 'freigaengigkeit'], mit: [], ggf: []
    },
    {
      groesse: 'camber', zeile: 'Camber',
      folgt: 'Toe, ggf. Radlasten',
      wirkung: 'neu messen',
      neu: ['toe'], mit: [], ggf: ['radlasten']
    },
    {
      groesse: 'tie_rod_hoehe', zeile: 'Tie-Rod-Höhe',
      folgt: 'gesamte Bump-Steer-Kurve, Toe',
      wirkung: 'neu messen',
      neu: ['bump_steer', 'toe'], mit: [], ggf: []
    },
    {
      groesse: 'toe', zeile: 'Toe',
      folgt: 'Steering Center',
      wirkung: 'neu messen',
      neu: ['steering_center'], mit: [], ggf: []
    },
    {
      groesse: 'blattfeder', zeile: 'Blattfeder',
      folgt: 'Ride Height, Cross, Thrust, Panhard, Pinion',
      wirkung: 'neu messen',
      neu: ['ride_height', 'cross', 'thrust_angle', 'lateral_position', 'pinion_slope'],
      mit: [], ggf: []
    },
    {
      groesse: 'panhard_laenge', zeile: 'Panhard-Länge',
      folgt: 'Achszentrierung',
      wirkung: 'neu messen',
      neu: ['achszentrierung'], mit: [], ggf: []
    },
    {
      groesse: 'panhard_hoehe', zeile: 'Panhard-Höhe',
      folgt: 'Rear Roll Geometry, lateral position prüfen',
      wirkung: 'neu messen',
      neu: ['rear_roll_geometry', 'lateral_position'], mit: [], ggf: []
    },
    {
      groesse: 'wedge', zeile: 'Wedge',
      folgt: 'Pinion/U-Joint-Winkel, U-Bolt-Klemmung',
      wirkung: 'neu messen',
      neu: ['pinion_slope', 'u_joint_winkel', 'u_bolt_klemmung'], mit: [], ggf: []
    },
    {
      groesse: 'reifen_druck', zeile: 'Reifen/Druck',
      folgt: 'Ride Height, Trackdaten',
      wirkung: 'mitmessen',
      neu: [], mit: ['ride_height', 'track_daten'], ggf: []
    },
    {
      groesse: 'stabilisator', zeile: 'Stabilisator/Endlink',
      folgt: 'ARB-Preload, Radlasten',
      wirkung: 'neu messen',
      neu: ['arb_preload', 'radlasten'], mit: [], ggf: []
    }
  ];

  // Nachschlagetabelle, einmal gebaut. Eine Groesse darf mehrfach links
  // stehen (Corner Weight hat zwei Zeilen) - die Kanten werden gesammelt.
  var _nach = {};
  for (var i = 0; i < MATRIX.length; i++) {
    var m = MATRIX[i];
    if (!_nach[m.groesse]) _nach[m.groesse] = { neu: [], mit: [], ggf: [] };
    _nach[m.groesse].neu = _nach[m.groesse].neu.concat(aufloesen(m.neu));
    _nach[m.groesse].mit = _nach[m.groesse].mit.concat(aufloesen(m.mit));
    _nach[m.groesse].ggf = _nach[m.groesse].ggf.concat(aufloesen(m.ggf));
  }

  // ===========================================================================
  // PHASE_LIEFERT - welche Messgroesse legt welche Phase fest
  // ---------------------------------------------------------------------------
  // Abgeleitet aus 02_WORKFLOW.md, je Phase ein eigener Abschnitt. Diese
  // Tabelle ist der Uebersetzer zwischen Messgroessen (so spricht die Matrix)
  // und Phasen (so zaehlt der Fortschrittsbalken).
  //
  // Phase 9 und 14 liefern bewusst nichts: Phase 9 ist eine reine
  // Pruefschleife - und zwar genau diese Matrix, in Prosa -, Phase 14 eine
  // Settling-Prozedur. Beide koennen deshalb nie veralten. Im
  // Fortschrittsbalken zaehlen sie trotzdem mit, erledigt ist erledigt.
  // ===========================================================================
  var PHASEN = [
    { nr: 0,  id: 'phase0',  titel: 'Hardware-Inventar',        liefert: ['hardware_stand'] },
    { nr: 1,  id: 'phase1',  titel: 'Mechanische Pruefung',     liefert: ['mech_spielfreiheit'] },
    { nr: 2,  id: 'phase2',  titel: 'Setup Pad',                liefert: ['pad_ebene'] },
    { nr: 3,  id: 'phase3',  titel: 'Race-Ready-Zustand',       liefert: ['race_ready_zustand', 'steering_center'] },
    { nr: 4,  id: 'phase4',  titel: 'Initial Ride Height',      liefert: ['ride_height', 'rake', 'bump_stop_abstand'] },
    // "Panhard-Lateralposition" aus 02_WORKFLOW.md 8 ist dasselbe wie
    // "lateral position" in der Matrix. Zwei Namen fuer eine Groesse waeren
    // ein Wert an zwei Orten - aufgefallen, weil der Test panhard_hoehe als
    // Groesse ohne Wirkung meldete.
    { nr: 5,  id: 'phase5',  titel: 'Hinterachsreferenz',       liefert: ['radstand_lr', 'achszentrierung', 'thrust_angle', 'lateral_position', 'panhard_winkel', 'rear_roll_geometry'] },
    { nr: 6,  id: 'phase6',  titel: 'Initial Front Alignment',  liefert: ['castor', 'camber', 'toe', 'kpi'] },
    { nr: 7,  id: 'phase7',  titel: 'Initial Scaling',          liefert: ['corner_weight', 'cross', 'radlasten'] },
    { nr: 8,  id: 'phase8',  titel: 'Balance / Ride Height',    liefert: ['ride_height', 'cross', 'arb_preload'] },
    { nr: 9,  id: 'phase9',  titel: 'Recheck nach Balance',     liefert: [] },
    { nr: 10, id: 'phase10', titel: 'Bump Steer',               liefert: ['bump_steer'] },
    { nr: 11, id: 'phase11', titel: 'Camber Gain',              liefert: ['camber_gain'] },
    { nr: 12, id: 'phase12', titel: 'Ackermann',                liefert: ['ackermann'] },
    { nr: 13, id: 'phase13', titel: 'Final Front Alignment',    liefert: ['castor', 'camber', 'toe', 'kpi', 'steering_center'] },
    { nr: 14, id: 'phase14', titel: 'Settling',                 liefert: [] },
    { nr: 15, id: 'phase15', titel: 'Final Scaling',            liefert: ['corner_weight', 'cross', 'radlasten', 'ride_height'] },
    { nr: 16, id: 'phase16', titel: 'Driveline / Pinion',       liefert: ['pinion_slope', 'u_joint_winkel', 'wedge'] },
    { nr: 17, id: 'phase17', titel: 'Full Lock',                liefert: ['freigaengigkeit'] },
    { nr: 18, id: 'phase18', titel: 'Baseline einfrieren',      liefert: ['baseline_id'] }
  ];

  // ===========================================================================
  // Kaskade
  // ===========================================================================

  /**
   * Alle Groessen, die eine Aenderung beruehrt - ueber beliebig viele Stufen.
   *
   * Beispiel Blattfeder:
   *   blattfeder -> ride_height -> corner_weight -> castor, camber, toe -> ...
   *
   * Die Matrix enthaelt einen echten Zyklus: ride_height verlangt eine neue
   * Corner-Weight-Messung, Corner Weight wiederum verschiebt die Ride Height.
   * Das ist fachlich richtig, beide bedingen sich. Ohne `gesehen` liefe die
   * Schleife endlos.
   *
   * Nur `neu` pflanzt sich fort. `mit` und `ggf` werden vermerkt, aber nicht
   * weiterverfolgt - sonst entstuende aus einer Verschiebung von Millimetern
   * eine Kette, an deren Ende das halbe Setup ungueltig waere.
   *
   * @param {string|string[]} start - geaenderte Groesse(n)
   * @returns {{neu: string[], mit: string[], ggf: string[]}} ohne die
   *          Startgroessen selbst
   */
  function betroffen(start) {
    var starts = [].concat(start).map(String);
    var warteschlange = starts.slice();
    var gesehen = {};
    var neu = {}, mit = {}, ggf = {};

    for (var k = 0; k < starts.length; k++) gesehen[starts[k]] = true;

    while (warteschlange.length) {
      var g = warteschlange.shift();
      var kanten = _nach[g];
      if (!kanten) continue;            // Blatt: steht links nicht in der Matrix

      for (var i = 0; i < kanten.neu.length; i++) {
        var z = kanten.neu[i];
        neu[z] = true;
        if (!gesehen[z]) { gesehen[z] = true; warteschlange.push(z); }
      }
      // Vermerken, aber nicht weiterverfolgen.
      for (var j = 0; j < kanten.mit.length; j++) mit[kanten.mit[j]] = true;
      for (var h = 0; h < kanten.ggf.length; h++) ggf[kanten.ggf[h]] = true;
    }

    // Die Startgroessen selbst sind nicht "betroffen" - sie wurden geaendert.
    // Ueber den Zyklus landen sie sonst in ihrer eigenen Ergebnisliste.
    var startSet = {};
    for (var s = 0; s < starts.length; s++) startSet[starts[s]] = true;

    function raus(obj, auch) {
      return Object.keys(obj).filter(function (x) {
        return !startSet[x] && !(auch && auch[x]);
      }).sort();
    }

    // Die staerkere Stufe gewinnt: was neu zu messen ist, braucht keinen
    // zusaetzlichen Mitmess- oder ggf-Vermerk.
    return {
      neu: raus(neu),
      mit: raus(mit, neu),
      ggf: raus(ggf, neu)
    };
  }

  /**
   * Welche Phasen muessen nach einer Aenderung erneut absolviert werden?
   *
   * Eine Phase gilt als betroffen, sobald eine der Groessen, die sie
   * festlegt, betroffen ist. Die staerkste zutreffende Stufe gewinnt.
   *
   * @param {string|string[]} start
   * @returns {{veraltet: object[], mitmessen: object[], hinweis: object[]}}
   */
  function phasenNach(start) {
    var b = betroffen(start);
    var veraltet = [], mitmessen = [], hinweis = [];

    function schnitt(liefert, menge) {
      return liefert.filter(function (g) { return menge.indexOf(g) > -1; });
    }

    for (var i = 0; i < PHASEN.length; i++) {
      var p = PHASEN[i];
      if (!p.liefert.length) continue;          // Pruef- und Prozedurschritte
      var eintrag = { nr: p.nr, id: p.id, titel: p.titel };

      var n = schnitt(p.liefert, b.neu);
      if (n.length) { eintrag.wegen = n; veraltet.push(eintrag); continue; }

      var m = schnitt(p.liefert, b.mit);
      if (m.length) { eintrag.wegen = m; mitmessen.push(eintrag); continue; }

      var w = schnitt(p.liefert, b.ggf);
      if (w.length) { eintrag.wegen = w; hinweis.push(eintrag); }
    }
    return { veraltet: veraltet, mitmessen: mitmessen, hinweis: hinweis };
  }

  /** Alle Groessen, die irgendwo vorkommen - fuer Auswahllisten und Tests. */
  function alleGroessen() {
    var set = {};
    for (var i = 0; i < MATRIX.length; i++) {
      var m = MATRIX[i];
      set[m.groesse] = true;
      var felder = [aufloesen(m.neu), aufloesen(m.mit), aufloesen(m.ggf)];
      for (var f = 0; f < felder.length; f++) {
        for (var a = 0; a < felder[f].length; a++) set[felder[f][a]] = true;
      }
    }
    for (var p = 0; p < PHASEN.length; p++) {
      for (var l = 0; l < PHASEN[p].liefert.length; l++) set[PHASEN[p].liefert[l]] = true;
    }
    return Object.keys(set).sort();
  }

  /** Groessen, die eine Phase festlegt - oder [] wenn unbekannt. */
  function phase(id) {
    for (var i = 0; i < PHASEN.length; i++) if (PHASEN[i].id === id) return PHASEN[i];
    return null;
  }

  global.Recheck = {
    MATRIX: MATRIX,
    PHASEN: PHASEN,
    SAMMEL: SAMMEL,
    betroffen: betroffen,
    phasenNach: phasenNach,
    alleGroessen: alleGroessen,
    phase: phase
  };
})(typeof window !== 'undefined' ? window : globalThis);
