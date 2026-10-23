/**
 * bind-ui.js - Darstellung des Bind-Tests.
 *
 * Bind ist eine Verspannung, die verhindert, dass sich die Aufhaengung in
 * ihre kraeftefreie Lage setzt. Sie erzeugt keine Fehlermeldung - erst die
 * Wiederholungsmessung verraet sie. Wer bei vorhandenem Bind Setup-Arbeit
 * macht, optimiert gegen ein Rauschen (Kapitel 6, Kapitel 8 Regel 1).
 *
 * Darum steht das Urteil GANZ OBEN, vor allen Messfeldern: es entscheidet,
 * ob die ganze Seite ueberhaupt ausgefuellt werden darf. Wer erst nach dem
 * Messen liest, dass er nicht haette messen sollen, hat umsonst gemessen.
 *
 * Die vier Verfahren stehen in der Reihenfolge des Kapitels. 6.1 ist das
 * verbindliche; die uebrigen drei grenzen die Ursache ein.
 *
 * Alle Feldnamen kommen aus bind.js - hier wird kein Name wiederholt
 * (Arbeitsregel 4). Rechnen tut ausschliesslich bind.js; diese Datei zeigt
 * nur an.
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
    if (!el) return '';
    return el.type === 'checkbox' ? el.checked : el.value;
  }

  function daten() { return FieldSync.collectFields(); }

  function zz(v, n) {
    return (v === null || v === undefined) ? '\u2013' : v.toFixed(n === undefined ? 2 : n);
  }

  // kg, 0 bis 2000 - die Radlasten liegen bei rund 300 kg je Ecke.
  function kgFeld(id) {
    return '<input type="text" data-field="' + esc(id) + '"'
      + ' data-validate="numeric:0:2000" inputmode="decimal" oninput="autoSave()"'
      + ' style="width:100%;padding:0.35rem;border:1px solid var(--border);'
      + 'border-radius:6px;background:var(--input-bg);font-size:0.82rem;'
      + 'min-height:34px;text-align:right;">';
  }

  // mm, 0 bis 1000 - Ride Height im Hysteresetest.
  function mmFeld(id) {
    return '<input type="text" data-field="' + esc(id) + '"'
      + ' data-validate="numeric:0:1000" inputmode="decimal" oninput="autoSave()"'
      + ' style="width:100%;padding:0.35rem;border:1px solid var(--border);'
      + 'border-radius:6px;background:var(--input-bg);font-size:0.82rem;'
      + 'min-height:34px;text-align:right;">';
  }

  function haken(id, text, warnung) {
    return '<label style="display:flex;gap:0.5rem;align-items:flex-start;'
      + 'padding:0.35rem 0;font-size:0.8rem;border-bottom:1px solid var(--border);">'
      + '<input type="checkbox" data-field="' + esc(id) + '"'
      + ' onchange="autoSave();bindAktualisieren()"'
      + ' style="width:20px;height:20px;flex-shrink:0;margin-top:0.1rem;">'
      + '<span>' + text
      + (warnung ? '<br><span style="color:var(--text-light);font-size:0.72rem;">'
          + warnung + '</span>' : '')
      + '</span></label>';
  }

  function abschnitt(id, icon, titel, inhalt) {
    return '<div class="section" id="' + id + '">'
      + '<div class="section-header" onclick="toggleSection(this)">'
      + '<span class="section-icon">' + icon + '</span><h2>' + titel + '</h2></div>'
      + '<div class="section-body">' + inhalt + '</div></div>';
  }

  function box(art, text) {
    return '<div class="' + (art === 'warnung' ? 'warning-box' : 'info-box') + '">'
      + text + '</div>';
  }

  // ==== 6.1 Voraussetzungen ====

  function voraussetzungen() {
    return '<div class="info-box">Ohne diese Punkte ist keine der Messungen '
      + 'verwertbar. Besonders das <strong>gel&ouml;ste ARB</strong>: ist es '
      + 'verspannt, misst man den Stabilisator mit.</div>'
      + haken('bind_vor_raceready', 'Race-Ready-Zustand hergestellt (02_WORKFLOW &sect;6)')
      + haken('bind_vor_pad', 'Setup Pad coplanar, Waagen genullt und plausibilisiert')
      + haken('bind_vor_arb', 'ARB gel&ouml;st oder nachweislich spannungsfrei')
      + haken('bind_vor_lenkung', 'Lenkrad gerade, Bremse gel&ouml;st')
      + '<p id="bindVorStand" style="font-size:0.78rem;color:var(--text-light);'
      + 'margin:0.5rem 0 0;"></p>';
  }

  // ==== 6.1 Reproduzierbarkeit ====

  function messreihe() {
    var namen = ['A', 'B', 'C'];
    var zeilen = namen.map(function (n, i) {
      return '<tr><td style="text-align:left;font-weight:700;">Messung ' + n + '</td>'
        + Bind.RAEDER.map(function (r) {
            return '<td>' + kgFeld(Bind.feldRadlast(i + 1, r)) + '</td>';
          }).join('')
        + '</tr>';
    }).join('');

    return box('info', 'Ablauf: Radlasten erfassen (A), Fahrzeug anheben bis alle '
      + 'R&auml;der frei sind, wieder absetzen, Settling <strong>identisch</strong> '
      + 'wiederholen (B), ein drittes Mal (C). Reine Radlasten &ndash; ohne '
      + 'am Fahrwerk etwas zu ver&auml;ndern.')
      + '<div style="overflow-x:auto;-webkit-overflow-scrolling:touch;">'
      + '<table class="data-table" style="width:100%;min-width:320px;">'
      + '<tr><th style="text-align:left;">Durchgang</th><th>LF</th><th>RF</th><th>LR</th><th>RR</th></tr>'
      + zeilen + '</table></div>'
      + '<div id="bindRepro" style="margin-top:0.6rem;"></div>';
  }

  // ==== 6.2 Camber-Bind ====

  function camberBind() {
    var zeilen = [['vor', 'vor dem Niederdr&uuml;cken'],
                  ['nach', 'nach dem Niederdr&uuml;cken']].map(function (z) {
      return '<tr><td style="text-align:left;">' + z[1] + '</td>'
        + Bind.RAEDER.map(function (r) {
            return '<td>' + kgFeld(Bind.feldCamber(z[0], r)) + '</td>';
          }).join('')
        + '</tr>';
    }).join('');

    return box('info', 'Vorderwagen kr&auml;ftig niederdr&uuml;cken und loslassen, '
      + 'Radlasten vorher und nachher vergleichen. &Auml;ndern sie sich deutlich, '
      + 'hat sich eine Verspannung abgebaut, die vorher mitgemessen wurde.')
      + '<div style="overflow-x:auto;-webkit-overflow-scrolling:touch;">'
      + '<table class="data-table" style="width:100%;min-width:320px;">'
      + '<tr><th style="text-align:left;">Zustand</th><th>LF</th><th>RF</th><th>LR</th><th>RR</th></tr>'
      + zeilen + '</table></div>'
      + '<div id="bindCb" style="margin-top:0.6rem;"></div>';
  }

  // ==== 6.3 Laterale Ueberbestimmung ====

  function lateral() {
    var namen = [['a', 'A &ndash; Istzustand'],
                 ['b', 'B &ndash; Panhard gel&ouml;st'],
                 ['c', 'C &ndash; Panhard wieder angeschlossen']];
    var zeilen = namen.map(function (z) {
      return '<tr><td style="text-align:left;">' + z[1] + '</td>'
        + Bind.RAEDER.map(function (r) {
            return '<td>' + kgFeld(Bind.feldLateral(z[0], r)) + '</td>';
          }).join('')
        + '</tr>';
    }).join('');

    return box('info', 'Panhard an einem Ende l&ouml;sen, anheben, absetzen, '
      + 'Settling, Radlasten erfassen. Dann ohne Verspannung wieder anschlie&szlig;en: '
      + 'der Bolzen muss <strong>ohne Kraft</strong> passen &ndash; muss gehebelt '
      + 'werden, ist das direkt sichtbare &Uuml;berbestimmung.')
      + '<div style="overflow-x:auto;-webkit-overflow-scrolling:touch;">'
      + '<table class="data-table" style="width:100%;min-width:320px;">'
      + '<tr><th style="text-align:left;">Messung</th><th>LF</th><th>RF</th><th>LR</th><th>RR</th></tr>'
      + zeilen + '</table></div>'
      + '<div id="bindLat" style="margin-top:0.6rem;"></div>';
  }

  // ==== 6.4 Hysterese ====

  function hysterese() {
    var zeilen = [['belastet', 'von oben belasten, loslassen'],
                  ['entlastet', 'anheben, absetzen']].map(function (z) {
      return '<tr><td style="text-align:left;">' + z[1] + '</td>'
        + ['L', 'R'].map(function (s) {
            return '<td>' + mmFeld(Bind.feldHysterese(z[0], s)) + '</td>';
          }).join('')
        + '</tr>';
    }).join('');

    return box('info', 'Ride Height nach dem Belasten und nach dem Entlasten '
      + 'messen. Die Differenz ist die Hysterese. Bei Blattfedern ist eine '
      + 'gewisse Hysterese <strong>bauartbedingt normal</strong> &ndash; '
      + 'entscheidend ist, ob beide Seiten &auml;hnlich sind. Gemessen wird '
      + 'in <strong>mm</strong>, nicht in kg.')
      + '<div style="overflow-x:auto;-webkit-overflow-scrolling:touch;">'
      + '<table class="data-table" style="width:100%;min-width:300px;">'
      + '<tr><th style="text-align:left;">Ride Height</th><th>links</th><th>rechts</th></tr>'
      + zeilen + '</table></div>'
      + '<div id="bindHy" style="margin-top:0.6rem;"></div>';
  }

  // ==== Projektregeln ====

  function regeln() {
    return box('warnung', '<strong>Projektregeln (Kapitel 8):</strong>'
      + '<ol style="margin:0.4rem 0 0 1rem;padding:0;font-size:0.8rem;">'
      + '<li>Vor jeder Setup-Session: Reproduzierbarkeitstest nach &sect;6.1. '
      + 'Ohne bestandenen Test keine Zehntelarbeit.</li>'
      + '<li>ARB beim Wiegen immer gel&ouml;st oder nachweislich neutral.</li>'
      + '<li>Panhard-Bolzen muss kraftfrei passen &ndash; sonst L&auml;nge '
      + 'korrigieren, nicht hebeln.</li>'
      + '<li>Jede Buchsen&auml;nderung an der Hinterachse erfordert einen '
      + 'neuen Bind-Test.</li>'
      + '<li>Bei Streuung &uuml;ber 1&nbsp;%: Ursache suchen, nicht mitteln.</li>'
      + '<li>Keine Setup-Schl&uuml;sse aus Messungen mit bekanntem Bind.</li>'
      + '</ol>');
  }

  // ==== Anzeige der Ergebnisse ====

  function marke(bewertung) {
    if (!bewertung) return '';
    var sperrt = Bind.BEWERTUNG[bewertung].sperrt;
    return '<strong>' + esc(Bind.BEWERTUNG[bewertung].text) + '</strong>'
      + (sperrt ? '' : '');
  }

  function zeichneRepro() {
    var ziel = document.getElementById('bindRepro');
    if (!ziel) return;
    var r = Bind.reproduzierbarkeit(daten());

    if (!r) {
      ziel.innerHTML = '<p style="font-size:0.8rem;color:var(--text-light);">'
        + 'F&uuml;r eine Aussage braucht es drei vollst&auml;ndige Durchg&auml;nge. '
        + 'Zwei Durchg&auml;nge ergeben eine Spanne, aber keine '
        + 'Reproduzierbarkeit.</p>';
      return;
    }

    var ecken = r.ecken.map(function (e) {
      return '<tr><td style="text-align:left;">' + e.rad + '</td>'
        + '<td>' + e.werte.join(' / ') + '</td>'
        + '<td>' + zz(e.spanne, 0) + ' kg</td>'
        + '<td>' + zz(e.prozent, 3) + ' %</td></tr>';
    }).join('');

    // Das Diagonalmass wird ausgewiesen, nicht bewertet: das Kapitel haelt
    // seine Schwelle ausdruecklich offen, bis reale Messreihen vorliegen.
    var richt = r.richtungen ? ('<h3 style="font-size:0.82rem;color:var(--primary);'
      + 'margin:0.8rem 0 0.3rem;">Wandert Last diagonal?</h3>'
      + '<div style="overflow-x:auto;"><table class="data-table" style="width:100%;">'
      + '<tr><th style="text-align:left;">gegen&uuml;ber A</th>'
      + '<th>Diagonal</th><th>L&auml;ngs</th><th>Quer</th></tr>'
      + r.richtungen.proDurchgang.map(function (x) {
          return '<tr><td style="text-align:left;">Messung ' + x.durchgang + '</td>'
            + '<td>' + zz(x.diagonal, 1) + ' kg</td>'
            + '<td>' + zz(x.laengs, 1) + ' kg</td>'
            + '<td>' + zz(x.quer, 1) + ' kg</td></tr>';
        }).join('')
      + '</table></div>'
      + box('info', '<strong>Keine Schwelle.</strong> Das Kapitel nennt f&uuml;r '
        + 'das Diagonalmass noch keine Grenze &ndash; sie l&auml;sst sich erst '
        + 'aus realen Messreihen ableiten. Ein deutlich gr&ouml;&szlig;eres '
        + 'Diagonalmass als L&auml;ngs- und Quermass deutet auf Verspannung; '
        + 'die Beurteilung liegt beim Menschen.')) : '';

    ziel.innerHTML = box('info',
      '<strong>Bewertung:</strong> ' + marke(r.bewertung)
      + (r.vollstaendig ? '' : ' &ndash; <em>unvollst&auml;ndig</em>'))
      + '<div style="overflow-x:auto;"><table class="data-table" style="width:100%;">'
      + '<tr><th style="text-align:left;">Ecke</th><th>Werte (kg)</th>'
      + '<th>Spanne</th><th>in %</th></tr>' + ecken + '</table></div>'
      + '<p style="font-size:0.78rem;color:var(--text-light);margin:0.4rem 0;">'
      + 'Gesamtmasse je Durchgang: ' + r.masse.werte.join(' / ') + ' kg '
      + '(Spanne ' + zz(r.masse.spanne, 0) + ' kg). Die Prozentangabe bezieht '
      + 'sich auf die Gesamtmasse aus dem ersten Durchgang.</p>'
      + richt;
  }

  function zeichneCb() {
    var ziel = document.getElementById('bindCb');
    if (!ziel) return;
    var r = Bind.camberBind(daten());
    if (!r) {
      ziel.innerHTML = '<p style="font-size:0.8rem;color:var(--text-light);">'
        + 'Radlasten vorher und nachher eintragen.</p>';
      return;
    }
    var zeilen = r.ecken.map(function (e) {
      return '<tr><td style="text-align:left;">' + e.rad + '</td>'
        + '<td>' + zz(e.vorher, 0) + '</td><td>' + zz(e.nachher, 0) + '</td>'
        + '<td>' + (e.differenz > 0 ? '+' : '') + zz(e.differenz, 0) + '</td>'
        + '<td>' + zz(e.prozent, 3) + ' %</td></tr>';
    }).join('');
    ziel.innerHTML = box('info', '<strong>Bewertung:</strong> ' + marke(r.bewertung)
      + ' &ndash; gr&ouml;&szlig;te &Auml;nderung ' + zz(r.maxProzent, 3) + ' %.')
      + '<div style="overflow-x:auto;"><table class="data-table" style="width:100%;">'
      + '<tr><th style="text-align:left;">Ecke</th><th>vorher</th><th>nachher</th>'
      + '<th>&Delta;</th><th>in %</th></tr>' + zeilen + '</table></div>';
  }

  function zeichneLat() {
    var ziel = document.getElementById('bindLat');
    if (!ziel) return;
    var r = Bind.lateral(daten());
    if (!r) {
      ziel.innerHTML = '<p style="font-size:0.8rem;color:var(--text-light);">'
        + 'Alle drei Messungen eintragen (A, B, C).</p>';
      return;
    }
    ziel.innerHTML = box(r.deutung.sperrt ? 'warnung' : 'info',
      '<strong>Deutung:</strong> ' + r.deutung.text)
      + '<table class="data-table" style="width:100%;margin-top:0.5rem;">'
      + '<tr><td style="text-align:left;">A gegen&uuml;ber B</td><td>' + zz(r.abweichungAB, 3) + ' %</td></tr>'
      + '<tr><td style="text-align:left;">B gegen&uuml;ber C</td><td>' + zz(r.abweichungBC, 3) + ' %</td></tr>'
      + '<tr><td style="text-align:left;">A gegen&uuml;ber C</td><td>' + zz(r.abweichungAC, 3) + ' %</td></tr>'
      + '</table>'
      + '<p style="font-size:0.78rem;color:var(--text-light);margin:0.4rem 0 0;">'
      + 'Als &bdquo;gleich&ldquo; gilt eine Abweichung bis '
      + zz(Bind.SCHWELLE_GUT, 1) + ' % der Gesamtmasse &ndash; die '
      + 'Wiederholgrenze aus &sect;6.1.</p>';
  }

  function zeichneHy() {
    var ziel = document.getElementById('bindHy');
    if (!ziel) return;
    var r = Bind.hysterese(daten());
    if (!r) {
      ziel.innerHTML = '<p style="font-size:0.8rem;color:var(--text-light);">'
        + 'Ride Height belastet und entlastet eintragen &ndash; links und rechts.</p>';
      return;
    }
    var zeilen = r.seiten.map(function (s) {
      return '<tr><td style="text-align:left;">' + s.seite + '</td>'
        + '<td>' + zz(s.belastet, 0) + ' mm</td>'
        + '<td>' + zz(s.entlastet, 0) + ' mm</td>'
        + '<td>' + zz(s.hysterese, 0) + ' mm</td></tr>';
    }).join('');
    var deutung = r.groessere === null
      ? 'Beide Seiten &auml;hnlich &ndash; f&uuml;r eine Blattfeder normal.'
      : 'Seite <strong>' + r.groessere + '</strong> hat die gr&ouml;&szlig;ere '
        + 'Hysterese &ndash; Verdacht auf Bind oder ein Bauteilproblem auf '
        + 'dieser Seite.';
    ziel.innerHTML = box(r.groessere === null ? 'info' : 'warnung',
      '<strong>Deutung:</strong> ' + deutung
      + ' Differenz links/rechts: ' + zz(r.differenz, 0) + ' mm.')
      + '<div style="overflow-x:auto;"><table class="data-table" style="width:100%;">'
      + '<tr><th style="text-align:left;">Seite</th><th>belastet</th>'
      + '<th>entlastet</th><th>Hysterese</th></tr>' + zeilen + '</table></div>'
      + box('info', '<strong>Keine absolute Schwelle.</strong> Das Kapitel nennt '
        + 'nur, dass die Seiten &auml;hnlich sein sollen &ndash; einen Grenzwert '
        + 'gibt es nicht. Eine erfundene Zahl w&auml;re hier ein Sollwert ohne '
        + 'Quelle.');
  }

  // ==== Urteil ====

  function zeichneUrteil() {
    var ziel = document.getElementById('bindUrteil');
    if (!ziel) return;
    var bf = Bind.befund(daten());

    var inhalt;
    if (!bf.geprueft) {
      inhalt = box('info', '<strong>Noch nicht gepr&uuml;ft.</strong> Der '
        + 'verbindliche Test ist &sect;6.1 mit <strong>drei vollst&auml;ndigen '
        + 'Messungen</strong>. Ein fehlender Test ist nicht dasselbe wie ein '
        + 'bestandener &ndash; ohne ihn gilt nicht &bdquo;kein Bind&ldquo;, '
        + 'sondern &bdquo;unbekannt&ldquo;.');
    } else if (bf.sperrt) {
      inhalt = box('warnung', '<strong>Setup-Arbeit gesperrt.</strong>'
        + '<ul style="margin:0.4rem 0 0 1rem;padding:0;font-size:0.8rem;">'
        + bf.gruende.map(function (g) { return '<li>' + esc(g) + '</li>'; }).join('')
        + '</ul>'
        + '<p style="margin:0.5rem 0 0;font-size:0.8rem;">Erst die Ursache '
        + 'kl&auml;ren. Bei vorhandenem Bind w&uuml;rde jede Einstellung gegen '
        + 'ein Rauschen laufen.</p>');
    } else {
      inhalt = box('info', '<strong>Setup-Arbeit m&ouml;glich.</strong> Die '
        + 'Radlasten streuen innerhalb der Wiederholgrenze (gr&ouml;&szlig;te '
        + 'Streuung ' + zz(bf.reproduzierbarkeit.maxProzent, 3) + ' % der '
        + 'Gesamtmasse).');
    }
    ziel.innerHTML = inhalt;
    zeichneVorStand();
  }

  function zeichneVorStand() {
    var el = document.getElementById('bindVorStand');
    if (!el) return;
    var ids = ['bind_vor_raceready', 'bind_vor_pad', 'bind_vor_arb', 'bind_vor_lenkung'];
    var offen = ids.filter(function (id) { return !wert(id); });
    el.textContent = offen.length
      ? 'Noch offen: ' + offen.length + ' von ' + ids.length + ' Voraussetzungen.'
      : 'Alle Voraussetzungen abgehakt.';
  }

  function zeichneErgebnisse() {
    zeichneUrteil();
    zeichneRepro();
    zeichneCb();
    zeichneLat();
    zeichneHy();
  }

  // ==== Aufbau ====

  function zeichnen() {
    var ziel = document.getElementById('bindListe');
    if (!ziel) return;
    ziel.innerHTML =
      abschnitt('sec-bind-vor', '\u2714', 'Voraussetzungen', voraussetzungen())
      + abschnitt('sec-bind-61', '\ud83d\udccf', '6.1 Reproduzierbarkeit der Radlasten', messreihe())
      + abschnitt('sec-bind-62', '\u21c5', '6.2 Sichttest auf Camber-Bind', camberBind())
      + abschnitt('sec-bind-63', '\ud83d\udd17', '6.3 Laterale &Uuml;berbestimmung', lateral())
      + abschnitt('sec-bind-64', '\u2195', '6.4 Hysterese', hysterese())
      + abschnitt('sec-bind-regeln', '\u26a0', 'Projektregeln', regeln());
  }

  function init() {
    if (typeof Bind === 'undefined') return;
    zeichnen();

    // app.js hat beim Laden schon eingetragen - da gab es die Felder aber
    // noch nicht, sie entstehen erst in zeichnen().
    FieldSync.anwenden(FieldSync.lesen());

    if (typeof Validation !== 'undefined') Validation.init(document);
    zeichneErgebnisse();
  }

  document.addEventListener('input', function (e) {
    if (e.target && e.target.dataset && e.target.dataset.field) zeichneErgebnisse();
  });

  window.bindAktualisieren = zeichneErgebnisse;
  window.bindAufbauen = zeichnen;

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
