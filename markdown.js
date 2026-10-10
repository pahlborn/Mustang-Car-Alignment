/**
 * markdown.js - der Teil von Markdown, den das Handbuch benutzt.
 *
 * Kein vollstaendiger Parser und keine Bibliothek. Das Handbuch haelt ein
 * enges Format durch: Ueberschriften, Tabellen, Listen, Blockzitate,
 * Codebloecke, Fettdruck, Code, Links. Mehr kommt nicht vor, und was nicht
 * vorkommt, soll auch nicht unterstuetzt werden - ungenutzte Faelle sind
 * ungeprueft.
 *
 * SICHERHEIT
 *
 * Es wird zuerst escaped, dann ausgezeichnet. Ein Kapitel, das `<script>`
 * enthaelt, soll das Wort zeigen und nichts ausfuehren. Der Glossar-Renderer
 * in nachschlagen.js macht das genauso; hier steht die ausgebaute Fassung,
 * und das Glossar benutzt sie mit.
 *
 * LINKS AUF KAPITELDATEIEN
 *
 * Das Handbuch verlinkt querbeet auf andere .md-Dateien. Als normale Links
 * wuerden sie den Leser aus der Anwendung tragen; sie werden darum auf die
 * Handbuchseite umgebogen.
 */
(function (global) {
  'use strict';

  function esc(s) {
    return String(s == null ? '' : s)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;')
      .replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }

  /** Anker aus einer Ueberschrift - fuer das Inhaltsverzeichnis. */
  function anker(text) {
    return String(text).toLowerCase()
      .replace(/[\u00e4]/g, 'ae').replace(/[\u00f6]/g, 'oe')
      .replace(/[\u00fc]/g, 'ue').replace(/[\u00df]/g, 'ss')
      .replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
  }

  /**
   * Auszeichnung innerhalb einer Zeile.
   *
   * Reihenfolge ist wichtig: Codespannen zuerst heraustrennen, sonst wird
   * Markdown darin ausgewertet. `**fett**` in einem Codebeispiel soll
   * Sternchen zeigen.
   */
  function inline(text, opt) {
    opt = opt || {};
    var code = [];
    var s = esc(text);

    // Codespannen sichern
    s = s.replace(/`([^`]+)`/g, function (_, inhalt) {
      code.push(inhalt);
      return '\u0000' + (code.length - 1) + '\u0000';
    });

    // Links. [`DATEI.md`](DATEI.md) ist im Handbuch die haeufigste Form -
    // der Codespann ist zu dem Zeitpunkt schon gesichert.
    s = s.replace(/\[([^\]]+)\]\(([^)]+)\)/g, function (_, text2, ziel) {
      var md = ziel.match(/^([A-Za-z0-9_.-]+\.md)(#.*)?$/);
      if (md && opt.kapitelLink) {
        return '<a href="' + esc(opt.kapitelLink(md[1])) + '">' + text2 + '</a>';
      }
      if (/^https?:\/\//.test(ziel)) {
        return '<a href="' + esc(ziel) + '" target="_blank" rel="noopener">' + text2 + '</a>';
      }
      // Alles andere - relative Pfade in Verzeichnisse, die es hier nicht
      // gibt - bleibt Text. Ein toter Link ist schlechter als keiner.
      return text2;
    });

    s = s.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
    s = s.replace(/(^|[\s(])\*([^*\n]+)\*(?=[\s).,;:!?]|$)/g, '$1<em>$2</em>');

    // Codespannen zurueck
    s = s.replace(/\u0000(\d+)\u0000/g, function (_, i) {
      return '<code>' + code[Number(i)] + '</code>';
    });
    return s;
  }

  function istTabellenTrenner(zeile) {
    return /^\s*\|?\s*:?-{2,}:?\s*(\|\s*:?-{2,}:?\s*)*\|?\s*$/.test(zeile);
  }

  function zellen(zeile) {
    return zeile.trim().replace(/^\||\|$/g, '').split('|').map(function (z) { return z.trim(); });
  }

  /**
   * Markdown zu HTML.
   *
   * @param {string} text
   * @param {object} [opt]
   *   opt.kapitelLink  Funktion Dateiname -> URL, fuer Querverweise
   *   opt.ueberschriften  Array, wird mit {stufe, text, anker} gefuellt
   * @returns {string}
   */
  function rendern(text, opt) {
    opt = opt || {};
    var zeilen = String(text || '').split(/\r?\n/);
    var aus = [];
    var i = 0;

    function absatz(puffer) {
      if (!puffer.length) return;
      aus.push('<p>' + puffer.map(function (z) { return inline(z, opt); }).join('<br>') + '</p>');
      puffer.length = 0;
    }

    var puffer = [];

    while (i < zeilen.length) {
      var z = zeilen[i];

      // Codeblock
      var fence = z.match(/^```(\w*)\s*$/);
      if (fence) {
        absatz(puffer);
        var block = [];
        i++;
        while (i < zeilen.length && !/^```\s*$/.test(zeilen[i])) { block.push(zeilen[i]); i++; }
        i++;
        aus.push('<pre><code>' + esc(block.join('\n')) + '</code></pre>');
        continue;
      }

      // Ueberschrift
      var h = z.match(/^(#{1,6})\s+(.+?)\s*$/);
      if (h) {
        absatz(puffer);
        var stufe = h[1].length;
        var titel = h[2];
        var a = anker(titel);
        if (opt.ueberschriften) opt.ueberschriften.push({ stufe: stufe, text: titel, anker: a });
        // H1 bleibt dem Seitentitel vorbehalten; im Fliesstext beginnt die
        // Gliederung bei H2, sonst konkurrieren zwei H1 miteinander.
        var tag = 'h' + Math.min(6, stufe + 1);
        aus.push('<' + tag + ' id="' + esc(a) + '">' + inline(titel, opt) + '</' + tag + '>');
        i++;
        continue;
      }

      // Horizontale Linie
      if (/^\s*---+\s*$/.test(z)) {
        absatz(puffer);
        aus.push('<hr>');
        i++;
        continue;
      }

      // Tabelle: Kopfzeile, dann Trenner
      if (/^\s*\|/.test(z) && i + 1 < zeilen.length && istTabellenTrenner(zeilen[i + 1])) {
        absatz(puffer);
        var kopf = zellen(z);
        i += 2;
        var reihen = [];
        while (i < zeilen.length && /^\s*\|/.test(zeilen[i])) {
          reihen.push(zellen(zeilen[i]));
          i++;
        }
        aus.push('<div class="md-tabelle"><table class="data-table"><tr>'
          + kopf.map(function (c) { return '<th>' + inline(c, opt) + '</th>'; }).join('')
          + '</tr>'
          + reihen.map(function (r) {
              return '<tr>' + r.map(function (c) {
                return '<td>' + inline(c, opt) + '</td>';
              }).join('') + '</tr>';
            }).join('')
          + '</table></div>');
        continue;
      }

      // Blockzitat. Im Handbuch tragen sie die Warnungen und Merksaetze -
      // sie bekommen darum eine eigene Auszeichnung, nicht nur Einzug.
      if (/^\s*>/.test(z)) {
        absatz(puffer);
        var zitat = [];
        while (i < zeilen.length && /^\s*>/.test(zeilen[i])) {
          zitat.push(zeilen[i].replace(/^\s*>\s?/, ''));
          i++;
        }
        aus.push('<blockquote>' + rendern(zitat.join('\n'), opt) + '</blockquote>');
        continue;
      }

      // Listen
      if (/^\s*[-*]\s+/.test(z) || /^\s*\d+\.\s+/.test(z)) {
        absatz(puffer);
        var geordnet = /^\s*\d+\.\s+/.test(z);
        var punkte = [];
        while (i < zeilen.length
               && (geordnet ? /^\s*\d+\.\s+/.test(zeilen[i]) : /^\s*[-*]\s+/.test(zeilen[i]))) {
          var inhalt = zeilen[i].replace(/^\s*(?:[-*]|\d+\.)\s+/, '');
          // Kontrollkaestchen aus dem Handbuch bleiben Text, aber lesbar.
          inhalt = inhalt.replace(/^\[([ xX])\]\s*/, function (_, k) {
            return k === ' ' ? '\u2610 ' : '\u2611 ';
          });
          punkte.push('<li>' + inline(inhalt, opt) + '</li>');
          i++;
        }
        aus.push((geordnet ? '<ol>' : '<ul>') + punkte.join('') + (geordnet ? '</ol>' : '</ul>'));
        continue;
      }

      // Leerzeile beendet den Absatz
      if (/^\s*$/.test(z)) { absatz(puffer); i++; continue; }

      puffer.push(z);
      i++;
    }
    absatz(puffer);
    return aus.join('\n');
  }

  global.Markdown = {
    rendern: rendern,
    inline: inline,
    anker: anker,
    esc: esc
  };
})(typeof window !== 'undefined' ? window : globalThis);
