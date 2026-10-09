# Mustang Setup Sheet

**Dokumentrolle:** Messformular Fahrwerksabstimmung — die veränderlichen Größen
**Version:** 0.1
**Bezug:** Fahrzeugkonstanten [`00_PROJECT.md`](00_PROJECT.md) §8.2 · Physik [`CHAPTER_SPRINGS_ROLL_STIFFNESS.md`](CHAPTER_SPRINGS_ROLL_STIFFNESS.md) · [`CHAPTER_TIRE_MECHANICS.md`](CHAPTER_TIRE_MECHANICS.md)

**Baseline ID:**
**Datum:**
**Ort / Strecke:**
**Zweck dieser Session:**

---

## Die drei Kategorien

Dieses Projekt trennt Fahrzeugdaten nach ihrer Veränderlichkeit:

| Kat. | Was | Wo gepflegt | Beispiel |
|---|---|---|---|
| **A** | Hardware-Identität | [`00_PROJECT.md`](00_PROJECT.md) §3–6 | Teilenummern, Federraten |
| **B** | Fahrzeugkonstanten | [`00_PROJECT.md`](00_PROJECT.md) §8.2 | Motion Ratio, Schwerpunkthöhe |
| **C** | **Setup-Größen** | **dieses Formular** | Stabi-Durchmesser, Druck, Ride Height |

Nur Kategorie C ändert sich je Setup. A und B werden hier **gelesen**, nicht gepflegt.

> **Regel:** Wird in diesem Formular ein Wert eingetragen, der eigentlich nach A oder B gehört, ist das ein Hinweis auf einen Hardwarewechsel. Dann zuerst [`00_PROJECT.md`](00_PROJECT.md) aktualisieren.

---

## 1. Race-Ready-Zustand

Ohne diesen Block ist kein Wert dieses Formulars mit einem anderen vergleichbar.

| Feld | Wert | Einheit |
|---|---|---|
| `fuel_level` | | l oder % |
| `driver_or_ballast` | | kg |
| `driver_name` | | |
| `fluids_complete` | | ja / nein |
| `loose_items_removed` | | ja / nein |
| `setup_pad_version` | | |
| `steering_centered` | | ja / nein |

---

## 2. Reifen

| Feld | LF | RF | LR | RR |
|---|---:|---:|---:|---:|
| `tire_set_id` | | | | |
| `tire_pressure_cold` (bar) | | | | |
| `tire_pressure_hot` (bar) | | | | |
| `tire_shore` | | | | |
| `tire_heat_cycles` | | | | |

**Druckanstieg** (= hot − cold): LF ____ RF ____ LR ____ RR ____

> Der Anstieg zeigt, wie viel Energie im Reifen umgesetzt wird — siehe [`CHAPTER_TIRE_MECHANICS.md`](CHAPTER_TIRE_MECHANICS.md) §5.3.

---

## 3. Federung und Rollsteifigkeit — die Balance-Stellgrößen

### 3.1 Stabilisatoren

| Feld | Wert | Einheit |
|---|---|---|
| `arb_front_dia_installed` | | mm |
| `arb_front_connected` | | ja / nein / neutral |
| `arb_front_preload_checked` | | ja / nein |
| `arb_rear_dia_installed` | | mm oder „keiner" |
| `arb_rear_connected` | | ja / nein / keiner |

> **Stärkster Balance-Hebel.** Die Torsionssteifigkeit geht mit der **vierten Potenz** des Durchmessers: von 1" auf 1-1/8" sind das ≈ **+60 %**.

> **ARB-Preload:** Beim Wiegen muss der Stabilisator gelöst oder nachweislich spannungsfrei sein, sonst verfälscht er die Radlasten. Siehe `CHAPTER_BALANCE_CORNER_WEIGHT` §8.

### 3.2 Federn — nur bei Wechsel ausfüllen

| Feld | Wert | Einheit |
|---|---|---|
| `spring_front_rate_installed` | | lb/in |
| `leaf_rate_installed` | | lb/in |
| `spring_change_reason` | | |

> Bei Blattfedern lassen sich Tragrate und Rollsteifigkeit **nicht getrennt** ändern — jede Ratenänderung hinten verschiebt auch die Balance. Siehe [`CHAPTER_SPRINGS_ROLL_STIFFNESS.md`](CHAPTER_SPRINGS_ROLL_STIFFNESS.md) §5.2.

### 3.3 Dämpfer

| Feld | LF | RF | LR | RR |
|---|---:|---:|---:|---:|
| `damper_setting_bump` | | | | |
| `damper_setting_rebound` | | | | |

> Nur ausfüllen, wenn verstellbare Dämpfer verbaut sind. Dämpfer wirken **nicht** auf die stationäre Balance, sondern auf Turn-in, Lastwechsel und Kerbverhalten.

---

## 4. Ride Height

| Feld | LF | RF | LR | RR |
|---|---:|---:|---:|---:|
| `ride_height_chassis` (mm) | | | | |
| `bump_stop_clearance` (mm) | | | | |
| `droop_travel` (mm) | | | | |

**Messpunkte:** ______________________
**Rake links:** ______  **Rake rechts:** ______
**L/R-Differenz vorn:** ______  **hinten:** ______

> Ride Height verändert Rollzentren und damit den geometrischen Anteil des Lasttransfers. Jede Änderung hier macht die Werte in Abschnitt 5 und 6 ungültig.

---

## 5. Radlasten

| Feld | Wert | Einheit |
|---|---|---|
| `corner_weight_LF` | | kg |
| `corner_weight_RF` | | kg |
| `corner_weight_LR` | | kg |
| `corner_weight_RR` | | kg |

**Berechnet** (Formeln nach [`CONVENTIONS.md`](CONVENTIONS.md) §11):

| Größe | Wert |
|---|---:|
| Total | |
| Front % | |
| Rear % | |
| Left % | |
| Right % | |
| **Cross % = (RF+LR)/Total** | |

**Settling:** Versuch 1 ______ Versuch 2 ______ Differenz ______
**ARB beim Wiegen gelöst:** ☐ ja

---

## 6. Alignment

Vollständige Erfassung mit Stellgrößen: [`TEMPLATE_ALIGNMENT_SHEET.md`](TEMPLATE_ALIGNMENT_SHEET.md). Hier nur die Ergebniswerte.

| Parameter | LF | RF | Differenz |
|---|---:|---:|---:|
| Castor | | | |
| Camber | | | |
| KPI | | | |

**Total Toe:** ______ mm  **Methode:** ______
**Thrust Angle:** ______

---

## 7. Rechenkette — aus A, B und C

> Diese Werte werden **nicht eingetragen, sondern berechnet.** Sie sind der eigentliche Zweck der Kategorientrennung: Aus festen Fahrzeugdaten und veränderlichen Setup-Größen entsteht eine quantifizierte Balance-Aussage statt eines Bauchgefühls.

### Schritt 1 — Radrate vorn

```text
k_Rad,vorn = spring_front_rate × motion_ratio_front²
```
| Eingang | Quelle | Wert |
|---|---|---|
| `spring_front_rate` | A — [`00_PROJECT.md`](00_PROJECT.md) §3 | |
| `motion_ratio_front` | B — [`00_PROJECT.md`](00_PROJECT.md) §8.2 | |
| **k_Rad,vorn** | berechnet | |

### Schritt 2 — Rollsteifigkeit Federn

```text
K_Feder,vorn   = k_Rad,vorn × track_front²  / 2
K_Feder,hinten = leaf_rate  × leaf_spacing_rear² / 2
```

> **Achtung:** Hinten geht der **Federabstand** ein, nicht die Spurweite. Beide Größen quadratisch.

| Größe | Wert |
|---|---:|
| K_Feder,vorn | |
| K_Feder,hinten | |

### Schritt 3 — Rollsteifigkeit Stabilisator

```text
K_ARB ∝ dia⁴     (vierte Potenz)
```

Relativ zum Referenzdurchmesser rechnen, solange die Hebelgeometrie nicht erfasst ist:

```text
Faktor = (dia_neu / dia_alt)⁴
```

| Größe | Wert |
|---|---:|
| K_ARB,vorn | |
| K_ARB,hinten | |

### Schritt 4 — Verteilung

```text
K_vorn   = K_Feder,vorn   + K_ARB,vorn
K_hinten = K_Feder,hinten + K_ARB,hinten

TLLTD = K_vorn / (K_vorn + K_hinten)
```

| Größe | Wert |
|---|---:|
| K_vorn | |
| K_hinten | |
| **TLLTD** | **____ %** |

| TLLTD-Änderung | Erwartete Wirkung |
|---|---|
| steigt | mehr Untersteuern |
| sinkt | mehr Übersteuern |

### Schritt 5 — Lasttransfer

```text
Lasttransfer_gesamt ≈ (mass_total × a_y × cg_height) / track
```

| Eingang | Quelle | Wert |
|---|---|---|
| `mass_total_raceready` | B | |
| `cg_height` | B | |
| angenommene Querbeschleunigung a_y | Annahme | |
| **Transfer gesamt** | berechnet | |
| davon vorn (× TLLTD) | berechnet | |
| davon hinten | berechnet | |

> **Solange `motion_ratio_front`, `leaf_spacing_rear` und `cg_height` nicht gemessen sind, ist diese Kette nicht rechenbar.** Das ist kein Mangel des Formulars, sondern zeigt genau, welche drei Messungen fehlen.

### Was auch ohne vollständige Daten geht

| Möglich | Verfahren |
|---|---|
| **Relativvergleich** | Stabi 1" → 1-1/8" = +60 % K_ARB,vorn, unabhängig vom Absolutwert |
| **Richtungsaussage** | vorn steifer → mehr Untersteuern |
| **Erfahrungsbasis** | Änderung + Trackergebnis protokollieren |

---

## 8. Änderung dieser Session

> Eine Änderung pro Vergleichszyklus ([`CONVENTIONS.md`](CONVENTIONS.md) §20).

```text
Symptom / Anlass:

Daten, die das stützen:

Hypothese:

Geplante Änderung:

Erwartete Wirkung:

Mögliche Nebenwirkung:

Messgröße für Erfolg:
```

| Was geändert | von | auf | TLLTD vorher | TLLTD nachher |
|---|---|---|---:|---:|
| | | | | |

---

## 9. Ergebnis

**Fahrerfeedback:**

| Kurvenphase | Bewertung |
|---|---|
| Braking | |
| Turn-in | |
| Entry | |
| Mid-corner | |
| Exit | |
| Kerbs | |

**Symptomcode** nach [`CONVENTIONS.md`](CONVENTIONS.md) §18: ______

**Rundenzeiten:** best ______ konsistent ______

**A/B-Bewertung:** ☐ besser ☐ schlechter ☐ neutral ☐ nicht aussagekräftig

> „Nicht aussagekräftig" ist ein valides Ergebnis und wird dokumentiert.

---

## 10. Freigabe

- [ ] Race-Ready-Zustand dokumentiert
- [ ] Nur **eine** primäre Änderung
- [ ] Stellgrößen und Messgrößen vollständig
- [ ] Rechenkette so weit wie möglich ausgefüllt
- [ ] Fehlende Konstanten in [`00_PROJECT.md`](00_PROJECT.md) §8.2 vermerkt
- [ ] Baseline-ID vergeben oder referenziert

**Notizen:**
