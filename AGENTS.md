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

**Zehnter Vorfall, v14 - vier Kopien einer Zeichenkette.** Die Kennung des
Felddatensatzes, `'chassisSetup'`, stand viermal im Code: in `app.js`, und
dann noch einmal in `bind-ui.js`, `bumpsteer-ui.js` und `messblatt.js`. Alle
drei Seiten lesen beim Start denselben Datensatz nach, weil `app.js` ihn
anwendet, bevor es ihre Felder gibt - und jede hatte sich die Kennung dafuer
abgeschrieben.

Schaden angerichtet hat es nicht, und das ist der Punkt: es waere erst beim
Umbenennen aufgefallen, und zwar als drei Seiten, die ihre gespeicherten
Werte stillschweigend nicht mehr finden. Kein Fehler, keine Meldung - nur
leere Felder, die vorher gefuellt waren.

Aufgefallen ist es beim Bauen von `bind-warnung.js`: die Frage war, woher
dieses Modul den Datensatz nimmt, und die ehrliche Antwort waere eine fuenfte
Kopie gewesen. Die Kennung steht jetzt in `field-sync.js`, zusammen mit
`FieldSync.lesen()`.

**Seitdem geprueft:** `tests/bind-warnung.test.mjs` sucht in jeder
ausgelieferten `.js` nach `'chassisSetup'` **in Anfuehrungszeichen** und
erlaubt es nur in `field-sync.js`. Das Anfuehrungszeichen ist der
Unterschied: ein Literal ist Code, dasselbe Wort in einem Kommentar
beschreibt nur.

**Die Probe beim Hinzufuegen eines Moduls:** woher nimmt es seine Daten? Wenn
die Antwort eine Zeichenkette ist, die anderswo schon steht, ist das Modul
nicht die Ursache - es macht nur sichtbar, was schon vorher doppelt war.

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

**Zwoelfter Vorfall, v15 - eine Schleife, sieben Mal.** Die Schleife ueber
alle `[data-field]` stand dreimal als Auslesen in den Seiten, obwohl
`FieldSync.collectFields()` seit v1 genau das tut, und viermal als Eintragen.
Die Kopie in `messblatt.js` kannte keine Kontrollkaestchen - harmlos, solange
das Messblatt keine hat, und eine Falle beim ersten, das dazukommt. Beides
steht jetzt in `field-sync.js` (`collectFields`, `anwenden`), und
`tests/bind-warnung.test.mjs` verbietet `querySelectorAll('[data-field]')`
ausserhalb davon.

**Zur Gegenprobe dabei (Regel 7c):** der Eingriff "anwenden() kennt keine
Kontrollkaestchen" blieb zuerst gruen - gegen die falsche Testdatei. Der Test,
der ihn faengt, steht in `bumpsteer.test.mjs` ("ein gesetzter Haken ueberlebt
das Neuladen"). Vor dem Schreiben eines neuen Tests nachsehen, ob es ihn
schon gibt.

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

### 5b. Ein Feldname ist noch keine Groesse - die Einheit gehoert dazu

Wer einen Wert aus dem Handbuch uebernimmt, uebernimmt zwei Dinge: den Namen
und die Einheit, in der er dort gefuehrt wird. Nur den Namen zu pruefen
reicht nicht.

**Achter Vorfall, v11.** Die Rollsteifigkeitsrechnung griff auf zwei Felder
zu, die es in `00_PROJECT.md` gar nicht gibt: `spring_rear_rate` und
`arb_rate_front`. Der Test, der jedes genannte Feld dort nachschlaegt, hat
das gemeldet - derselbe, der in v6 die erfundenen Evidenzklassen aufdeckte.

Beim Korrigieren kam der eigentliche Fehler heraus: die hintere Federrate
heisst `leaf_rate` und steht dort in **lb/in**, waehrend die Rechnung N/mm
erwartet. Ungerechnet eingesetzt waere die Hinterachse um den Faktor **5,7**
zu steif gewesen - die Balanceaussage haette das Vorzeichen gewechselt, und
zwar ohne dass irgendetwas unplausibel ausgesehen haette.

**Warum das gefaehrlicher ist als ein erfundener Name:** ein falscher
Feldname bricht sichtbar. Eine falsche Einheit rechnet weiter und liefert
eine Zahl, die man glaubt.

**Die Regel:** jedes Feld traegt die Einheit, in der es im Handbuch steht -
nicht die, in der gerechnet wird. Wo umgerechnet werden muss, steht die
Umrechnung als eigene Funktion mit Testfall da, nicht als Faktor mitten in
der Formel.

**Besonders aufpassen bei:** amerikanischen Herstellerangaben (lb/in, Zoll,
ft-lbs, psi), Winkeln (Grad gegen Bogenmass) und allem, was in
`00_PROJECT.md` aus einem Katalog uebernommen wurde.

**Neunter Vorfall, v13 - derselbe Fehler zwischen zwei gerechneten Werten.**
Das Bind-Kapitel verglich zwei Streuungen miteinander: die Streuung der
Einzelecken in Prozent der Gesamtmasse gegen die Streuung des Cross Weight in
Prozentpunkten des Diagonalanteils. Beide Zahlen standen in Prozent, also sah
der Vergleich zulaessig aus. Er war es nicht - die zweite ist eine Summe aus
der ersten.

Der Test, der das aufdeckte, war kein Rechentest, sondern einer, der eine
Messreihe ohne jeden Fehler durchlaufen liess: plus/minus 1 kg je Ecke, kein
Bind. Das Cross Weight meldete trotzdem eine Spanne von ueber 0,2
Prozentpunkten. Eine Summe, deren Summanden sich unabhaengig bewegen, streut
mehr als jeder einzelne - die Zahl war rechnerisch korrekt und bedeutete
nichts.

**Was uebrig bleibt:** das Diagonalmass. Es setzt die zwei Achsen gegeneinander
und wird in kg gefuehrt, mit derselben Bezugsgroesse wie die Messung selbst.
Es stuetzte sich auf keine Katalogzahl und steht trotzdem aus demselben Grund
unter Vorbehalt: eine Schwelle ohne Messreihe waere eine geratene Zahl, und
solche Zahlen kommen in dieses Handbuch nicht (Regel 5).

**Die Regel:** zwei abgeleitete Groessen darf man nur vergleichen, wenn sie
dieselbe Bezugsgroesse haben. Unterschiedliche Nenner sind derselbe Fall wie
unterschiedliche Einheiten, nur schwerer zu sehen.

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

**Dasselbe in v17, an echten Daten.** `Recheck.phasenAbschnitt()` sucht
"Phase 1" - ein Praefix von "Phase 10". Der Test lief gegen das Handbuch, und
dort steht Phase 1 vor Phase 10: auch eine fehlerhafte Praefixsuche findet
zuerst den richtigen Abschnitt. Der Test war gruen und haette es mit dem
Fehler auch bleiben. Echte Daten sind nicht automatisch der schwere Fall -
hier war es ein konstruierter Text, in dem Phase 10 vorn steht.

Nebenbei, fuer Gegenproben-Skripte: in `String.prototype.replace()` ist `$'`
im Ersatztext ein Sonderzeichen. Ein Ersatz wie `'.*$'` zerstoert die Datei,
der Test wird rot - aus dem falschen Grund. Fuer woertliches Ersetzen
`split(von).join(nach)`.

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

### 9a. Leer ist nur dann eine Aussage, wenn vorher etwas da war

**Dreizehnter Vorfall, v18 - die Kehrseite derselben Regel.**
`mergeIntoExisting()` gab jedem leeren Feld einen frischen Zeitstempel, auch
einem, das nie einen Wert hatte. Ein frisches Geraet, auf dem nur eine Seite
geoeffnet und wieder verlassen wurde, stempelte damit jedes leere Feld mit
"jetzt". Beim naechsten Mischen gewann dieses Leer gegen den aelteren Wert
eines anderen Geraets - der Wert war weg, auf beiden Geraeten und im Gist.

Gefunden hat es kein Test, sondern das Durchdenken des Zwei-Geraete-Falls
beim Neubau des Abgleichs. Der neue Abgleich beim Oeffnen haette es
verschaerft: er sichert vor dem Lesen die Felder - und haette jedes Mal
gestempelt. Nachgewiesen mit drei Zeilen Node, bevor irgendetwas geaendert
wurde.

**Die Regel:** ein Zeitstempel markiert eine Aenderung. Leer nach leer ist
keine. Ein bewusst geleertes Feld hatte vorher einen Wert und wird weiter
gestempelt.

**Was bleibt:** Altbestaende aus v17 und frueher koennen solche Stempel
schon tragen. Sie sind von echten Leerungen nicht zu unterscheiden und
werden nicht nachtraeglich bereinigt.

**Seitdem geprueft:** `tests/abgleich.test.mjs` (beide Richtungen) und
`tests/abgleich-ui.test.mjs` ("ein frisches Geraet loescht nichts").

### 9b. Wer schreibt, liest vorher

**Vierzehnter Vorfall, v18.** `saveData()` schrieb den lokalen Stand der
Messwerte in den Gist, ohne ihn vorher zu lesen. Ein Geraet mit altem Stand
ueberschrieb, was ein anderes inzwischen eingetragen hatte. Status und
Diagnose lasen vorher - in zwei wortgleichen Kopien, die jeden Fehler
schluckten und nur beim eigenen Schreiben liefen (Regel 4a: drei Fassungen
derselben Sache, eine davon falsch).

Jetzt gibt es einen Ablauf in `abgleich.js`: lesen, je Kanal mischen, lokal
speichern, nur Geaendertes schreiben, melden. Die Kanaele melden sich an;
das Modul kennt sie nicht. Konzept: Vault, `Projects/Geraeteabgleich/`.

**Der Test dafuer braucht zwei Geraete:** zwei Browserkontexte mit eigenem
`localStorage` und einem gemeinsamen, in Node nachgebauten Gist. Mit einem
Kontext laesst sich ein verlorenes Update nicht zeigen - genau wie in v3, als
der Seitenwechsel-Test mit zwei Kontexten etwas pruefte, das es nicht gab,
nur umgekehrt.

### 9c. Leer ist nur dann eine Aussage, wenn jemand geleert hat

**Aus `gt40-engine`, 2026-10-25.** Dort schrieb die Anzeige alte Statuswerte
(`"false"`) beim Darstellen auf leer um. Das nächste Speichern, egal welches
Feld, stempelte daraus ein Leeren, das niemand gemacht hatte. Nachgerechnet
mit dem echten Code: Das „erledigt" eines anderen Geräts wäre verloren
gegangen. Dieselbe Falle steht hier offen. `messblatt.js` erzeugt Felder erst,
nachdem `app.js` die gespeicherten Werte eingetragen hat. Bis zum
Nachtragen stehen sie leer da, und Regel 9a hilft nicht, weil vorher ein Wert
da war.

**Die Regel seit v19:** Ein Leeren zählt nur bei einem Feld, das der Nutzer
seit dem letzten Speichern selbst berührt hat (Tippen, Auswählen,
Antippen). `mergeIntoExisting` vermerkt es in `_geleert`, und
`mergeRecords` lässt ein Leer nur mit diesem Vermerk gegen einen Wert
gewinnen. Ein nur angezeigtes Leer behält den gespeicherten Wert.

**Dazu, aus denselben Vorfällen:** Hat nur eine Seite einen Zeitstempel,
gewinnt sie. Bis v18 galt für die Seite ohne Stempel `_savedAt` des ganzen
Datensatzes. In gt40 schlug damit ein veralteter Stand, der irgendein anderes
Feld speicherte, einen gestempelten Wert. `anwenden()` überschreibt seit v19
auch kein berührtes Feld mehr, nicht nur das fokussierte.

**Seitdem geprüft:** `tests/abgleich.test.mjs` (geleert mit Vermerk, nur
angezeigt, Leer ohne Vermerk, Altbestand) und `tests/abgleich-ui.test.mjs`
(Leeren wandert mit, Eingabe während eines Laufs, Import).

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

**Fuenfzehnter Vorfall, v18 - das Gesicht der App.** `icon-192.png`,
`icon-512.png` und `icon.svg` waren seit v1 byte-gleich mit jerico. Auf dem
Homescreen stand achtzehn Versionen lang "JERICO RH02374" mit einem Dog Ring.
Kein Test schaute hin, weil Bilder nicht als ausgeliefert gelten (Regel 1
zaehlt nur `.html`, `.js`, `.css`). Aufgefallen ist es erst auf die Frage,
ob es schon ein eigenes Icon gibt. `tests/ui.test.mjs` vergleicht jetzt mit
den Hashes der Schwesterprojekte und den Text in `icon.svg`.

### 12a. Was nicht festgenagelt ist, wird irgendwann weitergedreht

**Elfter Vorfall, v14.** Der Push von v14 war rot. Nicht wegen des Codes:
GitHub hatte `ubuntu-latest` auf 26.04 weitergedreht, und Playwright 1.56.1
kennt das Image nicht. Der Schritt "Chromium installieren" brach ab mit
`ERROR: Playwright does not support chromium on ubuntu26.04-x64` - nach elf
Sekunden, also bevor ein einziger Test lief.

**Was daran lehrreich ist:** `package.json` legt Playwright auf eine exakte
Version fest, und der Test dazu begruendet das ausdruecklich damit, dass CI
sonst "eine neuere Playwright-Fassung zieht, die einen anderen
Chromium-Build erwartet". Der Gedanke war richtig und die Haelfte davon
umgesetzt - das Paket war festgenagelt, die Maschine darunter nicht.

Es gibt immer ein Stockwerk tiefer. Pinnt man das Paket, rollt das Image;
pinnt man das Image, rollt die Action-Version; und so weiter.

**Die Regel:** was eine Version hat, bekommt eine. `runs-on` nennt ein
konkretes Image, nicht `-latest`. Und wer eines hochzieht, zieht die
zugehoerige Werkzeugversion mit - die beiden gehoeren zusammen.

**Seitdem geprueft:** `tests/workflow.test.mjs` verbietet `-latest` in
`runs-on` und prueft in der Gegenrichtung, dass jeder Job ueberhaupt ein
Image nennt. Ohne die zweite Pruefung waere die erste auch dann gruen, wenn
`runs-on` ganz fehlt - dann laeuft der Job gar nicht.

**Und fuer die Fehlersuche:** ein roter Lauf, der nach Sekunden endet und
dessen Fehler in einem Installationsschritt steht, ist ein Umgebungsbefund,
kein Codebefund (Regel 7e). Der zweite Job, `Versionsdisziplin`, war die
ganze Zeit gruen - er braucht keinen Browser. Dass genau ein Job faellt und
der andere nicht, sagt schon, wo man suchen muss.

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
