# Mustang Track Chassis Setup — Streckenanalyse und Setup-Konsequenzen

**Dokumentrolle:** Fachkapitel — Streckencharakteristik und ihre Wirkung auf das Setup
**Version:** 0.1
**Datum:** 2026-10-05
**Status:** Entwurf; Streckendaten belegt, Setup-Ableitungen als Hypothesen gekennzeichnet
**Bezug:** [`00_PROJECT.md`](00_PROJECT.md) · [`CHAPTER_VEHICLE_DYNAMICS.md`](CHAPTER_VEHICLE_DYNAMICS.md) · [`CHAPTER_SPRINGS_ROLL_STIFFNESS.md`](CHAPTER_SPRINGS_ROLL_STIFFNESS.md)

---

## 1. Zweck und Grenzen

Dieses Kapitel beantwortet zwei Fragen je Strecke:

1. **Passt die Grundeinstellung?** Oder fordert die Streckengeometrie etwas anderes?
2. **Worauf ist besonders zu achten** — bei Messung, Reifen, Fahrweise?

> **Wichtige Einschränkung vorweg:** Dieses Fahrzeug hat **wenige verfügbare Stellgrößen** ([`CHAPTER_VEHICLE_DYNAMICS.md`](CHAPTER_VEHICLE_DYNAMICS.md) §9). Eine streckenspezifische Abstimmung im Sinne eines modernen Rennfahrzeugs ist nicht möglich und auch nicht sinnvoll.
>
> **Die realistische Erwartung:** Eine Grundeinstellung, die überall funktioniert — plus das Wissen, **wo** sie an ihre Grenzen kommt und **welche** der wenigen Stellgrößen dann helfen könnten.

### Was hier nicht steht

| Nicht enthalten | Warum |
|---|---|
| Ideallinien, Bremspunkte | Fahrtechnik, nicht Fahrzeugabstimmung |
| Rundenzeitziele | ohne Referenzdaten sinnlos |
| Fertige Setup-Empfehlungen je Strecke | **nicht belegbar**, solange keine Trackdaten vorliegen |

> Alle Setup-Aussagen in diesem Kapitel sind **Hypothesen**, keine Vorgaben. Sie sind als Prüfpunkte formuliert: *worauf bei dieser Strecke zu achten ist*, nicht *was einzustellen ist*.

---

## 2. Die fünf Strecken im Überblick

| Strecke | Länge | Kurven | Längste Gerade | Höhendifferenz | Charakter |
|---|---:|---:|---:|---:|---|
| **Pannoniaring** | 4.740 m | 18 (11R/7L) | 700 m | gering | technisch, kurvenreich |
| **Slovakiaring** | 5.922 m | 14–16 | 900 m | 4 Kuppen | schnell, lange Vollgasphasen |
| **Salzburgring** | 4.255 m | 12 (6R/6L) | 750 m | ~22 m | sehr schnell, wenige Kurven |
| **Brno** | 5.403 m | 14 (8R/6L) | 636 m | **73,75 m** | Höhenprofil, ständiger Wechsel |
| **Spa-Francorchamps** | 7.004 m | 19 (10L/9R) | 1.050 m | **102 m** | alles zusammen |

**Quelle:** Streckendaten aus dem Schwesterprojekt `gt40-engine`, Abschnitt Streckenanalyse. Dort für ein anderes Fahrzeug (GT40 Kit Car) bewertet — die **Streckendaten** sind übertragbar, die **Fahrzeugbewertungen nicht**.

### Zwei Besonderheiten für die Fahrwerksarbeit

**Kurvenrichtungsverteilung:** Vier der fünf Strecken sind rechtslastig, Spa ist linkslastig.

| Strecke | Rechts | Links | Übergewicht |
|---|---:|---:|---|
| Pannoniaring | 11 | 7 | **rechts** |
| Brno | 8 | 6 | rechts |
| Salzburgring | 6 | 6 | ausgeglichen |
| Spa | 9 | 10 | leicht links |

> **Konsequenz:** Die thermische und mechanische Belastung ist seitenabhängig. Bei rechtslastigen Strecken arbeitet das **linke** Vorderrad als kurvenäußeres härter. Das ist bei der Pyrometer-Auswertung zu berücksichtigen (`CHAPTER_TRACK_VALIDATION_TIRES` §15) — eine Links-/Rechts-Temperaturdifferenz ist dort **normal**, kein Setup-Fehler.
>
> **Es ist kein Grund für asymmetrisches Setup.** Das Fahrzeug fährt fünf verschiedene Strecken; eine Asymmetrie für eine davon verschlechtert die anderen.

---

## 3. Pannoniaring — die Einsteigerstrecke

| Merkmal | Wert |
|---|---|
| Länge / Kurven | 4.740 m / 18 (11R/7L) |
| Längste Gerade | 700 m |
| Breite | 11–13 m |
| Höhenprofil | flach |
| Fahrtrichtung | im Uhrzeigersinn |

### Was die Strecke vom Fahrwerk verlangt

| Aspekt | Anforderung |
|---|---|
| **Kurvendichte** | 18 Kurven auf 4,7 km — **stärkste Belastung des Gierverhaltens** |
| Geschwindigkeitsniveau | moderat — Reifen werden nicht extrem gefordert |
| Bremszyklen | viele, aber moderat |
| Lasttransfer | häufige Wechsel, kein Dauerzustand |

### Setup-Hypothesen

| Prüfpunkt | Begründung |
|---|---|
| **Turn-in-Verhalten** ist hier am wichtigsten | 18 Einlenkvorgänge pro Runde — träges Ansprechen kostet überall |
| Toe eher Richtung **neutral bis leicht Toe-out** prüfen | fördert Einlenkansprechen; kostet Geradeauslauf, der hier kaum gebraucht wird |
| **Castor** moderat halten | viele Lenkbewegungen bei **manueller Lenkung** — Lenkkräfte summieren sich über 18 Kurven |
| Camber: moderate Anforderung | keine lange Hochgeschwindigkeitskurve, in der Camber sich auszahlt |

> **Ideale Strecke für die erste Baseline-Validierung.** Moderate Geschwindigkeiten, großzügige Auslaufzonen, viele Wiederholungen pro Runde. Setup-Änderungen zeigen sich schnell, weil jede Runde 18 Datenpunkte liefert.

### Worauf besonders achten

- **Lenkkraft über die Distanz** — bei manueller Lenkung ist Pannoniaring die Strecke, auf der zu viel Castor am ehesten auffällt
- Reifentemperatur bleibt vermutlich im unteren Bereich → Druck eher niedriger ansetzen als auf schnellen Strecken

---

## 4. Slovakiaring — die Kuppenstrecke

| Merkmal | Wert |
|---|---|
| Länge / Kurven | 5.922 m / 14–16 |
| Längste Gerade | 900 m |
| Breite | 12 m |
| Besonderheit | **4 künstliche Kuppen** |

### Die Kuppen sind das Fahrwerksthema

Eine Kuppe bei hoher Geschwindigkeit erzeugt eine **Entlastung** — das Fahrzeug wird leicht, die Radlast fällt, und damit die übertragbare Seitenkraft. Beim Wiedereinfedern entsteht eine Kompression.

**Das trifft genau die Schwachstellen, die dieses Handbuch beschreibt:**

| Phänomen | Kapitel |
|---|---|
| **Bump Steer** — Toe ändert sich über Federweg | `CHAPTER_BUMP_STEER` |
| **Bind** — Fahrwerk setzt sich nicht sauber | [`CHAPTER_BIND_DIAGNOSIS.md`](CHAPTER_BIND_DIAGNOSIS.md) |
| **Bump-Stop-Kontakt** bei Kompression | `CHAPTER_SETUP_PAD_RIDE_HEIGHT` §20 |
| **Dämpfung** — wie schnell beruhigt sich das Fahrzeug | transient |

> **Slovakiaring ist die Strecke, auf der ein ungemessener Bump Steer am deutlichsten auffällt.** Entlastung plus Federbewegung plus hohe Geschwindigkeit — wenn sich dabei die Spur ändert, wird das Fahrzeug nervös.
>
> **Das ist ein starkes Argument, die Bump-Steer-Messvorrichtung zu beschaffen** ([`00_PROJECT.md`](00_PROJECT.md) §7), bevor hier gefahren wird.

### Setup-Hypothesen

| Prüfpunkt | Begründung |
|---|---|
| **Ausreichend Droop-Weg** sicherstellen | bei Entlastung muss das Rad dem Boden folgen können |
| **Bump-Stop-Abstand** prüfen | Kompression nach der Kuppe darf nicht auf Anschlag gehen |
| Ride Height nicht zu tief | kostet genau den Federweg, der hier gebraucht wird |
| Bind ausschließen | ein verspanntes Fahrwerk kann der Vertikalbewegung nicht folgen |

### Worauf besonders achten

- **Reifentemperatur und Druck** steigen stärker als auf Pannoniaring — lange Vollgasphasen
- Die 900-m-Gerade ist die **Bremsprüfung**: harte Verzögerung aus hoher Geschwindigkeit, Lasttransfer nach vorn maximal

---

## 5. Salzburgring — die schnelle Kurve

| Merkmal | Wert |
|---|---|
| Länge / Kurven | 4.255 m / 12 (6R/6L) |
| Längste Gerade | 750 m |
| Höhendifferenz | ~22 m |
| Max. Steigung | 3,8 % (Gegengerade) |
| Schlüsselstelle | **Fahrerlagerkurve** — schnellster Punkt der Strecke |

### Die Fahrerlagerkurve ist der Fahrwerkstest

Eine **langgezogene Kurve bei hoher Geschwindigkeit** ist der Zustand, in dem alles zusammenkommt, was dieses Handbuch behandelt:

```text
hohe Geschwindigkeit → hohe Querbeschleunigung
      ↓
großes Rollmoment (m · a_y · h_CG)
      ↓
maximaler lateraler Lasttransfer
      ↓
Load Sensitivity wirkt am stärksten
      ↓
Balance zeigt sich ungefiltert
```

> **Das ist der aussagekräftigste Zustand für die Balance-Beurteilung** — stationär, lang genug, um sich zu setzen, und mit maximalem Lasttransfer. Was hier passiert, ist ein echter Befund und kein transientes Phänomen.

### Setup-Hypothesen

| Prüfpunkt | Begründung |
|---|---|
| **Camber zahlt sich hier aus** | lange Kurve mit maximalem Rollwinkel — der Reifen braucht die Camber-Reserve |
| **Rollsteifigkeitsverteilung** zeigt sich am deutlichsten | stationärer Zustand, keine transienten Überlagerungen |
| Reifendruck kritisch | lange Dauerbelastung einer Seite → einseitiger Druckanstieg |
| Geradeauslaufstabilität | 750-m-Gerade plus ansteigende Gegengerade |

### Worauf besonders achten

- **Dies ist die Strecke, auf der die Camber-Einstellung validiert wird.** Wenn −2,0° zu wenig sind, zeigt es sich hier am Reifenbild der Außenschulter
- Einseitige Reifentemperatur über eine lange Kurve → nicht mit kurzen Kurven vergleichen

---

## 6. Brno — das Höhenprofil

| Merkmal | Wert |
|---|---|
| Länge / Kurven | 5.403 m / 14 (8R/6L) |
| Längste Gerade | 636 m (bergauf) |
| Breite | 15 m |
| **Höhendifferenz** | **73,75 m** |
| Max. Steigung | 7,5 % über 917 m |
| Max. Gefälle | 5 % über 410 m |
| Belag | neu asphaltiert 2025 (High-Grip) |

### Höhenprofil heißt: ständig wechselnder Lasttransfer

Steigung und Gefälle verändern die **statische Radlastverteilung** — zusätzlich zum Lasttransfer aus Beschleunigung und Bremsen.

| Zustand | Wirkung |
|---|---|
| **bergauf** | Last wandert nach hinten → Vorderachse leichter → Untersteuertendenz |
| **bergab** | Last wandert nach vorn → Hinterachse leichter → Übersteuertendenz, besonders beim Bremsen |
| **Kuppen und Senken** | zusätzliche vertikale Beschleunigung |

> **Brno ist die Strecke, auf der das Fahrzeug in beide Richtungen ausschlägt.** Eine Balance, die bergauf passt, kann bergab zu heckleicht sein. Das ist **keine** Setup-Schwäche, sondern Physik — und ein Grund, warum eine einzige Balance-Einstellung hier zwangsläufig ein Kompromiss ist.

### Setup-Hypothesen

| Prüfpunkt | Begründung |
|---|---|
| **Bremsstabilität bergab** ist der kritische Punkt | Lasttransfer nach vorn **plus** Gefälle → Hinterachse sehr leicht |
| Ausreichend Federweg | Senken und Kuppen bei gleichzeitigem Kurvenfahren |
| Balance eher Richtung **leichtes Untersteuern** absichern | ein bergab übersteuerndes Fahrzeug ist schwer zu fangen |
| Rake-Einstellung beobachten | effektive Fahrzeuglage ändert sich mit der Streckenneigung |

### Worauf besonders achten

- **Der neue High-Grip-Belag (2025)** erhöht die erreichbaren Querkräfte — das verstärkt alle Lasttransfer-Effekte und kann ein Setup an Grenzen bringen, die vorher nicht sichtbar waren
- **Bremsbelastung ist hier am höchsten** — lange Gefällstrecken mit harter Verzögerung. Bremsthema, nicht Fahrwerksthema, aber es beeinflusst die Balance beim Anbremsen

---

## 7. Spa-Francorchamps — alles zusammen

| Merkmal | Wert |
|---|---|
| Länge / Kurven | 7.004 m / 19 (10L/9R) |
| Längste Gerade | ~1.050 m (Kemmel) |
| **Höhendifferenz** | **102 m** |
| Schlüsselstelle | **Eau Rouge / Raidillon** — 17 % Steigung |
| Wetter | Ardennen-Mikroklima, lokal unterschiedlich |

### Eau Rouge ist ein Kompressionstest

Die Kombination aus **Kompression am Fuß**, **17 % Steigung** und **Richtungswechsel bei hoher Geschwindigkeit** ist die härteste Einzelbelastung aller fünf Strecken.

| Phase | Belastung |
|---|---|
| Kompression unten | **maximale vertikale Last** — Federweg und Bump Stops |
| Bergauf-Richtungswechsel | Querkraft bei gleichzeitig erhöhter Vertikallast |
| Kuppe oben | **Entlastung** — Radlast fällt, Grip fällt |

> **Für das Fahrwerk bedeutet das:** Federweg, Bump-Stop-Abstand und Bump Steer werden hier gleichzeitig geprüft. Wenn eines davon nicht stimmt, ist es genau hier spürbar — bei der höchsten Geschwindigkeit der Strecke.

**Blanchimont** ist zusätzlich eine sehr schnelle, langgezogene Kurve — derselbe stationäre Belastungsfall wie die Fahrerlagerkurve am Salzburgring, nur schneller.

### Setup-Hypothesen

| Prüfpunkt | Begründung |
|---|---|
| **Federweg und Bump Stops** sind der Schlüssel | Eau-Rouge-Kompression ist der Maximalfall |
| Ride Height nicht zu tief | aufsetzen oder Bump-Stop-Kontakt wäre hier gefährlich |
| Camber-Reserve für Blanchimont | wie Salzburgring, nur mehr Querkraft |
| **Nasse Bedingungen einplanen** | Mikroklima — Setup muss auch bei weniger Grip beherrschbar bleiben |

### Worauf besonders achten

- **Reifentemperatur und Druck** erreichen hier das Maximum — 7 km, lange Vollgasphasen, hohe Querkräfte
- **Die Streckenlänge** bedeutet: mehr Zeit zwischen den Messpunkten, Reifen kühlen auf der Kemmel-Geraden teilweise ab
- Linkslastig (10L/9R) — als einzige der fünf Strecken

---

## 8. Was die Strecken gemeinsam fordern

Aus allen fünf zusammengenommen ergibt sich ein Anforderungsprofil für die Grundeinstellung:

| Anforderung | Von welcher Strecke am stärksten | Setup-Konsequenz |
|---|---|---|
| **Ausreichend Federweg** | Spa (Eau Rouge), Slovakiaring (Kuppen) | Ride Height **nicht zu tief**, Bump-Stop-Abstand dokumentieren |
| **Bump Steer gering** | Slovakiaring, Spa | **Messung erforderlich** |
| **Kein Bind** | Slovakiaring, Brno | Bind-Test vor der Saison |
| **Camber-Reserve** | Salzburgring, Spa (Blanchimont) | eher mehr als weniger |
| **Turn-in-Ansprechen** | Pannoniaring | Toe und Castor |
| **Lenkkraft erträglich** | Pannoniaring (18 Kurven, manuelle Lenkung) | Castor **nicht maximieren** |
| **Bremsstabilität** | Brno (bergab), Slovakiaring | Balance eher untersteuernd absichern |

### Die zentrale Erkenntnis

> **Zwei Anforderungen stehen im Konflikt:**
>
> - **Castor hoch** → Geradeauslauf, dynamischer Camber, Stabilität bei hoher Geschwindigkeit (Salzburgring, Spa)
> - **Castor moderat** → erträgliche Lenkkräfte über 18 Kurven bei manueller Lenkung (Pannoniaring)
>
> Das ist bei **manueller Lenkung** der härteste Zielkonflikt des Projekts. Er lässt sich nicht wegrechnen — er muss gefahren und entschieden werden.

Die Baseline von **+3,0° Castor** liegt im unteren Bereich dessen, was Track-Setups verwenden (SoT-Testfahrzeug: +5°). Das ist mit Blick auf die manuelle Lenkung plausibel — aber nicht validiert.

---

## 9. Empfohlene Reihenfolge

Aus dem Schwesterprojekt übernommen und auf Fahrwerksarbeit übertragen:

| # | Strecke | Zweck für das Setup |
|---|---|---|
| 1 | **Pannoniaring** | Baseline validieren, Lenkkraft beurteilen, viele Datenpunkte pro Runde |
| 2 | **Slovakiaring** | Vertikaldynamik prüfen — Kuppen zeigen Bump Steer und Bind |
| 3 | **Salzburgring** | Camber und Balance im stationären Hochgeschwindigkeitszustand |
| 4 | **Brno** | Höhenprofil — Balance in beiden Richtungen, Bremsstabilität |
| 5 | **Spa** | alles zusammen, bei maximaler Belastung |

> **Die Reihenfolge ist nicht nur eine Steigerung des Anspruchs, sondern eine sinnvolle Diagnosereihenfolge:** Erst Grundverhalten (1), dann Vertikaldynamik (2), dann stationäre Balance (3), dann Lasttransfer-Extreme (4), dann alles gleichzeitig (5).

---

## 10. Track Load Map — Datenerfassung

Für jede Session zu erfassen, damit Trackdaten zwischen Strecken vergleichbar bleiben:

| Feld | Warum |
|---|---|
| `track_name` | Zuordnung |
| `track_direction` | Uhrzeigersinn / gegen |
| `corner_count_left` / `_right` | erklärt Links-/Rechts-Temperaturdifferenzen |
| `elevation_change` | erklärt Balance-Unterschiede |
| `surface_condition` | trocken / feucht / nass |
| `ambient_temp` / `track_temp` | Reifenverhalten |
| `session_length` | Wärmeeintrag |

> **Ohne diese Angaben sind Reifentemperaturen zwischen zwei Strecken nicht vergleichbar.** Ein heißeres linkes Vorderrad auf Pannoniaring (11 Rechtskurven) ist normal; dasselbe auf Spa (linkslastig) wäre ein Befund.

Vollständige Session-Erfassung: `CHAPTER_TRACK_VALIDATION_TIRES` §29.

---

## 11. Quellen

### Streckendaten

Übernommen aus dem Schwesterprojekt **`pahlborn/gt40-engine`**, Abschnitt *Streckenanalyse & Fahrzeugeinschätzung* (`index.html`). Dort erfasst: Länge, Kurvenzahl und -verteilung, Breite, längste Gerade, Höhendifferenz, Steigungen, Belag.

> **Wichtig:** Die dortigen **Fahrzeugbewertungen** gelten für ein GT40 Kit Car mit ~1050 kg, ~350 BHP und Crossply-Reifen. Sie sind **nicht** auf den Mustang übertragbar — andere Masse, andere Reifen, andere Aufhängung. Übernommen wurden ausschließlich die **Streckendaten**.

### Setup-Ableitungen

Die Hypothesen in §3–8 sind aus der Streckengeometrie und den fahrdynamischen Grundlagen dieses Handbuchs abgeleitet. Sie sind **nicht** durch Trackdaten belegt und ausdrücklich als Prüfpunkte formuliert, nicht als Einstellvorgaben.

> **Nach der ersten Saison** sollte dieses Kapitel gegen reale Beobachtungen geprüft und korrigiert werden. Hypothesen, die sich nicht bestätigen, werden gestrichen — nicht umformuliert.

---

## 12. Definition of Done

- [x] Fünf Strecken mit belegten Geometriedaten
- [x] Kurvenrichtungsverteilung erfasst und eingeordnet
- [x] Je Strecke: was sie vom Fahrwerk verlangt
- [x] Setup-Hypothesen als Prüfpunkte, nicht als Vorgaben
- [x] Gemeinsames Anforderungsprofil abgeleitet
- [x] Zielkonflikt Castor / Lenkkraft benannt
- [x] Diagnosereihenfolge begründet
- [x] Track Load Map für Vergleichbarkeit
- [x] Abgrenzung: keine Ideallinien, keine Rundenzeiten
- [x] Fremdbewertungen des Schwesterprojekts nicht übernommen
- [ ] Hypothesen gegen reale Trackdaten geprüft
- [ ] Bump-Steer-Messung vor Slovakiaring durchgeführt
- [ ] Castor-Zielkonflikt entschieden
- [ ] Streckenspezifische Beobachtungen dokumentiert
