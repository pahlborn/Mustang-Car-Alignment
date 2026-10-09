# Mustang Track Chassis Setup — MASTER CONCEPT

**Projekt:** 1966 Ford Mustang – europäische Rundstrecke  
**Dokumenttyp:** Projektanker / Informationsarchitektur  
**Version:** 0.2  
**Datum:** 2026-10-04  
**Status:** Konzeptphase – GitHub noch unverändert

---

## 1. Ziel

Dieses Projekt wird **kein Werkzeug-Handbuch**, sondern ein vollständiges, technisch belastbares Chassis-Setup-System für einen 1966 Ford Mustang im Rundstreckeneinsatz.

Leitprinzip:

> **Physik verstehen → Mustang-spezifische Konsequenz ableiten → korrekt messen → am Fahrzeug einstellen → vorhandene Werkzeuge richtig einsetzen → auf der Strecke validieren → dokumentieren**

Werkzeuge sind Hilfsmittel. Das Wissen über Fahrdynamik, Geometrie, Reifen und Radlasten ist die Grundlage.

---

## 2. Fahrzeugkontext

### Fahrzeug
- Ford Mustang 1966
- Rennstreckeneinsatz
- manuelle Lenkung
- Ford 9" Hinterachse

### bekannte relevante Modifikationen
- Shelby Drop
- einstellbare Strut Rods
- Street or Track LCA Camber Kit
- Howe Ball Joints
- Panhard Bar
- Blattfedern
- American Racing 15×7
- Avon CR6ZZ 225/65 R15

### vorhandene Messmittel
- Dunlop CG/4-5 Castor/Camber/KPI Gauge
- Dunlop CG/6 Steering Turntables
- Longacre kabelgebundene Radlastwaagen
- Longacre Toe Plates
- Messbänder / Standardwerkstatt-Messmittel
- String Alignment als ergänzendes Verfahren vorgesehen

---

## 3. Aktuelle Baseline — nur Referenz, keine Zielvorgabe

| Parameter | aktueller Referenzwert |
|---|---:|
| Castor | +3,0° |
| Camber | −2,0° |
| Gesamtspur | 1/16" Toe-in ≈ 1,6 mm |
| Reifen-Warmdruck | 2,2 bar |

Diese Werte werden als **Baseline V1** geführt.  
Sie sind **nicht automatisch das optimale Track-Setup**.

Straßenempfehlungen, Hersteller-Track-Beispiele und unser später validierter Fahrzeugwert werden strikt getrennt.

---

# 4. Informationsarchitektur

## A. Overview

Ziel der Einstiegsseite:
- Was ist Chassis Setup?
- Welche Größen beeinflussen einander?
- Welche Reihenfolge ist sinnvoll?
- Was wird statisch gemessen, was dynamisch validiert?
- Welche Daten sind Baseline, welche Sollwerte, welche Track-Ergebnisse?

Die Overview-Seite soll den vollständigen Regelkreis zeigen:

```text
MECHANISCHER ZUSTAND
        ↓
SETUP PAD / REFERENZ
        ↓
RACE-READY ZUSTAND
        ↓
GEOMETRIE + RADLASTEN
        ↓
TRACK-BASELINE
        ↓
FAHREN
        ↓
DRUCK / TEMPERATUR / FEEDBACK
        ↓
HYPOTHESE
        ↓
EINE GEZIELTE ÄNDERUNG
        ↓
NEU MESSEN
        ↓
VERGLEICH
```

---

# 5. Learn — technische Grundlagen

## 5.1 Vehicle Dynamics

### Inhalte
- Kräfte am Fahrzeug
- Beschleunigung, Bremsen, Kurvenfahrt
- Schwerpunkt
- Gier-, Nick- und Rollbewegung
- Reifenkraft als Bindeglied zwischen Fahrzeug und Strecke

### Lernziel
Der Leser versteht, dass Alignment-Werte nur über ihre Wirkung auf Reifenkräfte und Fahrzeugbewegung sinnvoll bewertet werden können.

---

## 5.2 Tires

### Inhalte
- Contact Patch
- Slip Angle
- Load Sensitivity
- Reifendruck
- Temperaturaufbau
- Camber Thrust
- Unterschied Oberflächentemperatur / Karkassentemperatur
- Reifenbild
- Bedeutung von innen / Mitte / außen
- Grenzen einfacher Temperaturregeln

### Mustang-Konsequenz
Avon CR6ZZ als konkretes System untersuchen:
- Kalt-/Warmdruck
- zulässige Betriebsbedingungen
- Interpretation von Trackdaten
- historische Reifenkonstruktion vs. moderner Slick

---

## 5.3 Weight Transfer

### Inhalte
- statische Radlast
- dynamischer Lasttransfer
- longitudinal
- lateral
- geometrischer vs. elastischer Anteil
- Einfluss von Schwerpunktshöhe, Spurweite, Radstand
- warum Radlasttransfer nicht gleich „Masse wandert“ ist
- Reifen-Load-Sensitivity

### Ziel
Klare Trennung zwischen:
- **Mass Distribution**
- **Static Corner Weight**
- **Dynamic Load Transfer**

---

## 5.4 Roll Center & Roll Stiffness

### Inhalte
- Instant Center
- Roll Center
- Roll Axis
- Roll Moment
- Feder-/Stabilisatoranteil
- geometrischer Anteil des Lasttransfers
- Einfluss auf Vorder-/Hinterachs-Balance

### Mustang
- Wirkung des Shelby Drop
- geänderte UCA-Geometrie
- Einfluss der Ride Height

---

## 5.5 Steering Geometry

### Inhalte
- Castor
- KPI / SAI
- Mechanical Trail
- Scrub Radius
- Toe
- Ackermann
- Steering Axis
- Selbstzentrierung
- Lenkkraft
- dynamischer Camber durch Castor

---

# 6. Mustang — konkrete Chassis-Geometrie

## 6.1 Front Suspension

Darstellen:
- UCA
- LCA
- Ball Joints
- Coil Spring
- Strut Rod
- Spindle
- Steering Arm
- Tie Rod
- Idler Arm
- Pitman Arm

Für jedes Bauteil:
1. Aufgabe
2. Freiheitsgrad
3. was es geometrisch bestimmt
4. Verschleiß-/Spielwirkung
5. Einstellmöglichkeiten

---

## 6.2 Shelby Drop

Nicht nur Maßangabe, sondern:
- Ausgangsgeometrie
- Lageänderung UCA-Innenlager
- Einfluss auf Camber Gain
- Roll Center
- mögliche Auswirkungen auf Bump Steer
- Wechselwirkung mit Ride Height
- Unterschied klassische Shelby-Geometrie vs. andere moderne Drop-Geometrien

---

## 6.3 Adjustment Map

Eine zentrale Karte soll zeigen:

| Änderung | Primärwirkung | Nebenwirkung |
|---|---|---|
| UCA Shim vorn | Castor / Camber | Kopplung beider Winkel |
| UCA Shim hinten | Castor / Camber | Kopplung beider Winkel |
| Strut Rod kürzer | mehr positiver Castor | Rad wandert vor, Freigängigkeit |
| LCA Camber Kit | Camber | Spur/Geometrie erneut prüfen |
| Ride Height | Chassislage | Radlast, Camber, Toe, Rollcenter |
| Panhard-Verstellung | Hinterachs-Seitposition | ggf. Rollcenter/Geometrie |
| Spurstange | Toe | Lenkrad-/Einzeltoe-Bezug |

Diese Tabelle wird später mit **Richtung und Größenordnung nur dort ergänzt, wo sie belastbar belegt oder gemessen ist**.

---

# 7. Balance

## 7.1 Begriffe zwingend trennen

### Mass Distribution
Wo befindet sich Masse im Fahrzeug?

### Corner Weight
Welche Last trägt jedes Rad statisch?

### Cross Weight
Diagonale Lastverteilung:

```text
Cross % = (RF + LR) / Total × 100
```

### Left / Right / Front / Rear
Diese Prozente werden primär durch reale Massenverteilung bestimmt; sie werden nicht durch simples „Herumdrehen“ an Fahrwerkseinstellungen beliebig verschoben.

---

## 7.2 Scaling Procedure

### Race-ready Definition
Reproduzierbarer Zustand:
- definierter Kraftstoff
- Flüssigkeiten
- Fahrer oder Fahrerballast
- Reifen
- definierter Reifendruck
- Alignment-Basis hergestellt
- Hinterachse korrekt positioniert
- keine Fahrwerksbindung

### Scale Pad
- Pads in derselben Ebene
- einzeln nullen / System nullen laut Longacre-Anleitung
- Kabel eindeutig LF/RF/LR/RR
- Warm-up
- Plausibilitätsprüfung
- Fahrzeug setzen
- immer identische Settling-Prozedur

### Messwerte
- LF
- RF
- LR
- RR
- Total
- Front %
- Rear %
- Left %
- Right %
- Cross %

---

## 7.3 Corner-Balance-Wissen

Zu erklären:
- was eine Federauflagen-/Ride-Height-Änderung an allen vier Radlasten bewirkt
- warum eine Ecke nicht isoliert „Gewicht bekommt“
- diagonale Reaktion
- warum Cross Weight und Ride Height gekoppelt sind
- warum Camber, Reifendruck, Dämpferreibung und Bindung Messergebnisse verändern
- warum ein statischer Waagenwert keine vollständige dynamische Balance beschreibt

### Mustang-spezifisch
Besondere Analyse nötig:
- vordere Coil-Spring-Sitze / verfügbare Höhenverstellung
- hintere Blattfedern
- bestehender Links-Rechts-Ride-Height-Unterschied
- Panhard-Bar-Einfluss
- eventuelle Vorspannung des Stabilisators
- praktische Einstellbarkeit des Cross Weight ohne unerwünschte Ride-Height-Änderung

---

# 8. Alignment

Jede Alignment-Seite folgt demselben Template:

1. Definition
2. positive/negative Richtung
3. physikalische Wirkung
4. dynamische Wirkung
5. Wechselwirkungen
6. Mustang-spezifische Einstellmöglichkeiten
7. Messprinzip
8. vorhandene Werkzeuge
9. Schritt-für-Schritt-Messung
10. typische Messfehler
11. Einstellung
12. Kontrollmessung
13. Track-Validierung
14. Quellen / Evidenzgrad

---

## 8.1 Camber
- statischer Camber
- dynamischer Camber
- Camber Gain
- Contact Patch
- Einfluss Rollwinkel / Reifen
- Dunlop CG/4
- LCA Camber Kit
- UCA/Shims
- Reifen-/Pyrometer-Validierung

## 8.2 Castor
- Steering Axis in Seitenansicht
- Trail / Selbstzentrierung
- Lenkkraft
- Castor-induced Camber
- Dunlop 20° IN → 20° OUT
- UCA/Shims
- Adjustable Strut Rod
- Reifen-/Fenderfreigängigkeit

## 8.3 KPI / SAI
- Definition
- Beziehung zu Camber / Included Angle
- Diagnosewert
- nicht als regulärer „Setup-Regler“ behandeln
- Dunlop-Messung

## 8.4 Toe
- Total Toe
- Individual Toe
- Toe-in / Toe-out
- statisch vs. dynamisch
- Longacre Toe Plates
- Reifenschlag / Felgenschlag
- String Alignment
- Spurstangen
- Lenkradmitte

## 8.5 Ackermann
- Innen-/Außenradwinkel
- geometrisches Ackermann
- Toe-out-on-turns
- CG/6-Messung
- warum statische 20°-Messung nur eine Charakterisierung ist
- Relevanz für unterschiedliche Kurvenradien

## 8.6 Thrust Angle
- Hinterachsachse vs. Fahrzeugmittellinie
- Einfluss auf Geradeauslauf / Lenkradstellung
- String-Methode
- 9" Starrachse
- Panhard positioniert lateral, nicht primär die Achse in Gier

---

# 9. Kinematics

## 9.1 Camber Gain
Messung über definierten Federweg.

## 9.2 Bump Steer
Toe-Änderung über Bump/Droop.

Inhalte:
- Ursache durch unterschiedliche Bewegungsbahnen von Querlenkern und Tie Rod
- statisches Toe kann korrekt sein, während dynamisches Toe problematisch ist
- Messung über Federweg
- geradeaus und ggf. repräsentativer Lenkwinkel
- Diagramm: Toe Change vs. Wheel Travel

## 9.3 Roll Steer
Vor allem Hinterachse / Blattfederkinematik als separates Forschungsthema.

---

# 10. Workshop

## 10.1 Setup Pad
- vier definierte Reifenpositionen
- gleiche Ebene
- Turnplates vorne
- Slip-/Roll-Off-Lösung
- Hinterradplatten gleicher Höhe
- feste Referenzmarken in der Werkstatt
- dokumentierte Shim-Pakete

## 10.2 Complete Setup
Kein einfacher linearer Ablauf, sondern zwei Zyklen.

### Initial Cycle
1. mechanische Prüfung
2. Reifen / Druck
3. Setup Pad
4. Race-ready Zustand
5. initial Ride Height
6. initial Camber/Castor/Toe
7. Hinterachse / Fahrzeugbezug
8. initial Scaling

### Adjustment Cycle
1. gewünschte Balance-/Ride-Height-Änderung
2. Fahrzeug setzen
3. Scaling
4. Ride Height erneut
5. Castor / Camber
6. Bump Steer / Kinematik bei Änderungen prüfen
7. Toe
8. Ackermann / Steering Checks
9. Final Scaling
10. komplette Abschlussmessung

---

# 11. Tool Guides

Werkzeuge bekommen **eigene Unterseiten**, aber nicht die Hauptstruktur.

## Dunlop CG/4-5
- originale Anleitung als Primärquelle
- Bodenprüfung
- Camber
- Castor
- KPI
- additive Skala
- Aufnahme
- Fehlerquellen

## Dunlop CG/6
- Turntable
- Nullstellung
- 20°-Referenz
- Toe-out-on-turns
- Full Lock

## Longacre Scales — wired
- Modellvariante später exakt identifizieren
- Verkabelung
- Warm-up
- Zero
- Pad plane
- Plausibilitätsprüfung
- Settling
- Mess-/Dokumentationsablauf

## Longacre Toe Plates
- zwei Maßbänder
- Front/Rear-Messung
- Total Toe
- Grenzen des Verfahrens
- angerissene Reifenreferenz als Präzisionsverbesserung

## Strings
- Fahrzeugreferenz
- Individual Toe
- Thrust
- Symmetrie

---

# 12. Track Engineering

## 12.1 Testdisziplin

Grundregel:

> **Eine relevante Änderung pro Vergleichszyklus**, sofern nicht aus Sicherheits-/Reparaturgründen mehrere Dinge zwingend gemeinsam verändert werden müssen.

Erfassen:
- Strecke / Layout
- Wetter
- Asphalttemperatur
- Reifen
- kalt / warm Druck
- Reifentemperatur I/M/A
- Fahrzeit
- Fuel
- Setup
- Fahrerfeedback
- Rundenzeiten
- Änderungen

---

## 12.2 Handling Diagnosis

Nicht:
> Symptom → sofort Bauteil verstellen

Sondern:

```text
SYMPTOM
  ↓
PHASE DER KURVE
  ↓
MÖGLICHE URSACHEN
  ↓
MESSUNG / DATEN
  ↓
HYPOTHESE
  ↓
ÄNDERUNG
  ↓
A/B-VALIDIERUNG
```

Phasen:
- Braking
- Turn-in
- Entry
- Mid-corner
- Exit
- Power-on
- High-speed
- Kerbs / Unebenheiten

---

# 13. Setup Log

Pro Event / Testtag:

## Fahrzeugzustand
- Reifen
- Kraftstoff
- Fahrer
- Aero / Karosseriezustand
- Wetter

## Geometrie
- Ride Height 4 Ecken
- Camber L/R
- Castor L/R
- KPI L/R
- Total Toe
- Individual Toe
- Thrust
- Ackermann / Toe-out-on-turns
- Bump Steer Map, falls geändert

## Balance
- LF/RF/LR/RR
- Cross
- Front/Rear
- Left/Right

## Track
- Druck kalt/warm
- Temperatur I/M/A
- Rundenzeiten
- Feedback
- Änderung
- Ergebnis

---

# 14. Evidenzsystem

Jede technische Aussage erhält intern eine Einstufung:

### A — Primärquelle
- Ford Service / Engineering
- Dunlop Originalanleitung
- Longacre Herstelleranleitung
- Street or Track für eigene Komponenten
- Avon Herstellerdaten

### B — etablierte Fachliteratur
- anerkannte Vehicle-Dynamics-/Motorsportliteratur
- wissenschaftliche Veröffentlichungen

### C — kompetente Sekundärquelle
- spezialisierter Mustang-/Motorsport-Hersteller
- hochwertige technische Fachartikel

### D — Erfahrungswert
- Rennteam-/Forumserfahrung
- nur ergänzend, nie alleinige Grundlage für eine kritische Behauptung

Auf den späteren Seiten sollen **Quelle und Aussage klar trennbar** bleiben.

---

# 15. Bereits verifizierte technische Leitplanken

1. Longacre fordert einen reproduzierbaren **race-ready** Zustand vor dem Scaling.
2. Longacre betont, dass Scale Pads möglichst nivelliert bzw. mindestens in derselben Ebene stehen müssen.
3. Longacre weist darauf hin, dass Camber, Reifendruck, Dämpferreibung und Fahrwerksbindung die angezeigten Radlasten beeinflussen können.
4. Longacre stellt klar: Left-/Rear-Prozentwerte werden nicht durch einfaches Verstellen von Jack Screws/Federauflagen verschoben; dafür muss reale Masse bewegt werden.
5. Beim 1964–66 Mustang beeinflussen UCA-Shims Castor und Camber gekoppelt.
6. Kürzere einstellbare Strut Rods erhöhen positiven Castor und ziehen das Rad nach vorne.
7. Street or Track dokumentiert an einem 66er Testwagen mit eigenem LCA-Camber-Kit + Adjustable Strut Rods ein Track-Beispiel von −2,75° Camber und +5° Castor.
8. Opentracker nennt für manuell gelenkte 65/66er deutlich moderatere Street-/Street-Performance-Bereiche; diese sind nicht als Track-Zielwert zu behandeln.
9. Daraus folgt: **Einstellbereich, Straßenempfehlung, Track-Beispiel und validierter Sollwert unseres Fahrzeugs müssen getrennt bleiben.**

---

# 16. Offene Forschungsfragen

## Hohe Priorität
- exakte vorhandene UCA-Konfiguration am Fahrzeug
- genaue Ausführung des Shelby Drop
- genaue Strut-Rod-Ausführung
- genaue LCA-Camber-Kit-Ausführung / aktuelle Position
- Federn und Stabilisatoren vorne
- Blattfederrate / Ausführung hinten
- Panhard-Geometrie und aktuelle Höhe
- Dämpfer
- aktuelle Ride Heights an definierten Chassispunkten
- exaktes Longacre-Scale-Modell
- vorhandenes Longacre Caster/Camber-Tool? noch offen
- Möglichkeit der Ride-Height-/Corner-Weight-Verstellung am Fahrzeug

## Später
- Bump-Steer-Messgerät vorhanden / sinnvoll zu ergänzen
- Pyrometer vorhanden / welches Modell
- Reifendaten Avon CR6ZZ aus Primärquelle
- Feder-/Stabiraten
- Schwerpunktbestimmung aus Waagenmessung
- Motion Ratios der Vorderachse

---

# 17. Nächster Arbeitsblock

**Content Specification V0.1**:

Für jede Seite werden festgelegt:
- Lernziel
- Fragen, die die Seite beantworten muss
- benötigte Formeln
- Diagramme
- Mustang-spezifische Daten
- praktische Messung
- Einstellung
- Tool-Anwendung
- Gefahren / Fehlerquellen
- Track-Validierung
- Quellen
- offene Punkte

Erst danach:
1. Review mit Nutzer
2. Struktur freigeben
3. GitHub-Branch/Seiten anlegen
4. Inhalte iterativ implementieren
