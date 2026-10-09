# Mustang Track Chassis Setup
## Kapitel: Toe, Ackermann & Thrust Angle

**Fahrzeug:** Ford Mustang 1966 – Rundstrecke  
**Version:** 0.1 – 2026-10-04  
**Status:** Fachkapitel; GitHub unverändert

---

## 1. Warum diese drei Themen zusammengehören

Alle drei beschreiben, wohin die Räder relativ zum Fahrzeug und zur Kurvenbahn zeigen:

- **Toe**: relative Ausrichtung der beiden Räder einer Achse
- **Ackermann**: Unterschied der Lenkwinkel von Innen- und Außenrad beim Einlenken
- **Thrust Angle**: Richtung, in die die Hinterachse das Fahrzeug geometrisch "schiebt"

Ein korrekt gemessenes Total Toe allein reicht deshalb nicht aus.

Ein Fahrzeug kann:
- den richtigen Gesamt-Toe besitzen,
- aber ein schiefes Lenkrad haben,
- ein Vorderrad relativ zur Fahrzeugachse falsch ausgerichtet haben,
- oder eine nicht rechtwinklig stehende Hinterachse besitzen.

---

## 2. Toe — Definition

Von oben betrachtet:

### Toe-in
Die Vorderkanten der Räder stehen näher zusammen als die Hinterkanten.

### Toe-out
Die Vorderkanten stehen weiter auseinander.

Wir dokumentieren für das Projekt:

- **Total Toe**
- möglichst auch **Individual Toe LF/RF**

Die bisherige Mustang-Baseline bleibt:

**1/16" Gesamt-Toe-in ≈ 1,6 mm**

Das ist zunächst nur der bekannte Ausgangszustand, kein endgültiger Track-Sollwert.

---

## 3. Warum Toe fahrdynamisch wirkt

Toe beeinflusst:

- Geradeauslauf
- Lenkradruhe
- Initial Turn-in
- Reifen-Schräglauf bereits in Geradeausfahrt
- Temperatur/Verschleiß
- Reaktion auf Compliance und Bump Steer

Zu viel Toe — egal in welche Richtung — erzeugt zusätzlichen Reifenschlupf und Rollwiderstand.

Longacre nennt kleine Toe-out-Werte als verbreitete Rennpraxis, bezieht viele konkrete Zahlen aber auf kurze US-Ovalstrecken. Diese Zahlen werden für unseren europäischen Rundstrecken-Mustang **nicht** als Zielwerte übernommen.

---

## 4. Toe erst am Ende finalisieren

Longacre fordert vor der finalen Toe-Einstellung unter anderem:

- Race-ready Zustand
- Ride Height
- Gewichtsverteilung
- Bump Steer
- Camber
- Castor
- Ackermann
- Reifendruck

Außerdem soll die Lenkung zentriert und das Fahrzeug nach jeder Änderung zurück und anschließend vorwärts gerollt werden, damit Spiel und Reifenverspannung reproduzierbar gesetzt sind.

Daher:

> **Toe ist der letzte statische Alignment-Wert, nicht der erste.**

---

## 5. Longacre Toe Plates — was sie wirklich messen

Toe Plates messen sehr schnell die **Gesamtdifferenz** zwischen Vorder- und Hinterkante der beiden Vorderreifen.

Longacre:

1. Räder geradeaus
2. ebener Untergrund
3. Castor/Camber vorher einstellen
4. Platten vollständig an Reifen anlegen
5. vorne messen
6. hinten messen
7. Differenz bilden

Eine größere Breite vorn bedeutet bei Toe Plates Toe-out.

---

## 6. Messkonvention für unser Projekt

Wir definieren:

- `F` = Abstand vorne
- `R` = Abstand hinten

Dann:

`Total Toe = R − F`

Damit gilt in diesem Projekt:

- positiver Wert → Toe-in
- 0 → parallel
- negativer Wert → Toe-out

Beispiel:

- R = 1702,0 mm
- F = 1700,4 mm

`1702,0 − 1700,4 = +1,6 mm`

→ 1,6 mm Gesamt-Toe-in.

---

## 7. Grenzen der Toe Plates

Longacre weist ausdrücklich darauf hin, dass Toe Plates beeinflusst werden durch:

- Felgenschlag
- Reifenschlag
- Seitenwandunregelmäßigkeiten
- Reifenwulst / Bulge

Deshalb bei hoher Genauigkeit:

- Seitenwand-Hochpunkte markieren, oder besser
- Reifen anreißen / scribe line verwenden.

---

## 8. Tire Scribe — präzisere Referenz

Longacre empfiehlt für höhere Wiederholgenauigkeit eine umlaufende Linie auf jedem Vorderreifen.

Vorgehen:

1. Rad anheben
2. Rad drehen
3. feste Spitze ansetzen
4. umlaufende Linie erzeugen
5. beide Räder absetzen
6. Fahrzeug zurückrollen
7. wieder vorwärts in Messposition
8. Abstand der Linien vorne und hinten messen

Der Vorteil:

> Die Linie beschreibt die reale Rotationsebene des Reifens und reduziert Fehler durch Seitenwandwobble oder Felgenschlag.

---

## 9. Total Toe ist nicht Individual Toe

Toe Plates können sagen:

> Beide Räder zusammen besitzen +1,6 mm Toe-in.

Sie sagen aber nicht automatisch:

- LF = +0,8 mm
- RF = +0,8 mm

Es könnte auch sein:

- LF nahezu 0
- RF deutlich toe-in

Die Summe wäre trotzdem korrekt.

Für saubere Lenkungsmitte und Fahrzeugbezug brauchen wir deshalb zusätzlich:

**String Alignment.**

---

## 10. String Alignment

Ziel:

Zwei Schnüre parallel zu einer definierten Fahrzeug-/Hinterachsreferenz aufbauen.

Dann für jedes Vorderrad messen:

- Abstand String → Felge vorne
- Abstand String → Felge hinten

Daraus entsteht Individual Toe.

### Wichtig

Die Strings dürfen nicht einfach optisch "parallel zur Karosserie" aufgebaut werden.

Referenz muss geometrisch sein:
- Hinterachse / Naben
- Fahrzeugmittellinie
- definierte Chassispunkte

Sonst kann Karosserieversatz als Alignmentfehler erscheinen.

---

## 11. Toe in mm vs. Winkel

Toe in Millimetern hängt vom Messdurchmesser ab.

Für ein einzelnes Rad:

`α = arctan(Δ / D)`

Für kleine Winkel näherungsweise:

`α [°] ≈ Δ / D × 57,3`

mit:
- `Δ` = Vorder-/Hinterdifferenz am Rad
- `D` = effektiver Messdurchmesser

Daher ist eine Angabe wie "2 mm Toe" ohne Messmethode nicht vollständig.

Für unser Setup Log werden deshalb gespeichert:

- Total Toe in mm
- Messmethode
- Messdurchmesser bzw. Tool

---

## 12. Toe und Ride Height

Toe verändert sich über Federweg, wenn Bump Steer vorhanden ist.

Deshalb darf Toe nur bei:

- echter belasteter Ride Height
- gesetztem Fahrwerk

final bewertet werden.

Ein auf dem Chassis aufgebockter Mustang mit ausgefederten Rädern liefert keinen gültigen Track-Toe-Wert.

---

## 13. Gleichmäßige Tie-Rod-Verstellung

Longacre empfiehlt, die Spurstangen möglichst gleichmäßig zu verstellen, um die Lenkungsgeometrie und Zentrierung zu erhalten.

Beim Mustang bedeutet das:

- Steering Box / Center Link in geometrischer Mitte
- Lenkradstellung prüfen
- nicht einfach nur eine Seite drehen, bis Total Toe stimmt

Wenn das Lenkrad nach korrektem Alignment schief ist, wird zuerst geprüft:
- Individual Toe
- Lenkungsmitte
- Thrust Angle

und nicht das Lenkrad auf der Welle "optisch geradegesetzt".

---

## 14. Ackermann — Definition

In einer Kurve fährt das kurveninnere Vorderrad auf einem kleineren Radius als das äußere.

Es benötigt daher grundsätzlich einen größeren Lenkwinkel.

Ackermann beschreibt den Unterschied zwischen Innen- und Außenrad-Lenkwinkel.

```text
Kurve links:

Innenrad LF  → größerer Lenkwinkel
Außenrad RF  → kleinerer Lenkwinkel
```

---

## 15. Warum "100 % geometrisches Ackermann" nicht automatisch optimal ist

Die klassische Ackermann-Konstruktion basiert auf rollenden Rädern ohne relevante Slip Angles.

Ein Rennreifen erzeugt Seitenkraft aber mit Slip Angle.

Daher hängt ein günstiger realer Lenkwinkelunterschied ab von:

- Reifen
- Radlast
- Geschwindigkeit
- Kurvenradius
- Compliance
- Fahrwerkskinematik

Deshalb behandeln wir Ackermann zunächst als **messbare Kennlinie**, nicht als pauschalen Zielwert.

---

## 16. Dunlop CG/6 — Toe-out-on-turns

Die originale Dunlop-Anleitung besitzt bereits ein sauberes Verfahren.

### Linkskurve

1. beide Turnplates bei Geradeausstellung auf 0
2. nach links lenken
3. linkes/inneres Rad exakt 20°
4. Winkel des rechten/äußeren Rades ablesen
5. Differenz bestimmen

### Rechtskurve

1. zurück auf 0
2. nach rechts lenken
3. rechtes/inneres Rad exakt 20°
4. Winkel des linken/äußeren Rades ablesen
5. Differenz bestimmen

Damit erhalten wir:
- links
- rechts
- Symmetrie

---

## 17. Ackermann nicht mit Longacre-Ovalwerten verwechseln

Longacre beschreibt beispielsweise ein 10°-Messverfahren und konkrete Ackermannwerte aus dem Oval-Racing. Dort werden auch asymmetrische Anwendungen beschrieben.

Für unseren Mustang gilt:

- Dunlop-Verfahren 20° als Baseline-Messverfahren
- links und rechts symmetrisch dokumentieren
- keine Oval-Zielwerte übernehmen
- Kurvenkennlinie später ggf. bei mehreren Lenkwinkeln erfassen

---

## 18. Erweiterte Ackermann-Kennlinie

Später sinnvoll:

| Innenrad | Außenrad | Differenz |
|---:|---:|---:|
| 5° | | |
| 10° | | |
| 15° | | |
| 20° | | |
| 25° | | |

jeweils:
- Linkskurve
- Rechtskurve

Damit entsteht eine echte Ackermann-Kurve statt nur eines Einzelpunkts.

---

## 19. Ackermann und Toe

Ackermann erscheint nur bei Lenkeinschlag.

Deshalb muss statisches Toe immer bei **exakt gerader Lenkung** gemessen werden.

Longacre weist darauf hin, dass eine nicht exakt gerade Lenkung bei einer Toe-Messung bereits Ackermann-bedingtes zusätzliches Toe-out einbringen kann.

---

## 20. Thrust Angle — Definition

Thrust Angle ist der Winkel zwischen:

- geometrischer Fahrzeugmittellinie
- tatsächlicher Schub-/Rollrichtung der Hinterachse

Bei einer starren Ford-9"-Achse sollten beide Hinterräder geometrisch eine gemeinsame Achslinie besitzen.

Steht die komplette Achse im Chassis jedoch leicht schräg, entsteht Thrust Angle.

---

## 21. Was ein falscher Thrust Angle bewirken kann

Mögliche Folgen:

- Fahrzeug "crabbed"
- Lenkrad muss für Geradeausfahrt leicht gegengestellt werden
- unterschiedliche Individual-Toe-Werte scheinen nötig
- asymmetrisches Handling
- Reifen laufen nicht entlang derselben geometrischen Achse

Deshalb:

> Hinterachse und Thrust Angle werden vor der finalen Vorderachs-Spur geprüft.

---

## 22. Hinterachse beim Blattfeder-Mustang

Die Hinterachse wird längs primär durch die Blattfedern positioniert.

Zu prüfen:

- Center Pins korrekt in Spring Perches
- Federaugenposition
- Shackle-Zustand
- Achssitz links/rechts
- U-Bolt-Montage
- Radstand links/rechts

Der Panhard Bar positioniert die Achse **lateral**; er ist nicht das primäre Bauteil, mit dem eine in Draufsicht schief stehende Achse "geradegezogen" werden sollte.

---

## 23. Praktische Thrust-/Squareness-Messung

### Methode A — Radstand links/rechts

- definierter Vorderrad-/Chassispunkt → Hinterachsmitte links
- dasselbe rechts

Vergleichen.

### Methode B — Diagonalen

Symmetrische feste Chassisreferenzen vorn zu gegenüberliegenden Hinterachs-/Nabenreferenzen messen.

### Methode C — Strings

Strings relativ zur Hinterachse und Fahrzeugmittellinie aufbauen.

Dann:
- Hinterräder links/rechts prüfen
- Vorderachse darauf beziehen

Die endgültige Projektmethode wird nach realem Aufbau des Mustang festgelegt.

---

## 24. Thrust Angle vs. Panhard Offset

Nicht verwechseln:

### Panhard Offset
Achse sitzt lateral zu weit links/rechts.

### Thrust Angle
Achse steht in Draufsicht schräg zur Fahrzeugmittellinie.

Eine Achse kann:
- lateral perfekt zentriert sein
- aber trotzdem schräg stehen

oder umgekehrt.

---

## 25. Thrust Angle vs. Pinion Angle

Ebenfalls strikt trennen:

- **Thrust Angle** = Draufsicht / Gierlage der Hinterachse
- **Pinion Angle** = Seitenansicht / Driveline-Geometrie

Ein Wedge Shim verändert primär Pinion Angle, nicht den Thrust Angle.

---

## 26. Pinion Angle als angrenzendes Rear-Geometry-Thema

Aus der früheren Mustang-Arbeit wird Pinion Angle als eigenes Kapitel übernommen.

Neue Leitlinie:

Nicht nur "Pinion X° down" messen, sondern:

- Transmission slope
- Driveshaft slope
- Pinion slope

und daraus beide U-Joint Operating Angles bestimmen.

Spicer-Grundregeln im Originalwortlaut:

> - „at each end of a driveshaft should always be **at least one-half degree**"
> - „should always be **equal within one degree of each other**"
> - „should not be larger than **three degrees**" für vibrationsfreien Betrieb

TREMEC ergänzt: Winkel **ändern sich mit Federbewegung und unter Beschleunigung/Verzögerung** — statisches Messen ist nur der Ausgangspunkt.

Vollständige Behandlung inklusive drehzahlabhängiger Maximalwerte, der „equal and opposite"-Regel und der Einschränkung bei seitlichem Versatz: [`CHAPTER_REAR_SUSPENSION_PANHARD_PINION.md`](CHAPTER_REAR_SUSPENSION_PANHARD_PINION.md) §15–17.

---

## 27. Kompletter Ablauf für Toe / Ackermann / Thrust

### A — Rear Reference
- Achse square
- Radstand links/rechts
- lateral Panhard position
- Thrust Angle

### B — Steering Reference
- Steering Box geometrisch mittig
- Center Link / linkage prüfen
- Lenkrad

### C — Front Dynamic Geometry
- Bump Steer bereits erledigt
- Castor
- Camber

### D — Total Toe
- Longacre Toe Plates
- erste Einstellung

### E — Individual Toe
- String Setup

### F — Ackermann
- CG/6 links/rechts
- Symmetrie

### G — Final
- zurückrollen
- vorwärtsrollen
- Total Toe erneut
- Individual Toe erneut
- Kontermuttern
- Abschlussmessung

---

## 28. Track-Validierung

### Toe
Beobachten:
- Geradeauslauf
- Turn-in
- Bremsstabilität
- Reifenverschleiß
- Reifentemperatur

### Ackermann
Beobachten:
- Low-/Medium-Speed Mid-Corner
- Lenkwinkel
- Reifen-Schieben / Scrub
- Unterschied Links-/Rechtskurven

### Thrust
Beobachten:
- Lenkradstellung auf Geraden
- Geradeauslauf
- Symmetrie

Track-Symptome allein beweisen aber keinen Geometriefehler. Die Messung bleibt maßgeblich.

---

## 29. Quellen

### Longacre
Toe Plates  
https://longacreracing.com/pages/toe-plates

Set Toe Properly  
https://longacreracing.com/pages/set-toe-properly

Toe-In Gauge / Tire Scribe  
https://longacreracing.com/pages/toe-in-gauge-instructions

Ackermann Effect  
https://longacreracing.com/pages/ackermann-effect

### Dunlop
CG/4-5 / CG/6 Original Operating Instructions — Nutzer-Scans

### Dana / Spicer — Klasse A
Driveline Operating Angle Calculator
https://spicerparts.com/calculators/driveline-operating-angle-calculator
Lokale Kopie: `docs/quellen/A-12-spicer-driveline-operating-angle-rules.md`

### TREMEC — Klasse A
Driveline Angle Finder App Instructions
https://tremec.com/wp-content/uploads/2023/09/TREMEC_Driveline.App_.Instructions.pdf
Lokale Kopie: `docs/quellen/A-13-tremec-driveline-app-instructions.pdf`
SHA256: `B3521BD073FBC3D85998E88660EADCCA1DCA4C8D1F56D149E70CAB9095041BAE`

---

## 30. Offene Mustang-Punkte

- exakte Steering-Box-Mittelstellung praktisch definieren
- String-Referenzpunkte am Chassis
- reales Rear-Axle-Squareness vermessen
- Radstand links/rechts messen
- tatsächlichen Thrust Angle ermitteln
- Panhard-Seitposition erfassen
- Toe-Plate-Wiederholbarkeit prüfen
- Scribe-Methode ggf. ergänzen
- Ackermann-Kurve über mehrere Lenkwinkel aufnehmen