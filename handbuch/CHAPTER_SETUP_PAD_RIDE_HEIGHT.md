# Mustang Track Chassis Setup
## Kapitel: Setup Pad & Ride Height

**Fahrzeug:** Ford Mustang 1966 - Rundstrecke  
**Version:** 0.1 - 2026-10-04  
**Status:** Fachkapitel; GitHub unverändert

---

### 1. Warum dieses Kapitel so früh kommt

Ride Height ist keine kosmetische Größe. Sie ist eine geometrische Randbedingung des gesamten Fahrwerks.

Sie beeinflusst unter anderem:

- statische Radlasten
- verfügbare Federwege
- Camber und Camber Gain
- Toe
- Bump Steer
- Rollcenter
- Panhard-Geometrie
- Bodenfreiheit
- Reifen-/Karosseriefreigängigkeit
- Schwerpunktlage
- Brems-/Antriebswinkel
- den Ausgangszustand für jede spätere Alignment-Messung

Ebenso wichtig ist die Messfläche. Eine hochwertige Waage, ein guter Camber Gauge oder präzise Toe Plates liefern keine brauchbaren Ergebnisse, wenn die vier Radaufstandspunkte nicht reproduzierbar in einer gemeinsamen Ebene liegen.

> **Setup Pad und Ride Height bilden die geometrische Referenz des gesamten Chassis-Setups.**

---

## 2. Zwei verschiedene Begriffe: Level und Coplanar

Diese Begriffe müssen getrennt werden.

### Level

Eine Fläche ist **level**, wenn sie horizontal ist.

### Coplanar

Vier Aufstandspunkte sind **coplanar**, wenn sie in derselben geometrischen Ebene liegen.

Für Waagenmessungen ist Coplanarität besonders wichtig.

Longacre beschreibt sinngemäß:

- eine gesamte Plattform kann leicht nach vorn oder zur Seite geneigt sein und trotzdem relativ brauchbare Radlastwerte liefern,
- ein einzelnes höheres Pad oder zwei diagonal angehobene Pads erzeugen dagegen unmittelbar falsches Cross Weight.

Deshalb gilt:

> **Eine gemeinsame Ebene ist zwingend. Absolute Horizontalität ist ebenfalls anzustreben, aber eine diagonale Verwindung der vier Pads ist deutlich kritischer.**

Für Alignment-Messungen ist zusätzlich eine möglichst horizontale Ebene wichtig, weil Camber und Castor sonst korrigiert werden müssen.

---

## 3. Zielzustand des Setup Pads

Der ideale Werkstattplatz besteht aus vier reproduzierbaren Radpositionen:

```text
                  FAHRTRICHTUNG
                       ↑

            [ LF PAD ]      [ RF PAD ]



            [ LR PAD ]      [ RR PAD ]
```

Jede Position soll:

- fest markiert sein
- auf steifem Untergrund liegen
- wiederholbar auf dieselbe Höhe gebracht werden können
- in derselben Ebene wie die anderen drei liegen
- ausreichend groß für Reifen und Messmittel sein
- bei Bedarf Turnplate / Slipplate / Waage aufnehmen können

Die vier Positionen werden dauerhaft als:

- LF
- RF
- LR
- RR

markiert.

---

## 4. Aufbau eines reproduzierbaren Setup Pads

### 4.1 Werkstattboden zuerst untersuchen

Nicht davon ausgehen, dass eine Garagen- oder Hallenfläche eben ist.

Prüfen:

- Längsgefälle
- Quergefälle
- lokale Senken
- einzelne hohe Stellen
- diagonale Verwindung

### Mögliche Messmittel

In Reihenfolge steigender Präzision:

1. lange Richtlatte + Präzisionswasserwaage
2. Schlauchwaage / Wasserwaage
3. Rotations-/Linienlaser
4. Laser mit Pad-Targets
5. professionelles Setup-Pad-System

Der vorhandene Dunlop CG/4 kann als grobe Winkelkontrolle verwendet werden, ist aber für den Aufbau einer hochpräzisen gemeinsamen Ebene nicht die bevorzugte Endmethode.

---

## 5. Longacre-Prinzip zum Nivellieren

Longacre beschreibt für seinen Laser Chassis Height Checker ein sauberes Referenzverfahren:

1. erstes Pad nivellieren,
2. Laserhöhe auf eine definierte Referenz des ersten Pads einstellen,
3. Laserstand danach **nicht mehr verschieben**,
4. die drei übrigen Pads einzeln nivellieren,
5. jedes Pad so in der Höhe verstellen, dass seine Referenz exakt auf derselben Laserlinie liegt,
6. Bodenpositionen markieren.

Damit liegen alle vier Pad-Oberflächen auf derselben horizontalen Referenzebene.

Für unser Projekt ist das Prinzip wichtiger als das konkrete Longacre-Laserprodukt:

> **Eine unveränderte gemeinsame Höhenreferenz wird auf alle vier Radpositionen übertragen.**

---

## 6. Shims und Leveling Trays

Falls der Boden nicht plan ist, werden die Pads mit festen Unterlagen nivelliert.

Geeignet sind beispielsweise:

- stabile Aluminiumplatten
- Stahlplatten
- definierte harte Kunststoffplatten
- professionelle Leveling Trays

Nicht geeignet:

- Holzreste mit wechselnder Dicke
- weiche Gummimatten
- Karton
- kompressible Unterlagen

### Projektregel

Jedes Unterlagenpaket wird dauerhaft gekennzeichnet:

- LF
- RF
- LR
- RR

und nur an seiner jeweiligen Position verwendet.

Die Bodenpositionen werden ebenfalls markiert.

So entsteht ein reproduzierbares Werkstatt-Setup.

---

## 7. Turnplates, Waagen und gleiche Höhen

Wenn vorne Dunlop CG/6 Turnplates verwendet werden und hinten einfache Platten liegen, müssen die Reifenaufstandsflächen auf gleicher Ebene bleiben.

Dasselbe gilt für:

- Waagenpads
- Turnplates auf Waagen
- Slipplates
- Roll-off Pads

Beispiel:

Wenn der vordere Turnplate 50 mm hoch ist, hinten aber der Reifen direkt auf dem Boden steht, wird das Fahrzeug künstlich nach hinten geneigt.

Das verändert:

- Ride Height relativ zur Messfläche
- Castor
- Radlasten
- Federstellung
- möglicherweise Toe

Daher:

> **Alle vier Reifen müssen für die jeweilige Messung auf geometrisch gleichwertigen Aufstandshöhen stehen.**

---

## 8. Slip und Bind

Beim Absenken eines Fahrzeugs ändert sich durch die Radaufhängung die Spurweite geringfügig. Die Reifen müssen seitlich ausweichen können.

Wenn sie das nicht können:

- Reifen verspannen sich,
- Querlenker verbleiben in einer künstlichen Position,
- Radlasten werden verfälscht,
- Camber/Toe können verfälscht werden.

Longacre beschreibt dieses Problem ausdrücklich als **camber bind**.

### Lösungen

- Slip plates
- Side sliders / Rollen
- Turnplates vorne
- Roll-off procedure
- sehr glatte Zwischenlagen, sofern sicher ausgeführt

Für unseren Mustang ist besonders wichtig:

- vorne wegen SLA-Geometrie und Camber Gain,
- hinten wegen Blattfederreibung und Panhard-/Seitbewegung.

---

## 9. Warum Ride Height nicht am Kotflügel definiert werden sollte

Ein Kotflügelmaß ist leicht zu nehmen, aber kein idealer geometrischer Referenzwert.

Es wird beeinflusst durch:

- Karosserietoleranzen
- frühere Reparaturen
- Radlaufunterschiede
- Reifenradius
- Luftdruck
- Karosserieposition auf der Struktur

Deshalb sollen für den Setup-Prozess **harte Chassis-Punkte** verwendet werden.

Der Kotflügel kann zusätzlich als schnelle Werkstattkontrolle dienen, aber nicht als primäre technische Referenz.

---

## 10. Primäre Ride-Height-Referenz

Für dieses Projekt sollen vier feste Punkte gewählt werden:

```text
LINKS                               RECHTS

Front Chassis Point L        Front Chassis Point R

Rear Chassis Point L         Rear Chassis Point R
```

Anforderungen:

- strukturell fest
- symmetrisch links/rechts
- eindeutig wiederauffindbar
- nicht an beweglichen Bauteilen
- nicht an Auspuff, Feder, Achse oder Karosserieblech
- gut mit Messstab / Laser erreichbar

Mögliche Kandidaten am 1966 Mustang müssen am realen Fahrzeug festgelegt werden, z. B. definierte Unterkanten der vorderen und hinteren Frame Rails bzw. Torque-Box-/Rail-Referenzen.

**Noch keine endgültigen Punkte festlegen, bevor das Fahrzeug vermessen wurde.**

---

## 11. Zwei verschiedene Ride-Height-Messungen

### A. Chassis to Ground

Abstand eines festen Chassispunkts zur Ground Plane.

Vorteile:
- direkt relevant für Bodenfreiheit und Chassislage

Nachteile:
- Reifenradius und Reifendruck wirken mit hinein

### B. Chassis to Wheel Center

Abstand Chassispunkt zu Radzentrum.

Vorteile:
- Reifenradius weitgehend herausgerechnet
- gute Referenz für Federungsposition

Nachteile:
- aufwendiger zu messen
- nicht direkt Bodenfreiheit

Für ein hochwertiges Setup-Handbuch sollten **beide Konzepte erklärt** werden.

Für die tägliche Werkstatt kann Chassis-to-Ground ausreichen, wenn Reifen und Druck standardisiert sind.

---

## 12. Longacre Ride-Height-Prinzip

Longacre nutzt bei seinen Chassis-Height-Systemen eine horizontale Laserlinie als simulierte Ground Plane.

Wenn das Fahrzeug auf erhöhten Scale Pads steht, kann damit die tatsächliche Höhe relativ zur gedachten Fahrbahn gemessen werden.

Das ist ein wichtiges Prinzip:

> **Die Messung muss sich auf die Ground Plane beziehen, nicht einfach auf die Oberkante eines zufälligen Unterbaus.**

Steht das Fahrzeug 75 mm auf Waagen über dem Werkstattboden, darf man nicht einfach vom Werkstattboden zum Chassis messen, ohne die 75 mm korrekt herauszurechnen.

---

## 13. Ride Height und Reifen

Bei Chassis-to-Ground-Messungen sind Reifen Bestandteil des Systems.

Daher immer dokumentieren:

- Reifentyp
- Reifengröße
- Reifendruck
- Verschleißzustand
- ggf. Reifenumfang

Beim Mustang:

**Avon CR6ZZ 225/65 R15**

Eine Änderung des Drucks oder ein anderer Reifen kann die gemessene Chassishöhe verändern, obwohl keine Fahrwerkseinstellung verändert wurde.

---

## 14. Ride Height und Kraftstoff / Fahrer

Mehr Masse komprimiert Federn und Reifen.

Daher muss Ride Height im selben Race-Ready-Zustand gemessen werden wie Corner Weight:

- Fahrer/Fahrerballast
- definierter Kraftstoff
- Betriebsflüssigkeiten
- definierter Reifendruck

Sonst ist die Zahl nicht sauber vergleichbar.

---

## 15. Rake

**Rake** bezeichnet die Längsneigung des Chassis, typischerweise Differenz zwischen vorderer und hinterer Chassishöhe.

Rake darf nicht allein aus Radlaufabständen abgeleitet werden.

Es beeinflusst je nach Fahrzeug:

- Schwerpunktlage relativ zum Boden
- Federweg
- Aufhängungswinkel
- Aerodynamik
- hintere Panhard-Geometrie
- Kardan-/Pinion-Winkel
- Rollcenter

Beim 1966 Mustang ohne ausgeprägten modernen Unterboden ist Aero-Rake nicht der primäre Treiber. Vorrang haben:

- Fahrwerksgeometrie
- Federweg
- Bodenfreiheit
- Rollcenter
- Antriebsstrangwinkel

---

## 16. Ride Height und Schwerpunkt

Eine niedrigere Fahrzeughöhe kann die Schwerpunktshöhe reduzieren.

Das kann den gesamten lateralen und longitudinalen Lasttransfer reduzieren.

Aber:

> **"Tiefer ist immer besser" ist falsch.**

Zu geringe Ride Height kann:

- Federweg vernichten
- Bump Stops aktivieren
- Rollcenter ungünstig verschieben
- Bump Steer erhöhen
- Camberkurve verschlechtern
- Reifen-/Karosseriekontakt verursachen
- Auspuff/Ölwanne gefährden

Beim historischen Mustang ist die Geometrie besonders empfindlich gegenüber großen Abweichungen von der vorgesehenen Arbeitslage.

---

## 17. Ride Height und Rollcenter

Bei einer Doppelquerlenkerachse verändert sich mit der Chassishöhe die Lage der Querlenker.

Dadurch verändern sich:

- Instant Centers
- Rollcenter-Höhe
- Rollcenter-Wanderung
- Camber Gain

Der Shelby Drop verändert bereits die UCA-Innenlagerposition. Deshalb muss die reale Ride Height gemeinsam mit der geänderten UCA-Geometrie betrachtet werden.

Die Aussage:

> "Shelby Drop = 1 inch tieferes Auto"

ist falsch.

Der klassische Shelby/Arning Drop versetzt die **UCA-Innenlager**, nicht die Karosseriehöhe selbst.

---

## 18. Klassischer Shelby/Arning Drop - geometrische Referenz

### Das Mass

Belegt fuer 1964-66 Mustang:

- UCA-Innenlager **1" nach unten**
- zusaetzlich **1/8" nach hinten**

Der Rueckversatz ist modelljahrabhaengig:

> "The holes should be marked and center punched **one inch lower**, and on **64-66 Mustangs, 1/8" toward the rear** of the car. This rearward offset **cannot be used on the 67-70 Mustang**, due to the very tight confines of the shock tower."
> - Suesz/Burgy, *The Arning/Shelby Control Arm Drop* (Quelle B-01)

### Wie es wirkt - und wie nicht

Die verbreitete Annahme "der Drop legt das Auto tiefer und deshalb faehrt es besser" ist falsch. Die Quelle raeumt damit ausdruecklich auf:

> "A common misconception is the drop improves handling by **lowering the car**. While it is true that the car is **about 5/8" lower** after this modification, the real improvement comes from the **change in the geometry** of the suspension. The **roll center of the suspension is raised**, which causes the front suspension to **resist body roll**, which makes the suspension feel, and act, **as though a larger sway bar were installed**. It also serves to keep the **wheels more square in contact with the road surface**."

Zwei Punkte, die daraus fuer dieses Projekt folgen:

1. **Das Fahrzeug wird tatsaechlich ca. 5/8" tiefer** - als Nebeneffekt, nicht als Zweck. Wer den Drop einbaut und danach die Ride Height nicht neu erfasst, vergleicht zwei verschiedene Zustaende.
2. **Der Drop wirkt wie ein groesserer Stabilisator.** Fuer die Rollsteifigkeitsverteilung vorn/hinten heisst das: Die Vorderachse ist durch den Drop bereits in Richtung "steifer" verschoben. Das ist bei der Balance-Beurteilung mitzudenken.

### Warum die Modifikation existiert

> "This is also important, since the original suspension was designed to work with **narrow, bias-ply, non-belted tires**. Almost universally, people today use **wider, belted radial tires**. This modification has the effect of **'radial-tuning' the suspension** for modern tires."

Historisch stammt die Geometrie aus Klaus Arnings IRS-Entwicklung fuer den Mustang. Nach deren Streichung aus Kostengruenden zeigte sich, dass ein grosser Teil des Handling-Gewinns nicht aus der IRS kam, sondern aus der um 1" tiefer gelegten UCA-Anlenkung. Shelby American uebernahm das in die fruehen GT350.

### Einbaudetail mit Alignment-Folge

> "on 64-66 Mustangs, you must **remove 1/8" of spacers** to approximately compensate for the change in the upper arm angle."
> "**Wheel alignment will be required immediately** after performing this modification."

Das ist fuer die Shim-Dokumentation relevant: Ein Teil des heute verbauten Shim-Pakets ist moeglicherweise bereits die Drop-Kompensation und steht fuer Alignment nicht frei zur Verfuegung. Siehe [`CHAPTER_FRONT_ADJUSTMENT_UCA_LCA.md`](CHAPTER_FRONT_ADJUSTMENT_UCA_LCA.md) §2.7.

### Offen fuer dieses Fahrzeug

- exakte reale Bohrungsposition am Mustang erfassen - **nicht annehmen**, dass jedes als "Shelby Drop" bezeichnete Fahrzeug exakt diese Geometrie hat
- vorhandene Schablone / Bohrung dokumentieren
- **Sonderfall SoT Tubular UCA:** Das Fahrzeug hat laut [`00_PROJECT.md`](00_PROJECT.md) §3 den `SOT-UCA65-66`. Dieser ist in zwei Varianten lieferbar - *Standard* (Drop muss gebohrt werden) und *Dropped* (Drop baulich im Cross Shaft eingearbeitet, kein Bohren). Bei der zweiten Variante sitzt der Drop **nicht in der Karosserie**, sondern im Bauteil. Welche Variante verbaut ist, bestimmt die reale Innenlagerposition und damit Roll Center und Camber Gain.
---

## 19. Ride Height und Bump/Droop Reserve

Eine statische Fahrzeughöhe ist nur sinnvoll, wenn ausreichend Federweg in beide Richtungen verbleibt.

Zu dokumentieren:

### Front
- statische Dämpferposition
- verfügbarer Bump Travel
- verfügbarer Droop Travel
- Abstand zum Bump Stop

### Rear
- statische Dämpferposition
- Blattfederbewegung
- Achse ↔ Karosserie
- Reifen ↔ Radhaus
- Panhard-Bewegung
- Dämpferweg

Ein Rennwagen, der statisch schön tief steht, aber regelmäßig auf dem Bump Stop fährt, besitzt effektiv eine stark veränderte Federkennlinie.

---

## 20. Bump Stop ist Teil der Federung

Ein Bump Stop darf nicht nur als Notanschlag betrachtet werden.

Wenn er im regulären Kurven- oder Bremsbetrieb berührt wird, steigt die effektive Federrate stark an.

Das verändert:

- Rollsteifigkeitsverteilung
- Radlasttransfer
- Grip
- Balance

Daher gehört der Abstand zum Bump Stop in die Ride-Height-Dokumentation.

---

## 21. Besonderheit Blattfeder hinten

Bei einer Blattfederachse beeinflussen sich:

- Fahrzeughöhe
- Federbogen
- Shackle-Winkel
- Achsposition
- Pinion Angle
- Blattfederreibung

gegenseitig.

Bei deinem Mustang ist außerdem bekannt, dass links eine Ride-Height-Abweichung von ungefähr 20 mm beobachtet wurde.

Diese Abweichung darf **nicht sofort mit einem Shim "korrigiert" werden**, bevor geklärt ist:

- entsteht sie durch Federbogen?
- unterschiedliche Federrate?
- Fahrzeugmasse?
- Shackle-Bind?
- Buchsen?
- Karosserie-/Chassistoleranz?
- Cross Weight?
- Panhard-Vorspannung?
- Montage?
- tatsächliche Messreferenz?

Das wird später als eigener Diagnosebaum aufgebaut.

---

## 22. Panhard Bar und Ride Height

Die Panhard Bar führt die Hinterachse lateral.

Bei Ein- und Ausfederung beschreibt sie einen Kreisbogen. Dadurch kann sich die Achse seitlich relativ zur Karosserie verschieben.

Relevant sind:

- Länge
- Winkel in statischer Lage
- Höhe der Anlenkpunkte
- statische Ride Height

Ändert sich die Ride Height, verändert sich auch der statische Panhard-Winkel.

Daher muss nach relevanten Ride-Height-Änderungen die Hinterachs-Seitposition erneut geprüft werden.

---

## 23. Ride Height und Alignment

Eine Änderung der Ride Height kann beeinflussen:

### Vorderachse
- Camber
- Toe
- Castor geringfügig je nach Geometrie
- Bump Steer
- Rollcenter

### Hinterachse
- Panhard-Winkel
- Seitposition
- Pinion Angle indirekt bei Blattfeder-/Shim-Änderungen

Daraus folgt:

> **Nach einer echten Ride-Height-Änderung muss Alignment erneut geprüft werden.**

---

## 24. Reihenfolge im Setup-Prozess

Ride Height ist weder ausschließlich "vor" noch ausschließlich "nach" Corner Weight.

Sie bilden einen Regelkreis.

### Initial

1. Race-Ready-Zustand
2. Setup Pad
3. initial Ride Height
4. initial Alignment
5. initial Scaling

### Adjustment

6. gewünschte Ride-Height-/Balance-Änderung
7. setzen
8. Scaling
9. Ride Height erneut messen
10. Alignment erneut prüfen
11. erneut Scaling

### Final

12. final Ride Height
13. final Alignment
14. final Scaling
15. dokumentieren

---

## 25. Praktischer Aufbau für unseren Mustang

### Phase A - Werkstatt markieren

Dauerhafte Bodenmarkierungen für:

- LF
- RF
- LR
- RR
- Radstand
- Spurweite

### Phase B - gemeinsame Ebene herstellen

- vier Padpositionen vermessen
- harte Shims/Leveling-Trays
- jedes Paket beschriften
- Ergebnis protokollieren

### Phase C - Messhardware

Vorne je nach Arbeit:

- CG/6 Turnplates
- Longacre Scales
- Turnplate + Scale-Kombination, falls geometrisch korrekt machbar

Hinten:

- Pads gleicher effektiver Höhe
- bei Scaling Waagenpads
- möglichst Slip-Möglichkeit

### Phase D - feste Chassispunkte wählen

Vier Messpunkte:
- Front L
- Front R
- Rear L
- Rear R

Fotos + Maße dokumentieren.

---

## 26. Messprotokoll Ride Height

```text
Datum:
Setup-Pad-Version:
Reifen:
Druck:
Fahrer/Ballast:
Kraftstoff:

Messpunktdefinition:
FL:
FR:
RL:
RR:

Chassis-to-ground:
FL:
FR:
RL:
RR:

Optional Chassis-to-wheel-center:
FL:
FR:
RL:
RR:

Front L-R Differenz:
Rear L-R Differenz:
Rake links:
Rake rechts:

Bump Travel:
FL:
FR:
RL:
RR:

Droop Travel:
FL:
FR:
RL:
RR:

Bump Stop Clearance:
FL:
FR:
RL:
RR:

Bemerkungen:
```

---

## 27. Reproduzierbarkeitsprüfung

Bevor eine Differenz von z. B. 2-3 mm interpretiert wird:

1. einmal messen
2. Fahrzeug anheben
3. wieder absetzen
4. setzen / rollen
5. erneut messen

Nur eine Differenz, die reproduzierbar wiederkehrt, wird als real behandelt.

Das ist besonders beim Mustang mit:

- Blattfedern
- Buchsenreibung
- klassischen Gelenken

wichtig.

---

## 28. Was NICHT als Ride-Height-Zielwert übernommen wird

Bis das konkrete Fahrzeug vermessen ist, werden keine pauschalen Internetwerte wie:

- "Radlauf X mm"
- "Front 1 inch tiefer"
- "Mustang muss Y Zoll hoch stehen"

als Ziel übernommen.

Warum?

Weil diese Werte abhängig sind von:

- Reifen
- Felge
- Federn
- Gewicht
- Motor
- Karosserietoleranz
- Shelby Drop
- Fahrwerksteilen
- Einsatz

Unsere Zielhöhe wird aus **Geometrie, Federweg und Track-Funktion** bestimmt.

---

## 29. Quellenbasis

### Longacre - Laser Chassis Height Checker
Beschreibt:
- Pad einzeln nivellieren
- gemeinsame Laser-Höhenreferenz
- Laserstand nicht verschieben
- alle Pads auf gleiche Höhe bringen
- Bodenpositionen markieren
- Ground Plane zur Ride-Height-Messung

https://longacreracing.com/pages/laser-chassis-height-checker-52-72981-52-72983-52-72985

### Longacre - Easy-to-Use Chassis Height Gauge
Beschreibt:
- Ride Height als kritische Setup-Größe
- Messung direkt auf Boden oder Scale Pads
- reproduzierbare Chassishöhenmessung

https://longacreracing.com/pages/easy-to-use-chassis-height-gauge

### Longacre - Why Should I Scale My Car?
Beschreibt:
- vier reproduzierbare Bodenpositionen
- Leveling-Trays/Shims
- gleiche Ebene der Pads
- diagonale Fehler wirken stark auf Cross Weight
- Markierung der Werkstattpositionen

https://longacreracing.com/pages/why-should-i-scale-my-car

### Longacre - Bind Free Chassis Setups
Beschreibt:
- Camber Bind beim Absenken
- Notwendigkeit seitlicher Entspannung
- Slip Plates / Side Sliders

https://longacreracing.com/pages/bind-free-chassis-setups

### Longacre - Set Toe Properly
Bestätigt:
- Race-ready Zustand
- Ride Height und Gewichtsprozente vor finalem Toe
- Bump Steer, Camber, Castor, Ackermann vor finaler Toe-Einstellung

https://longacreracing.com/pages/set-toe-properly

### Arning/Shelby Drop Diagram - 1965-66 Mustang
Dokumentiert die klassische Geometrie:
- 1" nach unten
- 1/8" nach hinten

https://mustangbarn.com/wp-content/uploads/2023/03/ArningShelby-Suspension-Drop.pdf

---

## 30. Offene Mustang-spezifische Forschungsfragen

- Welche vier Chassispunkte eignen sich am realen Auto am besten?
- Welche aktuelle Ride Height liegt dort vor?
- Ist die links/rechts bekannte 20-mm-Differenz am Chassis oder nur am Radlauf gemessen?
- Welche Frontfedern sind verbaut?
- Sind Frontfedern identisch und wie alt?
- Welche Rear Leaf Springs genau?
- Shackle-Geometrie links/rechts?
- Panhard-Winkel in Race-Ready-Lage?
- Bump-Stop-Abstände?
- Dämpferlängen statisch?
- effektiver Bump/Droop Travel?
- existiert ein Front-Stabilisator und sind die Endlinks einstellbar?
- welche Ride-Height-Verstellung ist derzeit konstruktiv möglich?

---

## 31. Erstes reales Ride-Height-Programm

Noch nichts einstellen.

### Messung 1 - Referenzfläche
- Pad-Ebene herstellen
- dokumentieren

### Messung 2 - Race Ready
- definierter Druck
- Fahrer/Ballast
- definierter Fuel

### Messung 3 - Chassis
- vier feste Chassishöhen

### Messung 4 - Federweg
- Bump Stop Clearance
- statische Dämpferposition soweit messbar

### Messung 5 - Wiederholung
- Fahrzeug anheben
- setzen
- erneut messen

### Messung 6 - Radlasten
- LF/RF/LR/RR
- Cross
- Zusammenhang mit der vorhandenen Links-Rechts-Höhendifferenz analysieren

Erst danach wird entschieden, ob überhaupt eine Ride-Height-Korrektur erforderlich ist und wie sie technisch sinnvoll erfolgt.

---

## 32. Definition of Done

- [x] Level und Coplanar getrennt
- [x] Setup-Pad-Prinzip definiert
- [x] Slip/Bind berücksichtigt
- [x] Chassis- statt Radlaufreferenz begründet
- [x] Race-Ready-Verknüpfung hergestellt
- [x] Ride Height ↔ Corner Weight erklärt
- [x] Ride Height ↔ Alignment erklärt
- [x] Shelby Drop korrekt als Geometrieänderung eingeordnet
- [x] Blattfeder/Panhard berücksichtigt
- [x] Longacre-Messprinzip integriert
- [ ] reale Chassispunkte festgelegt
- [ ] reale Höhenwerte aufgenommen
- [ ] Bump/Droop gemessen
- [ ] Panhard-Geometrie vermessen
- [ ] Links-Rechts-Differenz diagnostiziert