/**
 * anleitung.js - die Arbeitsanleitung: Phasen mit nummerierten Schrittkarten.
 *
 * Vorbild ist das Build Log von jerico und gt40: jede Karte enthaelt alles,
 * was man an diesem Punkt am Auto braucht. Der Text steht im Markup von
 * anleitung.html. Dieses Modul macht nur dreierlei:
 *
 *   1. Messfelder in die Karten setzen. Sie kommen aus messwerte.js und
 *      werden mit demselben Baustein gebaut wie im Messblatt
 *      (Messblatt.feld) - kein zweites Feld, keine zweite Beschriftung.
 *      Ein Wert, der hier eingetragen wird, steht auch im Messblatt.
 *   2. Gerechnetes anzeigen: L-R-Differenz, Total Toe.
 *   3. Status: je Schritt offen / in Arbeit / erledigt (eigene Felder
 *      anl_*), je Phase der Phasenstatus aus status.js - derselbe wie in der
 *      Werkstatt, damit Fortschritt und "veraltet" weiter stimmen.
 */
(function () {
    'use strict';

    function esc(s) {
        return String(s == null ? '' : s)
            .replace(/&/g, '&amp;').replace(/</g, '&lt;')
            .replace(/>/g, '&gt;').replace(/"/g, '&quot;');
    }

    function wert(id) {
        var el = document.querySelector('[data-field="' + id + '"]');
        return el ? el.value : '';
    }

    function zz(v, n) {
        return (v === null || v === undefined) ? '\u2013' : v.toFixed(n === undefined ? 2 : n);
    }

    // ==== Messfelder ====

    /**
     * <div data-messtabelle="al_castor al_kpi"> - je Groesse eine Zeile mit
     * LF, RF und der gerechneten Differenz L-R.
     */
    function baueTabelle(el) {
        var basen = el.getAttribute('data-messtabelle').split(/\s+/).filter(Boolean);
        var kopf = '<tr><th style="text-align:left;">Wert</th><th>LF</th><th>RF</th><th>L&minus;R</th></tr>';
        var zeilen = basen.map(function (b) {
            var lf = Messwerte.feld(b + '_lf'), rf = Messwerte.feld(b + '_rf');
            if (!lf || !rf) return '';
            return '<tr><td style="text-align:left;">' + Messblatt.beschriftung(lf) + '</td>'
                + '<td>' + Messblatt.feld(lf) + '</td><td>' + Messblatt.feld(rf) + '</td>'
                + '<td class="mb-diff anl-diff" data-links="' + esc(lf.id) + '" data-rechts="'
                + esc(rf.id) + '" style="text-align:right;font-weight:600;">&ndash;</td></tr>';
        }).join('');
        el.innerHTML = '<div style="overflow-x:auto;"><table class="data-table">'
            + kopf + zeilen + '</table></div>';
    }

    /** <div data-messfelder="toe_f toe_r toe_d"> - Felder ohne Radposition. */
    function baueListe(el) {
        var ids = el.getAttribute('data-messfelder').split(/\s+/).filter(Boolean);
        el.innerHTML = ids.map(function (id) {
            var f = Messwerte.feld(id);
            if (!f) return '';
            return '<div class="spec-item" style="align-items:flex-start;">'
                + '<span class="spec-label" style="flex:1;">' + Messblatt.beschriftung(f) + '</span>'
                + '<span style="flex:0 0 130px;">' + Messblatt.feld(f) + '</span></div>';
        }).join('');
    }

    // ==== Gerechnetes ====

    function rechnen() {
        var diffs = document.querySelectorAll('.anl-diff');
        for (var i = 0; i < diffs.length; i++) {
            var d = Messwerte.differenz(wert(diffs[i].dataset.links), wert(diffs[i].dataset.rechts));
            diffs[i].textContent = d === null ? '\u2013' : zz(d);
            var zuGross = d !== null && Math.abs(d) > 0.25;
            diffs[i].style.color = zuGross ? 'var(--danger)' : '';
            diffs[i].title = zuGross ? 'mehr als 1/4\u00b0 Unterschied links/rechts' : '';
        }
        var toe = document.querySelectorAll('[data-anl-toe]');
        for (var k = 0; k < toe.length; k++) {
            var tt = Messwerte.totalToe(wert('toe_f'), wert('toe_r'));
            var richtung = tt === null ? '' : (tt > 0 ? ' Vorspur (Toe-in)' : (tt < 0 ? ' Nachspur (Toe-out)' : ' parallel'));
            toe[k].innerHTML = '<div class="spec-item"><span class="spec-label">Gesamtspur = hinten &minus; vorn</span>'
                + '<span class="spec-value">' + (tt === null ? '\u2013' : zz(tt, 1) + ' mm' + richtung) + '</span></div>';
        }
    }

    // ==== Status je Schritt ====

    var FOLGE = { '': 'wip', 'offen': 'wip', 'wip': 'done', 'done': 'offen' };

    function malen(btn) {
        // Das Zeichen setzt styles.css ueber [value] - hier nur der Text fuer
        // Vorlesen und Mauszeiger.
        var v = btn.value === 'wip' || btn.value === 'done' ? btn.value : '';
        btn.title = 'Status: ' + (v === 'done' ? 'erledigt' : (v === 'wip' ? 'in Arbeit' : 'offen'));
        btn.setAttribute('aria-label', btn.title);
    }

    function schrittStatus(btn) {
        // "offen" als Wert, nicht leer: ein Zuruecksetzen soll im Abgleich
        // gegen ein "erledigt" eines anderen Geraets gewinnen koennen
        // (Regel 9c, wie jerico und gt40).
        if (btn.value === 'done' && !confirm('Schritt ist erledigt. Wieder auf offen setzen?')) return;
        btn.value = FOLGE[btn.value] || 'wip';
        malen(btn);
        autoSave();
    }

    function alleMalen() {
        document.querySelectorAll('.step-status[data-field]').forEach(malen);
    }

    // ==== Aufklappen ====

    function karte(el) { return el.closest('.step-card'); }

    function toggleGuide(el) {
        var k = karte(el);
        var g = k && k.querySelector('.step-guide');
        var t = k && k.querySelector('.guide-toggle');
        if (!g) return;
        var offen = g.classList.toggle('open');
        if (t) t.classList.toggle('open', offen);
    }

    function togglePhase(id) {
        var body = document.getElementById(id);
        var t = document.getElementById('toggle_' + id);
        if (!body) return;
        var zu = body.classList.toggle('collapsed');
        if (t) t.classList.toggle('collapsed', zu);
    }

    // ==== Phasenstatus (status.js) ====

    function phasenStatus() {
        document.querySelectorAll('[data-anl-phase]').forEach(function (el) {
            var id = el.getAttribute('data-anl-phase');
            var s = Status.stufe(id);
            var pr = Status.pruefen(id);
            var marke = pr.veraltet
                ? '<span class="marke marke-veraltet">veraltet &ndash; neu messen</span>'
                : (s === 'done' ? '<span class="marke marke-fertig">erledigt</span>'
                    : (s === 'wip' ? '<span class="marke marke-wartet">in Arbeit</span>'
                        : '<span class="marke marke-info">offen</span>'));
            var knopf = s === 'done' && !pr.veraltet
                ? '<button type="button" class="btn-secondary" data-anl-setzen="' + esc(id) + '" data-stufe="">Wieder auf offen</button>'
                : '<button type="button" class="btn-primary" data-anl-setzen="' + esc(id) + '" data-stufe="done">Phase als erledigt melden</button>';
            el.innerHTML = '<span>Phase:</span> ' + marke + ' ' + knopf;
        });
    }

    document.addEventListener('click', function (e) {
        var b = e.target.closest && e.target.closest('[data-anl-setzen]');
        if (!b) return;
        var stufe = b.getAttribute('data-stufe');
        if (stufe === '' && !confirm('Phase ist erledigt. Wieder auf offen setzen?')) return;
        Status.setzen(b.getAttribute('data-anl-setzen'), stufe);
        phasenStatus();
    });

    // ==== Start ====

    function init() {
        if (typeof Messwerte === 'undefined' || typeof Messblatt === 'undefined') return;
        var root = document.getElementById('anleitung');
        if (!root) return;
        root.querySelectorAll('[data-messtabelle]').forEach(baueTabelle);
        root.querySelectorAll('[data-messfelder]').forEach(baueListe);

        // app.js hat die gespeicherten Werte schon eingetragen - da gab es
        // diese Felder noch nicht.
        FieldSync.anwenden(FieldSync.lesen(), root);
        if (typeof Validation !== 'undefined') Validation.init(root);
        alleMalen();
        rechnen();
        if (typeof Status !== 'undefined') phasenStatus();
    }

    document.addEventListener('input', function (e) {
        if (e.target && e.target.dataset && e.target.dataset.field) rechnen();
    });
    document.addEventListener('daten-abgeglichen', function () {
        alleMalen(); rechnen();
        if (typeof Status !== 'undefined') phasenStatus();
    });

    window.toggleGuide = toggleGuide;
    window.togglePhase = togglePhase;
    window.schrittStatus = schrittStatus;

    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
    else init();
})();
