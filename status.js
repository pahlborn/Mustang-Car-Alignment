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
 * In der Werkstatt traegt man Stellgroessen in Felder ein (Shims, Platten,
 * Strut Rod, Kaltdruck); `ausFeld()` meldet die zugehoerige Groesse
 * automatisch. Messwerte melden nichts - Messen verstellt nichts (seit v23). An der Strecke verstellt man Camber, ohne
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
   * Eine Groesse, die eine SPAETERE Phase nach der Aenderung neu erfasst und
   * abgeschlossen hat, zaehlt ebenfalls nicht (v25, `abgedeckt()`): Phase 6
   * ist durch Phase 13 planmaessig ersetzt (02_WORKFLOW §2), nicht ungueltig.
   * `wegen` nennt nur, was nicht abgedeckt ist.
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

      // Eine Phase, die diese Groesse selbst liefert, ist durch ihre
      // Neuerfassung ueberholt - ohne Umweg ueber die Matrix.
      //
      // Beispiel: ein geaenderter Shim meldet "castor" - die Phasen, die
      // Castor liefern, sind damit ueberholt. Messungen melden seit v23
      // nichts mehr; bis dahin entwertete eine neue Radlast-Messung in
      // Phase 15 die Phasen davor, und 100 % waren nicht erreichbar.
      if (p.liefert.indexOf(e.groesse) > -1 && !abgedeckt(p, e.groesse, e.zeit)) {
        veraltet = true;
        wegen.push({ groesse: e.groesse, zeit: e.zeit, art: 'neu erfasst',
                     felder: [e.groesse] });
        continue;
      }

      var folge = Recheck.phasenNach(e.groesse);
      var alt = folge.veraltet.filter(function (x) { return x.id === phaseId; });
      var offenAlt = alt.length ? nichtAbgedeckt(p, alt[0].wegen, e.zeit) : [];
      if (offenAlt.length) {
        veraltet = true;
        wegen.push({ groesse: e.groesse, zeit: e.zeit, art: 'neu messen', felder: offenAlt });
        continue;
      }
      var mit = folge.mitmessen.filter(function (x) { return x.id === phaseId; });
      var offenMit = mit.length ? nichtAbgedeckt(p, mit[0].wegen, e.zeit) : [];
      if (offenMit.length) {
        mitmessen = true;
        wegen.push({ groesse: e.groesse, zeit: e.zeit, art: 'mitmessen', felder: offenMit });
      }
    }
    // Die staerkere Aussage gewinnt, wie in recheck.js.
    return { veraltet: veraltet, mitmessen: veraltet ? false : mitmessen, wegen: wegen };
  }

  /**
   * Hat eine spaetere Phase die Groesse nach der Aenderung neu erfasst?
   *
   * Drei Bedingungen, alle noetig (Auftrag v25):
   *   - Q steht im Ablauf nach P
   *   - Q liefert g - berechnet aus Recheck.PHASEN, nicht von Hand gelistet
   *   - Q ist erledigt, und zwar NACH der Aenderung
   *
   * Die dritte ist der Kern. Es reicht nicht, dass es Q im Ablauf gibt:
   * sonst veraltete Phase 7 nach einer Balanceaenderung in Phase 8 nie, und
   * Phase 9 ("nach Balance alles erneut pruefen") verloere ihre Wirkung.
   * Phase 5 hat keine spaetere Phase mit ihren Groessen - sie muss nach
   * Phase 8 erneut bestaetigt werden, so will es der Ablauf.
   *
   * Strikt "nach": now() zaehlt innerhalb einer Millisekunde hoch (Regel 7b),
   * die Reihenfolge der Eingaben entscheidet, nicht der Zufall.
   */
  function abgedeckt(p, g, t) {
    for (var i = 0; i < Recheck.PHASEN.length; i++) {
      var q = Recheck.PHASEN[i];
      if (q.nr <= p.nr) continue;
      if (q.liefert.indexOf(g) < 0) continue;
      if (stufe(q.id) === 'done' && gesetztAm(q.id) > t) return true;
    }
    return false;
  }

  function nichtAbgedeckt(p, felder, t) {
    return felder.filter(function (g) { return !abgedeckt(p, g, t); });
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
   * Der Bind-Befund, soweit er sich ermitteln laesst.
   *
   * Gerechnet mit bind.js auf den gespeicherten Feldwerten - derselbe Befund
   * wie auf bind.html, nicht abgeschrieben.
   *
   * Fehlt bind.js, ist der Befund `unbekannt`, nicht `bestanden`. Eine
   * Sicherheitspruefung, die bei fehlender Grundlage durchwinkt, ist keine.
   */
  function bindStand() {
    if (typeof Bind === 'undefined' || typeof FieldSync === 'undefined') {
      return { bekannt: false, geprueft: false, sperrt: false, gruende: [], ueberholt: [] };
    }
    var daten = FieldSync.lesen();
    var bf = Bind.befund(daten);
    var stand = { bekannt: true, geprueft: bf.geprueft, sperrt: bf.sperrt, gruende: bf.gruende, ueberholt: [] };

    // Nach einer Aenderung an Buchsen der Hinterachse oder an Laenge oder
    // Hoehe des Panhard gilt ein bestandener Test nicht mehr (v23/v24;
    // Liste und Beleg in recheck.js). Massgeblich ist der Zeitpunkt der
    // letzten Eingabe im Test nach 6.1.
    if (bf.geprueft) {
      var testZeit = bindTestZeit(daten);
      var nach = Recheck.BIND_UNGUELTIG_NACH;
      stand.ueberholt = journal().filter(function (e) {
        return nach.indexOf(e.groesse) > -1 && e.zeit > testZeit;
      });
      if (stand.ueberholt.length) stand.geprueft = false;
    }
    return stand;
  }

  /** Was nach dem Test geaendert wurde, lesbar und ohne Doppelte. */
  function ueberholtText(liste) {
    var namen = [];
    for (var i = 0; i < liste.length; i++) {
      var n = Recheck.name(liste[i].groesse);
      if (namen.indexOf(n) < 0) namen.push(n);
    }
    return namen.join(', ');
  }

  /** Zeitpunkt der juengsten Eingabe im Reproduzierbarkeitstest (6.1). */
  function bindTestZeit(daten) {
    var t = (daten && daten[FieldSync.TIMES_KEY]) || {};
    var max = 0;
    for (var d = 1; d <= 3; d++) {
      for (var i = 0; i < Bind.RAEDER.length; i++) {
        var z = t[Bind.feldRadlast(d, Bind.RAEDER[i])];
        if (typeof z === 'number' && z > max) max = z;
      }
    }
    return max;
  }

  /**
   * Ist das Fahrzeug rennstreckenbereit?
   *
   * Nur wenn jede Phase erledigt ist, keine veraltet - und der Bind-Test
   * nach 6.1 bestanden. Projektregel 6 aus dem Bind-Kapitel: "Keine
   * Setup-Schluesse aus Messungen mit bekanntem Bind." Ein Setup, das unter
   * Bind gemessen wurde, ist nicht fertig, sondern unbrauchbar - auch wenn
   * jede Phase abgehakt ist.
   *
   * Ein nicht erfasster Test zaehlt nicht als bestanden (Arbeitsregel 9).
   *
   * `grund` nennt, was fehlt - eine Anzeige, die nur "nein" sagt, hilft in
   * der Box nicht weiter.
   */
  function rennstreckenbereit() {
    var f = fortschritt();
    var b = bindStand();
    var phasenFertig = f.gesamt > 0 && f.erledigt === f.gesamt;
    var bindOk = b.bekannt && b.geprueft && !b.sperrt;

    var grund = [];
    if (b.sperrt) grund.push('Bind-Befund: ' + b.gruende.join('; '));
    else if (!b.bekannt) grund.push('Bind-Befund nicht ermittelbar');
    else if (!b.geprueft && b.ueberholt && b.ueberholt.length) grund.push('Bind-Test (6.1) wiederholen, danach geändert: ' + ueberholtText(b.ueberholt));
    else if (!b.geprueft) grund.push('Bind-Test (6.1) nicht erfasst');
    if (f.veraltet) grund.push(f.veraltet + ' Phase(n) veraltet');
    if (f.wip) grund.push(f.wip + ' in Arbeit');
    if (f.offen) grund.push(f.offen + ' offen');
    return { bereit: phasenFertig && bindOk, grund: grund, bind: b };
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
  // Der Ablauf steht in abgleich.js. Bis v17 stand hier eine eigene Fassung,
  // wortgleich mit der in diagnose.js - sie schluckte jeden Fehler und wurde
  // nur beim eigenen Schreiben ausgeloest: Status von anderen Geraeten kam
  // erst an, wenn man selbst etwas abhakte.

  function abgleichPlanen() {
    if (typeof global.Abgleich !== 'undefined') global.Abgleich.planen();
  }

  laden();

  if (typeof global.Abgleich !== 'undefined') {
    global.Abgleich.anmelden({
      datei: GIST_FILE,
      lokal: function () { return _data; },
      mischen: mischen,
      uebernehmen: function (d) {
        _data = { version: 1, phasen: d.phasen || {}, journal: d.journal || {}, savedAt: d.savedAt };
        try { localStorage.setItem(STORAGE_KEY, JSON.stringify(_data)); } catch (e) {}
      }
    });
  }

  // ==== Felder melden ihre Groesse selbst ====
  //
  // Ein Feld einer Stellgroesse traegt data-groesse="castor". Wird es
  // geaendert, ist das eine Verstellung - ohne dass jemand daran denken muss.
  // Dasselbe Ereignis wie ein Eingriff, nur ohne eigenen Knopf. Messfelder
  // tragen das Attribut nicht (messblatt.js, seit v23).
  //
  // Der Lauscher steht hier und nicht in einer Seitendatei: er gehoert zu
  // ausFeld(). In v3 lag er in werkstatt.js, und als die Messfelder auf einer
  // anderen Seite dazukamen, meldeten sie nichts - der Mechanismus war da,
  // aber nicht dort, wo er gebraucht wurde.
  //
  // Danach ein Ereignis, damit jede Seite ihre Anzeige nachziehen kann, ohne
  // dass dieses Modul die Seiten kennen muss.
  if (typeof document !== 'undefined') {
    document.addEventListener('change', function (e) {
      var el = e.target;
      if (!el || !el.dataset || !el.dataset.groesse) return;
      ausFeld(el.dataset.groesse);
      document.dispatchEvent(new CustomEvent('status-geaendert', {
        detail: { groesse: el.dataset.groesse, feld: el.dataset.field || '' }
      }));
    });
  }

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
    bindStand: bindStand,
    ueberholtText: ueberholtText,
    uebersicht: uebersicht,
    _mischen: mischen,
    _roh: function () { return _data; },
    _setzeRoh: function (d) { _data = d; _letzte = 0; },
    _laden: laden
  };
})(typeof window !== 'undefined' ? window : globalThis);
