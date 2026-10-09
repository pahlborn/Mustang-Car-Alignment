# Baseline Snapshot

**Dokumentrolle:** Vollständige Momentaufnahme des Fahrzeugs — friert eine Baseline ein
**Version:** 0.2
**Bezug:** [`CONVENTIONS.md`](CONVENTIONS.md) §19 · [`02_WORKFLOW.md`](02_WORKFLOW.md) §21

---

## Abgrenzung zu den anderen Formularen

| Formular | Wann | Umfang |
|---|---|---|
| **dieses Blatt** | wenn eine **Baseline eingefroren** wird | vollständig, alle Größen |
| [`TEMPLATE_SETUP_SHEET.md`](TEMPLATE_SETUP_SHEET.md) | bei jeder Setup-Session | nur veränderliche Größen |
| [`TEMPLATE_ALIGNMENT_SHEET.md`](TEMPLATE_ALIGNMENT_SHEET.md) | bei Alignment-Arbeit | Stell- und Messgrößen Vorderachse |
| [`TEMPLATE_SCALE_SHEET.md`](TEMPLATE_SCALE_SHEET.md) | bei Radlastmessung | Corner Weights, Reproduzierbarkeit |
| [`TEMPLATE_TRACK_SESSION_SHEET.md`](TEMPLATE_TRACK_SESSION_SHEET.md) | je Stint | Trackdaten |
| [`TEMPLATE_BUMP_STEER_SHEET.md`](TEMPLATE_BUMP_STEER_SHEET.md) | bei Kinematikmessung | Bump-Steer-Kurve |
| [`TEMPLATE_CHANGE_LOG.md`](TEMPLATE_CHANGE_LOG.md) | je Änderung | A/B-Validierung |

> **Eine Baseline entsteht nur, wenn dieses Blatt vollständig ist.** Eine einzelne Alignment-Zahl ist keine Baseline ([`CONVENTIONS.md`](CONVENTIONS.md) §15).

---

## 0. Identität

**Baseline ID:** `BL-________-__`
**Datum:** ______________
**Erstellt von:** ______________

**Anlass:**
☐ Erstvermessung ☐ nach Hardwarewechsel ☐ nach Saisonpause ☐ nach akzeptierter Änderung `CHG-________-__`

**Vorherige Baseline:** `BL-________-__`
**Was hat sich geändert:** ______________________________________

---

## 1. Race-Ready-Zustand

- [ ] Fahrer oder definierter Ballast an Bord
- [ ] Kraftstoffstand definiert
- [ ] Betriebsflüssigkeiten vollständig
- [ ] Reifendrücke gesetzt
- [ ] Lenkung zentriert
- [ ] mechanische Prüfung abgeschlossen
- [ ] Setup Pad verifiziert
- [ ] Fahrwerk gesetzt (Settling-Prozedur)
- [ ] **Bind-Test bestanden** ([`CHAPTER_BIND_DIAGNOSIS.md`](CHAPTER_BIND_DIAGNOSIS.md) §6.1)

| Feld | Wert |
|---|---|
| Fahrer / Ballast | ______ kg |
| Kraftstoff | ______ l |
| Setup-Pad-Version | |
| Slip-/Rollenplatten verwendet | ☐ ja ☐ nein |

---

## 2. Hardwarestand

> Abgleich gegen [`00_PROJECT.md`](00_PROJECT.md). **Abweichungen zuerst dort korrigieren.**

| Bauteil | Stand | geprüft |
|---|---|---|
| UCA | SoT Tubular `SOT-UCA65-66` | ☐ |
| UCA Cross Shaft | ☐ Standard ☐ Dropped | ☐ |
| LCA Camber Kit | `SOT-LCACK65-66` | ☐ |
| Strut Rods | | ☐ |
| Frontfedern | | ☐ |
| ARB vorn | 1" (25,4 mm) | ☐ |
| Dämpfer vorn | Bilstein | ☐ |
| Blattfedern | 4.5 Mid-Eye, 175 lb/in | ☐ |
| Shackle-Buchsen | | ☐ |
| Panhard Bar | | ☐ |
| Dämpfer hinten | Bilstein | ☐ |
| ARB hinten | ☐ keiner ☐ ______ | ☐ |

**Abweichungen gegenüber `00_PROJECT.md`:**

---

## 3. Ride Height

| Position | Chassis–Boden | Chassis–Radmitte | Bump-Stop-Abstand | Droop-Reserve |
|---|---:|---:|---:|---:|
| LF | | | | |
| RF | | | | |
| LR | | | | |
| RR | | | | |

**Messpunkte definiert als:** ______________________________________

| Größe | Wert |
|---|---:|
| L/R-Differenz vorn | |
| L/R-Differenz hinten | |
| Rake links | |
| Rake rechts | |

---

## 4. Radlasten

| Position | Gewicht |
|---|---:|
| LF | |
| RF | |
| LR | |
| RR | |
| **Total** | |

| Größe | Wert |
|---|---:|
| Front % | |
| Rear % | |
| Left % | |
| Right % | |
| **Cross %** | |

**Reproduzierbarkeit (max − min je Ecke):** ______ kg = ______ %
**ARB beim Wiegen gelöst:** ☐ ja

---

## 5. Vorderachsgeometrie

### Messgrößen

| Parameter | LF | RF | Differenz | Grenze |
|---|---:|---:|---:|---|
| Castor | | | | max. 1/4° bevorzugt |
| Camber | | | | max. 1/4° bevorzugt |
| KPI / SAI | | | | Diagnosewert |

### Stellgrößen

| Feld | LF | RF |
|---|---|---|
| UCA Heim vorn (Umdr.) | | |
| UCA Heim hinten (Umdr.) | | |
| UCA-Shim vorn (mm) | | |
| UCA-Shim hinten (mm) | | |
| LCA-Kit Plattennummer | | |
| Strut-Rod-Länge | | |

**Beide UCA gleich lang:** ☐ ja ☐ nein

### Toe

| Feld | Wert |
|---|---|
| Total Toe | |
| Messmethode | |
| Messdurchmesser / Basis | |
| Individual Toe LF | |
| Individual Toe RF | |
| Lenkradstellung | |

### Spurweite

**vorn:** ______ mm  **hinten:** ______ mm

---

## 6. Ackermann / Turning Angle

| Richtung | Innenrad | Außenrad | Differenz |
|---|---:|---:|---:|
| Linkskurve (innen 20°) | | | |
| Rechtskurve (innen 20°) | | | |

**Symmetrie plausibel:** ☐ ja ☐ nein → Bauteilprüfung

> Diagnosegröße, keine Einstellgröße. Ford: *„cannot be adjusted directly … check the spindle or other suspension parts for a bent condition."*

---

## 7. Bump Steer

| Feld | LF | RF |
|---|---:|---:|
| max. Toe-Ausschlag im Arbeitsfenster | | |
| Arbeitsfenster Bump | | |
| Arbeitsfenster Droop | | |
| Kurve monoton | ☐ ja ☐ nein | ☐ ja ☐ nein |
| Symmetrie L/R | | |

**Vollständige Kurve:** [`TEMPLATE_BUMP_STEER_SHEET.md`](TEMPLATE_BUMP_STEER_SHEET.md), Datum ______
**Gemessen:** ☐ ja ☐ **nein — noch offen**

---

## 8. Hinterachsgeometrie

| Feld | Wert |
|---|---|
| Radstand links | |
| Radstand rechts | |
| Differenz | |
| **Thrust Angle** | |
| Achs-Lateralposition | |
| Panhard-Länge | |
| Panhard-Höhe Chassis-Pivot | |
| Panhard-Höhe Achs-Pivot | |
| Panhard-Winkel | |
| Shackle-Winkel links | |
| Shackle-Winkel rechts | |

**Panhard-Bolzen kraftfrei einführbar:** ☐ ja ☐ nein

> Falls nein: Überbestimmung — siehe [`CHAPTER_BIND_DIAGNOSIS.md`](CHAPTER_BIND_DIAGNOSIS.md) §6.3.

---

## 9. Driveline

| Feld | Wert | Richtung |
|---|---:|---|
| Transmission Slope | | ☐ UP ☐ DOWN |
| Driveshaft Slope | | ☐ UP ☐ DOWN |
| Pinion Slope | | ☐ UP ☐ DOWN |
| **Vorderer Operating Angle** | | |
| **Hinterer Operating Angle** | | |
| **Differenz** | | |
| Wedge Shim verbaut | | |

**Prüfung gegen Spicer:**

- [ ] beide Winkel ≥ 0,5°
- [ ] Differenz ≤ 1° (Spicer) bzw. ≤ 2° (TREMEC)
- [ ] beide ≤ 3°
- [ ] „equal and opposite" — Richtungen gleichen sich aus

---

## 10. Reifen

| Reifen | Kaltdruck | Shore kalt | Heat Cycles | Bemerkung |
|---|---:|---:|---:|---|
| LF | | | | |
| RF | | | | |
| LR | | | | |
| RR | | | | |

| Feld | Wert |
|---|---|
| Reifensatz-ID | `TYRE-____________` |
| Typ | Avon CR6ZZ 225/65 R15 |
| Räder | American Racing 15×7 |
| Reifendurchmesser belastet | |
| Shore-Messtemperatur | ______ °C |

---

## 11. Fahrzeugkonstanten

> Nur ausfüllen, wenn neu gemessen. Sonst Verweis auf [`00_PROJECT.md`](00_PROJECT.md) §8.2.

| Größe | Wert | zuletzt gemessen |
|---|---:|---|
| Motion Ratio vorn | | |
| Federbasis hinten | | |
| Schwerpunkthöhe | | |
| Frontfeder-Rate | | |
| Blattfeder-Rate | 175 lb/in | Herstellerangabe |

**Daraus berechnet:**

| Größe | Wert |
|---|---:|
| Radrate vorn | |
| Rollsteifigkeit vorn | |
| Rollsteifigkeit hinten | |
| **TLLTD** | ______ % |

> Nicht berechenbar, solange Motion Ratio, Federbasis oder Schwerpunkthöhe fehlen. Dann hier **„offen"** eintragen, nicht schätzen.

---

## 12. Einordnung

| Feld | Angabe |
|---|---|
| Primäres Handling-Verhalten | |
| Bekannte Asymmetrien | |
| Bekannte Einschränkungen | |
| Offene Messungen | |
| Nächster geplanter Test | |

---

## 13. Freigabe

Diese Baseline gilt als eingefroren, wenn:

- [ ] Race-Ready-Zustand dokumentiert
- [ ] Hardwarestand gegen `00_PROJECT.md` geprüft
- [ ] Bind-Test bestanden
- [ ] Radlasten reproduzierbar
- [ ] Vorderachsgeometrie vollständig — **Stell- und Messgrößen**
- [ ] Hinterachsgeometrie vollständig
- [ ] Reifenzustand erfasst
- [ ] Offene Punkte ausdrücklich als offen markiert

**Baseline ID vergeben:** `BL-________-__`
**Freigegeben am:** ______________

**Notizen:**
