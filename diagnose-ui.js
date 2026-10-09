/**
 * diagnose-ui.js - Darstellung der Diagnoseseite.
 *
 * Das Besondere gegenueber der Werkstattseite: hier wird eine Reihenfolge
 * erzwungen. Solange eine Stufe der Diagnosehierarchie offen ist, bleibt das
 * Change Impact Sheet gesperrt. Ein Entscheidungsbaum, der die Reihenfolge
 * nur beschreibt, ist ein Nachschlagewerk - erzwingen muss er sie.
 *
 * Was hier NICHT passiert: ein Setupvorschlag. Das Kapitel sagt dazu "Das ist
 * eine Methodik, kein automatischer Setupvorschlag." Die Seite nennt, was
 * zuerst zu pruefen ist, und haelt fest, was getan wurde.
 */
(function () {
    'use strict';

    function esc(s) {
        return String(s == null ? '' : s)
            .replace(/&/g, '&amp;').replace(/</g, '&lt;')
            .replace(/>/g, '&gt;').replace(/"/g, '&quot;');
    }

    function zeit(ms) {
        var d = new Date(ms);
        function zz(n) { return (n < 10 ? '0' : '') + n; }
        return zz(d.getDate()) + '.' + zz(d.getMonth() + 1) + '.' + d.getFullYear()
             + ', ' + zz(d.getHours()) + ':' + zz(d.getMinutes());
    }

    // ==== Symptomauswahl ====

    function baueAuswahl() {
        var sel = document.getElementById('symptomWahl');
        if (!sel || sel.dataset.gebaut) return;

        var html = ['<option value="">&ndash; bitte w&auml;hlen &ndash;</option>'];
        for (var i = 0; i < Diagnose.SYMPTOME.length; i++) {
            var s = Diagnose.SYMPTOME[i];
            html.push('<option value="' + esc(s.code) + '">'
                + esc(s.code) + ' &ndash; ' + esc(s.titel) + '</option>');
        }
        sel.innerHTML = html.join('');
        sel.dataset.gebaut = '1';
        sel.addEventListener('change', zeigeVorschau);

        // Flags stehen neben dem Code, nicht statt seiner: "nur links" ist
        // keine eigene Fehlerart, sondern eine Beobachtung zum selben Symptom.
        var fw = document.getElementById('flagWahl');
        if (fw && !fw.dataset.gebaut) {
            fw.innerHTML = Diagnose.FLAGS.map(function (f) {
                return '<label style="display:block;font-size:0.78rem;margin:0.2rem 0;">'
                    + '<input type="checkbox" class="diag-flag" value="' + esc(f.code) + '"'
                    + ' style="width:20px;height:20px;vertical-align:middle;margin-right:0.4rem;">'
                    + esc(f.titel) + '</label>';
            }).join('');
            fw.dataset.gebaut = '1';
        }
    }

    function zeigeVorschau() {
        var sel = document.getElementById('symptomWahl');
        var box = document.getElementById('symptomVorschau');
        if (!sel || !box) return;
        if (!sel.value) { box.style.display = 'none'; return; }

        var m = Diagnose.matrixFuer(sel.value);
        if (!m) { box.style.display = 'none'; return; }

        box.innerHTML =
              '<strong>Zuerst pr&uuml;fen:</strong> ' + esc(m.erst) + '<br>'
            + '<strong>Danach:</strong> ' + esc(m.danach) + '<br>'
            + '<strong style="color:var(--danger);">Nicht sofort &auml;ndern:</strong> '
            + esc(m.nichtSofort);
        box.style.display = '';
    }

    function hypotheseAnlegen() {
        var sel = document.getElementById('symptomWahl');
        if (!sel || !sel.value) {
            showToast('Bitte ein Symptom w\u00e4hlen', { sticky: true, isError: true });
            return;
        }
        var flags = [];
        var kaesten = document.querySelectorAll('.diag-flag:checked');
        for (var i = 0; i < kaesten.length; i++) flags.push(kaesten[i].value);

        Diagnose.anlegen(sel.value, flags);
        sel.value = '';
        for (var j = 0; j < document.querySelectorAll('.diag-flag').length; j++) {
            document.querySelectorAll('.diag-flag')[j].checked = false;
        }
        zeigeVorschau();
        zeichneAlles();
    }

    // ==== Eine Hypothese ====

    function baueHierarchie(h) {
        var erlaubt = Diagnose.darfAendern(h.id);
        var teile = ['<div class="spec-item"><span class="spec-label">Diagnosehierarchie</span>'
            + '<span class="spec-value" style="font-weight:400;">'
            + (erlaubt.erlaubt ? 'vollst&auml;ndig' : esc(erlaubt.offen.join(', ')) + ' offen')
            + '</span></div>'];

        for (var i = 0; i < Diagnose.HIERARCHIE.length; i++) {
            var s = Diagnose.HIERARCHIE[i];
            var an = !!h.geprueft[s.key];
            teile.push('<label style="display:flex;gap:0.5rem;align-items:flex-start;'
                + 'padding:0.3rem 0;font-size:0.8rem;border-bottom:1px solid var(--border);">'
                + '<input type="checkbox" class="diag-stufe" data-id="' + esc(h.id) + '"'
                + ' data-stufe="' + esc(s.key) + '"' + (an ? ' checked' : '')
                + ' style="width:20px;height:20px;flex-shrink:0;margin-top:0.1rem;">'
                + '<span><strong>' + esc(s.key) + '. ' + esc(s.titel) + '</strong>'
                + '<br><span style="color:var(--text-light);font-size:0.72rem;">'
                + esc(s.punkte.join(' \u00b7 ')) + '</span></span></label>');
        }

        // Die Stop-Regel steht ueber allem anderen - auch ueber einer sauber
        // abgearbeiteten Hierarchie.
        teile.push('<label style="display:flex;gap:0.5rem;align-items:center;'
            + 'margin-top:0.6rem;padding:0.4rem;background:#fff5f5;border-radius:6px;'
            + 'font-size:0.8rem;">'
            + '<input type="checkbox" class="diag-stopp" data-id="' + esc(h.id) + '"'
            + (h.stopp ? ' checked' : '')
            + ' style="width:20px;height:20px;flex-shrink:0;">'
            + '<span><strong>Stop-Regel greift</strong> &ndash; Spiel, Reifenschaden, '
            + 'Druckverlust, Bremsproblem, lose Hardware oder nicht reproduzierbare '
            + 'Messdaten. Dann wird nicht weiter abgestimmt.</span></label>');

        return teile.join('');
    }

    function baueSheet(h) {
        var erlaubt = Diagnose.darfAendern(h.id);
        if (!erlaubt.erlaubt) {
            return '<div class="warning-box"><strong>Gesperrt.</strong> '
                + esc(erlaubt.grund) + '.</div>';
        }
        var fehlend = Diagnose.fehlendeFelder(h.id);
        var kopf = fehlend.length
            ? '<div class="info-box">Noch ' + fehlend.length + ' von '
              + Diagnose.SHEET.length + ' Feldern offen. '
              + '<em>Messgr&ouml;&szlig;e f&uuml;r Erfolg</em> ist das wichtigste: ohne sie '
              + 'ist der n&auml;chste Stint nicht auswertbar, egal wie er ausgeht.</div>'
            : '<div class="info-box" style="border-left-color:var(--success);">'
              + 'Vollst&auml;ndig. Jetzt genau <strong>eine</strong> &Auml;nderung.</div>';

        var felder = Diagnose.SHEET.map(function (f) {
            var wert = h.sheet[f.key] || '';
            return '<div style="margin-bottom:0.5rem;">'
                + '<label style="display:block;font-size:0.72rem;color:var(--text-light);">'
                + esc(f.label) + (f.hinweis ? ' <span style="opacity:0.7;">&ndash; '
                + esc(f.hinweis) + '</span>' : '') + '</label>'
                + '<textarea class="diag-feld" data-id="' + esc(h.id) + '"'
                + ' data-feld="' + esc(f.key) + '" rows="2"'
                + ' style="width:100%;padding:0.4rem;border:1px solid var(--border);'
                + 'border-radius:6px;background:var(--input-bg);font-size:0.8rem;'
                + 'font-family:inherit;resize:vertical;">' + esc(wert) + '</textarea></div>';
        }).join('');

        var ergebnis = '<div style="margin-top:0.6rem;">'
            + '<label style="display:block;font-size:0.72rem;color:var(--text-light);">'
            + 'A/B-Ergebnis</label>'
            + '<select class="diag-ergebnis" data-id="' + esc(h.id) + '"'
            + ' style="width:100%;padding:0.5rem;border:1px solid var(--border);'
            + 'border-radius:6px;background:var(--input-bg);font-size:0.82rem;min-height:40px;">'
            + Diagnose.ERGEBNISSE.map(function (e) {
                return '<option value="' + esc(e.key) + '"'
                    + (h.ergebnis === e.key ? ' selected' : '') + '>'
                    + esc(e.label) + '</option>';
              }).join('')
            + '</select>'
            + '<p style="font-size:0.7rem;color:var(--text-light);margin-top:0.3rem;">'
            + '&bdquo;Nicht aussagekr&auml;ftig&ldquo; ist ein vollwertiges Ergebnis und '
            + 'darf so dokumentiert werden.</p></div>';

        return kopf + felder + ergebnis;
    }

    function baueKarte(h) {
        var s = Diagnose.symptom(h.code);
        var m = Diagnose.matrixFuer(h.code);
        var erlaubt = Diagnose.darfAendern(h.id);

        var marke = '';
        if (h.stopp) marke = '<span class="src src-f">Stop</span>';
        else if (!erlaubt.erlaubt) marke = '<span class="src src-d">' + esc(erlaubt.offen.join('')) + '</span>';
        else if (!h.ergebnis) marke = '<span class="src src-c">bereit</span>';
        else marke = '<span class="src src-a">' + esc(h.ergebnis) + '</span>';

        var flags = h.flags.length
            ? '<div class="spec-item"><span class="spec-label">Flags</span>'
              + '<span class="spec-value" style="font-weight:400;">'
              + h.flags.map(esc).join(', ') + '</span></div>'
            : '';

        var hinweis = m
            ? '<div class="guide-block" style="background:var(--bg);border-radius:6px;'
              + 'padding:0.5rem;margin:0.5rem 0;font-size:0.78rem;">'
              + '<strong>Zuerst:</strong> ' + esc(m.erst) + '<br>'
              + '<strong>Danach:</strong> ' + esc(m.danach) + '<br>'
              + '<strong style="color:var(--danger);">Nicht sofort:</strong> '
              + esc(m.nichtSofort) + '</div>'
            : '';

        return '<div class="section" id="sec-' + esc(h.id) + '">'
            + '<div class="section-header" onclick="toggleSection(this)">'
            + '<h2>' + esc(h.code) + '</h2>' + marke
            + '</div>'
            + '<div class="section-body collapsed">'
            + '<div class="spec-item"><span class="spec-label">' + zeit(h.erstellt) + '</span>'
            + '<span class="spec-value" style="font-weight:400;">'
            + esc(s ? s.titel : h.code) + '</span></div>'
            + flags + hinweis
            + baueHierarchie(h)
            + '<h3 style="font-size:0.85rem;color:var(--primary);margin:0.8rem 0 0.4rem;">'
            + 'Change Impact Sheet</h3>'
            + baueSheet(h)
            + '<div style="margin-top:0.8rem;text-align:right;">'
            + '<button type="button" class="btn-danger" onclick="hypotheseVerwerfen(\''
            + esc(h.id) + '\')" style="border:none;border-radius:6px;padding:0.4rem 0.8rem;'
            + 'font-size:0.78rem;cursor:pointer;">Verwerfen</button></div>'
            + '</div></div>';
    }

    // ==== Zeichnen ====

    function zeichneAlles() {
        var offenZiel = document.getElementById('hypothesenListe');
        var fertigZiel = document.getElementById('abgeschlossenListe');
        if (!offenZiel) return;

        // Klappzustand sichern - sonst faellt die Karte zu, an der man
        // gerade arbeitet. Dasselbe Problem wie auf der Werkstattseite.
        var offenKarten = {};
        var koerper = document.querySelectorAll('.section[id^="sec-h"] .section-body');
        for (var o = 0; o < koerper.length; o++) {
            if (!koerper[o].classList.contains('collapsed')) {
                offenKarten[koerper[o].parentElement.id] = true;
            }
        }

        var alle = Diagnose.alle();
        var offen = alle.filter(function (h) { return !h.ergebnis; });
        var fertig = alle.filter(function (h) { return h.ergebnis; });

        offenZiel.innerHTML = offen.length
            ? offen.map(baueKarte).join('')
            : '<p style="font-size:0.8rem;color:var(--text-light);padding:0 0.75rem;">'
              + 'Keine offene Hypothese.</p>';

        if (fertigZiel) {
            fertigZiel.innerHTML = fertig.length
                ? fertig.map(baueKarte).join('')
                : '<p style="font-size:0.8rem;color:var(--text-light);">Noch nichts abgeschlossen.</p>';
        }

        // Gesicherten Klappzustand wiederherstellen
        for (var id in offenKarten) {
            var sec = document.getElementById(id);
            if (!sec) continue;
            var kopf = sec.querySelector('.section-header');
            var koerper2 = sec.querySelector('.section-body');
            if (kopf) kopf.classList.remove('collapsed');
            if (koerper2) koerper2.classList.remove('collapsed');
        }
    }

    function hypotheseVerwerfen(id) {
        if (!confirm('Diese Hypothese verwerfen?')) return;
        Diagnose.verwerfen(id);
        zeichneAlles();
    }

    // ==== Eingaben ====

    document.addEventListener('change', function (e) {
        var el = e.target;
        if (!el || !el.dataset) return;

        if (el.classList.contains('diag-stufe')) {
            Diagnose.stufePruefen(el.dataset.id, el.dataset.stufe, el.checked);
            zeichneAlles();
        } else if (el.classList.contains('diag-stopp')) {
            Diagnose.stoppSetzen(el.dataset.id, el.checked);
            zeichneAlles();
        } else if (el.classList.contains('diag-ergebnis')) {
            Diagnose.ergebnisSetzen(el.dataset.id, el.value);
            zeichneAlles();
        }
    });

    // Textfelder nur speichern, nicht neu zeichnen - sonst verliert man beim
    // Tippen den Fokus. Entprellt, damit nicht jeder Anschlag schreibt.
    var tippTimer = null;
    document.addEventListener('input', function (e) {
        var el = e.target;
        if (!el || !el.classList || !el.classList.contains('diag-feld')) return;
        clearTimeout(tippTimer);
        tippTimer = setTimeout(function () {
            Diagnose.sheetSetzen(el.dataset.id, el.dataset.feld, el.value);
        }, 400);
    });

    function init() {
        if (typeof Diagnose === 'undefined') return;
        baueAuswahl();
        zeichneAlles();
    }

    window.hypotheseAnlegen = hypotheseAnlegen;
    window.hypotheseVerwerfen = hypotheseVerwerfen;
    window.diagnoseZeichnen = zeichneAlles;

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
