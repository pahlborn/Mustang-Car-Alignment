# Mustang Track Chassis Setup — Fahrwerksbindung erkennen und beseitigen

**Dokumentrolle:** Fachkapitel — Diagnose von Bind, Überbestimmung und Hysterese
**Version:** 0.1
**Datum:** 2026-10-05
**Status:** Entwurf; Verfahren aus Primärquelle und Mechanik abgeleitet, Fahrzeugmessung offen
**Bezug:** [`CHAPTER_BALANCE_CORNER_WEIGHT`](CHAPTER_BALANCE_CORNER_WEIGHT.md) · [`CHAPTER_REAR_SUSPENSION_PANHARD_PINION`](CHAPTER_REAR_SUSPENSION_PANHARD_PINION.md) · [`DECISION_LEAF_SPRINGS`](DECISION_LEAF_SPRINGS.md)

---

## 1. Warum dieses Kapitel

Bind — Fahrwerksbindung — ist die häufigste Ursache dafür, dass Messungen nicht reproduzierbar sind und Einstellungen nicht die erwartete Wirkung zeigen.

Das Tückische daran: **Bind erzeugt keine Fehlermeldung.** Das Fahrzeug steht da, die Waage zeigt Zahlen, alles sieht normal aus. Erst die Wiederholungsmessung verrät, dass etwas nicht stimmt — und auch nur, wenn man sie macht.

> **Projektregel:** Bevor ein Zehntelgrad Camber oder ein halbes Prozent Cross Weight diskutiert wird, muss bewiesen sein, dass die Messung überhaupt reproduzierbar ist.

Dieses Kapitel betrifft unmittelbar die offene Entscheidung aus [`DECISION_LEAF_SPRINGS.md`](DECISION_LEAF_SPRINGS.md): Ob Panhard Bar und Delrin-Shackles zusammen ein überbestimmtes System bilden, ist eine Bind-Frage.

---

## 2. Was Bind ist

**Bind** ist eine Verspannung im Fahrwerk, die verhindert, dass sich die Aufhängung in ihre natürliche, kräftefreie Lage setzt.

```text
ohne Bind:              mit Bind:

Last → Feder → Rad      Last → Feder → Rad
                                    ↑
                              Zwangskraft aus
                              Reibung oder
                              Überbestimmung
```

Die Folge: Ein Teil der Radlast wird nicht von der Feder getragen, sondern von einer **Zwangskraft** — Reibung, Buchsenverspannung oder einem zweiten Bauteil, das dieselbe Bewegung festlegt.

### Drei Erscheinungsformen

| Form | Ursache | Typisch für |
|---|---|---|
| **Reibungsbind** | Dämpferdichtung, Buchsen, Blattfederlagen | jedes Fahrwerk |
| **Camber-Bind** | Rad will beim Absetzen seitlich wandern, kann aber nicht | Messung auf der Waage |
| **Überbestimmung** | zwei Bauteile legen denselben Freiheitsgrad fest | Starrachse mit Panhard + steifen Buchsen |

Die ersten beiden sind **Messprobleme** — sie verschwinden mit der richtigen Prozedur. Das dritte ist ein **Konstruktionsproblem** und bleibt auch auf der Strecke.

---

## 3. Camber-Bind beim Wiegen

Dies ist die von Longacre beschriebene Form.

### Der Mechanismus

> „When you lift your race car to put it on scales the **front wheels camber in** toward the center of the car. As you let it down on the scales the wheels **must be able to move back out** to return to normal. If the tires (and scale pads) **can't move sideways freely** they will actually keep the chassis **in a slight bind** and not allow it to settle out completely. This will have an effect on the weights you get and thus **the accuracy of your setup**."
> — Longacre, Quelle A-22

```text
angehoben:              abgesetzt:
  ╲  ╱                    │  │
   ╲╱   Räder kippen      │  │  Räder müssen
   ──   nach innen        ──   nach außen wandern
                               ← → Reibung verhindert das
```

### Warum ausgerechnet vorn

Der Effekt stammt aus dem **Camber Gain** der Doppelquerlenkerachse: Beim Ausfedern wandert das Rad in Richtung positiven Cambers, beim Einfedern in Richtung negativen. Die Spurweite ändert sich dabei geringfügig mit.

Beim Shelby Drop ist der Camber Gain gezielt erhöht (siehe `CHAPTER_SETUP_PAD_RIDE_HEIGHT` §18) — **also ist auch die Seitwärtsbewegung beim Absetzen größer**. Unser Fahrzeug ist für diesen Effekt empfindlicher als ein Serienfahrzeug.

An der Blattfeder-Starrachse tritt das kaum auf: Die Räder stehen fest zur Achse, der Camber ändert sich über Federweg praktisch nicht.

### Gegenmaßnahmen nach Aufwand

| Lösung | Wirkung | Quelle |
|---|---|---|
| Fahrzeug zurück- und vorwärtsrollen | hilft, aber „unless it is done several times there could still be some bind left" | A-22 |
| **Slip Plates** (zwei Platten, Teflon dazwischen) | „low friction, **not friction free**" — Restbind bleibt | A-22 |
| **Rollenplatten** (Side Sliders o. ä.) | „all side friction has been eliminated" | A-22 |

Longacre nennt einen praktischen Hinweis:

> „These should be used **under the left front** as that wheel usually has the most camber gain. **Only one is needed** to relieve the bind on both sides. Spacers of equal thickness are included for the other 3 corners to maintain a level setup."

> **Für unser Setup Pad:** Eine Rollenplatte unter einem Vorderrad plus höhengleiche Platten an den anderen drei Ecken ist die wirksamste und günstigste Verbesserung. Das ergänzt die Anforderungen in `CHAPTER_SETUP_PAD_RIDE_HEIGHT` §8.

### Nebennutzen

> „If you push down on the car to move the suspension you **can see the scale pad moving sideways slightly**, relieving any bind. Without them the suspension would not move completely freely and **any adjustments you make might not show up in the wheel weights exactly as you intended**."

Das ist zugleich ein **Diagnosemittel**: Bewegt sich die Platte sichtbar, war Bind vorhanden.

---

## 4. Überbestimmung — das strukturelle Problem

### Das Prinzip

Jedes Bauteil, das eine Bewegung festlegt, nimmt einen **Freiheitsgrad**. Eine Starrachse hat sechs: drei Verschiebungen, drei Drehungen. Davon sollen fünf geführt und einer frei beweglich sein — das Einfedern.

```text
Freiheitsgrad          soll geführt werden durch
─────────────────────────────────────────────────
vertikal (Federweg)    → FREI (das ist der Zweck)
längs                  → Blattfeder (vorderes Auge)
lateral                → Panhard Bar
Gieren                 → Blattfeder (beide Seiten)
Nicken (Axle Wrap)     → Blattfeder (Wickelsteifigkeit)
Rollen                 → Blattfedern über Federbasis
```

**Überbestimmung liegt vor, wenn ein Freiheitsgrad von zwei Bauteilen gleichzeitig festgelegt wird.** Dann müssen beide exakt dieselbe Bewegungsbahn beschreiben — sonst verspannen sie sich gegeneinander.

### Der konkrete Fall: Panhard + steife Shackle-Buchsen

```text
Panhard Bar         → legt die laterale Achsposition fest
                      auf einem Kreisbogen um den Chassis-Pivot

Shackle-Buchse      → lässt die Feder seitlich ausweichen
  (Gummi)             und folgt dem Panhard-Bogen

Shackle-Buchse      → verhindert seitliches Ausweichen
  (Delrin/fest)       und erzwingt die Blattfeder-Bahn
                             ↓
                      ZWEI unterschiedliche Bahnen
                             ↓
                         VERSPANNUNG
```

Zwei unabhängige Herstellerquellen warnen davor:

> „Replacing the bushing with a solid material **prevents the spring from moving side to side, increasing bind** and ultimately resulting in **unpredictable feel**. That's why we actually **prefer the stock rubber for the leaf shackles**."
> — Mike Maier Inc., Quelle C-02

> Eine zusätzliche Panhard Bar zusammen mit sehr stark lateral kontrollierenden Blattfederbuchsen kann **Bind erzeugen**.
> — Global West, über `CHAPTER_REAR_SUSPENSION_PANHARD_PINION` §5

### Warum der Panhard-Bogen und die Federbahn nicht zusammenpassen

Der Panhard beschreibt beim Einfedern einen **Kreisbogen** um seinen Chassis-Anlenkpunkt — die Achse wandert dabei seitlich (siehe `CHAPTER_REAR_SUSPENSION_PANHARD_PINION` §10).

Die Blattfeder beschreibt beim Einfedern eine **andere Bahn**, bestimmt von Federbogen und Schackelwinkel.

Beide Bahnen sind geometrisch verschieden. Mit nachgiebigen Buchsen ist das unkritisch — die Gummielastizität gleicht die Differenz aus. Mit starren Buchsen muss sich die Differenz irgendwo anders abbauen: als Verspannung im Federblatt, in der Achsaufnahme oder im Panhard selbst.

---

## 5. Symptome

### In der Werkstatt

| Beobachtung | Verdacht |
|---|---|
| Radlasten streuen über 1–2 % bei Wiederholung | Bind |
| Nach Anheben/Absetzen andere Werte als vorher | Bind |
| Cross Weight ändert sich ohne Einstellarbeit | Bind |
| Ride Height nicht reproduzierbar | Bind oder Settling |
| Fahrzeug „setzt sich" erst nach mehrfachem Rollen | Reibungsbind |
| Beim Niederdrücken bewegt sich die Waagenplatte seitlich | Camber-Bind (sichtbar) |

### Auf der Strecke

| Beobachtung | Verdacht |
|---|---|
| nervös über Kerbs und Bodenwellen | Bind oder zu wenig Federweg |
| unvorhersehbares Verhalten im Grenzbereich | Überbestimmung |
| Links- und Rechtskurven unterschiedlich | asymmetrischer Bind |
| harsches Ansprechen auf kleine Unebenheiten | steife Buchsen, Reibung |
| Setup-Änderungen zeigen nicht die erwartete Wirkung | Bind überlagert die Änderung |

> **Der letzte Punkt ist der gefährlichste.** Wer bei vorhandenem Bind Setup-Arbeit macht, optimiert gegen ein Rauschen. Die Änderungen scheinen willkürlich zu wirken — und man zieht falsche Schlüsse über das Fahrzeug.

---

## 6. Der Bind-Test

### 6.1 Reproduzierbarkeitstest der Radlasten

Das Grundverfahren. Kein Zusatzwerkzeug nötig.

**Voraussetzungen**

- Race-Ready-Zustand nach [`02_WORKFLOW.md`](02_WORKFLOW.md) §6
- Setup Pad coplanar, Waagen genullt und plausibilisiert
- ARB **gelöst oder nachweislich spannungsfrei** — sonst misst man den Stabilisator mit
- Lenkrad gerade, Bremse gelöst

**Ablauf**

```text
1.  Fahrzeug auf die Waagen, Settling-Prozedur
2.  Messung A: LF / RF / LR / RR erfassen
3.  Fahrzeug anheben, bis alle Räder frei sind
4.  Wieder absetzen
5.  Settling-Prozedur wiederholen — identisch zu Schritt 1
6.  Messung B erfassen
7.  Schritte 3–6 ein drittes Mal → Messung C
```

**Auswertung**

| Streuung (max − min je Ecke) | Bewertung |
|---|---|
| < 0,5 % der Gesamtmasse | gut — Setup-Arbeit möglich |
| 0,5 – 1 % | grenzwertig — Ursache suchen |
| **> 1 %** | **Bind. Keine Setup-Arbeit, bevor das geklärt ist.** |

Zusätzlich auswerten: **Streut das Cross Weight stärker als die Einzelecken?** Dann liegt ein diagonaler Effekt vor — typisch für Verspannung.

> Die Prozentangaben sind **Projektfestlegung**, keine Herstellerangabe. Sie dienen als Arbeitsschwelle und sind nach den ersten realen Messungen zu überprüfen.

### 6.2 Sichttest auf Camber-Bind

Ohne Rollenplatten:

1. Fahrzeug steht auf den Waagen
2. Vorderwagen kräftig niederdrücken und loslassen
3. **Radlasten vorher und nachher vergleichen**

Ändern sich die Werte deutlich, hat sich Verspannung abgebaut, die vorher mitgemessen wurde.

Mit Slip- oder Rollenplatten: Die seitliche Plattenbewegung ist direkt sichtbar (§3).

### 6.3 Test auf laterale Überbestimmung — Hinterachse

Dieser Test zielt auf den Panhard/Shackle-Konflikt.

**Verfahren A — Panhard lösen**

```text
1.  Radlasten im Istzustand erfassen (Messung A)
2.  Panhard Bar an einem Ende lösen
3.  Fahrzeug anheben, absetzen, Settling
4.  Radlasten erneut erfassen (Messung B)
5.  Panhard wieder anschließen — ohne zu verspannen
6.  Radlasten erneut (Messung C)
```

| Ergebnis | Deutung |
|---|---|
| A ≈ B ≈ C | kein lateraler Bind — Panhard und Federn vertragen sich |
| **A ≠ B**, B ≈ C | Panhard war verspannt eingebaut → Länge/Einbaulage prüfen |
| **A ≈ B ≠ C** | Anschließen erzeugt Verspannung → **Panhard-Länge falsch** |
| alle verschieden | mehrfacher Bind — Ursachen einzeln isolieren |

> **Beim Wiederanschließen** muss sich der Panhard-Bolzen **ohne Kraft** einführen lassen. Muss gehebelt oder gezogen werden, steht die Achse nicht dort, wo der Panhard sie haben will — das ist direkt sichtbare Überbestimmung.

**Verfahren B — Federweg von Hand**

```text
1.  Hinterwagen so aufbocken, dass die Achse frei hängt
2.  Achse langsam von Hand durch den Federweg bewegen
3.  Auf Hakeln, Klemmen oder plötzlichen Widerstand achten
4.  Gleiche Prüfung mit gelöstem Panhard wiederholen
```

Ist die Bewegung ohne Panhard deutlich leichter, führt die Kombination zu Bind.

### 6.4 Hysteresetest

Prüft die Reibung im System.

```text
1.  Fahrzeug belasten (von oben drücken), loslassen → Ride Height messen
2.  Fahrzeug entlasten (anheben, absetzen) → Ride Height messen
3.  Differenz = Hysterese
```

Eine große Differenz bedeutet: Die Aufhängung findet ihre Lage nicht selbst, sondern bleibt dort stehen, wo die Reibung sie festhält. Bei Blattfedern ist eine gewisse Hysterese **bauartbedingt normal** (Reibung zwischen den Lagen) — aber sie sollte links und rechts ähnlich sein.

| Beobachtung | Deutung |
|---|---|
| Hysterese links ≈ rechts | normal für Blattfeder |
| Hysterese einseitig deutlich größer | Verdacht auf Bind oder Bauteilproblem auf dieser Seite |

> **Mögliche Verbindung zur bekannten 20-mm-Differenz:** `CHAPTER_SETUP_PAD_RIDE_HEIGHT` §21 führt die linke Heckdifferenz als ungeklärt. Ein einseitiger Hysteresebefund wäre eine ernstzunehmende Spur — und würde erklären, warum der Wert reproduzierbar auftritt, ohne dass ein Bauteil erkennbar falsch ist.

---

## 7. Ursachen eingrenzen

Wenn ein Bind-Befund vorliegt, systematisch isolieren — **eine Komponente nach der anderen**:

```text
Bind nachgewiesen
      ↓
ARB gelöst?          → nein: lösen, neu messen
      ↓ ja
Panhard gelöst?      → Test 6.3 Verfahren A
      ↓
Dämpfer gelöst?      → ein Ende lösen, neu messen
      ↓
Shackle-Buchsen?     → Beweglichkeit prüfen, ggf. tauschen
      ↓
Federaugen?          → Beweglichkeit prüfen
      ↓
Waagenpads/Boden?    → Slip-/Rollenplatten einsetzen
      ↓
Bremse, Handbremse?  → gelöst?
```

**Checkliste der üblichen Verdächtigen**

| Bauteil | Prüfung |
|---|---|
| Stabilisator / Endlinks | gelöst oder spannungsfrei? Endlinks in Neutrallage? |
| Panhard Bar | Bolzen kraftfrei einführbar? |
| Dämpfer | Dichtungsreibung — im ausgebauten Zustand von Hand prüfen |
| Shackle-Buchsen | lassen sie laterale Bewegung zu? |
| Vordere Federaugen | Buchse nicht übermäßig vorgespannt? |
| U-Bolts | gleichmäßig und nicht überzogen angezogen |
| Waagenpads | coplanar, seitlich beweglich |
| Bremsen | vollständig gelöst, kein Restschleifen |
| Lenkung | Lenkrad gerade, Spurstangen spannungsfrei |

---

## 8. Projektregeln

1. **Vor jeder Setup-Session:** Reproduzierbarkeitstest nach §6.1. Ohne bestandenen Test keine Zehntelarbeit.
2. **ARB beim Wiegen immer gelöst** oder nachweislich neutral.
3. **Panhard-Bolzen muss kraftfrei passen.** Wenn nicht: Länge korrigieren, nicht hebeln.
4. **Jede Buchsenänderung** an der Hinterachse erfordert einen neuen Bind-Test.
5. **Bei Streuung über 1 %:** Ursache suchen, nicht mitteln.
6. **Keine Setup-Schlüsse** aus Messungen mit bekanntem Bind.

---

## 9. Was für dieses Fahrzeug zu tun ist

| Schritt | Status |
|---|---|
| Sind Delrin-Shackles verbaut oder geplant? | **offen** |
| Reproduzierbarkeitstest Radlasten | **nicht durchgeführt** |
| Test auf laterale Überbestimmung (§6.3) | **nicht durchgeführt** |
| Hysteresetest links/rechts | **nicht durchgeführt** |
| Slip-/Rollenplatten vorhanden? | **offen** |
| Panhard-Bolzen kraftfrei? | **offen** |

> **Diese Tests sind die Voraussetzung für die Entscheidung in** [`DECISION_LEAF_SPRINGS.md`](DECISION_LEAF_SPRINGS.md). Erst wenn geklärt ist, ob Panhard und Shackle-Buchsen zusammenarbeiten, lässt sich sinnvoll über Federraten sprechen.

---

## 10. Quellen

**Longacre — Bind Free Chassis Setups**
`docs/quellen/A-22-longacre-bind-free-chassis-setups.html`, Textextrakt in `A-19`
Belegt: Camber-Bind-Mechanismus beim Absetzen, Wirksamkeit von Roll-off/Slip Plates/Rollen, Hinweis auf das linke Vorderrad, Sichtbarkeit der Plattenbewegung als Diagnose.

**Mike Maier Inc. — MOD Leaf Springs**
`docs/quellen/C-02-mmi-mod-leaf-springs.md`
Belegt: Warnung vor festen Shackle-Buchsen, Begründung über die laterale Doppelfunktion der Blattfeder.

**Global West** — über `CHAPTER_REAR_SUSPENSION_PANHARD_PINION` §5
Belegt: Bind-Risiko bei Panhard plus stark lateral kontrollierenden Buchsen.

> **Nicht aus Quellen:** Die Schwellenwerte in §6.1 (0,5 % / 1 %), die Testverfahren in §6.3 und §6.4 sowie die Ursachenkette in §7 sind aus der Mechanik abgeleitete **Projektfestlegungen**. Sie sind nach den ersten realen Messungen zu überprüfen und gegebenenfalls anzupassen.

---

## 11. Definition of Done

- [x] Bind definiert, drei Erscheinungsformen getrennt
- [x] Camber-Bind aus Primärquelle belegt
- [x] Verbindung Shelby Drop → stärkerer Camber-Bind hergestellt
- [x] Überbestimmung als Freiheitsgrad-Problem erklärt
- [x] Panhard/Shackle-Konflikt mit zwei Herstellerquellen belegt
- [x] Symptome Werkstatt und Strecke getrennt
- [x] Reproduzierbarkeitstest mit Schwellenwerten
- [x] Test auf laterale Überbestimmung mit Auswertungsmatrix
- [x] Hysteresetest, Verbindung zur 20-mm-Differenz
- [x] Ursachen-Eingrenzung als Entscheidungsbaum
- [x] Projektfestlegungen als solche gekennzeichnet
- [ ] Reproduzierbarkeitstest am Fahrzeug durchgeführt
- [ ] Panhard-Test durchgeführt
- [ ] Hysterese links/rechts gemessen
- [ ] Schwellenwerte gegen reale Streuung validiert
- [ ] Slip-/Rollenplatten beschafft oder als entbehrlich bewertet
