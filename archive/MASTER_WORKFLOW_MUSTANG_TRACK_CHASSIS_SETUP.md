# Mustang Track Chassis Setup
# MASTER WORKFLOW — Vom Werkstattboden bis zum Track-Test

**Fahrzeug:** Ford Mustang 1966 – europäische Rundstrecke  
**Version:** 0.1 – 2026-10-04  
**Status:** Integrationskapitel; GitHub unverändert

---

## 1. Zweck

Dieses Kapitel verbindet alle bisher erarbeiteten Fachbereiche zu einem einzigen, reproduzierbaren Arbeitsablauf.

Es ist **kein einmaliger linearer Prozess**, sondern ein kontrollierter Regelkreis:

```text
MECHANIK
   ↓
REFERENZ / SETUP PAD
   ↓
RACE-READY
   ↓
INITIALGEOMETRIE
   ↓
SCALING / BALANCE
   ↓
KINEMATIK
   ↓
FINAL ALIGNMENT
   ↓
FINAL SCALING
   ↓
TRACK VALIDATION
   ↓
DATEN / HYPOTHESE
   ↓
GEZIELTE ÄNDERUNG
   ↺
```

Die Reihenfolge ist so gewählt, dass spätere Einstellungen möglichst wenig durch frühere, noch undefinierte Zustände verfälscht werden.

---

# 2. Grundregel: Initial Setup vs. Final Setup

Es gibt zwei unterschiedliche Zustände:

## Initial Setup

Ziel:
- Fahrzeug in einen definierten, messbaren Zustand bringen
- offensichtliche Geometriefehler beseitigen
- eine belastbare Basis für Scaling und Kinematik schaffen

## Final Setup

Ziel:
- nach Corner Weight, Ride Height und Kinematik die finalen Alignment-Werte setzen
- anschließend erneut Scaling prüfen
- daraus die Track-Baseline erzeugen

Longacre selbst zeigt diese Rückkopplung indirekt: Für finales Scaling soll das Auto bereits race-ready sein, einschließlich Ride Height, Camber, Caster, Rear-End-Squareness und Toe; für finales Toe wiederum sollen Ride Height, Gewicht, Bump Steer, Camber, Caster und Ackermann bereits definiert sein. Daraus folgt für unser Projekt bewusst ein **iterativer Zyklus statt einer starren Einmal-Reihenfolge**.

---

# 3. Phase 0 — Hardware-Inventar

Vor jeder ernsthaften Setup-Arbeit einmalig dokumentieren:

## Vorderachse
- UCA
- Shelby Drop
- LCA
- LCA Camber Kit
- Howe Ball Joints
- Strut Rods
- Spindles
- Steering Arms
- Tie Rods
- Center Link
- Pitman Arm
- Idler Arm
- Steering Box
- Federn
- Dämpfer
- Stabilisator / Endlinks
- Bump Stops

## Hinterachse
- Blattfedern
- Bushings
- Shackles
- Spring Perches
- U-Bolts
- Spring Plates
- Dämpfer
- Panhard Bar
- eventuell Rear ARB
- Ford 9"

## Antrieb
- Getriebe
- Kardanwelle
- U-Joints
- Pinion / Yoke

## Reifen/Räder
- American Racing 15×7
- Avon CR6ZZ 225/65 R15
- Satz-ID
- Alter / Heat Cycles

Ohne dieses Hardware-Inventar dürfen keine pauschalen Verstellregeln angenommen werden.

---

# 4. Phase 1 — Mechanische Prüfung

Vor jeder Geometrie:

- Radlager spielfrei
- Ball Joints spielfrei
- Tie Rod Ends
- Idler/Pitman
- Steering Box
- UCA/LCA-Befestigungen
- Strut Rods
- Federn
- Dämpfer
- Bump Stops
- Stabilisator / Endlinks
- Blattfedern
- Shackles
- U-Bolts
- Panhard
- Bremse frei
- Felgen/Reifen unbeschädigt

## Stop-Regel

Wird mechanisches Spiel, lose Hardware oder ein Reifenschaden gefunden:

> Setup-Arbeit stoppen und zuerst reparieren.

---

# 5. Phase 2 — Setup Pad herstellen

## Ziel

Vier reproduzierbare Radpositionen:

- LF
- RF
- LR
- RR

in **einer gemeinsamen Ebene**.

## Vorgehen

1. Boden vermessen
2. harte Shims / Leveling Plates definieren
3. jede Ecke kennzeichnen
4. Bodenpositionen markieren
5. Turnplates/Scale Pads/Rear Pads auf gleiche effektive Höhe bringen
6. Reproduzierbarkeit prüfen

## Bind vermeiden

Longacre weist darauf hin, dass beim Absenken durch Camber Gain seitliche Reifenbewegung nötig ist. Ohne Slip/Side-Movement bleibt Fahrwerksbindung zurück und verfälscht Radlasten und Geometrie.

Für unser Setup daher:
- Turnplates vorne
- Slip-/Roll-off-Möglichkeit
- hinten möglichst spannungsfreie Auflage

---

# 6. Phase 3 — Race-Ready-Zustand

Vor vergleichbaren Messungen immer gleich:

- Fahrer oder definierter Fahrerballast
- definierter Kraftstoffstand
- Betriebsflüssigkeiten
- gleicher Reifen-/Radsatz
- definierter kalter Reifendruck
- kein loses Material
- Lenkrad / Steering Center dokumentiert

## Projektregel

Ein Setup-Wert ohne dokumentierten Race-Ready-Zustand ist nur bedingt vergleichbar.

---

# 7. Phase 4 — Initial Ride Height

Noch nichts optimieren.

Messen:

- FL Chassis-to-Ground
- FR
- RL
- RR
- Rake
- bekannte L/R-Differenz
- Bump-Stop-Abstände
- Dämpferposition, soweit messbar

## Wiederholungsprüfung

1. messen
2. Fahrzeug anheben
3. wieder absetzen
4. setzen / rollen
5. erneut messen

Nur reproduzierbare Differenzen werden weiter bewertet.

---

# 8. Phase 5 — Hinterachsreferenz

Bevor die Vorderachse final ausgerichtet wird:

## Prüfen
- Radstand links
- Radstand rechts
- Achse square im Chassis
- Center Pins / Spring Perches
- U-Bolts
- Shackle-Geometrie
- Panhard-Lateralposition
- Panhard-Winkel
- Thrust Angle

## Zusätzlich
- Pinion/Driveline noch nicht zwingend korrigieren
- aber Transmission-, Driveshaft- und Pinion-Slope dokumentieren

---

# 9. Phase 6 — Initial Front Alignment

Ziel ist noch nicht absolute Finalität, sondern eine brauchbare Basis.

## Reihenfolge

1. Steering Center definieren
2. Castor
3. Camber
4. grobes Toe

## Warum Castor vor Camber?

Beim 65/66 Mustang koppeln UCA-Shims und Strut Rods Castor und Camber. Deshalb wird zunächst der gewünschte Castor-Bereich hergestellt, dann Camber, anschließend beide erneut geprüft.

## KPI
- messen und dokumentieren
- primär Diagnosewert

---

# 10. Phase 7 — Initial Scaling

Jetzt auf die Longacre-Waagen.

## Vorher
- Pads level/coplanar
- Waagen nullen
- Fahrer/Fuel/Druck korrekt
- Fahrwerk gesetzt
- ARB möglichst neutral

## Erfassen
- LF
- RF
- LR
- RR
- Total
- Front/Rear
- Left/Right
- Cross

## Noch nicht
Nicht sofort auf 50,00 % Cross jagen.

Zuerst:
- Messung wiederholen
- Reproduzierbarkeit
- Zusammenhang mit Ride Height verstehen

---

# 11. Phase 8 — Balance / Ride Height Adjustment

Nur wenn nötig.

Mögliche Ziele:

- problematische L/R-Ride-Height-Differenz klären
- Cross in sinnvollen Bereich bringen
- ausreichend Bump/Droop sicherstellen
- ARB-Preload vermeiden
- Panhard-Geometrie erhalten

## Regel

Eine Balancekorrektur ist nur gut, wenn sie keine wichtigere Randbedingung verschlechtert.

Priorität:

1. mechanische Sicherheit
2. Federweg
3. keine Bindung
4. brauchbare Ride Height
5. Hinterachsgeometrie
6. Cross Weight
7. Display-Nachkommastellen

---

# 12. Phase 9 — Nach Balanceänderung alles erneut prüfen

Nach echter Ride-Height-/Corner-Weight-Änderung:

- Ride Height
- Panhard-Lage
- Hinterachs-Lateralposition
- Castor
- Camber
- Toe

gegebenenfalls auch:
- Pinion-/Driveline-Winkel
- Bump Stop Clearance

---

# 13. Phase 10 — Bump Steer

Bump Steer wird gemessen, wenn:

- Ride Height final oder nahezu final
- Castor gesetzt
- Camber gesetzt
- Toe als definierter Startzustand gesetzt
- Steering Center fixiert

Longacre fordert genau diese Vorbereitung für eine aussagekräftige Bump-Steer-Messung.

## Baseline

LF und RF getrennt:
- Droop
- 0
- Bump
- fein um Ride Height

Auswertung als:
**Toe Change vs. Wheel Travel**

## Wichtig

Bump Steer wird geometrisch korrigiert, nicht mit statischem Toe versteckt.

---

# 14. Phase 11 — Camber Gain / Kinematics

Wenn der Aufwand gerechtfertigt ist:

- Camber über Federweg
- Bump/Droop
- links/rechts
- ggf. bei Lenkwinkel

Damit wird sichtbar, was aus dem statischen Camber während realer Radbewegung wird.

---

# 15. Phase 12 — Ackermann

Mit CG/6:

- Linkskurve
- Rechtskurve
- 20°-Messung
- Symmetrie

Später optional:
- 5°
- 10°
- 15°
- 20°
- 25°

als Kennlinie.

Ackermann ist keine pauschale Zielzahl, sondern eine Lenkwinkelcharakteristik.

---

# 16. Phase 13 — Final Front Alignment

Jetzt erst finale statische Werte.

## Reihenfolge

1. Castor final
2. Camber final
3. KPI dokumentieren
4. Steering Center
5. Toe final
6. Individual Toe per String prüfen
7. Lenkradstellung
8. Total Toe per Toe Plates kontrollieren

Longacre verlangt für finales Toe u. a.:
- Race-ready
- Ride Height
- Weight Percentages
- Bump Steer
- Camber
- Caster
- Ackermann
- Air Pressure

---

# 17. Phase 14 — Settling-Prozedur

Nach jeder relevanten Alignment-Änderung:

1. Fahrzeug zurückrollen
2. vorwärts in Messposition rollen
3. nicht wieder zurückrollen
4. leicht setzen
5. messen

Longacre empfiehlt diese Vorwärts-Rollbewegung, damit Spiel und Casterwirkung die Komponenten reproduzierbar in dieselbe Richtung setzen.

---

# 18. Phase 15 — Final Scaling

Nach finalem Alignment noch einmal wiegen.

Warum?

Weil:
- Camber
- Reifendruck
- Ride Height
- Bind
- Alignmentänderungen

die Waagenwerte beeinflussen können.

## Final erfassen

- LF/RF/LR/RR
- Cross
- Front/Rear
- Left/Right
- Ride Height

Wenn sich Werte unerwartet stark geändert haben:
→ Ursache suchen, nicht einfach akzeptieren.

---

# 19. Phase 16 — Driveline / Pinion Final Check

Nach finaler Ride Height:

- Transmission Slope
- Driveshaft Slope
- Pinion Slope
- Front U-Joint Operating Angle
- Rear U-Joint Operating Angle
- Differenz
- Wedge dokumentieren

Diese Prüfung gehört nach größeren Rear-Ride-Height-/Leaf-Spring-Änderungen zwingend dazu.

---

# 20. Phase 17 — Full Lock / Freigängigkeit

Mit CG/6 / Turnplates:

- Full Lock links
- Full Lock rechts

Prüfen:
- Reifen → Kotflügel
- Reifen → Rahmen
- Reifen → Stabilisator
- Bremsschlauch
- Spurstange
- Steering Stops

Besonders nach Castor-Erhöhung per Strut Rod wichtig, weil das Rad nach vorn wandern kann.

---

# 21. Phase 18 — Werkstatt-Baseline einfrieren

Jetzt entsteht **Baseline V1**.

Speichern:

## Geometrie
- Castor L/R
- Camber L/R
- KPI L/R
- Total Toe
- Individual Toe
- Ackermann
- Bump-Steer-Kurve
- Thrust Angle

## Balance
- Ride Heights
- LF/RF/LR/RR
- Cross
- Front/Rear
- Left/Right

## Rear
- Panhard-Lage
- Shackle-Winkel
- Pinion/Driveline

## Reifen
- Reifensatz-ID
- Shore kalt
- Cold Pressure

Keine spätere Änderung ohne Bezug auf diese Baseline.

---

# 22. Phase 19 — Track Baseline

Erster aussagekräftiger Stint:

- keine parallelen Setupänderungen
- definierter Reifensatz
- definierter Fuel
- dokumentiertes Wetter
- gleiche Fahrerreferenz

Nach dem Stint sofort:

1. Hot Pressures
2. Pyrometer RF → RR → LR → LF
3. Reifenbild
4. Fahrerfeedback
5. Rundenzeiten

Shore später kalt/konditioniert.

---

# 23. Phase 20 — Handling klassifizieren

Symptomcode vergeben:

- ENTRY-US
- ENTRY-OS
- MID-US
- MID-OS
- POWER-US
- POWER-OS
- BRAKE-INSTABILITY
- BUMP-INSTABILITY
- HIGH-SPEED-US / OS

Dann:
- früheste problematische Phase bestimmen
- Daten korrelieren
- Hypothese bilden

---

# 24. Phase 21 — Eine Änderung

Vor Änderung:

```text
Symptom:
Daten:
Hypothese:
Geplante Änderung:
Erwartete Wirkung:
Mögliche Nebenwirkung:
Messgröße für Erfolg:
```

Dann nur **eine relevante Änderung**.

---

# 25. Phase 22 — A/B-Test

A = Baseline  
B = Änderung

Möglichst konstant:
- Reifen
- Fuel
- Trackbedingungen
- Stintlänge
- Fahrer

Ergebnis:

- besser
- schlechter
- neutral
- nicht aussagekräftig

Nicht aussagekräftig ist ein valides Ergebnis und darf dokumentiert werden.

---

# 26. Master-Reihenfolge als Kurzcheckliste

## Vorbereitung
- [ ] Hardwareinventar
- [ ] Mechanik
- [ ] Setup Pad
- [ ] Race-ready

## Initial
- [ ] Ride Height
- [ ] Rear Square / Thrust / Panhard
- [ ] Castor
- [ ] Camber
- [ ] grobes Toe
- [ ] Scaling

## Balance
- [ ] Cross / Ride Height
- [ ] ARB neutral
- [ ] erneut Ride Height
- [ ] Rear Geometry erneut

## Kinematics
- [ ] Bump Steer
- [ ] optional Camber Gain
- [ ] Ackermann

## Final Alignment
- [ ] Castor
- [ ] Camber
- [ ] KPI
- [ ] Steering Center
- [ ] Individual Toe
- [ ] Total Toe
- [ ] Full Lock

## Final Verification
- [ ] Final Scaling
- [ ] Driveline Angles
- [ ] Panhard
- [ ] dokumentieren

## Track
- [ ] Cold Pressure
- [ ] Shore baseline
- [ ] Stint
- [ ] Hot Pressure
- [ ] Pyrometer
- [ ] Reifenbild
- [ ] Feedback
- [ ] Hypothese
- [ ] eine Änderung
- [ ] A/B-Test

---

# 27. Was wann erneut geprüft werden muss

| Änderung | Danach erneut prüfen |
|---|---|
| Ride Height | Corner Weight, Camber, Toe, Panhard, ggf. Castor/Bump Steer |
| Corner Weight | Ride Height, Alignment |
| Castor | Camber, Toe, Freigängigkeit |
| Camber | Toe, ggf. Radlasten |
| Tie-Rod-Höhe | gesamte Bump-Steer-Kurve, Toe |
| Toe | Steering Center |
| Blattfeder | Ride Height, Cross, Thrust, Panhard, Pinion |
| Panhard-Länge | Achszentrierung |
| Panhard-Höhe | Rear Roll Geometry, lateral position prüfen |
| Wedge | Pinion/U-Joint-Winkel, U-Bolt-Klemmung |
| Reifen/Druck | Ride Height, Trackdaten |
| Stabilisator/Endlink | ARB-Preload, Radlasten |

---

# 28. Fehlervermeidung

## Nicht tun

- Toe zuerst "perfekt" machen und danach Ride Height ändern
- auf unebenem Boden Zehntelgrad vergleichen
- 50,00 % Cross auf Kosten der Geometrie erzwingen
- Bump Steer mit statischem Toe kaschieren
- Pinion Angle nur als einzelne "down"-Zahl betrachten
- Tracktemperaturen nach langer Cool-down-Zeit vergleichen
- zwei oder drei Setupänderungen gleichzeitig durchführen
- Oval-Setupregeln ungeprüft übernehmen

---

# 29. Prioritätsmodell

Wenn sich zwei Ziele widersprechen:

1. **Sicherheit**
2. **mechanische Integrität**
3. **reproduzierbare Messung**
4. **ausreichender Federweg / keine Bindung**
5. **korrekte Hinterachs-/Lenkgeometrie**
6. **Balance**
7. **Alignment**
8. **Feinoptimierung**
9. **Display-Nachkommastellen**

---

# 30. Quellenbasis

## Longacre — Scaling A Race Car Properly
https://www.longacreracing.com/tech-central.aspx?item=8163&title=scaling-a-race-car-properly

Bestätigt:
- race-ready vor finalem Scaling
- Fuel/Fluids
- Tire Pressure
- Camber
- Rear End Square

## Longacre — Set Toe Properly
https://longacreracing.com/pages/set-toe-properly

Bestätigt:
- Ride Height
- Weight %
- Bump Steer
- Camber
- Caster
- Ackermann
- Pressure
vor finalem Toe.

## Longacre — Bump Steer
https://longacreracing.com/pages/bump-steer

Bestätigt:
- Ride Height
- richtige Reifen/Druck
- Caster/Camber/Toe
- Steering centered/locked
vor der Messung.

## Longacre — Bind Free Chassis Setups
https://longacreracing.com/pages/bind-free-chassis-setups

Bestätigt:
- Camber Bind
- Notwendigkeit seitlicher Entspannung beim Absetzen

## Dunlop CG/4-5 / CG/6
Original Operating Instructions — Nutzer-Scans

---

# 31. Definition of Done

- [x] alle bisherigen Kapitel in einen Workflow integriert
- [x] Initial vs. Final Setup getrennt
- [x] Rückkopplungen berücksichtigt
- [x] Rear Geometry vor finalem Front Toe
- [x] Scaling nicht isoliert
- [x] Bump Steer korrekt positioniert
- [x] Final Toe nach Kinematik
- [x] Final Scaling nach Alignment
- [x] Pinion/Driveline nach finaler Ride Height
- [x] Track Validation integriert
- [x] A/B-Test integriert
- [x] Recheck-Matrix erstellt
- [ ] reale Hardwaredetails ergänzen
- [ ] konkrete Messformulare als separate Templates erstellen
- [ ] Website-Navigation daraus ableiten
