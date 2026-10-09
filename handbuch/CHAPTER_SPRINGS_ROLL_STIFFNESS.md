# Mustang Track Chassis Setup — Federn, Stabilisatoren und Rollsteifigkeit

**Dokumentrolle:** Fachkapitel — die primäre Balance-Stellgröße
**Version:** 0.1
**Datum:** 2026-10-05
**Status:** Entwurf; physikalische Grundlagen belegt, Fahrzeugwerte vollständig offen
**Bezug:** [`00_PROJECT.md`](00_PROJECT.md) · [`CONVENTIONS.md`](CONVENTIONS.md) · [`02_WORKFLOW.md`](02_WORKFLOW.md)

---

## 1. Warum dieses Kapitel existiert

Das Handbuch behandelt Camber, Castor, Toe und Cross Weight ausführlich. Das sind wichtige Größen — aber sie sind **nicht** die primären Stellgrößen für Unter- und Übersteuern.

Die Balance eines Fahrzeugs wird in erster Linie über die **Verteilung der Rollsteifigkeit zwischen Vorder- und Hinterachse** eingestellt. Alignment feinabstimmt, Rollsteifigkeit entscheidet.

Ohne dieses Kapitel bleibt die Diagnose aus `CHAPTER_HANDLING_DIAGNOSIS_DECISION_TREE` unvollständig: Sie nennt unter „Rollsystem" korrekt „Front vs. Rear Rollsteifigkeit" als Prüfpunkt — ohne dass irgendwo erklärt wäre, wie man die bestimmt oder ändert.

> **Dieses Kapitel ist Grundlage für** `CHAPTER_BALANCE_CORNER_WEIGHT` (Corner Weight ohne Federrate nicht interpretierbar) und `CHAPTER_HANDLING_DIAGNOSIS_DECISION_TREE` (Hypothesenbildung).

---

## 2. Die physikalische Kette

```text
Kurvenfahrt
   ↓
Querbeschleunigung wirkt am Schwerpunkt
   ↓
Rollmoment = m · a_y · h_CG
   ↓
aufgeteilt auf Vorder- und Hinterachse
   nach VERTEILUNG DER ROLLSTEIFIGKEIT
   ↓
lateraler Lasttransfer je Achse
   ↓
Reifen-Load-Sensitivity
   ↓
Achse mit mehr Lasttransfer verliert anteilig mehr Grip
   ↓
BALANCE (Unter-/Übersteuern)
```

Der entscheidende Schritt ist der vorletzte. Er ist nicht selbstverständlich und wird in §4 begründet.

### Zwei Anteile des Lasttransfers

Der laterale Lasttransfer einer Achse hat zwei Quellen:

| Anteil | Wodurch | Zeitverhalten |
|---|---|---|
| **geometrisch** | Rollzentrumshöhe — Kraft läuft über die Lenker direkt ins Chassis | sofort |
| **elastisch** | Federn, Stabilisatoren, Dämpfer — über die Karosserierollbewegung | verzögert |

Beide zusammen ergeben den Gesamttransfer der Achse. Der geometrische Anteil ist über die Rollzentrumshöhe gegeben (beim Mustang durch den Shelby Drop verändert — siehe `CHAPTER_SETUP_PAD_RIDE_HEIGHT` §18), der elastische über Federraten und Stabilisatoren.

> **Konsequenz:** Wer nur über Federn und Stabis denkt, übersieht den geometrischen Anteil. Wer nur über Rollzentren denkt, übersieht den elastischen. Beide gehören zusammen.

---

## 3. Von der Federrate zur Rollsteifigkeit

### 3.1 Motion Ratio

Die Feder sitzt beim Mustang **nicht am Rad**, sondern auf dem unteren Querlenker. Sie sieht deshalb weniger Weg als das Rad.

```text
MR = Federweg / Radweg
```

Die **Radrate** — die Steifigkeit, die das Rad tatsächlich spürt — ergibt sich daraus:

```text
k_Rad = k_Feder · MR²
```

**Das Quadrat ist der entscheidende Punkt.** Ein Motion Ratio von 0,5 bedeutet nicht halbe, sondern **ein Viertel** der Federrate am Rad.

| Motion Ratio | Faktor auf die Radrate |
|---:|---:|
| 1,00 | 1,00 |
| 0,70 | 0,49 |
| 0,60 | 0,36 |
| 0,50 | **0,25** |
| 0,40 | 0,16 |

> **Für dieses Fahrzeug:** Das Motion Ratio der Vorderachse ist **nicht gemessen**. In `MASTER_CONCEPT.md` §16 steht es unter „Später". Ohne diesen Wert ist jede Rechnung von der Federrate zur Radrate eine Schätzung.

### 3.2 Rollsteifigkeit einer Achse

Aus der Radrate und der Spurweite:

```text
K_roll,Feder = (k_Rad · t²) / 2     [Nm/rad]
```

mit `t` = Spurweite. Für die praktische Angabe in Nm/° entsprechend durch 57,3 teilen.

Auch hier geht die Spurweite **quadratisch** ein. Das ist der Grund, warum das LCA Camber Kit mit seinen ±9,5 mm je Rad (siehe `CHAPTER_FRONT_ADJUSTMENT_UCA_LCA` §3.2) nicht nur Camber verändert, sondern auch die Rollsteifigkeit — wenn auch geringfügig.

### 3.3 Stabilisator

Der Stabilisator wirkt **nur bei gegensinnigem Federn**, also genau bei Rollbewegung. Bei gleichsinnigem Einfedern (Bremsnicken, Bodenwelle über die ganze Breite) wirkt er nicht.

```text
K_roll,gesamt = K_roll,Feder + K_roll,Stabi
```

Das macht ihn zum bevorzugten Balance-Werkzeug: Er verändert die Rollsteifigkeit, **ohne** die Federrate für senkrechte Fahrbahnanregung zu erhöhen. Ein steiferer Stabi kostet keinen Federkomfort über Bodenwellen — ein steiferes Federpaket schon.

### 3.4 Die eigentliche Stellgröße: die Verteilung

```text
TLLTD = K_roll,vorn / (K_roll,vorn + K_roll,hinten)
```

*(Total Lateral Load Transfer Distribution — Anteil der Vorderachse am gesamten Rollwiderstand.)*

| Änderung | Wirkung auf die Balance |
|---|---|
| vorn steifer (oder hinten weicher) | mehr Lasttransfer vorn → **mehr Untersteuern** |
| hinten steifer (oder vorn weicher) | mehr Lasttransfer hinten → **mehr Übersteuern** |

> **Das ist die wichtigste Tabelle dieses Kapitels.** Sie beantwortet die Frage, die `CHAPTER_HANDLING_DIAGNOSIS_DECISION_TREE` bei Mid-Corner-Problemen stellt.

**Wichtig:** Es zählt die **Verteilung**, nicht das Niveau. Ein Fahrzeug mit insgesamt weichem Fahrwerk kann dieselbe Balance haben wie eines mit hartem — solange das Verhältnis vorn/hinten gleich ist. Das Niveau bestimmt Federweg, Aufbaubewegung und Fahrbahnfolgevermögen, die Verteilung bestimmt die Balance.

---

## 4. Warum Lasttransfer überhaupt Grip kostet

Das ist der physikalische Baustein, ohne den die ganze Kette nicht trägt — und er fehlt im bisherigen Konzept vollständig.

### Load Sensitivity

Ein Reifen überträgt Seitenkraft, die mit der Radlast steigt — aber **nicht proportional**, sondern **degressiv**. Der Reibbeiwert sinkt mit steigender Last.

```text
Beispiel, idealisiert:

Radlast    mögliche Seitenkraft    µ effektiv
  400 kg          3600 N             0,92
  500 kg          4300 N             0,88
  600 kg          4900 N             0,83
  700 kg          5400 N             0,79
```

### Die Konsequenz

Zwei Räder einer Achse mit je 500 kg liefern zusammen **mehr** Seitenkraft als eines mit 400 und eines mit 600 kg:

```text
symmetrisch:    4300 + 4300 = 8600 N
mit Transfer:   3600 + 4900 = 8500 N   →  weniger
```

> **Lasttransfer kostet immer Gesamtgrip an der betroffenen Achse.** Je mehr Lasttransfer eine Achse bekommt, desto mehr verliert sie anteilig.

Damit schließt sich die Kette: Eine steifere Achse bekommt mehr Rollmoment, also mehr Lasttransfer, also relativ weniger Grip — und das Fahrzeug dreht sich von ihr weg.

> **Das ist die physikalische Begründung für alles, was dieses Kapitel über Balance sagt.** Es ist auch die Begründung dafür, warum Gesamtgewicht und Schwerpunkthöhe so wichtig sind: Beide erhöhen den Lasttransfer insgesamt und kosten damit Grip an **beiden** Achsen.

---

## 5. Was am Mustang anders ist

### 5.1 Vorderachse

| Merkmal | Konsequenz |
|---|---|
| Schraubenfeder auf dem LCA | Motion Ratio deutlich unter 1 → quadratischer Einfluss |
| SLA-Geometrie | Rollzentrum wandert über Federweg |
| Shelby Drop vorhanden | Rollzentrum **angehoben** → mehr geometrischer Anteil |
| Stabilisator vorhanden | Hardware und Durchmesser noch nicht erfasst |

Die Quelle zum Shelby Drop formuliert dessen Wirkung ausdrücklich als Rollsteifigkeitsänderung:

> „The roll center of the suspension is **raised**, which causes the front suspension to **resist body roll**, which makes the suspension feel, and act, **as though a larger sway bar were installed**."
> — Quelle B-01

> **Das ist für die Balance-Beurteilung wesentlich:** Die Vorderachse dieses Fahrzeugs ist durch den Drop bereits in Richtung „steifer" verschoben — bevor über Federn oder Stabilisator überhaupt gesprochen wird.

### 5.2 Hinterachse — Blattfeder

Die Blattfeder ist hier konstruktiv entscheidend und wird oft falsch eingeschätzt.

```text
Vorderachse:  Federbasis = Spurweite       (ca. 1430 mm)
Hinterachse:  Federbasis = Federabstand    (deutlich geringer)
```

Die Rollsteifigkeit der Hinterachse hängt vom **Abstand der beiden Blattfedern** ab, nicht von der Spurweite. Und dieser Abstand geht — wie in §3.2 — **quadratisch** ein.

| Folge | Bedeutung |
|---|---|
| Blattfedern stehen eng | Rollsteifigkeit hinten relativ niedrig bei gegebener Federrate |
| Federrate wirkt doppelt | Blattfeder trägt **und** stützt gegen Rollen |
| Blattfederreibung | schwer kalkulierbarer Zusatzbeitrag |

**Der kritische Punkt:** Bei einer Blattfederachse lassen sich **Tragfederrate und Rollsteifigkeit nicht unabhängig voneinander ändern.** Wer hinten die Federrate erhöht, erhöht zwangsläufig auch die Rollsteifigkeit — und verschiebt damit die Balance Richtung Übersteuern.

Ein hinterer Stabilisator würde beides entkoppeln. Maier Racing hält ihn für viele Mustang-Setups für entbehrlich (siehe `CHAPTER_REAR_SUSPENSION_PANHARD_PINION` §20) — das ist aber eine Aussage über deren Fahrzeuge, kein Beweis für unseres.

### 5.3 Blattfederreibung

Mehrblattfedern haben Reibung zwischen den Lagen. Das wirkt wie ein wegabhängiger Dämpfer mit Hysterese:

- bei kleinen Anregungen: Feder reagiert **gar nicht** → effektiv viel steifer
- bei größeren: Feder bricht los → Nennrate
- in der Radlastmessung: erzeugt die in `CHAPTER_BALANCE_CORNER_WEIGHT` §11 beschriebene Hysterese

> Das ist keine Nebensache, sondern erklärt, warum eine Blattfederachse sich auf der Waage anders verhält als auf der Strecke — und warum die Settling-Prozedur so wichtig ist.

---

## 6. Rangfolge der Balance-Stellgrößen

Nach Wirkungsstärke — **und danach, ob sie an diesem Fahrzeug überhaupt verfügbar sind**:

| Rang | Stellgröße | Wirkung | An diesem Fahrzeug |
|---|---|---|---|
| 1 | **ARB-Durchmesser vorn** | stark, entkoppelt von Federrate | **verfügbar** — 1" verbaut, 1-1/8" lieferbar (+60 %) |
| 2 | **Federrate vorn/hinten** | stark, beeinflusst auch Niveau | **verfügbar** über Federtausch |
| 3 | **Panhard-Höhe** (Rollzentrum hinten) | stark | **verfügbar**, Aufwand mittel |
| 4 | Rollzentrum vorn | stark | **festgelegt** durch Shelby Drop |
| 5 | **Hinterer ARB** | stark | **nicht vorhanden** — Nachrüstung wäre Eingriff |
| 6 | Reifendruck | mittel, sofort | **verfügbar** |
| 7 | Cross Weight | mittel | **nur eingeschränkt** — keine Federtellerverstellung |
| 8 | Alignment (Camber, Toe) | fein | **verfügbar** |
| 9 | Dämpfer | transient, nicht stationär | abhängig von Bilstein-Ausführung |

**Zwei Aussagen dieser Tabelle:**

1. **Alignment steht auf Rang 8.** Wer ein Mid-Corner-Balance-Problem über Camber lösen will, arbeitet mit dem schwächsten Hebel.

2. **Die realistisch verfügbaren Hebel sind Rang 1, 2, 3 und 6.** Alles andere ist entweder festgelegt, nicht vorhanden oder nur eingeschränkt nutzbar. Das ist keine Einschränkung des Konzepts, sondern die Realität eines Fahrzeugs von 1966 — und der Grund, warum die wenigen verfügbaren Hebel präzise verstanden sein müssen.

> **Cross Weight auf Rang 7 mit Einschränkung:** Zum gezielten Verstellen bräuchte es höhenverstellbare Federauflagen. Vorn gibt es nur Serien-Federteller oder Roller Perches ohne Höhenverstellung, hinten keine unabhängige Federtellerverstellung. Cross Weight bleibt damit primär **Diagnosegröße**. Siehe [`CHAPTER_VEHICLE_DYNAMICS.md`](CHAPTER_VEHICLE_DYNAMICS.md) §9.4.

> **Dämpfer wirken nicht auf die stationäre Balance.** Sie beeinflussen, *wie schnell* sich der Lasttransfer aufbaut — also Turn-in, Lastwechsel, Kerbs. In einer stationär durchfahrenen Kurve ist ihr Beitrag zur Balance null. Das ist die Trennlinie zwischen „Auto untersteuert mitten in der Kurve" (Federn/Stabi) und „Auto reagiert träge beim Einlenken" (Dämpfer).

---

## 7. Was für dieses Fahrzeug vollständig fehlt

Dies ist der ehrliche Teil: **Keine einzige der für dieses Kapitel nötigen Größen ist am Fahrzeug bekannt.**

### 7.1 Zu erfassen — Hardware

| Größe | Verfahren | Status |
|---|---|---|
| Frontfeder-Rate | Herstellerangabe oder Federprüfstand | offen |
| Frontfeder-Ausführung | Teilenummer, Windungszahl, Drahtdurchmesser | offen |
| **Motion Ratio vorn** | geometrisch messen: Radweg vs. Federweg | offen |
| Stabi vorn — Durchmesser | messen | offen |
| Stabi vorn — Hebellänge, Endlinks | messen | offen |
| Blattfeder — Rate | Herstellerangabe oder Messung | offen |
| Blattfeder — Lagenzahl, Ausführung | zählen, Mid-Eye bestätigt | teilweise |
| **Federbasis hinten** | Abstand Blattfedermitten messen | offen |
| Rear ARB vorhanden? | Sichtprüfung | **offen** |
| Spurweite vorn/hinten | messen | offen |

### 7.2 Zu bestimmen — Fahrzeugwerte

| Größe | Verfahren |
|---|---|
| **Schwerpunkthöhe** | Waagenmessung mit angehobener Achse — mit vorhandener Hardware machbar |
| Rollzentrumshöhe vorn | aus realer Geometrie konstruieren (nach Shelby Drop!) |
| Rollzentrumshöhe hinten | aus Panhard-Höhe — siehe Rear-Kapitel §7 |
| Gesamtmasse, Achslastverteilung | Radlastwaagen — siehe Balance-Kapitel |

> **Die Schwerpunkthöhe** ist der wichtigste fehlende Einzelwert. Sie geht linear in das Rollmoment ein und bestimmt damit den gesamten Lasttransfer. Das Verfahren (Fahrzeug wiegen, dann eine Achse definiert anheben und erneut wiegen) ist mit den vorhandenen Longacre-Waagen durchführbar und sollte bei der ersten vollständigen Vermessung mitgemacht werden.

### 7.3 Bis dahin gilt

Ohne diese Werte lässt sich die Rollsteifigkeitsverteilung **nicht berechnen**. Was trotzdem möglich ist:

1. **Relativ arbeiten.** Eine Stabi-Änderung vorn wirkt in bekannter Richtung, auch wenn der Absolutwert unbekannt ist.
2. **Dokumentieren.** Jede Feder-, Stabi- oder Druckänderung mit Trackdaten protokollieren — daraus entsteht eine fahrzeugspezifische Erfahrungsbasis.
3. **Nicht raten.** Keine Federraten aus Katalogen übernehmen, ohne die verbauten Teile identifiziert zu haben.

---

## 8. Zusammenhang mit anderen Kapiteln

| Kapitel | Bezug |
|---|---|
| `CHAPTER_BALANCE_CORNER_WEIGHT` | Cross Weight wirkt **innerhalb** der durch Rollsteifigkeit gesetzten Verteilung. Bei symmetrischem Rundkurs ist sein Balance-Beitrag begrenzt. |
| `CHAPTER_SETUP_PAD_RIDE_HEIGHT` | Ride Height verändert Rollzentren und damit den geometrischen Transferanteil. |
| `CHAPTER_REAR_SUSPENSION_PANHARD_PINION` | Panhard-Höhe = Rollzentrumshöhe hinten. Direkte Balance-Stellgröße. |
| `CHAPTER_HANDLING_DIAGNOSIS_DECISION_TREE` | Liefert die Hypothesen, die dieses Kapitel begründet. |
| `CHAPTER_TRACK_VALIDATION_TIRES` | Reifentemperatur-Querverteilung zeigt Lasttransfer-Wirkung. |

---

## 9. Quellen

### Belegt in diesem Kapitel

**Quelle B-01 — Arning/Shelby Control Arm Drop**
`docs/quellen/B-01-arning-shelby-suspension-drop.pdf`
Belegt: Der Shelby Drop hebt das vordere Rollzentrum und wirkt „as though a larger sway bar were installed".

**Quelle C-01 / Maier Racing** und `CHAPTER_REAR_SUSPENSION_PANHARD_PINION` §20
Belegt: Einschätzung zum hinteren Stabilisator bei Mustang-Road-Race-Setups.

### Nicht aus Longacre

Die gespiegelten Longacre-Artikel (A-19 bis A-38) behandeln Rollsteifigkeit **nicht**. `chassis-dynamics` ist ein Kommunikations- und Diagnoseleitfaden für Oval-Racing, keine fahrdynamische Grundlage. Der Stabilisator kommt dort nur als Störgröße beim Wiegen vor („disconnect the sway bar").

> Das ist kein Mangel der Quelle, sondern ein Hinweis: Für Fahrdynamik-Grundlagen braucht dieses Projekt **andere Quellen** als für Messmittel-Bedienung.

### Fachliteratur — Status

Verfügbarkeitsprüfung und Projektentscheidung: `docs/quellen/README.md` Abschnitt *B — Fachliteratur*.

> **Kurz:** Fachliteratur wird nicht gespiegelt. Wo ein Beleg nötig ist, wird die konkrete Textstelle mit Werk, Auflage und Seite zitiert — aus einem rechtmäßig beschafften Exemplar.


Für die physikalischen Grundlagen dieses Kapitels fehlt belastbare Fachliteratur:

| Quelle | Wofür |
|---|---|
| Milliken & Milliken, *Race Car Vehicle Dynamics* | Load Sensitivity, Lasttransfer, Rollsteifigkeitsverteilung |
| Carroll Smith, *Tune to Win* | praxisnahe Balance-Abstimmung |
| Herb Adams, *Chassis Engineering* | Motion Ratio, Rollzentren am US-Fahrzeug |
| OptimumG — technische Artikel | TLLTD, Datenanalyse |

Die in diesem Kapitel dargestellten Zusammenhänge sind **etablierte Fahrzeugdynamik** und in jedem der genannten Werke zu finden. Sie sind hier aus physikalischen Grundlagen hergeleitet, aber noch nicht gegen eine zitierfähige Quelle geprüft.

> **Konsequenz nach Projektregel „Kein Sollwert ohne Quelle":** Dieses Kapitel enthält bewusst **keine Zahlenwerte** für Federraten, Stabi-Durchmesser oder Zielverteilungen. Die Formeln sind Strukturwissen, die Beispielzahlen in §4 sind ausdrücklich als idealisiert gekennzeichnet.

---

## 10. Definition of Done

- [x] physikalische Kette Rollmoment → Lasttransfer → Balance dargestellt
- [x] geometrischer und elastischer Anteil getrennt
- [x] Motion Ratio mit quadratischem Einfluss erklärt
- [x] Rollsteifigkeit aus Radrate und Spurweite hergeleitet
- [x] Stabilisator als entkoppelte Stellgröße erklärt
- [x] **Load Sensitivity als physikalische Begründung ergänzt**
- [x] Blattfeder-Besonderheit: Federbasis statt Spurweite
- [x] Kopplung Tragrate/Rollsteifigkeit bei Blattfeder benannt
- [x] Shelby-Drop-Wirkung auf Rollsteifigkeit aus Quelle belegt
- [x] Rangfolge der Balance-Stellgrößen — Alignment auf Rang 7
- [x] Dämpfer als transiente, nicht stationäre Größe abgegrenzt
- [x] fehlende Fahrzeugwerte vollständig aufgelistet
- [ ] Federraten vorn/hinten erfasst
- [ ] Motion Ratio vorn gemessen
- [ ] Federbasis hinten gemessen
- [ ] Stabi-Hardware erfasst, Rear ARB geklärt
- [ ] Schwerpunkthöhe bestimmt
- [ ] Rollzentrumshöhen konstruiert
- [ ] Fachliteratur Klasse B beschafft und Aussagen gegengeprüft
