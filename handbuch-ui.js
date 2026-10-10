/**
 * handbuch-ui.js - die Kapitel lesen.
 *
 * Zwei Ansichten in einer Seite:
 *
 *   ohne ?d=   Inhaltsverzeichnis nach Ebenen
 *   mit  ?d=   das Kapitel, mit Sprungmarken
 *
 * Der Parameter in der Adresse statt eines Zustands im Speicher: so laesst
 * sich ein Kapitel verlinken, und die Querverweise im Handbuch - es gibt
 * ueber hundert - funktionieren ohne Sonderbehandlung.
 */
(function () {
  'use strict';

  function esc(s) {
    return String(s == null ? '' : s)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;')
      .replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }

  function parameter() {
    var m = location.search.match(/[?&]d=([^&]+)/);
    return m ? decodeURIComponent(m[1]) : '';
  }

  function kapitelLink(datei) {
    return 'handbuch.html?d=' + encodeURIComponent(datei);
  }

  // ==== Inhaltsverzeichnis ====

  function verzeichnis() {
    var ziel = document.getElementById('hbInhalt');
    if (!ziel) return;

    document.title = 'Handbuch \u2013 Mustang 1966 Chassis Setup';

    ziel.innerHTML = Kapitel.EBENEN.map(function (e) {
      var dateien = Kapitel.proEbene(e.id);
      if (!dateien.length) return '';

      var eintraege = dateien.map(function (d) {
        var k = Kapitel.geladen(d.datei);
        var titel = k ? k.titel : d.datei;
        var rolle = k ? k.rolle : '';

        // Die drei Autoritaeten tragen ihren Rang: bei Widerspruch gilt
        // CONVENTIONS vor 00_PROJECT vor 02_WORKFLOW (01_ARCHITECTURE 2).
        var marke = d.rang
          ? '<span class="marke marke-fertig" title="Autorit\u00e4t Rang '
            + d.rang + ' \u2013 gilt bei Widerspruch">' + d.rang + '</span>'
          : (d.historisch
              ? '<span class="marke marke-info" title="beschreibt einen fr\u00fcheren oder'
                + ' vor\u00fcbergehenden Stand">historisch</span>'
              : '');

        return '<a class="hb-eintrag" href="' + esc(kapitelLink(d.datei)) + '">'
          + '<span class="hb-titel">' + esc(titel) + marke + '</span>'
          + (rolle ? '<span class="hb-rolle">' + esc(rolle) + '</span>' : '')
          + '</a>';
      }).join('');

      return '<div class="section" id="sec-ebene-' + esc(e.id) + '">'
        + '<div class="section-header" onclick="toggleSection(this)">'
        + '<span class="section-icon">' + e.nr + '</span>'
        + '<h2>' + esc(e.titel) + '</h2></div>'
        + '<div class="section-body">'
        + '<p class="hb-frage">' + esc(e.frage) + '</p>'
        + eintraege + '</div></div>';
    }).join('')
    + '<div class="info-box">Die Leserichtung ist <strong>nicht</strong> zwingend '
    + 'von oben nach unten. Wer ein konkretes Problem hat, beginnt in Ebene 3 und '
    + 'geht nach oben, um es zu verstehen.</div>';
  }

  // ==== Ein Kapitel ====

  function kapitel(datei) {
    var ziel = document.getElementById('hbInhalt');
    if (!ziel) return;

    ziel.innerHTML = '<p style="color:var(--text-light);">Wird geladen\u2026</p>';

    Kapitel.laden(datei).then(function (k) {
      document.title = k.titel + ' \u2013 Mustang 1966 Chassis Setup';

      var ueberschriften = [];
      var html = Markdown.rendern(k.text, {
        ueberschriften: ueberschriften,
        kapitelLink: kapitelLink
      });

      // Inhaltsverzeichnis nur bei laengeren Kapiteln - bei vier
      // Ueberschriften ist es laenger als nuetzlich.
      var toc = '';
      var h2 = ueberschriften.filter(function (u) { return u.stufe === 2; });
      if (h2.length >= 5) {
        toc = '<details class="hb-toc"><summary>Inhalt \u2013 ' + h2.length
          + ' Abschnitte</summary><ul>'
          + h2.map(function (u) {
              return '<li><a href="#' + esc(u.anker) + '">' + esc(u.text) + '</a></li>';
            }).join('')
          + '</ul></details>';
      }

      var e = Kapitel.ebene(k.ebene);
      var eintrag = Kapitel.eintrag(datei);

      ziel.innerHTML =
          '<div class="hb-kopf">'
        + '<a class="hb-zurueck" href="handbuch.html">&#8249; Alle Kapitel</a>'
        + '<div class="hb-pfad">' + esc(e ? e.titel : '') + '</div>'
        + '<h1>' + esc(k.titel) + '</h1>'
        + (k.rolle ? '<p class="hb-rolle">' + esc(k.rolle) + '</p>' : '')
        + (eintrag && eintrag.historisch
            ? '<div class="warning-box">Dieses Dokument beschreibt einen fr\u00fcheren '
              + 'oder vor\u00fcbergehenden Stand. Es ist <strong>nicht</strong> die '
              + 'Beschreibung des heutigen Fahrzeugs.</div>'
            : '')
        + (eintrag && eintrag.rang
            ? '<div class="info-box">Autorit\u00e4t Rang ' + eintrag.rang
              + ': Bei Widerspruch zu anderen Dateien gilt diese hier.</div>'
            : '')
        + '</div>'
        + toc
        + '<article class="hb-text">' + html + '</article>'
        + '<div class="hb-fuss"><a class="hb-zurueck" href="handbuch.html">'
        + '&#8249; Alle Kapitel</a></div>';

      // Sprungmarke aus der Adresse nachziehen - beim Laden gab es das Ziel
      // noch nicht.
      if (location.hash) {
        var el = document.getElementById(location.hash.slice(1));
        if (el) setTimeout(function () { el.scrollIntoView({ block: 'start' }); }, 60);
      }
    }).catch(function (err) {
      ziel.innerHTML = '<div class="warning-box"><strong>Kapitel nicht verf\u00fcgbar.</strong> '
        + esc(err.message) + '</div>'
        + '<a class="hb-zurueck" href="handbuch.html">&#8249; Alle Kapitel</a>';
    });
  }

  function zeichnen() {
    var d = parameter();
    if (d && Kapitel.eintrag(d)) kapitel(d);
    else verzeichnis();
  }

  function init() {
    if (typeof Kapitel === 'undefined' || typeof Markdown === 'undefined') return;
    zeichnen();
    // Kopfdaten fuer das Verzeichnis nachladen; danach einmal neu zeichnen,
    // damit Titel und Rolle erscheinen.
    if (!parameter()) {
      Kapitel.alleLaden().then(function () { if (!parameter()) verzeichnis(); });
    } else {
      Kapitel.alleLaden().catch(function () {});
    }
  }

  window.handbuchZeichnen = zeichnen;

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
