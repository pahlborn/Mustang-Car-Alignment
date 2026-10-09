# Migrations- und Auditprotokoll

**Dokumentrolle:** Temporäres Migrations- und Auditprotokoll
**Version:** 0.3
**Datum:** 2026-10-05
**Status:** Aktiv bis Abschluss der Strukturmigration; danach nach `archive/` verschieben

---

## 1. Zweck und Lebenszyklus

Diese Datei dokumentiert die Umstellung vom losen Dateibestand (`temp/`) auf einen konsolidierten Stand (`temp3/`) mit eindeutigen Autoritäten.

Sie ist **kein dauerhaftes Fach- oder Governance-Dokument**. Nach Abschluss der Migration wird sie als Nachweis nach `archive/` verschoben.

---

## 2. Autoritätskette

Bei Widersprüchen gilt:

1. [`CONVENTIONS.md`](CONVENTIONS.md) — Definitionen, Vorzeichen, Formeln, IDs, Statusvokabular
2. [`00_PROJECT.md`](00_PROJECT.md) — konkretes Fahrzeug, Hardware, Messmittel, Baseline
3. [`02_WORKFLOW.md`](02_WORKFLOW.md) — Reihenfolge, Rückkopplungen, Gesamtprozess

Aufbau und Dokumentrollen: [`01_ARCHITECTURE.md`](01_ARCHITECTURE.md).

Ergänzend, ohne Konfliktpotenzial:

- [`GLOSSAR.md`](GLOSSAR.md) — **erklärt** Begriffe. `CONVENTIONS.md` **legt fest**. Bei Widerspruch gilt Conventions.

---

## 3. Aktueller Dateibestand

### Autoritäten

| Datei | Rolle |
|---|---|
| `CONVENTIONS.md` | Vorzeichen, Formeln, IDs, Statusvokabular |
| `00_PROJECT.md` | Fahrzeug, Hardware, Messmittel, Baseline, Fahrzeugkonstanten |
| `02_WORKFLOW.md` | Gesamtablauf in 22 Phasen |
| `GLOSSAR.md` | 51 Begriffe in 9 Kategorien |

### Grundlagen (neu erstellt)

| Datei | Inhalt |
|---|---|
| `CHAPTER_VEHICLE_DYNAMICS.md` | Kräfte, Lasttransfer, Kurvenphasen, **Umsetzbarkeitsgrenzen** |
| `CHAPTER_TIRE_MECHANICS.md` | Schräglauf, Load Sensitivity, Camber, Druck, Temperatur |
| `CHAPTER_SPRINGS_ROLL_STIFFNESS.md` | Motion Ratio, Rollsteifigkeit, TLLTD, Stellgrößen-Rangfolge |

### Fachkapitel

| Datei | Herkunft | Status |
|---|---|---|
| `CHAPTER_FRONT_ADJUSTMENT_UCA_LCA.md` | **neu** | Einstellmechanik, aus Ford + SoT belegt |
| `CHAPTER_FRONT_GEOMETRY_CAMBER_CASTER_KPI.md` | `temp/` | bereinigt, §8/§9/§13 aufgelöst |
| `CHAPTER_BALANCE_CORNER_WEIGHT.md` | `temp/` | Cross-Weight-Umsetzbarkeit ergänzt |
| `CHAPTER_SETUP_PAD_RIDE_HEIGHT.md` | `temp/` | Shelby-Drop-Abschnitt aus Quelle B-01 neu |
| `CHAPTER_REAR_SUSPENSION_PANHARD_PINION.md` | `temp/` | Spicer/TREMEC belegt, Panhard-Widerspruch geglättet |
| `CHAPTER_TOE_ACKERMANN_THRUST.md` | `temp/` | Citation-Artefakte entfernt |
| `CHAPTER_BUMP_STEER.md` | `temp/` | **Statushinweis: Messung derzeit nicht möglich** |
| `CHAPTER_BIND_DIAGNOSIS.md` | **neu** | Bind, Überbestimmung, Testverfahren |
| `CHAPTER_TRACK_VALIDATION_TIRES.md` | `temp/` | Verweis auf Streckenkapitel |
| `CHAPTER_TRACKS.md` | **neu** | 5 Projektstrecken, Setup-Hypothesen |
| `CHAPTER_HANDLING_DIAGNOSIS_DECISION_TREE.md` | `temp/` | Verweise auf Bind und Stellgrößen |
| `LEGACY_REAR_AXLE_LEAF_SPRINGS_PINION.md` | `temp/` | unverändert übernommen |

### Entscheidungsvorlagen und Formulare

| Datei | Inhalt |
|---|---|
| `DECISION_LEAF_SPRINGS.md` | Blattfeder/Shackle-Entscheidung, offen |
| `TEMPLATE_ALIGNMENT_SHEET.md` | Stellgrößen und Messgrößen getrennt |
| `TEMPLATE_SETUP_SHEET.md` | Kategorie-C-Felder mit Rechenkette |

---

## 4. Was in `temp/` verbleibt

| Datei | Grund |
|---|---|
| `MASTER_CONCEPT.md` | enthält Architekturanteil für ein künftiges `01_ARCHITECTURE.md` |
| `CONTENT_SPECIFICATION.md` | dito — Seitenspezifikation |
| `HANDOFF_MUSTANG_CAR_ALIGNMENT.md` | überholt, archivieren |
| `MASTER_WORKFLOW_...md` | durch `02_WORKFLOW.md` ersetzt |
| `mustang-1966-track-alignment.md` | V1.0-Werkstattdokument, Fachinhalte teilweise übernommen |
| `TEMPLATE_SCALE_SHEET.md` u. a. | noch nicht überarbeitet |

---

## 5. Durchgeführte Korrekturen

### Phase 1–3 — Strukturkonsolidierung

- `CONVENTIONS.md`, `00_PROJECT.md`, `02_WORKFLOW.md` als Autoritäten angelegt
- Doppelheader, `FL/FR/RL`, „Baseline V1", doppelte Prioritätslisten bereinigt
- Statusvokabular `Verifiziert / Projektangabe / Legacy-Angabe / Offen` eingeführt

### Phase 4 — Inhaltliche Prüfung

| Befund | Ergebnis |
|---|---|
| UCA-Shim-Logik angeblich widersprüchlich | **Fehlalarm** — Aussage war korrekt, Vorzeichen übersehen |
| Shim-Mechanik unvollständig | aus **Ford Shop Manual 1966** belegt, Größenordnungen ergänzt |
| Citation-Artefakte, 23 Stellen | entfernt, Aussagen gegen Spicer/TREMEC geprüft |
| TREMEC-Differenzwert fehlte | **2°** ergänzt, Abweichung zu Spicer (1°) benannt |
| Spicer RPM-Tabelle fehlte | ergänzt |
| Panhard „zentriert die Achse" | zu „definiert die laterale Position" korrigiert |
| Shelby Drop „macht nicht tiefer" | präzisiert: **ca. 5/8" tiefer**, aber Wirkung aus Roll Center |
| Federraten/Rollsteifigkeit fehlte | neues Kapitel |
| Reifenphysik fehlte | neues Kapitel |
| Fahrdynamik-Grundlagen fehlten | neues Kapitel |

### Phase 5 — Umsetzbarkeitsprüfung

Auf Hinweis, dass ein Fahrzeug von 1966 begrenzte Verstellmöglichkeiten hat:

| Befund | Korrektur |
|---|---|
| **Cross Weight nicht gezielt einstellbar** | keine höhenverstellbaren Federauflagen → als **Diagnosegröße** eingeordnet |
| Bump Steer nicht messbar | Messvorrichtung fehlt → Statushinweis im Kapitel |
| Aerodynamik | begründet abgegrenzt statt kommentarlos weggelassen |
| Stellgrößen-Rangfolge | um Spalte „an diesem Fahrzeug verfügbar" erweitert |
| Fehlende Messmittel | Übersicht mit Anschaffungsreihenfolge in `00_PROJECT.md` §7 |

---

## 6. Quellenlage

26 Quellen in `docs/quellen/` mit `SHA256SUMS` und Register.

| Klasse | Umfang |
|---|---|
| **A** | Ford Shop Manual 1966, SoT Einbauanleitung, Spicer, TREMEC, 19 Longacre-Artikel |
| **B** | Arning/Shelby Drop |
| **C** | Maier Racing Alignment, MMI MOD Leaf Springs |

**Projektentscheidung Fachliteratur:** Milliken, Carroll Smith und Herb Adams werden **nicht gespiegelt** — zwei davon sind leihbeschränkt. Belege erfolgen durch Zitat mit Werk, Auflage und Seite aus rechtmäßig beschafftem Exemplar.

---

## 7. Offen

### Strukturell

- `01_ARCHITECTURE.md` aus `MASTER_CONCEPT.md` und `CONTENT_SPECIFICATION.md` ableiten
- Altdateien in `temp/` archivieren
- Restliche Templates überarbeiten (`TEMPLATE_SCALE_SHEET`, `TEMPLATE_TRACK_SESSION_SHEET`, `TEMPLATE_BUMP_STEER_SHEET`, `TEMPLATE_CHANGE_LOG`, `TEMPLATE_MASTER_SETUP_SHEET`)
- Versionierung der Dateien vereinheitlichen

### Fachlich — blockierend

| Was | Warum blockierend |
|---|---|
| `motion_ratio_front` | ohne das keine Rollsteifigkeit berechenbar |
| `leaf_spacing_rear` | dito, Hinterachse |
| `cg_height` | bestimmt den gesamten Lasttransfer |
| Bind-Test | ohne reproduzierbare Messung keine Setup-Arbeit |

### Fachlich — offen

- UCA Cross-Shaft-Variante (Standard / Dropped)
- LCA-Plattennummer ↔ Camber-Richtung
- Teilenummern Federn, Dämpfer, ARB
- Avon CR6ZZ Herstellerdaten
- Baseline-Herkunft
- Blattfeder-Entscheidung (`DECISION_LEAF_SPRINGS.md`)
- Castor-Zielkonflikt Lenkkraft vs. Stabilität (`CHAPTER_TRACKS.md` §8)

---

## 8. Nicht beschaffbar

| Gesucht | Status |
|---|---|
| Shelby GT350R / Trans-Am Werks-Alignment | Foren-Zahlen nicht nachprüfbar, **nicht übernommen** |
| Ford Part 3-6 Spezifikationstabelle | OCR unbrauchbar, Original-PDF 121 MB |
| Maier-Racing-Blattfederraten | Produktseiten nennen keine Werte — Herstelleranfrage nötig |
