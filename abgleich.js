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
 * SEIT v20 - was gt40-engine und jerico am 2026-10-24/25 gelernt haben
 *
 *   - Buendeln: Eingaben werden BUENDELN_MS gesammelt (3 s statt 0,8 s).
 *     Dort entstanden in 14 Minuten rund 70 Gist-Staende, GitHub bremste
 *     das Konto (403).
 *   - Merkzeichen "nicht hochgeladen" im Geraetespeicher, gesetzt bei jeder
 *     lokalen Aenderung, geloescht erst nach gelungenem Lauf ohne neue
 *     Aenderung dazwischen. Solange es steht, wird nach einem Fehler
 *     wiederholt (5 s, 15 s, 1 min, 2 min, dann alle 5 min; bei 403/429
 *     fruehestens nach 1 min) - dort blieben Werte nach einem 409 nur auf dem
 *     iPad. Die Anzeige sagt "Nicht hochgeladen".
 *   - Version: Jede geschriebene Datei traegt _neuesteVersion. Hat eine
 *     neuere App-Version geschrieben, schreibt dieser Tab nichts mehr - weder
 *     in die Cloud noch lokal - und laedt einmal neu. In gt40 schrieb ein
 *     vergessener Tab mit altem Code seinen Stand ueber die Werte vom Vorabend.
 *   - Nachpruefung: Ein Gist kennt kein bedingtes Schreiben. Schreiben zwei
 *     Geraete fast gleichzeitig, fehlt die Aenderung des einen. Darum laeuft
 *     nach jedem Schreiben NACHPRUEFEN_MS spaeter ein weiterer Lauf, der
 *     nachschreibt, was fehlt (hoechstens NACHPRUEFEN_MAX in Folge).
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
 * Konzept: Projects/Geraeteabgleich/ im Vault.
 */
(function (global) {
  'use strict';

  var API = 'https://api.github.com/gists/';
  var SICHT_PAUSE = 30000;     // hoechstens alle 30 s beim Zurueckholen

  // Einstellbar ueber Abgleich.<NAME> (Tests setzen kurze Zeiten).
  var STANDARD = {
    BUENDELN_MS: 3000,
    WIEDERHOLEN_MS: [5000, 15000, 60000, 120000, 300000],
    GEBREMST_MS: 60000,
    NACHPRUEFEN_MS: 2000,
    NACHPRUEFEN_MAX: 3
  };
  var MERK_KEY = 'chassisAbgleich_ungesendet';
  var VERSION_KEY = '_neuesteVersion';

  var _kanaele = [];
  var _lauf = null;
  var _nochmal = false;
  var _timer = null;
  var _wiederTimer = null;
  var _pruefTimer = null;
  var _versuch = 0;
  var _nachpruefungen = 0;
  var _letzteSicht = 0;
  var _neuLadenGeplant = false;
  var _zustand = { stand: 'bereit', letzterErfolg: 0, fehler: '' };

  function einstellung(name) {
    var a = global.Abgleich;
    return a && a[name] !== undefined ? a[name] : STANDARD[name];
  }

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

  // ---- Merkzeichen "nicht hochgeladen" ----
  function merkzeichen() {
    try { return localStorage.getItem(MERK_KEY); } catch (e) { return null; }
  }
  function ungesendet() { return !!merkzeichen(); }
  function markieren() {
    try { localStorage.setItem(MERK_KEY, Date.now() + ':' + Math.random().toString(36).slice(2, 8)); } catch (e) {}
    melden('abgleich-zustand', zustand());
  }

  function setzeZustand(stand, fehler) {
    _zustand.stand = stand;
    _zustand.fehler = fehler || '';
    if (stand === 'ok') _zustand.letzterErfolg = Date.now();
    melden('abgleich-zustand', zustand());
  }

  function zustand() {
    return { stand: _zustand.stand, letzterErfolg: _zustand.letzterErfolg, fehler: _zustand.fehler,
             ungesendet: ungesendet() };
  }

  /** 'v20' -> 20; unlesbar -> 0. */
  function versionsNummer(v) {
    var m = /^v?(\d+)/.exec(String(v || ''));
    return m ? parseInt(m[1], 10) : 0;
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

  /**
   * Eine neuere Version hat geschrieben: einmal Bescheid geben und neu laden,
   * sobald niemand in ein Feld tippt - hoechstens einmal je Version und
   * Sitzung. Ist die ausgelieferte Seite selbst noch aelter als die Cloud
   * (Version zurueckgenommen, Cache), kaeme sonst nach jedem Neuladen das
   * naechste. Eingetragenes liegt im Geraetespeicher und geht danach hoch.
   */
  function veraltetBehandeln(neueste) {
    if (_neuLadenGeplant) return;
    _neuLadenGeplant = true;
    var schonNeu = false;
    try { schonNeu = global.sessionStorage.getItem('abgleich_neugeladen') === String(neueste); } catch (e) {}
    if (schonNeu) {
      if (typeof global.showToast === 'function') {
        global.showToast('Version ' + neueste + ' ist hier noch nicht angekommen - Eingetragenes bleibt auf diesem Geraet und wird nicht hochgeladen. Spaeter neu laden.', { sticky: true });
      }
      return;
    }
    try { global.sessionStorage.setItem('abgleich_neugeladen', String(neueste)); } catch (e) {}
    if (typeof global.showToast === 'function') {
      global.showToast('Neue Version ' + neueste + ' im Einsatz - die Seite wird neu geladen. Eingetragenes bleibt erhalten.', { sticky: true });
    }
    var neuLaden = (global.Abgleich && global.Abgleich.neuLaden) || function () { global.location.reload(); };
    (function warten() {
      var a = typeof document !== 'undefined' ? document.activeElement : null;
      if (a && /^(INPUT|TEXTAREA|SELECT)$/.test(a.tagName)) { setTimeout(warten, 2000); return; }
      setTimeout(neuLaden, 1500);
    })();
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
    var eigene = versionsNummer(global.APP_VERSION);

    try {
      for (var v = 0; v < _kanaele.length; v++) {
        if (_kanaele[v].vorher) _kanaele[v].vorher();
      }
      // Was jetzt im Merkzeichen steht, deckt dieser Lauf ab. Kommt waehrend
      // des Laufs Neues dazu, aendert es sich - dann bleibt es stehen.
      var merkVorher = merkzeichen();

      var res = await fetch(API + id, {
        headers: { 'Authorization': 'Bearer ' + token },
        cache: 'no-store'
      });
      if (!res.ok) throw fehler('Gist nicht lesbar', res.status, await antworttext(res));
      var gist = await res.json();

      // Erst alles lesen und pruefen, dann mischen - ein veralteter Tab
      // darf auch lokal nichts uebernehmen.
      var cloudStaende = [];
      var neueste = 0;
      for (var c = 0; c < _kanaele.length; c++) {
        var roh = await inhalt(gist.files && gist.files[_kanaele[c].datei]);
        var cloud = null;
        if (roh) {
          try { cloud = JSON.parse(roh); }
          catch (e) { throw fehler('Datei im Gist unlesbar: ' + _kanaele[c].datei, null, String(roh).slice(0, 300)); }
        }
        if (cloud) neueste = Math.max(neueste, versionsNummer(cloud[VERSION_KEY]));
        cloudStaende.push(cloud);
      }
      if (eigene && neueste > eigene) {
        setzeZustand('veraltet', 'Neuere Version v' + neueste + ' im Einsatz');
        veraltetBehandeln('v' + neueste);
        return { ok: false, grund: 'veraltet', neueste: 'v' + neueste };
      }

      var schreiben = {};
      var geaendert = [];
      for (var i = 0; i < _kanaele.length; i++) {
        var k = _kanaele[i];
        var cl = cloudStaende[i];
        var lokal = k.lokal() || {};
        var gemischt = cl ? k.mischen(cl, lokal) : lokal;

        if (kern(gemischt) !== kern(lokal)) {
          k.uebernehmen(gemischt);
          geaendert.push(k.datei);
        }
        // Geschrieben wird nur, was die Cloud noch nicht hat - und keine
        // leere Datei fuer einen Kanal, in dem nie etwas eingetragen wurde.
        var neuFuerCloud = cl ? kern(gemischt) !== kern(cl) : !leer(gemischt);
        if (neuFuerCloud) {
          var aus = Object.assign({}, gemischt);
          if (eigene) aus[VERSION_KEY] = 'v' + Math.max(eigene, neueste);
          schreiben[k.datei] = { content: JSON.stringify(aus, null, 2) };
        }
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

      _versuch = 0;
      try { if (merkzeichen() === merkVorher) localStorage.removeItem(MERK_KEY); } catch (e) {}
      nachpruefenPlanen(dateien.length > 0);
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
      wiederholenPlanen(err.detail && err.detail.status);
      return { ok: false, grund: 'fehler', fehler: err.message };
    }
  }

  /** Nach einem Fehler: nur wiederholen, was liegen geblieben ist. */
  function wiederholenPlanen(status) {
    clearTimeout(_wiederTimer);
    if (!ungesendet()) return;
    _versuch++;
    var stufen = einstellung('WIEDERHOLEN_MS');
    var warten = stufen[Math.min(_versuch - 1, stufen.length - 1)];
    if (status === 403 || status === 429) warten = Math.max(warten, einstellung('GEBREMST_MS'));
    _wiederTimer = setTimeout(function () { _wiederTimer = null; jetzt(); }, warten);
  }

  /**
   * Nach einem Schreibvorgang einmal nachpruefen. Steht schon ein
   * gebuendelter Lauf an (es wird getippt), prueft dieser ohnehin nach.
   */
  function nachpruefenPlanen(geschrieben) {
    if (!geschrieben) { _nachpruefungen = 0; return; }
    if (_nachpruefungen >= einstellung('NACHPRUEFEN_MAX')) return;
    _nachpruefungen++;
    clearTimeout(_pruefTimer);
    _pruefTimer = setTimeout(function () { _pruefTimer = null; if (!_timer) jetzt(); },
      einstellung('NACHPRUEFEN_MS'));
  }

  /**
   * Einen Lauf starten. Laeuft schon einer, folgt genau ein weiterer - und
   * der Aufrufer bekommt dessen Ergebnis. Zwei Laeufe nebeneinander koennten
   * sich gegenseitig ueberschreiben.
   */
  function jetzt() {
    clearTimeout(_timer); _timer = null;
    clearTimeout(_wiederTimer); _wiederTimer = null;
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

  /** Nach einer lokalen Aenderung: vormerken, sammeln, dann abgleichen. */
  function planen() {
    markieren();
    clearTimeout(_timer);
    _timer = setTimeout(function () { _timer = null; jetzt(); }, einstellung('BUENDELN_MS'));
  }

  /** Sofort hochladen (Speichern-Knopf): vormerken und gleich abgleichen. */
  function hochladen() {
    markieren();
    return jetzt();
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
    hochladen: hochladen,
    zustand: zustand,
    ungesendet: ungesendet,
    VERSION_KEY: VERSION_KEY,
    _kern: kern,
    _kanaele: function () { return _kanaele.slice(); },
    _zuruecksetzen: function () {
      _kanaele = []; _lauf = null; _nochmal = false;
      clearTimeout(_timer); clearTimeout(_wiederTimer); clearTimeout(_pruefTimer);
      _timer = null; _wiederTimer = null; _pruefTimer = null;
      _versuch = 0; _nachpruefungen = 0; _neuLadenGeplant = false;
      _letzteSicht = 0; _zustand = { stand: 'bereit', letzterErfolg: 0, fehler: '' };
      try { localStorage.removeItem(MERK_KEY); } catch (e) {}
      var a = global.Abgleich;
      Object.keys(STANDARD).forEach(function (n) { delete a[n]; });
      delete a.neuLaden;
    }
  };
})(typeof window !== 'undefined' ? window : globalThis);
