/**
 * bind-warnung.js - der Bind-Befund dort, wo er nicht gerechnet wird.
 *
 * bind.html zeigt den vollen Befund. Werkstatt und Uebersicht zeigen ihn
 * nicht - und genau dort wird gearbeitet. Projektregel 1 aus Kapitel 8:
 * "Vor jeder Setup-Session: Reproduzierbarkeitstest nach 6.1. Ohne
 * bestandenen Test keine Zehntelarbeit."
 *
 * Gerechnet wird mit bind.js auf denselben gespeicherten Werten, die auch
 * bind.html liest. Der Befund wird nicht abgeschrieben und nicht gespeichert
 * (Arbeitsregel 4): es gibt keinen zweiten Stand, der auseinanderlaufen
 * koennte.
 *
 * Gibt es keine Felder auf der Seite, wird trotzdem gerechnet - der Befund
 * haengt an den Werten, nicht am Markup.
 *
 * Wird am Seitenende geladen, wie werkstatt.js und uebersicht.js: der erste
 * Aufruf braucht das fertige DOM.
 */
(function () {
  'use strict';

  var ZIEL = 'bindWarnung';

  function esc(s) {
    return String(s == null ? '' : s)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;')
      .replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }

  function zeichne() {
    var ziel = document.getElementById(ZIEL);
    if (!ziel) return;
    if (typeof Bind === 'undefined' || typeof FieldSync === 'undefined') return;

    // Eine Stelle fuer den Befund: Status.bindStand() - dort steht auch, dass
    // eine Panhard-Aenderung einen bestandenen Test ueberholt (v23).
    var bf = (typeof Status !== 'undefined' && Status.bindStand)
      ? Status.bindStand() : Bind.befund(FieldSync.lesen());

    // Bestanden heisst: der Test nach 6.1 ist vollstaendig (drei Durchgaenge)
    // und keine der beiden Schwellen ist gerissen. Nur dann schweigt die
    // Anzeige - ein nicht durchgefuehrter Test ist nicht dasselbe
    // (Arbeitsregel 9) und wird unten eigens gemeldet.
    if (bf.geprueft && !bf.sperrt) {
      ziel.innerHTML = '';
      ziel.hidden = true;
      return;
    }
    ziel.hidden = false;

    if (bf.sperrt) {
      ziel.innerHTML = '<div class="warning-box">'
        + '<strong>&#9878; Bind-Befund &ndash; keine Setup-Arbeit</strong>'
        + '<div style="margin-top:0.3rem;">Projektregel 1: ohne bestandenen '
        + 'Reproduzierbarkeitstest keine Zehntelarbeit. Gefunden wurde:</div>'
        + '<ul style="margin:0.3rem 0 0 1.2rem;">'
        + bf.gruende.map(function (g) { return '<li>' + esc(g) + '</li>'; }).join('')
        + '</ul>'
        + '<div style="margin-top:0.3rem;"><a href="bind.html">Zur Bind-Diagnose</a></div>'
        + '</div>';
      return;
    }

    if (bf.ueberholt && bf.ueberholt.length) {
      ziel.innerHTML = '<div class="warning-box">'
        + '<strong>&#9878; Bind-Test wiederholen</strong>'
        + '<div style="margin-top:0.3rem;">Der Panhard wurde nach dem letzten Test ge&auml;ndert. '
        + 'Eine falsche Panhard-L&auml;nge erzeugt Bind &ndash; der Test nach 6.1 gilt erst wieder, '
        + 'wenn er danach wiederholt wurde.</div>'
        + '<div style="margin-top:0.3rem;"><a href="bind.html">Zur Bind-Diagnose</a></div>'
        + '</div>';
      return;
    }

    ziel.innerHTML = '<div class="info-box">'
      + 'Der Bind-Test nach 6.1 ist <strong>noch nicht durchgef&uuml;hrt</strong>. '
      + 'Solange gilt nicht &bdquo;kein Bind&ldquo;, sondern &bdquo;unbekannt&ldquo; '
      + '&ndash; Projektregel 1 verlangt den bestandenen Test vor der Setup-Arbeit. '
      + '<a href="bind.html">Zur Bind-Diagnose</a>'
      + '</div>';
  }

  window.bindWarnungZeichnen = zeichne;

  // Neue Bind-Messwerte von einem anderen Geraet.
  document.addEventListener('daten-abgeglichen', zeichne);

  // Ein Reiter, der im Hintergrund stand, kann inzwischen einen anderen Stand
  // haben - der Befund wird aus dem Speicher gerechnet und ist damit aktuell.
  window.addEventListener('focus', zeichne);

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', zeichne);
  } else {
    zeichne();
  }
})();
