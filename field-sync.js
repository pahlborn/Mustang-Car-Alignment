/**
 * field-sync.js - Lesen, Eintragen, Speichern und Zusammenfuehren der
 * Messwert-Felder.
 *
 * Wird von jeder Seite im <head> geladen, vor app.js und vor den
 * Seitenmodulen. Alles, was Felder ausliest oder gespeicherte Werte in
 * Felder eintraegt, laeuft hierueber - nicht ueber eine eigene Schleife in
 * der Seite (Arbeitsregel 4a).
 *
 * Hintergrund
 * -----------
 * Frueher galt an beiden Stellen die Regel "leer gewinnt nie":
 *
 *     if (current[key] === '' ...) { if (existing[key]) continue; }   // Speichern
 *     if (wVal !== '' ) merged[k] = wVal; else merged[k] = lVal;      // Merge
 *
 * Damit war das Leeren eines Feldes schlicht nicht ausdrueckbar. Wer einen
 * Messwert loeschen wollte, bekam ihn beim naechsten Laden zurueck - lokal
 * schon beim Speichern, spaetestens aber aus der Cloud.
 *
 * Stattdessen bekommt jedes Feld einen eigenen Zeitstempel (_fieldTimes).
 * Beim Merge gewinnt der juengere Eintrag - ein geloeschter Wert ist damit
 * eine ganz normale Aenderung. Seit v19 zaehlt ein Leer allerdings nur, wenn
 * der Nutzer das Feld selbst geleert hat (_geleert, Regel 9c).
 *
 * Altbestand ohne _fieldTimes: fuer Felder, zu denen keine Seite einen
 * Zeitstempel hat, gilt weiter die alte Heuristik (nicht-leer gewinnt).
 * Sonst wuerden beim ersten Sync nach dem Update Werte verschwinden.
 */
(function (global) {
  'use strict';

  var TIMES_KEY = '_fieldTimes';
  var DEVICES_KEY = '_devices';
  var DEVICE_KEY = '_lastDevice';
  var LOCAL_DEVICE_KEY = 'device_id';
  var LOCAL_DEVICE_NAME_KEY = 'device_name';

  // Die Kennung des Felddatensatzes steht hier und nirgends sonst. Sie stand
  // in app.js, bind-ui.js, bumpsteer-ui.js und messblatt.js je einmal - vier
  // Kopien derselben Zeichenkette (Arbeitsregel 4).
  var STORAGE_KEY = 'chassisSetup';

  /** Geraete-ID: einmal generiert, bleibt im localStorage. */
  function getDeviceId() {
    var id = localStorage.getItem(LOCAL_DEVICE_KEY);
    if (!id) {
      id = 'dev-' + Date.now().toString(36) + '-' + Math.random().toString(36).substr(2, 6);
      localStorage.setItem(LOCAL_DEVICE_KEY, id);
    }
    return id;
  }

  /** Geraetename: vom User benennbar, sonst aus User-Agent erraten. */
  function getDeviceName() {
    var name = localStorage.getItem(LOCAL_DEVICE_NAME_KEY);
    if (name) return name;
    var ua = navigator.userAgent || '';
    if (/iPad/.test(ua)) return 'iPad';
    if (/iPhone/.test(ua)) return 'iPhone';
    if (/Android/.test(ua)) return 'Android';
    if (/Mac/.test(ua)) return 'Mac';
    if (/Win/.test(ua)) return 'Windows PC';
    if (/Linux/.test(ua)) return 'Linux';
    return 'Unbekannt';
  }

  function setDeviceName(name) {
    localStorage.setItem(LOCAL_DEVICE_NAME_KEY, (name || '').trim());
  }

  /** Geraeteregister im Datensatz aktualisieren. */
  function stampDevice(data) {
    var devices = data[DEVICES_KEY] || {};
    var id = getDeviceId();
    devices[id] = { name: getDeviceName(), lastSeen: new Date().toISOString() };
    data[DEVICES_KEY] = devices;
    data[DEVICE_KEY] = id;
    return data;
  }

  function isBlank(v) { return v === undefined || v === '' || v === null; }

  // ---- Beruehrte Felder (v19, wie gt40-engine v109 / jerico v41) ----
  //
  // Welche Felder hat der Nutzer seit dem letzten lokalen Speichern selbst
  // veraendert - durch Tippen, Auswaehlen oder Antippen? Zwei Dinge haengen
  // daran:
  //  - Leeren zaehlt nur bei einem beruehrten Feld als Aussage (_geleert).
  //    Ein Feld, das nur leer ANGEZEIGT wird - etwa weil es erst nach dem
  //    Eintragen erzeugt wurde (messblatt.js) -, loescht nichts.
  //  - Ein Abgleich ueberschreibt ein beruehrtes, noch nicht gespeichertes
  //    Feld nicht (anwenden).
  var GELEERT_KEY = '_geleert';
  var _beruehrt = {};
  function beruehrtMerken(e) {
    var el = e.target && e.target.closest ? e.target.closest('[data-field]') : null;
    if (!el) return;
    if (e.type === 'click' && el.tagName !== 'BUTTON') return;
    _beruehrt[el.dataset.field] = true;
  }
  if (global.document && global.document.addEventListener) {
    ['input', 'change', 'click'].forEach(function (t) { global.document.addEventListener(t, beruehrtMerken, true); });
  }
  /** Beruehrte Felder abholen und vergessen - beim lokalen Speichern. */
  function beruehrteAbholen() { var b = _beruehrt; _beruehrt = {}; return b; }
  function istBeruehrt(feld) { return !!_beruehrt[feld]; }
  function hatBeruehrte() { for (var k in _beruehrt) { if (_beruehrt[k]) return true; } return false; }

  /**
   * Aktuelle Feldwerte in den bestehenden Datensatz uebernehmen.
   *
   * @param {object} existing  bisheriger Datensatz (aus localStorage)
   * @param {object} current   Werte der Felder, die DIESE Seite anzeigt
   * @param {object} opts      opts.recordClears = false -> Leeren nicht als
   *                           Aenderung werten (waehrend die Seite noch laedt)
   * @returns {object} neuer Datensatz inklusive _fieldTimes und _savedAt
   */
  function mergeIntoExisting(existing, current, opts) {
    existing = existing || {};
    opts = opts || {};
    var recordClears = opts.recordClears !== false;
    var now = opts.now || Date.now();

    var data = Object.assign({}, existing);
    var times = Object.assign({}, existing[TIMES_KEY] || {});
    var geleert = Object.assign({}, existing[GELEERT_KEY] || {});
    var beruehrt = opts.beruehrt || null;

    for (var key in current) {
      if (!Object.prototype.hasOwnProperty.call(current, key)) continue;
      if (key.charAt(0) === '_') continue;

      var next = current[key];
      var prev = existing[key];
      var clearing = isBlank(next) || next === false;
      var warLeer = isBlank(prev) || prev === false;

      // Solange die Seite noch laedt, stehen alle Felder auf leer. Ein Save in
      // diesem Moment darf nichts loeschen.
      if (clearing && !recordClears && !warLeer) continue;

      // Leer bleibt leer - das ist keine Aenderung und bekommt keinen
      // Zeitstempel. Bis v17 bekam es einen: ein frisches Geraet, auf dem
      // nur eine Seite geoeffnet wurde, stempelte jedes leere Feld mit
      // "jetzt", und beim Mischen gewann dieses Leer gegen den aelteren Wert
      // eines anderen Geraets. Der Wert war weg. Ein bewusst geleertes Feld
      // hatte vorher einen Wert und wird weiterhin gestempelt (Regel 9).
      if (clearing && warLeer) continue;

      // Seit v19: Kommt die Seite mit der Liste der beruehrten Felder, zaehlt
      // ein Leeren nur dort - sonst bleibt der gespeicherte Wert (Regel 9c).
      var bewusst = !!(beruehrt && beruehrt[key]);
      if (clearing && beruehrt && !bewusst) continue;

      if (next !== prev) {
        times[key] = now;
        if (clearing && bewusst) geleert[key] = now;
        else if (!clearing) delete geleert[key];
      }
      data[key] = next;
    }

    data[TIMES_KEY] = times;
    data[GELEERT_KEY] = geleert;
    data._savedAt = new Date(now).toISOString();
    stampDevice(data);
    return data;
  }

  /**
   * Cloud- und lokalen Datensatz zusammenfuehren. Pro Feld gewinnt der
   * juengere Zeitstempel - mit zwei Ausnahmen (v19, wie in den
   * Schwesterprojekten):
   *
   *  - Steht nur auf einer Seite ein Wert, gewinnt das Leer der anderen Seite
   *    nur, wenn es als bewusstes Leeren vermerkt ist (_geleert) und juenger
   *    ist als der Wert (Regel 9c).
   *  - Hat nur eine Seite einen Stempel, gewinnt sie. Ein Feld ohne Stempel
   *    ist Altbestand und sagt nichts darueber, wann es geaendert wurde.
   */
  function mergeRecords(cloudData, localData) {
    cloudData = cloudData || {};
    localData = localData || {};

    var cloudTimes = cloudData[TIMES_KEY] || {};
    var localTimes = localData[TIMES_KEY] || {};
    var cloudGeleert = cloudData[GELEERT_KEY] || {};
    var localGeleert = localData[GELEERT_KEY] || {};
    var cloudFallback = new Date(cloudData._savedAt || 0).getTime();
    var localFallback = new Date(localData._savedAt || 0).getTime();

    var merged = {};
    var mergedTimes = {};
    var keys = Object.keys(localData).concat(Object.keys(cloudData));
    var seen = {};

    for (var i = 0; i < keys.length; i++) {
      var k = keys[i];
      if (seen[k]) continue;
      seen[k] = 1;
      if (k.charAt(0) === '_') continue;

      var hasC = cloudTimes[k] !== undefined;
      var hasL = localTimes[k] !== undefined;
      var cVal = cloudData[k], lVal = localData[k];

      if (!hasC && !hasL) {
        // Altbestand: keine Seite kennt einen Zeitstempel fuer dieses Feld.
        // Alte Heuristik beibehalten, damit nichts verloren geht.
        if (!isBlank(cVal) && !isBlank(lVal)) {
          merged[k] = cloudFallback >= localFallback ? cVal : lVal;
        } else if (!isBlank(cVal)) { merged[k] = cVal; }
        else if (!isBlank(lVal)) { merged[k] = lVal; }
        else { merged[k] = cVal !== undefined ? cVal : lVal; }
        continue;
      }

      var ct = hasC ? cloudTimes[k] : -1;
      var lt = hasL ? localTimes[k] : -1;
      var cLeer = isBlank(cVal), lLeer = isBlank(lVal);
      var nimmCloud;
      if (cLeer !== lLeer) {
        var leerStempel = cLeer ? cloudGeleert[k] : localGeleert[k];
        var leerZaehlt = leerStempel !== undefined && leerStempel > (cLeer ? lt : ct);
        nimmCloud = cLeer ? leerZaehlt : !leerZaehlt;
      } else {
        nimmCloud = ct >= lt;
      }
      if (nimmCloud) { merged[k] = cVal; if (ct >= 0) mergedTimes[k] = ct; }
      else { merged[k] = lVal; if (lt >= 0) mergedTimes[k] = lt; }
      if (merged[k] === undefined) delete merged[k];
    }

    merged[TIMES_KEY] = mergedTimes;
    // Ein bewusstes Leeren bleibt vermerkt, solange das Feld leer ist.
    var mergedGeleert = {};
    for (var gk in merged) {
      if (gk.charAt(0) === '_' || !isBlank(merged[gk])) continue;
      var gz = Math.max(cloudGeleert[gk] || 0, localGeleert[gk] || 0);
      if (gz) mergedGeleert[gk] = gz;
    }
    merged[GELEERT_KEY] = mergedGeleert;
    merged._savedAt = new Date(Math.max(cloudFallback, localFallback) || Date.now()).toISOString();
    // Geraeteregister aus beiden Quellen zusammenfuehren
    var cDevices = cloudData[DEVICES_KEY] || {};
    var lDevices = localData[DEVICES_KEY] || {};
    var allDevices = {};
    var dk;
    for (dk in cDevices) { if (Object.prototype.hasOwnProperty.call(cDevices, dk)) allDevices[dk] = cDevices[dk]; }
    for (dk in lDevices) {
      if (!Object.prototype.hasOwnProperty.call(lDevices, dk)) continue;
      if (!allDevices[dk] || (lDevices[dk].lastSeen > (allDevices[dk].lastSeen || ''))) allDevices[dk] = lDevices[dk];
    }
    merged[DEVICES_KEY] = allDevices;
    stampDevice(merged);
    return merged;
  }

  /**
   * Den gespeicherten Felddatensatz lesen.
   *
   * Gebraucht wird das von jeder Seite, die Werte anzeigt, ohne ihre Felder
   * selbst zu besitzen - und vom Bind-Befund, der auf denselben Werten
   * rechnet wie bind.html. Unlesbares ergibt einen leeren Datensatz, keine
   * Ausnahme: eine kaputte Zeile im Speicher darf keine Seite lahmlegen.
   */
  function lesen() {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}') || {};
    } catch (e) {
      return {};
    }
  }

  /** Feldwerte der aktuellen Seite einsammeln. */
  function collectFields(root) {
    var out = {};
    (root || document).querySelectorAll('[data-field]').forEach(function (el) {
      out[el.dataset.field] = el.type === 'checkbox' ? el.checked : el.value;
    });
    return out;
  }

  /**
   * Werte eines Datensatzes in die Felder der Seite eintragen.
   *
   * Felder ohne Eintrag im Datensatz bleiben, wie sie sind. Die Gegenrichtung
   * zu collectFields() - beide behandeln Kontrollkaestchen gleich, weil sie
   * hier nebeneinander stehen. Als die Schleife noch in vier Dateien stand,
   * kannte eine davon keine Kontrollkaestchen.
   */
  function anwenden(daten, root) {
    daten = daten || {};
    var aktiv = (typeof document !== 'undefined') ? document.activeElement : null;
    (root || document).querySelectorAll('[data-field]').forEach(function (el) {
      var v = daten[el.dataset.field];
      if (v === undefined) return;
      // Das Feld, in dem gerade getippt wird, bleibt unberuehrt. Der
      // Abgleich sichert es vorher mit frischem Zeitstempel - der lokale Wert
      // gewinnt ohnehin, und ein Neusetzen wuerfe den Cursor ans Ende.
      if (el === aktiv) return;
      // Ebenso jedes andere Feld, das seit dem letzten Speichern beruehrt
      // wurde - etwa ein Haken, der nicht den Fokus behaelt (v19).
      if (_beruehrt[el.dataset.field]) return;
      if (el.type === 'checkbox') { if (el.checked !== !!v) el.checked = !!v; }
      else if (el.value !== String(v)) el.value = v;
    });
  }

  global.FieldSync = {
    TIMES_KEY: TIMES_KEY,
    DEVICES_KEY: DEVICES_KEY,
    DEVICE_KEY: DEVICE_KEY,
    STORAGE_KEY: STORAGE_KEY,
    isBlank: isBlank,
    lesen: lesen,
    collectFields: collectFields,
    anwenden: anwenden,
    mergeIntoExisting: mergeIntoExisting,
    mergeRecords: mergeRecords,
    GELEERT_KEY: GELEERT_KEY,
    beruehrteAbholen: beruehrteAbholen,
    istBeruehrt: istBeruehrt,
    hatBeruehrte: hatBeruehrte,
    getDeviceId: getDeviceId,
    getDeviceName: getDeviceName,
    setDeviceName: setDeviceName,
    stampDevice: stampDevice
  };
})(typeof window !== 'undefined' ? window : globalThis);
