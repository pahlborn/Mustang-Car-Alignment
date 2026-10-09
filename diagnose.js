/**
 * diagnose.js - Phase 20 bis 22: Symptom, Hypothese, eine Aenderung, A/B.
 *
 * Anders als die Werkstattphasen hat dieser Teil keinen Endzustand. Er ist
 * ein Regelkreis, und darum gibt es hier keinen Fortschrittsbalken, sondern
 * eine Liste offener Hypothesen.
 *
 * DREI QUELLEN, ALLE IM HANDBUCH
 *
 *   SYMPTOME    CONVENTIONS.md 18
 *   HIERARCHIE  CHAPTER_HANDLING_DIAGNOSIS_DECISION_TREE.md 5
 *   MATRIX      CHAPTER_HANDLING_DIAGNOSIS_DECISION_TREE.md 29
 *
 * tests/diagnose.test.mjs prueft alle drei in beide Richtungen gegen die
 * Markdown-Dateien - wie recheck.js gegen 02_WORKFLOW.md 27.
 *
 * WAS DIESES MODUL NICHT TUT
 *
 * Es schlaegt keine Setupaenderung vor. Das Kapitel sagt dazu: "Das ist eine
 * Methodik, kein automatischer Setupvorschlag." Es nennt, was zuerst zu
 * pruefen ist, und haelt fest, was man getan hat - die Entscheidung bleibt
 * beim Menschen.
 */
(function (global) {
  'use strict';

  var STORAGE_KEY = 'chassisDiagnose';
  var GIST_FILE = 'mustang-chassis-diagnose.json';

  // ===========================================================================
  // SYMPTOME - Abschrift von CONVENTIONS.md 18
  // ---------------------------------------------------------------------------
  // `code` steht wortgleich dort. "Der Code beschreibt das Symptom, nicht
  // dessen Ursache" - darum heisst keiner nach einem Bauteil.
  // ===========================================================================
  var SYMPTOME = [
    { code: 'ENTRY-US',          phase: 'Entry',  titel: 'Untersteuern beim Einlenken' },
    { code: 'ENTRY-OS',          phase: 'Entry',  titel: 'Uebersteuern beim Einlenken' },
    { code: 'MID-US',            phase: 'Mid',    titel: 'Untersteuern am Kurvenscheitel' },
    { code: 'MID-OS',            phase: 'Mid',    titel: 'Uebersteuern am Kurvenscheitel' },
    { code: 'POWER-US',          phase: 'Exit',   titel: 'Untersteuern beim Gasgeben' },
    { code: 'POWER-OS',          phase: 'Exit',   titel: 'Uebersteuern beim Gasgeben' },
    { code: 'HIGH-SPEED-US',     phase: 'Alle',   titel: 'Untersteuern nur bei hohem Tempo' },
    { code: 'HIGH-SPEED-OS',     phase: 'Alle',   titel: 'Uebersteuern nur bei hohem Tempo' },
    { code: 'BRAKE-INSTABILITY', phase: 'Braking', titel: 'Unruhe beim Bremsen' },
    { code: 'BUMP-INSTABILITY',  phase: 'Alle',   titel: 'Unruhe ueber Kerbs und Bodenwellen' }
  ];

  // Zusatzflags aus demselben Abschnitt. Sie stehen neben dem Code, nicht
  // statt seiner - "nur links" ist keine eigene Fehlerart, sondern eine
  // Beobachtung zum selben Symptom.
  var FLAGS = [
    { code: 'L/R-ASYMMETRY',     titel: 'Nur Links- oder nur Rechtskurven' },
    { code: 'DEGRADES-WITH-LAPS', titel: 'Wird mit jeder Runde schlechter' }
  ];

  // ===========================================================================
  // HIERARCHIE - Abschrift von DECISION_TREE 5
  // ---------------------------------------------------------------------------
  // Die Reihenfolge ist der Inhalt. Wer bei D anfaengt, waehrend A ungeprueft
  // ist, stellt Geometrie an einem Fahrzeug ein, das vielleicht nur ein
  // ausgeschlagenes Lager hat.
  //
  // `stopp` markiert die Stufe, auf der die Stop-Regel greift (Abschnitt 25):
  // dort wird nicht weiter getuned, sondern repariert.
  // ===========================================================================
  var HIERARCHIE = [
    {
      key: 'A', titel: 'Sicherheit / Mechanik', stopp: true,
      punkte: ['Spiel', 'lose Bauteile', 'Radlager', 'Bremse haengt',
               'Reifen beschaedigt', 'Druckverlust', 'Daempferleck',
               'Blattfeder / Panhard / U-Bolts', 'Tie Rods']
    },
    {
      key: 'B', titel: 'Reproduzierbarkeit',
      punkte: ['tritt es mehrfach auf?', 'dieselbe Kurve?', 'dieselbe Phase?',
               'beide Richtungen?']
    },
    {
      key: 'C', titel: 'Reifen',
      punkte: ['Druck', 'Temperatur O/M/I', 'Shore / Alter', 'Reifenbild',
               'Heat Cycles']
    },
    {
      key: 'D', titel: 'Geometrie',
      punkte: ['Ride Height', 'Corner Weights', 'Camber', 'Castor', 'Toe',
               'Thrust', 'Bump Steer', 'Ackermann']
    },
    {
      key: 'E', titel: 'Feder-/Roll-/Daempfersystem',
      punkte: ['Federn', 'Blattfedern', 'Stabilisatoren', 'Daempfer',
               'Bump Stops', 'Panhard-Hoehe']
    }
  ];

  // ===========================================================================
  // MATRIX - Abschrift von DECISION_TREE 29
  // ---------------------------------------------------------------------------
  // `zeile` ist der Symptomname aus der Tabelle, wortgleich. Die drei Spalten
  // ebenso. Die Spalte "nichtSofort" ist die wertvollste: sie nennt den
  // naheliegenden Griff, der die Ursache nur verdeckt.
  // ===========================================================================
  var MATRIX = [
    { codes: ['BRAKE-INSTABILITY'], zeile: 'Brake instability',
      erst: 'Bremsen, Druck, Toe, Thrust', danach: 'Bump Steer, Cross', nichtSofort: 'Federn' },
    { codes: ['ENTRY-US'], zeile: 'Entry understeer',
      erst: 'Reifen, Toe, Fahrerinput', danach: 'Camber, Castor, Bump', nichtSofort: 'Panhard' },
    { codes: ['ENTRY-OS'], zeile: 'Entry oversteer',
      erst: 'Trail Brake, Rear Tire', danach: 'Cross, Dämpfer, Rear Geo', nichtSofort: 'Front Toe blind' },
    { codes: ['MID-US', 'HIGH-SPEED-US'], zeile: 'Mid understeer',
      erst: 'Front Temp/Druck', danach: 'Camber, Ackermann, Roll Balance', nichtSofort: 'mehrere Dinge' },
    { codes: ['MID-OS', 'HIGH-SPEED-OS'], zeile: 'Mid oversteer',
      erst: 'Rear Temp/Druck', danach: 'Rear Roll, Panhard, Cross', nichtSofort: 'Toe blind' },
    { codes: ['POWER-US'], zeile: 'Power understeer',
      erst: 'Throttle rate', danach: 'Weight Transfer, Front Droop', nichtSofort: 'Camber blind' },
    { codes: ['POWER-OS'], zeile: 'Power oversteer',
      erst: 'Rear Tire, Throttle', danach: 'Leaf/Damper/Diff', nichtSofort: 'Front Alignment' },
    { codes: ['BUMP-INSTABILITY'], zeile: 'Bump instability',
      erst: 'Spiel, Reifen', danach: 'Bump Steer, Travel', nichtSofort: 'statisches Toe' },
    { codes: ['L/R-ASYMMETRY'], zeile: 'L/R asymmetry',
      erst: 'Reifen, Corner Weight', danach: 'Alignment, Thrust, Panhard', nichtSofort: 'asymmetrische Targets' },
    { codes: ['DEGRADES-WITH-LAPS'], zeile: 'Degrades with laps',
      erst: 'Hot Pressure/Temp', danach: 'Tire Age, Brakes, Dampers', nichtSofort: 'Geometry zuerst' }
  ];

  // ===========================================================================
  // CHANGE IMPACT SHEET - Abschrift von DECISION_TREE 22
  // ---------------------------------------------------------------------------
  // Alle Felder sind Pflicht. "Messgroesse fuer Erfolg" ist das wichtigste:
  // ohne sie ist der naechste Stint nicht auswertbar, egal wie er ausgeht.
  // ===========================================================================
  var SHEET = [
    { key: 'symptom',     label: 'Symptom',          hinweis: 'Code und Beobachtung' },
    { key: 'phase',       label: 'Phase',            hinweis: 'Braking, Entry, Mid, Exit' },
    { key: 'kurven',      label: 'Kurven',           hinweis: 'welche genau' },
    { key: 'daten',       label: 'Daten',            hinweis: 'Pyrometer, Druck, Rundenzeiten' },
    { key: 'hypothese',   label: 'Hypothese',        hinweis: 'was vermutlich passiert' },
    { key: 'warum',       label: 'Warum?',           hinweis: 'woran sich das festmacht' },
    { key: 'aenderung',   label: 'Geplante Aenderung', hinweis: 'genau eine' },
    { key: 'primaer',     label: 'Erwartete Primaerwirkung' },
    { key: 'neben',       label: 'Erwartete Nebenwirkung' },
    { key: 'rueckschritt', label: 'Welche fruehere Phase koennte verschlechtert werden?' },
    { key: 'messgroesse', label: 'Messgroesse fuer Erfolg', hinweis: 'woran erkennt man es' },
    { key: 'abbruch',     label: 'Abbruchkriterium',  hinweis: 'wann wird zurueckgebaut' }
  ];

  // A/B-Ergebnisse nach 02_WORKFLOW.md 25. "Nicht aussagekraeftig" ist ein
  // gleichwertiges Ergebnis, kein Ausweichfeld - darum steht es in der Liste
  // und nicht im Freitext.
  var ERGEBNISSE = [
    { key: '',        label: 'noch offen' },
    { key: 'besser',  label: 'besser' },
    { key: 'schlechter', label: 'schlechter' },
    { key: 'neutral', label: 'neutral' },
    { key: 'unklar',  label: 'nicht aussagekraeftig' }
  ];

  // ===========================================================================
  // Speicher
  // ===========================================================================

  var _data = { version: 1, hypothesen: {} };
  var _pushTimer = null;
  var _letzte = 0;

  // Siehe status.js: Date.now() hat Millisekundenaufloesung, und zwei
  // Eintraege nacheinander bekommen sonst denselben Stempel.
  function now() {
    var t = Date.now();
    _letzte = (t > _letzte) ? t : _letzte + 1;
    return _letzte;
  }

  function neueId() {
    return 'h' + now().toString(36) + Math.random().toString(36).slice(2, 7);
  }

  function laden() {
    try {
      var roh = localStorage.getItem(STORAGE_KEY);
      if (roh) {
        var p = JSON.parse(roh);
        if (p) _data = { version: 1, hypothesen: p.hypothesen || {}, savedAt: p.savedAt };
      }
    } catch (e) { console.warn('[Diagnose] Lesefehler:', e.message); }
    return _data;
  }

  function speichern() {
    _data.savedAt = now();
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(_data)); }
    catch (e) { console.error('[Diagnose] Speicherfehler:', e.message); }
  }

  function mischen(a, b) {
    var out = { version: 1, hypothesen: {} };
    var k;
    for (k in (a.hypothesen || {})) out.hypothesen[k] = a.hypothesen[k];
    for (k in (b.hypothesen || {})) {
      var c = out.hypothesen[k], n = b.hypothesen[k];
      if (!c || (n.m || 0) >= (c.m || 0)) out.hypothesen[k] = n;
    }
    out.savedAt = Math.max(a.savedAt || 0, b.savedAt || 0) || undefined;
    return out;
  }

  // ===========================================================================
  // Die Hierarchie durchsetzen
  // ===========================================================================

  /**
   * Welche Stufen sind noch nicht abgehakt?
   *
   * Das Kapitel gibt die Reihenfolge A bis E vor. Alignment ist Stufe D -
   * und im Prioritaetsmodell des Workflows Rang sieben von acht. Wer dort
   * anfaengt, stellt Geometrie an einem Fahrzeug ein, dessen Reifen
   * vielleicht nur zu kalt sind.
   */
  function offeneStufen(h) {
    var geprueft = (h && h.geprueft) || {};
    var out = [];
    for (var i = 0; i < HIERARCHIE.length; i++) {
      if (!geprueft[HIERARCHIE[i].key]) out.push(HIERARCHIE[i].key);
    }
    return out;
  }

  /**
   * Darf eine Aenderung eingetragen werden?
   *
   * Nein, solange eine Stufe der Hierarchie offen ist. Der Entscheidungsbaum
   * muss die Reihenfolge erzwingen, nicht nur beschreiben - sonst ist er ein
   * Nachschlagewerk und kein Werkzeug.
   *
   * @returns {{erlaubt: boolean, grund: string, offen: string[]}}
   */
  function darfAendern(id) {
    var h = _data.hypothesen[id];
    if (!h || h.del) return { erlaubt: false, grund: 'Hypothese nicht gefunden', offen: [] };

    var offen = offeneStufen(h);
    if (offen.length) {
      return {
        erlaubt: false,
        grund: 'Zuerst Stufe ' + offen.join(', ') + ' der Diagnosehierarchie pruefen',
        offen: offen
      };
    }
    if (h.stopp) {
      return {
        erlaubt: false,
        grund: 'Stop-Regel: erst reparieren, nicht weiter abstimmen',
        offen: []
      };
    }
    return { erlaubt: true, grund: '', offen: [] };
  }

  /** Fehlende Pflichtfelder des Change Impact Sheet. */
  function fehlendeFelder(id) {
    var h = _data.hypothesen[id];
    if (!h) return SHEET.map(function (f) { return f.key; });
    var felder = h.sheet || {};
    return SHEET.filter(function (f) {
      return !felder[f.key] || !String(felder[f.key]).trim();
    }).map(function (f) { return f.key; });
  }

  // ===========================================================================
  // Hypothesen
  // ===========================================================================

  function anlegen(code, flags) {
    var id = neueId();
    _data.hypothesen[id] = {
      code: String(code),
      flags: flags || [],
      geprueft: {},
      stopp: false,
      sheet: {},
      ergebnis: '',
      erstellt: now(),
      m: now()
    };
    speichern();
    abgleichPlanen();
    return id;
  }

  function stufePruefen(id, key, wert) {
    var h = _data.hypothesen[id];
    if (!h) return false;
    h.geprueft = h.geprueft || {};
    if (wert === false) delete h.geprueft[key];
    else h.geprueft[key] = true;
    h.m = now();
    speichern();
    abgleichPlanen();
    return true;
  }

  /**
   * Stop-Regel setzen.
   *
   * Nach Abschnitt 25: bei mechanischem Spiel, Reifenschaden, Druckverlust,
   * Bremsproblem, ungewoehnlichen Geraeuschen, losen U-Bolts oder nicht
   * reproduzierbaren Messdaten wird nicht weiter getuned.
   */
  function stoppSetzen(id, an) {
    var h = _data.hypothesen[id];
    if (!h) return false;
    h.stopp = !!an;
    h.m = now();
    speichern();
    abgleichPlanen();
    return true;
  }

  function sheetSetzen(id, key, wert) {
    var h = _data.hypothesen[id];
    if (!h) return false;
    h.sheet = h.sheet || {};
    h.sheet[key] = wert;
    h.m = now();
    speichern();
    abgleichPlanen();
    return true;
  }

  function ergebnisSetzen(id, wert) {
    var h = _data.hypothesen[id];
    if (!h) return false;
    h.ergebnis = String(wert || '');
    h.m = now();
    speichern();
    abgleichPlanen();
    return true;
  }

  /** Grabstein, keine Loeschung - sonst bringt das zweite Geraet sie zurueck. */
  function verwerfen(id) {
    if (!_data.hypothesen[id]) return false;
    _data.hypothesen[id] = { del: true, m: now() };
    speichern();
    abgleichPlanen();
    return true;
  }

  function alle(nurOffene) {
    var out = [];
    for (var id in _data.hypothesen) {
      var h = _data.hypothesen[id];
      if (h.del) continue;
      if (nurOffene && h.ergebnis) continue;
      out.push({
        id: id, code: h.code, flags: h.flags || [],
        geprueft: h.geprueft || {}, stopp: !!h.stopp,
        sheet: h.sheet || {}, ergebnis: h.ergebnis || '',
        erstellt: h.erstellt || h.m
      });
    }
    return out.sort(function (a, b) { return b.erstellt - a.erstellt; });
  }

  function eine(id) {
    var h = _data.hypothesen[id];
    if (!h || h.del) return null;
    return alle().filter(function (x) { return x.id === id; })[0] || null;
  }

  // ===========================================================================
  // Nachschlagen
  // ===========================================================================

  /** Matrixzeile zu einem Symptomcode - oder null. */
  function matrixFuer(code) {
    for (var i = 0; i < MATRIX.length; i++) {
      if (MATRIX[i].codes.indexOf(code) > -1) return MATRIX[i];
    }
    return null;
  }

  function symptom(code) {
    for (var i = 0; i < SYMPTOME.length; i++) if (SYMPTOME[i].code === code) return SYMPTOME[i];
    for (var j = 0; j < FLAGS.length; j++) if (FLAGS[j].code === code) return FLAGS[j];
    return null;
  }

  function stufe(key) {
    for (var i = 0; i < HIERARCHIE.length; i++) if (HIERARCHIE[i].key === key) return HIERARCHIE[i];
    return null;
  }

  // ===========================================================================
  // Abgleich
  // ===========================================================================

  function abgleichPlanen() {
    clearTimeout(_pushTimer);
    _pushTimer = setTimeout(abgleichen, 800);
  }

  async function abgleichen() {
    if (typeof isGistConfigured !== 'function' || !isGistConfigured()) return false;
    if (!navigator.onLine) return false;
    var token = getGistConfig().token;
    try {
      var res = await fetch('https://api.github.com/gists/' + global.FIXED_GIST_ID,
        { headers: { 'Authorization': 'Bearer ' + token } });
      if (res.ok) {
        var gist = await res.json();
        var datei = gist.files && gist.files[GIST_FILE];
        if (datei && datei.content) {
          try { _data = mischen(JSON.parse(datei.content), _data); } catch (e) {}
        }
      }
      var files = {};
      files[GIST_FILE] = { content: JSON.stringify(_data, null, 2) };
      await fetch('https://api.github.com/gists/' + global.FIXED_GIST_ID, {
        method: 'PATCH',
        headers: { 'Authorization': 'Bearer ' + token, 'Content-Type': 'application/json' },
        body: JSON.stringify({ files: files })
      });
      try { localStorage.setItem(STORAGE_KEY, JSON.stringify(_data)); } catch (e) {}
      return true;
    } catch (e) { return false; }
  }

  laden();

  global.Diagnose = {
    SYMPTOME: SYMPTOME,
    FLAGS: FLAGS,
    HIERARCHIE: HIERARCHIE,
    MATRIX: MATRIX,
    SHEET: SHEET,
    ERGEBNISSE: ERGEBNISSE,
    anlegen: anlegen,
    stufePruefen: stufePruefen,
    stoppSetzen: stoppSetzen,
    sheetSetzen: sheetSetzen,
    ergebnisSetzen: ergebnisSetzen,
    verwerfen: verwerfen,
    alle: alle,
    eine: eine,
    offeneStufen: offeneStufen,
    darfAendern: darfAendern,
    fehlendeFelder: fehlendeFelder,
    matrixFuer: matrixFuer,
    symptom: symptom,
    stufe: stufe,
    abgleichen: abgleichen,
    _mischen: mischen,
    _roh: function () { return _data; },
    _setzeRoh: function (d) { _data = d; _letzte = 0; },
    _laden: laden
  };
})(typeof window !== 'undefined' ? window : globalThis);
