# Entscheidungsvorlage: Blattfedern und Shackle-Buchsen

**Dokumentrolle:** Entscheidungsvorlage — Optionen belegt nebeneinander, Bewertung offen
**Version:** 0.1
**Datum:** 2026-10-05
**Status:** Recherche abgeschlossen; **Entscheidung nicht getroffen** — es fehlen Messwerte
**Bezug:** [`00_PROJECT.md`](00_PROJECT.md) §4 · [`CHAPTER_SPRINGS_ROLL_STIFFNESS.md`](CHAPTER_SPRINGS_ROLL_STIFFNESS.md) · [`CHAPTER_REAR_SUSPENSION_PANHARD_PINION.md`](CHAPTER_REAR_SUSPENSION_PANHARD_PINION.md)

---

## 1. Die Frage

Im Projekt steht: Nach Einbau von **Delrin-Shackles** — sollen dann Blattfedern von **Mike Maier Inc.** oder **Maier Racing** verbaut werden?

Die Recherche hat ergeben, dass die Frage so nicht gestellt werden sollte. Drei Gründe:

1. Es sind **zwei verschiedene Firmen** (§2)
2. Der Hersteller der MOD-Federn **rät von festen Shackle-Buchsen ausdrücklich ab** (§4)
3. Entscheidend ist nicht die Marke, sondern die **Federrate** — und deren Wirkung ist ohne drei fehlende Messwerte nicht bestimmbar (§6)

---

## 2. Namensklärung — zwei Firmen

| | **Maier Racing** / Maier Corporation | **Mike Maier Inc. (MMI)** |
|---|---|---|
| Ort | San Leandro → Hayward, CA | Livermore, CA |
| Gegründet | 1969 durch **Bill Maier** | neuere Firma |
| Schwerpunkt | 1965–70 Mustang, Fiberglas + Fahrwerk | 64–73 Mustang, 2015+ Mustang, Falcon |
| Web | `maierracing.com` / `maiercorp.com` | `mikemaierinc.com` |

Beide sind im klassischen Mustang-Rennsport etabliert, aber getrennte Unternehmen mit eigenen Produktlinien. Die im Altbestand zitierten Aussagen zu Traction Bars und Rear-Stabilisator stammen von **Maier Racing** (siehe `CHAPTER_REAR_SUSPENSION_PANHARD_PINION` §19–20), die Alignment-Empfehlungen in [`00_PROJECT.md`](00_PROJECT.md) §8 teils von beiden.

---

## 3. Die Optionen im Vergleich

| | **Ist-Zustand** | **Option A: MMI MOD** | **Option B: MMI MOD Narrow** | **Option C: Maier Racing** |
|---|---|---|---|---|
| Teilenummer | `SCD-C5ZZ-5560-4ME` | — | — | — |
| **Rate** | **175 lb/in** | **165 lb/in** | „slightly stiffer" als MOD | **nicht ermittelt** |
| Bauart | 4,5 Lagen, Mid-Eye | Extra 2 Lagen vorn, schwerer Wrap | wie MOD, 1 3/4" schmal | nicht ermittelt |
| Breite | Serie | Serie | **1 3/4"** | nicht ermittelt |
| Ride Height | ca. 1" tiefer als Serie | ca. 8" Pinchweld-Boden | wie MOD | nicht ermittelt |
| Preis | $177.95/Stück | $589/Paar | höher | nicht ermittelt |
| Quelle | A-10 / SoT-Katalog | C-02 | C-02 | — |

### Bemerkenswert

**Die MMI-Rate liegt mit 165 lb/in unter dem Istzustand von 175 lb/in.** Ein Wechsel auf MMI MOD wäre also keine Versteifung, sondern eine leichte Erweichung der Tragrate — bei gleichzeitig deutlich steiferem vorderen Federabschnitt.

Das ist kein Widerspruch: MMI trennt bewusst zwischen **Tragrate** (vertikal, bleibt moderat) und **Wickelsteifigkeit** (Axle Wrap, wird erhöht):

> „our springs have been designed with an **extra two leaves toward the front**, with a beefy wrap to add additional strength. We have guys with 900+ hp applications running these springs and they're still not experiencing wheel hop."
> — MMI, Quelle C-02

**Maier Racing** konnte ich nicht belastbar erfassen. Die Produktseiten unter `maierracing.com` liefern keine Federraten; der zuvor verlinkte Pfad `/product/mustang-rear-suspension-kit/` ist tot. In Foren wird die Feder beschrieben als „designed to prevent wheel hop because of the stiffer bushings and spring stack" — das ist **nicht nachprüfbar** und wird hier nicht als Datum geführt.

---

## 4. Der zentrale Befund — MMI widerspricht der Delrin-Idee

Das ist der wichtigste Punkt dieser Vorlage. MMI äußert sich ausdrücklich zu festen Shackle-Buchsen:

> „More often than not, people end up selecting a **solid or urethane bushing for the spring saddle** which we've found to be **problematic for two reasons**. First, it makes the **ride extremely harsh**, and second, it actually **binds up the rear and prevents the suspension from working well during cornering**."

> „For a stock setup, leafs have **two jobs**: they move **up and down** to absorb shocks, but they also move **side to side**, working to keep the axle centered. During cornering, the leaf is moving both up and down, and side to side, absorbing bumps through the turn without knocking the car off course. **Replacing the bushing with a solid material prevents the spring from moving side to side, increasing bind and ultimately resulting in unpredictable feel.** That's why we **actually prefer the stock rubber for the leaf shackles** as it allows the suspension to do it's job."
> — MMI, Quelle C-02

### MMI unterscheidet zwei Positionen

| Position | MMI-Empfehlung | Begründung |
|---|---|---|
| **vorderes Federauge** (eyelet) | **Polyurethan** | kontrolliert Längskräfte bei Beschleunigen/Bremsen |
| **hinterer Shackle** | **Gummi (Serie)** | laterale Bewegung muss möglich bleiben |

MMI liefert folgerichtig „polyurethane front eyelet bushings, **and a rubber shackle kit**".

### Das deckt sich mit einem bereits dokumentierten Befund

`CHAPTER_REAR_SUSPENSION_PANHARD_PINION` §5 enthält bereits die Global-West-Warnung:

> Eine zusätzliche Panhard Bar zusammen mit sehr stark lateral kontrollierenden Blattfederbuchsen kann **Bind erzeugen**.

**Unser Fahrzeug hat eine Panhard Bar.** Damit greifen zwei unabhängige Herstellerwarnungen ineinander:

```text
Panhard Bar          → führt die Achse lateral
      +
Delrin-Shackles      → verhindern laterale Federbewegung
      ↓
beide wollen dasselbe tun
      ↓
Überbestimmung → BIND
```

> **Das ist der kritischste Punkt der ganzen Vorlage.** Eine Starrachse hat nur **einen** lateralen Freiheitsgrad. Wird er doppelt festgelegt — einmal über den Panhard, einmal über steife Shackle-Buchsen — verspannt sich das System. Die Folgen stehen in `CHAPTER_BALANCE_CORNER_WEIGHT` §11: nicht reproduzierbare Radlasten, Hysterese, unvorhersehbares Verhalten über Bodenwellen.

---

## 5. Bewertung der Delrin-Frage

### Was für Delrin spricht

| Argument | Bewertung |
|---|---|
| Präzisere Achsführung | gilt — **wenn kein Panhard vorhanden ist** |
| Weniger Compliance Steer | gilt grundsätzlich |
| Haltbarkeit | gilt |

### Was dagegen spricht

| Argument | Quelle |
|---|---|
| Bind bei gleichzeitigem Panhard | Global West, über `CHAPTER_REAR` §5 |
| Verhindert nötige laterale Federbewegung | MMI, Quelle C-02 |
| Harsche Fahreigenschaften | MMI, Quelle C-02 |
| Verfälscht Radlastmessung | `CHAPTER_BALANCE_CORNER_WEIGHT` §11 |

### Differenzierte Zwischenposition

Die beiden Positionen sind **nicht gleichwertig**:

| Einbauort | Delrin sinnvoll? | Begründung |
|---|---|---|
| **vorderes Federauge** | **ja, oder Polyurethan** | Längsführung, kaum Querbewegung nötig — MMI empfiehlt hier selbst Urethan |
| **hinterer Shackle** | **kritisch** | genau hier findet die laterale Ausgleichsbewegung statt |

> **Vorschlag zur Prüfung:** Falls die Delrin-Shackles bereits verbaut sind, ist die erste Frage nicht „welche Federn", sondern **„erzeugt die Kombination Panhard + Delrin-Shackle bereits Bind?"** Das ist messbar (§7).

---

## 6. Warum die Federwahl noch nicht entscheidbar ist

Jede Änderung der hinteren Federrate verschiebt die Balance:

```text
Blattfeder härter → Rollsteifigkeit hinten höher → mehr Lasttransfer hinten
                  → Load Sensitivity → Hinterachse verliert anteilig
                  → Richtung ÜBERSTEUERN
```

Bei einer Blattfeder lassen sich Tragrate und Rollsteifigkeit **nicht trennen** ([`CHAPTER_SPRINGS_ROLL_STIFFNESS.md`](CHAPTER_SPRINGS_ROLL_STIFFNESS.md) §5.2). Wie stark der Effekt ist, hängt ab von:

| Fehlende Größe | Wofür | Status |
|---|---|---|
| `leaf_spacing_rear` | geht **quadratisch** in die Rollsteifigkeit hinten ein | **offen** |
| `motion_ratio_front` | ohne das keine Verteilung berechenbar | **offen** |
| `cg_height` | bestimmt das gesamte Rollmoment | **offen** |

> **Ohne diese drei Werte lässt sich nicht sagen, ob ein Wechsel von 175 auf 165 lb/in eine spürbare Balanceänderung bedeutet oder im Rauschen verschwindet.**

### Der Gegenhebel existiert

Der vordere ARB hat 1" Durchmesser ([`00_PROJECT.md`](00_PROJECT.md) §3). Ein Wechsel auf 1-1/8" erhöht den Stabi-Beitrag vorn um **60 %** — das ist der direkte Gegenhebel zu einer Versteifung hinten. Es gibt also Spielraum, falls eine Federänderung die Balance zu weit verschiebt.

---

## 7. Empfohlenes Vorgehen

### Schritt 1 — Istzustand klären, bevor gekauft wird

| Prüfung | Verfahren |
|---|---|
| **Sind die Delrin-Shackles bereits verbaut?** | Sichtprüfung |
| **Bind-Test** | Vollständiges Verfahren in [`CHAPTER_BIND_DIAGNOSIS.md`](CHAPTER_BIND_DIAGNOSIS.md) §6 |
| **Test auf laterale Überbestimmung** | [`CHAPTER_BIND_DIAGNOSIS.md`](CHAPTER_BIND_DIAGNOSIS.md) §6.3 — Panhard lösen, Radlasten vergleichen |
| Panhard-Geometrie | Länge, Höhen, Winkel erfassen (`CHAPTER_REAR` §9) |
| Achse lateral zentriert? | messen |

> **Der aussagekräftigste Einzeltest:** Panhard-Bolzen lösen und wieder einsetzen. Lässt er sich **nicht kraftfrei** einführen, steht die Achse nicht dort, wo der Panhard sie haben will — das ist unmittelbar sichtbare Überbestimmung.

### Schritt 2 — Die drei fehlenden Konstanten messen

`leaf_spacing_rear`, `motion_ratio_front`, `cg_height` — alle drei in [`00_PROJECT.md`](00_PROJECT.md) §8.2 vorbereitet. Verfahren dort beschrieben, mit vorhandener Hardware durchführbar.

### Schritt 3 — Erst dann entscheiden

Mit diesen Werten ist die Rechenkette in [`TEMPLATE_SETUP_SHEET.md`](TEMPLATE_SETUP_SHEET.md) §7 rechenbar. Dann lässt sich vorab abschätzen, was ein Federwechsel bewirkt — statt es auszuprobieren.

### Schritt 4 — Falls Delrin-Shackles Bind erzeugen

Zwei Wege, beide belegbar:

| Weg | Konsequenz |
|---|---|
| **Shackles zurück auf Gummi/Urethan**, Panhard behalten | MMI-Empfehlung; Panhard übernimmt die Lateralführung allein |
| **Delrin behalten, Panhard entfernen** | widerspricht dem Projektansatz; Panhard ist Teil des Rollzentrums-Konzepts |

> Der erste Weg ist der konsistentere: Der Panhard ist die **definierte** Lateralführung mit bekannter Kinematik. Die Blattfeder soll federn, nicht führen.

---

## 8. Zwischenergebnis

| Frage | Antwort |
|---|---|
| MMI oder Maier Racing? | **Noch nicht entscheidbar.** Maier-Racing-Daten nicht beschaffbar; MMI-Rate (165) liegt unter dem Istzustand (175) |
| Reicht die vorhandene Feder? | **Vermutlich ja** — 175 lb/in Mid-Eye ist eine Performance-Feder, kein Serienteil |
| Delrin-Shackles sinnvoll? | **Kritisch in Kombination mit Panhard.** Zwei Herstellerquellen warnen |
| Was zuerst? | **Bind-Test und die drei Messungen** — nicht Teile kaufen |

> **Die wahrscheinlichste Erkenntnis:** Das Fahrzeug hat bereits eine ordentliche Blattfeder. Das eigentliche Thema ist nicht die Federrate, sondern ob **Panhard und Shackle-Buchsen zusammen ein überbestimmtes System** bilden.

---

## 9. Offene Punkte

- [ ] Delrin-Shackles verbaut oder geplant?
- [ ] Bind-Test durchgeführt
- [ ] `leaf_spacing_rear` gemessen
- [ ] `motion_ratio_front` gemessen
- [ ] `cg_height` bestimmt
- [ ] Panhard-Geometrie erfasst
- [ ] Maier-Racing-Federdaten beschafft (direkt anfragen)
- [ ] MMI MOD Narrow — konkrete Rate erfragen („slightly stiffer" ist keine Zahl)
- [ ] Entscheidung getroffen und begründet

---

## 10. Quellen

**Quelle C-02** — `docs/quellen/C-02-mmi-mod-leaf-springs.md`
Mike Maier Inc., MOD Leaf Springs 64-73 Mustang. Belegt: Konstruktionsprinzip, Rate 165 lb/in (über Speedway-Motors-Katalogtext), Empfehlung Urethan vorn / Gummi hinten mit Begründung, Ride Height ca. 8" Pinchweld, 2°-Wedge-Empfehlung mit Begründung über reduzierten Axle Wrap.

**Quelle C-01** — `docs/quellen/C-01-maier-racing-alignment-recommendations.pdf`
Maier Racing, Alignment Recommendations. Keine Federdaten.

**Street or Track** — Produktseite `SCD-C5ZZ-5560-4ME`, belegt 175 lb und ca. 1" Tieferlegung.

**Global West** — über `CHAPTER_REAR_SUSPENSION_PANHARD_PINION` §5: Warnung vor Bind durch Panhard + stark lateral kontrollierende Buchsen.

> **Nicht belegbar:** Maier-Racing-Blattfederraten. Produktseiten nennen keine Zahlen, der frühere Katalogpfad ist tot. Foren-Angaben sind nicht nachprüfbar und werden nicht übernommen. **Direkte Herstelleranfrage nötig.**
