# Radlast-Messprotokoll

**Dokumentrolle:** Messwerterfassung Corner Weights
**Version:** 0.2
**Messmittel:** Longacre kabelgebundene Corner-Weight-Waagen
**Bezug:** [`CHAPTER_BALANCE_CORNER_WEIGHT.md`](CHAPTER_BALANCE_CORNER_WEIGHT.md) · [`CHAPTER_BIND_DIAGNOSIS.md`](CHAPTER_BIND_DIAGNOSIS.md) · [`CONVENTIONS.md`](CONVENTIONS.md) §11

---

## Vorbemerkung — was dieses Blatt leistet

> **Cross Weight ist an diesem Fahrzeug nicht gezielt einstellbar.** Es fehlen höhenverstellbare Federauflagen ([`CHAPTER_VEHICLE_DYNAMICS.md`](CHAPTER_VEHICLE_DYNAMICS.md) §9.4).
>
> **Dieses Blatt dient deshalb vorrangig der Diagnose:**
>
> | Zweck | Was es zeigt |
> |---|---|
> | **Reproduzierbarkeit prüfen** | ob überhaupt verlässlich gemessen werden kann |
> | **Asymmetrie erkennen** | Federbogen, Bind, Chassistoleranz |
> | **Ausgangszustand einfrieren** | Baseline für spätere Vergleiche |
> | **Wirkung von Änderungen** | nach Feder-, Shim- oder Ride-Height-Arbeit |

---

## 0. Kopfdaten

**Datum:** ______________  **Baseline ID:** `BL-________-__`
**Anlass:** ☐ Baseline ☐ nach Änderung ☐ Bind-Verdacht ☐ Kontrolle

**Waagenmodell:** ______________
**Setup-Pad-Version:** ______________

### Voraussetzungen

- [ ] Pads **coplanar** geprüft
- [ ] Waagen unbelastet genullt — **nie mit Fahrzeug auf den Pads**
- [ ] Warmlaufzeit eingehalten (ca. 1 min)
- [ ] Kabel korrekt zugeordnet LF/RF/LR/RR
- [ ] Plausibilitätsprüfung mit bekannter Masse durchgeführt
- [ ] **Slip-/Rollenplatten verwendet?** ☐ ja ☐ nein → ______________

> Ohne Slip- oder Rollenplatten bleibt Camber-Bind möglich. Longacre: Slip Plates sind *„low friction, not friction free"*. Siehe [`CHAPTER_BIND_DIAGNOSIS.md`](CHAPTER_BIND_DIAGNOSIS.md) §3.

### Race-Ready-Zustand

| Feld | Wert |
|---|---|
| Fahrer oder Ballast | ______ kg |
| Kraftstoffstand | ______ l |
| Reifensatz-ID | |
| Kaltdruck LF/RF/LR/RR | |
| **ARB vorn** | ☐ gelöst ☐ angeschlossen |
| Lenkrad gerade | ☐ |
| Bremse gelöst | ☐ |

> **ARB muss beim Wiegen gelöst oder nachweislich spannungsfrei sein**, sonst misst man ihn mit.

---

## 1. Rohwerte — drei Durchgänge

Zwischen den Durchgängen **anheben und absetzen**, Settling-Prozedur identisch wiederholen.

| Position | Durchgang 1 | Durchgang 2 | Durchgang 3 | max − min |
|---|---:|---:|---:|---:|
| LF | | | | |
| RF | | | | |
| LR | | | | |
| RR | | | | |
| **Total** | | | | |

**Settling-Prozedur:** ______________________________________________

---

## 2. Reproduzierbarkeit — zuerst auswerten

> **Dieser Abschnitt entscheidet, ob die Messung überhaupt verwertbar ist.**

| Größe | Wert |
|---|---:|
| größte Einzelecken-Streuung | ______ kg |
| in % der Gesamtmasse | ______ % |
| Streuung Gesamtgewicht | ______ kg |
| Streuung Cross % | ______ %-Punkte |

**Bewertung** nach [`CHAPTER_BIND_DIAGNOSIS.md`](CHAPTER_BIND_DIAGNOSIS.md) §6.1:

| Streuung | Bewertung | |
|---|---|---|
| < 0,5 % | gut — Setup-Arbeit möglich | ☐ |
| 0,5–1 % | grenzwertig — Ursache suchen | ☐ |
| **> 1 %** | **Bind — nicht weiterarbeiten** | ☐ |

> **Streut Cross stärker als die Einzelecken?** ☐ ja ☐ nein
> Falls ja: Hinweis auf diagonale Verspannung.

**Bei unzureichender Reproduzierbarkeit hier abbrechen** und nach [`CHAPTER_BIND_DIAGNOSIS.md`](CHAPTER_BIND_DIAGNOSIS.md) §7 vorgehen.

---

## 3. Auswertung

Mittelwert der verwertbaren Durchgänge:

| Position | Gewicht |
|---|---:|
| LF | |
| RF | |
| LR | |
| RR | |
| **Total** | |

**Berechnet** nach [`CONVENTIONS.md`](CONVENTIONS.md) §11:

| Größe | Formel | Wert |
|---|---|---:|
| Front % | (LF+RF)/Total | |
| Rear % | (LR+RR)/Total | |
| Left % | (LF+LR)/Total | |
| Right % | (RF+RR)/Total | |
| **Cross %** | **(RF+LR)/Total** | |
| Opposite Cross % | (LF+RR)/Total | |

**Schwerpunktlage längs:**
`Abstand CG von Vorderachse = Radstand × Rear% / 100` = ______ mm

---

## 4. Ride Height während der Messung

| Position | Höhe | Messpunkt |
|---|---:|---|
| LF | | |
| RF | | |
| LR | | |
| RR | | |

**L/R-Differenz vorn:** ______  **hinten:** ______

> **Bekannte Beobachtung:** Die linke Heckseite wurde wiederholt mit ca. 20 mm geringerer Höhe beschrieben ([`00_PROJECT.md`](00_PROJECT.md) §4). Hier prüfen, ob sich das reproduziert — und ob es mit einer Radlastauffälligkeit zusammenfällt.

---

## 5. ARB-Preload-Prüfung

| Zustand | LF | RF | LR | RR | Cross % |
|---|---:|---:|---:|---:|---:|
| ARB **gelöst** | | | | | |
| ARB **angeschlossen** | | | | | |
| **Differenz** | | | | | |

**Bewertung:** ☐ neutral ☐ Preload vorhanden

> Ändern sich die Radlasten beim Anschließen deutlich, wurde Vorspannung eingebracht. Endlinks prüfen.

---

## 6. Beobachtungen und Hypothesen

> Da Cross Weight nicht direkt verstellbar ist, geht es hier um **Ursachenfindung**.

**Auffälligkeiten:**

| Beobachtung | Mögliche Ursache |
|---|---|
| | |
| | |

**Mögliche Ursachenfamilien:**

- [ ] Federbogen links/rechts unterschiedlich (Blattfeder)
- [ ] Bind / Verspannung
- [ ] Chassistoleranz
- [ ] ARB-Preload
- [ ] Ride-Height-Differenz
- [ ] reale Massenverteilung (Batterie, Tank, Ballast)
- [ ] Messfehler / Pad-Ebene

**Hypothese:**

---

## 7. Falls eine Korrektur erfolgt

> **Verfügbare Eingriffe** — alle grob und mit Nebenwirkung:

| Maßnahme | Wirkung | Nebenwirkung |
|---|---|---|
| Flat Shims hinten | Ride Height einer Seite | verändert auch Cross |
| Ballast verschieben | reale Massenverteilung | Gesamtmasse |
| Blattfeder tauschen | Federbogen | größerer Eingriff |

| Schritt | Was geändert | LF | RF | LR | RR | Cross % | Ride Height |
|---:|---|---:|---:|---:|---:|---:|---|
| 0 | Baseline | | | | | | |
| 1 | | | | | | | |
| 2 | | | | | | | |

> **Nach jeder Änderung:** Reproduzierbarkeit erneut prüfen (Abschnitt 2).

---

## 8. Abschluss

| Feld | Wert |
|---|---|
| Erreichtes Cross % | |
| Ride Height akzeptabel | ☐ ja ☐ nein |
| Geometrie beeinträchtigt | ☐ nein ☐ ja → |
| Messung verwertbar | ☐ ja ☐ nein |

> **Projektregel:** Ein perfekter Displaywert ist wertlos, wenn dafür unerwünschte Ride Height, Federbindung, ARB-Vorspannung oder ungünstige Panhard-Geometrie entsteht.

**Notizen:**
