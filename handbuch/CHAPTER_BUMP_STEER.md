# Mustang Track Chassis Setup - Bump Steer

**Dokumentrolle:** Fachkapitel - dynamische Spuränderung über Federweg
**Version:** 0.2
**Datum:** 2026-10-05
**Status:** Fachkapitel - **Messung durchführbar**, Vorrichtung vorhanden
**Bezug:** [`TEMPLATE_BUMP_STEER_SHEET.md`](TEMPLATE_BUMP_STEER_SHEET.md) · [`00_PROJECT.md`](00_PROJECT.md) · [`CONVENTIONS.md`](CONVENTIONS.md) §10

---

> **Messmittel vorhanden:** **B-G Racing BGR310** Bump Steer Gauge - Genauigkeit 0,1 mm, Auflösung 0,01 mm, PCD 5 x 100-130 mm (Mustang: 5 x 114,3 mm, passt). Daten in `docs/quellen/A-14-bg-racing-bgr310-bump-steer-gauge.md`.
>
> **Arbeitsanleitung mit Protokoll:** [`TEMPLATE_BUMP_STEER_SHEET.md`](TEMPLATE_BUMP_STEER_SHEET.md) - Vorbereitung, Montage, Messablauf, Auswertung und Korrekturschleife.
>
> **Noch nicht gemessen.** Die Bump-Steer-Kurve dieses Fahrzeugs ist unbekannt. Besonders relevant, weil Shelby Drop, LCA Camber Kit und geänderte Ride Height die Geometrie gegenüber Serie verschoben haben - und weil Slovakiaring mit seinen vier Kuppen genau diese Eigenschaft fordert ([`CHAPTER_TRACKS.md`](CHAPTER_TRACKS.md) §4).

---

### 1. Definition

Bump Steer ist die **Toe-Änderung eines Rades durch Federweg**, ohne dass der Fahrer zusätzlich lenkt.

Das Rad kann beim Ein- oder Ausfedern:

- toe-in
- toe-out

erzeugen.

Longacre definiert Bump Steer ausdrücklich als Toe-in/Toe-out während die Aufhängung von normaler Ride Height durch Bump bis Droop bewegt wird.

> **Statisches Toe kann perfekt sein und die dynamische Spur trotzdem falsch.**

---

## 2. Warum Bump Steer entsteht

Das Rad wird durch die Querlenker auf einer bestimmten räumlichen Bahn geführt.

Gleichzeitig beschreibt der äußere Spurstangenkopf einen Bogen um den inneren Spurstangenpunkt.

Wenn diese Bewegungsbahnen geometrisch nicht ausreichend zusammenpassen, zieht oder drückt die Spurstange den Steering Arm während des Federwegs.

Das Rad lenkt dadurch selbstständig.

Vereinfacht:

```text
Control-arm motion
        +
Tie-rod motion
        ↓
unterschiedliche Bewegungsbahn
        ↓
Steering Arm wird gezogen/gedrückt
        ↓
Toe ändert sich
```

---

## 3. Warum das auf der Rennstrecke relevant ist

Bump Steer kann auftreten bei:

- Bremsen
- Einfedern des Außenrades
- Kerbs
- Bodenwellen
- Kompressionen
- gleichzeitigem Lenken und Federn

Mögliche Symptome:

- Auto "dartet"
- nervös beim Bremsen
- unruhig über Bodenwellen
- unvorhersehbarer Turn-in
- Lenkkorrekturen über Kerbs
- unterschiedliche Reaktion links/rechts

Street or Track beschreibt besonders kritisch den Fall, wenn das Fahrwerk bereits belastet ist und zusätzlich eine Bodenwelle hinzukommt.

---

## 4. Mustang-spezifische Relevanz

Bei einem frühen Mustang kann Bump Steer besonders relevant werden, wenn Geometrie verändert wurde.

Bei unserem Fahrzeug:

- Shelby Drop
- veränderte Camber-/Castor-Einstellung
- einstellbare Strut Rods
- LCA Camber Kit
- Howe Ball Joints
- manuelle Lenkung
- geänderte Ride Height möglich

Street or Track weist ausdrücklich darauf hin, dass Änderungen von:

- caster
- camber
- static ride height

Bump-Steer-Verhalten stärker sichtbar machen können.

---

## 5. Welche Bauteile bestimmen die Kurve?

Relevant sind insbesondere:

- innerer Tie-Rod-Pivot
- äußerer Tie-Rod-Pivot
- Tie-Rod-Länge
- Höhe des äußeren Tie Rod
- Steering Arm
- Pitman Arm
- Idler Arm
- Center Link
- Spindel/Achsschenkel
- LCA/UCA-Geometrie
- Ball-Joint-Positionen
- Ride Height

Bei Manual Steering des 65/66 Mustang ist der Zusammenhang aus Pitman Arm, Center Link und Idler Arm besonders wichtig.

---

## 6. Ausgangspunkt: Ride Height

Longacre fordert zuerst die reale statische Fahrwerksposition zu bestimmen.

Geeignete Referenzen:

- Dämpferlänge
- UCA-Winkel
- definierte Chassis-/Hub-Position

Für unser Projekt wird die **finale Race-Ready Ride Height** als Nullpunkt verwendet.

```text
Droop          Ride Height          Bump
  -                  0                 +
```

Alle Bump-Steer-Werte beziehen sich auf diesen Nullpunkt.

---

## 7. Messhardware

Standardprinzip:

- Messplatte an Radnabe
- Messuhr / Dial Indicator
- Roller bzw. zweite Referenz
- definierte Federwegsskala
- Wagenheber unter LCA
- Lenkung fixiert

Longacre nutzt:
- Aluminiumplatte auf der Nabe
- Single-Dial-Gauge mit Roller
- Skala für Wheel Travel

Mögliche Werkzeuge für unser Projekt:

1. professioneller Longacre/BG-Racing-Bump-Steer-Gauge
2. eigener stabiler Hub-Plate-Aufbau mit Messuhr
3. später ggf. Laser-Messsystem

---

## 8. Fahrzeug vorbereiten

### Vor Beginn

- finale bzw. dokumentierte Ride Height
- Camber/Castor in dokumentiertem Zustand
- statisches Toe dokumentiert
- Lenkung mechanisch spielfrei
- Radlager spielfrei
- Tie Rods spielfrei
- Idler/Pitman geprüft

### Für die Messung

Longacre-Verfahren:

1. Ride-Height-Position dokumentieren
2. Chassis auf festen Ride-Height-Block setzen
3. Rad entfernen
4. Feder entfernen bzw. Federkraft so eliminieren, dass die Aufhängung frei bewegt werden kann
5. Stabilisator lösen
6. Hub mit Wagenheber über den gesamten Federweg bewegen

Wichtig:
- Chassis bleibt fest
- nur die Radaufhängung bewegt sich

---

## 9. Messplatte montieren

1. Platte spielfrei an der Nabe befestigen
2. Platte mit kleiner Libelle horizontal ausrichten
3. Hub darf sich während der Messung nicht drehen
4. bei jeder Federwegposition horizontale Lage kontrollieren

Longacre weist ausdrücklich darauf hin:
- Steering darf sich nicht bewegen
- Hub/Plate darf nicht rotieren

---

## 10. Lenkung fixieren

Bump Steer misst die Spuränderung **ohne zusätzliche Lenkbewegung**.

Deshalb:

- Lenkrad/Steering Box exakt fixieren
- Center Link darf nicht wandern
- Spiel darf nicht von Messpunkt zu Messpunkt die Richtung wechseln

Für hohe Wiederholbarkeit wird später eine definierte Steering-Lock-Lösung dokumentiert.

---

## 11. Nullpunkt herstellen

1. Aufhängung auf reale Ride-Height-Position bringen
2. Gauge an die Platte stellen
3. Roller und Messuhr passend positionieren
4. Messuhr auf 0
5. Wheel Travel = 0

Das ist der Referenzpunkt.

---

## 12. Messung in Bump

Longacre misst klassisch:

- +1"
- +2"
- +3"

und empfiehlt bei detaillierter Analyse Werte alle 1/4" oder 1/2".

Für unseren Mustang ist eine feinere Auflösung um die reale Fahrhöhe sinnvoll.

### Projekt-Messraster V0.1

**Bump:**
- +6 mm
- +12 mm
- +18 mm
- +25 mm
- +38 mm
- +50 mm
- danach bis zum real relevanten Bump-Travel

Warum fein um Null?

Weil ein Rundstreckenfahrzeug einen großen Teil seiner Zeit in einem relativ begrenzten Arbeitsfenster um die statische Fahrhöhe verbringt.

---

## 13. Messung in Droop

Zurück zu 0.

Dann:

- -6 mm
- -12 mm
- -18 mm
- -25 mm
- -38 mm
- -50 mm
- bis zum real relevanten Droop

Nicht automatisch 3" Droop messen, wenn das reale Fahrwerk dort nie arbeitet oder vorher mechanisch begrenzt wird.

---

## 14. Messrichtung definieren

Im Projekt wird jeder Wert eindeutig als:

- **Toe-in**
- **Toe-out**

gekennzeichnet.

Zusätzlich wird eine numerische Vorzeichenkonvention festgelegt:

> **positiv = Toe-in**  
> **negativ = Toe-out**

Diese Konvention muss auf jeder Grafik stehen.

---

## 15. Messprotokoll

```text
Seite: LF / RF
Ride Height:
Camber:
Castor:
Static Toe:
Lenkwinkel: 0°

Wheel Travel     Toe Change
-50 mm           ______
-38 mm           ______
-25 mm           ______
-18 mm           ______
-12 mm           ______
 -6 mm           ______
  0 mm           0
 +6 mm           ______
+12 mm           ______
+18 mm           ______
+25 mm           ______
+38 mm           ______
+50 mm           ______
```

Danach als Kurve darstellen.

---

## 16. Warum die Kurve wichtiger ist als ein Einzelwert

Zwei Fahrzeuge können bei +25 mm denselben Toe-Wert besitzen, aber völlig unterschiedliche Kurven:

```text
Auto A:
0 -> kleine stetige Änderung

Auto B:
0 -> erst stark Toe-out -> danach zurück
```

Der einzelne Endwert verschweigt das Verhalten dazwischen.

Deshalb ist das primäre Ergebnis:

> **Toe Change vs. Wheel Travel als Graph**

---

## 17. Links und rechts getrennt messen

Beide Seiten müssen separat gemessen werden.

Vergleichen:

- Richtung
- Größenordnung
- Nullnähe
- Kurvenform
- Wendepunkte

Große Asymmetrie kann auf:

- unterschiedliche Tie-Rod-Geometrie
- Idler/Pitman-Höhe
- Chassis-Toleranzen
- verbogene Teile
- unterschiedliche Ride Height
- Montage

hinweisen.

---

## 18. Geradeaus reicht nicht immer

Longacre empfiehlt zusätzlich zur Geradeausmessung auch eine Messung bei einem Lenkwinkel, der ungefähr dem **Mid-Corner-Lenkwinkel auf der Strecke** entspricht.

Grund:

Beim Lenken verändern sich durch:

- Castor
- Camber
- KPI

die räumliche Lage und Höhe der äußeren Tie-Rod-Enden.

Damit kann sich auch die Bump-Steer-Kurve ändern.

Für unser Projekt:

### Phase 1
beide Seiten bei **0° Steering**

### Phase 2
bei auffälligem Verhalten zusätzlich repräsentativen Track-Lenkwinkel messen

---

## 19. Zielgröße

Für ein seriennahes Chassis empfiehlt Longacre als Ausgangspunkt, Bump Steer **zu minimieren**.

Das ist unsere Baseline.

Wichtig:

> Es wird kein erfundener harter Grenzwert als Naturgesetz verwendet.

Der früher diskutierte Richtwert von etwa **0,020" pro 1" Federweg (~0,5 mm pro 25,4 mm)** bleibt vorläufig nur ein **zu validierender Engineering-Richtwert**, nicht unser verbindliches Ziel.

Bevor er auf der Website als Empfehlung erscheint, wird er noch gegen zusätzliche Road-Racing-/Vehicle-Dynamics-Quellen geprüft.

---

## 20. Korrekturprinzip

Bump Steer wird nicht über statisches Toe "wegkorrigiert".

Statisches Toe verschiebt nur den Ausgangswert.

Die **Kurvenform** muss geometrisch beeinflusst werden.

Typische Stellgrößen:

- Höhe äußerer Tie-Rod-Pivot
- ggf. Höhe/Geometrie innerer Pivot
- Tie-Rod-Länge
- Steering Arm / Spindle
- Ride Height

---

## 21. Adjustable Bump-Steer Tie Rods

Für 65/66 Manual-Steering-Mustangs existieren u. a.:

- Baer Tracker
- Global West ADJ-43

Diese Systeme ersetzen den äußeren Serien-Spurstangenkopf durch:

- Pin
- Rod End
- Spacer/Shim-System

Damit kann die **Höhe des äußeren Tie-Rod-Pivots** verändert werden.

Opentracker und Street or Track bieten Baer-Tracker-Systeme für 1965-66 Manual Steering an; Global West bietet ebenfalls ein entsprechendes Kit.

Aber:

> **Ein Bump-Steer-Kit ist kein Beweis, dass Bump Steer richtig eingestellt ist.**

Die richtige Spacer-Höhe muss durch Messung bestimmt werden.

---

## 22. Korrekturschleife

```text
IST-KURVE MESSEN
       ↓
Richtung des Fehlers bestimmen
       ↓
eine geometrische Änderung
       ↓
gesamte Kurve erneut messen
       ↓
vergleichen
       ↓
weiter optimieren
```

Nicht:
- Spacer nach Gefühl
- Probefahrt
- weitere Spacer

---

## 23. Zusammenhang mit anderen Einstellungen

Nach Änderungen an folgenden Punkten ist Bump Steer erneut zu prüfen:

- Ride Height
- UCA/Shelby Drop
- LCA-Position
- Spindel
- Steering Arm
- Tie Rod
- Idler Arm
- Pitman Arm
- Center Link
- Ball-Joint-Geometrie
- starke Castoränderung

Auch nach Unfallschäden oder Bordstein-/Kerb-Kontakt kann eine Kontrollmessung sinnvoll sein.

---

## 24. Zusammenhang mit Toe

Finales statisches Toe wird **nach** der Bump-Steer-Geometrie eingestellt.

Longacre nennt Bump Steer ausdrücklich als einen der Punkte, die vor einer finalen Toe-Einstellung definiert sein sollten.

Ablauf:

1. Bump Steer messen/einstellen
2. Fahrzeug vollständig zusammenbauen
3. Race-ready setzen
4. Castor/Camber prüfen
5. final Toe einstellen

---

## 25. Zusammenhang mit Track-Handling

Mögliche Hinweise auf relevantes Bump Steer:

### Bremsen
- Fahrzeug wird auf Unebenheiten nervös
- Richtungsänderung beim Einfedern

### Turn-in
- Auto reagiert übermäßig scharf oder inkonsistent

### Mid-Corner
- Lenkbedarf ändert sich über Bodenwellen

### Kerbs
- plötzliches "darting"

Aber:

Diese Symptome beweisen Bump Steer nicht. Ähnliche Symptome können auch entstehen durch:

- Spiel
- Dämpfer
- Reifen
- Toe
- Radlager
- Ackermann
- Compliance
- Differenzial

Deshalb: **messen statt diagnostisch raten.**

---

## 26. Erstes reales Messprogramm am Mustang

### Session 1 - Baseline

Noch nichts verändern.

1. finale Race-Ready Ride Height dokumentieren
2. Castor/Camber/Toe dokumentieren
3. Stabi lösen
4. Feder entlasten/entfernen
5. LF bei 0° Steering messen
6. RF bei 0° Steering messen
7. Kurven plotten
8. links/rechts vergleichen

### Session 2 - Relevanter Federweg

Aus realem:
- Bump-Stop-Abstand
- Dämpferweg
- Track-Beobachtung

den tatsächlich relevanten Bereich definieren.

### Session 3 - Korrektur

Nur wenn die Baseline eine relevante Abweichung zeigt.

---

## 27. Offene fahrzeugspezifische Punkte

- aktueller äußerer Tie Rod seriennah oder bereits verändert?
- exakte Spindel
- Steering Arm
- Pitman Arm
- Idler Arm
- Center Link
- aktuelle Tie-Rod-Winkel bei Ride Height
- reale Bump-/Droop-Reserve
- Howe Ball Joint geometrische Höhe gegenüber Serie
- Einfluss des vorhandenen Shelby Drop
- ob ein Bump-Steer-Kit bereits vorhanden ist
- welches Messgerät verwendet werden soll

---

## 28. Quellen

### Primär / Hersteller

**Longacre - Bump Steer Gauge Instructions**  
https://www.longacreracing.com/instructions/text/79000PI.pdf

Verwendet für:
- Definition
- Ride-Height-Referenz
- Feder/Stabi lösen
- Hub Plate
- Messung in Bump/Droop
- 1"/2"/3"-Messpunkte
- feinere 1/4"/1/2"-Kurve
- Steering und Hub fixieren

**Longacre - Bumpsteer Tech: Back to Basics**  
https://longacreracing.com/pages/bumpsteer-tech-back-to-basics

Verwendet für:
- geometrische Ursache
- Messsysteme
- Messung auch bei Lenkwinkel
- Ziel "minimize" bei factory chassis

**Longacre - Set Toe Properly**  
https://longacreracing.com/pages/set-toe-properly

Bestätigt:
- Bump Steer vor finalem Toe

### Mustang-spezifische Komponenten

**Global West - Mustang Bump Steer Kit 1964-73 / Manual 64-66**  
https://www.globalwest.net/product/mustang-bump-steer-kit-1964-1965-1966-global-west-suspension/

**Opentracker - Baer Tracker 1965-66**  
https://opentrackerracing.com/shop/baer-tracker-bump-steer-kit-1965-1966/

**Street or Track - Baer Tracker 1965-66**  
https://streetortrack.com/baer-tracker-bump-steer-kit-for-1965-66-ford-mustangs-3261001

---

## 29. Definition of Done

- [x] Definition und Ursache
- [x] Track-Relevanz
- [x] Mustang-Bezug
- [x] Longacre-Messverfahren
- [x] Bump und Droop
- [x] feines Messraster
- [x] Links/Rechts-Vergleich
- [x] Messung bei Lenkwinkel berücksichtigt
- [x] Adjustable Tie Rods eingeordnet
- [x] final Toe danach
- [x] Symptome nicht als Beweis behandelt
- [ ] exakte reale Lenkungsteile dokumentiert
- [ ] Messgerät festgelegt
- [ ] Baseline-Kurven LF/RF gemessen
- [ ] Track-Federweg definiert
- [ ] verbindlicher Zielbereich anhand zusätzlicher Road-Racing-Quellen validiert
