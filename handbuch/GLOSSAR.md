# Mustang Track Chassis Setup — Glossar

**Dokumentrolle:** Begriffsnachschlagewerk — einzige Quelle für Definitionen
**Version:** 0.1
**Datum:** 2026-10-05
**Status:** Wird fortlaufend ergänzt

---

## Pflegeregel

> **Ein Begriff, eine Definition, ein Ort.**
>
> Neue Fachbegriffe werden **hier** eingetragen, nicht in den Fachkapiteln erklärt. Kapitel dürfen einen Begriff anwenden und vertiefen — die Definition steht hier.
>
> **Wann ergänzen:** Sobald ein Kapitel einen Begriff verwendet, der hier fehlt. Das gilt auch rückwirkend bei Überarbeitungen.
>
> **Warum:** Dieselbe Begründung wie bei `CONVENTIONS.md`. Steht eine Definition an zwei Stellen, laufen die Fassungen auseinander — das Schwesterprojekt `jerico-dog-box-assembly-manual` hatte das Glossar vier Mal im Markup und die Kopien widersprachen sich bereits, bevor es auffiel.

**Schema je Eintrag:**

| Feld | Zweck |
|---|---|
| **Was ist das?** | sachliche Definition |
| **Einfach gesagt** | Alltagsbild, wenn es hilft |
| **Warum wichtig?** | Konsequenz fürs Setup |
| **Am Mustang** | fahrzeugspezifisch |
| **Vorzeichen** | Konvention, falls relevant |
| **⚠ Achtung** | häufiger Irrtum oder Gefahr |
| **Verwandt** | Querverweise |
| **Vertieft in** | Kapitelverweis |

Vorzeichen und Formeln sind **verbindlich** in [`CONVENTIONS.md`](CONVENTIONS.md) geregelt. Dieses Glossar wiederholt sie nur erklärend.

---

## 1. Radstellung und Lenkgeometrie

### Camber (Sturz)

**Was ist das?** Die Neigung des Rades in der Vorderansicht, gemessen gegen die Senkrechte.

**Vorzeichen:** Rad oben nach innen → **negativ**. Rad oben nach außen → **positiv**. ([`CONVENTIONS.md`](CONVENTIONS.md) §4)

**Warum wichtig?** Bestimmt, wie flächig der Reifen in der Kurve aufliegt. Bei Kurvenfahrt rollt die Karosserie und der Reifen verformt sich — negativer statischer Camber gleicht das teilweise aus.

**⚠ Achtung:** Mehr negativer Camber ist **nicht** automatisch mehr Grip. In Geradeausfahrt — also beim Bremsen — trägt dann nur noch die Innenkante.

**Verwandt:** Camber Gain, Camber Thrust, Included Angle
**Vertieft in:** [`CHAPTER_FRONT_GEOMETRY_CAMBER_CASTER_KPI.md`](CHAPTER_FRONT_GEOMETRY_CAMBER_CASTER_KPI.md), [`CHAPTER_TIRE_MECHANICS.md`](CHAPTER_TIRE_MECHANICS.md) §4

---

### Camber Gain

**Was ist das?** Die Änderung des Cambers über den Federweg.

**Warum wichtig?** Der statische Camber ist nur der Ausgangswert. Was in der Kurve zählt, ist der Camber **im belasteten Zustand** — und der ergibt sich aus Camber Gain minus Rollwinkel plus Castor-Effekt minus Reifenverformung.

**Am Mustang:** Der Shelby Drop erhöht den Camber Gain gezielt. Ein Fahrzeug mit hohem Camber Gain braucht **weniger** statischen Camber.

**⚠ Achtung:** Erhöhter Camber Gain bedeutet auch **mehr seitliche Radbewegung** beim Ein- und Ausfedern — das verstärkt Camber-Bind beim Wiegen.

**Verwandt:** Camber, Bind, Shelby Drop
**Vertieft in:** [`CHAPTER_BIND_DIAGNOSIS.md`](CHAPTER_BIND_DIAGNOSIS.md) §3

---

### Camber Thrust

**Was ist das?** Eine Seitenkraft, die ein geneigter Reifen **auch ohne Schräglauf** erzeugt — er will auf einem Kegelmantel rollen.

**Warum wichtig?** Trägt zum Ansprechverhalten beim Einlenken bei. Deutlich schwächer als die Schräglaufkraft, aber im linearen Bereich spürbar.

**Verwandt:** Slip Angle, Camber
**Vertieft in:** [`CHAPTER_TIRE_MECHANICS.md`](CHAPTER_TIRE_MECHANICS.md) §4.1

---

### Castor / Caster (Nachlauf)

**Was ist das?** Die Neigung der Lenkachse in der Seitenansicht — die gedachte Linie durch oberes und unteres Kugelgelenk.

**Vorzeichen:** Lenkachse oben nach hinten geneigt → **positiv**. ([`CONVENTIONS.md`](CONVENTIONS.md) §5)

**Warum wichtig?** Positiver Castor erzeugt Geradeauslaufstabilität und Rückstellmoment. Außerdem: **beim Lenken entsteht dynamischer Camber** — das kurvenäußere Rad bekommt zusätzlichen negativen Camber.

**Am Mustang:** Verstellbar über UCA-Shims (gegenläufig), Strut Rods und — falls SoT Tubular UCA — über die Heim-Gelenke. Ford: **1/32" Shim ≈ 1/2° Castor**.

**⚠ Achtung:** Bei **manueller Lenkung** erhöht viel Castor die Lenkkräfte spürbar. Und: Castor über kürzere Strut Rods zieht das Rad nach vorn — Freigängigkeit prüfen.

**Schreibweise:** Dieses Projekt schreibt „Castor" (britisch). In US-Quellen und auf Messgeräten steht „Caster".

**Verwandt:** KPI, Strut Rod, Scrub Radius
**Vertieft in:** [`CHAPTER_FRONT_ADJUSTMENT_UCA_LCA.md`](CHAPTER_FRONT_ADJUSTMENT_UCA_LCA.md) §2.2

---

### KPI / SAI (Lenkachsenneigung)

**Was ist das?** *King Pin Inclination* bzw. *Steering Axis Inclination* — die Neigung der Lenkachse in der **Vorderansicht**.

**Warum wichtig?** Primär eine **Diagnosegröße**, kein Setup-Regler. Auffällige Links-/Rechts-Differenzen deuten auf verbogene Spindel, falsches Kugelgelenk, verzogenen Querlenker oder Unfallschaden hin.

**⚠ Achtung:** KPI lässt sich nicht einstellen. Wer einen abweichenden Wert „korrigieren" will, sucht an der falschen Stelle.

**Verwandt:** Included Angle, Camber, Scrub Radius
**Vertieft in:** [`CHAPTER_FRONT_GEOMETRY_CAMBER_CASTER_KPI.md`](CHAPTER_FRONT_GEOMETRY_CAMBER_CASTER_KPI.md) §6

---

### Included Angle

**Was ist das?** Die Summe aus Camber und KPI — der Winkel zwischen Radebene und Lenkachse.

**Warum wichtig?** Diagnostisch: Eine Camberabweichung bei **unverändertem** Included Angle deutet auf die Chassisaufnahme. Eine Abweichung **mit** verändertem Included Angle deutet auf Spindel oder Radträger.

**⚠ Offen:** Die projektweite Vorzeichen- und Rechenkonvention ist noch nicht festgelegt ([`CONVENTIONS.md`](CONVENTIONS.md) §22).

**Verwandt:** KPI, Camber

---

### Toe (Spur)

**Was ist das?** Die Stellung der Räder in der Draufsicht — zeigen die Vorderkanten zueinander oder voneinander weg.

**Vorzeichen:** `Total Toe = R − F`. Positiv → **Toe-in**, negativ → **Toe-out**. ([`CONVENTIONS.md`](CONVENTIONS.md) §7)

**Warum wichtig?** Erzeugt bereits in Geradeausfahrt Schräglauf an beiden Vorderrädern — die Seitenkräfte heben sich auf. Kostet Rollwiderstand und Temperatur, bringt aber Ansprechverhalten.

**⚠ Achtung:** Toe wird **zuletzt** eingestellt. Ford: *„Toe-in should only be checked and adjusted after the caster and camber have been adjusted."* Longacre verlangt zusätzlich Ride Height, Radlasten, Bump Steer und Ackermann vorher.

**Verwandt:** Total Toe, Individual Toe, Bump Steer, Ackermann
**Vertieft in:** [`CHAPTER_TOE_ACKERMANN_THRUST.md`](CHAPTER_TOE_ACKERMANN_THRUST.md)

---

### Total Toe vs. Individual Toe

**Was ist das?** **Total Toe** ist die Summe beider Vorderräder. **Individual Toe** ist der Wert je Rad gegen die Fahrzeugmittellinie.

**⚠ Achtung:** Toe Plates messen nur **Total Toe**. Ein korrekter Gesamtwert kann aus LF = 0 und RF = voller Wert bestehen — das Lenkrad steht dann schief und der Fahrzeugbezug stimmt nicht. Für Individual Toe braucht es **String Alignment**.

**Verwandt:** Toe Plate, Scribe Line, Thrust Angle

---

### Ackermann

**Was ist das?** Die Eigenschaft der Lenkgeometrie, dem kurveninneren Rad einen **größeren** Lenkwinkel zu geben als dem äußeren — weil es einen engeren Radius fährt.

**Warum wichtig?** Bestimmt, ob beide Vorderräder gleichzeitig in ihrem optimalen Schräglaufbereich arbeiten.

**⚠ Achtung:** „100 % geometrisches Ackermann" ist **nicht** automatisch optimal — die ideale Kreisgeometrie berücksichtigt keine Schräglaufwinkel. Und: Ackermann ist **nicht einstellbar**. Ford: *„The turning angle cannot be adjusted directly … check the spindle or other suspension parts for a bent condition."* Es ist ein Diagnoseergebnis.

**Verwandt:** Toe-out-on-turns, Slip Angle
**Vertieft in:** [`CHAPTER_TOE_ACKERMANN_THRUST.md`](CHAPTER_TOE_ACKERMANN_THRUST.md) §14

---

### Scrub Radius (Lenkrollhalbmesser)

**Was ist das?** Der Abstand zwischen dem Durchstoßpunkt der Lenkachse am Boden und der Radaufstandsmitte.

**Warum wichtig?** Bestimmt gemeinsam mit Castor die Lenkkraft und das Rückmeldeverhalten. Bei **manueller Lenkung** und breiteren Rädern als Serie keine akademische Größe.

**⚠ Offen:** Für dieses Fahrzeug nicht erfasst. Der Radversatz (Offset) der 15×7-Felgen geht direkt ein.

**Verwandt:** KPI, Castor

---

## 2. Fahrzeuglage

### Ride Height

**Was ist das?** Die Höhe eines definierten Chassispunkts über dem Boden.

**⚠ Achtung:** Ein Wert ohne benannten Messpunkt ist **keine** Ride-Height-Angabe. Mindestens anzugeben: Radposition, Messpunkt, Referenz (Boden oder Radmitte), Race-Ready-Zustand, Reifendruck, Setup-Pad-Version. ([`CONVENTIONS.md`](CONVENTIONS.md) §12)

**Warum wichtig?** Geometrische Randbedingung des gesamten Fahrwerks — verändert Rollzentren, Camber, Toe, Panhard-Lage und Radlasten.

**Verwandt:** Rake, Curb Height, Roll Center
**Vertieft in:** [`CHAPTER_SETUP_PAD_RIDE_HEIGHT.md`](CHAPTER_SETUP_PAD_RIDE_HEIGHT.md)

---

### Rake

**Was ist das?** Der Höhenunterschied zwischen Vorder- und Hinterwagen — die Längsneigung des Fahrzeugs.

**⚠ Offen:** Vorzeichenkonvention noch nicht festgelegt ([`CONVENTIONS.md`](CONVENTIONS.md) §22). Bis dahin sprachlich angeben: „Front 8 mm tiefer als Rear".

---

### Curb Height

**Was ist das?** Fords Referenzzustand für Alignment-Messungen.

**⚠ Achtung — wichtig für Quellenvergleiche:** Ford misst mit **eingesetzten Abstandshaltern** (Werkzeug T65P-3000) zwischen oberem Querlenker und Federdom, nicht im normalen Fahrzustand. Werksangaben sind deshalb **nicht direkt vergleichbar** mit einer Messung im Race-Ready-Zustand.

**Verwandt:** Ride Height, Race-Ready

---

### Race-Ready

**Was ist das?** Der definierte, reproduzierbare Zustand, in dem alle vergleichbaren Messungen stattfinden: Fahrer oder Ballast, definierter Kraftstoffstand, alle Betriebsflüssigkeiten, gleicher Rad-/Reifensatz, definierter Reifendruck, kein loses Material.

**Warum wichtig?** Ein Setup-Wert ohne dokumentierten Race-Ready-Zustand ist nur bedingt vergleichbar.

**Vertieft in:** [`02_WORKFLOW.md`](02_WORKFLOW.md) §6

---

### Bump / Droop

**Was ist das?** **Bump** = Einfedern (Rad bewegt sich zum Chassis). **Droop** = Ausfedern.

**Vorzeichen:** Positiver Federweg = Bump, negativer = Droop, Null = Race-Ready Ride Height. ([`CONVENTIONS.md`](CONVENTIONS.md) §10)

---

### Bump Stop

**Was ist das?** Der elastische Anschlag am Ende des Einfederwegs.

**⚠ Achtung:** Kein reiner Notanschlag. Wird er im normalen Kurven- oder Bremsbetrieb berührt, steigt die effektive Federrate stark an — das verändert Rollsteifigkeitsverteilung und Balance. Der Abstand gehört deshalb in die Ride-Height-Dokumentation.

**Verwandt:** Droop, Rollsteifigkeit

---

## 3. Radlasten und Balance

### Corner Weight

**Was ist das?** Die statische Vertikallast eines einzelnen Rades.

**Verwandt:** Cross Weight, Mass Distribution
**Vertieft in:** [`CHAPTER_BALANCE_CORNER_WEIGHT.md`](CHAPTER_BALANCE_CORNER_WEIGHT.md)

---

### Cross Weight (Wedge)

**Was ist das?** Die diagonale Lastverteilung. Projektformel: `Cross % = (RF + LR) / Total × 100` ([`CONVENTIONS.md`](CONVENTIONS.md) §11)

**Einfach gesagt:** Wie viel Last steht auf der Diagonale rechts-vorn / links-hinten.

**⚠ Achtung:** 50 % ist ein **symmetrischer Ausgangspunkt**, kein Naturgesetz. Auf einem symmetrischen Rundkurs verbessert eine Cross-Verstellung die eine Kurvenrichtung genau so weit, wie sie die andere verschlechtert. Oval-Regeln wie „mehr Cross = tight" werden hier **nicht** übernommen.

**Verwandt:** Corner Weight, Load Sensitivity

---

### Mass Distribution

**Was ist das?** Wo sich die reale Masse im Fahrzeug befindet — Front/Rear und Left/Right in Prozent.

**⚠ Achtung — häufige Verwechslung:** Mass Distribution ist **nicht** Cross Weight. Ein Fahrzeug kann 57 % Frontgewicht haben und trotzdem exakt 50 % Cross. Longacre: *„To make changes to **Left side or Rear percentages** you will need to **move lead or other mass** within the car."* Federverstellung reicht dafür nicht.

**Verwandt:** Cross Weight, Corner Weight

---

### Load Sensitivity

**Was ist das?** Die übertragbare Seitenkraft eines Reifens steigt mit der Radlast, aber **degressiv** — der effektive Reibbeiwert sinkt mit steigender Last.

**Warum wichtig?** **Das ist die physikalische Begründung für die gesamte Balance-Logik.** Zwei Räder mit je 500 kg liefern mehr Seitenkraft als eines mit 400 und eines mit 600. Deshalb kostet Lasttransfer immer Grip — und deshalb verliert die steifere Achse anteilig mehr.

**Verwandt:** Rollsteifigkeit, TLLTD, Cross Weight
**Vertieft in:** [`CHAPTER_TIRE_MECHANICS.md`](CHAPTER_TIRE_MECHANICS.md) §3

---

### TLLTD

**Was ist das?** *Total Lateral Load Transfer Distribution* — der Anteil der Vorderachse am gesamten Rollwiderstand.
`TLLTD = K_vorn / (K_vorn + K_hinten)`

**Warum wichtig?** **Die primäre Balance-Stellgröße.** Steigt der Wert → mehr Untersteuern. Sinkt er → mehr Übersteuern.

**Verwandt:** Rollsteifigkeit, Load Sensitivity
**Vertieft in:** [`CHAPTER_SPRINGS_ROLL_STIFFNESS.md`](CHAPTER_SPRINGS_ROLL_STIFFNESS.md) §3.4

---

### Settling

**Was ist das?** Die reproduzierbare Prozedur, mit der das Fahrwerk nach jeder Änderung in seine natürliche Lage gebracht wird — typisch: zurückrollen, vorwärts in Messposition rollen, leicht setzen.

**Warum wichtig?** Ohne identische Settling-Prozedur sind zwei Messungen nicht vergleichbar.

**Verwandt:** Bind, Hysterese
**Vertieft in:** [`02_WORKFLOW.md`](02_WORKFLOW.md) §17

---

## 4. Federung und Rollsteifigkeit

### Motion Ratio

**Was ist das?** Das Verhältnis Federweg zu Radweg. `MR = Δ_Feder / Δ_Rad`

**Warum wichtig?** Die Feder sitzt beim Mustang **nicht am Rad**, sondern auf dem unteren Querlenker. Die Radrate ergibt sich aus `k_Rad = k_Feder · MR²` — **das Quadrat ist entscheidend**. MR = 0,5 bedeutet nicht halbe, sondern **ein Viertel** der Federrate am Rad.

**⚠ Offen:** Für dieses Fahrzeug nicht gemessen. Ohne diesen Wert ist keine Rollsteifigkeit berechenbar.

**Verwandt:** Rollsteifigkeit, Federrate
**Vertieft in:** [`CHAPTER_SPRINGS_ROLL_STIFFNESS.md`](CHAPTER_SPRINGS_ROLL_STIFFNESS.md) §3.1

---

### Rollsteifigkeit

**Was ist das?** Der Widerstand einer Achse gegen Karosserierollen, zusammengesetzt aus Feder- und Stabilisatoranteil.
`K_roll,Feder = (k_Rad · t²) / 2`

**Warum wichtig?** Nicht das Niveau, sondern die **Verteilung** vorn/hinten bestimmt die Balance.

**⚠ Achtung:** Hinten geht die **Federbasis** ein, nicht die Spurweite — und auch sie quadratisch.

**Verwandt:** TLLTD, Motion Ratio, Federbasis, ARB

---

### Federbasis

**Was ist das?** Der Abstand der beiden Federn einer Achse, gemessen zwischen ihren Mitten.

**Warum wichtig?** Bestimmt die Rollsteifigkeit — **quadratisch**. Bei einer Blattfederachse ist die Federbasis deutlich schmaler als die Spurweite, die Rollsteifigkeit entsprechend geringer als die Federrate vermuten lässt.

**⚠ Offen:** Für dieses Fahrzeug nicht gemessen.

**Verwandt:** Rollsteifigkeit, Blattfeder

---

### ARB / Sway Bar / Stabilisator

**Was ist das?** Ein Torsionsstab, der beide Räder einer Achse verbindet und **nur bei gegensinnigem Federn** wirkt.

**Warum wichtig?** Erhöht die Rollsteifigkeit, **ohne** die Federrate für senkrechte Fahrbahnanregung zu verändern. Deshalb das bevorzugte Balance-Werkzeug.

**Am Mustang:** Vorn 1" (25,4 mm) verbaut. Die Torsionssteifigkeit geht mit der **vierten Potenz** des Durchmessers — von 1" auf 1-1/8" sind das +60 %.

**⚠ Achtung:** Beim Wiegen muss der ARB **gelöst oder nachweislich spannungsfrei** sein, sonst verfälscht er die Radlasten.

**Begriffe:** *Sway bar* (US-Handel), *Stabilizer bar* (Ford-Werk), *Anti-roll bar / ARB* (technisch). Dieses Projekt verwendet **ARB**.

**Verwandt:** Rollsteifigkeit, TLLTD, Bind

---

### Blattfeder (Leaf Spring)

**Was ist das?** Gefederte Stahllagen, die beim Mustang gleichzeitig tragen, führen und gegen Rollen stützen.

**⚠ Achtung — zentrale Besonderheit:** Tragrate und Rollsteifigkeit lassen sich **nicht unabhängig** ändern. Wer hinten härtere Federn einbaut, verschiebt zwangsläufig die Balance Richtung Übersteuern.

**Am Mustang:** 4,5 Lagen Mid-Eye, 175 lb/in je Feder (Street or Track).

**Verwandt:** Federbasis, Mid-Eye, Axle Wrap, Shackle

---

### Mid-Eye / Reverse Eye / Standard Eye

**Was ist das?** Die Lage des vorderen Federauges relativ zum Hauptblatt.

**Am Mustang:** Die Mid-Eye-Feder legt das Heck laut Hersteller um **ca. 1" tiefer** als Serie — relevant für alle Ride-Height-Vergleiche mit Altwerten.

**Verwandt:** Blattfeder, Ride Height

---

### Shackle (Federlasche)

**Was ist das?** Die bewegliche Lasche am hinteren Federauge, die den Längenausgleich beim Einfedern erlaubt.

**⚠ Achtung:** Die Blattfeder muss sich hier **auch seitlich** bewegen können. MMI: *„Replacing the bushing with a solid material prevents the spring from moving side to side, increasing bind."* Bei vorhandener Panhard Bar ist das besonders kritisch.

**Verwandt:** Bind, Panhard Bar, Delrin

---

### Delrin

**Was ist das?** Ein steifes technisches Kunststoff-Lagermaterial (POM), verwendet für spielarme Fahrwerksbuchsen.

**⚠ Achtung:** Steifer ist nicht immer besser. Am **hinteren Shackle** verhindert Delrin die nötige laterale Federbewegung — in Kombination mit einer Panhard Bar entsteht Überbestimmung.

**Verwandt:** Shackle, Bind, Panhard Bar
**Vertieft in:** [`DECISION_LEAF_SPRINGS.md`](DECISION_LEAF_SPRINGS.md)

---

## 5. Hinterachse und Antriebsstrang

### Panhard Bar

**Was ist das?** Eine Querstange zwischen Achse und Chassis, die die **laterale Position** der Starrachse festlegt.

**⚠ Achtung:** Der Panhard **definiert** die Querposition — er zentriert nur, wenn seine Länge stimmt. Er kann eine in Draufsicht **schief stehende** Achse nicht richten. Reihenfolge: erst Achse rechtwinklig, dann Panhard auf Mitte.

**Warum wichtig?** Die Höhe der Anlenkpunkte entspricht näherungsweise dem hinteren Rollzentrum — damit ist der Panhard eine direkte Balance-Stellgröße.

**Verwandt:** Thrust Angle, Roll Center, Bind
**Vertieft in:** [`CHAPTER_REAR_SUSPENSION_PANHARD_PINION.md`](CHAPTER_REAR_SUSPENSION_PANHARD_PINION.md) §6–10

---

### Thrust Angle

**Was ist das?** Die Gierlage der Hinterachse relativ zur Fahrzeugmittellinie — steht die Achse in der Draufsicht schräg.

**⚠ Achtung — drei Größen auseinanderhalten:**

| Größe | Was |
|---|---|
| **Panhard Offset** | Achse zu weit links/rechts |
| **Thrust Angle** | Achse in Draufsicht schräg |
| **Pinion Angle** | Driveline-Geometrie in Seitenansicht |

**⚠ Offen:** Vorzeichenkonvention noch nicht festgelegt ([`CONVENTIONS.md`](CONVENTIONS.md) §22).

**Verwandt:** Panhard Offset, Pinion Angle

---

### Pinion Angle

**Was ist das?** Die Neigung der Antriebswelle am Differentialeingang, in der Seitenansicht.

**⚠ Achtung:** „Pinion 2° down" allein ist **keine** vollständige Driveline-Beschreibung. Nötig sind Transmission Slope, Driveshaft Slope und Pinion Slope — daraus ergeben sich die U-Joint Operating Angles.

**Verwandt:** Operating Angle, Wedge, Axle Wrap

---

### Operating Angle (U-Joint)

**Was ist das?** Der Winkel zwischen zwei benachbarten rotierenden Wellen an einem Kreuzgelenk.

**Spicer-Regeln:** mindestens **0,5°**, beide Gelenke innerhalb **1°** voneinander, für vibrationsfreien Betrieb **≤ 3°**. Die Maximalwerte sind zusätzlich **drehzahlabhängig** (bei 5000 rpm nur noch 3,2°).

**⚠ Achtung:** Exakt 0° ist **nicht** ideal — die Nadellager brauchen eine kleine Bewegung. TREMEC: *„Results of '0.0' throughout the driveline are also considered out-of-spec."* Und: „equal and opposite" — nicht nur die Beträge zählen, auch die Richtungen.

**Vorzeichen:** Slope von vorn nach hinten. **UP** = steigt, **DOWN** = fällt. ([`CONVENTIONS.md`](CONVENTIONS.md) §14)

**Verwandt:** Pinion Angle, Wedge

---

### Axle Wrap / Pinion Rise

**Was ist das?** Unter Antriebsmoment versucht sich das Differentialgehäuse entgegen der Achswellendrehung zu drehen und verwindet dabei die Blattfeder.

**Warum wichtig?** Verändert die U-Joint-Winkel unter Last, kann Wheel Hop auslösen.

**⚠ Achtung:** Ein statischer Wedge darf **nicht** aus einer pauschalen Regel bestimmt werden. MMI nennt für ihre Federn ca. 2° reduzierten Anstieg — das gilt **für deren Federn**, nicht allgemein.

**Verwandt:** Wedge, Pinion Angle, Blattfeder

---

### Wedge Shim vs. Flat Shim

**Was ist das?** **Flat Shim** = planparallel, ändert primär die Ride Height. **Wedge Shim** = keilförmig, verdreht das Achsgehäuse relativ zur Blattfeder und ändert damit den Pinion Angle.

**⚠ Achtung:** Keine austauschbaren Lösungen. Ein Wedge ist **kein** Ride-Height-Shim.

**Verwandt:** Pinion Angle, Axle Wrap

---

## 6. Reifen

### Slip Angle (Schräglaufwinkel)

**Was ist das?** Der Winkel zwischen der Rollrichtung des Rades und seiner tatsächlichen Bewegungsrichtung.

**Einfach gesagt:** Das Rad zeigt leicht weiter nach innen, als es tatsächlich fährt — und erzeugt daraus die Seitenkraft.

**Warum wichtig?** **Ohne Schräglauf keine Seitenkraft.** Jedes Rad in einer Kurve hat Schräglauf.

**⚠ Achtung:** Die Seitenkraft hat ein **Maximum**. Jenseits davon bringt mehr Lenkwinkel **weniger** Kurvenkraft — und der Reifen wird heiß, weil der Gleitanteil im Latsch steigt.

**Verwandt:** Load Sensitivity, Toe, Ackermann
**Vertieft in:** [`CHAPTER_TIRE_MECHANICS.md`](CHAPTER_TIRE_MECHANICS.md) §2

---

### Contact Patch (Latsch)

**Was ist das?** Die Aufstandsfläche eines Reifens — etwa handflächengroß.

**Näherung:** `Fläche ≈ Radlast / Reifendruck`. Der Druck trägt die Last, nicht die Karkasse.

**Verwandt:** Reifendruck, Camber, Slip Angle

---

### Compliance Steer

**Was ist das?** Ungewollte Lenkbewegung durch elastische Verformung von Buchsen und Bauteilen unter Last.

**Verwandt:** Bump Steer, Delrin, Bind

---

## 7. Messen und Werkzeug

### Bind (Fahrwerksbindung)

**Was ist das?** Eine Verspannung, die verhindert, dass sich die Aufhängung in ihre kräftefreie Lage setzt.

**Drei Formen:** Reibungsbind (Dämpfer, Buchsen), Camber-Bind (Rad kann beim Absetzen nicht seitlich wandern), **Überbestimmung** (zwei Bauteile legen denselben Freiheitsgrad fest).

**⚠ Achtung:** Bind erzeugt keine Fehlermeldung. Erst die Wiederholungsmessung verrät ihn. Wer bei vorhandenem Bind Setup-Arbeit macht, optimiert gegen ein Rauschen.

**Verwandt:** Hysterese, Settling, Slip Plate
**Vertieft in:** [`CHAPTER_BIND_DIAGNOSIS.md`](CHAPTER_BIND_DIAGNOSIS.md)

---

### Hysterese

**Was ist das?** Die Differenz der Fahrzeuglage, je nachdem ob sie von oben oder von unten angefahren wurde.

**Warum wichtig?** Zeigt die Reibung im System. Bei Blattfedern bauartbedingt normal — aber sie sollte links und rechts ähnlich sein.

**Verwandt:** Bind, Settling, Blattfeder

---

### Coplanar vs. Level

**Was ist das?** **Level** = horizontal. **Coplanar** = alle vier Auflageflächen in einer gemeinsamen Ebene.

**⚠ Achtung:** Eine gleichmäßige Neigung aller vier Pads ist **wesentlich weniger kritisch** als ein einzelnes Pad außerhalb der Ebene. Ein zu hohes Einzelpad erzeugt falsches Cross Weight.

**Verwandt:** Setup Pad, Cross Weight

---

### Slip Plate / Rollenplatte

**Was ist das?** Platten unter den Rädern, die seitliche Bewegung beim Absetzen erlauben.

**Warum wichtig?** Gegen Camber-Bind. Longacre: Slip Plates sind *„low friction, **not** friction free"* — Rollenplatten beseitigen die Restreibung. Eine unter **einem** Vorderrad genügt, plus höhengleiche Platten an den anderen Ecken.

**Verwandt:** Bind, Setup Pad

---

### Toe Plate

**Was ist das?** Anlegeplatten an den Reifenflanken zur Messung der Gesamtspur.

**⚠ Achtung:** Messen **nur Total Toe**, nicht Individual Toe. Empfindlich gegen Felgen- und Reifenschlag — genauer ist eine angerissene Referenzlinie (Scribe Line).

**Verwandt:** Total Toe, Scribe Line, String Alignment

---

### Scribe Line (angerissener Reifen)

**Was ist das?** Eine umlaufende Linie auf der Reifenflanke, erzeugt durch Anreißen bei drehendem Rad.

**Warum wichtig?** Beschreibt die **reale Rotationsebene** und eliminiert damit Fehler durch Seitenwandwobble oder Felgenschlag.

**Verwandt:** Toe Plate, Total Toe

---

### Shim (Beilagscheibe)

**Was ist das?** Dünne Blechscheiben zwischen UCA-Querachse und Karosserie — die serienmäßigen Alignment-Einsteller der Vorderachse.

**Ford-Größenordnungen:** 1/32" an **einem** Bolzen ≈ 1/2° Castor. 1/16" an **beiden** ≈ 1/3° Camber. Grenzen: max. 1/16" Differenz, max. 9/16" Gesamtpaket je Bolzen.

**⚠ Achtung:** **Gegenläufig** verstellen (vorn +, hinten −) = reiner Castor. **Gleichsinnig** = reiner Camber. Nur einseitig = beides gekoppelt.

**Verwandt:** Castor, Camber, Shelby Drop
**Vertieft in:** [`CHAPTER_FRONT_ADJUSTMENT_UCA_LCA.md`](CHAPTER_FRONT_ADJUSTMENT_UCA_LCA.md) §2

---

## 8. Fahrzeugspezifisches

### Shelby Drop / Arning Drop

**Was ist das?** Die Verlegung der oberen Querlenker-Innenlager um **1" nach unten**, beim 64–66 zusätzlich **1/8" nach hinten**.

**⚠ Achtung — häufiger Irrtum:** Der Drop verbessert das Handling **nicht**, weil er das Auto tiefer legt. Er senkt es zwar um ca. 5/8" — aber die Wirkung kommt aus der Geometrie: *„The **roll center** of the suspension is **raised** … makes the suspension feel, and act, **as though a larger sway bar were installed**."*

**Am Mustang:** Beim Einbau werden **1/8" Shims entfernt**, um die geänderte Querlenkerlage auszugleichen. Ein Teil des heutigen Shim-Pakets kann also bereits Drop-Kompensation sein.

**Verwandt:** Roll Center, Camber Gain, Shim

---

### Strut Rod

**Was ist das?** Die Zugstrebe, die den unteren Querlenker nach vorn abstützt.

**Warum wichtig?** Bestimmt die Längsposition des unteren Kugelgelenks — und damit Castor.

**⚠ Achtung:** Kürzer = mehr positiver Castor, aber das **Rad wandert nach vorn**. Freigängigkeit zu Kotflügel und Frontschürze prüfen.

**Verwandt:** Castor, UCA

---

### Heim Joint (Gelenkkopf)

**Was ist das?** Ein Kugelgelenk mit Gewindeschaft — erlaubt Längenverstellung bei spielfreier Lagerung.

**Am Mustang:** Der SoT Tubular UCA ist darüber längenverstellbar. Auslieferung: vorderes Lager 3 Umdrehungen weiter heraus ≈ +3° Castor.

**⚠ Achtung:** **Beide UCA müssen gleich lang sein.** Ungleiche Längen erzeugen unterschiedliche Camberkurven links und rechts.

**Verwandt:** UCA, Castor, Camber Gain

---

### Roll Center (Rollzentrum)

**Was ist das?** Der gedachte Punkt, um den die Karosserie einer Achse rollt.

**Warum wichtig?** Bestimmt den **geometrischen** Anteil des lateralen Lasttransfers — die Kraft, die direkt über die Lenker ins Chassis läuft.

**Am Mustang:** Vorn durch den Shelby Drop **angehoben**. Hinten näherungsweise auf Panhard-Stangenhöhe.

**Verwandt:** Rollsteifigkeit, Shelby Drop, Panhard Bar

---

### Baseline

**Was ist das?** Ein eingefrorener, vollständig dokumentierter Vergleichszustand.

**⚠ Achtung:** Eine einzelne Alignment-Zahl ist **keine** Baseline. Dazu gehören Race-Ready-Zustand, Setup-Pad-Version, Hardwarestand, Alignment, Ride Height, Radlasten, Rear Geometry und Reifenstatus.

**Abgrenzung:** Baseline ≠ Target ≠ Measurement ≠ Source Example ([`CONVENTIONS.md`](CONVENTIONS.md) §15).

**Verwandt:** Race-Ready

---

## 9. Noch aufzunehmen

Begriffe, die in Kapiteln vorkommen oder absehbar gebraucht werden:

- Instant Center
- Anti-Dive / Anti-Squat
- Roll Steer
- Unsprung Mass
- Spring Perch
- Center Link / Idler Arm / Pitman Arm
- Stagger
- Heat Cycle
- Shore-Härte
- Pyrometer / Einstichtiefe

---

## 10. Definition of Done

- [x] Pflegeregel formuliert
- [x] Einheitliches Eintragsschema
- [x] 9 Kategorien, 52 Einträge
- [x] Vorzeichenkonventionen auf `CONVENTIONS.md` verwiesen, nicht dupliziert
- [x] Kapitelverweise bei vertiefenden Themen
- [x] Häufige Irrtümer als ⚠ markiert
- [x] Fahrzeugspezifisches von Allgemeinem getrennt
- [ ] Begriffe aus §9 ergänzt
- [ ] Englische Entsprechungen systematisch ergänzt
- [ ] Nach `glossar.js` portiert, falls Website kommt
