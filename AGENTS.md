# Arbeitsregeln fuer dieses Repository

Gilt fuer alle, die hier etwas aendern - Menschen wie Agenten.

Die Schwesterprojekte `gt40-engine` und `jerico-dog-box-assembly-manual` haben
eigene Fassungen. Wo eine Regel noch keinen eigenen Vorfall hat, nennt sie den
aus dem Schwesterprojekt, aus dem sie stammt.

Diese Datei ist ein Unfallregister, keine Stilfibel. Was hier passiert, wird
hier eingetragen.

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
| Abhaengigkeiten zwischen Messgroessen | `handbuch/02_WORKFLOW.md` 27, abgeschrieben in `recheck.js` |
| Browserstart und Testkontext | `tests/helpers.mjs` |

Und jede dieser Stellen bekommt einen Test, der rot wird, wenn sie divergiert.

**Erster eigener Vorfall, v2:** die Panhard-Lateralposition stand unter zwei
Namen da - `panhard_lage` in der Phasenzuordnung, `lateral_position` in der
Matrix. Eine Panhard-Hoehenaenderung entwertete damit eine Groesse, die keine
Phase liefert, und lief ins Leere. Gefunden hat es nicht das Nachlesen, sondern
der Test, der jede Matrix-Groesse auf Wirkung prueft.

**Die Lehre daraus:** ein zweiter Name ist dasselbe wie ein zweiter Ort. Wer
eine Groesse benennt, prueft vorher, ob sie schon einen Namen hat -
`Recheck.alleGroessen()` listet sie auf.

## 4a. Ein Mechanismus gehoert dorthin, wo seine Funktion liegt

Nicht dorthin, wo er zuerst gebraucht wurde. Sonst funktioniert er an seinem
Platz tadellos und fehlt ueberall sonst.

**Warum, v5:** der Lauscher, ueber den sich ein Messfeld selbst meldet, lag
seit v3 in `werkstatt.js` - dort entstand er. Als die Messfelder eine eigene
Seite bekamen, meldeten sie nichts: das Attribut war gesetzt, der Lauscher
fehlte. Er gehoert zu `Status.ausFeld()` und steht jetzt in `status.js`.

**Die Probe:** laesst sich die Funktion auf einer zweiten Seite gebrauchen?
Dann gehoert sie nicht in die Datei der ersten. Wo eine Seite danach etwas
nachziehen muss, geschieht das ueber ein Ereignis - das Modul muss die Seiten
nicht kennen.

**Fuenfter Vorfall, v8 - derselbe Fall, eine Stufe groesser.** In
`nachschlagen.js` stand ein eigener, kleiner Markdown-Renderer fuer das
Glossar: Fettdruck, Code, Links. Als die Kapitelseite dazukam, brauchte sie
Tabellen, Blockzitate und Listen - und bekam einen zweiten Renderer. Zwei
Fassungen desselben Formats, von denen eine Tabellen kann und die andere
nicht.

Beide lesen jetzt `markdown.js`. Zu bemerken war es nicht an einem Fehler,
sondern an der Frage, wo der neue Renderer hingehoert - die Antwort "neben den
alten" ist immer verdaechtig.

## 5. Kein Sollwert ohne Quelle

Messwerte, Winkel und Drehmomente stehen nur mit Beleg da. Ist keiner da, wird
der Wert als **offen gekennzeichnet, nicht geraten**. Die Evidenzgrade A bis D
stehen in `handbuch/CONVENTIONS.md` 16 und tragen im Markup `.src-a` bis
`.src-d`; der Verifizierungsstatus aus Abschnitt 17 ist eine andere Frage und
hat eigene Klassen `.vs-*`.

Das ist in diesem Projekt keine Formalie. Die Baseline (Castor +3,0 Grad,
Camber -2,0 Grad, Toe +1,6 mm in) hat bis heute **keine belegte Herkunft** und
ist als solche markiert. Wer sie benutzt, muss das sehen.

**Nicht uebernommen werden:** Forenzahlen, Haendlerangaben ohne Datenblatt,
Werte aus Oval-Setups ohne Pruefung der Uebertragbarkeit.

### 5a. Die Regel gilt auch fuer das, was der Code behauptet

**Vierter eigener Vorfall, v6 - und der schwerste.** Im Stylesheet standen
seit v1 sechs Evidenzklassen `A` bis `F` mit frei erfundenen Bedeutungen:
"Ist-Befund am Fahrzeug", "eigener Messwert", "noch zu belegen". Das Handbuch
kennt **vier** Grade, und zwar mit anderer Bedeutung - Primaerquelle,
Fachliteratur, technische Sekundaerquelle, Erfahrungswert.

Fuenf Versionen lang trug das Markup Kuerzel, die nichts belegten. Am
Messblatt stand `C` fuer ein Messmittel; nach Handbuch heisst C
"Sekundaerquelle". An einer Diagnosehypothese stand `F`, das es gar nicht
gibt.

**Diese Datei selbst hat den Fehler getragen:** hier stand "Die Evidenzklassen
A bis F sind in CONVENTIONS.md 16 definiert". Wer das las, musste es glauben.

Aufgefallen ist es erst, als die Nachschlagekarte die Klassen gegen
CONVENTIONS.md belegen musste - sechs Zeilen trugen denselben Beleg, ein Test
meldete "belegt nichts Einzelnes", und beim Nachsehen stand dort etwas
anderes.

**Die Lehre:** eine Klassifikation, eine Einheit oder ein Schwellwert im Code
ist genauso belegpflichtig wie eine Zahl im Text. Wer etwas benennt, das wie
eine Konvention aussieht, muss die Stelle nennen koennen, an der sie steht.

**Seitdem geprueft:** `tests/recheck.test.mjs` fordert fuer jede Messgroesse
eine Entsprechung im Handbuch, `tests/nachschlagen.test.mjs` vergleicht die
Evidenzgrade mit CONVENTIONS 16 und verbietet, sie als Statusfarbe zu
benutzen. Die uebrigen Angaben - Shimgrenzen, Messmittel, Phasentitel,
Symptomcodes - wurden bei dieser Gelegenheit nachgeprueft und sind belegt.

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

**Zweiter eigener Vorfall, v2 - ein Test, der nichts prueft.** Die Pruefung
"der Zyklus laesst die Kaskade nicht haengen" blieb in der Gegenprobe gruen,
obwohl der Zyklusschutz ausgebaut war. Grund: mit der dritten Spalte in der
Matrix propagiert `Corner Weight -> Ride Height` nicht mehr, der Zyklus war
verschwunden. Der Test behauptete etwas, das es nicht mehr gab - und haette
jede kuenftige Rueckkopplung durchgelassen.

Ersetzt durch eine echte Zyklussuche ueber den Graphen. Gegenprobe: Zyklus
eingebaut, Test rot.

**Besonderheit bei Endlosschleifen:** ein haengender Test sieht aus wie ein
langsamer. Die Gegenprobe muss deshalb mit Zeitgrenze laufen, sonst wartet man
auf ein Ergebnis, das nie kommt, und haelt es fuer ein Werkzeugproblem.

**Dritter eigener Vorfall, v3 - der Test prueft den harmlosen Fall.** Die
Pruefung "der Statusknopf klappt die Sektion nicht mit auf" nahm eine
geschlossene Phase. Die bleibt geschlossen, ob der Fehler da ist oder nicht.
Tatsaechlich klappte eine *aufgeklappte* Phase beim Abhaken zu - und zwar aus
zwei Gruenden gleichzeitig. Beide lagen offen zutage, und der Test war gruen.

**Die Lehre:** ein Zustandstest muss im Zustand laufen, in dem der Fehler
sichtbar waere. Bei Umschaltern heisst das: beide Richtungen, nicht nur die
bequeme.

## 7a. Zwei Mechanismen fuer dieselbe Sache sind einer zu viel

Faengt ein zweiter Mechanismus den Schaden des ersten auf, faellt dessen
Ausfall nicht mehr auf. Die Gegenprobe wird gruen, obwohl etwas kaputt ist.

**Warum, v3:** gegen das Zuklappen beim Abhaken standen `stopPropagation` am
Knopf *und* das Sichern des Klappzustands beim Neuzeichnen. `stopPropagation`
liess sich entfernen, ohne dass ein Test rot wurde - die zweite Sicherung
deckte es zu. Erst eine Messung des Vorgangs selbst zeigte, dass
`toggleSection` weiterhin mitlief.

**Die Regel:** die Ursache beheben, nicht die Wirkung. Und wo zwei Sicherungen
noetig sind, bekommt jede ihren eigenen Test - einen auf den sichtbaren
Zustand, einen auf den Vorgang.

## 7b. Zeitstempel aus Date.now() sind nicht eindeutig

Wer mehrere Dinge nacheinander stempelt, bekommt leicht denselben Wert.
Vergleiche der Form "liegt A nach B" entscheiden dann willkuerlich.

**Warum, v3:** neunzehn Phasen abhaken und direkt danach eine Aenderung
eintragen passiert innerhalb einer Millisekunde. Der Vergleich entschied gegen
die Aenderung, die Phase galt weiter als gueltig. `status.js` zaehlt den
Stempel seitdem hoch, wenn die Uhr stehenbleibt.

**Und wer es gefunden hat:** der Browser-Test, nicht der Modultest. Im
Modultest stelle ich die Uhr von Hand - genau der Fall, der schiefgeht, kommt
dort nie vor. Wo die Zeit eine Rolle spielt, braucht es beides.

## 7c. Eine gruene Gegenprobe ist noch kein Urteil

Bleibt ein Test gruen, obwohl der Fehler eingebaut wurde, heisst das zweierlei
und man weiss zunaechst nicht, welches:

1. der Test prueft nichts - dann gehoert er ersetzt
2. der Eingriff hat nicht gegriffen - dann war die Gegenprobe zu schwach

**Warum, v4:** die Pruefung des Klappzustands auf der Diagnoseseite blieb
gruen, obwohl eine Zeile der Wiederherstellung ausgeschaltet war. Die zweite
Zeile daneben hielt die Karte weiterhin offen. Erst das Ausschalten der
ganzen Schleife zeigte, dass der Test sehr wohl greift.

**Die Regel:** bei gruener Gegenprobe erst nachsehen, ob der Eingriff im
laufenden Code ueberhaupt angekommen ist. Eine kleine Messung am lebenden
Objekt kostet zwei Minuten und verhindert, dass ein brauchbarer Test
weggeworfen wird.

## 7d. Ein Testfall muss den Fehler unterscheiden koennen

Gleiche Zahlen auf beiden Seiten einer Pruefung lassen eine Vertauschung
durchgehen.

**Warum, v5:** der Testfall fuer die Radlast-Diagonalen nahm 400/300/300/200.
Beide Diagonalen ergeben 600 - eine Vertauschung von Cross und Gegen-Cross
waere nicht aufgefallen. Gemeldet hat es eine Assertion im selben Test, die
genau das prueft: `assert(r.cross !== r.gegenCross)`.

**Die Regel:** wo zwei Groessen unterschieden werden sollen, muss der Testfall
sie unterscheidbar machen - und eine Assertion soll das festhalten, nicht nur
der gute Vorsatz beim Schreiben.

## 7e. Pruefen, wo der Fehler sichtbar waere

**Sechster Vorfall, v7.** Drei Testfehlschlaege in Folge lagen nicht am Code,
sondern am Test:

- das Handbuch setzt fuer negative Zahlen ein echtes Minuszeichen (U+2212),
  der Code einen Bindestrich - der Vergleich meldete sechs fehlende Stufen,
  die alle dastanden
- ein Test verbot das Wort "ZIELWERT" im Code und fand es in der
  Kommentarzeile, die erklaert, warum es keinen gibt
- eine Warnungszaehlung zaehlte alle Warnungen statt der gemeinten

Keiner davon war ein Befund am Fahrzeug oder am Code. **Ein roter Test ist
erst dann ein Befund, wenn der Weg dorthin geklaert ist** - sonst repariert
man die Anwendung, bis sie zum Test passt.

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
zusammengebaut. Ein Fahrwerk nicht. Wer Camber verstellt, macht damit die
Toe-Messung ungueltig - die Recheck-Matrix in `02_WORKFLOW.md` 27 sagt genau,
was wonach erneut zu pruefen ist. Der vierte Status `veraltet` bildet das ab.

Ein Balken, der nach einer Camber-Aenderung auf 100 Prozent stehen bliebe,
wuerde luegen - und zwar bei der einzigen Frage, auf die es ankommt: ist das
Fahrzeug rennstreckenbereit.

**Aber auch das Gegenteil ist ein Fehler, und zwar der gefaehrlichere.** In v2
entwertete eine Reifendruckkorrektur ueber die Kette Reifen - Ride Height -
Corner Weight - Alignment neun von siebzehn Phasen. Fachlich liess sich jede
einzelne Kante begruenden; das Ergebnis war trotzdem unbrauchbar. Wer zweimal
einen halben Messnachmittag fuer nichts aufwendet, schaut beim dritten Mal nicht
mehr hin - und dann schuetzt die Anzeige gar nichts.

Darum unterscheidet die Matrix seit v2 **neu messen** von **mitmessen**, und
nur das erste pflanzt sich fort. Eine Warnung, der niemand glaubt, ist
schlechter als keine.

## 11. Kein Rueckblick im Seitentext

Was in einer frueheren Version falsch war, gehoert in `changelog.js` und in die
Kommentare im Code - nicht in die Anleitung. Die Seite beschreibt den heutigen
Zustand.

Hypothesen, die sich nicht bestaetigt haben, werden **gestrichen**, nicht
umformuliert.

## 12. Was aus einem anderen Projekt kommt, bringt dessen Einstellungen mit

Eine kopierte Datei traegt mehr als ihren Inhalt: Zeilenenden, Kodierung,
Namenskonventionen. Was dort stimmig war, muss es hier nicht sein.

**Siebter Vorfall, v9.** Sieben Dateien wurden in v1 aus dem Schwesterprojekt
kopiert und lagen seitdem mit CRLF **im Repository**, der Rest mit LF. Dort
liegen sie als LF im Repo und nur im Arbeitsverzeichnis als CRLF - der
Unterschied entstand durch `core.autocrlf=false`, in v1 mitgesetzt, ohne die
Folgen zu bedenken.

Acht Versionen lang harmlos. Auffaellig wird so etwas erst, wenn ein Werkzeug
die Zeilenenden anfasst: dann meldet git eine Datei als vollstaendig geaendert,
obwohl eine Zeile angepasst wurde - und im Diff ist nicht mehr zu sehen, was
wirklich passiert ist.

**Seitdem:** `.gitattributes` legt die Zeilenenden fest, statt sie davon
abhaengen zu lassen, wie eine Datei hereingekommen ist.

**Die allgemeine Lehre:** beim Uebernehmen aus einem anderen Projekt nicht nur
den Inhalt pruefen, sondern auch, was unsichtbar mitkommt. Dasselbe galt fuer
den Paketspiegel in v2 - die interne Registry-Adresse stand im Lockfile und
war von CI aus nicht erreichbar.

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
