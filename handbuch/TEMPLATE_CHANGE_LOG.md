# Setup Change Log

**Dokumentrolle:** Dokumentation einer einzelnen Setup-Änderung mit A/B-Validierung
**Version:** 0.2
**Bezug:** [`CONVENTIONS.md`](CONVENTIONS.md) §19–20 · [`CHAPTER_HANDLING_DIAGNOSIS_DECISION_TREE.md`](CHAPTER_HANDLING_DIAGNOSIS_DECISION_TREE.md)

---

## 0. Kopfdaten

**Change ID:** `CHG-________-__`
**Datum:** ______________
**Ort:** ☐ Werkstatt ☐ Strecke: ______________

**Ausgangs-Baseline:** `BL-________-__`
**Session A (vorher):** `SES-________-__`
**Session B (nachher):** `SES-________-__`

---

## 1. Problembeschreibung

**Symptomcode** ([`CONVENTIONS.md`](CONVENTIONS.md) §18): ______________

| Feld | Angabe |
|---|---|
| Betroffene Kurvenphase | |
| Wo genau tritt es auf | |
| Bei welcher Geschwindigkeit | |
| Reproduzierbar? | ☐ immer ☐ meist ☐ sporadisch |
| Seitenabhängig? | ☐ nein ☐ nur links ☐ nur rechts |
| Streckenabhängig? | ☐ nein ☐ nur auf: ______ |

> **Diagnoseregel:** Die **früheste problematische Kurvenphase** zuerst lösen. Ist das Einlenken schon unsauber, ist jede Aussage über Mid-corner wertlos.

**Früheste problematische Phase:** ______________

---

## 2. Vorbedingung — ist die Messung belastbar?

> **Ohne diesen Abschnitt kein Eintrag weiter unten.** Setup-Arbeit auf verspanntem Fahrwerk optimiert gegen ein Rauschen.

- [ ] Bind-Test bestanden ([`CHAPTER_BIND_DIAGNOSIS.md`](CHAPTER_BIND_DIAGNOSIS.md) §6.1)
- [ ] Radlasten reproduzierbar
- [ ] Race-Ready-Zustand dokumentiert
- [ ] Reifen in vergleichbarem Zustand (Heat Cycles, Druck)

**Falls nicht erfüllt:** Änderung zurückstellen, zuerst Messgrundlage herstellen.

---

## 3. Belege

### 3.1 Reifen

| Reifen | Kaltdruck | Warmdruck | Anstieg | Außen | Mitte | Innen |
|---|---:|---:|---:|---:|---:|---:|
| LF | | | | | | |
| RF | | | | | | |
| LR | | | | | | |
| RR | | | | | | |

**Shore / Alter / Heat Cycles:** ______________
**Reifenbild:** ______________

### 3.2 Fahrwerk

| Parameter | LF | RF | LR | RR |
|---|---:|---:|---:|---:|
| Ride Height | | | | |
| Radlast | | | | |
| Camber | | | — | — |
| Castor | | | — | — |

| Parameter | Wert |
|---|---|
| Cross % | |
| Total Toe | |
| Thrust Angle | |
| ARB vorn, Durchmesser | |
| Bump-Steer-Kurve bekannt? | ☐ ja ☐ nein |
| Panhard-Einstellung | |

### 3.3 Fahrerfeedback

**Kernaussage:**

**Wörtliches Zitat, falls prägnant:**

---

## 4. Hypothese

**Vermutete Ursache:**

**Warum diese Ursache zu den Daten passt:**

**Alternative Erklärungen, die nicht ausgeschlossen sind:**

> **Ehrlichkeitsregel:** Wenn zwei Erklärungen gleich gut passen, hier beide nennen. Eine Änderung, die nur eine davon adressiert, kann auch dann wirken, wenn die Hypothese falsch war.

---

## 5. Geplante Änderung

> **Genau eine primäre Änderung** ([`CONVENTIONS.md`](CONVENTIONS.md) §20).

**Was wird geändert:** ______________________________________

| Feld | Alt | Neu |
|---|---|---|
| Stellgröße | | |
| | | |

### Ist dieser Hebel überhaupt verfügbar?

Prüfen gegen [`CHAPTER_SPRINGS_ROLL_STIFFNESS.md`](CHAPTER_SPRINGS_ROLL_STIFFNESS.md) §6:

- [ ] Hebel ist am Fahrzeug vorhanden
- [ ] Wirkungsstärke passt zum Problem
- [ ] kein stärkerer Hebel verfügbar, der zuerst probiert werden sollte

> Beispiel: Ein Mid-corner-Balance-Problem über Camber lösen zu wollen (Rang 8) ist der schwächste Hebel — ARB-Durchmesser (Rang 1) wäre wirksamer, falls verfügbar.

**Erwartete Primärwirkung:**

**Erwartete Nebenwirkungen:**

**Was könnte schlechter werden:**

### Nachzuprüfen nach der Änderung

Aus der Recheck-Matrix ([`02_WORKFLOW.md`](02_WORKFLOW.md) §27):

- [ ] ______________
- [ ] ______________
- [ ] ______________

---

## 6. Erfolgskriterien — vor dem Test festlegen

| Kriterium | Zielwert |
|---|---|
| Objektive Messgröße | |
| Fahrerbewertung | |
| Rundenzeit / Sektor | |
| **Abbruchkriterium** | |

> **Vorher festlegen, nicht nachher.** Sonst wird jedes Ergebnis zum Erfolg erklärt.

---

## 7. A/B-Vergleich

### A — vorher

| Feld | Angabe |
|---|---|
| Bedingungen (Wetter, Asphalttemp.) | |
| Reifenzustand | |
| Ergebnis | |

### B — nachher

| Feld | Angabe |
|---|---|
| Bedingungen | |
| Reifenzustand | |
| Ergebnis | |

### Vergleichbarkeit

- [ ] gleicher Reifensatz
- [ ] ähnliche Trackbedingungen
- [ ] ähnliche Stintlänge
- [ ] gleicher Fahrer
- [ ] gleiche Streckentemperatur ±5 °C

**Falls nicht vergleichbar:** Was weicht ab und wie stark?

---

## 8. Entscheidung

- [ ] **Änderung behalten**
- [ ] **Zurücknehmen**
- [ ] Test wiederholen
- [ ] **Nicht aussagekräftig**
- [ ] andere Ursache untersuchen

**Begründung:**

> „Nicht aussagekräftig" ist ein **valides Ergebnis**. Es wird dokumentiert, nicht wegerklärt.

### Bei Übernahme

**Neue Baseline ID:** `BL-________-__`

- [ ] Vollständiger Setup-Stand erfasst ([`TEMPLATE_SETUP_SHEET.md`](TEMPLATE_SETUP_SHEET.md))
- [ ] Alle abhängigen Größen nachgeprüft
- [ ] [`00_PROJECT.md`](00_PROJECT.md) aktualisiert, falls Hardware betroffen

> Eine neue Baseline-ID entsteht **nur**, wenn der neue Zustand vollständig dokumentiert ist ([`CONVENTIONS.md`](CONVENTIONS.md) §19).

---

## 9. Erkenntnis für das Projekt

> Wenn diese Änderung etwas über das Fahrzeug gelehrt hat, das über den Einzelfall hinausgeht — hier festhalten.

**Was wir jetzt wissen:**

**Beitrag zur fahrzeugspezifischen Verstelltabelle:**

| Stellgröße | von | auf | gemessene Wirkung |
|---|---|---|---|
| | | | |

**Gehört ins Kapitel:** ______________________
