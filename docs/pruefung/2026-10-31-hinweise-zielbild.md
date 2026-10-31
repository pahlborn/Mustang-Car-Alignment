---
created: 2026-10-31
source: ai-generated
topic: Drei Ergänzungen zum Zielbild vor Peters Freigabe
---

# Hinweise zum Zielbild (vor der Freigabe)

**Für:** die Sitzung, die `docs/zielbild/` gebaut hat (Commit `fb798ff`)
**Stand der App:** v29 (`f847104`)
**Peter:** Das Zielbild ist gut und trifft, was er wollte. Er gibt es frei, sobald die drei Punkte unten im Zielbild stehen. Nach `docs/zielbild/README.md` gilt: Erst das Zielbild ändern, dann bauen.

## 1. Das Zielbild zeigt neue Technik, sagt aber „keine neue Technik“

In der Erklärung, Abschnitt 3, steht: „Technik bleibt, wie sie ist … kommt keine neue Technik dazu.“ Die Vorschau zeigt aber drei Dinge, die die App heute nicht kann:

| Im Zielbild | Heute im Code | Was zu entscheiden ist |
|---|---|---|
| Status und „neu messen“ **je Schritt** (6.6 und 6.8 mit „neu messen“, Kästchen je Schritt, Zähler „x von 85 Schritten“) | Status nur je Phase: `status.js:131` `_data.phasen[phaseId]`. „Veraltet“ rechnet `pruefen(phaseId)` (`status.js:234`) aus `Recheck.PHASEN[].liefert` je Phase. | Wie ein Schritt seinen Status speichert (Format, Abgleich über den Status-Kanal) und woraus „neu messen“ je Schritt folgt (`liefert` je Schritt?). Wie das mit der v25-Regel zusammenspielt („spätere Phase ersetzt frühe“, `status.js:303`, Vergleich über `nr`). |
| **„vorher“-Werte** (Spalten „vorher“ unter Werte und in Karte 6.5) und die Tabelle „Änderungen“ mit „4,8 → 5,6 mm“ | Ein Feld hat genau einen Wert und einen Zeitstempel (`field-sync.js`). Das Journal speichert nur Größe und Notiz (`status.js:158` `{ g, n, m }`), keinen alten und neuen Wert. | Wo der Verlauf liegt (Journal mit alt/neu? eigener Kanal?), wie viel davon in den Gist geht, wie er sich zwischen Geräten mischt. |
| **Phase 12 und 13 tauschen** (Ackermann nach dem endgültigen Ausrichten) | `recheck.js:191–192`: `phase12` = Ackermann, `phase13` = Final Front Alignment. Gespeicherte Stati hängen an diesen Kennungen, die v25-Abdeckung an `nr`. Dazu kommen `02_WORKFLOW.md` (Phasenabschnitte, §27) und die Tests in `recheck`, `status` und `werkstatt`. | Kennungen behalten und nur `nr`/Titel tauschen, oder umbenennen und vorhandene Stati umziehen? Ohne Entscheidung wäre Peters gespeicherter Status nach dem Tausch der falschen Phase zugeordnet. |

**Vorschlag:** Abschnitt 3 ehrlich formulieren, etwa „Neue Technik nur für Schritt-Status, Verlauf und den Phasentausch, gebaut vor Phase 0“. Dazu je Zeile oben eine Entscheidung ins Zielbild schreiben (Peter kann widersprechen). Diese Technik gehört an den Anfang der Bauplanung, nicht verteilt in die Phasen.

## 2. Castor/Camber links/rechts: Ford nennt zwei Grenzen

Karte 6.4 sagt: „Links/rechts höchstens 1/4° Unterschied (A).“ Das Ford Shop Manual 1966 (A-11, `docs/quellen/A-11-ford-1966-shop-manual-ocr.txt`, Zeilen 8146–8150 Castor, 8165–8169 Camber) sagt: Höchstens **1/2°**, angestrebt **1/4°**.

**Vorschlag:** „1/4° anstreben, 1/2° ist die Grenze (A).“ Rot erst über 1/2°, gelb zwischen 1/4° und 1/2°. Dasselbe gilt für die Camber-Karten.

## 3. Zeitbedarf je Karte fehlt

Peters Vorbild sind die Schrittkarten aus jerico und gt40, mit Vorbereitung, Werkzeug, Vorgehensweise, Soll- und Messwerten mit Eingabefeldern, Sicherheit, Praxis-Tipps, Fotos und **Zeitbedarf**. Bis auf den Zeitbedarf ist alles berücksichtigt, die Fotos ausdrücklich später.

**Vorschlag:** In Regel 2 (Reihenfolge der Karte) „Zeitbedarf“ aufnehmen, als Werkstattpraxis (D) oder „offen“. Die vier Beispielkarten bekommen ihn mit.

## Nebenbei

- Der offene PR #1 (`entwurf/anleitung-phase6`) heißt „Entwurf v28“. v28 und v29 sind inzwischen vergeben (Umlaute; Versionsprüfung ohne Netz). Wird er weiterverwendet, braucht er eine freie Nummer und einen frischen Stand von `main`.
- Geprüft und richtig: die Shim-Richtung für mehr Castor (A-11, Zeilen 8313–8325), „1/32" an jedem Bolzen ≈ 1°“ und „Lenkwinkel erst nach Castor, Camber und Spur“ (A-11, Zeilen 7501–7505).
