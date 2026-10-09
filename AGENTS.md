# Arbeitsregeln fuer dieses Repository

Gilt fuer alle, die hier etwas aendern - Menschen wie Agenten.

Die Schwesterprojekte `gt40-engine` und `jerico-dog-box-assembly-manual` haben
eigene Fassungen. Dort steht hinter jeder Regel ein Vorfall aus dem eigenen
Projekt. Hier noch nicht: dieses Repository ist bei v1. Die Regeln stehen
trotzdem schon da, weil sie nachtraeglich nichts geschuetzt haetten - sie
nennen vorerst den Vorfall aus dem Schwesterprojekt, aus dem sie stammen.

Passiert hier etwas Eigenes, wird es hier eingetragen. Das ist der Zweck
dieser Datei: sie ist ein Unfallregister, keine Stilfibel.

## 1. Jede Aenderung an einer ausgelieferten Datei zaehlt die Version hoch

Ausgeliefert ist alles im Wurzelverzeichnis mit der Endung `.html`, `.js` oder
`.css`. Wer eine davon aendert, aendert drei Dinge zusammen:

| Datei | was |
|---|---|
| `version.js` | `APP_VERSION` hochzaehlen, `APP_BUILT` auf jetzt setzen |
| `sw.js` | `CACHE_NAME` auf `chassis-v<N>` mitziehen |
| `changelog.js` | Eintrag ganz oben, mit `date` und `time` |

Ausgenommen sind nur diese drei Dateien selbst - sie sind die Buchfuehrung des
Release, nicht sein Inhalt.

**Warum:** in `gt40-engine` bei v54 und in `jerico` bei v13 ging derselbe Stand
zweimal raus, bei jerico zwoelf Minuten auseinander, beide mit demselben
`CACHE_NAME`. Ein Geraet, das den ersten Stand geladen hatte, bekam den zweiten
nicht: der Service Worker sah denselben Cache-Namen. Aufgefallen ist es erst
Wochen spaeter beim Nachlesen. Der Job `Versionsdisziplin` prueft das hier ab
v1.

## 2. Keine Luecke und keine Nummer zweimal

Jede Nummer zwischen der aeltesten und der aktuellsten braucht genau einen
Eintrag in `changelog.js`.

**Warum:** derselbe Vorfall. Im Journal von jerico standen zwei Eintraege mit
`version: 'v13'`, und die vorhandene Pruefung sah nur, ob die oberste Nummer zu
`APP_VERSION` passt - das war die ganze Zeit erfuellt.

## 3. Rote CI wird nicht ueberschrieben

Ein roter Lauf auf `main` ist ein Befund, kein Rauschen.

## 4. Kein Wert an zwei Orten

Steht derselbe Wert zweimal, laufen die Kopien auseinander. In `jerico` ist das
der haeufigste Fehler ueberhaupt - neun Vorfaelle bis v25.

**Die Regel:** ein Wert, eine Quelle, Renderer drumherum. Soll er an einer
zweiten Stelle erscheinen, wird er dort **gerechnet oder gebunden**, nicht
abgeschrieben.

Fuer dieses Projekt heisst das konkret:

| Was | Wo es herkommt |
|---|---|
| Fahrzeugdaten, Hardware | `handbuch/00_PROJECT.md`, spaeter `befund.js` |
| Vorzeichen, Einheiten, IDs, Symptomcodes | `handbuch/CONVENTIONS.md`, spaeter `reference.js` |
| Begriffe | `handbuch/GLOSSAR.md`, spaeter `glossar.js` |
| Abhaengigkeiten zwischen Messgroessen | `handbuch/02_WORKFLOW.md` 27, spaeter `recheck.js` |
| Browserstart und Testkontext | `tests/helpers.mjs` |

Und jede dieser Stellen bekommt einen Test, der rot wird, wenn sie divergiert.

## 5. Kein Sollwert ohne Quelle

Messwerte, Winkel und Drehmomente stehen nur mit Beleg da. Ist keiner da, wird
der Wert als **offen gekennzeichnet, nicht geraten**. Die Evidenzklassen A bis
F sind in `handbuch/CONVENTIONS.md` 16 definiert und tragen im Markup die
Klassen `.src-a` bis `.src-f`.

Das ist in diesem Projekt keine Formalie. Die Baseline (Castor +3,0 Grad,
Camber -2,0 Grad, Toe +1,6 mm in) hat bis heute **keine belegte Herkunft** und
ist als solche markiert. Wer sie benutzt, muss das sehen.

**Nicht uebernommen werden:** Forenzahlen, Haendlerangaben ohne Datenblatt,
Werte aus Oval-Setups ohne Pruefung der Uebertragbarkeit.

## 6. Nichts aufnehmen, was nicht umgesetzt werden kann

Das Fahrzeug ist von 1966 und hat begrenzte Verstellmoeglichkeiten. Eine
Empfehlung, die hoehenverstellbare Federauflagen voraussetzt, ist hier keine
Empfehlung, sondern eine Irrefuehrung.

Darum traegt die Stellgroessen-Rangfolge in `02_WORKFLOW.md` 29 eine eigene
Spalte "am Fahrzeug verfuegbar", und Cross Weight ist als **Diagnosegroesse**
eingeordnet, nicht als Stellgroesse.

## 7. Tests werden gegengeprueft

Ein neuer Test zaehlt erst, wenn er nachweislich rot wird, sobald man den
Fehler wieder einbaut. Ohne diese Probe laesst sich nicht unterscheiden, ob er
greift oder nur nichts findet.

**Warum:** in jerico hat die Gegenprobe viermal einen eigenen Test als wertlos
entlarvt - eine Regex, die am Klammerzeichen vorbeilief; eine Grenze von 900
Pixeln, waehrend der schlechte Zustand bei 877 lag; ein `new Event('input')`,
das nicht aufsteigt und vom Lauscher am Dokument nie gesehen wurde; und eine
Erlaubnisliste, die genau den Fehler durchgelassen haette, um den es ging.

**Und ein Umkehrfall:** ein roter Test ist nicht automatisch ein Befund am
Code. In jerico v25 war der Service Worker im Testkontext aktiv und fing die
Requests ab, an den Stubs vorbei - der Test sah einen Fehler, den er selbst
erzeugt hatte. `tests/helpers.mjs` sperrt den Service Worker deshalb in
`neuerKontext()`.

Die Gegenproben zu v1 sind gelaufen: CACHE_NAME verstellt, nicht existierende
Datei in `sw.js`, `APP_BUILT` abweichend, `new Date()` in `formatBuilt`,
Changelog-Typ ohne Beschriftung, und der Release-Guard gegen einen Commit ohne
Versionssprung. Alle sechs wurden rot, jeder aus dem richtigen Grund.

## 8. Eingetragene Werte muessen wirken

Ein Eingabefeld, dessen Wert nirgends erscheint, ist eine Falle. Wer misst und
eintraegt, erwartet, dass die Anzeige folgt.

**Warum:** in jerico existierten `perf_umfang` und `perf_achse` seit v9 und
hatten keine Wirkung - die Diagramme rechneten mit festen Werten.

Fuer dieses Projekt ist das besonders scharf: `00_PROJECT.md` hat ueber 44
vorbereitete Eingabefelder. Jedes, das nirgends ankommt, ist ein
Messnachmittag umsonst.

## 9. Leer ist eine Aussage

Ein geloeschter Messwert bleibt geloescht. `FieldSync.mergeRecords()` laesst
pro Feld den juengeren Zeitstempel gewinnen, auch wenn der Wert leer ist.

**Warum:** vorher galt "leer gewinnt nie", und ein bewusst geleerter Messwert
kam beim naechsten Laden zurueck.

Dasselbe Prinzip bei Befunden: `remove()` schreibt einen **Grabstein**, keine
Loeschung. Sonst bringt das zweite Geraet den Eintrag zurueck.

## 10. Ein Setup hat einen Endzustand, ein Fahrwerk nicht

Die Werkstattphasen 0-18 enden mit `Phase 18 - Werkstatt-Baseline einfrieren`
und haben Abnahmekriterien. Dafuer gibt es einen Fortschrittsbalken.

Die Streckenphasen 19-22 sind ein Regelkreis ohne Ende. Dafuer gibt es keinen.

**Und dazwischen liegt die Falle:** ein Motor, der zusammengebaut ist, bleibt
zusammengebaut. Ein Fahrwerk nicht. Wer Camber verstellt, entwertet damit Toe
und Radlasten - die Recheck-Matrix in `02_WORKFLOW.md` 27 sagt genau, was
wonach erneut zu pruefen ist. Der vierte Status `veraltet` bildet das ab.

Ein Balken, der nach einer Camber-Aenderung auf 100 Prozent stehen bliebe,
wuerde luegen - und zwar bei der einzigen Frage, auf die es ankommt: ist das
Fahrzeug rennstreckenbereit.

## 11. Kein Rueckblick im Seitentext

Was in einer frueheren Version falsch war, gehoert in `changelog.js` und in die
Kommentare im Code - nicht in die Anleitung. Die Seite beschreibt den heutigen
Zustand.

Hypothesen, die sich nicht bestaetigt haben, werden **gestrichen**, nicht
umformuliert.

## Tests

```
npm test
```

Ruft `tests/workflow.test.mjs` und `tests/ui.test.mjs`. Jede Datei
`tests/*.test.mjs` muss in `.github/workflows/tests.yml` verdrahtet sein;
`tests/workflow.test.mjs` prueft genau das in beide Richtungen.

Der Release-Guard laeuft separat und braucht Historie:

```
node tests/release-guard.test.mjs
```

Mit vorinstalliertem Browser - noetig, wenn die lokal vorhandene
Chromium-Version nicht zu der von Playwright erwarteten passt:

```
CHROMIUM_PATH=/pfad/zu/chrome node tests/ui.test.mjs
```
