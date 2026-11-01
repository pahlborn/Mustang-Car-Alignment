/**
 * notiz.js - Notizen je Schritt der Anleitung.
 *
 * Wie in jerico und gt40: an jedem Arbeitsschritt lassen sich Notizen
 * eintragen - was aufgefallen ist, was fehlt, was anders sein soll. Jede
 * Notiz hat einen Status (offen / in Arbeit / erledigt) und laesst sich
 * zuruecknehmen. Peter, 2026-11-01: "in den anderen apps gibt es befund, den
 * man in jeder rubrik nutzen kann" - und: "befund ist kein gutes wort:
 * nennen wir es ueberall und uebergreifend notiz".
 *
 * Speicher und Abgleich wie diagnose.js: eigener Kanal in abgleich.js,
 * pro Notiz gewinnt der juengere Stand, Loeschen ist ein Grabstein
 * (Regel 9) - sonst bringt das zweite Geraet die Notiz zurueck.
 *
 * Datenform: { version: 1, notizen: { <id>: { k: 'anl_6_4', t: 'Text',
 *              s: '' | 'wip' | 'done', e: erstellt, m: geaendert, del? } } }
 */
(function (global) {
  'use strict';

  var STORAGE_KEY = 'chassisNotizen';
  var GIST_FILE = 'mustang-chassis-notizen.json';
  var STUFEN = ['', 'wip', 'done'];
  var LABEL = { '': 'offen', 'wip': 'in Arbeit', 'done': 'erledigt' };

  var _data = { version: 1, notizen: {} };
  var _letzte = 0;

  // Wie status.js und diagnose.js: zwei Eintraege nacheinander bekaemen
  // sonst denselben Stempel (Regel 7b).
  function now() {
    var t = Date.now();
    _letzte = (t > _letzte) ? t : _letzte + 1;
    return _letzte;
  }

  function neueId() {
    return 'b' + now().toString(36) + Math.random().toString(36).slice(2, 7);
  }

  function stufe(v) { return v === 'wip' || v === 'done' ? v : ''; }

  function laden() {
    try {
      var roh = localStorage.getItem(STORAGE_KEY);
      if (roh) {
        var p = JSON.parse(roh);
        if (p) _data = { version: 1, notizen: p.notizen || {}, savedAt: p.savedAt };
      }
    } catch (e) { console.warn('[Notiz] Lesefehler:', e.message); }
    return _data;
  }

  function speichern() {
    _data.savedAt = now();
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(_data)); }
    catch (e) { console.error('[Notiz] Speicherfehler:', e.message); }
    if (typeof global.Abgleich !== 'undefined') global.Abgleich.planen();
  }

  function mischen(a, b) {
    var out = { version: 1, notizen: {} };
    var k;
    for (k in (a.notizen || {})) out.notizen[k] = a.notizen[k];
    for (k in (b.notizen || {})) {
      var c = out.notizen[k], n = b.notizen[k];
      if (!c || (n.m || 0) >= (c.m || 0)) out.notizen[k] = n;
    }
    out.savedAt = Math.max(a.savedAt || 0, b.savedAt || 0) || undefined;
    return out;
  }

  function anlegen(schritt, text) {
    text = String(text || '').trim();
    if (!text) return null;
    var id = neueId(), t = now();
    _data.notizen[id] = { k: String(schritt), t: text, s: '', e: t, m: t };
    speichern();
    return id;
  }

  function naechste(v) { return STUFEN[(STUFEN.indexOf(stufe(v)) + 1) % STUFEN.length]; }

  function statusWeiter(id) {
    var b = _data.notizen[id];
    if (!b || b.del) return null;
    b.s = naechste(b.s);
    b.m = now();
    speichern();
    return b.s;
  }

  /** Zuruecknehmen als Grabstein - Regel 9. */
  function entfernen(id) {
    var b = _data.notizen[id];
    if (!b) return false;
    _data.notizen[id] = { k: b.k, del: true, m: now() };
    speichern();
    return true;
  }

  /** Notizen eines Schritts, aelteste zuerst. Ohne Schritt: alle. */
  function liste(schritt) {
    var out = [];
    for (var id in _data.notizen) {
      var b = _data.notizen[id];
      if (b.del) continue;
      if (schritt && b.k !== schritt) continue;
      out.push({ id: id, schritt: b.k, text: b.t, stufe: stufe(b.s), erstellt: b.e, geaendert: b.m });
    }
    return out.sort(function (x, y) { return x.erstellt - y.erstellt; });
  }

  laden();

  if (typeof global.Abgleich !== 'undefined') {
    global.Abgleich.anmelden({
      datei: GIST_FILE,
      lokal: function () { return _data; },
      mischen: mischen,
      uebernehmen: function (d) {
        _data = { version: 1, notizen: d.notizen || {}, savedAt: d.savedAt };
        try { localStorage.setItem(STORAGE_KEY, JSON.stringify(_data)); } catch (e) {}
      }
    });
  }

  global.Notiz = {
    STORAGE_KEY: STORAGE_KEY,
    GIST_FILE: GIST_FILE,
    LABEL: LABEL,
    anlegen: anlegen,
    statusWeiter: statusWeiter,
    entfernen: entfernen,
    liste: liste,
    mischen: mischen,
    _laden: laden,
    _roh: function () { return _data; }
  };
})(typeof window !== 'undefined' ? window : globalThis);
