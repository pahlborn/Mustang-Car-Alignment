/**
 * changelog.js - Release-Dokumentation.
 *
 * Erreichbar ueber die Versionsnummer im Werkzeugmenue und im Header.
 *
 * Neuer Eintrag: oben einfuegen und version.js plus die Cache-Version in
 * sw.js hochzaehlen. tests/ui.test.mjs prueft, dass alle drei zusammenpassen.
 */
(function (global) {
  'use strict';

  // Neueste Version zuerst.
  var RELEASES = [
    {
      version: 'v2',
      date: '2026-10-09',
      time: '15:16',
      title: 'Was nach einer Aenderung erneut zu pruefen ist',
      changes: [
        { type: 'neu', text: 'recheck.js rechnet aus, welche Werkstattphasen nach einer Aenderung erneut zu absolvieren sind. Wer Camber nachstellt, entwertet damit Toe - die Messung gilt dann fuer ein Fahrzeug, das es so nicht mehr gibt. Die Kette wird ueber beliebig viele Stufen verfolgt: ein Federwechsel erreicht ueber Ride Height und Corner Weight am Ende auch das Alignment.' },
        { type: 'neu', text: 'Abschnitt 27 des Workflows hat eine dritte Spalte "Wirkung" bekommen. Sie unterscheidet "neu messen" (der Wert gilt nicht mehr) von "mitmessen" (er verschiebt sich, bleibt aber brauchbar). Ohne diese Trennung entwertete eine Reifendruckkorrektur ueber die Kette Reifen - Ride Height - Corner Weight - Alignment neun von siebzehn Phasen. Eine Anzeige, die das zweimal behauptet, glaubt niemand mehr.' },
        { type: 'intern', text: 'Die Abhaengigkeitstabelle steht weiterhin nur im Handbuch. recheck.js schreibt sie ab, und der neue Test prueft beide Richtungen - jede Zeile dort kommt hier vor und umgekehrt, bei gleicher Zeilenzahl. Verfahren aus dem belege-Mechanismus des Schwesterprojekts jerico uebernommen.' },
        { type: 'fix', text: 'Die Panhard-Lateralposition stand unter zwei Namen da: als panhard_lage in der Phasenzuordnung und als lateral_position in der Matrix. Dadurch lief eine Panhard-Hoehenaenderung ins Leere - sie entwertete eine Groesse, die keine Phase liefert. Aufgefallen durch den Test, der jede Matrix-Groesse auf Wirkung prueft.' },
        { type: 'intern', text: 'Der Zyklus Ride Height - Corner Weight ist mit der dritten Spalte verschwunden, weil die Rueckrichtung nicht mehr propagiert. Ein Test haelt die Zyklenfreiheit jetzt ausdruecklich fest: entsteht spaeter einer, laeuft die Kaskade nicht falsch, sondern gar nicht mehr zurueck - und ein haengender Test sieht aus wie ein langsamer.' }
      ]
    },
    {
      version: 'v1',
      date: '2026-10-09',
      time: '10:00',
      title: 'Geruest - Versionsbuchfuehrung und Testrahmen',
      changes: [
        { type: 'neu', text: 'Erste Ausgabe des Chassis-Setup-Handbuchs als Website. Das Handbuch selbst liegt seit laengerem als 29 Markdown-Dateien vor; diese Ausgabe enthaelt nur das Geruest, noch keine Inhalte.' },
        { type: 'intern', text: 'Versionsbuchfuehrung aus den Schwesterprojekten gt40-engine und jerico uebernommen: version.js, sw.js und changelog.js muessen zusammenpassen, der Job Versionsdisziplin prueft das vor jedem Merge. Die Regel steht hier ab der ersten Datei, nicht nachtraeglich - sonst haette sie bis dahin nichts geschuetzt.' },
        { type: 'intern', text: 'field-sync.js, validation.js und errorlog.js unveraendert aus jerico uebernommen. Sie sind dort byte-identisch mit gt40, also zweimal im Einsatz bewaehrt.' },
        { type: 'intern', text: 'Testrahmen mit workflow.test.mjs und release-guard.test.mjs. Der erste prueft, dass jede Testdatei im Workflow verdrahtet ist und umgekehrt; der zweite, dass eine geaenderte ausgelieferte Datei die Version hochzaehlt.' }
      ]
    }
  ];

  var TYPE_LABEL = { neu: 'Neu', fix: 'Behoben', intern: 'Intern', verbessert: 'Verbessert' };

  function esc(s) {
    return String(s == null ? '' : s)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }

  // Datum und Uhrzeit zu einem ISO-Stempel fuegen und ueber formatBuilt
  // darstellen. Aeltere Eintraege ohne Uhrzeit bekommen keine erfunden.
  function stempel(r) {
    if (!r.date) return '';
    var iso = r.time ? r.date + 'T' + r.time : r.date;
    return (typeof formatBuilt === 'function') ? formatBuilt(iso) : r.date;
  }

  function ensureChrome() {
    if (document.getElementById('changelogOverlay')) return;
    var ov = document.createElement('div');
    ov.className = 'changelog-overlay';
    ov.id = 'changelogOverlay';
    ov.innerHTML =
        '<div class="cl-panel" role="dialog" aria-label="Release-Dokumentation">'
      + '<div class="cl-head">'
      + '<h3>Release-Dokumentation</h3>'
      + '<button type="button" class="cl-close" onclick="closeChangelog()" aria-label="Schliessen">&times;</button>'
      + '</div><div class="cl-body" id="changelogBody"></div></div>';
    ov.addEventListener('click', function (e) { if (e.target === ov) closeChangelog(); });
    document.body.appendChild(ov);
  }

  function render() {
    var current = (typeof APP_VERSION === 'string') ? APP_VERSION : '';
    document.getElementById('changelogBody').innerHTML = RELEASES.map(function (r) {
      var istAktuell = r.version === current;
      return '<section class="cl-rel' + (istAktuell ? ' current' : '') + '">'
        + '<h4><span class="cl-ver">' + esc(r.version) + '</span>'
        + (istAktuell ? '<span class="cl-badge">aktuell</span>' : '')
        + '<span class="cl-date">' + esc(stempel(r)) + '</span></h4>'
        + '<p class="cl-title">' + esc(r.title) + '</p>'
        + '<ul>' + r.changes.map(function (c) {
            return '<li><span class="cl-type ' + esc(c.type) + '">'
                 + esc(TYPE_LABEL[c.type] || c.type) + '</span>' + esc(c.text) + '</li>';
          }).join('') + '</ul></section>';
    }).join('');
  }

  function openChangelog() {
    ensureChrome();
    render();
    document.getElementById('changelogOverlay').classList.add('show');
    document.body.style.overflow = 'hidden';
  }

  function closeChangelog() {
    var ov = document.getElementById('changelogOverlay');
    if (ov) ov.classList.remove('show');
    document.body.style.overflow = '';
  }

  document.addEventListener('keydown', function (e) {
    if (e.key !== 'Escape') return;
    var ov = document.getElementById('changelogOverlay');
    if (ov && ov.classList.contains('show')) closeChangelog();
  });

  global.RELEASES = RELEASES;
  global.CHANGELOG_TYPE_LABEL = TYPE_LABEL;   // fuer tests/ui.test.mjs
  global.openChangelog = openChangelog;
  global.closeChangelog = closeChangelog;
})(typeof window !== 'undefined' ? window : globalThis);
