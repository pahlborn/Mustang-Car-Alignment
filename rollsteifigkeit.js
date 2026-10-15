/**
 * rollsteifigkeit.js - von der Federrate zur Balanceverteilung.
 *
 * Quelle: CHAPTER_SPRINGS_ROLL_STIFFNESS.md 3.1 bis 3.4.
 *
 * WARUM DIESES MODUL REIHENWEISE null ZURUECKGIBT
 *
 * Vier Werte dieses Fahrzeugs sind nicht gemessen:
 *
 *   motion_ratio_front   geht quadratisch in die Radrate ein
 *   leaf_spacing_rear    geht quadratisch in die hintere Rollsteifigkeit ein
 *   cg_height            geht linear in das Rollmoment ein
 *   spring_front_rate    die vordere Federrate selbst
 *
 * Das Kapitel sagt dazu: "Ohne diesen Wert ist jede Rechnung von der
 * Federrate zur Radrate eine Schaetzung." Dieses Modul schaetzt nicht. Fehlt
 * ein Eingangswert, kommt `null` heraus - und die Anzeige sagt, welcher
 * fehlt.
 *
 * Eine plausibel aussehende Zahl waere hier schaedlicher als gar keine: sie
 * wuerde eine Balanceentscheidung tragen, die auf einer Annahme beruht.
 *
 * KEIN ZIELWERT FUER TLLTD
 *
 * Das Kapitel nennt keinen. Es sagt nur, in welche Richtung eine Aenderung
 * wirkt. Was richtig ist, sagt die Trackvalidierung - nicht eine Formel.
 */
(function (global) {
  'use strict';

  var GRAD = 180 / Math.PI;

  function zahl(v) {
    if (v === null || v === undefined || v === '') return null;
    var n = parseFloat(String(v).replace(',', '.'));
    return (isNaN(n) || !isFinite(n)) ? null : n;
  }

  /**
   * lb/in nach N/mm.
   *
   * 1 lb = 4,4482216 N, 1 in = 25,4 mm. Die Blattfederrate steht in
   * 00_PROJECT.md als "175 lb/in je Feder" - amerikanische Herstellerangabe.
   * Wer sie ungerechnet als N/mm einsetzt, bekommt eine um den Faktor 5,7
   * zu steife Hinterachse und damit eine Balanceaussage, die das Vorzeichen
   * wechselt.
   */
  function lbinNachNmm(lbin) {
    var v = zahl(lbin);
    return v === null ? null : v * 4.4482216 / 25.4;
  }

  // ===========================================================================
  // Die Eingangswerte, einzeln benannt
  // ---------------------------------------------------------------------------
  // `feld` ist der Feldname, `quelle` die Stelle im Handbuch, an der steht,
  // wie er zu ermitteln ist. Wer eine Luecke sieht, soll nicht suchen muessen.
  // ===========================================================================
  // `einheit` ist die Einheit, in der der Wert in 00_PROJECT.md gefuehrt
  // wird - nicht die, in der gerechnet wird. `leaf_rate` steht dort in
  // lb/in; wer hier N/mm erwartet, rechnet um den Faktor 5,7 daneben.
  var EINGANG = [
    { feld: 'spring_front_rate',  label: 'Federrate vorn',       einheit: 'lb/in',
      quelle: '00_PROJECT.md \u00a73', umrechnen: 'lbin_nmm',
      hinweis: 'Im Handbuch in lb/in gef\u00fchrt \u2013 amerikanische '
             + 'Herstellerangabe, wird f\u00fcr die Rechnung umgerechnet.' },
    { feld: 'motion_ratio_front', label: 'Motion Ratio vorn',    einheit: '\u2013',
      quelle: '00_PROJECT.md \u00a78.2',
      hinweis: 'Rad definiert anheben, Federl\u00e4ngen\u00e4nderung messen. '
             + 'MR = \u0394Feder / \u0394Rad.' },
    { feld: 'track_front',        label: 'Spurweite vorn',       einheit: 'mm',
      quelle: '00_PROJECT.md \u00a78.2' },
    { feld: 'leaf_rate',          label: 'Blattfederrate',       einheit: 'lb/in',
      quelle: '00_PROJECT.md \u00a74', umrechnen: 'lbin_nmm',
      hinweis: 'Je Feder. Im Handbuch in lb/in gef\u00fchrt \u2013 '
             + 'wird f\u00fcr die Rechnung umgerechnet.' },
    { feld: 'leaf_spacing_rear',  label: 'Federabstand hinten',  einheit: 'mm',
      quelle: '00_PROJECT.md \u00a78.2',
      hinweis: 'Abstand der Blattfedermitten \u2013 <strong>nicht</strong> die Spurweite.' },
    { feld: 'arb_front_dia',      label: 'ARB-Durchmesser vorn', einheit: 'mm',
      quelle: '00_PROJECT.md \u00a73', optional: true,
      hinweis: 'Aus Durchmesser allein folgt keine Rate \u2013 dazu fehlen '
             + 'Hebelarm und Torsionsl\u00e4nge. Der Stabilisator wird darum '
             + 'bisher <strong>nicht</strong> mitgerechnet.' }
  ];

  var EINGANG_LASTTRANSFER = [
    { feld: 'mass_total_raceready', label: 'Masse race-ready', einheit: 'kg',
      quelle: '00_PROJECT.md \u00a78.2' },
    { feld: 'cg_height',            label: 'Schwerpunkth\u00f6he', einheit: 'mm',
      quelle: '00_PROJECT.md \u00a78.2',
      hinweis: 'Waagenmessung mit angehobener Achse. Geht <strong>linear</strong> '
             + 'in das Rollmoment ein.' }
  ];

  /**
   * Radrate aus Federrate und Motion Ratio.
   *
   * Kapitel 3.1: `k_Rad = k_Feder * MR^2`. Das Quadrat ist der Punkt - ein
   * Motion Ratio von 0,5 bedeutet nicht halbe, sondern ein Viertel der Rate
   * am Rad.
   */
  function radrate(federrate, motionRatio) {
    var k = zahl(federrate), mr = zahl(motionRatio);
    if (k === null || mr === null || mr <= 0) return null;
    return k * mr * mr;
  }

  /**
   * Rollsteifigkeit einer Achse aus Radrate und Federbasis.
   *
   * Kapitel 3.2: `K_roll = (k_Rad * t^2) / 2` in Nm/rad, mit t in Metern
   * und k_Rad in N/m.
   *
   * Die Federbasis ist vorn die Spurweite, hinten der Abstand der
   * Blattfedermitten - das Kapitel 5.2 warnt ausdruecklich davor, hinten
   * die Spurweite einzusetzen.
   *
   * @returns {{proRad: number, proGrad: number}|null} Nm/rad und Nm/Grad
   */
  function rollsteifigkeit(kRadNmm, basisMm) {
    var k = zahl(kRadNmm), t = zahl(basisMm);
    if (k === null || t === null || t <= 0) return null;
    var kNm = k * 1000;          // N/mm -> N/m
    var tM = t / 1000;           // mm -> m
    var proRad = (kNm * tM * tM) / 2;
    return { proRad: proRad, proGrad: proRad / GRAD };
  }

  /**
   * Gesamte Rollsteifigkeit einer Achse: Feder plus Stabilisator.
   *
   * Kapitel 3.3: der Stabilisator wirkt nur bei gegensinnigem Federn, also
   * genau bei Rollbewegung - und kommt darum additiv dazu.
   *
   * `arbNmProGrad` darf fehlen; dann ist das Ergebnis der reine Federanteil.
   */
  function achse(federrate, motionRatio, basisMm, arbNmProGrad) {
    var kRad = radrate(federrate, motionRatio);
    if (kRad === null) return null;
    var feder = rollsteifigkeit(kRad, basisMm);
    if (!feder) return null;

    var arb = zahl(arbNmProGrad);
    return {
      radrate: kRad,
      federProGrad: feder.proGrad,
      arbProGrad: arb,
      gesamtProGrad: feder.proGrad + (arb === null ? 0 : arb),
      mitArb: arb !== null
    };
  }

  /**
   * TLLTD - der Anteil der Vorderachse am gesamten Rollwiderstand.
   *
   * Kapitel 3.4: `TLLTD = K_roll,vorn / (K_roll,vorn + K_roll,hinten)`.
   *
   * Es zaehlt die Verteilung, nicht das Niveau. Ein insgesamt weiches
   * Fahrwerk kann dieselbe Balance haben wie ein hartes.
   *
   * Bewertet wird nichts: das Kapitel nennt keinen Zielwert, nur die
   * Wirkungsrichtung einer Aenderung.
   */
  function tlltd(vorn, hinten) {
    if (!vorn || !hinten) return null;
    var summe = vorn.gesamtProGrad + hinten.gesamtProGrad;
    if (!(summe > 0)) return null;
    return {
      anteilVorn: vorn.gesamtProGrad / summe,
      anteilHinten: hinten.gesamtProGrad / summe,
      summeProGrad: summe,
      // Der Stabilisator wurde nur beruecksichtigt, wo eine Rate vorlag.
      // Ohne diesen Vermerk sieht das Ergebnis vollstaendiger aus, als es
      // ist.
      arbBeruecksichtigt: vorn.mitArb || hinten.mitArb
    };
  }

  /**
   * Rollmoment aus Masse, Querbeschleunigung und Schwerpunkthoehe.
   *
   * Kapitel 2: `M_roll = m * a_y * h_CG`. Linear in h_CG - darum ist
   * cg_height der wichtigste fehlende Einzelwert des Projekts.
   *
   * @param {number} ay in g
   */
  function rollmoment(masseKg, cgHoeheMm, ayG) {
    var m = zahl(masseKg), h = zahl(cgHoeheMm), a = zahl(ayG);
    if (m === null || h === null || a === null) return null;
    return m * (a * 9.81) * (h / 1000);     // Nm
  }

  /**
   * Was fehlt, um rechnen zu koennen?
   *
   * Gibt die fehlenden Eingangswerte mit Fundstelle zurueck - nicht nur
   * "unvollstaendig". Wer eine Luecke sieht, soll wissen, wo sie zu
   * schliessen ist.
   *
   * @param {object} daten  Feldname zu Wert
   * @param {boolean} [mitLasttransfer]
   */
  function fehlt(daten, mitLasttransfer) {
    var liste = EINGANG.concat(mitLasttransfer ? EINGANG_LASTTRANSFER : []);
    return liste.filter(function (e) {
      if (e.optional) return false;
      return zahl(daten[e.feld]) === null;
    });
  }

  /**
   * Vollstaendige Auswertung aus einem Datensatz.
   *
   * @returns {{vorn, hinten, tlltd, fehlt, vollstaendig}}
   */
  function auswerten(daten) {
    // Der Stabilisator wird nicht mitgerechnet: aus dem Durchmesser allein
    // folgt keine Rate. Dazu braeuchte es Hebelarm und Torsionslaenge, und
    // beide sind in 00_PROJECT.md offen. Eine geschaetzte ARB-Rate waere
    // genau die Zahl, die dieses Modul nicht liefern soll.
    var v = achse(lbinNachNmm(daten.spring_front_rate), daten.motion_ratio_front,
                  daten.track_front, null);

    // Hinten: Blattfederrate in lb/in, Motion Ratio 1. Die Blattfeder sitzt
    // praktisch am Achsrohr - eine Vereinfachung, die Kapitel 5.2 deckt: es
    // nennt dort den Federabstand als bestimmende Groesse, nicht ein
    // Uebersetzungsverhaeltnis.
    var h = achse(lbinNachNmm(daten.leaf_rate), 1, daten.leaf_spacing_rear, null);

    var luecken = fehlt(daten);
    return {
      vorn: v,
      hinten: h,
      tlltd: tlltd(v, h),
      fehlt: luecken,
      vollstaendig: luecken.length === 0
    };
  }

  global.Rollsteifigkeit = {
    EINGANG: EINGANG,
    EINGANG_LASTTRANSFER: EINGANG_LASTTRANSFER,
    zahl: zahl,
    lbinNachNmm: lbinNachNmm,
    radrate: radrate,
    rollsteifigkeit: rollsteifigkeit,
    achse: achse,
    tlltd: tlltd,
    rollmoment: rollmoment,
    fehlt: fehlt,
    auswerten: auswerten
  };
})(typeof window !== 'undefined' ? window : globalThis);
