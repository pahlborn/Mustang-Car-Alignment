/**
 * nachschlagen.js - Glossar, Nachschlagekarte und Suche als Overlay.
 *
 * Von jeder Seite erreichbar ueber den Knopfstapel unten rechts. Das Markup
 * dafuer wird hier erzeugt, nicht in den Seiten wiederholt - vier Kopien
 * desselben Overlays waeren vier Orte fuer dieselbe Sache.
 *
 * DIE SUCHE HAT ZWEI QUELLEN
 *
 *   1. das Glossar - Begriffe und Definitionen
 *   2. die aktuelle Seite - Treffer werden hervorgehoben
 *
 * Die Schwesterprojekte haben eine dritte: die uebrigen Seiten, vorab
 * geladen. Die fehlt hier noch; sie lohnt erst, wenn die Kapitel auf der
 * Site sind.
 */
(function (global) {
  'use strict';

  function esc(s) {
    return String(s == null ? '' : s)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;')
      .replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }
  // ===========================================================================
  // Markdown
  // ---------------------------------------------------------------------------
  // Der Renderer steht in markdown.js und wird von der Handbuchseite mit
  // benutzt. Hier stand zuerst eine eigene, kleinere Fassung - zwei Renderer
  // fuer dasselbe Format waeren zwei Orte fuer dieselbe Entscheidung, und
  // der eine haette Tabellen gekonnt, der andere nicht.
  // ===========================================================================
  function markdown(text) {
    if (typeof Markdown === 'undefined') return esc(text);
    return Markdown.rendern(text, {
      kapitelLink: function (datei) {
        return 'handbuch.html?d=' + encodeURIComponent(datei);
      }
    });
  }


  // ===========================================================================
  // Overlay-Gerüst
  // ===========================================================================

  function overlay(id, titel, inhalt) {
    var vorhanden = document.getElementById(id);
    if (vorhanden) return vorhanden;

    var ov = document.createElement('div');
    ov.className = 'guide-overlay';
    ov.id = id;
    ov.innerHTML =
        '<div class="guide-header">'
      + '<button type="button" class="guide-back" onclick="nachschlagenSchliessen(\'' + id + '\')"'
      + ' aria-label="Zur&uuml;ck">&#8249;</button>'
      + '<h2>' + esc(titel) + '</h2></div>'
      + '<div class="guide-content">' + inhalt + '</div>';
    document.body.appendChild(ov);
    return ov;
  }

  function oeffnen(id) {
    var ov = document.getElementById(id);
    if (!ov) return;
    ov.classList.add('show');
    document.body.classList.add('overlay-offen');
    // Siehe gallery.js der Schwesterprojekte: body{overflow:hidden} allein
    // reicht auf iOS nicht, Safari scrollt per Touch weiter.
    _scrollPos = window.scrollY;
    document.body.style.position = 'fixed';
    document.body.style.top = -_scrollPos + 'px';
    document.body.style.left = '0';
    document.body.style.right = '0';
    document.body.style.width = '100%';
  }

  var _scrollPos = 0;

  function schliessen(id) {
    var ov = document.getElementById(id);
    if (ov) ov.classList.remove('show');
    document.body.classList.remove('overlay-offen');
    document.body.style.position = '';
    document.body.style.top = '';
    document.body.style.left = '';
    document.body.style.right = '';
    document.body.style.width = '';
    window.scrollTo(0, _scrollPos);
  }

  document.addEventListener('keydown', function (e) {
    if (e.key !== 'Escape') return;
    var offen = document.querySelector('.guide-overlay.show');
    if (offen) schliessen(offen.id);
  });

  // ===========================================================================
  // Glossar
  // ===========================================================================

  var _katFilter = '';

  function glossarOeffnen(suchbegriff) {
    overlay('ov-glossar', 'Glossar',
      '<div class="glossar-leiste">'
      + '<input type="search" id="glossarSuche" placeholder="Begriff suchen..."'
      + ' oninput="glossarFiltern()" autocomplete="off">'
      + '<div class="glossar-kategorien" id="glossarKategorien"></div>'
      + '<div class="glossar-zahl" id="glossarZahl"></div></div>'
      + '<div id="glossarInhalt"><p>Wird geladen...</p></div>');
    oeffnen('ov-glossar');

    Glossar.laden().then(function () {
      baueKategorien();
      var feld = document.getElementById('glossarSuche');
      if (feld && suchbegriff) feld.value = suchbegriff;
      filtern();
      if (feld && !suchbegriff) feld.focus();
    }).catch(function (err) {
      var ziel = document.getElementById('glossarInhalt');
      if (ziel) {
        ziel.innerHTML = '<div class="warning-box"><strong>Glossar nicht verf&uuml;gbar.</strong> '
          + esc(err.message) + '</div>';
      }
    });
  }

  function baueKategorien() {
    var ziel = document.getElementById('glossarKategorien');
    if (!ziel || ziel.dataset.gebaut) return;
    var kats = Glossar.kategorien();
    ziel.innerHTML = '<button type="button" class="glossar-kat aktiv" data-kat=""'
      + ' onclick="glossarKategorie(\'\')">Alle</button>'
      + kats.map(function (k) {
          return '<button type="button" class="glossar-kat" data-kat="' + esc(k.titel) + '"'
            + ' onclick="glossarKategorie(\'' + esc(k.titel).replace(/'/g, "\\'") + '\')">'
            + esc(k.titel) + '</button>';
        }).join('');
    ziel.dataset.gebaut = '1';
  }

  function kategorieWaehlen(titel) {
    _katFilter = titel;
    var knoepfe = document.querySelectorAll('.glossar-kat');
    for (var i = 0; i < knoepfe.length; i++) {
      knoepfe[i].classList.toggle('aktiv', knoepfe[i].dataset.kat === titel);
    }
    filtern();
  }

  function filtern() {
    var feld = document.getElementById('glossarSuche');
    var ziel = document.getElementById('glossarInhalt');
    var zahl = document.getElementById('glossarZahl');
    if (!ziel) return;

    var q = feld ? feld.value : '';
    var treffer = Glossar.suchen(q, _katFilter);

    if (zahl) {
      zahl.textContent = treffer.length + ' von ' + Glossar.eintraege().length + ' Begriffen';
    }

    if (!treffer.length) {
      ziel.innerHTML = '<p style="color:var(--text-light);">Kein Begriff gefunden.</p>';
      return;
    }

    ziel.innerHTML = treffer.map(function (e) {
      return '<article class="glossar-eintrag" id="gl-' + esc(schluessel(e.begriff)) + '">'
        + '<h3>' + esc(e.begriff) + '</h3>'
        + '<div class="glossar-kat-marke">' + esc(e.kategorie) + '</div>'
        + markdown(e.text) + '</article>';
    }).join('');
  }

  function schluessel(begriff) {
    return String(begriff).toLowerCase()
      .replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
  }

  // ===========================================================================
  // Nachschlagekarte
  // ===========================================================================

  function referenzOeffnen() {
    var r = Referenz.REFERENZ;
    var inhalt = '<p style="color:var(--text-light);font-size:0.78rem;">'
      + esc(r.untertitel) + '</p>'
      + '<input type="search" id="referenzSuche" placeholder="Filtern..."'
      + ' oninput="referenzFiltern()" autocomplete="off"'
      + ' style="width:100%;padding:0.5rem;margin:0.6rem 0;border:1px solid var(--border);'
      + 'border-radius:6px;background:var(--input-bg);font-size:0.82rem;min-height:40px;">'
      + r.gruppen.map(function (g) {
          return '<section class="ref-gruppe" id="' + esc(g.id) + '">'
            + '<h3>' + esc(g.titel) + '</h3>'
            + (g.hinweis ? '<div class="info-box">' + esc(g.hinweis) + '</div>' : '')
            + '<table class="data-table"><tr>'
            + g.spalten.map(function (s) { return '<th>' + esc(s) + '</th>'; }).join('')
            + '</tr>'
            + g.zeilen.map(function (z) {
                return '<tr class="ref-zeile">'
                  + z.map(function (c, i) {
                      return '<td' + (i === 0 ? ' style="font-weight:600;"' : '') + '>'
                        + esc(c) + '</td>';
                    }).join('') + '</tr>';
              }).join('')
            + '</table></section>';
        }).join('')
      + '<p id="referenzLeer" style="display:none;color:var(--text-light);">Kein Treffer.</p>';

    overlay('ov-referenz', r.titel, inhalt);
    oeffnen('ov-referenz');
    var feld = document.getElementById('referenzSuche');
    if (feld) { feld.value = ''; referenzFiltern(); }
  }

  function referenzFiltern() {
    var feld = document.getElementById('referenzSuche');
    var q = (feld ? feld.value : '').trim().toLowerCase();
    var gruppen = document.querySelectorAll('#ov-referenz .ref-gruppe');
    var gesamt = 0;

    for (var i = 0; i < gruppen.length; i++) {
      var zeilen = gruppen[i].querySelectorAll('.ref-zeile');
      var sichtbar = 0;
      for (var j = 0; j < zeilen.length; j++) {
        var treffer = !q || zeilen[j].textContent.toLowerCase().indexOf(q) > -1;
        zeilen[j].style.display = treffer ? '' : 'none';
        if (treffer) sichtbar++;
      }
      // Eine Gruppe ohne Treffer verschwindet mit - sonst blieben leere
      // Ueberschriften stehen.
      gruppen[i].style.display = sichtbar ? '' : 'none';
      gesamt += sichtbar;
    }
    var leer = document.getElementById('referenzLeer');
    if (leer) leer.style.display = gesamt ? 'none' : '';
  }

  // ===========================================================================
  // Suche auf der Seite
  // ===========================================================================

  var _marken = [];
  var _markeIdx = 0;

  function markenEntfernen() {
    for (var i = 0; i < _marken.length; i++) {
      var m = _marken[i];
      if (!m.parentNode) continue;
      m.parentNode.replaceChild(document.createTextNode(m.textContent), m);
    }
    _marken = [];
    _markeIdx = 0;
  }

  /**
   * Hebt Treffer im Inhalt hervor.
   *
   * Rueckwaerts durch die Textknoten, damit die gesammelten Positionen
   * gueltig bleiben: wer von vorn ersetzt, verschiebt alles dahinter.
   */
  function suchen(text) {
    markenEntfernen();
    var q = String(text || '').trim();
    var nav = document.getElementById('sucheNav');
    var zahl = document.getElementById('sucheZahl');

    if (q.length < 2) {
      if (nav) nav.style.display = 'none';
      return 0;
    }

    var wurzel = document.getElementById('mainContent') || document.body;
    var walker = document.createTreeWalker(wurzel, NodeFilter.SHOW_TEXT, {
      acceptNode: function (n) {
        var el = n.parentElement;
        if (!el) return NodeFilter.FILTER_REJECT;
        var tag = el.tagName;
        if (tag === 'SCRIPT' || tag === 'STYLE' || tag === 'TEXTAREA') {
          return NodeFilter.FILTER_REJECT;
        }
        return n.nodeValue.toLowerCase().indexOf(q.toLowerCase()) > -1
          ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_REJECT;
      }
    });

    var knoten = [];
    var k;
    while ((k = walker.nextNode())) knoten.push(k);

    for (var i = knoten.length - 1; i >= 0; i--) {
      var n = knoten[i];
      var txt = n.nodeValue;
      var pos = txt.toLowerCase().lastIndexOf(q.toLowerCase());
      while (pos > -1) {
        try {
          var bereich = document.createRange();
          bereich.setStart(n, pos);
          bereich.setEnd(n, pos + q.length);
          var mark = document.createElement('mark');
          mark.className = 'suche-treffer';
          bereich.surroundContents(mark);
          _marken.unshift(mark);
        } catch (e) { /* kaputter Bereich - weiter */ }
        pos = pos > 0 ? txt.toLowerCase().lastIndexOf(q.toLowerCase(), pos - 1) : -1;
      }
    }

    if (nav) nav.style.display = _marken.length ? 'flex' : 'none';
    if (zahl) zahl.textContent = _marken.length ? '1 / ' + _marken.length : 'kein Treffer';
    if (_marken.length) springen(0);
    return _marken.length;
  }

  function springen(idx) {
    if (!_marken.length) return;
    _markeIdx = ((idx % _marken.length) + _marken.length) % _marken.length;
    for (var i = 0; i < _marken.length; i++) {
      _marken[i].classList.toggle('aktiv', i === _markeIdx);
    }
    var ziel = _marken[_markeIdx];

    // Eingeklappte Abschnitte aufklappen, sonst springt man ins Nichts.
    var koerper = ziel.closest('.section-body');
    if (koerper && koerper.classList.contains('collapsed')) {
      koerper.classList.remove('collapsed');
      var kopf = koerper.previousElementSibling;
      if (kopf && kopf.classList.contains('section-header')) {
        kopf.classList.remove('collapsed');
      }
    }
    ziel.scrollIntoView({ behavior: 'smooth', block: 'center' });

    var zahl = document.getElementById('sucheZahl');
    if (zahl) zahl.textContent = (_markeIdx + 1) + ' / ' + _marken.length;
  }

  var _sucheTimer = null;
  function sucheEingabe() {
    clearTimeout(_sucheTimer);
    var feld = document.getElementById('sucheFeld');
    _sucheTimer = setTimeout(function () { suchen(feld ? feld.value : ''); }, 200);
  }

  function sucheLeeren() {
    var feld = document.getElementById('sucheFeld');
    if (feld) feld.value = '';
    markenEntfernen();
    var nav = document.getElementById('sucheNav');
    if (nav) nav.style.display = 'none';
  }

  function sucheTaste(e) {
    if (e.key === 'Enter') { e.preventDefault(); springen(_markeIdx + (e.shiftKey ? -1 : 1)); }
    else if (e.key === 'Escape') sucheLeeren();
  }

  // Strg+F auf das eigene Feld lenken. Wer die Browsersuche will, nimmt sie
  // ein zweites Mal - der Browser gibt sie frei, sobald das Feld leer ist.
  document.addEventListener('keydown', function (e) {
    if (!(e.ctrlKey || e.metaKey) || e.key.toLowerCase() !== 'f') return;
    var feld = document.getElementById('sucheFeld');
    if (!feld) return;
    e.preventDefault();
    feld.focus();
    feld.select();
  });

  // ===========================================================================
  // Knopfstapel
  // ===========================================================================

  function stapelBauen() {
    if (document.querySelector('.fab-stack')) return;
    var div = document.createElement('div');
    div.className = 'fab-stack';
    div.innerHTML =
        '<button type="button" class="fab-btn glossar" onclick="glossarOeffnen()"'
      + ' title="Glossar" aria-label="Glossar">&#128214;</button>'
      + '<button type="button" class="fab-btn referenz" onclick="referenzOeffnen()"'
      + ' title="Konventionen" aria-label="Konventionen">&#128208;</button>';
    document.body.appendChild(div);
  }

  function init() {
    stapelBauen();
    // Glossar im Hintergrund laden, damit das Overlay sofort steht. Ein
    // Fehlschlag faellt hier nicht auf - erst beim Oeffnen, und dort gehoert
    // er hin.
    if (typeof Glossar !== 'undefined') Glossar.laden().catch(function () {});
  }

  global.glossarOeffnen = glossarOeffnen;
  global.glossarFiltern = filtern;
  global.glossarKategorie = kategorieWaehlen;
  global.referenzOeffnen = referenzOeffnen;
  global.referenzFiltern = referenzFiltern;
  global.nachschlagenSchliessen = schliessen;
  global.sucheEingabe = sucheEingabe;
  global.sucheLeeren = sucheLeeren;
  global.sucheTaste = sucheTaste;
  global.sucheSpringen = function (d) { springen(_markeIdx + d); };
  global.Nachschlagen = {
    markdown: markdown,
    suchen: suchen,
    treffer: function () { return _marken.length; },
    schluessel: schluessel
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})(typeof window !== 'undefined' ? window : globalThis);
