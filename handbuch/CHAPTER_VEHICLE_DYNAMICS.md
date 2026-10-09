# Mustang Track Chassis Setup — Fahrdynamische Grundlagen

**Dokumentrolle:** Fachkapitel — Kräfte, Lasttransfer und Balance als Gesamtbild
**Version:** 0.1
**Datum:** 2026-10-05
**Status:** Entwurf; Grundlagen aus Fahrzeugdynamik, Fahrzeugwerte offen
**Bezug:** [`GLOSSAR.md`](GLOSSAR.md) · [`CHAPTER_TIRE_MECHANICS.md`](CHAPTER_TIRE_MECHANICS.md) · [`CHAPTER_SPRINGS_ROLL_STIFFNESS.md`](CHAPTER_SPRINGS_ROLL_STIFFNESS.md)

---

## 1. Einordnung

Dieses Kapitel steht zwischen den beiden anderen Grundlagenkapiteln und verbindet sie:

```text
CHAPTER_TIRE_MECHANICS          was der Reifen kann
         ↓
CHAPTER_VEHICLE_DYNAMICS        welche Kräfte auf ihn wirken   ← hier
         ↓
CHAPTER_SPRINGS_ROLL_STIFFNESS  wie wir sie verteilen
         ↓
Alignment, Balance, Trackdaten
```

Es beantwortet drei Fragen:

| Frage | Abschnitt |
|---|---|
| Welche Kräfte wirken überhaupt? | §2 |
| Warum verschiebt sich Last beim Bremsen und in der Kurve? | §3, §4 |
| Was bedeutet das für die Kurvenphasen auf der Strecke? | §6 |

---

## 2. Das Kräftebild

### 2.1 Alles läuft über vier Kontaktflächen

Ein Fahrzeug kann nur das, was die Reifen übertragen. Jede Beschleunigung — längs wie quer — entsteht als Reaktionskraft an vier handflächengroßen Flächen.

```text
                 Fahrtrichtung ↑

        LF ┌─────────────────┐ RF
           │                 │
           │    Schwerpunkt  │      Kräfte greifen hier an
           │        ×        │      → wirken aber am Boden
           │                 │
        LR └─────────────────┘ RR
```

Der entscheidende Punkt: **Die Trägheitskräfte greifen am Schwerpunkt an, die Reaktionskräfte am Boden.** Zwischen beiden liegt ein Hebelarm — die Schwerpunkthöhe. Daraus entsteht jeder Lasttransfer.

### 2.2 Der Reibkreis

Ein Reifen hat ein begrenztes Kraftpotenzial, das er beliebig auf Längs- und Querrichtung aufteilen kann — aber nicht beides gleichzeitig maximal.

```text
            Längskraft (Bremsen)
                    │
              ╱─────┼─────╲
            ╱       │       ╲
    quer ──┼────────┼────────┼── quer
            ╲       │       ╱
              ╲─────┼─────╱
                    │
            Längskraft (Antrieb)
```

| Zustand | Aufteilung |
|---|---|
| reines Bremsen | volle Längskraft, keine Querkraft |
| reines Kurvenfahren | volle Querkraft, keine Längskraft |
| Trail Braking | beides anteilig — auf dem Kreisrand |

> **Praktische Folge:** Wer in der Kurve noch bremst, hat weniger Seitenkraft zur Verfügung. Das ist kein Fahrfehler, sondern Physik — und der Grund, warum die Kurvenphasen getrennt betrachtet werden (§6).

### 2.3 Drei Drehachsen

| Bewegung | Achse | Entsteht durch |
|---|---|---|
| **Nicken** (Pitch) | quer | Bremsen und Beschleunigen |
| **Rollen** (Roll) | längs | Querbeschleunigung |
| **Gieren** (Yaw) | hochachse | Richtungsänderung |

Nicken und Rollen erzeugen Lasttransfer. Gieren ist das, was man eigentlich will — die Richtungsänderung.

---

## 3. Längsdynamik — Lasttransfer beim Bremsen und Beschleunigen

### 3.1 Die Grundgleichung

```text
ΔF_längs = (m · a_x · h_CG) / Radstand
```

| Größe | Bedeutung |
|---|---|
| `m` | Fahrzeugmasse |
| `a_x` | Längsbeschleunigung |
| `h_CG` | **Schwerpunkthöhe** |
| Radstand | Abstand Vorder-/Hinterachse |

### 3.2 Was daraus folgt

**Beim Bremsen** wandert Last nach vorn. Die Vorderachse bekommt mehr Radlast, die Hinterachse weniger.

**Beim Beschleunigen** umgekehrt.

Drei Konsequenzen, die im Setup auftauchen:

| Effekt | Folge |
|---|---|
| Vorderachse trägt beim Bremsen deutlich mehr | Camber-Kompromiss muss auch Bremsen abdecken |
| Hinterachse wird beim Bremsen leichter | Bremsbalance und Stabilität |
| Chassis nickt | Ride Height ändert sich dynamisch, Bump Steer wird wirksam |

> **Verbindung zum Camber:** `CHAPTER_TIRE_MECHANICS` §4.2 beschreibt Camber als Kompromiss zwischen Kurve und Geradeaus. Die Längsdynamik ist der Grund dafür: Beim Bremsen steht das Rad gerade und trägt **mehr** Last als in der Kurve. Zu viel negativer Camber überlastet dann die Innenkante genau dann, wenn der Reifen am meisten leisten müsste.

### 3.3 Hebelarm reduzieren

`h_CG` geht linear ein. Ein tieferer Schwerpunkt reduziert den Lasttransfer in **allen** Richtungen — längs wie quer. Das ist der einzige Parameter, der ausschließlich Vorteile bringt.

> **Deshalb ist `cg_height` in** [`00_PROJECT.md`](00_PROJECT.md) **§8.2 als wichtigster fehlender Einzelwert markiert.**

---

## 4. Querdynamik — der Kern der Balance

### 4.1 Rollmoment

```text
M_roll = m · a_y · h_CG
```

Die Querbeschleunigung greift am Schwerpunkt an, die Reifenkräfte am Boden. Das Produkt aus Kraft und Hebelarm ist das Rollmoment.

### 4.2 Aufteilung auf die Achsen

Das Rollmoment verteilt sich **nach der Rollsteifigkeit** auf Vorder- und Hinterachse. Jede Achse überträgt ihren Anteil über zwei Pfade:

| Pfad | Über was | Zeitverhalten |
|---|---|---|
| **geometrisch** | Rollzentrumshöhe — Kraft läuft direkt über die Lenker ins Chassis | sofort |
| **elastisch** | Federn, Stabilisatoren — über die Karosserierollbewegung | verzögert |

```text
                 Rollmoment
                      │
        ┌─────────────┴─────────────┐
        ↓                           ↓
   Vorderachse                 Hinterachse
   (Anteil nach                (Rest)
    Rollsteifigkeit)
        │                           │
   ┌────┴────┐                 ┌────┴────┐
   ↓         ↓                 ↓         ↓
geometrisch elastisch     geometrisch elastisch
(Rollzentrum) (Feder+ARB)  (Panhard)  (Blattfeder)
```

### 4.3 Lasttransfer je Achse

```text
ΔF_quer,Achse = M_roll,Achse / Spurweite
```

Die Spurweite steht im Nenner: **Breitere Spur = weniger Lasttransfer bei gleichem Moment.**

### 4.4 Und dann wirkt Load Sensitivity

Hier schließt sich der Kreis zum Reifenkapitel:

```text
mehr Lasttransfer an einer Achse
        ↓
Load Sensitivity (CHAPTER_TIRE_MECHANICS §3)
        ↓
diese Achse verliert anteilig mehr Grip
        ↓
Fahrzeug dreht sich von ihr weg
```

| Achse mit mehr Lasttransfer | Fahrverhalten |
|---|---|
| vorn | **Untersteuern** |
| hinten | **Übersteuern** |

> **Das ist die vollständige Begründungskette der Balance-Abstimmung.** Sie läuft von der Rollsteifigkeitsverteilung über den Lasttransfer und die Reifenkennlinie bis zum Fahrverhalten. Jedes Glied ist nötig — fehlt eines, bleibt die Abstimmung Probieren.

---

## 5. Kombinierte Belastung

In der Realität treten Längs- und Querlasttransfer **gleichzeitig** auf. Die vier Radlasten ergeben sich aus der Überlagerung.

```text
Beispiel: Bremsen in eine Rechtskurve

              vorn
        LF ████████  ← viel Last (vorn + kurvenaußen)
        RF ███       ← wenig (vorn, aber kurveninnen)

        LR ███       ← mittel (hinten, kurvenaußen)
        RR █         ← am wenigsten
              hinten
```

Daraus folgt eine Reihenfolge der Beanspruchung, die auf der Strecke jeder kennt: Das kurvenäußere Vorderrad arbeitet beim Einlenken am härtesten. Es ist meist auch das, was zuerst Temperatur und Verschleiß zeigt.

> **Für die Pyrometer-Auswertung:** Ein deutlich heißeres kurvenäußeres Vorderrad ist **normal**, kein Befund. Interessant sind Abweichungen vom erwarteten Muster — siehe `CHAPTER_TRACK_VALIDATION_TIRES` §15.

---

## 6. Die Kurve in Phasen

Jede Kurve durchläuft Phasen mit unterschiedlicher Kraftverteilung. Setup-Probleme treten phasenspezifisch auf — deshalb ist die Phasentrennung die Grundlage jeder Diagnose.

| Phase | Längskraft | Querkraft | Dominanter Lasttransfer |
|---|---|---|---|
| **Braking** | Bremsen, hoch | gering | nach vorn |
| **Turn-in** | Bremsen fällt ab | steigt | vorn + beginnend quer |
| **Entry** | Trail Braking | hoch | kombiniert |
| **Mid-corner** | ≈ 0 | **maximal** | **rein quer** |
| **Exit / Power-on** | Antrieb steigt | fällt ab | nach hinten + quer |

### Was in welcher Phase zählt

| Phase | Primäre Einflussgrößen |
|---|---|
| Braking | Bremsbalance, Castor, Bump Steer, Dämpfer |
| Turn-in | Dämpfer, Toe, Ackermann, Castor, Camber Gain |
| Entry | Rollsteifigkeitsverteilung, Reifen, Fahrerinput |
| **Mid-corner** | **Rollsteifigkeitsverteilung, Camber, Reifen** |
| Exit | Traktion, Differential, Rear Grip, Axle Wrap |

> **Mid-corner ist der aussagekräftigste Zustand für die Balance-Beurteilung**, weil dort nur Querkräfte wirken. Probleme beim Bremsen oder Beschleunigen haben andere Ursachen und werden nicht über die Rollsteifigkeit gelöst.

### Die Diagnoseregel

> **Die früheste problematische Phase zuerst lösen.**

Eine Kurve wird in Reihenfolge durchfahren. Ist das Fahrzeug beim Einlenken schon instabil, ist jede Aussage über Mid-corner wertlos — der Fahrer kompensiert bereits.

Das ist in `CHAPTER_HANDLING_DIAGNOSIS_DECISION_TREE` als Leitregel verankert.

---

## 7. Dämpfer — die transiente Dimension

Federn und Stabilisatoren bestimmen, **wie viel** Lasttransfer entsteht. Dämpfer bestimmen, **wie schnell**.

| Zustand | Wirksam |
|---|---|
| **stationär** (Mid-corner, konstanter Radius) | Federn, ARB, Rollzentren |
| **transient** (Turn-in, Lastwechsel, Kerbs) | **zusätzlich Dämpfer** |

```text
Lasttransfer über Zeit beim Einlenken

   │        ╭──────────── stationärer Endwert
   │      ╱
   │    ╱     ← Steilheit bestimmt durch Dämpfung
   │  ╱
   │╱
   └──────────────────→ Zeit
```

> **Konsequenz für die Diagnose:** „Das Auto untersteuert mitten in der Kurve" → Federn, ARB, Rollzentren. „Das Auto reagiert träge beim Einlenken" → Dämpfer. Wer das verwechselt, dreht am falschen Rad.

**Für dieses Fahrzeug:** Bilstein-Dämpfer rundum, Ausführung in [`00_PROJECT.md`](00_PROJECT.md) §3 und §4 zu erfassen. Sind sie nicht verstellbar, ist das transiente Verhalten gegeben und keine Stellgröße — dann umso wichtiger, die stationären Größen sauber einzustellen.

---

## 8. Was das Fahrzeug begrenzt

Eine nüchterne Einordnung der Hebel, nach Wirkung sortiert:

| Hebel | Wirkt auf | Am Mustang |
|---|---|---|
| **Reifen** | alles | Avon CR6ZZ, 225er, hohe Flanke |
| **Masse** | Lasttransfer gesamt | nicht erfasst |
| **Schwerpunkthöhe** | Lasttransfer gesamt | **nicht gemessen** |
| **Spurweite** | Querlasttransfer | nicht erfasst |
| **Radstand** | Längslasttransfer | nicht erfasst |
| Rollsteifigkeitsverteilung | Balance | berechenbar, wenn Konstanten vorliegen |
| Rollzentren | geometrischer Anteil | vorn durch Shelby Drop angehoben |
| Alignment | Feinabstimmung | vollständig einstellbar |

> **Die ersten fünf Zeilen sind Fahrzeugeigenschaften, nicht Setup-Größen.** Sie legen fest, in welchem Rahmen das Setup überhaupt arbeiten kann. Vier davon sind nicht erfasst — das ist der Grund, warum dieses Projekt mit Messen beginnt und nicht mit Einstellen.

---

## 9. Was an diesem Fahrzeug einstellbar ist — und was nicht

> **Projektgrundsatz:** Dieses Handbuch nimmt **nichts** auf, was am Fahrzeug nicht umgesetzt werden kann. Ein Fahrzeug von 1966 hat konstruktiv begrenzte Verstellmöglichkeiten. Theorie, die zu keiner Handlung führt, gehört nicht hierher.

### 9.1 Einstellbar — hier wird gearbeitet

| Größe | Womit | Aufwand |
|---|---|---|
| **Castor** | UCA-Shims gegenläufig, Strut Rods, UCA-Heim | gering |
| **Camber** | LCA Camber Kit, UCA-Shims gleichsinnig, UCA-Heim | gering |
| **Toe** | Spurstangen | gering |
| **Reifendruck** | — | sofort |
| **ARB-Durchmesser vorn** | Tausch 1" / 1-1/8" | mittel |
| **Panhard-Länge** | Verstellung | gering |
| **Panhard-Höhe** | Anlenkpunkte | mittel bis hoch |
| **Pinion Angle** | Wedge Shim | mittel |
| **Federraten** | Federtausch | mittel |
| **Ride Height hinten** | Blattfederwahl, Flat Shims, Lowering Blocks | mittel |
| **Bump Steer** | Tie-Rod-Höhe, Bump-Steer-Kit | mittel bis hoch |

### 9.2 Eingeschränkt oder nur über Hardwarewechsel

| Größe | Einschränkung |
|---|---|
| **Ride Height vorn** | Keine stufenlose Höhenverstellung. Nur über Federwahl oder Spacer. SoT führt ausschließlich *Roller Spring Perches* (`ORP-RSP64-73`) — die reduzieren Reibung, **nicht** die Höhe. |
| **Cross Weight** | Ohne höhenverstellbare Federauflagen praktisch **nicht gezielt einstellbar**. Siehe 9.4. |
| **Rollzentrum vorn** | Durch Shelby Drop festgelegt; weitere Änderung nur über andere Geometrie |
| **Dämpfung** | Nur falls verstellbare Bilstein verbaut — Ausführung noch zu klären |
| **Hinterer ARB** | Nicht vorhanden; nachrüstbar, aber Eingriff |

### 9.3 Nicht einstellbar — konstruktiv festgelegt

| Größe | Warum |
|---|---|
| **KPI / SAI** | Bauteileigenschaft von Spindel und Querlenker. Abweichung = Diagnosebefund, kein Einstellwert. |
| **Ackermann** | Ergebnis der Lenkgeometrie. Ford: *„cannot be adjusted directly … check the spindle or other suspension parts for a bent condition."* |
| **Scrub Radius** | Aus Spindel und Felgenoffset gegeben |
| **Radstand, Spurweite** | Fahrzeuggeometrie (Spurweite minimal über LCA-Kit und Felgenoffset) |
| **Differential** | Eaton TrueTrac — kein einstellbares Sperrsystem |
| **Blattfeder-Rollsteifigkeit getrennt von Tragrate** | Bauartbedingt gekoppelt |

### 9.4 Besonderer Fall: Cross Weight

Das Handbuch behandelt Cross Weight ausführlich — mit einer Einschränkung, die hier deutlich stehen muss:

**Zum gezielten Einstellen von Cross Weight braucht es höhenverstellbare Federauflagen an mindestens zwei Ecken.** Die hat dieses Fahrzeug nach aktuellem Kenntnisstand nicht:

- vorn: Serien-Federteller oder Roller Perches, **keine Höhenverstellung**
- hinten: Blattfeder, **keine unabhängige Federtellerverstellung**

Was bleibt:

| Möglich | Bemerkung |
|---|---|
| Cross Weight **messen** | zwingend — als Diagnosegröße |
| Ursachen von Asymmetrie **finden** | Federbogen, Bind, Chassistoleranz |
| Über **Flat Shims** hinten korrigieren | grob, stufig, verändert auch Ride Height |
| Über **Ballast** korrigieren | verändert Gesamtmasse |
| Reale Masse verlagern | Longacre: nur so ändern sich Left/Rear-Prozente |

> **Konsequenz:** Cross Weight ist hier primär eine **Diagnosegröße**, keine Setup-Schraube. Ein abweichender Wert zeigt, dass etwas nicht stimmt — die Lösung liegt dann meist bei Bind, Federbogen oder Ride Height, nicht in einer Cross-Verstellung.
>
> Das relativiert die Oval-Literatur zusätzlich: Dort ist Cross die zentrale Stellgröße, weil Jack Screws vorhanden sind. Bei uns fehlt die Hardware — und auf symmetrischem Kurs wäre der Nutzen ohnehin begrenzt (`CHAPTER_TIRE_MECHANICS` §3.5).

### 9.5 Bewusst nicht behandelt

| Thema | Begründung |
|---|---|
| **Aerodynamik** | Karosserie von 1966, keine Aero-Hardware, keine Verstellmöglichkeit. Ein Frontspoiler wäre eine Einzelmaßnahme ohne Abstimmbarkeit — es gäbe nichts einzustellen. |
| **Bremsbalance** | Eigenes Fachgebiet. Wird in der Diagnose als mögliche Ursache genannt, aber nicht ausgearbeitet. |
| **Differentialabstimmung** | TrueTrac ist nicht einstellbar |
| **Dämpferkennlinien** | Nur sinnvoll bei verstellbaren Dämpfern |
| **Motor-/Antriebsabstimmung** | Anderes Projekt |
| **Fahrtechnik** | Dieses Handbuch beschreibt das Fahrzeug, nicht das Fahren |

> **Zur Aerodynamik im Besonderen:** Bei Rundstreckengeschwindigkeiten entstehen durchaus Auftriebs- und Luftwiderstandskräfte, und ein 60er-Jahre-Fastback erzeugt vorn eher Auftrieb als Abtrieb. Das ist physikalisch real — nur ist daran **nichts einstellbar**. Es wird deshalb nicht als Setup-Thema geführt. Sollte je ein verstellbarer Frontsplitter oder Heckflügel dazukommen, wäre das ein neues Kapitel.

---

## 10. Quellen

### Grundlagen

Die dargestellten Zusammenhänge — Lasttransfer, Reibkreis, Rollmoment, geometrischer und elastischer Anteil — sind **etablierte Fahrzeugdynamik**. Sie sind hier aus physikalischen Grundlagen hergeleitet, aber **noch nicht gegen eine zitierfähige Quelle geprüft**.

> **Dieses Kapitel enthält keine Zahlenwerte.** Die Formeln sind Strukturwissen; alle fahrzeugspezifischen Größen stehen als offen in [`00_PROJECT.md`](00_PROJECT.md) §8.2.

### Fachliteratur — Status

Verfügbarkeitsprüfung und Projektentscheidung: `docs/quellen/README.md` Abschnitt *B — Fachliteratur*.

> **Kurz:** Fachliteratur wird nicht gespiegelt. Wo ein Beleg nötig ist, wird die konkrete Textstelle mit Werk, Auflage und Seite zitiert — aus einem rechtmäßig beschafften Exemplar.


| Quelle | Wofür |
|---|---|
| Milliken & Milliken, *Race Car Vehicle Dynamics* | Lasttransfer, Rollmomentverteilung, Reibkreis |
| Carroll Smith, *Tune to Win* | praxisnahe Übersetzung in Setup-Arbeit |
| OptimumG — technische Artikel | TLLTD, Phasenanalyse |

Diese drei Quellen werden auch von [`CHAPTER_TIRE_MECHANICS.md`](CHAPTER_TIRE_MECHANICS.md) und [`CHAPTER_SPRINGS_ROLL_STIFFNESS.md`](CHAPTER_SPRINGS_ROLL_STIFFNESS.md) benötigt — **eine Beschaffung deckt drei Kapitel ab.**

### Verwandte Kapitel

| Kapitel | Bezug |
|---|---|
| [`CHAPTER_TIRE_MECHANICS.md`](CHAPTER_TIRE_MECHANICS.md) | was der Reifen aus der Last macht |
| [`CHAPTER_SPRINGS_ROLL_STIFFNESS.md`](CHAPTER_SPRINGS_ROLL_STIFFNESS.md) | wie der Lasttransfer verteilt wird |
| [`CHAPTER_BALANCE_CORNER_WEIGHT.md`](CHAPTER_BALANCE_CORNER_WEIGHT.md) | statische Radlasten als Ausgangszustand |
| `CHAPTER_HANDLING_DIAGNOSIS_DECISION_TREE` | Phasenlogik in der Praxis |

---

## 11. Definition of Done

- [x] Kräftebild mit vier Kontaktflächen
- [x] Reibkreis und Kombinationsgrenze
- [x] drei Drehachsen benannt
- [x] Längslasttransfer mit Formel
- [x] Querlasttransfer mit Formel
- [x] geometrischer und elastischer Pfad getrennt
- [x] Verbindung zu Load Sensitivity hergestellt
- [x] kombinierte Belastung als Überlagerung
- [x] Kurvenphasen mit dominanten Einflussgrößen
- [x] „früheste Phase zuerst" verankert
- [x] Dämpfer als transiente Größe abgegrenzt
- [x] Fahrzeuggrenzen von Setup-Größen getrennt
- [x] **Abgrenzung „was nicht behandelt wird"**
- [ ] Fachliteratur Klasse B beschafft
- [ ] Fahrzeugkonstanten gemessen
