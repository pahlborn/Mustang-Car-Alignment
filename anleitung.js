/**
 * anleitung.js - die Arbeitsanleitung: Phasen mit nummerierten Schrittkarten.
 *
 * Vorbild ist das Build Log von jerico und gt40, Massstab das Zielbild
 * (docs/zielbild/). Der Text steht im Markup von anleitung.html. Dieses
 * Modul macht nur:
 *
 *   1. Felder in die Karten setzen. Sie kommen aus messwerte.js und werden
 *      mit demselben Baustein gebaut wie im Messblatt (Messblatt.feld) - kein
 *      zweites Feld, keine zweite Beschriftung (Regel 4).
 *        <div data-messtabelle="al_castor al_kpi">        LF, RF, L-R
 *        <div data-messtabelle="rh" data-raeder="4">      LF, RF, LR, RR
 *        <div data-messfelder="toe_f toe_r">              untereinander
 *   2. Bausteine einsetzen: <div data-baustein="waage"> bekommt den Inhalt
 *      von <template data-baustein="waage">. Ein Ablauf, eine Stelle.
 *   3. Gerechnetes zeigen: L-R-Differenz (bei Winkeln gelb ueber 1/4 Grad,
 *      rot ueber 1/2 Grad - Ford Shop Manual 1966, A-11), Gesamtspur.
 *   4. Status. Je Schritt ein Feld anl_<phase>_<schritt> (offen / in Arbeit /
 *      erledigt) im vorhandenen Messwerte-Abgleich, wie die Schrittkaesten
 *      in jerico und gt40. Je Phase der Phasenstatus aus status.js - er
 *      bleibt die einzige Grundlage fuer "veraltet" und "rennstreckenbereit"
 *      (Zielbild 3a). "Neu messen" an einem Schritt wird daraus abgeleitet:
 *      der Schritt nennt in data-liefert, was er misst.
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

    function liste(el, attr) {
        return (el.getAttribute(attr) || '').split(/\s+/).filter(Boolean);
    }

    // ==== Felder ====

    var RAEDER2 = ['LF', 'RF'];
    var RAEDER4 = ['LF', 'RF', 'LR', 'RR'];

    function baueTabelle(el) {
        var vier = el.getAttribute('data-raeder') === '4';
        var raeder = vier ? RAEDER4 : RAEDER2;
        var kopf = '<tr><th style="text-align:left;">Wert</th>'
            + raeder.map(function (r) { return '<th>' + r + '</th>'; }).join('')
            + (vier ? '' : '<th>L&minus;R</th>') + '</tr>';
        var zeilen = liste(el, 'data-messtabelle').map(function (b) {
            var felder = raeder.map(function (r) { return Messwerte.feld(b + '_' + r.toLowerCase()); });
            if (felder.some(function (f) { return !f; })) return '';
            var diff = vier ? '' : '<td class="anl-diff" data-links="' + esc(felder[0].id)
                + '" data-rechts="' + esc(felder[1].id) + '" data-grad="'
                + (felder[0].einheit === '\u00b0' ? '1' : '') + '" style="text-align:right;font-weight:600;">&ndash;</td>';
            return '<tr><td style="text-align:left;">' + Messblatt.beschriftung(felder[0]) + '</td>'
                + felder.map(function (f) { return '<td>' + Messblatt.feld(f) + '</td>'; }).join('')
                + diff + '</tr>';
        }).join('');
        el.innerHTML = '<div style="overflow-x:auto;"><table class="data-table anl-tabelle">'
            + kopf + zeilen + '</table></div>';
    }

    function baueListe(el) {
        el.innerHTML = liste(el, 'data-messfelder').map(function (id) {
            var f = Messwerte.feld(id);
            if (!f) return '';
            var breit = f.typ === 'text';
            return '<div class="spec-item anl-feld' + (breit ? ' anl-feld-breit' : '') + '">'
                + '<span class="spec-label">' + Messblatt.beschriftung(f) + '</span>'
                + '<span class="anl-eingabe">' + Messblatt.feld(f) + '</span></div>';
        }).join('');
    }

    // ==== Bausteine ====

    function baueBaustein(el) {
        var name = el.getAttribute('data-baustein');
        var tpl = document.querySelector('template[data-baustein="' + name + '"]');
        if (!tpl) { el.innerHTML = ''; return; }
        el.innerHTML = '<details class="baustein"><summary>' + esc(tpl.getAttribute('data-titel') || name)
            + '</summary><div class="baustein-inhalt">' + tpl.innerHTML + '</div></details>';
    }

    // ==== Gerechnetes ====

    function rechnen() {
        document.querySelectorAll('.anl-diff').forEach(function (z) {
            var d = Messwerte.differenz(wert(z.dataset.links), wert(z.dataset.rechts));
            z.textContent = d === null ? '\u2013' : zz(d);
            z.classList.remove('anl-gelb', 'anl-rot');
            z.title = '';
            // Nur bei Winkeln: Ford nennt fuer Castor und Camber links/rechts
            // hoechstens 1/2 Grad, angestrebt 1/4 Grad (A-11, S. 3-5).
            if (d === null || !z.dataset.grad) return;
            var b = Math.abs(d);
            if (b > 0.5 + 1e-9) { z.classList.add('anl-rot'); z.title = 'über 1/2° – Grenze überschritten (Ford)'; }
            else if (b > 0.25 + 1e-9) { z.classList.add('anl-gelb'); z.title = 'über 1/4° – Ford empfiehlt höchstens 1/4°'; }
        });
        document.querySelectorAll('[data-anl-toe]').forEach(function (el) {
            var p = el.getAttribute('data-anl-toe') || 'toe';
            var tt = Messwerte.totalToe(wert(p + '_f'), wert(p + '_r'));
            var richtung = tt === null ? '' : (tt > 0 ? ' Vorspur (Toe-in)' : (tt < 0 ? ' Nachspur (Toe-out)' : ' parallel'));
            el.innerHTML = '<div class="spec-item"><span class="spec-label">Gesamtspur = hinten &minus; vorn</span>'
                + '<span class="spec-value">' + (tt === null ? '\u2013' : zz(tt, 1) + ' mm' + richtung) + '</span></div>';
        });
    }

    // ==== Status je Schritt ====

    var FOLGE = { '': 'wip', 'offen': 'wip', 'wip': 'done', 'done': 'offen' };

    function stufeVon(btn) { return btn.value === 'wip' || btn.value === 'done' ? btn.value : ''; }

    function malen(btn) {
        // Das Zeichen setzt styles.css ueber [value]; hier nur der Text fuer
        // Vorlesen und Mauszeiger.
        var v = stufeVon(btn);
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
        markieren();
    }

    // ==== Aufklappen ====

    function toggleGuide(el) {
        var k = el.closest('.step-card');
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

    /** Karte oeffnen und hinscrollen - fuer den Weiter-Knopf. */
    function oeffnen(karte) {
        var body = karte.closest('.phase-body');
        if (body && body.classList.contains('collapsed')) togglePhase(body.id);
        var g = karte.querySelector('.step-guide');
        if (g && !g.classList.contains('open')) toggleGuide(g);
        karte.scrollIntoView({ block: 'start' });
        window.scrollBy(0, -80);
    }

    // ==== Phasenstatus, "neu messen", Weiter ====

    var MARKE = {
        done: '<span class="marke marke-fertig">erledigt</span>',
        wip: '<span class="marke marke-wartet">in Arbeit</span>',
        '': '<span class="marke marke-info">offen</span>'
    };

    /** Groessen, wegen derer die Phase neu zu messen ist. */
    function neuZuMessen(phaseId) {
        var pr = Status.pruefen(phaseId);
        if (!pr.veraltet) return null;
        var g = {};
        pr.wegen.forEach(function (w) {
            if (w.art === 'mitmessen') return;
            (w.felder || [w.groesse]).forEach(function (x) { g[x] = true; });
            // Hat die Phase die verstellte Groesse selbst geliefert, meldet
            // status.js nur diese ("neu erfasst"). Was die Matrix dazu als
            // "neu messen" nennt (Castor -> Camber, Spur), trifft die Schritte
            // dieser Phase genauso - aus derselben Tabelle, nicht neu erfunden.
            if (w.art === 'neu erfasst') {
                Recheck.phasenNach(w.groesse).veraltet
                    .filter(function (x) { return x.id === phaseId; })
                    .forEach(function (x) { x.wegen.forEach(function (y) { g[y] = true; }); });
            }
        });
        return g;
    }

    function markieren() {
        if (typeof Status === 'undefined') return;

        document.querySelectorAll('.phase[data-phase]').forEach(function (ph) {
            var id = ph.getAttribute('data-phase');
            var karten = ph.querySelectorAll('.step-card');
            var fertig = 0;
            karten.forEach(function (k) {
                var b = k.querySelector('.step-status');
                if (b && stufeVon(b) === 'done') fertig++;
            });
            var neu = neuZuMessen(id);

            karten.forEach(function (k) {
                var alt = k.querySelector('.anl-neu-messen');
                if (alt) alt.remove();
                var lief = liste(k, 'data-liefert');
                var treffer = neu && lief.some(function (g) { return neu[g]; });
                if (treffer) {
                    var t = k.querySelector('.step-title');
                    if (t) t.insertAdjacentHTML('beforeend', ' <span class="marke marke-veraltet anl-neu-messen">neu messen</span>');
                }
            });

            var stand = ph.querySelector('[data-phasen-stand]');
            if (stand) {
                stand.innerHTML = fertig + '/' + karten.length
                    + (neu ? ' &middot; neu messen' : (Status.stufe(id) === 'done' ? ' &middot; &#10003;' : ''));
            }

            var ab = ph.querySelector('.phase-abschluss[data-anl-phase]');
            if (ab) {
                var s = Status.stufe(id);
                var knopf = s === 'done' && !neu
                    ? '<button type="button" class="btn-secondary" data-anl-setzen="' + esc(id) + '" data-stufe="">Wieder auf offen</button>'
                    : '<button type="button" class="btn-primary" data-anl-setzen="' + esc(id) + '" data-stufe="done">Phase als erledigt melden</button>';
                ab.innerHTML = '<span>Phase:</span> '
                    + (neu ? '<span class="marke marke-veraltet">veraltet &ndash; neu messen</span>' : MARKE[s])
                    + ' ' + knopf;
            }
        });

        var weiter = document.getElementById('anlWeiter');
        if (weiter) {
            var naechste = null;
            document.querySelectorAll('.phase .step-card').forEach(function (k) {
                if (naechste) return;
                var b = k.querySelector('.step-status');
                if (b && stufeVon(b) !== 'done') naechste = k;
            });
            if (naechste) {
                var titel = naechste.querySelector('.step-title');
                weiter.hidden = false;
                weiter.dataset.ziel = naechste.id;
                weiter.querySelector('.anl-weiter-titel').textContent =
                    titel ? titel.childNodes[0].textContent.trim() : '';
            } else {
                weiter.hidden = true;
            }
        }
    }

    document.addEventListener('click', function (e) {
        var b = e.target.closest && e.target.closest('[data-anl-setzen]');
        if (b) {
            var stufe = b.getAttribute('data-stufe');
            if (stufe === '' && !confirm('Phase ist erledigt. Wieder auf offen setzen?')) return;
            Status.setzen(b.getAttribute('data-anl-setzen'), stufe);
            markieren();
            return;
        }
        var w = e.target.closest && e.target.closest('#anlWeiter');
        if (w && w.dataset.ziel) {
            var k = document.getElementById(w.dataset.ziel);
            if (k) oeffnen(k);
        }
    });

    // ==== Start ====

    function aufbauen(root) {
        root.querySelectorAll('[data-baustein]:not(template)').forEach(baueBaustein);
        root.querySelectorAll('[data-messtabelle]').forEach(baueTabelle);
        root.querySelectorAll('[data-messfelder]').forEach(baueListe);
        // app.js hat die gespeicherten Werte schon eingetragen - da gab es
        // diese Felder noch nicht.
        FieldSync.anwenden(FieldSync.lesen(), root);
        if (typeof Validation !== 'undefined') Validation.init(root);
        root.querySelectorAll('.step-status[data-field]').forEach(malen);
        rechnen();
        markieren();
    }

    function init() {
        if (typeof Messwerte === 'undefined' || typeof Messblatt === 'undefined') return;
        var root = document.getElementById('anleitung');
        if (root) aufbauen(root);
    }

    document.addEventListener('input', function (e) {
        if (e.target && e.target.dataset && e.target.dataset.field) rechnen();
    });
    document.addEventListener('change', function (e) {
        if (e.target && e.target.dataset && e.target.dataset.field) rechnen();
    });
    document.addEventListener('status-geaendert', markieren);
    document.addEventListener('daten-abgeglichen', function () {
        document.querySelectorAll('#anleitung .step-status[data-field]').forEach(malen);
        rechnen();
        markieren();
    });

    window.toggleGuide = toggleGuide;
    window.togglePhase = togglePhase;
    window.schrittStatus = schrittStatus;
    window.Anleitung = { aufbauen: aufbauen, rechnen: rechnen, markieren: markieren };

    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
    else init();
})();
