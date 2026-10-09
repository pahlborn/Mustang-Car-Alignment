# Mustang Track Chassis Setup - Legacy Findings: Rear Axle, Leaf Springs, Pinion Angle
## Legacy Findings - Rear Axle, Leaf Springs, Pinion Angle & Alignment

**Fahrzeug:** Ford Mustang 1966 - Rundstrecke  
**Version:** 0.1 - 2026-10-04  
**Status:** Wiedergewonnene Projektinformationen; noch nicht vollständig in V1-Fachkapitel überführt

---

### 1. Zweck

Dieses Dokument sammelt bereits früher erarbeitete Mustang-Projektinformationen, damit sie im neuen Chassis-Setup-Handbuch nicht verloren gehen.

Die Einträge sind in drei Klassen gegliedert:

- **[Bestätigte Projektdaten]** - bereits am Fahrzeug / im Projekt festgelegt
- **[Frühere Engineering-Arbeit]** - bereits diskutiert, aber noch einmal gegen Primärquellen zu validieren
- **[In neue Kapitel übernehmen]** - strukturell relevante Punkte

---

## 2. Bereits bekannte Fahrzeugdaten

### [Bestätigte Projektdaten]

- 1966 Ford Mustang
- Rundstreckeneinsatz
- Jerico-Getriebe
- Ford 9" Hinterachse
- Panhard Bar
- Blattfeder-Hinterachse
- Wechsel von 4-leaf Reverse-Eye auf Mid-Eye
- nach dem Wechsel blieb die tatsächliche Heckhöhe nahezu unverändert
- links wurde wiederholt eine etwa **20 mm niedrigere Ride Height** beobachtet
- bekannte Front-Baseline:
  - Castor +3°
  - Camber -2°
  - Gesamt-Toe-in 1/16" ≈ 1,6 mm
- Avon CR6ZZ
- Shelby Drop
- Adjustable Strut Rods
- LCA Camber Kit

---

## 3. Blattfedern - frühere Arbeit

### [Frühere Engineering-Arbeit]

Bereits verglichen wurden:

- Maier Racing / Mike Maier MOD
- MOD Narrow
- Scott Drake Blattfedern

Für den Track-Mustang wurden die Mike-Maier-/Maier-Racing-orientierten Performance-Blattfedern als die passendere Richtung bewertet.

Zusätzlich diskutiert:

- Delrin-Buchsen
- Heavy-Duty Shackles
- hochwertige U-Bolts
- verstärkte Spring Plates
- einstellbare Dämpfer
- Panhard Bar

Traction Bars wurden nicht automatisch als notwendig angesehen.

### Wichtige Erkenntnis für das neue Handbuch

Eine Blattfeder ist gleichzeitig:

- Feder
- Längsführung der Achse
- Reaktionsglied für Antriebs-/Bremsmoment

Damit beeinflussen Änderungen an Blattfeder, Shackle oder Wedge nicht nur Ride Height, sondern potentiell:

- Achsposition
- Pinion Angle
- Axle Wrap
- Roll Steer
- Compliance Steer
- Radlasten
- Panhard-Geometrie

---

## 4. Hinterachse rechtwinklig im Fahrzeug

### [Frühere Engineering-Arbeit]

Für die Achsposition wurde bereits ein Diagonalverfahren diskutiert.

Mögliche Referenz:

- linker vorderer Federaugen-/Chassis-Referenzpunkt -> rechte Achs-/Nabenmitte
- rechter vorderer Federaugen-/Chassis-Referenzpunkt -> linke Achs-/Nabenmitte

Die beiden Diagonalen sollten möglichst gleich sein.

Früher diskutierte Werkstattbewertung:

- <1 mm Differenz: ausgezeichnet
- 1-3 mm: sehr gut
- >5 mm: Ursache suchen

**Diese Toleranzwerte werden vor Veröffentlichung nochmals gegen Chassis-/Alignment-Fachquellen validiert.**

Zusätzlich:
- Center Bolts der Blattfedern müssen korrekt in den Spring Perches sitzen.
- U-Bolts dürfen die Achse nicht in einer falschen Position "festklemmen".
- Nach Arbeiten an Blattfedern muss die Hinterachse geometrisch erneut kontrolliert werden.

---

## 5. Flat Shim vs. Wedge Shim

Diese Trennung ist wichtig.

### Flat Shim / Spacer

Zweck:
- Fahrzeughöhe / links-rechts-Höhe beeinflussen

Mögliche Nebenwirkungen:
- U-Bolt-Länge
- Federklemmung
- Panhard-Höhe
- Radlasten

### Wedge Shim

Zweck:
- **Pinion Angle** verändern

Ein Wedge ist kein allgemeiner Ride-Height-Shim.

Diese beiden Funktionen dürfen im neuen Handbuch nicht vermischt werden.

---

## 6. Pinion Angle - frühere Projektarbeit

### [Bestätigte frühere Projektdaten / Messansätze]

Es wurde früher ungefähr mit folgenden Größen gearbeitet:

- Getriebe-/Ausgangswelle ca. **3,5° nach unten**
- statischer Pinion etwa **1° nach unten**
- frühere Annahme/Beobachtung: Serien-Blattfedern könnten unter Last deutlich mehr Pinion Rise/Axle Wrap zeigen
- Performance-Blattfedern sollen die Rotation reduzieren

Es wurde außerdem eine **2°-Wedge-Empfehlung, dicke Seite nach vorn**, aus dem Blattfeder-/Herstellerkontext diskutiert.

### Wichtige Korrektur für das neue Handbuch

Ein pauschaler "2° Wedge gehört hinein"-Ansatz ist nicht sauber.

Der neue Prozess muss lauten:

1. reale Transmission Slope messen
2. reale Driveshaft Slope messen
3. reale Pinion/Axle Slope messen
4. daraus beide U-Joint Operating Angles berechnen
5. unter unterschiedlicher Last/Fahrzustand beobachten oder abschätzen
6. erst danach Wedge bestimmen

Dana/Spicer fordert bei einem Einwellen-Antrieb, die Betriebswinkel an beiden Kreuzgelenken zu bestimmen. Als Grundregel sollen beide Betriebswinkel möglichst klein sein und typischerweise innerhalb etwa 1° zueinander liegen; Spicer nennt 0,5° Mindestwinkel und grundsätzlich maximal etwa 3° für gute vibrationsarme Lebensdauer, abhängig von Drehzahl. TREMEC arbeitet ebenfalls mit maximal etwa 3° je Gelenk und warnt ausdrücklich davor, nur "Pinion Angle" isoliert zu betrachten.

---

## 7. Pinion Rise / Axle Wrap

### [Frühere Engineering-Arbeit]

Früher wurde für Blattfedern qualitativ angenommen:

- weiche Serienfeder -> größere Achsrotation unter Last
- steifere Performance-/Race-Blattfeder -> kleinere Achsrotation

Genannte frühere Arbeitsbereiche waren ungefähr:
- Serie: 3-5°
- Performance: 1,5-3°
- sehr steif/race: 1-2°

Diese Zahlen werden **nicht** ungeprüft als Mustang-Sollwerte übernommen.

### Besseres neues Verfahren

Wenn möglich:

- statisch messen
- Coast / unbelastet dokumentieren
- unter Antriebslast mit Kamera/Referenzmarkierung oder Sensor erfassen
- Differenz zwischen statischer und belasteter Pinion-Lage bestimmen

Das erlaubt, die statische Wedge-Einstellung aus realem Axle Wrap abzuleiten statt aus einer Tabellenannahme.

---

## 8. Warum Pinion Angle ins Chassis-Handbuch gehört

Pinion Angle ist nicht klassisches "Wheel Alignment", gehört aber in dasselbe Gesamtprojekt, weil Ride Height und Blattfederänderungen ihn beeinflussen.

Ein Änderungskreis kann so aussehen:

```text
Leaf Spring / Shackle / Ride Height
            ↓
     axle / pinion slope
            ↓
 driveshaft operating angles
            ↓
 vibration / U-joint loading
```

Daher bekommt das spätere Handbuch im Bereich **Rear Suspension / Driveline Geometry** ein eigenes Pinion-Angle-Kapitel.

---

## 9. Blattfederwechsel und Vorderachs-Alignment

Frühere Kernerkenntnis:

Ein Blattfederwechsel verändert die Vorderachsgeometrie nicht direkt.

Er kann aber verändern:

- Fahrzeughöhe / Rake
- Corner Weights
- Chassislage
- Panhard-Lage

Dadurch können sich die final gemessenen Werte an der Vorderachse ändern.

Deshalb nach Blattfeder-/Ride-Height-Arbeiten:

1. Race-ready Zustand
2. Ride Height
3. Corner Weights
4. Hinterachse / Thrust
5. Castor
6. Camber
7. Toe

erneut prüfen.

---

## 10. Toe-Messung bei echter Ride Height

### [Frühere Alignment-Arbeit]

Bereits festgehalten:

> Front-Toe muss bei echter belasteter Ride Height gemessen werden.

Ungültig:
- Fahrzeug am Chassis aufgebockt
- Räder ausgefedert

Gültig:
- Fahrzeug auf Reifen / Turnplates / Waagen oder suspension-supported exakt auf Ride Height
- Fahrwerk gesetzt und spannungsfrei

Früher wurde außerdem beobachtet/diskutiert, dass beim 65/66 Mustang das Toe über Droop deutlich ändern kann - genau deshalb wird Bump Steer separat gemessen.

---

## 11. Toe-Winkelumrechnung

Frühere Arbeitsformel:

`Toe angle per wheel = arctan(Δ / D)`

Für kleine Winkel:

`Toe° ≈ Δ / D × 57.3`

mit:
- Δ = Differenz vorn/hinten pro Rad
- D = Messdurchmesser

Beispiel am 15"-Referenzdurchmesser 381 mm:

`2,0 mm / 381 × 57,3 ≈ 0,30°`

Wichtig:
- Gesamt-Toe in mm ist nicht dasselbe wie Toe-Winkel je Rad.
- Die Messhöhe / der effektive Messdurchmesser muss bekannt sein.

---

## 12. Neue Integration in das Handbuch

Aus diesen Legacy-Informationen entstehen zusätzliche Seiten:

### Rear Suspension
- Blattfeder-Funktion
- Shackle-Geometrie
- Axle Location
- Roll Steer / Compliance
- Panhard

### Rear Geometry
- Axle Squareness
- Thrust Angle
- lateral axle position

### Driveline Geometry
- Transmission slope
- Driveshaft slope
- Pinion slope
- U-joint operating angles
- Axle Wrap
- Wedge selection

### Diagnostics
- linkes Heck 20 mm tiefer
- Ursache systematisch ermitteln, nicht blind shimmen

---

## 13. Primärquellen für Pinion/Driveline

### Dana / Spicer - Measuring Angles
https://spicerparts.com/anglemaster/measuring-angles

Wesentliche Regeln:
- tatsächliche Komponenten-Slopes messen
- U-joint operating angles aus benachbarten Slopes bilden
- kleine Winkel bevorzugen
- Winkel an beiden Enden möglichst angleichen
- Fahrzeug auch in unterschiedlichen Lastzuständen prüfen

### Dana / Spicer - Driveline Operating Angle Calculator
https://spicerparts.com/calculators/driveline-operating-angle-calculator

Grundregeln:
- mindestens etwa 0,5° Operating Angle
- beide Enden innerhalb etwa 1°
- für vibrationsarmen Betrieb möglichst ≤3°, zusätzlich Drehzahlgrenzen beachten

### TREMEC - Driveline Angle Finder
https://tremec.com/wp-content/uploads/2023/09/TREMEC_Driveline.App_.Instructions.pdf

TREMEC:
- zielt ebenfalls auf maximal etwa 3° je U-Joint
- betrachtet Differenz der Betriebswinkel
- weist darauf hin, dass die Winkel sich mit Suspension Movement sowie Beschleunigen/Bremsen ändern

---

## 14. Offene Punkte

- frühere konkrete Seite konnte im aktuell durchsuchbaren GitHub-Bestand nicht wiedergefunden werden
- reale Transmission-/Driveshaft-/Pinion-Angles neu messen
- genaue aktuelle Blattfeder-Ausführung dokumentieren
- Shackle-Winkel links/rechts
- Panhard-Lage
- 20-mm-Linksdifferenz diagnostizieren
- reale Axle-Wrap-Größe bestimmen
