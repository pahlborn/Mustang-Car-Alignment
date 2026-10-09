# Mustang-Car-Alignment — Übergabe an ein anderes Modell

**Stand:** 2026-10-04  
**Status:** GitHub konnte wegen eines Integrationsproblems nicht beschrieben werden. Dieses Paket enthält die komplette bislang erzeugte Arbeitsbasis.

## Ziel
Technisch/wissenschaftlich fundiertes Chassis-Setup-Handbuch und spätere GitHub-Pages-Website für einen Ford Mustang 1966 im europäischen Rundstreckenbetrieb.

## Leitprinzip
**Physik/Wissen → Mustang-spezifische Konsequenz → Messung → Einstellung → Tool-Anwendung → Track-Validierung → Dokumentation**

Nicht tool-zentriert. Corner Weight / Balance ist ein Hauptthema.

## Fahrzeug
- 1966 Ford Mustang, Track/Race
- Manual Steering
- Shelby Drop
- Adjustable Strut Rods
- Street or Track LCA Camber Kit
- Howe Ball Joints
- Ford 9" Hinterachse
- Blattfedern; Reverse-Eye → Mid-Eye im Projekt behandelt
- Panhard Bar
- American Racing 15×7
- Avon CR6ZZ 225/65 R15

### Baseline V1 — Referenz, keine endgültige Empfehlung
- Castor +3,0°
- Camber −2,0°
- Total Toe 1/16" Toe-in ≈ 1,6 mm
- Warmdruck 2,2 bar

## Vorhandene Messmittel
- Dunlop CG/4-5 Castor/Camber/KPI
- Dunlop CG/6 Turntables
- Longacre wired corner-weight scales (exaktes Modell offen)
- Longacre Toe Plates
- Longacre digitaler Reifendruckprüfer
- Longacre Probe-Pyrometer
- Shore-A-Durometer
- String Alignment vorgesehen
- Bump-Steer-Messung/Gauge wurde separat bearbeitet

## Wichtige methodische Entscheidungen
1. Setup ist iterativ; Initial Setup und Final Setup trennen.
2. Race-ready Zustand vor vergleichbaren Messungen.
3. Setup-Pad reproduzierbar/coplanar; Winkelmessungen brauchen definierten Levelbezug.
4. Mass Distribution, Corner Weight und Cross Weight strikt unterscheiden.
5. 50 % Cross ist kein Selbstzweck.
6. Finales Toe erst nach Ride Height, Balance, Castor/Camber, Bump Steer und Ackermann.
7. Toe Plates = Total Toe; Strings = Individual Toe/Fahrzeugreferenz.
8. KPI/SAI primär Diagnosegröße.
9. Bump Steer über Federweg messen; nicht mit statischem Toe kaschieren.
10. Panhard Offset, Thrust Angle und Pinion Angle strikt trennen.
11. Pinion/Driveline über Transmission-, Driveshaft-, Pinion-Slope und beide U-Joint Operating Angles bewerten.
12. Track: Hot Pressure + Probe-Pyrometer sofort; Shore später kalt/konditioniert.
13. Symptom ≠ Ursache. Daten → Hypothese → eine Änderung → A/B-Test.
14. Früheste fehlerhafte Kurvenphase zuerst lösen.
15. Keine Oval-Racing-Zielwerte ungeprüft auf Road Course übertragen.
16. Keine pauschale +5/+6°-Castor- oder Toe-out-Empfehlung. +3°/−2°/1/16" bleibt Baseline.
17. Projektdaten und allgemeine Empfehlungen sichtbar trennen; keine Zielwerte erfinden.

## Besondere offene/zu prüfende Punkte
- bekannte ca. 20-mm-niedrigere linke Heckseite systematisch diagnostizieren
- Flat Shim vs. Wedge Shim strikt trennen
- frühere 2°-Wedge-Empfehlung (dicke Seite vorn) nur als Legacy-Information, nicht als Sollwert
- reale Panhard-Abmessungen und Shackle-Winkel
- reale Transmission-/Driveshaft-/Pinion-Winkel
- exaktes Longacre-Waagenmodell
- reale Bump-Steer-Kurven
- Avon-Primärdaten und reale Trackdaten

## Quellenfamilien
- Dunlop Original CG/4-5 / CG/6 Nutzer-Scans — Primärquelle
- Longacre Racing
- Street or Track
- Global West
- Opentracker
- Dana/Spicer
- TREMEC
- Maier Racing
- OptimumG
- Racecar Engineering ergänzend

## Empfohlene Website-Struktur
Overview; Learn (Vehicle Dynamics, Tires, Weight Transfer, Balance, Suspension Geometry, Steering Geometry); Mustang (Front Suspension, Shelby Drop, Rear Suspension, Panhard, Adjustment Map); Alignment (Camber, Castor, KPI/SAI, Toe, Ackermann, Bump Steer, Thrust); Balance (Ride Height, Corner Weights, Cross Weight, Scaling); Workshop (Setup Pad, Complete Setup, Dunlop, Longacre, Strings); Track (Pressure, Temperatures, Shore/Aging, Handling Diagnosis, Test Procedure); Setup Log; Templates.

## Übergaberegel
Die beigefügten Fachdateien sind maßgeblich detaillierter als diese Übersicht. Nicht ungeprüft zusammenkürzen. Vor Veröffentlichung Fakten erneut gegen Primärquellen prüfen und offene Punkte als offen markieren.

## Dateien
- `MASTER_CONCEPT.md`
- `CONTENT_SPECIFICATION.md`
- `CHAPTER_BALANCE_CORNER_WEIGHT.md`
- `CHAPTER_SETUP_PAD_RIDE_HEIGHT.md`
- `CHAPTER_FRONT_GEOMETRY_CAMBER_CASTER_KPI.md`
- `CHAPTER_BUMP_STEER.md`
- `LEGACY_REAR_AXLE_LEAF_SPRINGS_PINION.md`
- `CHAPTER_TOE_ACKERMANN_THRUST.md`
- `CHAPTER_REAR_SUSPENSION_PANHARD_PINION.md`
- `CHAPTER_TRACK_VALIDATION_TIRES.md`
- `CHAPTER_HANDLING_DIAGNOSIS_DECISION_TREE.md`
- `MASTER_WORKFLOW_MUSTANG_TRACK_CHASSIS_SETUP.md`
- `TEMPLATE_MASTER_SETUP_SHEET.md`
- `TEMPLATE_ALIGNMENT_SHEET.md`
- `TEMPLATE_SCALE_SHEET.md`
- `TEMPLATE_BUMP_STEER_SHEET.md`
- `TEMPLATE_TRACK_SESSION_SHEET.md`
- `TEMPLATE_CHANGE_LOG.md`
- `mustang-1966-track-alignment.md`
