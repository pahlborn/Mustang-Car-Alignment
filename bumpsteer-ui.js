/**
 * bumpsteer-ui.js - Darstellung des Bump-Steer-Messblatts.
 *
 * Aufbau folgt dem Template: erst die Vorbereitung mit den Pruefpunkten,
 * dann die Messreihe, dann Kurve und Auswertung.
 *
 * Die Pruefpunkte stehen VOR der Tabelle, nicht daneben. A5 - die Pruefung
 * der Arretierung - entscheidet, ob die ganze Reihe verwertbar ist; wer sie
 * erst nach dem Messen liest, hat umsonst gemessen.
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

  function daten() {
    var d = {};
    var felder = document.querySelectorAll('[data-field]');
    for (var i = 0; i < felder.length; i++) {
      d[felder[i].dataset.field] = felder[i].type === 'checkbox'
        ? felder[i].checked : felder[i].value;
    }
    return d;
  }

  function zz(v, n) {
    return (v === null || v === undefined) ? '\u2013' : v.toFixed(n === undefined ? 2 : n);
  }

  function eingabe(id, opt) {
    opt = opt || {};
    var attr = ' data-field="' + esc(id) + '"';
    if (opt.groesse) attr += ' data-groesse="' + esc(opt.groesse) + '"';
    if (opt.regel) attr += ' data-validate="' + esc(opt.regel) + '"';
    if (opt.platzhalter) attr += ' placeholder="' + esc(opt.platzhalter) + '"';
    return '<input type="text"' + attr + ' inputmode="decimal" oninput="autoSave()"'
      + ' style="width:100%;padding:0.35rem;border:1px solid var(--border);'
      + 'border-radius:6px;background:var(--input-bg);font-size:0.82rem;'
      + 'min-height:34px;text-align:right;">';
  }

  function haken(id, text, warnung) {
    return '<label style="display:flex;gap:0.5rem;align-items:flex-start;'
      + 'padding:0.35rem 0;font-size:0.8rem;border-bottom:1px solid var(--border);">'
      + '<input type="checkbox" data-field="' + esc(id) + '" onchange="autoSave();bumpsteerZeichnen()"'
      + ' style="width:20px;height:20px;flex-shrink:0;margin-top:0.1rem;">'
      + '<span>' + text
      + (warnung ? '<br><span style="color:var(--text-light);font-size:0.72rem;">'
          + warnung + '</span>' : '')
      + '</span></label>';
  }

  // ==== Abschnitte ====

  function vorbereitung() {
    return '<div class="section" id="sec-bs-vorbereitung">'
      + '<div class="section-header" onclick="toggleSection(this)">'
      + '<span class="section-icon">\u2714</span><h2>Vorbereitung</h2></div>'
      + '<div class="section-body">'
      + '<div class="warning-box">Ohne diese Punkte ist die Messreihe nicht '
      + 'verwertbar. Besonders <strong>A5</strong>: ein verspanntes oder '
      + 'bewegliches Lenkgest&auml;nge erzeugt eine Kurve, die Spiel zeigt '
      + 'statt Bump Steer.</div>'
      + haken('bs_raceready', 'Race-Ready-Zustand hergestellt, Fahrzeug gesetzt')
      + haken('bs_ridehoehe_fix', 'Ride Height dokumentiert &ndash; sie ist der Nullpunkt der Messung')
      + haken('bs_bind', 'Bind-Test bestanden',
              'Ein verspanntes Fahrwerk bewegt sich ungleichm&auml;&szlig;ig. Die Kurve w&auml;re eine Mischung aus Bump Steer und Reibung.')
      + haken('bs_spiel', 'Radlager, Spurstangenk&ouml;pfe, Idler und Pitman spielfrei',
              'Spiel erzeugt eine scheinbare Toe-&Auml;nderung, die von der Bewegungsrichtung abh&auml;ngt.')
      + haken('bs_feder_entlastet', 'Feder entlastet, D&auml;mpfer gel&ouml;st, Chassis fest abgest&uuml;tzt')
      + haken('bs_a5_geprueft',
              '<strong>A5 &ndash; Arretierung gepr&uuml;ft:</strong> Spurstange am Radtr&auml;ger gegriffen, '
              + 'mit kr&auml;ftigem Handdruck bewegt, Center Link dabei beobachtet',
              'Am Mustang reicht eine Arretierung am Lenkrad nicht: zwischen Lenkrad und Spurstange liegen '
              + 'Lenks&auml;ule, Lenkgetriebe, Pitman, Center Link und Idler. Longacre verlangt ausdr&uuml;cklich, '
              + 'dass der Center Link nicht wandert.')
      + '<div class="info-box" style="margin-top:0.6rem;">'
      + '<strong>Ablesegenauigkeit:</strong> Das BGR310 zeigt 0,01 mm an, ist aber auf '
      + '<strong>0,1 mm</strong> genau. Werte auf 0,01 mm notieren, nur auf 0,1 mm '
      + 'interpretieren &ndash; eine Differenz von 0,05 mm liegt in der Ger&auml;tetoleranz.</div>'
      + '</div></div>';
  }

  function messreihe() {
    var stufen = BumpSteer.stufen(true);
    var kopf = '<tr><th style="text-align:left;">Federweg</th><th>LF</th><th>RF</th></tr>';

    var zeilen = stufen.map(function (w) {
      var null0 = w === 0;
      var label = (w > 0 ? '+' : '') + w + ' mm'
        + (null0 ? ' <span style="color:var(--text-light);">Referenz</span>' : '')
        + (BumpSteer.FEIN.indexOf(w) > -1
            ? '<br><span style="color:var(--text-light);font-size:0.68rem;">fein</span>' : '');

      return '<tr' + (null0 ? ' style="background:var(--input-bg);"' : '') + '>'
        + '<td style="text-align:left;font-weight:' + (null0 ? '700' : '400') + ';">'
        + label + '</td>'
        + BumpSteer.SEITEN.map(function (s) {
            return '<td>' + eingabe(BumpSteer.feldName(s, w),
              { regel: 'numeric:-20:20', groesse: 'bump_steer' }) + '</td>';
          }).join('')
        + '</tr>';
    }).join('');

    var nullkontrolle = BumpSteer.SEITEN.map(function (s) {
      return '<div class="spec-item" style="align-items:center;">'
        + '<span class="spec-label">Nullpunkt ' + s + ' nach Bump / nach Droop<br>'
        + '<span style="font-size:0.68rem;">muss wieder 0 zeigen &ndash; sonst hat sich '
        + 'etwas bewegt</span></span>'
        + '<span style="flex:0 0 190px;display:flex;gap:0.4rem;">'
        + eingabe('bs_null_' + s.toLowerCase() + '_bump', { regel: 'numeric:-5:5' })
        + eingabe('bs_null_' + s.toLowerCase() + '_droop', { regel: 'numeric:-5:5' })
        + '</span></div>';
    }).join('');

    return '<div class="section" id="sec-bs-messung">'
      + '<div class="section-header" onclick="toggleSection(this)">'
      + '<span class="section-icon">\ud83d\udccf</span><h2>Messreihe</h2></div>'
      + '<div class="section-body">'
      + '<div class="info-box">Von Null nach Bump durcharbeiten, zur&uuml;ck auf Null, '
      + 'Nullpunkt pr&uuml;fen. Dann von Null nach Droop. <strong>Immer in eine '
      + 'Richtung</strong> &ndash; nicht hin- und herpendeln, sonst &uuml;berlagert '
      + 'Spiel die Messung.</div>'
      + '<div style="overflow-x:auto;-webkit-overflow-scrolling:touch;">'
      + '<table class="data-table" style="width:100%;min-width:300px;">'
      + kopf + zeilen + '</table></div>'
      + '<h3 style="font-size:0.82rem;color:var(--primary);margin:0.8rem 0 0.3rem;">'
      + 'Nullpunktkontrolle</h3>' + nullkontrolle
      + '</div></div>';
  }

  function fenster() {
    return '<div class="section" id="sec-bs-fenster">'
      + '<div class="section-header" onclick="toggleSection(this)">'
      + '<span class="section-icon">\u2194</span><h2>Arbeitsfenster</h2></div>'
      + '<div class="section-body">'
      + '<div class="info-box">Ein Toe-Ausschlag bei &minus;50 mm ist bedeutungslos, '
      + 'wenn die Aufh&auml;ngung dort nie arbeitet. Das Fenster begrenzt die '
      + 'Auswertung auf den real genutzten Federweg.</div>'
      + '<div class="spec-item" style="align-items:center;">'
      + '<span class="spec-label">Droop-Grenze (negativ)</span>'
      + '<span style="flex:0 0 120px;">'
      + eingabe('bs_fenster_von', { regel: 'numeric:-60:0', platzhalter: '-25' })
      + '</span></div>'
      + '<div class="spec-item" style="align-items:center;">'
      + '<span class="spec-label">Bump-Grenze = Bump-Stop-Abstand</span>'
      + '<span style="flex:0 0 120px;">'
      + eingabe('bs_fenster_bis', { regel: 'numeric:0:60', platzhalter: '25' })
      + '</span></div>'
      + '</div></div>';
  }

  function auswertung() {
    return '<div class="section" id="sec-bs-kurve">'
      + '<div class="section-header" onclick="toggleSection(this)">'
      + '<span class="section-icon">\ud83d\udcc8</span><h2>Kurve und Auswertung</h2></div>'
      + '<div class="section-body">'
      + '<div id="bsBefunde"></div>'
      + '<div style="margin:0.6rem 0;"><canvas id="bsChart"></canvas></div>'
      + '<div id="bsKennwerte"></div>'
      + '<div class="info-box"><strong>Kein Zielwert.</strong> Bump Steer wird '
      + '<em>minimiert</em>, nicht auf eine Zahl eingestellt. Der fr&uuml;her '
      + 'diskutierte Richtwert von 0,020&Prime; je 1&Prime; Federweg ist im Handbuch '
      + 'ausdr&uuml;cklich als nicht belegt markiert und wird hier nicht verwendet.</div>'
      + '<div class="info-box">Bump Steer wird <strong>geometrisch</strong> korrigiert, '
      + 'nicht mit statischem Toe &uuml;berdeckt. Statisches Toe verschiebt nur den '
      + 'Ausgangswert, nicht die Kurvenform.</div>'
      + '</div></div>';
  }

  // ==== Auswertung zeichnen ====

  function fensterLesen() {
    var von = BumpSteer.zahl(wert('bs_fenster_von'));
    var bis = BumpSteer.zahl(wert('bs_fenster_bis'));
    if (von === null || bis === null) return null;
    return { von: Math.min(von, bis), bis: Math.max(von, bis) };
  }

  function zeichneAuswertung() {
    var d = daten();
    var f = fensterLesen();

    var reihen = {};
    BumpSteer.SEITEN.forEach(function (s) {
      reihen[s] = BumpSteer.punkte(d, s, true);
    });

    var canvas = document.getElementById('bsChart');
    if (canvas && typeof BumpSteerChart !== 'undefined') {
      BumpSteerChart.zeichnen(canvas, reihen, { fenster: f });
    }

    // Befunde zur Messung - sie stehen oben, weil sie entscheiden, ob die
    // Kennwerte darunter ueberhaupt etwas bedeuten.
    var ziel = document.getElementById('bsBefunde');
    if (ziel) {
      var alle = [];
      BumpSteer.SEITEN.forEach(function (s) {
        if (!reihen[s].length) return;
        BumpSteer.pruefen(d, s).forEach(function (b) {
          alle.push({ seite: s, art: b.art, text: b.text });
        });
      });
      // Gleiche Befunde beider Seiten einmal nennen.
      var gesehen = {};
      alle = alle.filter(function (b) {
        if (gesehen[b.text]) return false;
        gesehen[b.text] = true;
        return true;
      });

      ziel.innerHTML = alle.length
        ? alle.map(function (b) {
            return '<div class="' + (b.art === 'fehler' ? 'warning-box' : 'info-box') + '">'
              + (b.art === 'fehler' ? '<strong>Nicht verwertbar:</strong> ' : '')
              + esc(b.text) + '</div>';
          }).join('')
        : '';
    }

    // Kennwerte
    var kz = document.getElementById('bsKennwerte');
    if (!kz) return;

    var kl = BumpSteer.kennwerte(reihen.LF, f);
    var kr = BumpSteer.kennwerte(reihen.RF, f);
    if (!kl && !kr) {
      kz.innerHTML = '<p style="font-size:0.8rem;color:var(--text-light);">'
        + 'Mindestens zwei Messpunkte je Seite eintragen.</p>';
      return;
    }

    function zeile(label, l, r, hinweis) {
      return '<tr><td style="text-align:left;">' + label
        + (hinweis ? '<br><span style="color:var(--text-light);font-size:0.68rem;">'
            + hinweis + '</span>' : '')
        + '</td><td>' + l + '</td><td>' + r + '</td></tr>';
    }

    var sym = BumpSteer.symmetrie(reihen.LF, reihen.RF, f);

    kz.innerHTML = '<div style="overflow-x:auto;">'
      + '<table class="data-table" style="width:100%;">'
      + '<tr><th style="text-align:left;">Kennwert' + (f ? ' im Fenster' : '')
      + '</th><th>LF</th><th>RF</th></tr>'
      + zeile('max. Toe-in', kl ? zz(kl.maxToeIn) : '\u2013', kr ? zz(kr.maxToeIn) : '\u2013')
      + zeile('max. Toe-out', kl ? zz(kl.maxToeOut) : '\u2013', kr ? zz(kr.maxToeOut) : '\u2013')
      + zeile('Gesamtausschlag', kl ? zz(kl.ausschlag) : '\u2013', kr ? zz(kr.ausschlag) : '\u2013')
      + zeile('Kurve monoton?',
              kl ? (kl.monoton ? 'ja' : 'nein') : '\u2013',
              kr ? (kr.monoton ? 'ja' : 'nein') : '\u2013',
              'ein Richtungswechsel ist ein eigener Befund')
      + zeile('Steigung um Null',
              kl && kl.steigungUmNull !== null ? zz(kl.steigungUmNull, 3) : '\u2013',
              kr && kr.steigungUmNull !== null ? zz(kr.steigungUmNull, 3) : '\u2013',
              'mm Toe je mm Federweg')
      + zeile('Nulldurchgang bei',
              kl && kl.nulldurchgang !== null ? zz(kl.nulldurchgang, 1) + ' mm' : '\u2013',
              kr && kr.nulldurchgang !== null ? zz(kr.nulldurchgang, 1) + ' mm' : '\u2013')
      + '</table></div>'
      + (sym && sym.maxDifferenz !== null
          ? '<div class="info-box"><strong>Symmetrie:</strong> gr&ouml;&szlig;te '
            + 'Differenz LF\u2212RF ' + zz(sym.maxDifferenz) + ' mm, Richtung '
            + (sym.gleicheRichtung ? 'gleich' : '<strong>unterschiedlich</strong>')
            + '. Asymmetrie ist ein eigener Befund &ndash; m&ouml;gliche Ursachen: '
            + 'Tie-Rod-Geometrie, Idler/Pitman-H&ouml;hendifferenz, Chassistoleranz, '
            + 'verbogenes Teil, unterschiedliche Ride Height.</div>'
          : '');
  }

  // ==== Start ====

  function zeichnen() {
    var ziel = document.getElementById('bsListe');
    if (!ziel) return;
    ziel.innerHTML = vorbereitung() + messreihe() + fenster() + auswertung();
  }

  function init() {
    if (typeof BumpSteer === 'undefined') return;
    zeichnen();

    try {
      var gespeichert = JSON.parse(localStorage.getItem('chassisSetup') || '{}');
      var felder = document.querySelectorAll('[data-field]');
      for (var i = 0; i < felder.length; i++) {
        var v = gespeichert[felder[i].dataset.field];
        if (v === undefined) continue;
        if (felder[i].type === 'checkbox') felder[i].checked = !!v;
        else felder[i].value = v;
      }
    } catch (e) {}

    if (typeof Validation !== 'undefined') Validation.init(document);
    zeichneAuswertung();
  }

  document.addEventListener('input', function (e) {
    if (e.target && e.target.dataset && e.target.dataset.field) zeichneAuswertung();
  });

  // Die Kurve haengt an der Breite ihres Containers - beim Drehen des
  // Geraets muss sie neu gezeichnet werden.
  var resizeTimer = null;
  window.addEventListener('resize', function () {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(zeichneAuswertung, 150);
  });

  window.bumpsteerZeichnen = zeichneAuswertung;
  window.bumpsteerAufbauen = zeichnen;

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
