/**
 * uebersicht.js - die eine Frage, die die Startseite beantworten muss.
 *
 * "Ist das Fahrzeug rennstreckenbereit?"
 *
 * Der Fortschritt zaehlt die Werkstattphasen 0 bis 18 - sie haben einen
 * Endzustand. Die Streckenphasen 19 bis 22 sind ein Regelkreis und bekommen
 * keinen Balken.
 *
 * Der Balken kann zurueckfallen. Das ist der Unterschied zu den
 * Schwesterprojekten: ein Motor, der zusammengebaut ist, bleibt
 * zusammengebaut. Wer Camber verstellt, macht die Toe-Messung ungueltig, und
 * ein Balken, der danach auf 100 Prozent stehen bliebe, wuerde genau bei der
 * Frage luegen, wegen der man hinschaut.
 */
(function () {
    'use strict';

    function esc(s) {
        return String(s == null ? '' : s)
            .replace(/&/g, '&amp;').replace(/</g, '&lt;')
            .replace(/>/g, '&gt;').replace(/"/g, '&quot;');
    }

    function nameVon(g) {
        return String(g).split('_').map(function (t) {
            return t.charAt(0).toUpperCase() + t.slice(1);
        }).join(' ');
    }

    function zeichne() {
        if (typeof Status === 'undefined' || typeof Recheck === 'undefined') return;

        var f = Status.fortschritt();
        var r = Status.rennstreckenbereit();

        // ---- Balken ----
        var fill = document.getElementById('overallFill');
        if (fill) {
            fill.style.width = f.prozent + '%';
            // Violett statt gruen, sobald etwas veraltet ist: dieselbe Farbe
            // wie die Marke an der Phase, damit der Zusammenhang sichtbar ist.
            fill.classList.toggle('progress-stale', f.veraltet > 0);
        }
        var txt = document.getElementById('overallText');
        if (txt) {
            var teile = [f.prozent + ' %', f.erledigt + ' von ' + f.gesamt + ' Phasen erledigt'];
            if (f.wip) teile.push(f.wip + ' in Arbeit');
            if (f.veraltet) teile.push(f.veraltet + ' veraltet');
            txt.textContent = teile.join(' \u00b7 ');
        }

        // ---- Aussage ----
        var box = document.getElementById('bereitAussage');
        if (box) {
            if (r.bereit) {
                box.innerHTML = '<div class="info-box" style="border-left-color:var(--success);">'
                    + '<strong>Rennstreckenbereit.</strong> Alle Werkstattphasen sind '
                    + 'abgeschlossen, keine ist durch eine sp&auml;tere &Auml;nderung ung&uuml;ltig '
                    + 'geworden.</div>';
            } else if (f.erledigt === 0 && f.wip === 0) {
                // Kein Fortschritt heisst nicht "nicht bereit", sondern
                // "noch nichts erfasst". Das ist eine andere Aussage.
                box.innerHTML = '<div class="info-box">'
                    + '<strong>Noch nichts erfasst.</strong> Der Status der Phasen wird in der '
                    + '<a href="werkstatt.html">Werkstatt</a> gesetzt.</div>';
            } else {
                box.innerHTML = '<div class="warning-box">'
                    + '<strong>Nicht rennstreckenbereit.</strong> ' + esc(r.grund.join(', '))
                    + '.</div>';
            }
        }

        // ---- Was genau veraltet ist ----
        var liste = document.getElementById('veraltetListe');
        if (!liste) return;

        var betroffen = Status.uebersicht().filter(function (p) {
            return p.veraltet || p.mitmessen;
        });
        if (!betroffen.length) { liste.innerHTML = ''; return; }

        liste.innerHTML = betroffen.map(function (p) {
            var grund = p.wegen.map(function (w) {
                return esc(nameVon(w.groesse)) + ' \u2192 ' + esc(w.art);
            }).join(', ');
            return '<div class="spec-item">'
                + '<span class="spec-label">'
                + '<a href="werkstatt.html#sec-' + esc(p.id) + '">'
                + p.nr + '. ' + esc(p.titel) + '</a></span>'
                + '<span class="spec-value" style="font-weight:400;">' + grund + '</span>'
                + '</div>';
        }).join('');
    }

    window.uebersichtZeichnen = zeichne;

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', zeichne);
    } else {
        zeichne();
    }
})();
