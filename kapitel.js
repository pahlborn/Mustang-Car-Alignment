/**
 * kapitel.js - Registry der Handbuchdateien.
 *
 * WAS HIER STEHT UND WAS NICHT
 *
 * Hier steht nur die **Einordnung**: welche Datei gehoert zu welcher Ebene,
 * in welcher Reihenfolge. Das ist eine Gliederungsentscheidung, und sie
 * stammt aus 01_ARCHITECTURE.md 3 - tests/kapitel.test.mjs prueft beides
 * gegeneinander.
 *
 * Titel und Dokumentrolle stehen NICHT hier. Sie werden beim Laden aus der
 * Datei gelesen: jedes Kapitel traegt eine H1-Zeile und die meisten eine
 * Zeile "**Dokumentrolle:**". Abgeschrieben wuerden sie beim ersten
 * Umbenennen auseinanderlaufen.
 *
 * Das Ebenenmodell in einem Satz: Ebene 1 erklaert, warum sich das Fahrzeug
 * so verhaelt. Ebene 2, was daran gebaut und einstellbar ist. Ebene 3, wie
 * man es misst und deutet. Ebene 4 ist die Arbeit selbst.
 */
(function (global) {
  'use strict';

  var VERZEICHNIS = 'handbuch/';

  // ===========================================================================
  // EBENEN - Abschrift der Gliederung aus 01_ARCHITECTURE.md 3
  // ---------------------------------------------------------------------------
  // `frage` ist die Leitfrage, die dort ueber jeder Ebene steht. Sie sagt dem
  // Leser, wo er anfangen soll - und das Handbuch merkt ausdruecklich an:
  // "Die Leserichtung ist nicht zwingend von oben nach unten. Wer ein
  // konkretes Problem hat, beginnt in Ebene 3 und geht nach oben."
  // ===========================================================================
  var EBENEN = [
    { nr: 0, id: 'basis', titel: 'Autorit\u00e4ten',
      frage: 'Was gilt, wenn sich zwei Angaben widersprechen?' },
    { nr: 1, id: 'grundlagen', titel: 'Grundlagen',
      frage: 'Warum verh\u00e4lt sich das Fahrzeug so?' },
    { nr: 2, id: 'geometrie', titel: 'Fahrzeuggeometrie',
      frage: 'Was ist am Mustang wie gebaut und einstellbar?' },
    { nr: 3, id: 'messen', titel: 'Messen und Diagnose',
      frage: 'Wie messe ich verl\u00e4sslich? Was bedeutet das?' },
    { nr: 4, id: 'arbeiten', titel: 'Arbeiten',
      frage: 'Womit wird erfasst, was offen ist?' }
  ];

  // ===========================================================================
  // DATEIEN
  // ---------------------------------------------------------------------------
  // Reihenfolge innerhalb der Ebene = Lesereihenfolge.
  //
  // `rang` nur bei den drei Autoritaeten: 01_ARCHITECTURE.md 2 legt fest, dass
  // bei Widerspruch CONVENTIONS vor 00_PROJECT vor 02_WORKFLOW geht.
  // ===========================================================================
  var DATEIEN = [
    // --- Ebene 0: die Autoritaeten und was sie erklaert ---
    { datei: 'CONVENTIONS.md',   ebene: 'basis', rang: 1 },
    { datei: '00_PROJECT.md',    ebene: 'basis', rang: 2 },
    { datei: '02_WORKFLOW.md',   ebene: 'basis', rang: 3 },
    { datei: 'GLOSSAR.md',       ebene: 'basis' },
    { datei: '01_ARCHITECTURE.md', ebene: 'basis' },

    // --- Ebene 1: Grundlagen ---
    { datei: 'CHAPTER_TIRE_MECHANICS.md',        ebene: 'grundlagen' },
    { datei: 'CHAPTER_VEHICLE_DYNAMICS.md',      ebene: 'grundlagen' },
    { datei: 'CHAPTER_SPRINGS_ROLL_STIFFNESS.md', ebene: 'grundlagen' },

    // --- Ebene 2: Fahrzeuggeometrie ---
    { datei: 'CHAPTER_FRONT_GEOMETRY_CAMBER_CASTER_KPI.md', ebene: 'geometrie' },
    { datei: 'CHAPTER_FRONT_ADJUSTMENT_UCA_LCA.md',         ebene: 'geometrie' },
    { datei: 'CHAPTER_TOE_ACKERMANN_THRUST.md',             ebene: 'geometrie' },
    { datei: 'CHAPTER_BUMP_STEER.md',                       ebene: 'geometrie' },
    { datei: 'CHAPTER_REAR_SUSPENSION_PANHARD_PINION.md',   ebene: 'geometrie' },
    { datei: 'CHAPTER_SETUP_PAD_RIDE_HEIGHT.md',            ebene: 'geometrie' },
    { datei: 'CHAPTER_BALANCE_CORNER_WEIGHT.md',            ebene: 'geometrie' },

    // --- Ebene 3: Messen und Diagnose ---
    { datei: 'CHAPTER_BIND_DIAGNOSIS.md',                ebene: 'messen' },
    { datei: 'CHAPTER_TRACK_VALIDATION_TIRES.md',        ebene: 'messen' },
    { datei: 'CHAPTER_HANDLING_DIAGNOSIS_DECISION_TREE.md', ebene: 'messen' },
    { datei: 'CHAPTER_TRACKS.md',                        ebene: 'messen' },

    // --- Ebene 4: Arbeiten ---
    { datei: 'TEMPLATE_MASTER_SETUP_SHEET.md',  ebene: 'arbeiten' },
    { datei: 'TEMPLATE_SETUP_SHEET.md',         ebene: 'arbeiten' },
    { datei: 'TEMPLATE_ALIGNMENT_SHEET.md',     ebene: 'arbeiten' },
    { datei: 'TEMPLATE_SCALE_SHEET.md',         ebene: 'arbeiten' },
    { datei: 'TEMPLATE_BUMP_STEER_SHEET.md',    ebene: 'arbeiten' },
    { datei: 'TEMPLATE_TRACK_SESSION_SHEET.md', ebene: 'arbeiten' },
    { datei: 'TEMPLATE_CHANGE_LOG.md',          ebene: 'arbeiten' },
    { datei: 'DECISION_LEAF_SPRINGS.md',        ebene: 'arbeiten' },

    // Diese beiden beschreiben einen frueheren oder voruebergehenden Stand.
    // Sie stehen am Ende und tragen `historisch` - wer sie liest, soll
    // wissen, dass sie nicht den heutigen Zustand beschreiben.
    { datei: 'LEGACY_REAR_AXLE_LEAF_SPRINGS_PINION.md', ebene: 'arbeiten', historisch: true },
    { datei: 'MIGRATION_1-3.md',                        ebene: 'arbeiten', historisch: true }
  ];

  // Beim Laden gefuellt: Titel, Rolle, Volltext.
  var _inhalt = {};

  function kennung(datei) {
    return datei.replace(/\.md$/, '').toLowerCase().replace(/[^a-z0-9]+/g, '-');
  }

  function eintrag(datei) {
    for (var i = 0; i < DATEIEN.length; i++) {
      if (DATEIEN[i].datei === datei) return DATEIEN[i];
    }
    return null;
  }

  function ebene(id) {
    for (var i = 0; i < EBENEN.length; i++) if (EBENEN[i].id === id) return EBENEN[i];
    return null;
  }

  /** Dateien einer Ebene, in Lesereihenfolge. */
  function proEbene(id) {
    return DATEIEN.filter(function (d) { return d.ebene === id; });
  }

  /**
   * Kopfdaten aus dem Markdown lesen.
   *
   * Jede Datei traegt genau eine H1-Zeile; die meisten zusaetzlich
   * "**Dokumentrolle:**". Fehlt die Rolle, bleibt sie leer - das ist kein
   * Fehler, sondern heisst nur, dass die Datei keine eigene nennt.
   */
  function kopf(text) {
    var zeilen = text.split(/\r?\n/);
    var titel = '', rolle = '';
    for (var i = 0; i < zeilen.length && i < 40; i++) {
      if (!titel) {
        var h = zeilen[i].match(/^#\s+(.+?)\s*$/);
        if (h) { titel = h[1]; continue; }
      }
      var r = zeilen[i].match(/^\*\*Dokumentrolle:\*\*\s*(.+?)\s*$/);
      if (r) { rolle = r[1].trim(); break; }
    }
    return { titel: titel, rolle: rolle };
  }

  /**
   * Eine Datei laden.
   *
   * Der Volltext bleibt im Speicher - er wird fuer die Suche gebraucht, und
   * das Handbuch ist zusammen rund 440 KB. Das ist weniger als ein einziges
   * Foto und spart bei jeder Suche 29 Netzzugriffe.
   */
  function laden(datei) {
    if (_inhalt[datei]) return Promise.resolve(_inhalt[datei]);
    var e = eintrag(datei);
    if (!e) return Promise.reject(new Error('Unbekannte Datei: ' + datei));

    return fetch(VERZEICHNIS + datei)
      .then(function (res) {
        if (!res.ok) throw new Error(datei + ': Status ' + res.status);
        return res.text();
      })
      .then(function (text) {
        var k = kopf(text);
        _inhalt[datei] = {
          datei: datei,
          id: kennung(datei),
          ebene: e.ebene,
          rang: e.rang || null,
          historisch: !!e.historisch,
          titel: k.titel || datei,
          rolle: k.rolle,
          text: text,
          suche: text.toLowerCase()
        };
        return _inhalt[datei];
      });
  }

  /** Alle Dateien laden. Fehlschlaege einzelner Dateien brechen nicht ab. */
  function alleLaden() {
    return Promise.all(DATEIEN.map(function (d) {
      return laden(d.datei).catch(function (err) {
        if (typeof ErrorLog !== 'undefined') {
          ErrorLog.add('Kapitel nicht ladbar: ' + d.datei,
                       { quelle: 'kapitel.js', stack: err.message });
        }
        return null;
      });
    })).then(function (r) { return r.filter(Boolean); });
  }

  function geladen(datei) { return datei ? _inhalt[datei] || null : _inhalt; }

  /**
   * Volltextsuche ueber alle geladenen Kapitel.
   *
   * Gibt je Treffer die Textstelle mit Umfeld zurueck - ein Dateiname allein
   * sagt nicht, ob sich das Oeffnen lohnt.
   *
   * @param {string} text
   * @param {number} [proDatei] hoechstens so viele Stellen je Datei
   */
  function suchen(text, proDatei) {
    var q = String(text || '').trim().toLowerCase();
    if (q.length < 2) return [];
    var grenze = proDatei || 3;
    var treffer = [];

    DATEIEN.forEach(function (d) {
      var k = _inhalt[d.datei];
      if (!k) return;
      var stellen = [];
      var pos = k.suche.indexOf(q);
      while (pos > -1 && stellen.length < grenze) {
        stellen.push({
          pos: pos,
          umfeld: umfeld(k.text, pos, q.length)
        });
        pos = k.suche.indexOf(q, pos + q.length);
      }
      if (!stellen.length) return;
      treffer.push({
        datei: d.datei, id: k.id, titel: k.titel, ebene: k.ebene,
        anzahl: zaehlen(k.suche, q), stellen: stellen
      });
    });
    return treffer;
  }

  function zaehlen(heu, nadel) {
    var n = 0, pos = heu.indexOf(nadel);
    while (pos > -1) { n++; pos = heu.indexOf(nadel, pos + nadel.length); }
    return n;
  }

  /** Textstelle mit Umfeld, auf Zeilengrenzen geschnitten. */
  function umfeld(text, pos, laenge) {
    var von = Math.max(0, pos - 60);
    var bis = Math.min(text.length, pos + laenge + 80);
    var s = text.slice(von, bis).replace(/\s+/g, ' ').trim();
    return (von > 0 ? '\u2026' : '') + s + (bis < text.length ? '\u2026' : '');
  }

  global.Kapitel = {
    VERZEICHNIS: VERZEICHNIS,
    EBENEN: EBENEN,
    DATEIEN: DATEIEN,
    kennung: kennung,
    eintrag: eintrag,
    ebene: ebene,
    proEbene: proEbene,
    kopf: kopf,
    laden: laden,
    alleLaden: alleLaden,
    geladen: geladen,
    suchen: suchen,
    _umfeld: umfeld
  };
})(typeof window !== 'undefined' ? window : globalThis);
