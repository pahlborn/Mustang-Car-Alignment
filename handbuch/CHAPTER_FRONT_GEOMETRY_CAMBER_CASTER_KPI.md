# Mustang Track Chassis Setup — Vorderachsgeometrie: Camber, Castor, KPI/SAI

**Dokumentrolle:** Fachkapitel — Definition, Wirkung und Messung der Vorderachswinkel
**Version:** 0.2
**Datum:** 2026-10-05
**Status:** Fachkapitel
**Bezug:** Einstellmechanik siehe [`CHAPTER_FRONT_ADJUSTMENT_UCA_LCA.md`](CHAPTER_FRONT_ADJUSTMENT_UCA_LCA.md) · Fahrzeugdaten [`00_PROJECT.md`](00_PROJECT.md) · Konventionen [`CONVENTIONS.md`](CONVENTIONS.md)

---

## Abgrenzung

Dieses Kapitel behandelt, **was** die Vorderachswinkel sind, **wie sie wirken** und **wie sie gemessen werden**.

Wie sie an diesem Fahrzeug **verstellt** werden — UCA-Shims nach Ford-Verfahren, Street-or-Track LCA Camber Kit, Strut Rods, deren Wechselwirkung und die Einstellreihenfolge — steht vollständig in [`CHAPTER_FRONT_ADJUSTMENT_UCA_LCA.md`](CHAPTER_FRONT_ADJUSTMENT_UCA_LCA.md).

---

## 1. Warum Camber, Castor und KPI zusammengehören

Diese drei Größen beschreiben gemeinsam die räumliche Lage des Rades und der Lenkachse:

- **Camber**: Radneigung in Vorderansicht
- **Castor**: Lenkachsenneigung in Seitenansicht
- **KPI / SAI**: Lenkachsenneigung in Vorderansicht

Beim 1965/66 Mustang wirken mehrere Einstellmöglichkeiten auf mehr als eine dieser Größen. Änderungen an UCA-Shims, Strut Rods, LCA-Position, Ride Height oder Ball-Joint-Geometrie können deshalb mehr als einen Winkel gleichzeitig verändern.

Daher gilt:

> **Nie einen einzelnen Winkel isoliert einstellen und danach davon ausgehen, dass der Rest unverändert geblieben ist.**

Die Kopplung ist allerdings **nicht zwangsläufig**: Bei richtiger Vorgehensweise lassen sich Castor und Camber getrennt verstellen. Das Verfahren steht in [`CHAPTER_FRONT_ADJUSTMENT_UCA_LCA.md`](CHAPTER_FRONT_ADJUSTMENT_UCA_LCA.md) §2.4.

---

## 2. Camber

### Definition

Von vorn betrachtet:

- Rad oben nach innen → **negativer Camber**
- Rad oben nach außen → **positiver Camber**

Camber beeinflusst die Lage des Reifenaufstands in Kurvenfahrt.

### Warum negativer Camber auf der Rundstrecke?

In der Kurve:

- Karosserie rollt
- Radaufhängung federt ein/aus
- Reifen verformt sich
- Außenrad trägt hohe Last

Negativer statischer Camber kann dabei helfen, das belastete Außenrad näher an eine günstige Aufstandsfläche zu bringen.

Aber:

> **Mehr negativer Camber ist nicht automatisch mehr Grip.**

Zu viel negativer Camber kann:
- Bremsfläche reduzieren
- Innenkante überlasten
- Reifenverschleiß erhöhen
- Geradeausgrip verschlechtern

Longacre weist darauf hin, dass der optimale statische Camber aus Fahrwerksgeometrie, Pyrometerdaten und realem Testen entstehen muss.

---

## 3. Camber Gain

Camber Gain beschreibt die Camberänderung über Federweg.

Eine statische Einstellung von z. B. −2,0° sagt deshalb allein nicht, welchen Camber das Rad in einer schnellen Kurve tatsächlich hat.

Relevant sind:

- UCA-Winkel
- LCA-Winkel
- Ball-Joint-Positionen
- Ride Height
- Shelby/Arning Drop
- Federweg
- Rollwinkel

Der Shelby Drop dient gerade dazu, die Vorderachs-Kinematik und Camberkurve zu verbessern.

---

## 4. Castor

### Definition

Von der Fahrzeugseite betrachtet ist Castor die Neigung der gedachten Lenkachse durch oberes und unteres Kugelgelenk.

- Lenkachse oben nach hinten geneigt → **positiver Castor**
- oben nach vorn geneigt → negativer Castor

Longacre bestätigt:

- positiver Castor verbessert Richtungsstabilität und Selbstzentrierung
- sehr hoher positiver Castor erhöht die Lenkkräfte

Das ist bei **manueller Lenkung** besonders relevant.

---

## 5. Castor erzeugt dynamischen Camber

Beim Lenken führt positiver Castor dazu, dass sich die Radneigung verändert.

Das kurvenäußere und kurveninnere Rad erhalten beim Lenkeinschlag unterschiedliche Camberänderungen.

Darum ist Castor nicht nur ein Geradeauslauf-Thema, sondern Teil der Kurvengeometrie.

Für Track-Setup muss deshalb gemeinsam betrachtet werden:

- statischer Camber
- positiver Castor
- Lenkwinkel
- Camber Gain

---

## 6. KPI / SAI

KPI = King Pin Inclination  
SAI = Steering Axis Inclination

Bei Kugelgelenk-Vorderachsen ist damit die gedachte Linie durch oberes und unteres Kugelgelenk in Vorderansicht gemeint.

KPI ist beim Mustang primär:

- Geometriegröße
- Diagnosegröße

Nicht der normale Fein-Setup-Regler.

Auffällige Links-/Rechts-Differenzen können auf Geometrieunterschiede hinweisen, z. B.:

- Spindel/Achsschenkel
- Ball Joint
- Querlenker
- Chassis-Aufnahmepunkte
- Montageunterschiede
- Unfallschäden

---

## 7. Included Angle

Der Included Angle verbindet Camber und KPI/SAI.

Er ist diagnostisch interessant, weil Änderungen von Camber bei unverändertem KPI anders zu interpretieren sind als eine Änderung der Lenkachse selbst.

Dieses Thema wird später noch mit einer eindeutigen Vorzeichenkonvention und grafischer Darstellung ergänzt.

---

## 8. Einstellmöglichkeiten — Überblick

Die vollständige Einstellmechanik steht in [`CHAPTER_FRONT_ADJUSTMENT_UCA_LCA.md`](CHAPTER_FRONT_ADJUSTMENT_UCA_LCA.md). Hier nur, welcher Regler auf welchen Winkel wirkt:

| Regler | Castor | Camber | Dokumentiert in |
|---|---|---|---|
| UCA-Shims **gegenläufig** | **primär** | — | Ford Shop Manual 1966 |
| UCA-Shims **gleichsinnig** | — | **primär** | Ford Shop Manual 1966 |
| LCA Camber Kit (SoT) | — | **primär** | SoT Einbauanleitung |
| Adjustable Strut Rod | **primär** | gering | — |

Die wichtigste Konsequenz für dieses Kapitel: **Castor und Camber lassen sich getrennt einstellen**, wenn die Shim-Pakete gegenläufig statt einseitig verändert werden. Die Kopplung entsteht nur bei einseitiger Änderung.

Nach jeder Änderung des LCA Camber Kits ist zusätzlich **Bump Steer** zu prüfen — der innere LCA-Anlenkpunkt wandert quer, die Spurstange nicht.

---

## 9. Fremde Track-Beispiele einordnen

Street or Track dokumentiert auf einem eigenen 66er-Testfahrzeug **−2,75° Camber bei +5° Castor**.

Dieses Beispiel entstand mit **Tubular UCA (längenverstellbar), Tubular LCA, LCA Camber Kit und Adjustable Strut Rods** — also mit einer Verstellebene mehr, als unser Fahrzeug nach aktuellem Kenntnisstand besitzt. Die Einordnung steht in [`CHAPTER_FRONT_ADJUSTMENT_UCA_LCA.md`](CHAPTER_FRONT_ADJUSTMENT_UCA_LCA.md) §3.4.

> Es ist ein **Referenzpunkt für die Größenordnung des Machbaren**, kein Zielwert für unser Fahrzeug.

Unsere Baseline bleibt gemäß [`00_PROJECT.md`](00_PROJECT.md) §8:

- Camber −2,0°
- Castor +3,0°

bis reale Trackdaten eine Änderung begründen.

Zur Symmetrie gibt Ford für beide Winkel vor: maximal 1/2° Differenz links/rechts, **bevorzugt nicht mehr als 1/4°**. Für ein Rundstreckenfahrzeug gilt 1/4° als Obergrenze.

---

## 10. Messung mit Dunlop CG/4-5

### Camber — CG/4

1. Fahrzeug race-ready
2. Messfläche geprüft
3. Fahrzeug gesetzt
4. Räder gerade
5. CG/4 an definierter Referenz ansetzen
6. Libelle über Camber-Stellrad zentrieren
7. Wert ablesen
8. links/rechts dokumentieren
9. Messung wiederholen

Die Dunlop-Skala ist additiv. Bei weitergedrehtem Stellrad müssen durchlaufene Teilungen mitgezählt werden.

### Castor / KPI — CG/5 + CG/6

Für jedes Rad:

1. CG/5 spielfrei befestigen
2. CG/6 entriegeln
3. Rad **20° IN**
4. Castor-/KPI-Referenz nullen
5. Rad durch Geradeausstellung auf **20° OUT**
6. Castor-Libelle zentrieren und Wert ablesen
7. KPI-Libelle zentrieren und Wert ablesen
8. dokumentieren
9. wiederholen

Gesamtschwenk: **40°**

---

## 11. "IN" und "OUT" eindeutig

Aus Sicht des jeweils gemessenen Rades:

- **IN**: Vorderkante des Rades Richtung Fahrzeugmitte
- **OUT**: Vorderkante vom Fahrzeug weg

| Rad | IN | OUT |
|---|---|---|
| links | nach rechts | nach links |
| rechts | nach links | nach rechts |

---

## 12. Messfehler

### Camber

Typische Fehler:
- Bodenquerneigung
- Reifenflankenverformung
- Felgen-/Reifenschlag
- Fahrzeug nicht gesetzt
- unterschiedlicher Druck
- ungleiche Beladung

### Castor

Typische Fehler:
- kein exakter 20°-Lenkwinkel
- Drehteller verspannt
- Gauge bewegt sich
- Aufnahme hat Spiel
- Lenkrad/Steering Linkage bewegt sich unkontrolliert
- falsche IN/OUT-Richtung

---

## 13. Einstellstrategie

Grundregel: **nicht gleichzeitig an mehreren Stellen drehen.**

Die vollständige Reihenfolge mit Rollenverteilung der drei Regler steht in [`CHAPTER_FRONT_ADJUSTMENT_UCA_LCA.md`](CHAPTER_FRONT_ADJUSTMENT_UCA_LCA.md) §6.

Ford gibt für die Reihenfolge verbindlich vor:

> „Toe-in should only be checked and adjusted **after the caster and camber have been adjusted** to specifications."
> — Ford Shop Manual 1966

---

## 14. Cross-Caster und Cross-Camber

Für eine europäische Rundstrecken-Baseline wird zunächst **symmetrisch** gearbeitet.

Oval-spezifische Empfehlungen, rechts und links absichtlich unterschiedliche Castor-/Camberwerte zu verwenden, werden nicht übernommen.

Erst reale Trackdaten könnten eine asymmetrische Abweichung begründen.

---

## 15. Track-Validierung

### Camber
Beurteilen über:
- Reifentemperatur innen / Mitte / außen
- Warmdruck
- Reifenbild
- Bremsstabilität
- Mid-Corner-Grip

### Castor
Beurteilen über:
- Geradeauslauf
- Lenkrückstellung
- Lenkkräfte
- Turn-in
- Verhalten bei größerem Lenkwinkel

Nie nur eine einzelne Empfindung als Beweis verwenden.

---

## 16. Quellen

### Primärquelle — Klasse A

**Ford Motor Company — 1966 Ford Cougar, Falcon, Fairlane and Mustang Shop Manual**
Lokale Kopie: `docs/quellen/A-11-ford-1966-shop-manual-ocr.txt`

Belegt in diesem Kapitel: Definitionen Castor/Camber, Symmetrietoleranzen (max. 1/2°, bevorzugt 1/4°), Reihenfolge Toe nach Castor/Camber, Turning Angle als Diagnosegröße.

**Dunlop CG/4-5 und CG/6 — Original Operating Instructions**
Nutzer-Scans. Belegt: Messverfahren, additive Skala, 20°-IN/OUT-Konvention.

### Sekundärquelle — Klasse C

- Longacre — Camber Simplified · https://longacreracing.com/pages/camber-simplified
- Longacre — Caster Simplified · https://longacreracing.com/pages/caster-simplified

> Longacre-Techtexte stammen überwiegend aus dem US-Oval-Kontext. Übernommen werden nur allgemeingültige mechanische Zusammenhänge, keine Oval-Zielwerte.

### Quellen zur Einstellmechanik

Stehen vollständig in [`CHAPTER_FRONT_ADJUSTMENT_UCA_LCA.md`](CHAPTER_FRONT_ADJUSTMENT_UCA_LCA.md) §8 — Ford Shop Manual und Street-or-Track-Einbauanleitung, beide lokal gespiegelt mit Prüfsumme.

---

## 17. Offene Punkte

**Dieses Kapitel:**

- reale KPI-Werte links/rechts
- Wiederholbarkeit der Camber-/Castor-Messung am Fahrzeug bestimmen
- Included-Angle-Vorzeichenkonvention (siehe [`CONVENTIONS.md`](CONVENTIONS.md) §22)

**Hardware und Einstellzustand:** siehe [`CHAPTER_FRONT_ADJUSTMENT_UCA_LCA.md`](CHAPTER_FRONT_ADJUSTMENT_UCA_LCA.md) §7.3 — insbesondere die noch offene UCA-Ausführung, die für die Einstellstrategie blockierend ist.
