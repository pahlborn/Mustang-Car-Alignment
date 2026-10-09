# Mustang Track Chassis Setup — CONTENT SPECIFICATION

**Version:** 0.1  
**Datum:** 2026-10-04  
**Status:** Arbeitsfassung – noch keine GitHub-Änderung

---

# 1. Seitentemplate

Jede technische Seite erhält möglichst dieselbe Struktur:

1. **Kurzantwort** – 3–6 Sätze: Was ist es und warum ist es wichtig?
2. **Physik** – technische Erklärung ohne Werkzeugbezug.
3. **Am 1966 Mustang** – konkrete Geometrie und vorhandene Komponenten.
4. **Wechselwirkungen** – was ändert sich mit?
5. **Messen** – Messprinzip.
6. **Mit vorhandenen Tools** – Dunlop / Longacre / String etc.
7. **Einstellen** – konkrete Fahrzeugmaßnahme.
8. **Nach der Einstellung** – welche Größen erneut prüfen?
9. **Track-Validierung** – welche realen Daten bestätigen oder widerlegen die Änderung?
10. **Fehlerbilder** – typische Fehlinterpretationen.
11. **Baseline / Daten** – bekannte Werte, klar als Baseline oder Quelle klassifiziert.
12. **Quellen** – Primärquellen zuerst.
13. **Offene Punkte** – noch nicht verifizierte Aussagen.

---

# 2. Content Spec: Corner Weight & Balance

## Lernziel
Nach dieser Seite muss klar sein:
- was vier Radlasten bedeuten,
- was Cross Weight ist,
- was sich über Feder-/Ride-Height-Einstellung ändern lässt,
- was nur über reale Massenverlagerung verändert werden kann,
- warum die Waage kein isoliertes „Balance-Orakel“ ist.

## Muss enthalten
- LF/RF/LR/RR
- Total
- Front/Rear %
- Left/Right %
- Cross %
- Mass Distribution vs. Wheel Load
- diagonale Kopplung
- Settling/Hysterese
- Scale Pad Plane
- Fahrer/Fuel
- Einfluss Reifenluftdruck
- Einfluss Camber
- Einfluss Dämpferreibung
- ARB Preload
- Zusammenhang Ride Height ↔ Corner Weight

## Formeln
- Total = LF + RF + LR + RR
- Front % = (LF + RF) / Total × 100
- Rear % = (LR + RR) / Total × 100
- Left % = (LF + LR) / Total × 100
- Cross % = (RF + LR) / Total × 100

## Visuals
- vier Waagenpads in Draufsicht
- Diagonalen
- Beispiel einer Corner-Weight-Änderung
- Vergleich „Masse verschieben“ vs. „Federauflage verändern“

## Mustang-spezifische Fragen
- Wo kann Ride Height tatsächlich eingestellt werden?
- Welche Auswirkungen haben die Blattfedern?
- Ist Stabi-Vorspannung vorhanden?
- Wie wird die linke 2-cm-Ride-Height-Abweichung behandelt?
- Welche Panhard-Einstellung beeinflusst Seitposition und ggf. Höhe?

---

# 3. Content Spec: Camber

## Lernziel
Camber nicht als statische Zahl verstehen, sondern als Mittel, während Kurvenfahrt einen brauchbaren Reifenaufstand zu erhalten.

## Muss enthalten
- Definition positiv/negativ
- statischer Camber
- Camber Gain
- Rollwinkel
- Tire Deflection
- Camber Thrust
- Temperature Spread nur als Diagnose im Kontext
- Cross Camber
- Grenzen der Reifenflankenmessung

## Mustang
- Shelby Drop
- UCA-Geometrie
- LCA Camber Kit
- Shim-Kopplung
- Howe Ball Joint, soweit geometrisch relevant

## Tool
- Dunlop CG/4 Originalverfahren
- Bodenquerneigung
- additive Skala
- Wiederholungsmessung

## Track
- Einstich-Pyrometer
- Druck
- Reifenbild
- Mid-corner Grip
- keine Einzelregel „innen X °C wärmer = richtig“

---

# 4. Content Spec: Castor

## Lernziel
Verstehen, warum positiver Castor Geradeauslauf, Rückstellmoment, Lenkkraft und dynamischen Camber beeinflusst.

## Muss enthalten
- Seitenansicht Steering Axis
- positiver/negativer Castor
- Trail
- Castor-induced Camber
- Lenkkraft bei Manual Steering
- Cross Caster

## Mustang
- UCA Shim-Wirkung
- Adjustable Strut Rod
- Rad wandert bei Strut-Rod-Verkürzung nach vorn
- Reifen-/Fenderfreigängigkeit
- Shelby Drop nicht mit Castor verwechseln

## Tool
- Dunlop CG/5
- 20° IN
- Nullung
- 20° OUT
- 40° Gesamtschwenk
- additive Skala

## Quellenkonflikte darstellen
- Street-/Performance-Bereich Opentracker
- SoT-Track-Beispiel +5°
- unsere Baseline +3°
- späterer Sollwert nur aus Trackvalidierung

---

# 5. Content Spec: Toe

## Lernziel
Total Toe und Individual Toe unterscheiden und verstehen, warum Gesamtspur allein ein schiefes Lenkrad oder falschen Thrust-Bezug verbergen kann.

## Muss enthalten
- Toe-in/out
- Total Toe
- Individual Toe
- Toe in mm vs. Winkel
- Reifen-/Felgenschlag
- dynamisches Toe/Bump Steer

## Tools
### Longacre Toe Plates
- Fahrzeug setzen
- vorn/hinten messen
- R−F-Konvention sauber definieren
- Grenzen

### Scribed Tire Method
- umlaufende Referenzlinie
- Vorteil bei Schlag

### String
- Einzeltoe
- Fahrzeugbezug
- Lenkradmitte

---

# 6. Content Spec: KPI / SAI / Included Angle

## Lernziel
KPI als geometrische Diagnosegröße verstehen, nicht als normalen Setupregler.

## Muss enthalten
- Steering Axis frontal
- KPI
- Camber
- Included Angle
- Scrub Radius-Verbindung
- Links-/Rechts-Abweichung als Diagnosehinweis

## Tool
- Dunlop CG/5 im Castor-Sweep

---

# 7. Content Spec: Ackermann

## Lernziel
Verstehen, warum Innen- und Außenrad in einer Kurve unterschiedliche Lenkwinkel benötigen und warum „mehr Ackermann“ nicht pauschal besser ist.

## Muss enthalten
- idealisierte Kreisgeometrie
- tatsächliche Reifenslipwinkel
- Toe-out-on-turns
- Kurvenradiusabhängigkeit
- statische 20°-Messung ist Charakterisierung, keine vollständige Trackanalyse

## Tool
- Dunlop CG/6
- links und rechts
- Symmetrie

---

# 8. Content Spec: Bump Steer

## Lernziel
Erkennen, dass korrektes statisches Toe keine Garantie für korrektes Toe im Federweg ist.

## Muss enthalten
- Tie-Rod-Arc vs. Control-Arm-Arc
- Bump
- Droop
- Toe Change vs. Wheel Travel
- Geradeausmessung
- ggf. Messung bei Lenkwinkel
- Einfluss Ride Height / Shelby Drop / Steering Arm

## Visual
Diagramm:
- X = Wheel Travel
- Y = Toe Change

## Umsetzung
Erst Messung, dann eventuelle Korrekturmaßnahmen; keine generische Shim-Empfehlung ohne reale Messdaten.

---

# 9. Content Spec: Ride Height

## Lernziel
Ride Height als geometrische Randbedingung verstehen, nicht nur als optische Fahrzeughöhe.

## Muss enthalten
- Messpunkte
- Reifenradius-Einfluss
- Chassis vs. Fendermaß
- Links-/Rechts
- rake
- Einfluss auf:
  - Radlast
  - Camber
  - Toe
  - Roll Center
  - Federweg
  - Panhard-Geometrie

## Mustang
Definierte harte Chassis-Messpunkte festlegen.

---

# 10. Content Spec: Rear Axle / Thrust / Panhard

## Lernziel
Starrachse als eigene geometrische Basis verstehen.

## Muss enthalten
- Achse square zum Fahrzeug
- Radstand links/rechts
- Thrust Angle
- Panhard laterale Positionierung
- Panhard-Winkel
- Seitverschiebung über Federweg
- Blattfederführung
- Pinion Angle klar getrennt von Alignment

## Tool
- String
- Diagonal-/Radstandmessung
- ggf. Laser später

---

# 11. Content Spec: Setup Pad

## Lernziel
Verstehen, dass schlechte Referenzfläche jede hochwertige Messung wertlos machen kann.

## Muss enthalten
- gemeinsame Ebene
- level vs. coplanar
- Turnplates
- rear plates
- Slip
- Roll-off
- feste Werkstattmarkierungen
- wiederholbare Shim-Pakete
- Messfläche mit Dunlop CG/4 als Altverfahren
- präzisere Nivellierverfahren später ergänzen

---

# 12. Content Spec: Complete Setup Procedure

## Ziel
Eine Werkstattseite, die ein unbekanntes oder verändertes Fahrzeug reproduzierbar zur Track-Baseline bringt.

### A Mechanical
- Spiel
- Lager
- Lenkung
- Befestigungen
- Reifen
- Räder
- Dämpfer/Federn

### B Reference
- Setup Pad
- Reifendruck
- Fahrer/Fuel
- Race Ready
- Ride Height

### C Rear Geometry
- Axle Square
- Thrust
- Panhard

### D Initial Front Geometry
- Castor
- Camber
- Toe

### E Scaling
- vier Radlasten
- Balance
- gewünschte Änderung
- settle
- wiederholen

### F Final Geometry
- Ride Height
- Castor
- Camber
- KPI
- Bump Steer falls relevant
- Toe
- Ackermann
- Full Lock

### G Final Scale
- Corner Weights
- Prozentwerte
- wiederholte Messung

### H Documentation
- kompletter Setup Snapshot

---

# 13. Content Spec: Track Test

## Muss enthalten
- nur eine kontrollierte Änderung
- gleiche Reifenbasis
- möglichst vergleichbare Trackbedingungen
- Druck sofort
- Pyrometer unmittelbar
- Fahrerfeedback strukturieren
- Rundenzeit nicht als einziges Kriterium

## Fahrerfeedback-Felder
- Braking
- Initial Turn-in
- Entry
- Mid
- Exit
- Traction
- Fast Corners
- Slow Corners
- Kerbs
- Steering Effort
- Stability

---

# 14. Quellenpriorität

1. Original-Herstellerunterlagen / Service Manuals
2. Komponentenhersteller für konkrete Komponente
3. etablierte Fachliteratur / Wissenschaft
4. professionelle Motorsport-Technikquellen
5. Foren/Erfahrungswerte nur ergänzend

## derzeit bestätigte Kernquellen
- Dunlop CG/4-5 / CG/6 Original Instructions — Nutzer-Scans
- Longacre: Scaling A Race Car Properly
- Longacre: Why Should I Scale My Car?
- Longacre: Computerscales AccuSet Instructions
- Longacre: Toe / Bump Steer / Pyrometer Tech
- Street or Track: 65-66 Mustang Upper Arms / LCA Camber Kit / Strut Rods
- Global West: 64-66 Mustang Caster / UCA / Strut Rod Tech
- Opentracker: 65-66 Mustang Alignment Ranges

---

# 15. Definition of Done für eine Seite

Eine Seite ist erst „fertig“, wenn:

- [ ] Definition korrekt
- [ ] Physik erklärt
- [ ] Mustang-Bezug hergestellt
- [ ] vorhandene Komponenten berücksichtigt
- [ ] Wechselwirkungen dokumentiert
- [ ] Messmethode beschrieben
- [ ] vorhandenes Tool beschrieben
- [ ] Einstellweg am Fahrzeug beschrieben
- [ ] Kontrollmessungen angegeben
- [ ] Track-Validierung angegeben
- [ ] Fehlerquellen angegeben
- [ ] Quellen bewertet
- [ ] keine unmarkierten Annahmen enthalten
- [ ] Baseline ≠ Sollwert eindeutig
