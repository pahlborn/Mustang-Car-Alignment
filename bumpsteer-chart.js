/**
 * bumpsteer-chart.js - die Kurve.
 *
 * Toe-Aenderung ueber Federweg, LF und RF in dasselbe Diagramm. Das Template
 * sagt warum: "unterschiedliche Farben - so wird die Symmetrie sofort
 * sichtbar."
 *
 * Achsen nach CONVENTIONS 10:
 *   x  Federweg, positiv = Bump, nach oben im Diagramm nach rechts
 *   y  Toe-Aenderung, positiv = Toe-in, nach oben
 *
 * Kein Zielband, keine Ampel. Das Template: "Bump Steer wird minimiert, nicht
 * auf einen Zahlenwert eingestellt." Ein eingezeichneter Grenzwert waere
 * genau die Zahl, die es dort nicht gibt.
 */
(function (global) {
  'use strict';

  var FARBE = {
    LF: '#2b6cb0',
    RF: '#c53030',
    raster: '#e2e8f0',
    achse: '#718096',
    text: '#4a5568',
    fenster: 'rgba(56,161,105,0.08)'
  };

  var SCHRIFT = '11px -apple-system, BlinkMacSystemFont, sans-serif';

  /**
   * Canvas auf die Pixeldichte einstellen.
   *
   * Ohne das ist die Kurve auf einem Telefon unscharf - dort liegt das
   * Verhaeltnis bei 2 oder 3.
   */
  function vorbereiten(canvas, breite, hoehe) {
    var dpr = global.devicePixelRatio || 1;
    canvas.width = breite * dpr;
    canvas.height = hoehe * dpr;
    canvas.style.width = breite + 'px';
    canvas.style.height = hoehe + 'px';
    var ctx = canvas.getContext('2d');
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    return ctx;
  }

  /**
   * Y-Bereich aus den Daten, auf glatte Schritte gerundet.
   *
   * Eine feste Skala waere entweder zu grob fuer eine gute Messung oder zu
   * eng fuer eine schlechte. Mindestens +/- 0,5 mm, damit eine ruhige Kurve
   * nicht als Zickzack erscheint.
   */
  function yBereich(reihen) {
    var alle = [];
    for (var k in reihen) {
      (reihen[k] || []).forEach(function (p) { alle.push(p.y); });
    }
    if (!alle.length) return { min: -1, max: 1, schritt: 0.5 };

    var max = Math.max.apply(null, alle);
    var min = Math.min.apply(null, alle);
    var spanne = Math.max(Math.abs(max), Math.abs(min), 0.5);

    var schritt = spanne <= 0.5 ? 0.25 : (spanne <= 1.5 ? 0.5 : (spanne <= 4 ? 1 : 2));
    var grenze = Math.ceil(spanne / schritt) * schritt;
    return { min: -grenze, max: grenze, schritt: schritt };
  }

  /**
   * @param {HTMLCanvasElement} canvas
   * @param {object} reihen  { LF: [{x,y}], RF: [{x,y}] }
   * @param {object} [opt]   { fenster: {von, bis} }
   */
  function zeichnen(canvas, reihen, opt) {
    opt = opt || {};
    var breite = (canvas.parentElement && canvas.parentElement.offsetWidth) || 360;
    var hoehe = Math.min(breite * 0.62, 340);
    var ctx = vorbereiten(canvas, breite, hoehe);

    var rand = { links: 46, rechts: 12, oben: 14, unten: 34 };
    var pb = breite - rand.links - rand.rechts;
    var ph = hoehe - rand.oben - rand.unten;

    var xMin = -55, xMax = 55;
    var y = yBereich(reihen);

    function px(v) { return rand.links + (v - xMin) / (xMax - xMin) * pb; }
    function py(v) { return rand.oben + (y.max - v) / (y.max - y.min) * ph; }

    ctx.clearRect(0, 0, breite, hoehe);
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, breite, hoehe);

    // Arbeitsfenster hinterlegen - ausserhalb ist ein Ausschlag belanglos,
    // weil die Aufhaengung dort nie arbeitet (Template E1).
    if (opt.fenster && opt.fenster.von !== undefined && opt.fenster.bis !== undefined) {
      ctx.fillStyle = FARBE.fenster;
      ctx.fillRect(px(opt.fenster.von), rand.oben,
                   px(opt.fenster.bis) - px(opt.fenster.von), ph);
    }

    // Raster
    ctx.strokeStyle = FARBE.raster;
    ctx.lineWidth = 1;
    ctx.font = SCHRIFT;
    ctx.fillStyle = FARBE.text;

    for (var v = y.min; v <= y.max + 1e-9; v += y.schritt) {
      var yy = Math.round(py(v)) + 0.5;
      ctx.beginPath(); ctx.moveTo(rand.links, yy); ctx.lineTo(breite - rand.rechts, yy); ctx.stroke();
      ctx.textAlign = 'right'; ctx.textBaseline = 'middle';
      ctx.fillText(v.toFixed(y.schritt < 1 ? 2 : 1), rand.links - 6, yy);
    }
    for (var x = -50; x <= 50; x += 25) {
      var xx = Math.round(px(x)) + 0.5;
      ctx.beginPath(); ctx.moveTo(xx, rand.oben); ctx.lineTo(xx, hoehe - rand.unten); ctx.stroke();
      ctx.textAlign = 'center'; ctx.textBaseline = 'top';
      ctx.fillText(String(x), xx, hoehe - rand.unten + 6);
    }

    // Nulllinien kraeftiger - sie sind die Referenz, nicht nur Raster.
    ctx.strokeStyle = FARBE.achse;
    ctx.lineWidth = 1.2;
    ctx.beginPath();
    ctx.moveTo(rand.links, Math.round(py(0)) + 0.5);
    ctx.lineTo(breite - rand.rechts, Math.round(py(0)) + 0.5);
    ctx.moveTo(Math.round(px(0)) + 0.5, rand.oben);
    ctx.lineTo(Math.round(px(0)) + 0.5, hoehe - rand.unten);
    ctx.stroke();

    // Achsenbeschriftung
    ctx.fillStyle = FARBE.text;
    ctx.textAlign = 'center'; ctx.textBaseline = 'bottom';
    ctx.fillText('Federweg (mm) \u2013 positiv = Bump', breite / 2, hoehe - 2);
    ctx.save();
    ctx.translate(10, hoehe / 2);
    ctx.rotate(-Math.PI / 2);
    ctx.textBaseline = 'top';
    ctx.fillText('Toe (mm) \u2013 positiv = Toe-in', 0, 0);
    ctx.restore();

    // Kurven
    var legende = [];
    ['LF', 'RF'].forEach(function (seite) {
      var p = (reihen[seite] || []).slice().sort(function (a, b) { return a.x - b.x; });
      if (!p.length) return;
      legende.push(seite);

      ctx.strokeStyle = FARBE[seite];
      ctx.lineWidth = 2;
      ctx.beginPath();
      p.forEach(function (q, i) {
        if (i === 0) ctx.moveTo(px(q.x), py(q.y));
        else ctx.lineTo(px(q.x), py(q.y));
      });
      ctx.stroke();

      // Messpunkte sichtbar lassen: zwischen ihnen ist interpoliert, nicht
      // gemessen - das soll man sehen.
      ctx.fillStyle = FARBE[seite];
      p.forEach(function (q) {
        ctx.beginPath();
        ctx.arc(px(q.x), py(q.y), 2.6, 0, Math.PI * 2);
        ctx.fill();
      });
    });

    if (legende.length) {
      ctx.font = SCHRIFT;
      ctx.textAlign = 'left'; ctx.textBaseline = 'middle';
      var lx = rand.links + 8, ly = rand.oben + 10;
      legende.forEach(function (seite) {
        ctx.strokeStyle = FARBE[seite];
        ctx.lineWidth = 2;
        ctx.beginPath(); ctx.moveTo(lx, ly); ctx.lineTo(lx + 16, ly); ctx.stroke();
        ctx.fillStyle = FARBE.text;
        ctx.fillText(seite, lx + 21, ly);
        lx += 52;
      });
    } else {
      ctx.fillStyle = FARBE.text;
      ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
      ctx.fillText('Noch keine Messwerte', breite / 2, hoehe / 2);
    }

    return { breite: breite, hoehe: hoehe, yMin: y.min, yMax: y.max, kurven: legende };
  }

  global.BumpSteerChart = {
    FARBE: FARBE,
    zeichnen: zeichnen,
    yBereich: yBereich
  };
})(typeof window !== 'undefined' ? window : globalThis);
