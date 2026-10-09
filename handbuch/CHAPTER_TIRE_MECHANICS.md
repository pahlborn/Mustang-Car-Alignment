# Mustang Track Chassis Setup — Der Reifen als Kraftübertrager

**Dokumentrolle:** Fachkapitel — physikalische Grundlage für Balance und Trackdaten
**Version:** 0.1
**Datum:** 2026-10-05
**Status:** Entwurf; Grundlagen aus Fahrzeugdynamik, Reifendaten vollständig offen
**Bezug:** [`00_PROJECT.md`](00_PROJECT.md) · [`CONVENTIONS.md`](CONVENTIONS.md) · [`CHAPTER_SPRINGS_ROLL_STIFFNESS.md`](CHAPTER_SPRINGS_ROLL_STIFFNESS.md)

---

## 1. Warum dieses Kapitel am Anfang stehen müsste

Jede Kraft zwischen Fahrzeug und Strecke läuft durch vier Kontaktflächen von je etwa der Größe einer Handfläche. Alles, was dieses Handbuch über Alignment, Balance und Fahrwerk sagt, hat nur einen Zweck: **diese vier Flächen in einen günstigen Zustand zu bringen.**

Ohne ein Verständnis davon, wie ein Reifen Kraft erzeugt, bleiben drei Dinge unerklärt:

| Frage | Wird beantwortet in |
|---|---|
| Warum kostet Lasttransfer Grip? | §3 Load Sensitivity |
| Warum braucht ein Reifen Schräglauf, um zu lenken? | §2 Slip Angle |
| Warum ist negativer Camber nicht automatisch besser? | §4 Camber und Contact Patch |
| Warum sagt ein einzelner Temperaturwert so wenig? | §6 Temperatur |

Dieses Kapitel liefert die Begründungen, auf die sich `CHAPTER_SPRINGS_ROLL_STIFFNESS`, `CHAPTER_FRONT_GEOMETRY_CAMBER_CASTER_KPI` und `CHAPTER_TRACK_VALIDATION_TIRES` stützen.

---

## 2. Schräglauf — wie ein Reifen Seitenkraft erzeugt

### 2.1 Das Grundprinzip

Ein rollender Reifen erzeugt Seitenkraft **nur dann**, wenn seine Rollrichtung und seine Bewegungsrichtung voneinander abweichen. Dieser Winkel heißt **Schräglaufwinkel** (*slip angle*, α).

```text
Draufsicht auf ein kurvenäußeres Vorderrad

        Rollrichtung des Rades
              ↗
             ╱
            ╱  α  ← Schräglaufwinkel
           ╱_____
          ╱      → tatsächliche Bewegungsrichtung
     ════╪════
         Reifen
```

**Das ist kontraintuitiv und wird oft missverstanden:** Das Rad „zieht" nicht in die Richtung, in die es zeigt. Es zeigt leicht *weiter nach innen*, als es tatsächlich fährt — und erzeugt daraus die Seitenkraft.

Ohne Schräglauf keine Seitenkraft. Ein Fahrzeug, das eine Kurve fährt, hat an **allen vier** Rädern Schräglauf.

### 2.2 Warum das so ist

Die Latschelemente treten beim Einlauf in die Kontaktfläche unverformt ein. Je weiter sie durch den Latsch wandern, desto stärker werden sie seitlich ausgelenkt — sie haften und werden mitgeschleppt. Die Rückstellkraft des Gummis summiert sich über die Latschlänge zur Seitenkraft.

Im hinteren Teil des Latsches überschreitet die nötige Haftkraft die Reibgrenze. Dort **gleiten** die Elemente. Der Übergangspunkt wandert mit steigendem Schräglaufwinkel nach vorn.

| Zustand | Latsch | Seitenkraft |
|---|---|---|
| kleiner α | überwiegend Haften | steigt nahezu linear |
| mittlerer α | Haft-/Gleitgebiet gemischt | Maximum |
| großer α | überwiegend Gleiten | **fällt wieder ab** |

### 2.3 Die Schräglaufkurve

```text
Seitenkraft
    │        ╭──────╮
    │      ╭─╯      ╰──╮        ← Maximum, dann Abfall
    │    ╭─╯           ╰───╮
    │  ╭─╯
    │╭─╯   ← linearer Bereich
    └──────────────────────────→  Schräglaufwinkel α
      0   2°  4°  6°  8°  10°
```

Drei Bereiche mit unterschiedlichem Fahrverhalten:

| Bereich | Charakter | Fahrereindruck |
|---|---|---|
| **linear** | Kraft ∝ Winkel | präzise, berechenbar |
| **Übergang** | Maximum, flach | „der Reifen arbeitet" |
| **übersteigert** | Kraft fällt wieder | rutschig, träge, **heiß** |

**Entscheidend für die Praxis:** Jenseits des Maximums wird das Fahrzeug nicht nur langsamer, sondern auch *schwerer kontrollierbar* — mehr Lenkwinkel bringt **weniger** Kurvenkraft. Und die Reifentemperatur steigt stark, weil der Gleitanteil im Latsch zunimmt.

> **Für die Trackdaten-Auswertung:** Ein Vorderreifen, der deutlich heißer ist als der Hinterreifen, kann schlicht bedeuten, dass die Vorderachse jenseits ihres Schräglaufoptimums arbeitet — also untersteuert. Die Temperatur ist dann **Symptom**, nicht Ursache.

### 2.4 Wo das Maximum liegt

Die Lage des Maximums ist eine **Reifeneigenschaft** und streut erheblich:

| Bauart | typischer Bereich |
|---|---|
| Diagonalreifen (bias-ply) | eher höher, flacheres Maximum |
| Radial-Straßenreifen | mittlerer Bereich |
| Radial-Semislick / Rennreifen | eher niedriger, ausgeprägteres Maximum |

> **Nicht belegt für unseren Reifen.** Für den **Avon CR6ZZ** liegen keine Schräglaufdaten vor. Herstellerdaten sind nach [`00_PROJECT.md`](00_PROJECT.md) §7 noch zu beschaffen. Ohne Reifenkennfeld bleibt die Lage des Maximums eine Unbekannte — bemerkbar wird sie nur indirekt über Fahrerfeedback und Temperaturverlauf.

### 2.5 Verbindung zum Setup

Zwei Stellgrößen wirken direkt auf den Schräglauf:

**Toe** erzeugt bereits in Geradeausfahrt einen Schräglaufwinkel an beiden Vorderrädern — gegenläufig, die Seitenkräfte heben sich auf. Das kostet Rollwiderstand und Temperatur, bringt aber Ansprechverhalten beim Einlenken. Siehe `CHAPTER_TOE_ACKERMANN_THRUST` §3.

**Ackermann** bestimmt, ob kurveninneres und kurvenäußeres Rad gleichzeitig in ihrem optimalen Schräglaufbereich arbeiten. Die beiden Räder fahren unterschiedliche Radien und bräuchten deshalb unterschiedliche Lenkwinkel — aber auch unterschiedliche Schräglaufwinkel. Das ist der Grund, warum „100 % geometrisches Ackermann" nicht automatisch optimal ist (siehe `CHAPTER_TOE_ACKERMANN_THRUST` §15).

---

## 3. Load Sensitivity — warum Lasttransfer Grip kostet

Dies ist der zentrale Baustein für das gesamte Balance-Verständnis.

### 3.1 Der Effekt

Die übertragbare Seitenkraft steigt mit der Radlast — aber **degressiv**. Der effektive Reibbeiwert sinkt mit steigender Last.

```text
Seitenkraft
    │                    ╭────────   ← flacht ab
    │              ╭─────╯
    │        ╭─────╯
    │    ╭───╯
    │  ╭─╯     gestrichelt: lineares Verhalten (gibt es nicht)
    │╭─╯
    └────────────────────────────→ Radlast
```

| Radlast | Seitenkraft | µ effektiv |
|---:|---:|---:|
| 400 kg | 3600 N | 0,92 |
| 500 kg | 4300 N | 0,88 |
| 600 kg | 4900 N | 0,83 |
| 700 kg | 5400 N | 0,79 |

> Die Zahlen sind **idealisiert und illustrativ** — sie zeigen die Form, nicht die Werte eines realen Reifens.

### 3.2 Die Konsequenz

Zwei Räder einer Achse mit je 500 kg liefern **mehr** Gesamtseitenkraft als eines mit 400 und eines mit 600 kg:

```text
symmetrisch:     4300 + 4300  =  8600 N
mit Transfer:    3600 + 4900  =  8500 N      → 100 N weniger
```

**Lasttransfer kostet immer Gesamtgrip an der betroffenen Achse.** Und: Je mehr Transfer eine Achse bekommt, desto mehr verliert sie **anteilig**.

### 3.3 Daraus folgt die gesamte Balance-Logik

```text
Achse steifer (Feder/Stabi/Rollzentrum höher)
        ↓
mehr Rollmoment auf diese Achse
        ↓
mehr Lasttransfer an dieser Achse
        ↓
Load Sensitivity → mehr anteiliger Gripverlust
        ↓
Fahrzeug dreht sich von dieser Achse weg
```

| Maßnahme | Folge |
|---|---|
| vorn steifer | Vorderachse verliert anteilig → **Untersteuern** |
| hinten steifer | Hinterachse verliert anteilig → **Übersteuern** |

> **Das ist die physikalische Begründung für die Tabelle in** [`CHAPTER_SPRINGS_ROLL_STIFFNESS.md`](CHAPTER_SPRINGS_ROLL_STIFFNESS.md) **§3.4.** Ohne Load Sensitivity wäre nicht erklärbar, warum die Verteilung der Rollsteifigkeit überhaupt die Balance beeinflusst.

### 3.4 Die zweite Konsequenz: Masse und Schwerpunkt

Load Sensitivity erklärt auch, warum Gewicht und Schwerpunkthöhe so stark wirken:

```text
Lasttransfer_lateral ≈ (m · a_y · h_CG) / t
```

Beide — Masse `m` und Schwerpunkthöhe `h_CG` — erhöhen den Transfer an **beiden** Achsen. Das kostet Gesamtgrip, unabhängig von jeder Balance-Einstellung.

> **Deshalb ist `cg_height` in** [`00_PROJECT.md`](00_PROJECT.md) **§8.2 der wichtigste fehlende Einzelwert des Projekts.**

### 3.5 Und die dritte: Cross Weight hat Grenzen

Wenn statische Radlastunterschiede Grip kosten, warum dann überhaupt Cross Weight verstellen?

Weil Cross Weight die **diagonale** Verteilung betrifft und damit Links- und Rechtskurven unterschiedlich beeinflusst. Auf einem Oval mit nur einer Kurvenrichtung ist das ein echter Hebel. Auf einem symmetrischen Rundkurs verbessert eine Cross-Verstellung die eine Kurvenrichtung genau so weit, wie sie die andere verschlechtert.

> Das ist die physikalische Begründung für die Projektregel „50 % ist Baseline für Symmetrie, nicht Dogma" in `CHAPTER_BALANCE_CORNER_WEIGHT` §4 — und dafür, warum Oval-Cross-Regeln hier nicht übernommen werden.

---

## 4. Camber und Aufstandsfläche

### 4.1 Was Camber bewirkt

Zwei getrennte Effekte, die oft vermischt werden:

| Effekt | Wirkung |
|---|---|
| **Aufstandsflächenlage** | Bei Kurvenfahrt rollt die Karosserie, der Reifen verformt sich. Negativer statischer Camber kann das belastete Außenrad näher an eine flächige Auflage bringen. |
| **Camber Thrust** | Ein geneigter Reifen erzeugt eine Seitenkraft **auch ohne Schräglauf** — er will auf einem Kegelmantel rollen. |

Camber Thrust ist deutlich schwächer als die Schräglaufkraft, aber im linearen Bereich spürbar — er trägt zum Ansprechverhalten beim Einlenken bei.

### 4.2 Warum mehr nicht besser ist

Negativer Camber verteilt die Last **innerhalb** der Aufstandsfläche um. In Geradeausfahrt — also beim Bremsen — wird die Innenkante überlastet und die wirksame Fläche kleiner.

| Zu wenig Camber | Zu viel Camber |
|---|---|
| Außenkante trägt in der Kurve | Innenkante trägt beim Bremsen |
| wenig Mid-Corner-Grip | wenig Bremsgrip, Geradeauslaufverlust |
| | höherer Verschleiß innen |

> Der optimale Wert ist der **Kompromiss zwischen Kurve und Geradeaus** — und er hängt vom Rollwinkel ab, also von Federraten, Stabi und Rollzentren. Das verbindet dieses Kapitel mit [`CHAPTER_SPRINGS_ROLL_STIFFNESS.md`](CHAPTER_SPRINGS_ROLL_STIFFNESS.md).

### 4.3 Camber Gain

Der statische Camber ist nur der Ausgangswert. Was zählt, ist der Camber **im belasteten Zustand**:

```text
Camber_dynamisch = Camber_statisch
                 + Camber Gain über Federweg
                 − Rollwinkel der Karosserie
                 + Castor-induzierter Camber beim Lenken
                 − Reifenverformung
```

Ein Fahrzeug mit hohem Camber Gain braucht weniger statischen Camber. Der Shelby Drop verbessert genau diesen Camber Gain (siehe `CHAPTER_SETUP_PAD_RIDE_HEIGHT` §18) — ein weiterer Grund, warum Fremdempfehlungen für Camber nur begrenzt übertragbar sind.

---

## 5. Reifendruck

### 5.1 Was der Druck tatsächlich tut

Der Druck trägt die Last — nicht die Karkasse. Daraus folgt:

```text
Aufstandsfläche ≈ Radlast / Reifendruck
```

Das ist eine Näherung (die Karkassensteifigkeit trägt mit), aber sie erklärt die Grundrichtung:

| Druck | Aufstandsfläche | Charakter |
|---|---|---|
| niedriger | größer, aber weicher | mehr Verformung, mehr Walkarbeit, mehr Wärme |
| höher | kleiner, steifer | direkter, weniger Wärme, ggf. weniger Grip |

### 5.2 Die Querverteilung

Der Druck beeinflusst, **wie** sich die Last über die Latschbreite verteilt:

```text
zu niedrig:    Schultern tragen, Mitte hebt ab
richtig:       gleichmäßig
zu hoch:       Mitte trägt, Schultern entlastet
```

> **Das ist die Grundlage für die Pyrometer-Auswertung** in `CHAPTER_TRACK_VALIDATION_TIRES` §13–14 — und erklärt, warum die Temperaturverteilung innen/Mitte/außen **zwei** Fragen gleichzeitig beantwortet: Camber (Innen-Außen-Gefälle) und Druck (Mitte gegen Schultern).

### 5.3 Warmdruck, nicht Kaltdruck

Der Reifen arbeitet bei Betriebstemperatur. Der Kaltdruck ist nur das Mittel, um einen bestimmten Warmdruck zu erreichen.

Der Druckanstieg selbst ist eine Information: Er zeigt, wie viel Energie im Reifen umgesetzt wird. Ein Reifen mit hohem Anstieg arbeitet hart — durch Gleitanteil, Walkarbeit oder Überlastung.

> Die Projekt-Baseline von **2,2 bar warm** steht in [`00_PROJECT.md`](00_PROJECT.md) §8, Herkunft offen.

---

## 6. Temperatur — was sie sagt und was nicht

### 6.1 Temperatur ist Folge, nicht Ursache

Wärme entsteht aus **Energieumsatz im Gummi**: Walkarbeit und Gleitreibung im Latsch. Eine hohe Reifentemperatur bedeutet, dass der Reifen viel arbeitet — das kann heißen:

- er trägt viel Last
- er gleitet viel (jenseits des Schräglaufoptimums)
- er verformt sich viel (niedriger Druck)
- er ist in vielen Kurven belastet (Streckencharakteristik)

> **Ein einzelner Temperaturwert kann zwischen diesen Ursachen nicht unterscheiden.** Deshalb die Projektregel in `CHAPTER_TRACK_VALIDATION_TIRES` §13: Temperaturdaten immer gemeinsam mit Druck, Reifenbild und Fahrverhalten auswerten.

### 6.2 Zwei getrennte Fragen

Die Pyrometerdaten beantworten zwei verschiedene Fragen, die nicht vermischt werden dürfen:

| Frage | Vergleich | Hinweis auf |
|---|---|---|
| **Querverteilung** | innen / Mitte / außen auf **einem** Reifen | Camber und Druck |
| **Niveauvergleich** | Achse gegen Achse, Seite gegen Seite | Balance, Lastverteilung, Arbeitspunkt |

Beispiel: Beide Vorderreifen zeigen gleichmäßige Querverteilung, sind aber insgesamt 20 °C heißer als hinten. Die Querverteilung sagt: Camber und Druck passen. Der Niveauvergleich sagt: Die Vorderachse arbeitet härter — möglicher Hinweis auf Untersteuern.

### 6.3 Das Betriebsfenster

Jede Gummimischung hat einen Temperaturbereich, in dem sie den besten Grip liefert:

| Zustand | Verhalten |
|---|---|
| zu kalt | Gummi zu hart, wenig mechanische Verzahnung, wenig Grip |
| im Fenster | optimaler Kompromiss |
| zu heiß | Oberfläche schmiert, Grip fällt ab, Verschleiß steigt stark |

> **Nicht belegt für unseren Reifen.** Das Betriebsfenster des **Avon CR6ZZ** ist nicht bekannt. Herstellerdaten stehen in [`00_PROJECT.md`](00_PROJECT.md) §7 als zu beschaffen. Bis dahin: keine Zieltemperaturen aus Slick-Erfahrung übernehmen — der CR6ZZ ist ein historisch orientierter Radialreifen mit anderer Konstruktion.

---

## 7. Der Avon CR6ZZ in diesem Projekt

| Merkmal | Angabe | Status |
|---|---|---|
| Bezeichnung | Avon CR6ZZ 225/65 R15 99V | Projektangabe |
| Bauart | Radial | Projektangabe |
| Charakter | historisch orientierter Semi-Slick / Trackday-Reifen | Projektangabe |
| Felge | American Racing 15×7 | Projektangabe |
| Warmdruck-Baseline | 2,2 bar | Baseline, Herkunft offen |

### Was fehlt

| Größe | Bedeutung |
|---|---|
| Schräglaufoptimum | wo arbeitet der Reifen am besten? |
| Betriebstemperaturfenster | welche Temperatur anstreben? |
| empfohlener Druckbereich | Herstellerrahmen für die Baseline |
| Camber-Empfehlung | Konstruktionsabhängig |
| Load Rating / zulässige Radlast | Betriebsgrenze |

> **Wichtige Abgrenzung:** Der CR6ZZ ist **kein moderner Slick**. Pauschale Slick-Regeln — enge Temperaturfenster, hohe Camberwerte, bestimmte Druckfenster — sind nicht übertragbar. Ein Reifen mit 65er Querschnitt hat eine hohe, weiche Flanke; sein Verhalten unterscheidet sich deutlich von einem 45er- oder 40er-Querschnitt.

### Die 65er Flanke

Das Flankenverhältnis ist für dieses Fahrzeug relevant:

| Eigenschaft | Folge |
|---|---|
| hohe Flanke | mehr Flankenverformung unter Seitenkraft |
| | effektiver Camber am Latsch weicht stärker vom Radcamber ab |
| | träger im Ansprechverhalten |
| | gutmütiger im Grenzbereich |
| | empfindlicher auf Druck |

> **Konsequenz für den Camber:** Bei hoher Flanke „verbraucht" die Reifenverformung einen Teil des eingestellten negativen Cambers. Das ist ein Argument dafür, dass ein 225/65 R15 **mehr** statischen Camber braucht als ein moderner Niederquerschnittsreifen — und dass Camber-Empfehlungen aus der modernen Trackday-Welt nicht direkt passen.

---

## 8. Was daraus für das Setup folgt

| Erkenntnis | Praktische Folge |
|---|---|
| Schräglauf erzeugt Seitenkraft | Toe und Ackermann wirken direkt auf den Arbeitspunkt |
| Jenseits des Maximums fällt die Kraft | übersteigerter Schräglauf = heiß **und** langsam |
| Load Sensitivity | Rollsteifigkeitsverteilung ist der Balance-Hebel |
| Masse und CG erhöhen Transfer an beiden Achsen | Gewicht sparen und tief bauen hilft immer |
| Cross Weight wirkt richtungsabhängig | auf symmetrischem Kurs begrenzter Hebel |
| Camber ist Kompromiss Kurve/Geradeaus | kein Maximalwert anstreben |
| Druck bestimmt Flächengröße und Querverteilung | gemeinsam mit Camber auswerten |
| Temperatur ist Folge | nie allein interpretieren |
| 65er Flanke verformt stark | mehr Camber plausibel, Druck kritischer |

---

## 9. Quellen

### Grundlagen

Die in diesem Kapitel dargestellten Zusammenhänge — Schräglaufkurve, Load Sensitivity, Camber Thrust, Latschmechanik — sind **etablierte Fahrzeugdynamik** und in jedem Standardwerk zu finden. Sie sind hier aus physikalischen Grundlagen dargestellt, aber **noch nicht gegen eine zitierfähige Quelle geprüft**.

> **Dieses Kapitel enthält bewusst keine Reifenkennwerte.** Alle Zahlen in §3.1 sind ausdrücklich als idealisiert gekennzeichnet und dienen nur der Illustration der Kurvenform.

### Fachliteratur — Status

Verfügbarkeitsprüfung und Projektentscheidung: `docs/quellen/README.md` Abschnitt *B — Fachliteratur*.

> **Kurz:** Fachliteratur wird nicht gespiegelt. Wo ein Beleg nötig ist, wird die konkrete Textstelle mit Werk, Auflage und Seite zitiert — aus einem rechtmäßig beschafften Exemplar.


| Quelle | Wofür |
|---|---|
| Milliken & Milliken, *Race Car Vehicle Dynamics* | Reifenkennfelder, Pacejka, Load Sensitivity |
| Pacejka, *Tyre and Vehicle Dynamics* | Reifenmodellierung |
| Carroll Smith, *Tune to Win* / *Drive to Win* | praxisnahe Reifenarbeit |
| Haney, *The Racing Tire* | Reifenphysik für Praktiker |

### Zu beschaffen — Klasse A

| Quelle | Wofür | Priorität |
|---|---|---|
| **Avon / Goodyear Racing — CR6ZZ Datenblatt** | Druckbereich, Temperaturfenster, Camber, Load Rating | **hoch** |

> Avon Motorsport-Reifen werden heute über Goodyear Racing vertrieben. Technische Datenblätter sind dort oder über europäische Motorsport-Händler zu beschaffen. Solange sie fehlen, beruhen alle Reifenzielwerte dieses Projekts auf Beobachtung, nicht auf Herstellerangabe.

### Verwandte Kapitel

| Kapitel | Bezug |
|---|---|
| [`CHAPTER_SPRINGS_ROLL_STIFFNESS.md`](CHAPTER_SPRINGS_ROLL_STIFFNESS.md) | Load Sensitivity begründet die Balance-Logik |
| `CHAPTER_TRACK_VALIDATION_TIRES` | Temperatur-, Druck- und Shore-Messung in der Praxis |
| `CHAPTER_FRONT_GEOMETRY_CAMBER_CASTER_KPI` | Camber-Wirkung und -Messung |
| `CHAPTER_BALANCE_CORNER_WEIGHT` | Radlasten als Eingangsgröße |
| `CHAPTER_TOE_ACKERMANN_THRUST` | Toe und Ackermann als Schräglauf-Stellgrößen |

---

## 10. Definition of Done

- [x] Schräglauf als Ursache der Seitenkraft erklärt
- [x] Latschmechanik Haften/Gleiten dargestellt
- [x] Schräglaufkurve mit drei Bereichen
- [x] Zusammenhang übersteigerter Schräglauf → Temperatur
- [x] **Load Sensitivity als Fundament der Balance-Logik**
- [x] Rechenbeispiel symmetrisch vs. mit Transfer
- [x] Begründung für Masse- und CG-Einfluss
- [x] Begründung für begrenzte Cross-Weight-Wirkung auf Rundkurs
- [x] Camber: Aufstandsfläche und Camber Thrust getrennt
- [x] Camber als Kompromiss Kurve/Geradeaus
- [x] Camber Gain als dynamische Größe
- [x] Druck: Flächengröße und Querverteilung
- [x] Temperatur: zwei getrennte Auswertungsfragen
- [x] CR6ZZ eingeordnet, 65er Flanke als Besonderheit
- [x] keine erfundenen Reifenkennwerte
- [ ] Avon/Goodyear CR6ZZ Datenblatt beschafft
- [ ] Fachliteratur Klasse B beschafft und Aussagen gegengeprüft
- [ ] Schräglaufoptimum des CR6ZZ eingegrenzt
- [ ] Betriebstemperaturfenster bestimmt
