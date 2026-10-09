# Mustang Track Chassis Setup — Workflow

**Dokumentrolle:** Einziger verbindlicher Gesamt-Setup-Ablauf  
**Version:** 0.3  
**Datum:** 2026-10-05  
**Status:** Autoritativ für Reihenfolge und Rückkopplungen

---


## 1. Zweck

Dieses Dokument ist der **einzige verbindliche Gesamt-Workflow** des Projekts. Es verbindet die Fachbereiche zu einem reproduzierbaren Arbeitsablauf.

Fahrzeugdaten und aktuelle Baseline stehen ausschließlich in [`00_PROJECT.md`](00_PROJECT.md). Vorzeichen, Formeln, IDs und Symptomcodes stehen in [`CONVENTIONS.md`](CONVENTIONS.md).

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

## 2. Grundregel: Initial Setup vs. Final Setup

Es gibt zwei unterschiedliche Zustände:

### Initial Setup

Ziel:
- Fahrzeug in einen definierten, messbaren Zustand bringen
- offensichtliche Geometriefehler beseitigen
- eine belastbare Basis für Scaling und Kinematik schaffen

### Final Setup

Ziel:
- nach Corner Weight, Ride Height und Kinematik die finalen Alignment-Werte setzen
- anschließend erneut Scaling prüfen
- daraus die Track-Baseline erzeugen

Longacre selbst zeigt diese Rückkopplung indirekt: Für finales Scaling soll das Auto bereits race-ready sein, einschließlich Ride Height, Camber, Caster, Rear-End-Squareness und Toe; für finales Toe wiederum sollen Ride Height, Gewicht, Bump Steer, Camber, Caster und Ackermann bereits definiert sein. Daraus folgt für unser Projekt bewusst ein **iterativer Zyklus statt einer starren Einmal-Reihenfolge**.

---

## 3. Phase 0 — Hardware-Inventar

Vor jeder ernsthaften Setup-Arbeit wird der reale Hardwarezustand gegen [`00_PROJECT.md`](00_PROJECT.md) geprüft.

[`00_PROJECT.md`](00_PROJECT.md) ist die **einzige autoritative Quelle** für die konkrete Fahrzeugkonfiguration. In diesem Workflow werden deshalb keine Marken, Modelle, Reifenabmessungen oder Baseline-Zahlen dupliziert.

Mindestens verifizieren:

### Vorderachse / Lenkung
- UCA / Shelby Drop
- LCA / Camber-Verstellung
- Ball Joints
- Strut Rods
- Spindles / Steering Arms
- Tie Rods / Center Link / Pitman / Idler
- Steering Box
- Federn / Dämpfer
- ARB / Endlinks
- Bump Stops

### Hinterachse
- Blattfedern
- Bushings / Shackles
- Spring Perches / U-Bolts / Spring Plates
- Dämpfer
- Panhard Bar
- ggf. Rear ARB
- Achse / Differential

### Driveline
- Getriebe
- Kardanwelle
- U-Joints
- Pinion / Yoke

### Räder / Reifen
- Rad-/Reifenkonfiguration
- Tire Set ID
- Alter / Heat Cycles

Abweichungen vom dokumentierten Zustand werden **zuerst in [`00_PROJECT.md`](00_PROJECT.md)** korrigiert.

Ohne verifiziertes Hardware-Inventar dürfen keine pauschalen Verstellregeln angenommen werden.

---

## 4. Phase 1 — Mechanische Prüfung

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

### Stop-Regel

Wird mechanisches Spiel, lose Hardware oder ein Reifenschaden gefunden:

> Setup-Arbeit stoppen und zuerst reparieren.

---

## 5. Phase 2 — Setup Pad herstellen

### Ziel

Vier reproduzierbare Radpositionen:

- LF
- RF
- LR
- RR

in **einer gemeinsamen Ebene**.

### Vorgehen

1. Boden vermessen
2. harte Shims / Leveling Plates definieren
3. jede Ecke kennzeichnen
4. Bodenpositionen markieren
5. Turnplates/Scale Pads/Rear Pads auf gleiche effektive Höhe bringen
6. Reproduzierbarkeit prüfen

### Bind vermeiden

Longacre weist darauf hin, dass beim Absenken durch Camber Gain seitliche Reifenbewegung nötig ist. Ohne Slip/Side-Movement bleibt Fahrwerksbindung zurück und verfälscht Radlasten und Geometrie.

Für unser Setup daher:
- Turnplates vorne
- Slip-/Roll-off-Möglichkeit
- hinten möglichst spannungsfreie Auflage

---

## 6. Phase 3 — Race-Ready-Zustand

Vor vergleichbaren Messungen immer gleich:

- Fahrer oder definierter Fahrerballast
- definierter Kraftstoffstand
- Betriebsflüssigkeiten
- gleicher Reifen-/Radsatz
- definierter kalter Reifendruck
- kein loses Material
- Lenkrad / Steering Center dokumentiert

### Projektregel

Ein Setup-Wert ohne dokumentierten Race-Ready-Zustand ist nur bedingt vergleichbar.

---

## 7. Phase 4 — Initial Ride Height

Noch nichts optimieren.

Messen:

- LF Chassis-to-Ground
- RF
- LR
- RR
- Rake
- bekannte L/R-Differenz
- Bump-Stop-Abstände
- Dämpferposition, soweit messbar

### Wiederholungsprüfung

1. messen
2. Fahrzeug anheben
3. wieder absetzen
4. setzen / rollen
5. erneut messen

Nur reproduzierbare Differenzen werden weiter bewertet.

---

## 8. Phase 5 — Hinterachsreferenz

Bevor die Vorderachse final ausgerichtet wird:

### Prüfen
- Radstand links
- Radstand rechts
- Achse square im Chassis
- Center Pins / Spring Perches
- U-Bolts
- Shackle-Geometrie
- Panhard-Lateralposition
- Panhard-Winkel
- Thrust Angle

### Zusätzlich
- Pinion/Driveline noch nicht zwingend korrigieren
- aber Transmission-, Driveshaft- und Pinion-Slope dokumentieren

---

## 9. Phase 6 — Initial Front Alignment

Ziel ist noch nicht absolute Finalität, sondern eine brauchbare Basis.

### Reihenfolge

1. Steering Center definieren
2. Castor
3. Camber
4. grobes Toe

### Warum Castor vor Camber?

Beim 65/66 Mustang koppeln UCA-Shims und Strut Rods Castor und Camber. Deshalb wird zunächst der gewünschte Castor-Bereich hergestellt, dann Camber, anschließend beide erneut geprüft.

### KPI
- messen und dokumentieren
- primär Diagnosewert

---

## 10. Phase 7 — Initial Scaling

Jetzt auf die Corner-Weight-Waagen. Das konkrete vorhandene Messmittel steht in [`00_PROJECT.md`](00_PROJECT.md).

### Vorher
- Pads level/coplanar
- Waagen nullen
- Fahrer/Fuel/Druck korrekt
- Fahrwerk gesetzt
- ARB möglichst neutral

### Erfassen
- LF
- RF
- LR
- RR
- Total
- Front/Rear
- Left/Right
- Cross

### Noch nicht
Nicht sofort auf 50,00 % Cross jagen.

Zuerst:
- Messung wiederholen
- Reproduzierbarkeit
- Zusammenhang mit Ride Height verstehen

---

## 11. Phase 8 — Balance / Ride Height Adjustment

Nur wenn nötig.

Mögliche Ziele:

- problematische L/R-Ride-Height-Differenz klären
- Cross in sinnvollen Bereich bringen
- ausreichend Bump/Droop sicherstellen
- ARB-Preload vermeiden
- Panhard-Geometrie erhalten

### Regel

Eine Balancekorrektur ist nur gut, wenn sie keine wichtigere Randbedingung verschlechtert.

Bei Zielkonflikten gilt ausschließlich das **Prioritätsmodell in Abschnitt 29** dieses Workflows.

---

## 12. Phase 9 — Nach Balanceänderung alles erneut prüfen

Nach echter Ride-Height- oder Corner-Weight-Änderung gilt **Abschnitt 27**
dieses Workflows. Dort steht zeilenweise, was eine Änderung nach sich zieht
und ob der betroffene Wert neu zu messen oder nur mitzumessen ist.

Diese Phase führt die Liste bewusst nicht erneut auf: sie wäre eine zweite,
unvollständige Fassung derselben Tabelle und liefe über kurz oder lang gegen
sie. Phase 9 ist der **Zeitpunkt**, an dem die Matrix angewandt wird — nicht
ihr Inhalt.

Daraus folgt auch, dass diese Phase keinen eigenen Messwert erzeugt. Sie kann
abgeschlossen sein oder nicht, aber sie kann nicht veralten.

---

## 13. Phase 10 — Bump Steer

Bump Steer wird gemessen, wenn:

- Ride Height final oder nahezu final
- Castor gesetzt
- Camber gesetzt
- Toe als definierter Startzustand gesetzt
- Steering Center fixiert

Longacre fordert genau diese Vorbereitung für eine aussagekräftige Bump-Steer-Messung.

### Baseline

LF und RF getrennt:
- Droop
- 0
- Bump
- fein um Ride Height

Auswertung als:
**Toe Change vs. Wheel Travel**

### Wichtig

Bump Steer wird geometrisch korrigiert, nicht mit statischem Toe versteckt.

---

## 14. Phase 11 — Camber Gain / Kinematics

Wenn der Aufwand gerechtfertigt ist:

- Camber über Federweg
- Bump/Droop
- links/rechts
- ggf. bei Lenkwinkel

Damit wird sichtbar, was aus dem statischen Camber während realer Radbewegung wird.

---

## 15. Phase 12 — Ackermann

Mit geeigneten Steering Turntables / Lenkwinkelplatten:

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

## 16. Phase 13 — Final Front Alignment

Jetzt erst finale statische Werte.

### Reihenfolge

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

## 17. Phase 14 — Settling-Prozedur

Nach jeder relevanten Alignment-Änderung:

1. Fahrzeug zurückrollen
2. vorwärts in Messposition rollen
3. nicht wieder zurückrollen
4. leicht setzen
5. messen

Longacre empfiehlt diese Vorwärts-Rollbewegung, damit Spiel und Casterwirkung die Komponenten reproduzierbar in dieselbe Richtung setzen.

---

## 18. Phase 15 — Final Scaling

Nach finalem Alignment noch einmal wiegen.

Warum?

Weil:
- Camber
- Reifendruck
- Ride Height
- Bind
- Alignmentänderungen

die Waagenwerte beeinflussen können.

### Final erfassen

- LF/RF/LR/RR
- Cross
- Front/Rear
- Left/Right
- Ride Height

Wenn sich Werte unerwartet stark geändert haben:
→ Ursache suchen, nicht einfach akzeptieren.

---

## 19. Phase 16 — Driveline / Pinion Final Check

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

## 20. Phase 17 — Full Lock / Freigängigkeit

Mit geeigneten Steering Turntables / Lenkwinkelplatten:

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

## 21. Phase 18 — Werkstatt-Baseline einfrieren

Nach Abschluss der Werkstattphasen wird der vollständig dokumentierte Zustand als Baseline eingefroren.

### Autoritäten

- ID-Schema und Begriffe: [`CONVENTIONS.md`](CONVENTIONS.md) §19
- konkrete Fahrzeugdaten und Baseline-Governance: [`00_PROJECT.md`](00_PROJECT.md) §8–10

### Workflow-Aktion

1. vollständigen Race-Ready-Zustand bestätigen
2. Setup-Pad-Version dokumentieren
3. Hardwarezustand gegen [`00_PROJECT.md`](00_PROJECT.md) prüfen
4. vollständige Messdaten gemäß [`00_PROJECT.md`](00_PROJECT.md) §9 erfassen
5. Baseline-ID nach [`CONVENTIONS.md`](CONVENTIONS.md) vergeben
6. Baseline erst danach für Track- und A/B-Vergleiche freigeben

Der Workflow definiert damit **wann** eine Baseline eingefroren wird; [`00_PROJECT.md`](00_PROJECT.md) definiert **welche Fahrzeugdaten** dafür maßgeblich sind, [`CONVENTIONS.md`](CONVENTIONS.md) **wie sie bezeichnet wird**.

---

## 22. Phase 19 — Track Baseline

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

## 23. Phase 20 — Handling klassifizieren

Symptomcode nach [`CONVENTIONS.md`](CONVENTIONS.md) vergeben.

Die Codes beschreiben das **Symptom**, nicht dessen Ursache.

Dann:
- früheste problematische Phase bestimmen
- Daten korrelieren
- Hypothese bilden

---

## 24. Phase 21 — Eine Änderung

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

## 25. Phase 22 — A/B-Test

A/B-Definition und Vergleichsregeln: siehe [`CONVENTIONS.md`](CONVENTIONS.md) §20.

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

## 26. Master-Reihenfolge als Kurzcheckliste

### Vorbereitung
- [ ] Hardwareinventar
- [ ] Mechanik
- [ ] Setup Pad
- [ ] Race-ready

### Initial
- [ ] Ride Height
- [ ] Rear Square / Thrust / Panhard
- [ ] Castor
- [ ] Camber
- [ ] grobes Toe
- [ ] Scaling

### Balance
- [ ] Cross / Ride Height
- [ ] ARB neutral
- [ ] erneut Ride Height
- [ ] Rear Geometry erneut

### Kinematics
- [ ] Bump Steer
- [ ] optional Camber Gain
- [ ] Ackermann

### Final Alignment
- [ ] Castor
- [ ] Camber
- [ ] KPI
- [ ] Steering Center
- [ ] Individual Toe
- [ ] Total Toe
- [ ] Full Lock

### Final Verification
- [ ] Final Scaling
- [ ] Driveline Angles
- [ ] Panhard
- [ ] dokumentieren

### Track
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

## 27. Was wann erneut geprüft werden muss

Die Spalte **Wirkung** unterscheidet zwei Fälle, die nicht dasselbe bedeuten:

- **neu messen** — der notierte Wert gilt nicht mehr. Er beschreibt einen
  Fahrzeugzustand, den es so nicht mehr gibt. Beispiel: wer Camber verstellt,
  verändert Toe über die Achsgeometrie mit, ohne die Spurstange anzufassen.
  Der alte Toe-Wert ist damit eine Zahl ohne Deckung.
- **mitmessen** — die Größe verschiebt sich, wird aber nicht ungültig.
  Beispiel: 0,2 bar mehr Reifendruck heben die Fahrhöhe um etwa einen
  Millimeter. Beim nächsten Messdurchgang mitnehmen, aber keine eigene
  Werkstattfahrt wert.

Der Unterschied ist nicht nur sprachlich: **neu messen pflanzt sich fort**
(Blattfeder → Ride Height → Corner Weight → Alignment), **mitmessen bleibt
stehen**, wo es auftritt. Ohne diese Trennung würde eine Druckkorrektur über
die Kette Reifen → Ride Height → Corner Weight → Alignment das halbe Setup als
ungültig markieren - und eine Anzeige, die das zweimal behauptet, glaubt
niemand mehr.

| Änderung | Danach erneut prüfen | Wirkung |
|---|---|---|
| Ride Height | Corner Weight, Camber, Toe, Panhard, ggf. Castor/Bump Steer | neu messen |
| Corner Weight | Ride Height | mitmessen |
| Corner Weight | Alignment | neu messen |
| Castor | Camber, Toe, Freigängigkeit | neu messen |
| Camber | Toe, ggf. Radlasten | neu messen |
| Tie-Rod-Höhe | gesamte Bump-Steer-Kurve, Toe | neu messen |
| Toe | Steering Center | neu messen |
| Blattfeder | Ride Height, Cross, Thrust, Panhard, Pinion | neu messen |
| Panhard-Länge | Achszentrierung | neu messen |
| Panhard-Höhe | Rear Roll Geometry, lateral position prüfen | neu messen |
| Wedge | Pinion/U-Joint-Winkel, U-Bolt-Klemmung | neu messen |
| Reifen/Druck | Ride Height, Trackdaten | mitmessen |
| Stabilisator/Endlink | ARB-Preload, Radlasten | neu messen |

Das vorangestellte **ggf.** markiert eine dritte, schwächere Stufe: die Größe
*kann* betroffen sein, muss es aber nicht. Sie erzeugt einen Hinweis, keinen
Prüfauftrag, und pflanzt sich ebenfalls nicht fort.

Diese Tabelle ist die einzige Quelle der Abhängigkeiten. `recheck.js` schreibt
sie Zeile für Zeile ab, und `tests/recheck.test.mjs` prüft beide Richtungen -
jede Zeile hier kommt dort vor und umgekehrt.

---

## 28. Fehlervermeidung

### Nicht tun

- Toe zuerst "perfekt" machen und danach Ride Height ändern
- auf unebenem Boden Zehntelgrad vergleichen
- 50,00 % Cross auf Kosten der Geometrie erzwingen
- Bump Steer mit statischem Toe kaschieren
- Pinion Angle nur als einzelne "down"-Zahl betrachten
- Tracktemperaturen nach langer Cool-down-Zeit vergleichen
- zwei oder drei Setupänderungen gleichzeitig durchführen
- Oval-Setupregeln ungeprüft übernehmen

---

## 29. Prioritätsmodell

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

## 30. Quellenbasis

### Longacre — Scaling A Race Car Properly
https://www.longacreracing.com/tech-central.aspx?item=8163&title=scaling-a-race-car-properly

Bestätigt:
- race-ready vor finalem Scaling
- Fuel/Fluids
- Tire Pressure
- Camber
- Rear End Square

### Longacre — Set Toe Properly
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

### Longacre — Bump Steer
https://longacreracing.com/pages/bump-steer

Bestätigt:
- Ride Height
- richtige Reifen/Druck
- Caster/Camber/Toe
- Steering centered/locked
vor der Messung.

### Longacre — Bind Free Chassis Setups
https://longacreracing.com/pages/bind-free-chassis-setups

Bestätigt:
- Camber Bind
- Notwendigkeit seitlicher Entspannung beim Absetzen

### Dunlop CG/4-5 / CG/6
Original Operating Instructions — Nutzer-Scans

---

## 31. Definition of Done

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