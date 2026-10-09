/**
 * werkstatt.js - Darstellung der Werkstattphasen.
 *
 * Die Phasen kommen aus recheck.js, nicht aus dem Markup und nicht aus einer
 * zweiten Liste hier. In den Schwesterprojekten steht die Phasenliste im HTML
 * und wird von dort gelesen; hier geht es umgekehrt, weil dieselbe Liste auch
 * die Abhaengigkeiten traegt.
 *
 * Wird am Seitenende geladen, nicht im <head>: der erste Aufruf braucht das
 * fertige DOM. In jericos search.js hat ein zu frueher Aufruf eine Exception
 * geworfen, die den Rest der Initialisierung mit abgeraeumt hat.
 */
(function () {
    'use strict';

    function esc(s) {
        return String(s == null ? '' : s)
            .replace(/&/g, '&amp;').replace(/</g, '&lt;')
            .replace(/>/g, '&gt;').replace(/"/g, '&quot;');
    }

    /** Lesbarer Name einer Groesse: camber -> Camber, ride_height -> Ride Height */
    function nameVon(g) {
        return String(g).split('_').map(function (t) {
            return t.charAt(0).toUpperCase() + t.slice(1);
        }).join(' ');
    }

    function zeit(ms) {
        var d = new Date(ms);
        function zz(n) { return (n < 10 ? '0' : '') + n; }
        return zz(d.getDate()) + '.' + zz(d.getMonth() + 1) + '.' + d.getFullYear()
             + ', ' + zz(d.getHours()) + ':' + zz(d.getMinutes());
    }

    // ==== Auswahlliste der Eingriffe ====

    function baueAuswahl() {
        var sel = document.getElementById('eingriffGroesse');
        if (!sel || sel.dataset.gebaut) return;

        // Nur Groessen, die links in der Matrix stehen - nur die haben eine
        // Wirkung. Alles andere waere ein Knopf, der nichts tut.
        var gesehen = {};
        var html = ['<option value="">&ndash; bitte w&auml;hlen &ndash;</option>'];
        for (var i = 0; i < Recheck.MATRIX.length; i++) {
            var g = Recheck.MATRIX[i].groesse;
            if (gesehen[g]) continue;
            gesehen[g] = true;
            html.push('<option value="' + esc(g) + '">' + esc(Recheck.MATRIX[i].zeile) + '</option>');
        }
        sel.innerHTML = html.join('');
        sel.dataset.gebaut = '1';
        sel.addEventListener('change', zeigeWirkung);
    }

    /**
     * Vorschau: was passiert, wenn ich das eintrage?
     *
     * Ohne sie waere der Knopf eine Blackbox - man traegt etwas ein und sieht
     * erst danach, dass zehn Phasen rot werden.
     */
    function zeigeWirkung() {
        var sel = document.getElementById('eingriffGroesse');
        var box = document.getElementById('eingriffWirkung');
        if (!sel || !box) return;

        if (!sel.value) { box.style.display = 'none'; return; }

        var f = Recheck.phasenNach(sel.value);
        var teile = [];
        if (f.veraltet.length) {
            teile.push('<strong>' + f.veraltet.length + ' Phase(n) neu messen:</strong> '
                + f.veraltet.map(function (p) { return p.nr + ' ' + esc(p.titel); }).join(', '));
        }
        if (f.mitmessen.length) {
            teile.push('<strong>' + f.mitmessen.length + ' mitmessen:</strong> '
                + f.mitmessen.map(function (p) { return p.nr; }).join(', '));
        }
        if (f.hinweis.length) {
            teile.push('ggf. betroffen: ' + f.hinweis.map(function (p) { return p.nr; }).join(', '));
        }
        box.innerHTML = teile.length ? teile.join('<br>') : 'Keine Phase betroffen.';
        box.style.display = '';
    }

    function eingriffEintragen() {
        var sel = document.getElementById('eingriffGroesse');
        var notiz = document.getElementById('eingriffNotiz');
        if (!sel || !sel.value) {
            showToast('Bitte eine Gr&ouml;&szlig;e w&auml;hlen', { sticky: true, isError: true });
            return;
        }
        Status.eintragen(sel.value, notiz ? notiz.value.trim() : '');
        if (notiz) notiz.value = '';
        sel.value = '';
        zeigeWirkung();
        zeichneAlles();
    }

    // ==== Journal ====

    function zeichneJournal() {
        var ziel = document.getElementById('journalListe');
        if (!ziel) return;
        var eintraege = Status.journal();

        if (!eintraege.length) {
            ziel.innerHTML = '<p style="font-size:0.8rem;color:var(--text-light);">'
                + 'Noch keine &Auml;nderung eingetragen.</p>';
            return;
        }
        ziel.innerHTML = eintraege.map(function (e) {
            return '<div class="spec-item">'
                + '<span class="spec-label">' + zeit(e.zeit) + '</span>'
                + '<span class="spec-value">' + esc(nameVon(e.groesse))
                + (e.notiz ? ' <span style="font-weight:400;color:var(--text-light);">' + esc(e.notiz) + '</span>' : '')
                + ' <button type="button" class="fx-del" onclick="journalZuruecknehmen(\'' + esc(e.id) + '\')"'
                + ' title="Zur&uuml;cknehmen" style="border:none;background:none;color:var(--danger);cursor:pointer;font-size:1rem;padding:0 0.3rem;">&times;</button>'
                + '</span></div>';
        }).join('');
    }

    function journalZuruecknehmen(id) {
        if (!confirm('Diesen Eintrag zur\u00fccknehmen?')) return;
        Status.zuruecknehmen(id);
        zeichneAlles();
    }

    // ==== Phasen ====

    function zeichnePhasen() {
        var ziel = document.getElementById('phasenListe');
        if (!ziel) return;

        // Welche Abschnitte stehen offen? Das Neuzeichnen baut die Liste
        // vollstaendig neu auf; ohne diese Sicherung klappte eine aufgeklappte
        // Phase beim Setzen ihres Status wieder zu - und zwar genau die, an
        // der man gerade arbeitet.
        var offen = {};
        var koerper = ziel.querySelectorAll('.section[id^="sec-phase"] .section-body');
        for (var o = 0; o < koerper.length; o++) {
            if (!koerper[o].classList.contains('collapsed')) {
                offen[koerper[o].parentElement.id] = true;
            }
        }

        ziel.innerHTML = Status.uebersicht().map(function (p) {
            var marke = '';
            if (p.veraltet) {
                marke = '<span class="src" style="background:#e9d8fd;color:#44337a;">veraltet</span>';
            } else if (p.mitmessen) {
                marke = '<span class="src src-d">mitmessen</span>';
            }

            // event.stopPropagation() im onclick, nicht als nachtraeglich
            // gebundener Listener: der Knopf liegt im section-header, und
            // dessen onclick klappt die Sektion um.
            //
            // Ein zweiter Mechanismus - das Sichern des Klappzustands weiter
            // oben - faengt den Schaden zwar ohnehin auf. Dann haengt die
            // Bedienung aber an zwei Stellen, von denen eine stillschweigend
            // ausfallen kann. Die Ursache gehoert behoben, nicht die Wirkung.
            var knopf = '<button type="button" class="step-status" data-phase="' + esc(p.id) + '"'
                + ' value="' + esc(p.stufe) + '" onclick="event.stopPropagation();phaseWeiter(this)"'
                + ' title="' + esc(Status.label(p.stufe)) + '"></button>';

            var inhalt = [];
            if (p.liefert.length) {
                inhalt.push('<div class="spec-item"><span class="spec-label">Legt fest</span>'
                    + '<span class="spec-value" style="font-weight:400;">'
                    + p.liefert.map(nameVon).map(esc).join(', ') + '</span></div>');
            } else {
                inhalt.push('<div class="info-box">Diese Phase erzeugt keinen eigenen Messwert '
                    + '&ndash; sie kann abgeschlossen sein, aber nicht veralten.</div>');
            }

            if (p.wegen.length) {
                var zeilen = p.wegen.map(function (w) {
                    return esc(nameVon(w.groesse)) + ' ge&auml;ndert am ' + zeit(w.zeit)
                        + ' &rarr; ' + esc(w.art) + ': ' + w.felder.map(nameVon).map(esc).join(', ');
                });
                inhalt.push('<div class="' + (p.veraltet ? 'warning-box' : 'info-box') + '">'
                    + zeilen.join('<br>') + '</div>');
            }

            var zu = offen['sec-' + p.id] ? '' : ' collapsed';

            return '<div class="section" id="sec-' + esc(p.id) + '">'
                + '<div class="section-header' + zu + '" onclick="toggleSection(this)">'
                + knopf
                + '<h2>' + p.nr + '. ' + esc(p.titel) + '</h2>' + marke
                + '</div>'
                + '<div class="section-body' + zu + '">' + inhalt.join('') + '</div>'
                + '</div>';
        }).join('');

    }

    function phaseWeiter(btn) {
        var id = btn.dataset.phase;
        Status.setzen(id, Status.naechste(btn.value));
        zeichneAlles();
    }

    function zeichneAlles() {
        zeichneJournal();
        zeichnePhasen();
    }

    // Felder melden ihre Groesse selbst - der Lauscher dazu steht in
    // status.js, weil er zu ausFeld() gehoert und nicht zu dieser Seite.
    // Hier wird nur die Anzeige nachgezogen.
    document.addEventListener('status-geaendert', zeichneAlles);

    function init() {
        if (typeof Recheck === 'undefined' || typeof Status === 'undefined') return;
        baueAuswahl();
        zeichneAlles();
    }

    window.eingriffEintragen = eingriffEintragen;
    window.journalZuruecknehmen = journalZuruecknehmen;
    window.phaseWeiter = phaseWeiter;
    window.werkstattZeichnen = zeichneAlles;

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
