# Mustang Alignment Sheet

**Dokumentrolle:** Messformular Vorderachsgeometrie
**Version:** 0.2
**Bezug:** Einstellmechanik [`CHAPTER_FRONT_ADJUSTMENT_UCA_LCA.md`](CHAPTER_FRONT_ADJUSTMENT_UCA_LCA.md) · Konventionen [`CONVENTIONS.md`](CONVENTIONS.md)

**Date:**
**Baseline ID:**
**Race-ready state:**
**Setup pad version:**
**Tire set:**
**Cold pressure:**

---

## 1. Stellgrößen — was eingestellt ist

> Diese Werte beschreiben den **Zustand der Hardware**. Sie machen das Setup reproduzierbar.
> Sie sind **keine Winkelangaben** — der erreichte Winkel wird in Abschnitt 2 gemessen.

### 1.1 UCA — Street or Track Tubular (`SOT-UCA65-66`)

**Cross-Shaft-Variante:** ☐ Standard  ☐ Dropped (Shelby Drop eingearbeitet)

| Heim-Gelenk | LF | RF |
|---|---:|---:|
| vorn — Umdrehungen ab Anschlag | | |
| hinten — Umdrehungen ab Anschlag | | |
| Gewindelänge frei (mm), falls messbar | | |

**Beide Arme gleich lang?** ☐ ja  ☐ nein → *Projektregel: muss gleich sein, sonst ungleiche Camberkurven L/R*

**Auslieferungszustand zur Referenz:** vorn 3 Umdrehungen weiter heraus als hinten ≈ +3° Castor

### 1.2 UCA-Shims an der Querachse

Gesamtdicke angeben, **nicht Stückzahl** — Ford liefert 1/32" und 1/8" gemischt.

| Position | LF | RF |
|---|---:|---:|
| vorderer Bolzen (mm) | | |
| hinterer Bolzen (mm) | | |
| **Differenz vorn − hinten** | | |

**Grenzen (Ford):** Differenz max. 1/16" (1,6 mm) · Gesamtpaket je Bolzen max. 9/16" (14,3 mm)
☐ Differenzgrenze eingehalten  ☐ Paketgrenze eingehalten

### 1.3 LCA Camber Kit (`SOT-LCACK65-66`)

| | LF | RF |
|---|---:|---:|
| **Plattennummer** (#1 = Serienposition) | | |

☐ Beide Seiten gleiche Nummer

### 1.4 Strut Rods

| | LF | RF |
|---|---:|---:|
| Länge / Einstellmaß (mm) | | |

---

## 2. Messgrößen — was dabei herauskommt

> Diese Werte sind das **Messergebnis**. Sie sagen, was die Stellgrößen bewirkt haben.

| Parameter | LF | RF | Differenz | Grenze |
|---|---:|---:|---:|---|
| Castor | | | | max. 1/2°, **bevorzugt 1/4°** |
| Camber | | | | max. 1/2°, **bevorzugt 1/4°** |
| KPI / SAI | | | | Diagnosewert |
| Included Angle | | | | Konvention noch offen |

**Messmittel:** ☐ Dunlop CG/4 (Camber)  ☐ Dunlop CG/5 + CG/6 (Castor/KPI)  ☐ anderes: ______
**Messfläche geprüft:** ☐ ja  **Querneigung:** ______  **Längsneigung:** ______
**Wiederholungsmessung durchgeführt:** ☐ ja → **Abweichung:** ______

---

## 3. Spurweite

Nur erforderlich, wenn LCA Camber Kit oder UCA-Länge verändert wurde.

**Spurweite vorn (mm):**
**Änderung gegenüber letzter Messung:**

---

## 4. Toe

**Method:**
- [ ] Longacre Toe Plates
- [ ] Scribed tire
- [ ] Strings
- [ ] Other

**Front distance F:**
**Rear distance R:**
**Total Toe = R − F:**  → positiv = Toe-in ([`CONVENTIONS.md`](CONVENTIONS.md) §7)

**Messdurchmesser / Messbasis D:**  *(nötig für Umrechnung mm ↔ Grad)*

| Wheel | Individual Toe |
|---|---:|
| LF | |
| RF | |

**Steering box centered:** yes / no
**Steering wheel centered:** yes / no

---

## 5. Ackermann / Turning Angle

> Ford: *„The turning angle **cannot be adjusted directly**… If the turning angle does not measure to specifications, **check the spindle or other suspension parts for a bent condition**."* — Diagnosegröße, keine Einstellgröße.

| Direction | Inner wheel | Outer wheel | Delta |
|---|---:|---:|---:|
| Left turn (inner 20°) | | | |
| Right turn (inner 20°) | | | |

**CG/6 zero checked:** yes / no
**Symmetrie L/R plausibel:** ☐ ja  ☐ nein → Bauteilprüfung

---

## 6. Verstelltabelle — Beitrag dieser Session

> Jede dokumentierte Änderung erweitert die **fahrzeugspezifische** Verstelltabelle.
> Sie ersetzt mit der Zeit jede Literaturangabe.

| Was geändert | von | auf | Camber vorher | Camber nachher | Castor vorher | Castor nachher |
|---|---|---|---:|---:|---:|---:|
| | | | | | | |
| | | | | | | |

**Abgeleitete Größenordnung dieser Session:**
- Grad Camber je LCA-Plattenstufe: ______
- Grad Castor je mm Shim gegenläufig: ______
- Grad Camber je mm Shim gleichsinnig: ______

---

## 7. Final Verification

- [ ] Vehicle rolled back
- [ ] Vehicle rolled forward
- [ ] Suspension settled (Prozedur nach [`02_WORKFLOW.md`](02_WORKFLOW.md) §17)
- [ ] Castor rechecked
- [ ] Camber rechecked
- [ ] KPI documented
- [ ] Total toe rechecked
- [ ] Individual toe rechecked
- [ ] Full lock clearance checked
- [ ] **Bump Steer geprüft** — zwingend nach LCA-Kit- oder UCA-Längenänderung
- [ ] Stellgrößen **und** Messgrößen vollständig eingetragen

**Notes:**
