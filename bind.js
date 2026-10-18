/**
 * bind.js - die vier Bind-Tests und ihre Auswertung.
 *
 * Quelle: handbuch/CHAPTER_BIND_DIAGNOSIS.md 6.1 bis 6.4.
 *
 * WARUM DAS VOR ALLEM ANDEREN STEHT
 *
 * Bind ist eine Verspannung, die verhindert, dass sich die Aufhaengung in
 * ihre kraeftefreie Lage setzt. Das Glossar sagt dazu den Satz, auf den es
 * ankommt:
 *
 *   "Bind erzeugt keine Fehlermeldung. Erst die Wiederholungsmessung verraet
 *    ihn. Wer bei vorhandenem Bind Setup-Arbeit macht, optimiert gegen ein
 *    Rauschen."
 *
 * Das Kapitel nennt es unter den Streckensymptomen den gefaehrlichsten Fall:
 * "Setup-Aenderungen zeigen nicht die erwartete Wirkung" - die Aenderungen
 * scheinen willkuerlich, und man zieht falsche Schluesse ueber das Fahrzeug.
 *
 * DIE SCHWELLEN SIND PROJEKTFESTLEGUNG
 *
 * 0,5 % und 1 % der Gesamtmasse stehen so im Kapitel, ausdruecklich mit dem
 * Vermerk: "Die Prozentangaben sind Projektfestlegung, keine
 * Herstellerangabe. Sie dienen als Arbeitsschwelle und sind nach den ersten
 * realen Messungen zu ueberpruefen."
 *
 * Darum stehen sie hier als benannte Konstanten mit genau diesem Hinweis -
 * nicht als Zahl mitten in einer Bedingung.
 */
(function (global) {
  'use strict';

  var RAEDER = ['LF', 'RF', 'LR', 'RR'];

  // Kapitel 6.1, Auswertungstabelle. Projektfestlegung, keine
  // Herstellerangabe - nach den ersten realen Messungen zu ueberpruefen.
  var SCHWELLE_GUT = 0.5;        // % der Gesamtmasse
  var SCHWELLE_BIND = 1.0;

  var BEWERTUNG = {
    gut:         { text: 'gut \u2013 Setup-Arbeit m\u00f6glich', sperrt: false },
    grenzwertig: { text: 'grenzwertig \u2013 Ursache suchen',    sperrt: false },
    bind:        { text: 'Bind. Keine Setup-Arbeit, bevor das gekl\u00e4rt ist.',
                   sperrt: true }
  };

  function zahl(v) {
    if (v === null || v === undefined || v === '') return null;
    var n = parseFloat(String(v).replace(',', '.'));
    return (isNaN(n) || !isFinite(n)) ? null : n;
  }

  // Feldnamen. Sie stehen hier und nicht in der Seite - sonst gaebe es den
  // Namen an zwei Orten (Arbeitsregel 4), und die Anzeige liefe beim
  // naechsten Umbenennen ins Leere.

  /** Feldname fuer 6.1: drei Durchgaenge mal vier Ecken. */
  function feldRadlast(durchgang, rad) {
    return 'bind_cw_' + durchgang + '_' + rad.toLowerCase();
  }

  /** Feldname fuer 6.2: Radlast je Ecke, vor und nach dem Niederdruecken. */
  function feldCamber(vorNach, rad) {
    return 'bind_cb_' + vorNach + '_' + rad.toLowerCase();
  }

  /** Feldname fuer 6.3: Radlast je Ecke in Messung A, B oder C. */
  function feldLateral(messung, rad) {
    return 'bind_lat_' + messung + '_' + rad.toLowerCase();
  }

  /** Feldname fuer 6.4: Ride Height je Seite, belastet und entlastet. */
  function feldHysterese(zustand, seite) {
    return 'bind_hy_' + zustand + '_' + seite.toLowerCase();
  }

  // ===========================================================================
  // 6.1 Reproduzierbarkeitstest der Radlasten
  // ===========================================================================

  /**
   * Streuung je Ecke und Bewertung.
   *
   * Das Kapitel verlangt drei Durchgaenge mit Anheben und Absetzen
   * dazwischen. Zwei reichen fuer eine Spanne, aber nicht fuer die Aussage -
   * darum wird unter drei nur gerechnet und nicht bewertet.
   *
   * @returns {object|null}
   */
  function reproduzierbarkeit(daten) {
    var durchgaenge = [];
    for (var d = 1; d <= 3; d++) {
      var satz = {};
      var vollstaendig = true;
      for (var i = 0; i < RAEDER.length; i++) {
        var v = zahl(daten[feldRadlast(d, RAEDER[i])]);
        if (v === null) { vollstaendig = false; break; }
        satz[RAEDER[i]] = v;
      }
      if (vollstaendig) durchgaenge.push(satz);
    }
    if (durchgaenge.length < 2) return null;

    // Gesamtmasse aus dem ersten vollstaendigen Durchgang - sie ist die
    // Bezugsgroesse der Prozentangabe.
    var gesamt = RAEDER.reduce(function (s, r) { return s + durchgaenge[0][r]; }, 0);
    if (!(gesamt > 0)) return null;

    var ecken = RAEDER.map(function (r) {
      var werte = durchgaenge.map(function (s) { return s[r]; });
      var spanne = Math.max.apply(null, werte) - Math.min.apply(null, werte);
      return { rad: r, werte: werte, spanne: spanne, prozent: spanne / gesamt * 100 };
    });

    var maxProzent = Math.max.apply(null, ecken.map(function (e) { return e.prozent; }));

    return {
      durchgaenge: durchgaenge.length,
      gesamt: gesamt,
      ecken: ecken,
      maxProzent: maxProzent,
      masse: massen(durchgaenge),
      richtungen: richtungen(durchgaenge),
      bewertung: bewerten(maxProzent),
      // Drei Durchgaenge verlangt das Kapitel. Mit zweien laesst sich eine
      // Spanne bilden, aber keine Aussage ueber Reproduzierbarkeit treffen.
      vollstaendig: durchgaenge.length >= 3
    };
  }

  /** Gesamtmasse je Durchgang - sie sollte sich nicht aendern. */
  function massen(durchgaenge) {
    var werte = durchgaenge.map(function (s) {
      return RAEDER.reduce(function (a, r) { return a + s[r]; }, 0);
    });
    return {
      werte: werte,
      spanne: Math.max.apply(null, werte) - Math.min.apply(null, werte)
    };
  }

  /**
   * Diagonal-, Laengs- und Quermass je Durchgang.
   *
   * Kapitel 6.1, Abschnitt "Zusaetzlich: wandert Last diagonal?":
   *
   *   D        = (dLF + dRR) - (dRF + dLR)
   *   Laengs   = (dLF + dRF) - (dLR + dRR)
   *   Quer     = (dLF + dLR) - (dRF + dRR)
   *
   * mit d = Abweichung dieser Ecke gegenueber Messung A, alles in kg.
   *
   * Warum in kg und nicht ueber das Cross Weight in Prozent: Cross ist
   * (RF + LR) / Total. Schwankt die Gesamtmasse zwischen den Durchgaengen
   * auch nur um ein Kilogramm, bewegt sich der Nenner mit - und erzeugt
   * eine scheinbare Cross-Streuung, ohne dass Last gewandert waere. Bei
   * einer sauberen Reihe mit plus/minus 1 kg je Ecke entsteht so ein
   * Cross-Ausschlag von ueber 0,2 Prozentpunkten, der nichts bedeutet.
   *
   * Bewertet wird nicht: das Kapitel haelt die Schwelle ausdruecklich
   * offen, bis reale Messreihen vorliegen. Eine Zahl ohne Datengrundlage
   * waere hier genauso wertlos wie ein geratener Sollwert.
   */
  function richtungen(durchgaenge) {
    if (durchgaenge.length < 2) return null;
    var a = durchgaenge[0];
    var out = [];
    for (var i = 1; i < durchgaenge.length; i++) {
      var s = durchgaenge[i];
      var d = {};
      for (var k = 0; k < RAEDER.length; k++) d[RAEDER[k]] = s[RAEDER[k]] - a[RAEDER[k]];
      out.push({
        durchgang: i + 1,
        diagonal: (d.LF + d.RR) - (d.RF + d.LR),
        laengs:   (d.LF + d.RF) - (d.LR + d.RR),
        quer:     (d.LF + d.LR) - (d.RF + d.RR)
      });
    }
    function groesster(name) {
      return Math.max.apply(null, out.map(function (x) { return Math.abs(x[name]); }));
    }
    return {
      proDurchgang: out,
      maxDiagonal: groesster('diagonal'),
      maxLaengs: groesster('laengs'),
      maxQuer: groesster('quer')
    };
  }

  function bewerten(prozent) {
    if (prozent === null || prozent === undefined) return null;
    if (prozent < SCHWELLE_GUT) return 'gut';
    if (prozent <= SCHWELLE_BIND) return 'grenzwertig';
    return 'bind';
  }

  // ===========================================================================
  // 6.2 Sichttest auf Camber-Bind
  // ===========================================================================

  /**
   * Radlasten vor und nach dem Niederdruecken.
   *
   * Kapitel 6.2: "Aendern sich die Werte deutlich, hat sich Verspannung
   * abgebaut, die vorher mitgemessen wurde."
   *
   * Was "deutlich" ist, sagt das Kapitel nicht - darum wird hier nur die
   * Differenz ausgewiesen und auf dieselbe Prozentschwelle bezogen wie 6.1.
   * Das ist eine Ableitung, keine Vorgabe, und sie steht als solche da.
   */
  function camberBind(daten) {
    var vorher = {}, nachher = {};
    for (var i = 0; i < RAEDER.length; i++) {
      var r = RAEDER[i];
      var a = zahl(daten[feldCamber('vor', r)]);
      var b = zahl(daten[feldCamber('nach', r)]);
      if (a === null || b === null) return null;
      vorher[r] = a; nachher[r] = b;
    }
    var gesamt = RAEDER.reduce(function (s, r) { return s + vorher[r]; }, 0);
    if (!(gesamt > 0)) return null;

    var ecken = RAEDER.map(function (r) {
      var diff = nachher[r] - vorher[r];
      return { rad: r, vorher: vorher[r], nachher: nachher[r],
               differenz: diff, prozent: Math.abs(diff) / gesamt * 100 };
    });
    var max = Math.max.apply(null, ecken.map(function (e) { return e.prozent; }));
    return { ecken: ecken, gesamt: gesamt, maxProzent: max, bewertung: bewerten(max) };
  }

  // ===========================================================================
  // 6.3 Laterale Ueberbestimmung - Hinterachse
  // ===========================================================================

  // Kapitel 6.3, Deutungstabelle. Drei Messungen: Istzustand, Panhard
  // geloest, Panhard wieder angeschlossen.
  var LATERAL_DEUTUNG = [
    { id: 'kein_bind',
      text: 'kein lateraler Bind \u2013 Panhard und Federn vertragen sich',
      sperrt: false },
    { id: 'verspannt_eingebaut',
      text: 'Panhard war verspannt eingebaut \u2013 L\u00e4nge und Einbaulage pr\u00fcfen',
      sperrt: true },
    { id: 'laenge_falsch',
      text: 'Anschlie\u00dfen erzeugt Verspannung \u2013 <strong>Panhard-L\u00e4nge falsch</strong>',
      sperrt: true },
    { id: 'mehrfach',
      text: 'mehrfacher Bind \u2013 Ursachen einzeln isolieren',
      sperrt: true }
  ];

  function deutung(id) {
    for (var i = 0; i < LATERAL_DEUTUNG.length; i++) {
      if (LATERAL_DEUTUNG[i].id === id) return LATERAL_DEUTUNG[i];
    }
    return null;
  }

  /**
   * Die drei Messreihen gegeneinander.
   *
   * A ~ B ~ C        kein Bind
   * A != B, B ~ C    Panhard war verspannt eingebaut
   * A ~ B, B != C    Anschliessen erzeugt Verspannung - Laenge falsch
   * alle verschieden mehrfacher Bind
   *
   * Als "gleich" gilt, was unterhalb der Schwelle aus 6.1 liegt - dieselbe
   * Groessenordnung, dieselbe Begruendung.
   */
  function lateral(daten) {
    var reihen = {};
    var mess = ['a', 'b', 'c'];
    for (var m = 0; m < mess.length; m++) {
      var satz = {};
      for (var i = 0; i < RAEDER.length; i++) {
        var v = zahl(daten[feldLateral(mess[m], RAEDER[i])]);
        if (v === null) return null;
        satz[RAEDER[i]] = v;
      }
      reihen[mess[m]] = satz;
    }

    var gesamt = RAEDER.reduce(function (s, r) { return s + reihen.a[r]; }, 0);
    if (!(gesamt > 0)) return null;

    function abweichung(x, y) {
      var max = 0;
      for (var i = 0; i < RAEDER.length; i++) {
        var d = Math.abs(x[RAEDER[i]] - y[RAEDER[i]]) / gesamt * 100;
        if (d > max) max = d;
      }
      return max;
    }

    var ab = abweichung(reihen.a, reihen.b);
    var bc = abweichung(reihen.b, reihen.c);
    var ac = abweichung(reihen.a, reihen.c);

    // Kapitel 6.3, Hinweis "Was ~ bedeutet": gleich ist, wenn keine Ecke
    // mehr als 0,5 % der Gesamtmasse abweicht - dieselbe Groessenordnung,
    // die 6.1 als wiederholbar ("gut") kennzeichnet. Groessere Abweichungen
    // werden der Aenderung zugeschrieben, nicht dem Messrauschen.
    var abGleich = ab <= SCHWELLE_GUT;
    var bcGleich = bc <= SCHWELLE_GUT;

    var id;
    if (abGleich && bcGleich) id = 'kein_bind';
    else if (!abGleich && bcGleich) id = 'verspannt_eingebaut';
    else if (abGleich && !bcGleich) id = 'laenge_falsch';
    else id = 'mehrfach';

    return {
      abweichungAB: ab, abweichungBC: bc, abweichungAC: ac,
      gesamt: gesamt,
      deutung: deutung(id)
    };
  }

  // ===========================================================================
  // 6.4 Hysteresetest
  // ===========================================================================

  /**
   * Ride Height von oben und von unten angefahren.
   *
   * Kapitel 6.4: "Eine grosse Differenz bedeutet: Die Aufhaengung findet
   * ihre Lage nicht selbst, sondern bleibt dort stehen, wo die Reibung sie
   * festhaelt."
   *
   * Bei Blattfedern ist Hysterese bauartbedingt normal. Entscheidend ist
   * die Symmetrie: "sie sollte links und rechts aehnlich sein."
   *
   * Darum wird hier KEINE absolute Schwelle angelegt - das Kapitel nennt
   * keine. Ausgewiesen wird die Differenz je Seite und der Unterschied
   * zwischen den Seiten.
   */
  function hysterese(daten) {
    var seiten = ['L', 'R'];
    var out = [];
    for (var i = 0; i < seiten.length; i++) {
      // Kapitel 6.4: erst von oben belasten und loslassen, Ride Height
      // messen; dann anheben, absetzen, Ride Height messen. Die Differenz
      // ist die Hysterese. Gemessen wird also die Hoehe, nicht die
      // Radlast - die Einheit ist mm.
      var belastet = zahl(daten[feldHysterese('belastet', seiten[i])]);
      var entlastet = zahl(daten[feldHysterese('entlastet', seiten[i])]);
      if (belastet === null || entlastet === null) return null;
      out.push({ seite: seiten[i], belastet: belastet, entlastet: entlastet,
                 hysterese: Math.abs(belastet - entlastet) });
    }
    var links = out[0].hysterese, rechts = out[1].hysterese;
    return {
      seiten: out,
      differenz: Math.abs(links - rechts),
      groessere: links > rechts ? 'L' : (rechts > links ? 'R' : null)
    };
  }

  // ===========================================================================
  // Gesamtbefund
  // ===========================================================================

  /**
   * Sperrt der Bind-Befund die Setup-Arbeit?
   *
   * Projektregel 1 aus Kapitel 8: "Vor jeder Setup-Session:
   * Reproduzierbarkeitstest nach 6.1. Ohne bestandenen Test keine
   * Zehntelarbeit."
   *
   * Und Regel 6: "Keine Setup-Schluesse aus Messungen mit bekanntem Bind."
   *
   * Zwei Faelle sperren:
   *   - ein durchgefuehrter Test mit Befund `bind`
   *   - eine laterale Deutung, die auf Verspannung zeigt
   *
   * Ein NICHT durchgefuehrter Test sperrt nicht - er fehlt. Das ist eine
   * andere Aussage und wird eigens gemeldet.
   */
  function befund(daten) {
    var r = reproduzierbarkeit(daten);
    var cb = camberBind(daten);
    var lat = lateral(daten);
    var hy = hysterese(daten);

    // Gesperrt wird nur, wo das Kapitel eine Schwelle nennt. Das
    // Diagonalmass gehoert nicht dazu - seine Schwelle ist ausdruecklich
    // offen, bis reale Messreihen vorliegen. Es wird ausgewiesen, nicht
    // bewertet.
    var gruende = [];
    if (r && r.bewertung === 'bind') {
      gruende.push('Radlasten streuen ' + r.maxProzent.toFixed(2)
        + ' % der Gesamtmasse (Schwelle ' + SCHWELLE_BIND + ' %)');
    }
    if (lat && lat.deutung.sperrt) {
      gruende.push('Hinterachse: ' + lat.deutung.text.replace(/<[^>]+>/g, ''));
    }

    return {
      reproduzierbarkeit: r,
      camberBind: cb,
      lateral: lat,
      hysterese: hy,
      // Der Test nach 6.1 ist der verbindliche. Ohne ihn gilt nicht
      // "kein Bind", sondern "nicht geprueft".
      geprueft: !!(r && r.vollstaendig),
      sperrt: gruende.length > 0,
      gruende: gruende
    };
  }

  global.Bind = {
    RAEDER: RAEDER,
    SCHWELLE_GUT: SCHWELLE_GUT,
    SCHWELLE_BIND: SCHWELLE_BIND,
    BEWERTUNG: BEWERTUNG,
    LATERAL_DEUTUNG: LATERAL_DEUTUNG,
    zahl: zahl,
    feldRadlast: feldRadlast,
    feldCamber: feldCamber,
    feldLateral: feldLateral,
    feldHysterese: feldHysterese,
    bewerten: bewerten,
    reproduzierbarkeit: reproduzierbarkeit,
    richtungen: richtungen,
    massen: massen,
    camberBind: camberBind,
    lateral: lateral,
    hysterese: hysterese,
    befund: befund,
    deutung: deutung
  };
})(typeof window !== 'undefined' ? window : globalThis);
