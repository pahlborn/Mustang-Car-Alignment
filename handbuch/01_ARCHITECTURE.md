# Mustang Track Chassis Setup — Informationsarchitektur

**Dokumentrolle:** Aufbau des Handbuchs, Dokumentrollen, Seitenstruktur
**Version:** 0.1
**Datum:** 2026-10-05
**Status:** Autoritativ für Gliederung und Dokumentrollen
**Bezug:** [`CONVENTIONS.md`](CONVENTIONS.md) · [`00_PROJECT.md`](00_PROJECT.md) · [`02_WORKFLOW.md`](02_WORKFLOW.md)

---

## 1. Leitprinzip

> **Physik verstehen → Mustang-spezifische Konsequenz ableiten → korrekt messen → am Fahrzeug einstellen → vorhandene Werkzeuge richtig einsetzen → auf der Strecke validieren → dokumentieren**

Werkzeuge sind Hilfsmittel. Das Wissen über Fahrdynamik, Geometrie, Reifen und Radlasten ist die Grundlage.

### Zwei Ergänzungen aus der Projektarbeit

**Kein Sollwert ohne Quelle.** Was nicht belegt ist, wird als offen gekennzeichnet — nicht geraten. Quellenklassen in [`CONVENTIONS.md`](CONVENTIONS.md) §16.

**Nichts aufnehmen, was nicht umgesetzt werden kann.** Ein Fahrzeug von 1966 hat begrenzte Verstellmöglichkeiten. Theorie ohne Handlungsmöglichkeit gehört nicht ins Handbuch — oder ausdrücklich als Erklärung markiert. Übersicht in [`CHAPTER_VEHICLE_DYNAMICS.md`](CHAPTER_VEHICLE_DYNAMICS.md) §9.

---

## 2. Dokumentrollen

Jede Datei hat **genau eine** Rolle. Bei Widerspruch gilt die Reihenfolge.

### Autoritäten

| Rang | Datei | Autoritativ für |
|---:|---|---|
| 1 | [`CONVENTIONS.md`](CONVENTIONS.md) | Vorzeichen, Formeln, IDs, Statusvokabular, Evidenzklassen |
| 2 | [`00_PROJECT.md`](00_PROJECT.md) | konkretes Fahrzeug, Hardware, Messmittel, Baseline, Fahrzeugkonstanten |
| 3 | [`02_WORKFLOW.md`](02_WORKFLOW.md) | Reihenfolge und Rückkopplungen des Gesamtprozesses |

### Ergänzend

| Datei | Rolle |
|---|---|
| [`GLOSSAR.md`](GLOSSAR.md) | **erklärt** Begriffe. `CONVENTIONS.md` **legt fest**. |
| `01_ARCHITECTURE.md` | diese Datei — Gliederung und Rollen |
| [`MIGRATION_1-3.md`](MIGRATION_1-3.md) | temporäres Auditprotokoll |

---

## 3. Ebenenmodell

```text
┌─ EBENE 1 — GRUNDLAGEN ──────────────────────────────┐
│  Warum verhält sich das Fahrzeug so?                │
│                                                     │
│  CHAPTER_TIRE_MECHANICS       was der Reifen kann   │
│  CHAPTER_VEHICLE_DYNAMICS     welche Kräfte wirken  │
│  CHAPTER_SPRINGS_ROLL_STIFF   wie wir sie verteilen │
└──────────────────────┬──────────────────────────────┘
                       ↓
┌─ EBENE 2 — FAHRZEUGGEOMETRIE ───────────────────────┐
│  Was ist am Mustang wie gebaut und einstellbar?     │
│                                                     │
│  CHAPTER_FRONT_GEOMETRY       Definitionen, Messung │
│  CHAPTER_FRONT_ADJUSTMENT     Einstellmechanik      │
│  CHAPTER_TOE_ACKERMANN_THRUST                       │
│  CHAPTER_BUMP_STEER           Kinematik             │
│  CHAPTER_REAR_SUSPENSION      Hinterachse           │
│  CHAPTER_SETUP_PAD_RIDE_HEIGHT                      │
│  CHAPTER_BALANCE_CORNER_WEIGHT                      │
└──────────────────────┬──────────────────────────────┘
                       ↓
┌─ EBENE 3 — MESSEN UND DIAGNOSE ─────────────────────┐
│  Wie messe ich verlässlich? Was bedeutet das?       │
│                                                     │
│  CHAPTER_BIND_DIAGNOSIS       Messgrundlage         │
│  CHAPTER_TRACK_VALIDATION     Reifendaten           │
│  CHAPTER_HANDLING_DIAGNOSIS   Symptom → Hypothese   │
│  CHAPTER_TRACKS               Streckencharakteristik│
└──────────────────────┬──────────────────────────────┘
                       ↓
┌─ EBENE 4 — ARBEITEN ────────────────────────────────┐
│  02_WORKFLOW          Reihenfolge                   │
│  TEMPLATE_*           Erfassung                     │
│  DECISION_*           offene Entscheidungen         │
└─────────────────────────────────────────────────────┘
```

**Die Leserichtung ist nicht zwingend von oben nach unten.** Wer ein konkretes Problem hat, beginnt in Ebene 3 und geht nach oben, um es zu verstehen.

---

## 4. Kapitelraster

Jedes Fachkapitel folgt möglichst diesem Aufbau:

| # | Abschnitt | Zweck |
|---|---|---|
| 1 | **Einordnung** | Warum gibt es dieses Kapitel, was grenzt es ab |
| 2 | **Physik** | technische Erklärung ohne Werkzeugbezug |
| 3 | **Am 1966 Mustang** | konkrete Geometrie, vorhandene Komponenten |
| 4 | **Wechselwirkungen** | was ändert sich mit |
| 5 | **Messen** | Messprinzip und vorhandenes Werkzeug |
| 6 | **Einstellen** | konkrete Maßnahme — oder: warum nicht einstellbar |
| 7 | **Kontrollmessung** | was danach erneut zu prüfen ist |
| 8 | **Track-Validierung** | welche Daten die Änderung bestätigen |
| 9 | **Fehlerbilder** | typische Fehlinterpretationen |
| 10 | **Quellen** | nach Evidenzklasse geordnet |
| 11 | **Offene Punkte** | was noch nicht belegt oder gemessen ist |
| 12 | **Definition of Done** | Fortschrittsmessung |

Nicht jedes Kapitel braucht alle Abschnitte. **Pflicht sind 1, 10, 11 und 12.**

### Warum Definition of Done

Die DoD-Checkboxen sind der Fortschrittsmesser des Projekts. Sie unterscheiden zwischen:

- erledigt `[x]` — belegt und abgeschlossen
- offen `[ ]` — bekannt, aber noch nicht erledigt

> Ein Kapitel ohne DoD liefert keinen Projektstatus.

---

## 5. Umgang mit Werten

### Vier Statusklassen

Nach [`CONVENTIONS.md`](CONVENTIONS.md) §15 und §17:

| Klasse | Bedeutung |
|---|---|
| **Measurement** | an diesem Fahrzeug gemessen |
| **Baseline** | eingefrorener Vergleichszustand |
| **Target** | bewusst angestrebter Wert |
| **Source Example** | Wert aus fremder Quelle |

### Stellgröße ≠ Messgröße

Eine Plattennummer ist keine Gradzahl. Eine Shim-Dicke ist keine Gradzahl.

| | Was | Wofür |
|---|---|---|
| **Stellgröße** | Plattennummer, Shim-Dicke, Umdrehungen | Reproduzierbarkeit |
| **Messgröße** | gemessener Winkel | Wirkung |

Beide gehören erfasst. Aus ihrem Verhältnis entsteht die fahrzeugspezifische Verstelltabelle — das eigentliche Ergebnis der Setup-Arbeit.

### Drei Datenkategorien

| Kat. | Was | Wo gepflegt |
|---|---|---|
| **A** | Hardware-Identität | [`00_PROJECT.md`](00_PROJECT.md) §3–6 |
| **B** | Fahrzeugkonstanten | [`00_PROJECT.md`](00_PROJECT.md) §8.2 |
| **C** | Setup-Größen | [`TEMPLATE_SETUP_SHEET.md`](TEMPLATE_SETUP_SHEET.md) |

---

## 6. Formularlandschaft

| Formular | Wann | Umfang |
|---|---|---|
| [`TEMPLATE_MASTER_SETUP_SHEET.md`](TEMPLATE_MASTER_SETUP_SHEET.md) | Baseline einfrieren | vollständig |
| [`TEMPLATE_SETUP_SHEET.md`](TEMPLATE_SETUP_SHEET.md) | je Setup-Session | veränderliche Größen + Rechenkette |
| [`TEMPLATE_ALIGNMENT_SHEET.md`](TEMPLATE_ALIGNMENT_SHEET.md) | Alignment-Arbeit | Stell- und Messgrößen Vorderachse |
| [`TEMPLATE_SCALE_SHEET.md`](TEMPLATE_SCALE_SHEET.md) | Radlastmessung | Corner Weights, Reproduzierbarkeit |
| [`TEMPLATE_BUMP_STEER_SHEET.md`](TEMPLATE_BUMP_STEER_SHEET.md) | Kinematikmessung | Anleitung + Kurve |
| [`TEMPLATE_TRACK_SESSION_SHEET.md`](TEMPLATE_TRACK_SESSION_SHEET.md) | je Stint | Trackdaten |
| [`TEMPLATE_CHANGE_LOG.md`](TEMPLATE_CHANGE_LOG.md) | je Änderung | A/B-Validierung |

---

## 7. Werkzeuge — wo was steht

Werkzeugbedienung ist **kein eigenes Kapitel**, sondern steht dort, wo gemessen wird. Diese Tabelle ist der Einstieg:

| Werkzeug | Verfahren beschrieben in |
|---|---|
| **Dunlop CG/4** — Camber | [`CHAPTER_FRONT_GEOMETRY_CAMBER_CASTER_KPI.md`](CHAPTER_FRONT_GEOMETRY_CAMBER_CASTER_KPI.md) §10 |
| **Dunlop CG/5** — Castor, KPI | dito, 20° IN → 20° OUT, additive Skala |
| **Dunlop CG/6** — Turnplates, Ackermann | [`CHAPTER_TOE_ACKERMANN_THRUST.md`](CHAPTER_TOE_ACKERMANN_THRUST.md) §16 |
| **Longacre Waagen** | [`CHAPTER_BALANCE_CORNER_WEIGHT.md`](CHAPTER_BALANCE_CORNER_WEIGHT.md) §13, Protokoll in [`TEMPLATE_SCALE_SHEET.md`](TEMPLATE_SCALE_SHEET.md) |
| **Longacre Toe Plates** | [`CHAPTER_TOE_ACKERMANN_THRUST.md`](CHAPTER_TOE_ACKERMANN_THRUST.md) §5–7 |
| **Tire Scribe** | dito §8 |
| **String Alignment** | dito §10 |
| **B-G BGR310 Bump Steer Gauge** | [`TEMPLATE_BUMP_STEER_SHEET.md`](TEMPLATE_BUMP_STEER_SHEET.md) |
| **Longacre Pyrometer** | [`CHAPTER_TRACK_VALIDATION_TIRES.md`](CHAPTER_TRACK_VALIDATION_TIRES.md) §8–12 |
| **Longacre Druckprüfer** | dito §4–5 |
| **Shore-A-Durometer** | dito §16–21 |

> **Begründung für diese Aufteilung:** Ein separates Tool-Kapitel würde dieselben Verfahren ein zweites Mal beschreiben — und die beiden Fassungen würden auseinanderlaufen. Das ist derselbe Fehlermodus, den `CONVENTIONS.md` für Zahlenwerte verhindert.

Gerätespezifische Daten (Genauigkeit, Messbereiche) stehen in `docs/quellen/`.

---

## 8. Quellenorganisation

Alle Quellen liegen gespiegelt in `docs/quellen/` mit Prüfsummen in `SHA256SUMS` und einem Register in `README.md`.

### Regel

> Eine technische Aussage darf sich nur auf eine Quelle berufen, die **lokal vorliegt** oder ausdrücklich als „nicht beschaffbar" geführt ist.

### Ausnahme Fachliteratur

Bücher werden **nicht gespiegelt**. Belege erfolgen durch Zitat mit Werk, Auflage und Seite aus einem rechtmäßig beschafften Exemplar. Begründung im Quellenregister.

---

## 9. Was dieses Handbuch nicht behandelt

| Thema | Begründung |
|---|---|
| Aerodynamik | keine verstellbare Hardware am Fahrzeug |
| Bremsbalance | eigenes Fachgebiet; in der Diagnose als Ursache genannt |
| Differentialabstimmung | TrueTrac nicht einstellbar |
| Dämpferkennlinien | nur bei verstellbaren Dämpfern sinnvoll |
| Motor und Antrieb | anderes Projekt (`gt40-engine`, `jerico-dog-box`) |
| Fahrtechnik, Ideallinien | beschreibt das Fahrzeug, nicht das Fahren |

Ausführlich in [`CHAPTER_VEHICLE_DYNAMICS.md`](CHAPTER_VEHICLE_DYNAMICS.md) §9.5.

---

## 10. Pflegeregeln

| Was | Regel |
|---|---|
| **Neuer Begriff** | in [`GLOSSAR.md`](GLOSSAR.md), nicht im Kapitel erklären |
| **Neue Konvention** | in [`CONVENTIONS.md`](CONVENTIONS.md), nicht im Kapitel festlegen |
| **Neuer Fahrzeugwert** | in [`00_PROJECT.md`](00_PROJECT.md), Kapitel verweisen darauf |
| **Neue Quelle** | nach `docs/quellen/`, `SHA256SUMS` und Register aktualisieren |
| **Wert an zweiter Stelle nötig** | verlinken oder berechnen — **nicht abschreiben** |
| **Kapitel überarbeitet** | Definition of Done mitziehen |
| **Hypothese widerlegt** | streichen, nicht umformulieren |

> **Die wichtigste Regel:** Steht ein Wert an zwei Stellen, laufen die Fassungen auseinander. Das ist im Schwesterprojekt `jerico-dog-box-assembly-manual` neunmal passiert und dort als Regel 4 dokumentiert.

---

## 11. Offene Strukturpunkte

- [ ] Altdateien in `temp/` archivieren
- [ ] Versionierung der Dateien vereinheitlichen
- [ ] Entscheidung über Zielmedium — Markdown-Sammlung oder Website
- [ ] Falls Website: Glossar nach `glossar.js` portieren
- [ ] Index mit Statusmatrix über alle Kapitel
