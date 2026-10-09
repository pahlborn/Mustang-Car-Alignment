/**
 * status.js - Phasenstatus und Aenderungsjournal.
 *
 * Baut auf recheck.js auf. Dieses Modul haelt zwei Dinge:
 *
 *   1. den selbstgesetzten Status je Phase (offen / in Arbeit / erledigt)
 *   2. ein Journal der Eingriffe am Fahrzeug, mit Zeitstempel
 *
 * Der vierte Status `veraltet` wird NICHT gespeichert. Er ergibt sich aus
 * beidem: eine Phase ist veraltet, wenn sie als erledigt gilt und seither
 * eine Groesse geaendert wurde, die sie liefert. Gespeichert waere er ein
 * Wert an zwei Orten - und liefe gegen das Journal, sobald ein Eintrag
 * nachtraeglich zurueckgenommen wird.
 *
 * ZWEI WEGE, EINE AENDERUNG ZU MELDEN
 *
 * In der Werkstatt traegt man Messwerte in Felder ein; `ausFeld()` meldet die
 * zugehoerige Groesse automatisch. An der Strecke verstellt man Camber, ohne
 * vorher ein Formular auszufuellen - dafuer gibt es `eintragen()` und einen
 * Knopf. Ohne den zweiten Weg waere das Journal genau dort blind, wo die
 * meisten Eingriffe passieren.
 */
(function (global) {
  'use strict';

  var STORAGE_KEY = 'chassisStatus';
  var GIST_FILE = 'mustang-chassis-status.json';

  // Dieselben drei Stufen wie in den Schwesterprojekten, damit ein
  // Statusknopf ueberall dasselbe bedeutet. `veraltet` ist keine vierte
  // Stufe zum Durchklicken, sondern eine Eigenschaft, die dazukommt.
  var STUFEN = ['', 'wip', 'done'];
  var STUFEN_LABEL = {
    '': 'offen',
    'wip': 'in Arbeit',
    'done': 'erledigt'
  };

  var _data = { version: 1, phasen: {}, journal: {} };
  var _pushTimer = null;

  /**
   * Zeitstempel, der innerhalb einer Millisekunde nicht stehenbleibt.
   *
   * Date.now() hat Millisekundenaufloesung. Wer 19 Phasen abhakt und dann
   * eine Aenderung eintraegt, erzeugt dabei leicht denselben Wert - und der
   * Vergleich "liegt die Aenderung nach dem Abschluss" entschied dann gegen
   * die Aenderung. Die Phase blieb gueltig, obwohl sie es nicht war.
   *
   * Die Zaehlung in den letzten Stellen loest das, ohne die Vergleichbarkeit
   * mit echten Zeitstempeln zwischen Geraeten aufzugeben: der Zuschlag ist
   * kleiner als jede Uhrendifferenz, die in der Praxis vorkommt.
   */
  var _letzte = 0;
  function now() {
    var t = Date.now();
    _letzte = (t > _letzte) ? t : _letzte + 1;
    return _letzte;
  }

  function neueId() {
    return 'c' + now().toString(36) + Math.random().toString(36).slice(2, 7);
  }

  /** Aeltere Wahrheitswerte auf die Stufen abbilden. */
  function normalisieren(v) {
    if (v === true || v === 'true' || v === 'on' || v === 'done') return 'done';
    if (v === 'wip') return 'wip';
    return '';
  }

  function naechste(v) {
    var i = STUFEN.indexOf(normalisieren(v));
    return STUFEN[(i + 1) % STUFEN.length];
  }

  function label(v) { return STUFEN_LABEL[normalisieren(v)] || STUFEN_LABEL['']; }

  // ==== Speicher ====

  function laden() {
    try {
      var roh = localStorage.getItem(STORAGE_KEY);
      if (roh) {
        var p = JSON.parse(roh);
        if (p) {
          _data = {
            version: 1,
            phasen: p.phasen || {},
            journal: p.journal || {},
            savedAt: p.savedAt
          };
        }
      }
    } catch (e) { console.warn('[Status] Lesefehler:', e.message); }
    return _data;
  }

  function speichern() {
    _data.savedAt = now();
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(_data)); }
    catch (e) { console.error('[Status] Speicherfehler:', e.message); }
  }

  /**
   * Pro Schluessel gewinnt der juengere Eintrag - auch ein Grabstein.
   *
   * Ohne das bringt das zweite Geraet eine zurueckgenommene Aenderung
   * zurueck, und die Phase gilt wieder als veraltet, obwohl sie es nicht ist.
   */
  function mischen(a, b) {
    var out = { version: 1, phasen: {}, journal: {} };
    var k;
    for (k in (a.phasen || {})) out.phasen[k] = a.phasen[k];
    for (k in (b.phasen || {})) {
      var cp = out.phasen[k], np = b.phasen[k];
      if (!cp || (np.m || 0) >= (cp.m || 0)) out.phasen[k] = np;
    }
    for (k in (a.journal || {})) out.journal[k] = a.journal[k];
    for (k in (b.journal || {})) {
      var cj = out.journal[k], nj = b.journal[k];
      if (!cj || (nj.m || 0) >= (cj.m || 0)) out.journal[k] = nj;
    }
    out.savedAt = Math.max(a.savedAt || 0, b.savedAt || 0) || undefined;
    return out;
  }

  // ==== Phasenstatus ====

  function setzen(phaseId, stufe) {
    _data.phasen[phaseId] = { s: normalisieren(stufe), m: now() };
    speichern();
    abgleichPlanen();
  }

  function stufe(phaseId) {
    var e = _data.phasen[phaseId];
    return e ? normalisieren(e.s) : '';
  }

  /** Wann wurde die Phase zuletzt auf ihren jetzigen Stand gesetzt? */
  function gesetztAm(phaseId) {
    var e = _data.phasen[phaseId];
    return e ? (e.m || 0) : 0;
  }

  // ==== Journal ====

  /**
   * Eine Aenderung am Fahrzeug eintragen.
   *
   * @param {string} groesse  Kennung aus recheck.js, z.B. 'camber'
   * @param {string} [notiz]  freier Text, etwa "Platte 2, LF"
   * @returns {string} Journal-ID
   */
  function eintragen(groesse, notiz) {
    var id = neueId();
    _data.journal[id] = { g: String(groesse), n: notiz || '', m: now() };
    speichern();
    abgleichPlanen();
    return id;
  }

  /**
   * Eintrag zurueckziehen - als Grabstein, nicht geloescht.
   *
   * Eine Fehleingabe muss sich korrigieren lassen, ohne dass das zweite
   * Geraet sie zurueckbringt.
   */
  function zuruecknehmen(id) {
    if (!_data.journal[id]) return false;
    _data.journal[id] = { g: _data.journal[id].g, del: true, m: now() };
    speichern();
    abgleichPlanen();
    return true;
  }

  /** Alle gueltigen Eintraege, juengste zuerst. */
  function journal() {
    var out = [];
    for (var id in _data.journal) {
      var e = _data.journal[id];
      if (e.del) continue;
      out.push({ id: id, groesse: e.g, notiz: e.n, zeit: e.m });
    }
    return out.sort(function (a, b) { return b.zeit - a.zeit; });
  }

  /**
   * Meldung aus einem Eingabefeld.
   *
   * Ein Feld traegt `data-groesse="camber"`. Wird es geaendert, gilt die
   * Groesse als neu erfasst - das ist dasselbe Ereignis wie ein Eingriff,
   * nur ohne eigenen Knopf.
   *
   * Mehrfaches Tippen im selben Feld erzeugt nicht jedes Mal einen Eintrag:
   * liegt der letzte Eintrag derselben Groesse weniger als ZUSAMMENFASSEN
   * Millisekunden zurueck, wird er nur neu gestempelt. Sonst stuenden nach
   * einer Messreihe vierzig Zeilen im Journal.
   */
  var ZUSAMMENFASSEN = 60 * 1000;

  function ausFeld(groesse, notiz) {
    var grenze = now() - ZUSAMMENFASSEN;
    for (var id in _data.journal) {
      var e = _data.journal[id];
      if (e.del || e.g !== groesse) continue;
      if (e.m >= grenze) { e.m = now(); speichern(); abgleichPlanen(); return id; }
    }
    return eintragen(groesse, notiz);
  }

  // ==== Der vierte Status: veraltet ====

  /**
   * Ist diese Phase veraltet?
   *
   * Drei Bedingungen, alle noetig:
   *   - die Phase gilt als erledigt
   *   - seither wurde eine Groesse geaendert
   *   - diese Aenderung verlangt eine ihrer Groessen neu zu messen
   *
   * Eine Aenderung, die VOR dem Abschluss der Phase eingetragen wurde, zaehlt
   * nicht: wer Camber verstellt und danach das Alignment neu macht, hat die
   * Sache erledigt. Ohne den Zeitvergleich bliebe die Phase fuer immer rot.
   *
   * @returns {{veraltet: boolean, mitmessen: boolean, wegen: object[]}}
   */
  function pruefen(phaseId) {
    var leer = { veraltet: false, mitmessen: false, wegen: [] };
    if (typeof Recheck === 'undefined') return leer;

    var p = Recheck.phase(phaseId);
    if (!p || !p.liefert.length) return leer;      // Pruef- und Prozedurschritte
    if (stufe(phaseId) !== 'done') return leer;    // nur Erledigtes kann veralten

    var seit = gesetztAm(phaseId);
    var veraltet = false, mitmessen = false, wegen = [];

    var eintraege = journal();
    for (var i = 0; i < eintraege.length; i++) {
      var e = eintraege[i];
      if (e.zeit <= seit) continue;                // aelter als der Abschluss

      var folge = Recheck.phasenNach(e.groesse);
      var alt = folge.veraltet.filter(function (x) { return x.id === phaseId; });
      if (alt.length) {
        veraltet = true;
        wegen.push({ groesse: e.groesse, zeit: e.zeit, art: 'neu messen', felder: alt[0].wegen });
        continue;
      }
      var mit = folge.mitmessen.filter(function (x) { return x.id === phaseId; });
      if (mit.length) {
        mitmessen = true;
        wegen.push({ groesse: e.groesse, zeit: e.zeit, art: 'mitmessen', felder: mit[0].wegen });
      }
    }
    // Die staerkere Aussage gewinnt, wie in recheck.js.
    return { veraltet: veraltet, mitmessen: veraltet ? false : mitmessen, wegen: wegen };
  }

  /**
   * Fortschritt ueber die Werkstattphasen 0 bis 18.
   *
   * "in Arbeit" zaehlt halb - sonst steht der Balken tagelang still.
   * Veraltete Phasen zaehlen NICHT mit: sie sind der Grund, warum der Balken
   * zurueckfallen koennen muss.
   *
   * @returns {{erledigt, wip, veraltet, offen, gesamt, prozent}}
   */
  function fortschritt() {
    if (typeof Recheck === 'undefined') {
      return { erledigt: 0, wip: 0, veraltet: 0, offen: 0, gesamt: 0, prozent: 0 };
    }
    var erledigt = 0, wip = 0, veraltet = 0, offen = 0;

    for (var i = 0; i < Recheck.PHASEN.length; i++) {
      var p = Recheck.PHASEN[i];
      var s = stufe(p.id);
      if (s === 'done') {
        if (pruefen(p.id).veraltet) veraltet++;
        else erledigt++;
      } else if (s === 'wip') wip++;
      else offen++;
    }
    var gesamt = Recheck.PHASEN.length;
    return {
      erledigt: erledigt, wip: wip, veraltet: veraltet, offen: offen,
      gesamt: gesamt,
      prozent: gesamt ? Math.round((erledigt + wip * 0.5) / gesamt * 100) : 0
    };
  }

  /**
   * Ist das Fahrzeug rennstreckenbereit?
   *
   * Nur wenn jede Phase erledigt und keine veraltet ist. `grund` nennt, was
   * fehlt - eine Anzeige, die nur "nein" sagt, hilft in der Box nicht weiter.
   */
  function rennstreckenbereit() {
    var f = fortschritt();
    var bereit = f.gesamt > 0 && f.erledigt === f.gesamt;
    var grund = [];
    if (f.veraltet) grund.push(f.veraltet + ' Phase(n) veraltet');
    if (f.wip) grund.push(f.wip + ' in Arbeit');
    if (f.offen) grund.push(f.offen + ' offen');
    return { bereit: bereit, grund: grund };
  }

  /** Alle Phasen mit ihrem vollstaendigen Zustand - fuer die Anzeige. */
  function uebersicht() {
    if (typeof Recheck === 'undefined') return [];
    return Recheck.PHASEN.map(function (p) {
      var pr = pruefen(p.id);
      return {
        nr: p.nr, id: p.id, titel: p.titel, liefert: p.liefert,
        stufe: stufe(p.id),
        veraltet: pr.veraltet, mitmessen: pr.mitmessen, wegen: pr.wegen
      };
    });
  }

  // ==== Abgleich ====

  function abgleichPlanen() {
    clearTimeout(_pushTimer);
    _pushTimer = setTimeout(abgleichen, 800);
  }

  /** Erst den Cloud-Stand lesen und mischen, dann schreiben. */
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

  /** Cloud-Stand uebernehmen. Gibt true, wenn sich etwas geaendert hat. */
  async function holen(gist) {
    var datei = gist && gist.files && gist.files[GIST_FILE];
    if (!datei || !datei.content) return false;
    try {
      var vorher = JSON.stringify(_data);
      _data = mischen(JSON.parse(datei.content), _data);
      try { localStorage.setItem(STORAGE_KEY, JSON.stringify(_data)); } catch (e) {}
      return JSON.stringify(_data) !== vorher;
    } catch (e) { return false; }
  }

  laden();

  global.Status = {
    STUFEN: STUFEN,
    STUFEN_LABEL: STUFEN_LABEL,
    normalisieren: normalisieren,
    naechste: naechste,
    label: label,
    setzen: setzen,
    stufe: stufe,
    gesetztAm: gesetztAm,
    eintragen: eintragen,
    zuruecknehmen: zuruecknehmen,
    journal: journal,
    ausFeld: ausFeld,
    pruefen: pruefen,
    fortschritt: fortschritt,
    rennstreckenbereit: rennstreckenbereit,
    uebersicht: uebersicht,
    abgleichen: abgleichen,
    holen: holen,
    _mischen: mischen,
    _roh: function () { return _data; },
    _setzeRoh: function (d) { _data = d; _letzte = 0; },
    _laden: laden
  };
})(typeof window !== 'undefined' ? window : globalThis);
