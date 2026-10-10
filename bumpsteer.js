/**
 * bumpsteer.js - Messreihe und Auswertung der Toe-Aenderung ueber den Federweg.
 *
 * Quelle: handbuch/TEMPLATE_BUMP_STEER_SHEET.md und CONVENTIONS.md 10.
 *
 * KEIN ZIELWERT
 *
 * Das Template sagt es ausdruecklich: "Bump Steer wird minimiert, nicht auf
 * einen Zahlenwert eingestellt." Der frueher diskutierte Richtwert von 0,020"
 * je 1" Federweg ist dort als **nicht belegt** markiert.
 *
 * Dieses Modul rechnet darum Kennwerte aus und bewertet sie nicht. Es sagt,
 * wie gross der Ausschlag ist und ob die Kurve monoton verlaeuft - ob das zu
 * viel ist, entscheidet der Mensch.
 *
 * WAS ES DAGEGEN SEHR WOHL TUT
 *
 * Es prueft die Messung selbst: Nullpunktkontrolle, Vollstaendigkeit,
 * Symmetrie zwischen den Seiten. Eine Kurve aus einer Messung, bei der sich
 * die Lenkung bewegt hat, ist kein Befund, sondern Rauschen.
 */
(function (global) {
  'use strict';

  // Federwegstufen aus dem Template, Abschnitt C. Negativ = Droop.
  // CONVENTIONS 10: positiver Federweg = Bump, 0 = Race-Ready Ride Height.
  var STUFEN = [-50, -38, -25, -18, -12, -6, 0, 6, 12, 18, 25, 38, 50];

  // Zusatzpunkte fuer das Fenster um Null. Das Template: "Das Fahrzeug
  // arbeitet die meiste Zeit in einem begrenzten Fenster um die Fahrhoehe."
  var FEIN = [-9, -3, 3, 9];

  var SEITEN = ['LF', 'RF'];

  // Das BGR310 zeigt 0,01 mm an, ist aber auf 0,1 mm genau. Eine Differenz
  // darunter liegt in der Geraetetoleranz und ist kein Befund.
  var GERAETETOLERANZ_MM = 0.1;

  function feldName(seite, federweg) {
    var vz = federweg < 0 ? 'm' : (federweg > 0 ? 'p' : '');
    return 'bs_' + seite.toLowerCase() + '_' + vz + Math.abs(federweg);
  }

  /** Alle Feldnamen einer Seite, in Reihenfolge des Federwegs. */
  function felder(seite, mitFein) {
    return stufen(mitFein).map(function (w) {
      return { federweg: w, id: feldName(seite, w) };
    });
  }

  function stufen(mitFein) {
    if (!mitFein) return STUFEN.slice();
    return STUFEN.concat(FEIN).sort(function (a, b) { return a - b; });
  }

  function zahl(v) {
    if (v === null || v === undefined || v === '') return null;
    var n = parseFloat(String(v).replace(',', '.'));
    return isNaN(n) ? null : n;
  }

  /**
   * Messpunkte einer Seite als Paare.
   *
   * `werte` ist ein Objekt Feldname zu Wert - so, wie es aus den
   * Eingabefeldern kommt. Leere Felder entfallen; eine unvollstaendige
   * Messreihe ist brauchbar, solange die vorhandenen Punkte stimmen.
   */
  function punkte(werte, seite, mitFein) {
    return felder(seite, mitFein)
      .map(function (f) { return { x: f.federweg, y: zahl(werte[f.id]) }; })
      .filter(function (p) { return p.y !== null; })
      .sort(function (a, b) { return a.x - b.x; });
  }

  /**
   * Kennwerte einer Messreihe, optional auf ein Arbeitsfenster begrenzt.
   *
   * Das Template, E1: "Ein Toe-Ausschlag bei -50 mm ist bedeutungslos, wenn
   * die Aufhaengung dort nie arbeitet." Darum laesst sich das Fenster
   * angeben - ohne Angabe gilt die ganze Reihe.
   *
   * @returns {object|null} null, wenn weniger als zwei Punkte vorliegen
   */
  function kennwerte(p, fenster) {
    var reihe = p;
    if (fenster && fenster.von !== undefined && fenster.bis !== undefined) {
      reihe = p.filter(function (q) { return q.x >= fenster.von && q.x <= fenster.bis; });
    }
    if (reihe.length < 2) return null;

    var ys = reihe.map(function (q) { return q.y; });
    var max = Math.max.apply(null, ys);
    var min = Math.min.apply(null, ys);

    return {
      punkte: reihe.length,
      maxToeIn: max,                   // positiv = Toe-in (CONVENTIONS 10)
      maxToeOut: min,
      ausschlag: max - min,
      monoton: istMonoton(reihe),
      steigungUmNull: steigungUmNull(p),
      nulldurchgang: nulldurchgang(reihe)
    };
  }

  /**
   * Verlaeuft die Kurve in eine Richtung?
   *
   * Eine nicht-monotone Kurve wechselt die Richtung - das ist ein eigener
   * Befund und nicht dasselbe wie ein grosser Ausschlag. Geraetetoleranz
   * wird ausgenommen, sonst meldet jedes Messrauschen einen Richtungswechsel.
   */
  function istMonoton(reihe) {
    if (reihe.length < 3) return true;
    var richtung = 0;
    for (var i = 1; i < reihe.length; i++) {
      var d = reihe[i].y - reihe[i - 1].y;
      if (Math.abs(d) < GERAETETOLERANZ_MM) continue;
      var r = d > 0 ? 1 : -1;
      if (richtung === 0) richtung = r;
      else if (r !== richtung) return false;
    }
    return true;
  }

  /**
   * Steigung im Fenster um die Fahrhoehe, in mm Toe je mm Federweg.
   *
   * Genommen werden die beiden Punkte, die den Nullpunkt am engsten
   * einschliessen - dort arbeitet die Aufhaengung die meiste Zeit.
   */
  function steigungUmNull(reihe) {
    var unten = null, oben = null;
    for (var i = 0; i < reihe.length; i++) {
      if (reihe[i].x < 0 && (!unten || reihe[i].x > unten.x)) unten = reihe[i];
      if (reihe[i].x > 0 && (!oben || reihe[i].x < oben.x)) oben = reihe[i];
    }
    if (!unten || !oben) return null;
    return (oben.y - unten.y) / (oben.x - unten.x);
  }

  /**
   * Wo schneidet die Kurve die Nulllinie?
   *
   * Bei einer sauber genullten Messung ist das der Nullpunkt selbst. Liegt
   * er woanders, ist entweder der Nullpunkt verrutscht oder die Kurve ist
   * verschoben - beides einen Blick wert.
   */
  function nulldurchgang(reihe) {
    for (var i = 1; i < reihe.length; i++) {
      var a = reihe[i - 1], b = reihe[i];
      if (a.y === 0) return a.x;
      if ((a.y < 0 && b.y > 0) || (a.y > 0 && b.y < 0)) {
        return a.x + (0 - a.y) * (b.x - a.x) / (b.y - a.y);
      }
    }
    var letzter = reihe[reihe.length - 1];
    return letzter && letzter.y === 0 ? letzter.x : null;
  }

  /**
   * Symmetrie zwischen den Seiten.
   *
   * Das Template, E3: "Asymmetrie ist ein eigener Befund." Moegliche
   * Ursachen stehen dort - unterschiedliche Tie-Rod-Geometrie,
   * Idler/Pitman-Hoehendifferenz, Chassistoleranz, verbogenes Teil.
   *
   * Hier wird nur festgestellt, nicht gedeutet.
   */
  function symmetrie(links, rechts, fenster) {
    var kl = kennwerte(links, fenster);
    var kr = kennwerte(rechts, fenster);
    if (!kl || !kr) return null;

    // Je Federwegstufe, an der beide Seiten einen Wert haben.
    var proStufe = [];
    for (var i = 0; i < links.length; i++) {
      for (var j = 0; j < rechts.length; j++) {
        if (links[i].x !== rechts[j].x) continue;
        if (fenster && fenster.von !== undefined
            && (links[i].x < fenster.von || links[i].x > fenster.bis)) continue;
        proStufe.push({ x: links[i].x, diff: links[i].y - rechts[j].y });
      }
    }
    var diffs = proStufe.map(function (d) { return Math.abs(d.diff); });

    return {
      gleicheRichtung: gleicheRichtung(kl, kr),
      ausschlagLinks: kl.ausschlag,
      ausschlagRechts: kr.ausschlag,
      maxDifferenz: diffs.length ? Math.max.apply(null, diffs) : null,
      stufen: proStufe
    };
  }

  /**
   * Laufen beide Kurven in dieselbe Richtung?
   *
   * Massgeblich ist die Steigung, nicht der groesste Ausschlag. Zwei exakt
   * gegenlaeufige Kurven haben dieselben Extremwerte - die eine geht in Bump
   * nach Toe-in, die andere nach Toe-out, und max wie min sind bei beiden
   * gleich. Ein Vergleich der Extrema haelt sie darum faelschlich fuer
   * gleichgerichtet.
   */
  function gleicheRichtung(kl, kr) {
    var sl = kl.steigungUmNull, sr = kr.steigungUmNull;
    if (sl === null || sr === null) {
      // Ohne Punkte beidseits der Null bleibt nur der Ausschlag.
      return kl.ausschlag === 0 && kr.ausschlag === 0;
    }
    // Unterhalb der Geraetetoleranz je 25 mm Federweg ist die Richtung nicht
    // bestimmbar - dann ist auch keine Asymmetrie festzustellen.
    var schwelle = GERAETETOLERANZ_MM / 25;
    if (Math.abs(sl) < schwelle && Math.abs(sr) < schwelle) return true;
    return (sl >= 0) === (sr >= 0);
  }

  /**
   * Prueft die Messung, nicht das Fahrwerk.
   *
   * Das Template nennt zwei Gegenproben, die darueber entscheiden, ob die
   * Reihe ueberhaupt verwertbar ist:
   *
   *   A5  Arretierung geprueft - sonst misst man Lenkungsspiel
   *   C   Nullpunktkontrolle nach Bump und nach Droop
   *
   * Dazu die Vollstaendigkeit: eine Kurve aus drei Punkten ist keine Kurve.
   *
   * @returns {object[]} Befunde, je mit `art` (fehler|warnung|hinweis)
   */
  function pruefen(daten, seite) {
    var befunde = [];
    var p = punkte(daten, seite, true);

    if (!daten['bs_a5_geprueft']) {
      befunde.push({
        art: 'fehler',
        text: 'Pr\u00fcfung der Arretierung (A5) nicht best\u00e4tigt. '
            + 'Ohne sie misst man m\u00f6glicherweise Lenkungsspiel statt Bump Steer.'
      });
    }

    ['bump', 'droop'].forEach(function (r) {
      var v = zahl(daten['bs_null_' + seite.toLowerCase() + '_' + r]);
      if (v === null) {
        befunde.push({
          art: 'warnung',
          text: 'Nullpunktkontrolle nach ' + (r === 'bump' ? 'Bump' : 'Droop')
              + ' fehlt. Das Template verlangt sie nach jedem Durchgang.'
        });
      } else if (Math.abs(v) > GERAETETOLERANZ_MM) {
        befunde.push({
          art: 'fehler',
          text: 'Nullpunkt nach ' + (r === 'bump' ? 'Bump' : 'Droop') + ' bei '
              + v.toFixed(2) + ' mm statt 0. Es hat sich etwas bewegt \u2013 '
              + 'meist die Lenkung. Die Reihe ist nicht verwertbar.'
        });
      }
    });

    if (p.length < 5) {
      befunde.push({
        art: 'warnung',
        text: 'Nur ' + p.length + ' Messpunkte. Eine Kurve braucht mehr, '
            + 'besonders im Fenster um die Fahrh\u00f6he.'
      });
    }

    var k = kennwerte(p);
    if (k && !k.monoton) {
      befunde.push({
        art: 'hinweis',
        text: 'Die Kurve wechselt die Richtung. Das ist ein eigener Befund \u2013 '
            + 'nicht dasselbe wie ein gro\u00dfer Ausschlag.'
      });
    }

    if (k && k.nulldurchgang !== null && Math.abs(k.nulldurchgang) > 3) {
      befunde.push({
        art: 'hinweis',
        text: 'Nulldurchgang bei ' + k.nulldurchgang.toFixed(1) + ' mm Federweg, '
            + 'nicht am Nullpunkt. Nullpunkt pr\u00fcfen oder Kurve verschoben.'
      });
    }

    return befunde;
  }

  global.BumpSteer = {
    STUFEN: STUFEN,
    FEIN: FEIN,
    SEITEN: SEITEN,
    GERAETETOLERANZ_MM: GERAETETOLERANZ_MM,
    feldName: feldName,
    felder: felder,
    stufen: stufen,
    zahl: zahl,
    punkte: punkte,
    kennwerte: kennwerte,
    istMonoton: istMonoton,
    steigungUmNull: steigungUmNull,
    nulldurchgang: nulldurchgang,
    symmetrie: symmetrie,
    pruefen: pruefen
  };
})(typeof window !== 'undefined' ? window : globalThis);
