/**
 * abgleich.js - der Geraeteabgleich ueber den Gist, fuer alle Kanaele.
 *
 * Ein Lauf: lokale Eingaben sichern - den Gist EINMAL lesen - je Kanal
 * mischen und lokal speichern - nur geaenderte Dateien zurueckschreiben -
 * melden ("daten-abgeglichen").
 *
 * WARUM EIN EIGENES MODUL
 *
 * Bis v17 gab es drei Abgleiche: app.js fuer die Messwerte, status.js und
 * diagnose.js fuer Phasenstatus und Hypothesen. Die beiden letzten waren
 * wortgleich, der erste anders - und falsch: er schrieb den lokalen Stand in
 * den Gist, ohne ihn vorher zu lesen. Ein Geraet mit altem Stand ueberschrieb
 * damit, was ein anderes inzwischen eingetragen hatte. Dazu kam:
 *
 *   - "Jetzt abgleichen" holte nur die Messwerte, Status und Diagnose nie
 *   - beim Oeffnen der Seite wurde gar nicht gelesen
 *   - nach dem Abgleich rechnete keine abgeleitete Anzeige neu
 *   - status.js und diagnose.js schluckten jeden Fehler
 *
 * Die Mischregeln selbst waren richtig und bleiben, wo sie sind: pro Feld
 * bzw. Eintrag gewinnt der juengere Zeitstempel, Grabsteine eingeschlossen.
 * Hier steht nur der Ablauf drumherum (Arbeitsregel 4a).
 *
 * KANAELE
 *
 * Jeder Kanal meldet sich mit anmelden() an - das Modul kennt sie nicht:
 *
 *   datei           Dateiname im Gist
 *   lokal()         aktueller lokaler Stand
 *   mischen(c, l)   Cloud und lokal zusammenfuehren
 *   uebernehmen(d)  gemischten Stand lokal speichern
 *   vorher()        optional: ungesicherte Eingaben vor dem Lesen sichern
 *
 * Konzept: Projects/Geraeteabgleich/Konzept Geraeteabgleich alignment.md im
 * Vault.
 */
(function (global) {
  'use strict';

  var API = 'https://api.github.com/gists/';
  var VERZOEGERUNG = 800;      // Eingaben sammeln, bevor geschrieben wird
  var SICHT_PAUSE = 30000;     // hoechstens alle 30 s beim Zurueckholen

  var _kanaele = [];
  var _lauf = null;
  var _nochmal = false;
  var _timer = null;
  var _letzteSicht = 0;
  var _zustand = { stand: 'bereit', letzterErfolg: 0, fehler: '' };

  function anmelden(kanal) {
    for (var i = 0; i < _kanaele.length; i++) {
      if (_kanaele[i].datei === kanal.datei) { _kanaele[i] = kanal; return; }
    }
    _kanaele.push(kanal);
  }

  function konfiguriert() {
    return typeof global.isGistConfigured === 'function' && global.isGistConfigured();
  }

  function melden(name, detail) {
    if (typeof document === 'undefined' || typeof CustomEvent === 'undefined') return;
    document.dispatchEvent(new CustomEvent(name, { detail: detail }));
  }

  function setzeZustand(stand, fehler) {
    _zustand.stand = stand;
    _zustand.fehler = fehler || '';
    if (stand === 'ok') _zustand.letzterErfolg = Date.now();
    melden('abgleich-zustand', zustand());
  }

  function zustand() {
    return { stand: _zustand.stand, letzterErfolg: _zustand.letzterErfolg, fehler: _zustand.fehler };
  }

  /**
   * Der vergleichbare Kern eines Stands: ohne Verwaltungsangaben.
   *
   * _fieldTimes, _devices, _savedAt, savedAt aendern sich bei jedem Mischen
   * (das Geraeteregister stempelt die Uhrzeit). Wuerde man sie mitvergleichen,
   * gaelte jeder Lauf als Aenderung - jeder Lauf schriebe, und jede Seite
   * zeichnete bei jedem Fokuswechsel neu.
   */
  function kern(obj) {
    var out = {};
    var k = Object.keys(obj || {}).sort();
    for (var i = 0; i < k.length; i++) {
      if (k[i].charAt(0) === '_' || k[i] === 'savedAt') continue;
      out[k[i]] = obj[k[i]];
    }
    return JSON.stringify(out);
  }

  function leer(obj) { return kern(obj) === '{}'; }

  /** Ein Fehler mit allem, was man spaeter zum Nachvollziehen braucht. */
  function fehler(was, status, antwort) {
    var e = new Error(was + (status ? ' (Status ' + status + ')' : ''));
    e.detail = { quelle: 'abgleich.js', status: status || null, antwort: antwort || '' };
    return e;
  }

  async function antworttext(res) {
    try { return await res.text(); } catch (e) { return ''; }
  }

  /**
   * Inhalt einer Gist-Datei. Ab 1 MB liefert die API ihn gekuerzt
   * ("truncated") - dann wird die volle Fassung nachgeladen, statt einen
   * gekuerzten Stand zu mischen.
   */
  async function inhalt(datei) {
    if (!datei) return null;
    if (!datei.truncated) return datei.content || null;
    if (!datei.raw_url) throw fehler('Datei gekuerzt und ohne raw_url: ' + datei.filename);
    var res = await fetch(datei.raw_url, { cache: 'no-store' });
    if (!res.ok) throw fehler('Gekuerzte Datei nicht nachladbar: ' + datei.filename, res.status, await antworttext(res));
    return await res.text();
  }

  async function laufen() {
    if (!konfiguriert()) { setzeZustand('lokal'); return { ok: false, grund: 'lokal' }; }
    if (typeof navigator !== 'undefined' && navigator.onLine === false) {
      setzeZustand('offline');
      return { ok: false, grund: 'offline' };
    }

    setzeZustand('laeuft');
    var token = global.getGistConfig().token;
    var id = global.FIXED_GIST_ID;

    try {
      for (var v = 0; v < _kanaele.length; v++) {
        if (_kanaele[v].vorher) _kanaele[v].vorher();
      }

      var res = await fetch(API + id, {
        headers: { 'Authorization': 'Bearer ' + token },
        cache: 'no-store'
      });
      if (!res.ok) throw fehler('Gist nicht lesbar', res.status, await antworttext(res));
      var gist = await res.json();

      var schreiben = {};
      var geaendert = [];
      for (var i = 0; i < _kanaele.length; i++) {
        var k = _kanaele[i];
        var roh = await inhalt(gist.files && gist.files[k.datei]);
        var cloud = null;
        if (roh) {
          try { cloud = JSON.parse(roh); }
          catch (e) { throw fehler('Datei im Gist unlesbar: ' + k.datei, null, String(roh).slice(0, 300)); }
        }
        var lokal = k.lokal() || {};
        var gemischt = cloud ? k.mischen(cloud, lokal) : lokal;

        if (kern(gemischt) !== kern(lokal)) {
          k.uebernehmen(gemischt);
          geaendert.push(k.datei);
        }
        // Geschrieben wird nur, was die Cloud noch nicht hat - und keine
        // leere Datei fuer einen Kanal, in dem nie etwas eingetragen wurde.
        var neuFuerCloud = cloud ? kern(gemischt) !== kern(cloud) : !leer(gemischt);
        if (neuFuerCloud) schreiben[k.datei] = { content: JSON.stringify(gemischt, null, 2) };
      }

      var dateien = Object.keys(schreiben);
      if (dateien.length) {
        var wr = await fetch(API + id, {
          method: 'PATCH',
          headers: { 'Authorization': 'Bearer ' + token, 'Content-Type': 'application/json' },
          body: JSON.stringify({ files: schreiben })
        });
        if (!wr.ok) throw fehler('Gist nicht schreibbar', wr.status, await antworttext(wr));
      }

      setzeZustand('ok');
      if (geaendert.length) melden('daten-abgeglichen', { kanaele: geaendert });
      return { ok: true, geaendert: geaendert, geschrieben: dateien };
    } catch (err) {
      setzeZustand('fehler', err.message);
      // Kein stilles Scheitern mehr: jeder Fehler steht im Protokoll, mit
      // Status und Antworttext. Ein Toast kommt nur beim Knopf (app.js) -
      // sonst meldete jedes Funkloch in der Box einen Fehler.
      if (typeof global.ErrorLog !== 'undefined') {
        global.ErrorLog.add('Abgleich: ' + err.message,
          err.detail || { quelle: 'abgleich.js', stack: err.stack });
      }
      return { ok: false, grund: 'fehler', fehler: err.message };
    }
  }

  /**
   * Einen Lauf starten. Laeuft schon einer, folgt genau ein weiterer - und
   * der Aufrufer bekommt dessen Ergebnis. Zwei Laeufe nebeneinander koennten
   * sich gegenseitig ueberschreiben.
   */
  function jetzt() {
    clearTimeout(_timer);
    _letzteSicht = Date.now();
    if (_lauf) { _nochmal = true; return _lauf; }
    var p = laufen().then(function (r) {
      _lauf = null;
      if (_nochmal) { _nochmal = false; return jetzt(); }
      return r;
    });
    _lauf = p;
    return p;
  }

  /** Nach einer lokalen Aenderung: kurz sammeln, dann abgleichen. */
  function planen() {
    clearTimeout(_timer);
    _timer = setTimeout(jetzt, VERZOEGERUNG);
  }

  // ==== Ausloeser, die zum Abgleich gehoeren und nicht zu einer Seite ====

  function beiSicht() {
    if (typeof document !== 'undefined' && document.hidden) return;
    if (Date.now() - _letzteSicht < SICHT_PAUSE) return;
    _letzteSicht = Date.now();
    jetzt();
  }

  if (typeof document !== 'undefined' && document.addEventListener) {
    document.addEventListener('visibilitychange', beiSicht);
  }
  if (typeof window !== 'undefined' && window.addEventListener) {
    window.addEventListener('focus', beiSicht);
    // Funkloch vorbei: alles nachschieben, nicht nur die Messwerte.
    window.addEventListener('online', function () { jetzt(); });
  }

  global.Abgleich = {
    anmelden: anmelden,
    jetzt: jetzt,
    planen: planen,
    zustand: zustand,
    _kern: kern,
    _kanaele: function () { return _kanaele.slice(); },
    _zuruecksetzen: function () {
      _kanaele = []; _lauf = null; _nochmal = false; clearTimeout(_timer);
      _letzteSicht = 0; _zustand = { stand: 'bereit', letzterErfolg: 0, fehler: '' };
    }
  };
})(typeof window !== 'undefined' ? window : globalThis);
