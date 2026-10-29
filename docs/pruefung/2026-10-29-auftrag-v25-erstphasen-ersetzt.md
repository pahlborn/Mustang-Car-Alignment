---
created: 2026-10-29
source: ai-generated
topic: Auftrag an den Agenten im Repo alignment – Erstphasen nicht als veraltet melden
---

# Auftrag: Erstphasen gelten als ersetzt, nicht als veraltet

**Repo:** `pahlborn/Mustang-Car-Alignment` (lokal `Peters Bastelbude\alignment`)
**Ausgangsstand:** v24 (`c1a882a`)
**Ziel-Version:** v25
**Grundlage:** [Prüfung aus Mechanikersicht (2026-10-28)](2026-10-28-pruefung-mechanikersicht.md), Abschnitt „Nachprüfung 2026-10-29"

## Problem

Wer den Ablauf genau einhält, kommt am Ende nicht auf 100 %.

- In Phase 13 (finales Ausrichten) verstellt man Shims, die App meldet `castor`.
- Daraufhin wird Phase 6 (grobes Ausrichten) „veraltet", weil sie Castor auch liefert.
- Über die Kette Castor → Toe → Lenkungsmitte wird zusätzlich Phase 3 (Race-Ready) „veraltet".
- Belegt mit `Recheck.phasenNach('castor')`. Ergebnis: Phasen 3, 6, 13 und 17.

Fachlich ist Phase 6 nicht ungültig. Sie ist planmäßig durch Phase 13 ersetzt (`02_WORKFLOW.md` §2, „Initial Setup vs. Final Setup"). Die App verlangt also eine erneute Bestätigung, die der Ablauf gar nicht vorsieht. Das ist derselbe Fehlertyp wie vor v23 (Unfallregister, sechzehnter Vorfall, und Regel 10: „Eine Warnung, der niemand glaubt, ist schlechter als keine").

## Ziel

Eine erledigte Phase gilt nicht als veraltet, wenn jede betroffene Größe nach der Änderung von einer **späteren, erledigten** Phase neu erfasst wurde.

## Regel

Phase P ist wegen einer Änderung E (Zeitpunkt t) nur dann veraltet, wenn mindestens eine der betroffenen Größen **nicht** abgedeckt ist.

Eine Größe g ist abgedeckt, wenn es eine Phase Q gibt, für die alle drei Bedingungen gelten:

- Q kommt im Ablauf nach P (`Q.nr > P.nr`).
- `Q.liefert` enthält g.
- Q ist erledigt, und zwar **nach** t.

Das gilt gleich für „neu erfasst", „neu messen" und „mitmessen".

**Die Paare werden aus `Recheck.PHASEN[].liefert` berechnet und nicht von Hand gelistet** (Repo-Regel 4). Betroffen sind zum Beispiel 3 → 13 (Lenkungsmitte), 4 → 8/15 (Ride Height), 6 → 13 (Castor, Camber, Toe, KPI) und 7 → 15 (Radlasten, Cross).

**Bewusst so gewählt, nicht ändern:** Die spätere Phase muss *nach* der Änderung erledigt sein. Es reicht nicht, dass sie im Ablauf existiert.

- Sonst würde Phase 7 nach einer Balanceänderung in Phase 8 nicht mehr veralten.
- Phase 9 („nach Balanceänderung alles erneut prüfen") verlöre damit ihre Wirkung.
- Phase 5 (Hinterachse) hat keine spätere Phase mit denselben Größen. Sie muss nach Phase 8 weiterhin veralten. Das ist gewollt.

## Umsetzung

1. Vor Beginn `git pull`.
2. **`status.js`, Funktion `pruefen()`:** Abdeckung durch spätere erledigte Phasen auswerten.
   - Was die Funktion zurückgibt, bleibt gleich (`veraltet`, `mitmessen`, `wegen`).
   - `wegen` nennt nur die nicht abgedeckten Größen.
   - Vorher prüfen, ob `felder` in allen drei Zweigen Größenkennungen enthält.
3. **`handbuch/02_WORKFLOW.md`:** in §2 einen kurzen Absatz mit der Regel in Werkstattsprache. Formulierungsvorschlag: „Eine frühe Phase gilt als ersetzt, sobald eine spätere Phase dieselben Werte nach der Änderung neu erfasst hat. Sie muss dann nicht erneut bestätigt werden." Kein Rückblick im Seitentext (Regel 11).
4. **Oberfläche:** keine neue Anzeige. Eine ersetzte Phase bleibt einfach „erledigt".
5. **Buchführung nach Regel 1 und 2:**
   - `version.js`, `sw.js` (`chassis-v25`) und `changelog.js` anpassen.
   - Uhrzeit im Changelog mit `Get-Date` ablesen, nicht schätzen.
6. **`AGENTS.md`:** Eintrag im Unfallregister (achtzehnter Vorfall), kurz:
   - was falsch war
   - wer es gefunden hat (Prüfung aus Mechanikersicht, 2026-10-29)
   - welche Regel daraus folgt

## Tests (mit Gegenprobe nach Regel 7)

Jeder neue Test muss rot werden, wenn die Abdeckung wieder ausgebaut ist.

1. **Kompletter Durchlauf, Browser-Test**
   - Ablauf:
     - Phasen 0–18 in Reihenfolge abhaken.
     - Vor dem Abhaken von Phase 6 und von Phase 13 je eine Shimänderung eintragen.
     - Vor dem Abhaken von Phase 8 eine Ride-Height-Änderung eintragen.
     - In Phase 9 Phase 5 erneut bestätigen.
   - Erwartung: am Ende 100 % und keine Phase „veraltet".
2. **Phase 5 bleibt veraltet:** wie Test 1, aber ohne die erneute Bestätigung von Phase 5. Erwartung: genau Phase 5 ist veraltet.
3. **Änderung auf der Strecke nach Phase 18**
   - Camber verstellen: Phase 13 und Phase 6 werden veraltet.
   - Danach Phase 13 erneut abhaken: Phase 6 ist nicht mehr veraltet.
4. **Änderung nach der späteren Phase**
   - Phase 13 erledigt, dann eine Shimänderung: Phase 6 wird veraltet.
   - Das ist der Fall, den die Regel *nicht* abdecken darf.
5. **Zeitgleiche Stempel (Regel 7b):** Änderung und Abhaken innerhalb derselben Millisekunde. Die Entscheidung darf nicht vom Zufall abhängen.

Danach den bestehenden Test `tests/recheck.test.mjs` („Camber nachgestellt …") prüfen. `phasenNach()` bleibt unverändert, der Test sollte weiter stimmen.

## Abnahme

- [x] Tests 1–5 grün, Gegenproben rot, jeweils aus dem richtigen Grund
- [x] CI auf `main` grün (beide Jobs)
- [x] `02_WORKFLOW.md` §2 enthält die Regel
- [x] v25 sauber gebucht (Version, Cache-Name, Changelog mit echter Uhrzeit)
- [x] Unfallregister ergänzt

> [!NOTE]
> **Erledigt am 2026-10-29: v25 (`e9fe089`), live**
> - **Tests:** sieben Modultests in `tests/status.test.mjs` (Suite „v25"), zwei Browser-Tests in `tests/werkstatt.test.mjs` (kompletter Durchlauf und „nur Phase 5"). Ganze Testreihe grün, 19 Dateien.
> - **Gegenproben, alle rot:** Abdeckung ausgebaut (Modul und Browser), ohne Zeitbedingung, ohne Reihenfolge, Abdeckung nur für die eigene Größe, Uhr zählt nicht hoch.
> - **Nachgeschärft:** Die Gegenprobe „ohne Reihenfolge" blieb zuerst grün. Im Test blieb Phase 13 schon wegen der Lenkungsmitte veraltet, die nur Phase 3 liefert. Der Test hakt jetzt Phase 3 und 6 neu ab und verlangt, dass Phase 13 trotzdem veraltet bleibt.
> - **Zusätzlich zu den fünf Fällen:** ein Test, dass `wegen` nur nicht abgedeckte Größen nennt (Ride Height nach Phase 14: Phase 4 ersetzt durch 15, Phase 5 nicht).
> - **CI:** https://github.com/pahlborn/Mustang-Car-Alignment/actions/runs/40890902738 (Versionsdisziplin und Browser-Tests grün)
> - **Offen:** nichts aus diesem Auftrag.

## Rahmen

- Direkt auf `main` committen und pushen ist freigegeben. Kein Force-Push.
- Abhängige Schritte in PowerShell mit `if ($?)` verketten. `git push` schreibt auf stderr, den Erfolg danach separat prüfen.
- Gezielt lesen: `status.js`, `recheck.js`, `tests/status.test.mjs`, `tests/werkstatt.test.mjs`, `tests/recheck.test.mjs`, `02_WORKFLOW.md` §2/§12/§27. Keine Vollsichtung des Handbuchs.
- **Nicht Teil dieses Auftrags:** Arbeitskarten je Phase, Anzugsmomente, Startwerte, Umbau-Schritte. Dafür kommt ein eigener Auftrag.

## Rückmeldung an Peter

Kurz und in normalen Worten:

1. was jetzt anders ist (ein Satz)
2. Commit und Version
3. Testergebnis und CI-Link
4. ob etwas offen geblieben ist
