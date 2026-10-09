/**
 * glossar.js - Begriffe aus handbuch/GLOSSAR.md.
 *
 * KEINE ABSCHRIFT
 *
 * Anders als recheck.js und diagnose.js schreibt dieses Modul nichts ab. Es
 * laedt GLOSSAR.md zur Laufzeit und zerlegt sie. Der Grund: das Glossar
 * besteht aus Fliesstext, und 51 Eintraege von Hand zu uebertragen hiesse,
 * sie bei jeder Ergaenzung erneut zu uebertragen.
 *
 * Die Pflegeregel des Handbuchs lautet "Ein Begriff, eine Definition, ein
 * Ort". Im Schwesterprojekt jerico stand das Glossar viermal im Markup, und
 * die Kopien widersprachen sich, bevor es auffiel.
 *
 * Preis dafuer: die Datei muss erreichbar sein. Offline faengt der Service
 * Worker das ab - GLOSSAR.md steht in seiner Liste.
 */
(function (global) {
  'use strict';

  var PFAD = 'handbuch/GLOSSAR.md';

  // Kategorien, wie sie in der Datei stehen. Die Nummer ist Teil der
  // Ueberschrift; nur sie und der Titel werden uebernommen.
  var _kategorien = [];
  var _eintraege = [];
  var _geladen = false;
  var _laeuft = null;

  /**
   * Zerlegt die Markdown-Datei.
   *
   * Aufbau, den das Handbuch durchhaelt:
   *
   *   ## 1. Radstellung und Lenkgeometrie      <- Kategorie
   *   ### Camber (Sturz)                       <- Begriff
   *   **Was ist das?** ...                     <- Feld
   *   **Verwandt:** Camber Gain, ...           <- Querverweise
   *
   * Abschnitte ohne Begriff - "Pflegeregel", "Noch aufzunehmen", "Definition
   * of Done" - entfallen von selbst: am Ende werden Kategorien ohne Eintrag
   * weggeworfen. Eine Namensliste dafuer stand hier zuerst auch, war aber
   * wirkungslos und haette bei einer Umbenennung im Handbuch stillschweigend
   * ins Leere gegriffen.
   */
  function zerlegen(text) {
    var zeilen = text.split(/\r?\n/);
    var kategorien = [];
    var eintraege = [];
    var kat = null;
    var akt = null;

    function abschliessen() {
      if (!akt) return;
      akt.text = akt.roh.join('\n').trim();
      // Suchfeld: Begriff und Inhalt in Kleinschreibung, einmal gebaut.
      akt.suche = (akt.begriff + ' ' + akt.text).toLowerCase();
      eintraege.push(akt);
      akt = null;
    }

    for (var i = 0; i < zeilen.length; i++) {
      var z = zeilen[i];

      var mKat = z.match(/^##\s+(?:(\d+)\.\s+)?(.+?)\s*$/);
      if (mKat && !/^###/.test(z)) {
        abschliessen();
        kat = { nr: mKat[1] ? Number(mKat[1]) : null, titel: mKat[2].trim(), anzahl: 0 };
        kategorien.push(kat);
        continue;
      }

      var mBegriff = z.match(/^###\s+(.+?)\s*$/);
      if (mBegriff) {
        abschliessen();
        if (!kat) continue;              // Begriff in einem uebersprungenen Abschnitt
        akt = {
          begriff: mBegriff[1].trim(),
          kategorie: kat.titel,
          katNr: kat.nr,
          roh: []
        };
        kat.anzahl++;
        continue;
      }

      if (akt) {
        if (/^---\s*$/.test(z)) continue;   // Trennlinie zwischen Eintraegen
        akt.roh.push(z);
      }
    }
    abschliessen();

    // Leere Kategorien entfallen - sie wuerden als Filter ohne Treffer dastehen.
    kategorien = kategorien.filter(function (k) { return k.anzahl > 0; });
    return { kategorien: kategorien, eintraege: eintraege };
  }

  /** Laedt und zerlegt einmal. Parallele Aufrufe teilen sich den Ladevorgang. */
  function laden() {
    if (_geladen) return Promise.resolve(_eintraege);
    if (_laeuft) return _laeuft;

    _laeuft = fetch(PFAD)
      .then(function (res) {
        if (!res.ok) throw new Error('GLOSSAR.md: Status ' + res.status);
        return res.text();
      })
      .then(function (text) {
        var r = zerlegen(text);
        _kategorien = r.kategorien;
        _eintraege = r.eintraege;
        _geladen = true;
        _laeuft = null;
        return _eintraege;
      })
      .catch(function (err) {
        _laeuft = null;
        // Kein Toast: das Glossar ist eine Hilfe, kein Arbeitsmittel. Wer es
        // oeffnet, sieht die Meldung im Overlay - wer nicht, soll nicht
        // gestoert werden.
        if (typeof ErrorLog !== 'undefined') {
          ErrorLog.add('Glossar nicht ladbar', { quelle: 'glossar.js', stack: err.message });
        }
        throw err;
      });
    return _laeuft;
  }

  function eintraege() { return _eintraege; }
  function kategorien() { return _kategorien; }
  function istGeladen() { return _geladen; }

  /**
   * Sucht Begriffe.
   *
   * Ohne Suchtext alle. Sonst Treffer in Begriff oder Inhalt; Treffer im
   * Begriff stehen vorn, weil wer "Camber" sucht, den Eintrag Camber meint
   * und nicht die zwoelf anderen, die ihn erwaehnen.
   */
  function suchen(text, kategorie) {
    var q = String(text || '').trim().toLowerCase();
    var treffer = _eintraege.filter(function (e) {
      if (kategorie && e.kategorie !== kategorie) return false;
      if (!q) return true;
      return e.suche.indexOf(q) > -1;
    });
    if (!q) return treffer;
    return treffer.sort(function (a, b) {
      var ab = a.begriff.toLowerCase().indexOf(q) > -1;
      var bb = b.begriff.toLowerCase().indexOf(q) > -1;
      if (ab !== bb) return ab ? -1 : 1;
      return 0;
    });
  }

  /** Genau ein Begriff, oder null. Vergleich ohne Rücksicht auf Gross/Klein. */
  function begriff(name) {
    var n = String(name || '').trim().toLowerCase();
    for (var i = 0; i < _eintraege.length; i++) {
      if (_eintraege[i].begriff.toLowerCase() === n) return _eintraege[i];
    }
    // Zweiter Versuch ohne Klammerzusatz: "Camber (Sturz)" findet "Camber".
    for (var j = 0; j < _eintraege.length; j++) {
      var ohne = _eintraege[j].begriff.replace(/\s*\(.*\)\s*$/, '').toLowerCase();
      if (ohne === n) return _eintraege[j];
    }
    return null;
  }

  global.Glossar = {
    PFAD: PFAD,
    laden: laden,
    eintraege: eintraege,
    kategorien: kategorien,
    istGeladen: istGeladen,
    suchen: suchen,
    begriff: begriff,
    _zerlegen: zerlegen
  };
})(typeof window !== 'undefined' ? window : globalThis);
