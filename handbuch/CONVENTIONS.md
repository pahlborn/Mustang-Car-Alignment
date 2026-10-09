# Mustang Track Chassis Setup — Conventions

**Dokumentrolle:** Verbindliche Projektkonventionen  
**Version:** 0.2  
**Datum:** 2026-10-05  
**Status:** Autoritativ für Schreibweise, Vorzeichen, Formeln, IDs und Klassifikationen

---

## 1. Zweck

Diese Datei ist die **Single Source of Truth für Konventionen**. Fachkapitel, Templates und Setup-Logs dürfen dieselbe Konvention erläutern, aber nicht abweichend neu definieren.

Bei Widersprüchen zwischen älteren Dokumenten und dieser Datei gilt diese Datei.

Konkrete Fahrzeugdaten und aktuelle Baseline: [`00_PROJECT.md`](00_PROJECT.md).  
Verbindlicher Gesamtprozess: [`02_WORKFLOW.md`](02_WORKFLOW.md).  
Begriffserklärungen: [`GLOSSAR.md`](GLOSSAR.md).
Aufbau des Handbuchs: [`01_ARCHITECTURE.md`](01_ARCHITECTURE.md).

**Arbeitsteilung:** Diese Datei legt **verbindlich fest** (Vorzeichen, Formeln, IDs). Das Glossar **erklärt** (was ist das, warum wichtig, typische Irrtümer). Bei Widerspruch gilt diese Datei.

---

## 2. Fahrzeugseiten und Radpositionen

Links und rechts werden immer aus Sicht des Fahrers in normaler Fahrtrichtung bezeichnet.

Verbindliche Kürzel:

| Kürzel | Bedeutung |
|---|---|
| `LF` | Left Front — vorne links |
| `RF` | Right Front — vorne rechts |
| `LR` | Left Rear — hinten links |
| `RR` | Right Rear — hinten rechts |

`FL`, `FR`, `RL` werden in neuen Dokumenten nicht verwendet.

---

## 3. Einheiten

Projektinterne Standarddarstellung:

| Größe | Einheit |
|---|---|
| Länge / Toe / Ride Height / Federweg | mm |
| Winkel | ° |
| Reifendruck | bar |
| Temperatur | °C |
| Masse / Radlast | kg |
| Geschwindigkeit | km/h |

Originalangaben einer Quelle dürfen zusätzlich in ihrer Originaleinheit stehen. Umgerechnete Werte müssen als Umrechnung erkennbar bleiben.

---

## 4. Camber

Von vorn auf das Fahrzeug betrachtet:

- Rad oben nach innen → **negativer Camber**
- Rad oben nach außen → **positiver Camber**

Beispiel: `−2,0° Camber`.

---

## 5. Castor

Von der Fahrzeugseite betrachtet:

- Lenkachse oben nach hinten geneigt → **positiver Castor**
- Lenkachse oben nach vorn geneigt → **negativer Castor**

Beispiel: `+3,0° Castor`.

---

## 6. KPI / SAI und Included Angle

`KPI` und `SAI` bezeichnen im Projekt die Lenkachsenneigung in Vorderansicht.

KPI/SAI wird primär als Geometrie- und Diagnosegröße behandelt.

**Offen:** Für den Included Angle ist in den bisherigen Fachunterlagen noch keine abschließend verifizierte projektweite Vorzeichen-/Rechenkonvention festgelegt. Bis zur Klärung keine abgeleitete Formel als Projektstandard verwenden.

---

## 7. Toe — Total Toe

Für Toe-Plate- bzw. Distanzmessungen:

- `F` = Abstand der Referenzlinien **vorne**
- `R` = Abstand der Referenzlinien **hinten**

Verbindliche Formel:

`Total Toe = R − F`

Damit gilt:

- positiver Wert → **Toe-in**
- `0` → parallel
- negativer Wert → **Toe-out**

Beispiel:

`R = 1702,0 mm`, `F = 1700,4 mm`

`Total Toe = +1,6 mm` → 1,6 mm Gesamt-Toe-in.

---

## 8. Individual Toe

Für Individual Toe gilt dieselbe Vorzeichenlogik:

- positiv → Toe-in
- negativ → Toe-out

Individual Toe muss immer mit dokumentierter Fahrzeug-/String-Referenz gemessen werden. Total Toe allein definiert weder Lenkungsmitte noch Individual Toe.

---

## 9. Toe in mm und Winkel

Wenn Toe in mm angegeben wird, muss die Messbasis bzw. der wirksame Messdurchmesser dokumentiert werden, sobald eine Umrechnung in Winkel erfolgen soll.

Projektformel:

`α = atan(Δ / D)`

für kleine Winkel näherungsweise:

`α[°] ≈ (Δ / D) × 57,3`

Dabei ist `Δ` die relevante Toe-Differenz und `D` der zugehörige Messdurchmesser. Keine Winkelumrechnung ohne definierte Geometrie.

---

## 10. Bump Steer

Bump Steer ist die Toe-Änderung eines einzelnen Rades über den Federweg.

Verbindliche Vorzeichen:

### Federweg
- `0 mm` = dokumentierte Race-Ready Ride Height
- positiver Federweg = **Bump / Einfedern**
- negativer Federweg = **Droop / Ausfedern**

### Toe-Änderung
- positiv = Änderung Richtung **Toe-in**
- negativ = Änderung Richtung **Toe-out**

Jede Kurve muss Radseite, Nullpunkt, statischen Alignment-Zustand und Hardwarezustand nennen.

---

## 11. Corner Weight

Verbindliche Formeln:

`Total = LF + RF + LR + RR`

`Front % = (LF + RF) / Total × 100`

`Rear % = (LR + RR) / Total × 100`

`Left % = (LF + LR) / Total × 100`

`Right % = (RF + RR) / Total × 100`

`Cross % = (RF + LR) / Total × 100`

`Opposite Cross % = (LF + RR) / Total × 100`

### Interpretationsregel

`50 % Cross` ist ein symmetrischer Ausgangspunkt, **kein universeller Sollwert**.

Corner-Weight-Verstellung verändert statische Radlasten/Diagonalen. Sie ist nicht gleichbedeutend mit einer realen Verlagerung der Fahrzeugmasse.

---

## 12. Ride Height

Ride Height darf nur mit eindeutig bezeichnetem Messpunkt dokumentiert werden.

Die konkreten Ride-Height-Messpunkte und Fahrzeugwerte werden in [`00_PROJECT.md`](00_PROJECT.md) geführt.

Mindestens angeben:

- Radposition
- Messpunkt am Chassis/Karosserie
- Referenz: Boden oder Radmitte
- Race-Ready-Zustand
- Reifendruck
- Setup-Pad-Version

Ein einzelner Wert ohne Messpunkt ist keine reproduzierbare Ride-Height-Angabe.

---

## 13. Dunlop CG/4-5 / CG/6 — IN und OUT

Aus Sicht des jeweils gemessenen Rades:

- `IN` = Vorderkante des Rades bewegt sich Richtung Fahrzeugmitte
- `OUT` = Vorderkante des Rades bewegt sich vom Fahrzeug weg

| Rad | IN | OUT |
|---|---|---|
| links | nach rechts | nach links |
| rechts | nach links | nach rechts |

Für das vorhandene Dunlop-Verfahren wird Castor/KPI mit `20° IN → 20° OUT`, also 40° Gesamtschwenk, dokumentiert.

Diese 20°-Konvention gilt **nicht automatisch für andere Messgeräte**.

---

## 14. Driveline-Slope

Alle Driveline-Winkel werden als **Slope von vorn nach hinten** dokumentiert:

- `UP` = steigt von vorn nach hinten
- `DOWN` = fällt von vorn nach hinten

Zu dokumentieren:

- Transmission / Output Slope
- Driveshaft Slope
- Pinion Slope
- Front U-Joint Operating Angle
- Rear U-Joint Operating Angle

Ein isolierter Wert wie „Pinion 2° down“ gilt nicht als vollständige Driveline-Beschreibung.

---

## 15. Baseline, Target und Messwert

Diese Begriffe dürfen nicht vermischt werden:

- **Measurement / Messwert:** tatsächlich gemessener Zustand
- **Baseline:** eingefrorener Vergleichszustand für weitere Tests
- **Target / Zielwert:** bewusst angestrebter Wert
- **Source Example:** Wert aus Hersteller-/Literaturbeispiel
- **Working Hypothesis:** noch zu validierende Annahme

Ein Baseline-Wert ist **nicht automatisch ein Zielwert**.

---

## 16. Evidenzgrade

| Grad | Bedeutung |
|---|---|
| `A` | Primärquelle: Hersteller, Originalanleitung, technische Originaldokumentation |
| `B` | etablierte Fachliteratur / belastbare wissenschaftlich-technische Quelle |
| `C` | kompetente technische Sekundärquelle |
| `D` | Erfahrungswert / Forum / Einzelmeinung; nur unterstützend |

Grad `D` darf keine sicherheits- oder setupkritische Aussage allein tragen.

---

## 17. Verifizierungsstatus für Projektdaten

Dieser Status beschreibt **nicht** Messwert/Baseline/Target aus §15, sondern die Herkunft bzw. Verifikation eines konkreten Fahrzeug- oder Hardwaredatums.

| Status | Bedeutung |
|---|---|
| `Verifiziert` | am aktuellen Fahrzeug bzw. anhand eines eindeutigen aktuellen Nachweises bestätigt |
| `Projektangabe` | aus dem bisherigen Nutzer-/Projektkontext übernommen; in diesem Konsolidierungsschritt nicht erneut am Fahrzeug verifiziert |
| `Legacy-Angabe` | aus älteren Projektunterlagen übernommen; Aktualität ausdrücklich zu prüfen |
| `Offen` | noch nicht ausreichend bestimmt |

`Projektangabe` bedeutet nicht automatisch, dass die Angabe unsicher oder falsch ist. Sie kennzeichnet lediglich, dass Phase 1–3 eine **Strukturkonsolidierung** und keine erneute physische Fahrzeugverifikation war.

Konkrete Einstufungen werden in [`00_PROJECT.md`](00_PROJECT.md) geführt.

---

## 18. Symptomcodes

Verbindliche Kerncodes:

- `ENTRY-US`
- `ENTRY-OS`
- `MID-US`
- `MID-OS`
- `POWER-US`
- `POWER-OS`
- `HIGH-SPEED-US`
- `HIGH-SPEED-OS`
- `BRAKE-INSTABILITY`
- `BUMP-INSTABILITY`

Zusätzliche Beobachtungsflags:

- `L/R-ASYMMETRY`
- `DEGRADES-WITH-LAPS`

`US` = Understeer, `OS` = Oversteer.

Der Code beschreibt das **Symptom**, nicht dessen Ursache.

---

## 19. ID-Konventionen

Damit Baselines, Änderungen und Sessions eindeutig referenzierbar bleiben:

- Baseline: `BL-YYYYMMDD-NN`
- Change: `CHG-YYYYMMDD-NN`
- Track Session: `SES-YYYYMMDD-NN`
- Tire Set: `TYRE-<freie eindeutige ID>`

Die konkrete Tire-Set-ID wird in [`00_PROJECT.md`](00_PROJECT.md) bzw. im jeweiligen Setup-/Session-Log geführt.

Beispiel: `BL-20261005-01`.

Eine akzeptierte Änderung erzeugt nur dann eine neue Baseline-ID, wenn der neue Zustand vollständig dokumentiert wurde.

---

## 20. A/B-Test

- `A` = dokumentierte Baseline
- `B` = Zustand nach **einer primären Setupänderung**

Reifen, Kraftstoff, Trackbedingungen, Stintlänge und Fahrer sollen soweit praktisch möglich vergleichbar bleiben.

Mehrere gleichzeitig veränderte Setupgrößen sind kein sauberer A/B-Test.

---

## 21. Sprach- und Schreibregel

Fachbegriffe dürfen englisch bleiben, wenn sie in Motorsport/Werkstatt eindeutig etabliert sind, z. B. Toe, Camber, Castor, Bump Steer, Cross Weight, Ride Height.

Templates dürfen englische Feldbezeichnungen verwenden. Die zugrunde liegenden Definitionen und Vorzeichen kommen ausschließlich aus dieser Datei.

---

## 22. Offene Konventionen

Noch zu entscheiden bzw. technisch zu verifizieren:

- Included-Angle-Rechen-/Vorzeichenkonvention
- **Thrust-Angle-Vorzeichen:** positive/negative Richtung relativ zur Fahrzeuglängsachse
- **Panhard-Offset-Vorzeichen:** positive/negative laterale Achsverschiebung
- **Rake-Vorzeichen:** Nose-down/Nose-up als positive bzw. negative Richtung
- endgültige Benennung definierter Ride-Height-Messpunkte am realen Fahrzeug
- exaktes Schema für Setup-Pad-Versionen
- exakte Tire-Set-ID nach Sichtung der vorhandenen Reifensätze

Bis diese drei Richtungsdefinitionen festgelegt sind, müssen Thrust Angle, Panhard Offset und Rake zusätzlich **sprachlich eindeutig** dokumentiert werden (z. B. „Achse nach rechts“, „Achse 4 mm nach links“, „Front 8 mm tiefer als Rear“) und dürfen nicht allein über ein Vorzeichen beschrieben werden.
