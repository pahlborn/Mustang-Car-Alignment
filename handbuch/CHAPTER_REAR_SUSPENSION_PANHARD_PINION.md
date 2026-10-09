# Mustang Track Chassis Setup
## Kapitel: Hinterachse — Blattfedern, Panhard Bar & Pinion Angle

**Fahrzeug:** Ford Mustang 1966 – Rundstrecke  
**Version:** 0.1 – 2026-10-04  
**Status:** Fachkapitel; GitHub unverändert

---

## 1. Warum die Hinterachse ein eigenes System ist

Die Hinterachse des frühen Mustang ist konstruktiv völlig anders als die Vorderachse.

Sie besteht im Projekt aus:

- Ford 9" Starrachse
- Blattfedern
- Shackles
- Spring Perches
- U-Bolts / Spring Plates
- Dämpfern
- Panhard Bar
- Kardanwelle / U-Joints

Die Blattfeder übernimmt dabei mehrere Aufgaben gleichzeitig:

1. **Federung**
2. **Längsführung der Achse**
3. **Reaktion von Brems- und Antriebsmoment**
4. teilweise auch laterale Führung über Buchsen-/Federsteifigkeit

Damit können Änderungen an Blattfeder, Buchsen, Shackle oder Wedge gleichzeitig mehrere Fahrzeuggrößen beeinflussen.

---

## 2. Blattfeder ist nicht nur eine Feder

Bei einer Coilover-Hinterachse kann Federung und Achsführung klar getrennt sein.

Bei einer klassischen Blattfederachse ist das anders.

Die Blattfeder:

- trägt Fahrzeuggewicht
- bestimmt einen Teil der Ride Height
- führt die Achse längs
- nimmt Antriebsreaktion auf
- nimmt Bremsreaktion auf
- kann sich unter Antriebsmoment verwinden
- besitzt innere Reibung zwischen den Federlagen
- beeinflusst Achsrotation und damit Pinion Angle

Daher gilt:

> **Eine Änderung der Blattfeder ist immer auch eine Geometrie- und Compliance-Änderung.**

---

## 3. Bekannter Projektzustand

Bereits dokumentiert:

- Wechsel von **4-Leaf Reverse-Eye** auf **Mid-Eye**
- tatsächliche Fahrzeughöhe änderte sich deutlich weniger als die reine Produktbezeichnung vermuten ließ
- links wurde wiederholt ungefähr **20 mm geringere Ride Height** beobachtet
- Panhard Bar vorhanden
- Maier-Racing-orientierte Rear-Suspension-Lösung wurde bereits diskutiert
- frühere Herstellerempfehlung zu einem **2° Wedge, dicke Seite nach vorn** wurde besprochen

Diese Punkte werden hier als Projektdaten geführt, aber nicht automatisch als endgültige Setup-Vorgabe interpretiert.

---

## 4. Reverse Eye vs. Mid Eye

Die Bezeichnungen beschreiben primär die Form und Position des vorderen Federauges relativ zur Feder.

Sie geben nicht allein exakt vor, wie hoch das reale Fahrzeug anschließend steht.

Die tatsächliche Ride Height hängt zusätzlich ab von:

- Federbogen
- Federrate
- Fahrzeuggewicht
- Shackle-Geometrie
- Buchsen
- Achsposition
- Reifen
- vorhandener Karosserie-/Chassistoleranz

Daher gilt:

> Produktname ≠ garantierte reale Fahrzeughöhe.

---

## 5. Blattfederbuchsen und laterale Achsbewegung

Global West weist für frühe Mustangs darauf hin, dass nachgiebige Blattfederbuchsen bei harter Kurvenfahrt laterale Bewegung der Hinterachse zulassen können. Das kann sich als verzögerte Reaktion, Tracking-Probleme oder Reifenfreigängigkeitsprobleme zeigen.

Das ist für unser Fahrzeug wichtig, weil zusätzlich ein Panhard Bar vorhanden ist.

### Konsequenz

Ein sehr steifes Buchsensystem **plus** Panhard Bar kann unter Umständen mehr kinematische Zwangsführung erzeugen als nötig.

Global West warnt bei seinen Del-A-Lum-Lösungen explizit davor, dass eine zusätzliche Panhard Bar zusammen mit sehr stark lateral kontrollierenden Blattfederbuchsen Bind erzeugen kann.

Das ist keine pauschale Aussage für unser konkretes Setup, aber ein wichtiger Prüfpunkt:

> **Buchsensteifigkeit und Panhard-Führung müssen als System betrachtet werden.**

---

## 6. Panhard Bar — Grundfunktion

Die Panhard Bar verbindet:

- eine Seite der Hinterachse
- mit der gegenüberliegenden Chassisseite

und begrenzt die laterale Bewegung der Starrachse.

Sie bewegt sich auf einem Kreisbogen.

Daraus folgt:

- die Achse verschiebt sich beim Ein-/Ausfedern leicht seitlich
- die statische Höhe und der Winkel der Stange sind relevant
- eine Ride-Height-Änderung verändert die statische Querposition der Achse

Global West beschreibt genau diesen Effekt bei Fahrzeugen mit Panhard Bar: Eine Ride-Height-Änderung kann die Hinterachse lateral aus der Fahrzeugmitte verschieben; die Panhard-Länge muss dann nachgestellt werden.

---

## 7. Panhard-Länge vs. Panhard-Höhe

Diese beiden Einstellungen haben unterschiedliche Aufgaben.

### Länge

Verändert primär:

- laterale Achsposition unter dem Fahrzeug

### Höhe der Anlenkpunkte

Verändert primär:

- hintere Rollcenter-Höhe bzw. den geometrischen lateralen Kraftpfad

Maier Racing beschreibt seine Mustang-Panhard-Lösung ausdrücklich als Mittel, um das Chassis über der Hinterachse zu zentrieren und die Rollcenter-Höhe zu beeinflussen.

Daher dürfen Länge und Höhe nicht als dieselbe Einstellung behandelt werden.

---

## 8. Warum Panhard-Höhe fahrdynamisch wirkt

Vereinfacht:

- höhere hintere Panhard-/Rollcenter-Höhe → stärkerer geometrischer Anteil des lateralen Lasttransfers an der Hinterachse
- niedrigere Höhe → anderer Lasttransferpfad und meist mehr Rollmoment über die Federn

Die reale Wirkung hängt vom Gesamtsystem ab:

- Front Rollcenter
- Federraten
- Stabilisatoren
- Schwerpunktshöhe
- Reifen
- Dämpfer
- Blattfederkinematik

Longacre verwendet Panhard-Höhenänderungen als Tuningvariable in seinen Chassis-Dynamics-Unterlagen, allerdings stark im Oval-Racing-Kontext. Diese konkreten Handling-Regeln werden **nicht** direkt auf den Mustang übertragen.

---

## 9. Panhard-Winkel in Ride Height

Für eine symmetrische Baseline sollte die Panhard-Geometrie dokumentiert werden:

- Länge
- Höhe Chassis-Pivot
- Höhe Achs-Pivot
- Winkel zur Horizontalen
- Achse links/rechts zentriert

Bei einer Änderung der Ride Height:

1. Panhard-Winkel erneut messen
2. laterale Achsposition kontrollieren
3. gegebenenfalls Länge korrigieren

Eine geometrisch "schöne" Ride Height ist wertlos, wenn danach die Achse mehrere Millimeter seitlich versetzt steht.

---

## 10. Panhard Arc / Seitverschiebung

Eine Panhard Bar beschreibt einen Kreisbogen.

Je kürzer die Stange und je größer der Federweg, desto größer kann die seitliche Achsverschiebung sein.

Für unser Projekt soll später aus realen Maßen berechnet bzw. gemessen werden:

- statische Lage
- lateral shift bei +25 mm Bump
- lateral shift bei +50 mm Bump
- lateral shift bei Droop

Damit wird aus "Panhard vorhanden" eine messbare Kinematik.

---

## 11. Hinterachse rechtwinklig im Chassis

Bevor Toe vorne final eingestellt wird, muss die Hinterachse geometrisch plausibel sitzen.

Zu prüfen:

- Radstand links
- Radstand rechts
- Diagonalen
- Spring Center Pins
- Spring Perches
- U-Bolts
- Federaugen / Shackles

Der Panhard Bar **definiert die laterale Achsposition** — er zentriert die Achse nur dann, wenn seine Länge korrekt eingestellt ist. „Panhard vorhanden" heißt nicht „Achse zentriert".

Zwei Abgrenzungen, die auseinandergehalten werden müssen:

| | Was der Panhard tut | Was er nicht tut |
|---|---|---|
| **Lateral** | legt die Querposition der Achse fest | — |
| **Gier (Draufsicht)** | — | er kann eine schief stehende Achse nicht richten |

Eine in Draufsicht schräg stehende Hinterachse hat ihre Ursache in Federaugen, Center Pins, Spring Perches oder Chassistoleranzen. Der Panhard verschiebt sie dann nur seitlich — der Thrust Angle bleibt.

> **Deshalb: Achse zuerst rechtwinklig ausrichten, danach den Panhard auf Mitte einstellen.** Nicht umgekehrt.

---

## 12. Thrust Angle

Thrust Angle beschreibt die Gierlage der Hinterachse relativ zur Fahrzeugmittellinie.

Nicht verwechseln mit:

- Panhard Offset
- Pinion Angle

### Panhard Offset
Achse zu weit links/rechts.

### Thrust Angle
Achse in Draufsicht schräg.

### Pinion Angle
Driveline-Geometrie in Seitenansicht.

Diese drei Größen werden separat gemessen.

---

## 13. Pinion Angle — warum der Begriff allein zu ungenau ist

Im Werkstattjargon heißt es oft:

> "Pinion 2° down."

Das reicht für eine belastbare Driveline-Bewertung nicht aus.

Dana/Spicer fordert die Messung von:

- Transmission / driving member
- Driveshaft
- Differential / driven member

Aus den jeweiligen Slopes entstehen die **U-Joint Operating Angles**.

Daher wird im Projekt nicht nur ein Pinion-Winkel dokumentiert, sondern die vollständige Driveline-Geometrie.

---

## 14. Unsere Vorzeichenkonvention

Um spätere Verwechslungen zu vermeiden:

Alle Winkel werden als **Slope von vorn nach hinten** dokumentiert.

- **UP** = steigt von vorn nach hinten
- **DOWN** = fällt von vorn nach hinten

Genau diese Konvention nutzt auch Spicer.

Beispiel:

```text
Transmission: 3,5° DOWN
Driveshaft:    1,0° DOWN
Pinion:        1,0° UP
```

Danach werden die realen U-Joint Operating Angles berechnet.

---

## 15. Operating Angle

Spicer definiert:

> „A universal joint operating angle is the angle that occurs **between the driving member and driveshaft**, and **between the driven member and driveshaft**, when they are not vertically aligned."
> — Spicer, Driveline Operating Angle Calculator

### Die drei Spicer-Grundregeln — Originalwortlaut

> - „Universal joint operating angles at each end of a driveshaft should always be **at least one-half degree**"
> - „Universal joint operating angles on each end of a driveshaft should always be **equal within one degree of each other**"
> - „For vibration-free performance, universal joint operating angles **should not be larger than three degrees**. If they are, make sure they do not exceed the maximum recommended angles."

### Maximalwinkel nach Driveshaft-Drehzahl

Die 3°-Regel ist **keine harte Grenze**, sondern ein Richtwert für vibrationsfreien Betrieb. Spicer nennt zusätzlich drehzahlabhängige Maximalwerte:

| Driveshaft RPM | max. Operating Angle |
|---:|---:|
| 5000 | 3,2° |
| 4500 | 3,7° |
| 4000 | 4,2° |
| 3500 | 5,0° |
| 3000 | 5,8° |
| 2500 | 7,0° |
| 2000 | 8,7° |
| 1500 | 11,5° |

> „The angles shown on the above chart are the **maximum** u-joint operating angles recommended by Spicer engineers and are **directly related to the speed of the driveshaft**. **Any universal joint operating angle greater than 3 degrees will lower universal joint life and may cause a vibration.**"

**Für unser Fahrzeug relevant:** Die Tabelle gilt für die **Kardanwellendrehzahl**, nicht die Motordrehzahl. Im direkten Gang (1:1) sind beide gleich — bei Rundstreckendrehzahlen also der Bereich 4000–5000 rpm mit entsprechend engen Grenzen. In kürzeren Gängen dreht die Welle langsamer, die Grenze wird großzügiger.

> **Zusätzlich zu prüfen:** Spicer verweist auf den *Critical Speed RPM Calculator* — die maximal sichere Kardanwellendrehzahl hängt von Länge und Rohrdurchmesser ab. Das ist eine **vom Betriebswinkel unabhängige** Grenze und bei der 3"/3,5"-Frage aus [`00_PROJECT.md`](00_PROJECT.md) §5 mit zu klären.

### Messgenauigkeit

> „You'll need a spirit level or digital protractor **accurate to 1/4 degree**."

Spicer-Messregeln:

- entlang der **tatsächlichen Mittellinie** der Abtriebswelle messen
- auf einer Fläche, die 90° zur oder parallel zur Abtriebswelle liegt
- Slope-Konvention: **Up** = steigt von vorn nach hinten, **Down** = fällt von vorn nach hinten

Diese Konvention entspricht [`CONVENTIONS.md`](CONVENTIONS.md) §14.

> **Wichtige Einschränkung beider Quellen:** „This calculator **does not address compound drive angles (horizontal offsets)**." Ein seitlicher Versatz zwischen Getriebeausgang und Pinion wird von Spicer-Rechner und TREMEC-App **nicht** erfasst. Bei einer Starrachse, deren Lateralposition über die Panhard-Länge eingestellt wird (§6–10), ist das keine theoretische Einschränkung — die reale Achsposition ist mit zu betrachten.

---

## 16. Warum nicht exakt 0°?

Ein Kreuzgelenk benötigt einen kleinen Betriebswinkel, damit sich die Nadellager bewegen und die Schmierung verteilt wird.

„Alles perfekt parallel, U-Joint läuft bei exakt 0°" ist deshalb **nicht** ideal. Spicer nennt 0,5° als Mindestwinkel.

TREMEC formuliert dasselbe aus der Gegenrichtung:

> „Results of **'0.0' throughout the driveline are also considered 'out-of-spec'** because a slight amount of preload is recommended for proper function of the needle bearings in the universal joint bearing caps."

---

## 17. TREMEC-Regeln

TREMEC nennt für eine typische RWD-Street-Performance-Anwendung **zwei** Grenzwerte:

> „This app targets a **maximum universal joint angle of 3 degrees** and an **overall driveline operating angle (the difference between Angle 1 and Angle 2) no greater than 2 degrees**."

| Größe | Spicer | TREMEC |
|---|---|---|
| Einzelwinkel max. | 3° (drehzahlabhängig mehr) | **3°** |
| Differenz zwischen beiden Gelenken | innerhalb **1°** | innerhalb **2°** |
| Mindestwinkel | 0,5° | > 0 („slight preload") |

> **Korrektur gegenüber der Altfassung:** Diese nannte für TREMEC „Differenz begrenzen" ohne Zahl. TREMEC nennt **2°**, Spicer **1°**. Die Werte sind nicht identisch — **Spicer ist die strengere Vorgabe** und wird für dieses Projekt als Zielwert verwendet, TREMEC als Obergrenze.

### Equal and opposite

TREMEC macht eine Aussage, die über die reine Winkelgröße hinausgeht:

> „If the results are within the accepted range, but were flagged as incorrect, it is because the app has detected the **engine/trans and rear axle to be at opposing angles rather than complimentary** as desired. … angles that are **'equal and opposite' are most desirable**."

Das heißt: Nicht nur die Beträge zählen, sondern die **Richtungen**. Getriebeausgang und Pinion sollen so stehen, dass sich die Ungleichförmigkeiten der beiden Gelenke gegenseitig aufheben. Zwei gleich große Winkel mit falschem Vorzeichen addieren sich statt sich auszugleichen.

### Winkel unter Last

> „Driveline angles **change with suspension movement and during acceleration/deceleration**. To fine tune your angles, you may want to **run the app again with the vehicle loaded** and make adjustments as necessary."

Damit ist statisches Messen nur der Ausgangspunkt — siehe §18 Axle Wrap.

### Korrekturmöglichkeiten

> „Correcting out-of-spec angles may require **raising or lowering the engine/transmission or rear axle assembly, or rotation of the rear axle assembly**."

Die dritte Option — Rotation der Hinterachse — ist beim Blattfederfahrzeug der Wedge Shim (§21–22).

---

## 18. Axle Wrap / Pinion Rise

Unter Antriebsmoment versucht das Differentialgehäuse sich entgegengesetzt zur Achswelle zu drehen.

Bei Blattfedern kann dadurch die Feder vorn verwunden werden.

Folgen:

- Pinion steigt / rotiert
- U-Joint-Winkel ändern sich
- Wheel Hop möglich
- Federgeometrie verändert sich

Die Größe hängt ab von:

- Federsteifigkeit
- Federlänge
- Federlagen
- Buchsen
- Motor-/Achsmoment
- Dämpfung
- Traktionshilfen

Daher darf ein statischer Wedge nicht allein aus einer pauschalen "Blattfedern steigen 3°" Regel bestimmt werden.

---

## 19. Traction Bars

Maier Racing schreibt für seine 1965–70 Road-Race-/Track-Day-Mustangs ausdrücklich, dass Traction Bars meist nicht nötig seien und die freie Rotationsbewegung der Hinterachsfederung begrenzen können. Gute Blattfedern und Dämpfer seien für diese Anwendung wichtiger.

Das passt zu unserem bisherigen Projektansatz:

> Keine zusätzliche Traktionshardware einbauen, solange ein konkretes Problem nicht nachgewiesen ist.

---

## 20. Maier-Racing Rear-Suspension-Konzept

Maier Racing kombiniert für 1965–70 Mustangs:

- Blattfedern
- Bilstein-Dämpfer
- Bushings
- Shackles
- U-Bolts
- Spring Plates
- Panhard Bar

und empfiehlt dieses Paket ausdrücklich für:

- Autocross
- Track Days
- Road Racing

Maier schreibt außerdem, dass ein hinterer Stabilisator bei vielen dieser Setups nicht nötig sei.

Das ist für unser Handbuch interessant, aber kein automatischer Beweis, dass unser Fahrzeug ohne Rear Bar optimal ist.

Es zeigt nur:

> Die Hinterachs-Rollsteifigkeit kann bei einem Blattfeder-Mustang sinnvoll primär über Feder, Dämpfer und Panhard-Geometrie abgestimmt werden.

---

## 21. Flat Shim vs. Wedge Shim

### Flat Shim

Primär:

- Ride Height ändern

Mögliche Nebenwirkungen:

- U-Bolt-Länge
- Klemmung
- Radlasten
- Panhard-Lage

### Wedge Shim

Primär:

- Achsgehäuse relativ zur Blattfeder verdrehen
- Pinion-/Driveline-Geometrie ändern

Daher:

> Flat Shim und Wedge sind keine austauschbaren Lösungen.

---

## 22. Wedge-Richtung

Bei einem konventionellen Mustang-Blattfederaufbau verändert ein Wedge zwischen Blattfeder und Spring Perch die Achsgehäuserotation.

Die genaue Wirkung hängt davon ab, welche Seite dick ist.

Im Projekt wurde früher eine **2°-Wedge-Empfehlung mit dicker Seite nach vorn** diskutiert.

Diese Information bleibt dokumentiert, wird aber **nicht** als Sollwert übernommen, solange die reale Driveline nicht neu gemessen wurde.

---

## 23. Messverfahren Driveline

Race-ready Fahrzeug auf ebener Fläche.

Messen:

### A. Transmission Slope
Möglichst direkt entlang der Ausgangswellenachse oder auf einer exakt parallelen Fläche.

### B. Driveshaft Slope
Direkt am Rohr oder mit geeigneter Vorrichtung.

### C. Pinion Slope
Direkt an Yoke/Bearing-Cap-Referenz oder einer eindeutig rechtwinkligen/parallelen Fläche.

Spicer fordert Messgenauigkeit bis ungefähr 1/4°.

---

## 24. Messprotokoll Pinion / Driveline

```text
Datum:
Race-ready:
Fahrer/Ballast:
Fuel:
Ride Height:

Transmission:
___ ° UP / DOWN

Driveshaft:
___ ° UP / DOWN

Pinion:
___ ° UP / DOWN

Front U-joint Operating Angle:
___ °

Rear U-joint Operating Angle:
___ °

Difference:
___ °

Driveshaft RPM relevant:
___

Wedge:
___ ° / orientation

Bemerkungen:
```

---

## 25. Dynamische Validierung

Statisch korrekte Driveline-Winkel können sich unter:

- Beschleunigen
- Bremsen
- Bump
- Droop

ändern.

Für den Track-Mustang wäre eine spätere dynamische Untersuchung interessant:

- Kamera mit Winkelreferenz am Differential
- digitaler Neigungssensor
- High-Speed-Video
- Messung statisch / belastet

Damit kann reale Pinion Rise bestimmt werden.

---

## 26. Bekannte linke Ride-Height-Differenz

Das linke Heck liegt laut Projektbeobachtung etwa 20 mm tiefer.

Mögliche Ursachen:

- Blattfederbogen
- unterschiedliche Federrate
- Setzverhalten
- Shackle-Geometrie
- Buchsenbindung
- Fahrzeugmasse
- Cross Weight
- Chassistoleranz
- Panhard-Vorspannung
- Montage
- Messreferenz

### Diagnose-Reihenfolge

1. Setup Pad verifizieren
2. Race-ready Zustand
3. harte Chassis-Messpunkte
4. Radlasten
5. Blattfeder links/rechts optisch und geometrisch vergleichen
6. Shackle-Winkel
7. Panhard neutral prüfen
8. Stabilisator neutral
9. Feder-/Dämpferbindung
10. erst danach Shim oder Federänderung erwägen

---

## 27. Shackle Geometry

Der Rear Shackle ermöglicht die Längenänderung der Blattfeder beim Ein-/Ausfedern.

Zu dokumentieren:

- Winkel links
- Winkel rechts
- statische Position
- Freigängigkeit
- Buchsenzustand

Ein ungünstiger oder asymmetrischer Shackle-Winkel kann:

- Ride Height
- effektive Federrate
- Bind
- Links-/Rechts-Symmetrie

beeinflussen.

---

## 28. Rear Roll Steer / Compliance Steer

Bei einer Blattfederachse können sich unter Roll und Seitenkraft kleine Änderungen der Achslage ergeben durch:

- Federverformung
- Buchsen
- Shackle
- Panhard Arc
- Chassisflex

Das ist kein klassischer unabhängiger "Rear Toe"-Versteller, aber kann sich fahrdynamisch wie ein Lenkimpuls anfühlen.

Später soll untersucht werden:

- lateral axle shift über Federweg
- mögliche Gierbewegung der Achse
- links/rechts unterschiedliche Federbewegung

---

## 29. Reihenfolge bei Arbeiten an der Hinterachse

Nach Blattfeder-/Panhard-/Wedge-Arbeiten:

1. mechanische Montage
2. Ride Height
3. Radlasten
4. Achse square / Thrust
5. Panhard lateral zentrieren
6. Panhard-Winkel dokumentieren
7. Driveline Slopes
8. U-Joint Operating Angles
9. Vorderachs-Castor/Camber
10. Bump Steer falls Ride Height relevant geändert
11. Toe
12. Track-Test

---

## 30. Track-Validierung

Beobachten:

### Hinterachse
- Traktion
- Power-on stability
- Wheel Hop
- Links-/Rechts-Symmetrie
- Verhalten über Kerbs
- Mid-corner rear grip
- Exit oversteer

### Driveline
- Vibrationen
- Geschwindigkeit/RPM-Abhängigkeit
- Geräusche
- U-Joint-Temperatur / Verschleiß

### Panhard
- Reifen-/Karosseriefreigängigkeit links/rechts
- unterschiedliches Verhalten Links-/Rechtskurven
- laterale Achsposition nach Setup-Änderungen

---

## 31. Quellen

### Dana / Spicer — Klasse A
Driveline Operating Angle Calculator
https://spicerparts.com/calculators/driveline-operating-angle-calculator
**Lokale Kopie:** `docs/quellen/A-12-spicer-driveline-operating-angle-rules.md`

Belegt: Definition Operating Angle, drei Grundregeln (0,5° Minimum, 1° Differenz, 3° für vibrationsfreien Betrieb), **drehzahlabhängige Maximaltabelle 1500–5000 rpm**, Messgenauigkeit 1/4°, Slope-Konvention Up/Down, Einschränkung „does not address compound drive angles".

### TREMEC — Klasse A
Driveline Angle Finder App Instructions
https://tremec.com/wp-content/uploads/2023/09/TREMEC_Driveline.App_.Instructions.pdf
**Lokale Kopie:** `docs/quellen/A-13-tremec-driveline-app-instructions.pdf`
SHA256: `B3521BD073FBC3D85998E88660EADCCA1DCA4C8D1F56D149E70CAB9095041BAE`

Belegt: max. 3° Einzelwinkel und **max. 2° Differenz**, „equal and opposite" als Zielzustand, 0,0° gilt als out-of-spec, Winkeländerung unter Federbewegung und Last, Korrekturwege (Motor/Getriebe heben/senken oder Achse rotieren), Messverfahren in drei Schritten, Einschränkung bei Compound Angles.

### Maier Racing
Mustang Rear Suspension Kit  
https://www.maierracing.com/product/mustang-rear-suspension-kit/

Panhard Rod Kit  
https://www.maierracing.com/product/mustang-panhard-rod-kit/

FAQ / Traction Bars  
https://www.maierracing.com/faqs/

### Global West
Mustang Del-A-Lum Bushings & Shackles  
https://www.globalwest.net/product/mustang-del-a-lum-bushings-shackle-kit-1964-1965-1966-global-west-suspension/

Reverse-Eye Del-A-Lum / Panhard Bind Note  
https://www.globalwest.net/product/mustang-del-a-lum-bushings-shackle-kit-1964-1965-1966-reverse-eye-leaf-global-west/

---

## 32. Definition of Done

- [x] Blattfeder als Multifunktionsbauteil erklärt
- [x] Panhard Länge vs. Höhe getrennt
- [x] Ride Height ↔ Panhard berücksichtigt
- [x] Axle Squareness / Thrust getrennt
- [x] Pinion Angle korrekt als Driveline-System behandelt
- [x] Spicer Operating-Angle-Regeln integriert, Originalwortlaut belegt
- [x] TREMEC dynamische Winkeländerung integriert
- [x] drehzahlabhängige Spicer-Maximaltabelle ergänzt
- [x] Spicer 1° vs. TREMEC 2° Differenz als Abweichung benannt
- [x] „equal and opposite" aufgenommen
- [x] Einschränkung Compound Angles / seitlicher Versatz benannt
- [x] Panhard: „definiert laterale Position" statt „zentriert"
- [x] Citation-Artefakte entfernt, beide Quellen lokal gespiegelt
- [x] Flat Shim vs. Wedge getrennt
- [x] Axle Wrap berücksichtigt
- [x] Traction Bars eingeordnet
- [x] linke 20-mm-Differenz als Diagnoseproblem erhalten
- [ ] reale Panhard-Abmessungen aufgenommen
- [ ] reale Shackle-Winkel gemessen
- [ ] reale Driveline Slopes gemessen
- [ ] reale Axle-Wrap-Größe bestimmt
- [ ] Ursache der linken Ride-Height-Differenz gefunden