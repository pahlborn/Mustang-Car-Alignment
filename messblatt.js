/**
 * messblatt.js - Darstellung der Messfelder.
 *
 * Die Felder kommen aus messwerte.js, nicht aus dem Markup. Das Markup
 * dieser Seite besteht aus einem leeren <div> - alles andere waere eine
 * zweite Liste derselben Felder, und die liefe gegen die erste.
 *
 * ABGELEITETE WERTE WERDEN GERECHNET, NICHT EINGETRAGEN
 *
 * Total Toe, die L/R-Differenzen, die sechs Radlastprozente und die
 * Pyrometer-Auswertung haben kein Eingabefeld. Wer sie eintragen koennte,
 * koennte sie auch falsch eintragen - und dann stuende neben dem Messwert
 * eine Zahl, die nicht zu ihm passt.
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

    function zahl(id) { return Messwerte.zahl(wert(id)); }

    /** Zahl mit fester Nachkommastelle, oder Gedankenstrich. */
    function zz(v, n) {
        return (v === null || v === undefined) ? '\u2013' : v.toFixed(n === undefined ? 2 : n);
    }

    var GRUPPEN = {
        kopf:      { titel: 'Kopfdaten',          icon: '\ud83d\udcc5' },
        stell:     { titel: 'Stellgr\u00f6\u00dfen Vorderachse', icon: '\ud83d\udd27',
                     hinweis: 'Was eingestellt ist. Diese Werte machen das Setup '
                            + 'reproduzierbar &ndash; sie sind <strong>keine</strong> '
                            + 'Winkelangaben.' },
        alignment: { titel: 'Alignment',          icon: '\ud83d\udcd0',
                     hinweis: 'Was dabei herauskommt. Castor vor Camber messen: '
                            + 'UCA-Shims und Strut Rods koppeln beide.' },
        toe:       { titel: 'Toe',                icon: '\u2194' },
        ridehoehe: { titel: 'Ride Height',        icon: '\ud83d\udccf' },
        radlast:   { titel: 'Radlasten',          icon: '\u2696',
                     hinweis: 'Cross ist an diesem Fahrzeug nicht gezielt einstellbar &ndash; '
                            + 'es fehlen h&ouml;henverstellbare Federauflagen. '
                            + 'Dieses Blatt dient der <strong>Diagnose</strong>.' },
        reifen:    { titel: 'Reifendruck',        icon: '\ud83d\udd35' },
        pyrometer: { titel: 'Reifentemperatur',   icon: '\ud83c\udf21',
                     hinweis: 'Drei Punkte je Reifen beantworten <strong>zwei</strong> '
                            + 'Fragen: das Innen-Au&szlig;en-Gef&auml;lle den Camber, '
                            + 'Mitte gegen Schultern den Druck. Nicht vermischen.' }
    };

    // ==== Eingabefeld ====

    function baueFeld(f) {
        var attr = ' data-field="' + esc(f.id) + '"';
        if (f.groesse) attr += ' data-groesse="' + esc(f.groesse) + '"';
        if (f.regel) attr += ' data-validate="' + esc(f.regel) + '"';
        if (f.platzhalter) attr += ' placeholder="' + esc(f.platzhalter) + '"';

        var typ = f.typ === 'date' ? 'date' : 'text';
        var mode = f.regel ? ' inputmode="decimal"' : '';

        return '<input type="' + typ + '"' + attr + mode
            + ' oninput="autoSave()"'
            + ' style="width:100%;padding:0.4rem;border:1px solid var(--border);'
            + 'border-radius:6px;background:var(--input-bg);font-size:0.82rem;'
            + 'min-height:36px;text-align:right;">';
    }

    function beschriftung(f) {
        var teile = ['<span>' + esc(f.label) + '</span>'];
        if (f.einheit) {
            teile.push('<span style="color:var(--text-light);font-size:0.7rem;"> '
                + esc(f.einheit) + '</span>');
        }
        if (f.messmittel) {
            teile.push('<span class="src src-c" title="' + esc(f.messmittel)
                + '">C</span>');
        }
        if (f.grenze) {
            teile.push('<br><span style="color:var(--text-light);font-size:0.68rem;">'
                + esc(f.grenze) + '</span>');
        }
        return teile.join('');
    }

    /**
     * Felder einer Gruppe als Tabelle, nach Radposition gespaltet.
     *
     * Vier Spalten auf dem Telefon waeren zu schmal; darum scrollt die
     * Tabelle waagerecht statt umzubrechen.
     */
    function baueGruppe(name) {
        var felder = Messwerte.gruppe(name);
        if (!felder.length) return '';

        var mitRad = felder.filter(function (f) { return f.rad; });
        var ohneRad = felder.filter(function (f) { return !f.rad; });
        var teile = [];

        if (ohneRad.length) {
            teile.push(ohneRad.map(function (f) {
                return '<div class="spec-item" style="align-items:flex-start;">'
                    + '<span class="spec-label" style="flex:1;">' + beschriftung(f) + '</span>'
                    + '<span style="flex:0 0 130px;">' + baueFeld(f) + '</span></div>';
            }).join(''));
        }

        if (mitRad.length) {
            // Welche Raeder kommen vor? LF/RF allein bei der Vorderachse.
            var raeder = [];
            mitRad.forEach(function (f) {
                if (raeder.indexOf(f.rad) < 0) raeder.push(f.rad);
            });
            raeder.sort(function (a, b) {
                return Messwerte.RAEDER.indexOf(a) - Messwerte.RAEDER.indexOf(b);
            });

            // Zeilen: je Beschriftung eine, Spalten je Rad.
            var zeilen = [];
            var gesehen = {};
            mitRad.forEach(function (f) {
                var key = f.label + '|' + (f.punkt || '');
                if (gesehen[key]) return;
                gesehen[key] = true;
                zeilen.push({ label: f.label, punkt: f.punkt, muster: f });
            });

            var kopf = '<tr><th style="text-align:left;">Parameter</th>'
                + raeder.map(function (r) { return '<th>' + r + '</th>'; }).join('')
                + (raeder.length === 2 ? '<th>L&minus;R</th>' : '') + '</tr>';

            var koerper = zeilen.map(function (z) {
                var zellen = raeder.map(function (r) {
                    var f = mitRad.filter(function (x) {
                        return x.rad === r && x.label === z.label && (x.punkt || '') === (z.punkt || '');
                    })[0];
                    return '<td>' + (f ? baueFeld(f) : '') + '</td>';
                }).join('');

                var diff = '';
                if (raeder.length === 2) {
                    var lf = mitRad.filter(function (x) {
                        return x.rad === raeder[0] && x.label === z.label; })[0];
                    var rf = mitRad.filter(function (x) {
                        return x.rad === raeder[1] && x.label === z.label; })[0];
                    diff = '<td class="mb-diff" data-links="' + esc(lf ? lf.id : '')
                        + '" data-rechts="' + esc(rf ? rf.id : '')
                        + '" style="text-align:right;font-weight:600;">&ndash;</td>';
                }
                return '<tr><td style="text-align:left;">' + beschriftung(z.muster)
                    + '</td>' + zellen + diff + '</tr>';
            }).join('');

            teile.push('<div style="overflow-x:auto;-webkit-overflow-scrolling:touch;">'
                + '<table class="data-table" style="width:100%;min-width:320px;">'
                + kopf + koerper + '</table></div>');
        }

        var g = GRUPPEN[name] || { titel: name, icon: '' };
        var hinweis = g.hinweis ? '<div class="info-box">' + g.hinweis + '</div>' : '';

        return '<div class="section" id="sec-' + esc(name) + '">'
            + '<div class="section-header" onclick="toggleSection(this)">'
            + '<span class="section-icon">' + g.icon + '</span>'
            + '<h2>' + esc(g.titel) + '</h2></div>'
            + '<div class="section-body collapsed">' + hinweis + teile.join('')
            + '<div class="mb-ergebnis" data-gruppe="' + esc(name) + '"></div>'
            + '</div></div>';
    }

    // ==== Abgeleitete Werte ====

    function zeichneErgebnisse() {
        // L/R-Differenzen
        var diffs = document.querySelectorAll('.mb-diff');
        for (var i = 0; i < diffs.length; i++) {
            var d = Messwerte.differenz(wert(diffs[i].dataset.links),
                                        wert(diffs[i].dataset.rechts));
            diffs[i].textContent = d === null ? '\u2013' : zz(d);
        }

        var boxen = document.querySelectorAll('.mb-ergebnis');
        for (var b = 0; b < boxen.length; b++) {
            boxen[b].innerHTML = ergebnisFuer(boxen[b].dataset.gruppe);
        }
    }

    function zeile(label, wertText, hinweis) {
        return '<div class="spec-item"><span class="spec-label">' + label
            + (hinweis ? '<br><span style="font-size:0.68rem;">' + hinweis + '</span>' : '')
            + '</span><span class="spec-value">' + wertText + '</span></div>';
    }

    function ergebnisFuer(gruppe) {
        if (gruppe === 'toe') {
            var tt = Messwerte.totalToe(wert('toe_f'), wert('toe_r'));
            var grad = tt === null ? null : Messwerte.toeGrad(tt, wert('toe_d'));
            var richtung = tt === null ? '' : (tt > 0 ? ' (Toe-in)' : (tt < 0 ? ' (Toe-out)' : ''));
            return '<div style="margin-top:0.6rem;">'
                + zeile('Total Toe = R &minus; F', (tt === null ? '\u2013' : zz(tt) + ' mm' + richtung),
                        'positiv = Toe-in (CONVENTIONS 7)')
                + zeile('In Grad', grad === null ? '\u2013' : zz(grad, 3) + '\u00b0',
                        grad === null && tt !== null
                          ? 'ohne Messbasis D keine Umrechnung (CONVENTIONS 9)'
                          : 'a = atan(&Delta; / D)')
                + '</div>';
        }

        if (gruppe === 'radlast') {
            var w = {};
            for (var i = 0; i < Messwerte.RAEDER.length; i++) {
                w[Messwerte.RAEDER[i]] = wert('cw_' + Messwerte.RAEDER[i].toLowerCase());
            }
            var r = Messwerte.radlasten(w);
            if (!r) return '<div class="info-box" style="margin-top:0.6rem;">'
                + 'Alle vier Radlasten eintragen, dann wird gerechnet.</div>';
            return '<div style="margin-top:0.6rem;">'
                + zeile('Total', zz(r.total, 1) + ' kg')
                + zeile('Front / Rear', zz(r.front, 1) + ' % / ' + zz(r.rear, 1) + ' %')
                + zeile('Links / Rechts', zz(r.links, 1) + ' % / ' + zz(r.rechts, 1) + ' %')
                + zeile('Cross', zz(r.cross, 2) + ' %',
                        '50 % ist ein symmetrischer Ausgangspunkt, kein Sollwert')
                + zeile('Gegen-Cross', zz(r.gegenCross, 2) + ' %')
                + '</div>';
        }

        if (gruppe === 'pyrometer') {
            var zeilen = [];
            for (var k = 0; k < Messwerte.RAEDER.length; k++) {
                var rad = Messwerte.RAEDER[k].toLowerCase();
                var t = Messwerte.reifentemperatur(
                    wert('py_innen_' + rad), wert('py_mitte_' + rad), wert('py_aussen_' + rad));
                if (!t) continue;
                zeilen.push(zeile(Messwerte.RAEDER[k],
                    'Mittel ' + zz(t.mittel, 1) + ' \u00b0C',
                    'Camber-Gef&auml;lle (i&minus;a) ' + zz(t.camberGefaelle, 1)
                    + ' K &middot; Druck-W&ouml;lbung ' + zz(t.druckWoelbung, 1) + ' K'));
            }
            if (!zeilen.length) return '';
            return '<div style="margin-top:0.6rem;">' + zeilen.join('')
                + '<div class="info-box">Auf rechtslastigen Strecken ist eine '
                + 'L/R-Differenz <strong>normal</strong> und kein Setupfehler '
                + '(CHAPTER_TRACKS &sect;5).</div></div>';
        }

        return '';
    }

    // ==== Start ====

    function zeichnen() {
        var ziel = document.getElementById('blattListe');
        if (!ziel) return;
        ziel.innerHTML = Messwerte.alleGruppen().map(baueGruppe).join('');
    }

    function init() {
        if (typeof Messwerte === 'undefined') return;
        zeichnen();

        // Gespeicherte Werte eintragen. app.js hat beim Laden schon
        // applyData() gerufen - da gab es die Felder aber noch nicht.
        try {
            var daten = JSON.parse(localStorage.getItem('chassisSetup') || '{}');
            var felder = document.querySelectorAll('[data-field]');
            for (var i = 0; i < felder.length; i++) {
                var v = daten[felder[i].dataset.field];
                if (v !== undefined) felder[i].value = v;
            }
        } catch (e) {}

        if (typeof Validation !== 'undefined') Validation.init(document);
        zeichneErgebnisse();
    }

    // Abgeleitete Werte bei jeder Eingabe nachziehen - sie haben kein eigenes
    // Feld und koennen deshalb nicht veralten.
    document.addEventListener('input', function (e) {
        if (e.target && e.target.dataset && e.target.dataset.field) zeichneErgebnisse();
    });

    window.messblattZeichnen = zeichnen;
    window.messblattErgebnisse = zeichneErgebnisse;

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
