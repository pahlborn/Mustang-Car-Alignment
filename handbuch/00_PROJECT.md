# Mustang Track Chassis Setup — Project

**Dokumentrolle:** Single Source of Truth für das konkrete Fahrzeug  
**Version:** 0.2  
**Datum:** 2026-10-05  
**Status:** Autoritativ für Fahrzeugdaten, Hardware, Messmittel und aktuelle Baseline

---

## 1. Zweck

Diese Datei enthält ausschließlich den **konkreten Projektzustand des Fahrzeugs**.

Fachkapitel dürfen diese Daten erläutern oder auf sie verweisen, aber Fahrzeughardware, Baseline-Zahlen und bekannte Fahrzeugauffälligkeiten werden nur hier verbindlich gepflegt.

Konventionen und Formeln: siehe [`CONVENTIONS.md`](CONVENTIONS.md).  
Verbindlicher Setup-Ablauf: siehe [`02_WORKFLOW.md`](02_WORKFLOW.md).

---

## 2. Fahrzeug

| Merkmal | Projektstand |
|---|---|
| Fahrzeug | Ford Mustang |
| Modelljahr | 1966 |
| Einsatz | Rennstrecke / Track |
| Strecken | Pannoniaring, Slovakiaring, Brno |
| Lenkung | Manual Steering |
| Hinterachse | Ford 9" |

---

## 3. Vorderachse / Lenkung

**Statusvokabular:** siehe [`CONVENTIONS.md`](CONVENTIONS.md) §17. In Phase 1–3 wurden vorhandene Projektangaben konsolidiert, nicht physisch am Fahrzeug neu verifiziert.

| Bauteil / Geometrie | Projektstand | Status |
|---|---|---|
| Shelby Drop | vorhanden | Projektangabe |
| **UCA** | **Street or Track Tubular +Caster, `SOT-UCA65-66`** | **Projektangabe** |
| UCA Cross Shaft | Standard oder „Dropped" — welche Variante, noch erfassen | Offen |
| UCA Heim-Gelenke | Einstellposition vorn/hinten je Seite noch erfassen | Offen |
| LCA Camber Kit | Street or Track `SOT-LCACK65-66` | Projektangabe |
| LCA | Serien-LCA oder SoT Tubular (`SOT-LCA6566`)? | Offen |
| Strut Rods | einstellbar; Global West im Projekt dokumentiert | Projektangabe; Modell/Version offen |
| Ball Joints | Howe | Projektangabe |
| Steering Box | Flaming River FR1497-1Q, 1" sector, 16:1 | Projektangabe |
| Federn | genaue Rate/Ausführung noch erfassen | Offen |
| Dämpfer | genaue Ausführung/Einstellung noch erfassen | Offen |
| Front ARB / Endlinks | genaue Hardware und Preload-Zustand erfassen | Offen |
| Steering Arms / Tie Rods / Center Link / Idler / Pitman | Ist-Zustand vollständig inventarisieren | Offen |

### Alignment-relevante Regel

Änderungen an UCA, Strut Rod, LCA/Camber Kit, Ball-Joint-Geometrie oder Ride Height können mehrere Größen gleichzeitig beeinflussen. Nach Änderungen werden die abhängigen Größen gemäß [`02_WORKFLOW.md`](02_WORKFLOW.md) erneut geprüft.

### Konsequenz aus dem SoT Tubular UCA

Mit dem `SOT-UCA65-66` hat das Fahrzeug **vier** Verstellebenen an der Vorderachse, nicht zwei:

1. UCA-Heim-Gelenke — Länge je Seite, erzeugt Camber **und** Castor
2. UCA-Shims an der Querachse — Ford-Verfahren
3. LCA Camber Kit — Camber, diskrete Plattenstufen
4. Strut Rods — Castor

Damit entspricht die Hardware **derselben Konfiguration, mit der Street or Track sein dokumentiertes Track-Setup erreicht hat**. Das Beispiel −2,75° Camber / +5° Castor ist deshalb erstmals als Referenz übertragbar — unter dem Vorbehalt, dass LCA-Typ, Cross-Shaft-Variante und Reifen abweichen können.

Einstellmechanik und Reihenfolge: [`CHAPTER_FRONT_ADJUSTMENT_UCA_LCA.md`](CHAPTER_FRONT_ADJUSTMENT_UCA_LCA.md).

### Frontfedern — Teileidentifikation

> **Eintragen und stehenlassen.**

| Feld | Wert | Einheit |
|---|---|---|
| `spring_front_part_no` | | Teilenummer |
| `spring_front_manufacturer` | | |
| `spring_front_rate` | | lb/in |
| `spring_front_free_length` | | Zoll |
| `spring_front_install_date` | | |

> Die Federrate geht über das Motion Ratio **quadratisch** in die Radrate ein (siehe [`CHAPTER_SPRINGS_ROLL_STIFFNESS.md`](CHAPTER_SPRINGS_ROLL_STIFFNESS.md) §3.1). Ohne sie ist keine Rollsteifigkeit berechenbar.

### Vorderer Stabilisator

| Feld | Wert | Einheit | Status |
|---|---|---|---|
| `arb_front_dia` | **1" = 25,4 mm** | mm | **Projektangabe** |
| `arb_front_part_no` | | Teilenummer | Offen |
| `arb_front_arm_length` | | mm, Hebelarm bis Endlink | Offen |
| `arb_front_endlink_type` | | Serie / verstellbar / Heim | Offen |
| `arb_front_bushing_type` | | Gummi / Poly / Delrin | Offen |

**Katalogabgleich:** SoT führt für 1964–66 zwei Durchmesser (Scott Drake): `SCD-S1MS-5482-A` mit **1"** und `SCD-S1MS-5482-B` mit **1-1/8"**. Der verbaute Durchmesser entspricht damit der **kleineren** der beiden angebotenen Varianten.

> **Warum der Durchmesser so wichtig ist:** Die Torsionssteifigkeit eines Rundstabs geht mit der **vierten Potenz** des Durchmessers. Das ist der stärkste einzelne Balance-Hebel am Fahrzeug.

### Verfügbarer Verstellbereich über den ARB-Durchmesser

Bezogen auf den verbauten 1"-Stab:

| Durchmesser | Faktor auf K_ARB,vorn | Wirkung auf die Balance |
|---|---:|---|
| 7/8" (22,2 mm) | **0,59** | Richtung Übersteuern |
| **1" (25,4 mm) — verbaut** | **1,00** | Referenz |
| 1-1/8" (28,6 mm) | **1,60** | Richtung Untersteuern |
| 1-1/4" (31,8 mm) | **2,44** | deutlich Richtung Untersteuern |

> **Praktische Bedeutung:** Ein Wechsel auf 1-1/8" erhöht den Stabi-Beitrag zur vorderen Rollsteifigkeit um 60 %. Wie stark sich die **Gesamtverteilung** (TLLTD) dadurch verschiebt, hängt vom Verhältnis zum Federanteil ab — und das ist erst berechenbar, wenn `spring_front_rate`, `motion_ratio_front` und `leaf_spacing_rear` vorliegen ([`00_PROJECT.md`](00_PROJECT.md) §8.2).

> **Einordnung des Istzustands:** Der 1"-Stab ist für einen Serien-Mustang bereits eine Verstärkung; die Arning/Shelby-Quelle nennt genau diese Größe als empfohlene Ergänzung zum Drop (*„Addition of a 1" front sway bar will further reduce body roll"* — Quelle B-01). Für ein Rundstreckenfahrzeug mit modernen Reifen ist er eher am unteren Ende. **Daraus folgt kein Handlungsbedarf** — die Richtung hängt davon ab, wohin die Balance soll, und das sagt erst die Trackvalidierung.

> **Wichtig für die Hinterachs-Entscheidung:** Der vordere ARB ist der **Gegenhebel** zu jeder Erhöhung der hinteren Federrate. Wer hinten härtere Blattfedern einbaut (Richtung Übersteuern), kann das vorn über einen stärkeren Stabi kompensieren — ohne die Federrate vorn anzufassen. Das ist bei der offenen Blattfeder-Frage mitzudenken.

> **Begriffsklärung:** *Sway bar* (US-Händlersprache, so bei SoT und Scott Drake), *Stabilizer bar* (Ford-Werksbezeichnung), *Anti-roll bar / ARB* (technisch-international). Dieses Projekt verwendet nach [`CONVENTIONS.md`](CONVENTIONS.md) durchgängig **ARB**; beim Teilekauf ist „sway bar" der Suchbegriff.

### Dämpfer vorn

| Feld | Wert | Einheit |
|---|---|---|
| `shock_front_part_no` | | Teilenummer |
| `shock_front_manufacturer` | Bilstein (über Street or Track) | |
| `shock_front_valving` | | Street / Sport / Race |
| `shock_front_adjustable` | | ja / nein |
| `shock_front_install_date` | | |

**Katalogabgleich:** SoT führt `RCD-55-R054` (Bilstein front, 64–66 Mustang, Street valving).

> Dämpfer wirken **nicht** auf die stationäre Balance, sondern auf das transiente Verhalten — Turn-in, Lastwechsel, Kerbs. Siehe [`CHAPTER_SPRINGS_ROLL_STIFFNESS.md`](CHAPTER_SPRINGS_ROLL_STIFFNESS.md) §6.

---

## 4. Hinterachse

| Bauteil / Geometrie | Projektstand | Status |
|---|---|---|
| Achse | Ford 9" | Projektangabe |
| Differential | Eaton TrueTrac | Projektangabe |
| Achsübersetzung | 3.50:1 | Projektangabe |
| Federung | Blattfedern, **erneuert (Street or Track)** | Projektangabe |
| Federhistorie | 4-leaf Reverse-Eye → Mid-Eye | Legacy-Angabe |
| Panhard Bar | vorhanden; Maier-Kontext | Projektangabe; Geometrie/Höhe offen |
| Bushings | Projekt enthält Diskussion Delrin/Del-A-Lum-artiger Lösungen | Legacy-Angabe; aktuelle Bestückung offen |
| Shackles | aktuelle Geometrie/Winkel vermessen | Offen |
| U-Bolts / Spring Plates | Zustand/Hardware dokumentieren | Offen |
| Rear ARB | nicht als vorhanden bestätigt | Offen |

### Blattfedern — Teileidentifikation

> **Eintragen und stehenlassen.** Diese Felder werden bei späteren Arbeitsschritten ausgelesen.

| Feld | Wert | Einheit | Status |
|---|---|---|---|
| `leaf_rate` | **175** | lb/in je Feder | **Projektangabe, bestätigt** |
| `leaf_eye_type` | **Mid-Eye** | | **Projektangabe** |
| `leaf_count` | **4,5** | Lagen | **Projektangabe** |
| `leaf_manufacturer` | Street or Track (Scott Drake) | | Projektangabe |
| `leaf_part_no` | vermutlich `SCD-C5ZZ-5560-4ME` | Teilenummer | zu bestätigen |
| `leaf_install_date` | | | Offen |

**Katalogabgleich (Stand 10/2026):** Street or Track führt für 1964–73 Mustang drei Blattfedern:

| Teilenummer | Bezeichnung | Rate | Hinweis |
|---|---|---|---|
| `SCD-C5ZZ-5560` | 4 Leaf standard eye | nicht angegeben | Serienersatz |
| **`SCD-C5ZZ-5560-4ME`** | **4.5 Mid Eye** | **175 lb** | *„lowers your car approximately 1" from stock"* |
| `SCD-C5ZZ-5560-RE` | 5 Leaf Reverse Eye | nicht angegeben | |

**Bestätigt:** Verbaut ist die **4.5 Mid-Eye mit 175 lb/in**. Die ursprünglich erinnerten „650 lb" waren eine Verwechslung — vermutlich mit einer vorderen Schraubenfeder.

> **Achtung Ride Height:** Die Mid-Eye-Feder legt das Heck laut Hersteller um **ca. 1" (25 mm) tiefer** als Serie. Das ist bei allen Ride-Height-Vergleichen mit Altwerten und bei der Bewertung der bekannten linken 20-mm-Differenz zu berücksichtigen — ein Teil davon könnte schlicht die Federgeometrie sein.

> **Rollsteifigkeitsbeitrag:** 175 lb/in je Feder, wirksam über die Federbasis (`leaf_spacing_rear`, noch zu messen). Die Blattfeder trägt **und** stützt gegen Rollen — beides lässt sich bei dieser Bauart nicht trennen. Siehe [`CHAPTER_SPRINGS_ROLL_STIFFNESS.md`](CHAPTER_SPRINGS_ROLL_STIFFNESS.md) §5.2.

### Offene Entscheidung: Blattfedern nach Delrin-Shackle-Umbau

Im Projekt steht die Frage, ob nach Einbau von Delrin-Shackles auf Federn von **Mike Maier Inc.** oder **Maier Racing** gewechselt werden soll. Optionsvergleich und Bewertung: [`DECISION_LEAF_SPRINGS.md`](DECISION_LEAF_SPRINGS.md).

### Hinterer Stabilisator

| Feld | Wert | Einheit |
|---|---|---|
| `arb_rear_present` | | ja / nein |
| `arb_rear_part_no` | | |
| `arb_rear_dia` | | mm oder Zoll |

### Dämpfer hinten

| Feld | Wert | Einheit |
|---|---|---|
| `shock_rear_part_no` | | Teilenummer |
| `shock_rear_manufacturer` | Bilstein (über Street or Track) | |
| `shock_rear_valving` | | Street / Sport / Race |
| `shock_rear_adjustable` | | ja / nein |
| `shock_rear_install_date` | | |

**Katalogabgleich:** SoT führt als Bilstein-Hinterdämpfer für 65–73 Mustang `RCD-55-R056`.

### Bekannte Beobachtung

Im Projekt wurde die linke Heckseite wiederholt mit ungefähr **20 mm geringerer Ride Height** beschrieben.

Status: **Beobachtung / erneut reproduzierbar vermessen; Ursache nicht festgelegt.**

Keine Korrekturmaßnahme allein aus dieser Beobachtung ableiten.

---

## 5. Driveline

| Bauteil | Projektstand |
|---|---|
| Getriebe | Jerico DR4 im aktuellen Rennfahrzeug-Projekt |
| Hinterachse | Ford 9", 3.50:1 |
| Kardanwelle | Projekt enthält 3"/3.5"-Diskussion; aktuelle verbaute Ausführung verifizieren |
| U-Joints | genaue Ausführung dokumentieren |
| Pinion / Yoke | Winkel vollständig neu vermessen |

### Legacy-/Arbeitswerte

Frühere Projektdiskussionen enthielten ungefähr:

- Transmission/Output: `~3,5° DOWN`
- Pinion: `~1° DOWN`
- 2° Wedge, dicke Seite vorn, als Hersteller-/Projektkontext

Diese Werte sind **keine aktuelle Sollvorgabe**. Für die verbindliche Bewertung müssen Transmission-, Driveshaft- und Pinion-Slope sowie beide U-Joint Operating Angles neu gemessen werden.

---

## 6. Räder und Reifen

| Merkmal | Projektstand |
|---|---|
| Räder | American Racing 15×7 |
| Reifen | Avon CR6ZZ 225/65 R15 99V |
| Warmdruck-Baseline | 2,2 bar |
| Tire Set ID | noch einzuführen |
| Heat Cycles | noch systematisch zu erfassen |
| Shore-Historie | noch systematisch zu erfassen |

`2,2 bar` ist eine **Baseline**, kein abschließend validierter Optimalwert.

---

## 7. Messmittel

Vorhanden:

- Dunlop CG/4-5 Castor/Camber/KPI Gauge
- Dunlop CG/6 Steering Turntables
- Longacre kabelgebundene Corner-Weight-Waagen
- Longacre Toe Plates
- Longacre digitaler Reifendruckprüfer
- Longacre Probe-Pyrometer / Einstichsonde
- Shore-A-Messgerät / Tire Durometer
- Standardwerkstatt-Messmittel / Messbänder
- String Alignment als ergänzendes Verfahren vorgesehen
- **B-G Racing BGR310 Bump Steer Gauge** (Genauigkeit 0,1 mm, PCD 5 × 100–130 mm)

Noch zu erfassen:

- exaktes Longacre-Waagenmodell
- exakte Spezifikation/Modell des Pyrometers

### Nicht vorhanden — Auswirkung auf den Arbeitsumfang

> **Projektgrundsatz:** Was nicht gemessen oder eingestellt werden kann, wird nicht als Arbeitsschritt geführt. Diese Tabelle hält fest, welche Kapitelinhalte deshalb vorerst theoretisch bleiben.

| Fehlt | Betrifft | Konsequenz |
|---|---|---|
| **Slip-/Rollenplatten** | Bind-Diagnose, Radlastmessung | Camber-Bind nicht sicher eliminierbar. Behelf: mehrfaches Rollen. **Günstigste wirksame Anschaffung.** |
| **Spielfreie Lenkungsarretierung** | Bump-Steer-Messung | Lenkrad allein reicht nicht — Spiel in Lenkgetriebe, Pitman, Idler bleibt. **Center Link klemmen.** B-G BG5163 passt am Mustang nicht. |
| **Höhenverstellbare Federauflagen** | Cross-Weight-Einstellung | Cross bleibt **Diagnosegröße** |
| **Federprüfstand** | Federraten verifizieren | nur Herstellerangaben verwendbar |
| Laser-Ride-Height-System | Ride-Height-Messung | Behelf: Messband an definierten Punkten, ausreichend bei sauberer Referenz |
| Rotationslaser / Nivelliergerät | Setup-Pad-Vermessung | Behelf: Schlauchwaage oder langes Richtscheit + Libelle |

**Anschaffungsreihenfolge nach Nutzen:**

| # | Was | Warum zuerst |
|---|---|---|
| 1 | **Rollenplatte** (1 Stück + 3 Höhenspacer) | ohne sie bleibt jede Radlastmessung unsicher |
| 2 | **Lenkungsarretierung** — Center-Link-Klemmung | für die Bump-Steer-Messung zwingend spielfrei; **B-G BG5163 passt nicht** |
| 3 | Nivelliergerät | Setup Pad ist Grundlage für alles andere |

> Punkt 1 ist Voraussetzung für alles Weitere — eine Bump-Steer-Messung auf verspanntem Fahrwerk ist nicht aussagekräftiger als die Radlastmessung darauf.

> **Bump-Steer-Vorrichtung ist vorhanden** (B-G BGR310). Arbeitsanleitung: [`TEMPLATE_BUMP_STEER_SHEET.md`](TEMPLATE_BUMP_STEER_SHEET.md).

---

## 8. Aktuelle Baseline

**Baseline-Status:** Referenzzustand aus bisherigem Projekt; noch nicht als vollständig neu vermessene Baseline-ID eingefroren.

| Parameter | Referenzwert | Klassifikation | Herkunft |
|---|---:|---|---|
| Castor | +3,0° | Baseline | **offen** |
| Camber | −2,0° | Baseline | **offen** |
| Total Toe | +1,6 mm Toe-in *(≈ 1/16", Umrechnung/Referenz)* | Baseline | **offen** |
| Reifen-Warmdruck | 2,2 bar | Baseline | **offen** |

> **Offene Herkunftsfrage:** Für keinen dieser Werte ist dokumentiert, **wer sie wann womit gemessen hat** — Werkstatt, Vorbesitzer oder eigene Messung; race-ready oder unbeladen; auf welcher Fläche. Ohne diese Angabe ist „Baseline" nur die Zahl, die bisher verwendet wurde, und nicht ein Referenzzustand, gegen den Änderungen validiert werden können. Nachzutragen, sobald bekannt; andernfalls bei der ersten vollständigen Vermessung neu erzeugen.

Diese Werte sind **keine automatische Track-Zielvorgabe**.

### Fremdwerte zur Einordnung — keine Zielwerte

Zur Größenordnung, nach Einsatzzweck getrennt. Alle Werte beziehen sich auf 1965/66 Mustang mit Shelby Drop.

| Quelle | Einsatz | Camber | Castor | Toe | Klasse |
|---|---|---|---|---|---|
| Ford 1966 Werk | Serie/Straße | siehe §8.1 | siehe §8.1 | siehe §8.1 | A |
| Maier Racing | Straße/Performance | −0,5° bis −1,5° | +1,5° bis +3° | 1/16" in bis 1/16" out | C |
| Mike Maier Inc. | Performance-Basis | −0,5° bis −1,25° | +4,5° bis +8° | 1/8" Toe-in | C |
| Opentracker | Straße, Manual Steering | 0° bis −0,5° | +2° bis +3,5° | 1/8" Toe-in | C |
| **Street or Track** | **Track (Testfahrzeug)** | **−2,75°** | **+5°** | — | C |

**Lesart:**

- Die Straßenempfehlungen liegen durchweg bei −0,5° bis −1,5° Camber. Unsere Baseline von −2,0° liegt **darüber** — das ist für Rundstreckenbetrieb plausibel, aber nicht aus diesen Quellen ableitbar.
- Bei Castor streuen die Angaben stark (+1,5° bis +8°). Maßgeblich ist hier **nicht** der Zahlenwert, sondern die Lenkkraft bei **manueller Lenkung** und die Reifenfreigängigkeit.
- Der SoT-Wert ist der einzige echte Track-Wert und stammt von einem Fahrzeug mit **derselben UCA/LCA-Hardware** wie unseres.

> **Trans-Am / GT350R:** Werksseitige Alignment-Vorgaben der Shelby-Competition- und Trans-Am-Fahrzeuge konnten bislang **nicht aus einer belastbaren Quelle** beschafft werden. Die in Foren kursierenden Zahlen sind nicht nachprüfbar und werden hier bewusst **nicht** aufgenommen. Mögliche Primärquellen: Shelby American Racing Team Service Bulletins, SAAC-Archiv, Ford Trans-Am Competition Preparation Manual. Bleibt offen.

### 8.1 Ford-Werksspezifikation 1966

Die Werksvorgaben stehen in Part 3-6 des Shop Manuals. Die OCR des vorliegenden Scans hat die Spezifikationstabelle **spaltenweise vermischt**; eine verlässliche Extraktion der Zahlenwerte ist daraus nicht möglich.

**Wichtiger Randhinweis**, der belegt ist:

> „The front wheel alignment specifications, given in Part 3-6, are correct only when the car is at **'Curb Height'**. Before checking or adjusting the alignment factors, the **suspension alignment spacers (Tool T65P-3000-B or C) must be installed** to obtain the curb heights."
> — Ford Shop Manual 1966, S. 3-4

Ford misst also mit **eingesetzten Abstandshaltern** zwischen oberem Querlenker und Federdom, nicht im normalen Fahrzustand. Werksangaben sind damit **nicht direkt vergleichbar** mit einer Messung im race-ready Zustand nach [`02_WORKFLOW.md`](02_WORKFLOW.md).

Zu beschaffen: Part 3-6 Spezifikationstabelle aus dem Original-PDF (lesbarer Scan). Priorität niedrig — es sind Straßenwerte von 1966 und kein Track-Ziel.

---

## 8.2 Fahrzeugkonstanten — einmal messen, dann gültig

> **Kategorie B.** Diese Größen ändern sich nur, wenn Hardware getauscht wird. Sie sind die **Rechengrundlage** für Rollsteifigkeit und Lasttransfer und gehören deshalb hierher, nicht in ein Setup-Formular.

### Geometrie

| Feld | Wert | Einheit | Verfahren |
|---|---|---|---|
| `wheelbase` | | mm | Radmitte zu Radmitte, beide Seiten einzeln |
| `track_front` | | mm | Radmitte zu Radmitte vorn |
| `track_rear` | | mm | Radmitte zu Radmitte hinten |
| `motion_ratio_front` | | — | Federweg ÷ Radweg, am Fahrzeug messen |
| `leaf_spacing_rear` | | mm | **Abstand der Blattfedermitten** |

> **`motion_ratio_front` ist der kritischste fehlende Wert der Vorderachse.** Er geht quadratisch in die Radrate ein (`k_Rad = k_Feder · MR²`). Ohne ihn ist aus der Federrate keine Rollsteifigkeit berechenbar.
>
> **Messverfahren:** Rad definiert anheben (z. B. 25 mm), dabei Federlängenänderung messen. `MR = Δ_Feder / Δ_Rad`. Zwei bis drei Wiederholungen, Mittelwert.

> **`leaf_spacing_rear` ist das Pendant hinten** — nicht die Spurweite. Die Rollsteifigkeit der Blattfederachse hängt vom Federabstand ab, und auch dieser geht quadratisch ein (siehe [`CHAPTER_SPRINGS_ROLL_STIFFNESS.md`](CHAPTER_SPRINGS_ROLL_STIFFNESS.md) §5.2).

### Massen und Schwerpunkt

| Feld | Wert | Einheit | Verfahren |
|---|---|---|---|
| `mass_total_raceready` | | kg | Radlastwaagen, Summe |
| `mass_dist_front` | | % | aus Achslasten |
| `cg_height` | | mm | **Waagenmessung mit angehobener Achse** |
| `cg_longitudinal` | | mm von Vorderachse | aus Achslasten berechenbar |

> **`cg_height` ist der wichtigste fehlende Einzelwert des gesamten Projekts.** Er geht linear in das Rollmoment ein (`M_roll = m · a_y · h_CG`) und bestimmt damit den gesamten lateralen Lasttransfer.
>
> **Verfahren mit vorhandener Hardware:** Fahrzeug race-ready auf den Longacre-Waagen wiegen. Dann eine Achse um ein definiertes Maß anheben (Fahrzeug bleibt auf den Waagen, Federung blockieren oder Federweg rechnerisch berücksichtigen) und erneut wiegen. Aus der Achslastverschiebung und dem Anhebewinkel ergibt sich die Schwerpunkthöhe. Sollte bei der ersten vollständigen Vermessung mitgemacht werden.

### Rollzentren

| Feld | Wert | Einheit | Verfahren |
|---|---|---|---|
| `roll_center_front` | | mm über Boden | aus realer Geometrie konstruieren — **nach Shelby Drop** |
| `roll_center_rear` | | mm über Boden | ≈ Panhard-Stangenmitte |

> Das vordere Rollzentrum ist durch den Shelby Drop **angehoben** (Quelle B-01). Eine Konstruktion nach Serienmaßen wäre falsch. Das hintere entspricht näherungsweise der Panhard-Höhe — siehe [`CHAPTER_REAR_SUSPENSION_PANHARD_PINION.md`](CHAPTER_REAR_SUSPENSION_PANHARD_PINION.md) §7.

### Reifen

| Feld | Wert | Einheit |
|---|---|---|
| `tire_diameter` | | mm, gemessen am belasteten Reifen |
| `tire_width_section` | 225 | mm, nominal |
| `wheel_width` | 7 | Zoll |
| `wheel_offset` | | mm |

---

## 9. Noch nicht vorhandene verbindliche Fahrzeugmesswerte

Folgende Daten fehlen für eine vollständige Baseline:

### Ride Height
- LF
- RF
- LR
- RR
- definierte Messpunkte
- Rake
- Bump-Stop-Clearance

### Corner Weight
- LF
- RF
- LR
- RR
- Total
- Front/Rear %
- Left/Right %
- Cross %

### Rear Geometry
- Wheelbase links/rechts
- Thrust Angle
- Achs-Lateralposition
- Panhard-Länge
- Panhard-Höhe/Winkel
- Shackle-Winkel

### Kinematics
- LF Bump-Steer-Kurve
- RF Bump-Steer-Kurve
- relevante reale Bump-/Droop-Travel-Range
- Camber Gain, falls gemessen

### Steering
- KPI/SAI links/rechts
- Ackermann links/rechts
- Full-Lock-Freigängigkeit

### Driveline
- Transmission Slope
- Driveshaft Slope
- Pinion Slope
- Front Operating Angle
- Rear Operating Angle

---

## 10. Baseline-Governance

Sobald das Fahrzeug nach [`02_WORKFLOW.md`](02_WORKFLOW.md) vollständig vermessen wurde:

1. Baseline-ID nach [`CONVENTIONS.md`](CONVENTIONS.md) vergeben.
2. Race-Ready-Zustand dokumentieren.
3. Setup-Pad-Version dokumentieren.
4. Hardwarezustand einfrieren.
5. Alignment, Ride Height, Corner Weight, Rear Geometry und Reifenstatus erfassen.
6. Nur diese vollständige Kombination gilt als eingefrorene Baseline.

Eine einzelne Alignment-Zahl allein ist keine vollständige Fahrzeug-Baseline.

---

## 11. Offene Hardwarefragen

Vor einer endgültigen technischen Veröffentlichung noch verifizieren:

- exakte UCA-Ausführung
- exakte Shelby-Drop-Ausführung/Bohrposition
- exakte Global-West-Strut-Rod-Ausführung
- aktuelle LCA-Camber-Kit-Position
- Frontfeder-Ausführung und Rate
- Front-ARB und Endlinks
- Dämpfer
- aktuelle Mid-Eye-Blattfeder: Hersteller/Rate/Blattzahl
- aktuelle Bushings
- Panhard-Abmessungen und Befestigungshöhen
- aktuelle Kardanwelle
- exaktes Longacre-Waagenmodell
- tatsächliche Möglichkeiten zur Ride-Height-/Corner-Weight-Verstellung am Fahrzeug

---

## 12. Änderungsregel

Änderungen an Fahrzeugdaten, Hardware oder Baseline werden **zuerst hier** eingetragen.

Andere Dokumente sollen keine unabhängigen Kopien dieser Daten pflegen, sondern auf diese Datei verweisen.
