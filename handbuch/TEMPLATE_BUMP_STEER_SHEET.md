# Bump Steer — Messanleitung und Protokoll

**Dokumentrolle:** Arbeitsanleitung mit Messwerterfassung
**Version:** 0.2
**Messmittel:** B-G Racing **BGR310** — Genauigkeit 0,1 mm, Auflösung 0,01 mm
**Bezug:** [`CHAPTER_BUMP_STEER.md`](CHAPTER_BUMP_STEER.md) · [`CONVENTIONS.md`](CONVENTIONS.md) §10

---

## Vorzeichenkonvention — vor dem Messen lesen

| Größe | Positiv | Negativ |
|---|---|---|
| **Federweg** | Bump / Einfedern | Droop / Ausfedern |
| **Toe-Änderung** | Richtung **Toe-in** | Richtung **Toe-out** |

Nullpunkt `0 mm` = **dokumentierte Race-Ready Ride Height**.

> **Ablesegenauigkeit:** Das BGR310 zeigt 0,01 mm an, ist aber auf **0,1 mm** genau. Werte auf 0,01 mm notieren, aber nur auf 0,1 mm interpretieren. Eine Differenz von 0,05 mm zwischen zwei Durchgängen liegt in der Gerätetoleranz.

---

## A — Vorbereitung

### A1 Fahrzeugzustand

- [ ] Race-Ready-Zustand hergestellt ([`02_WORKFLOW.md`](02_WORKFLOW.md) §6)
- [ ] Setup Pad coplanar, Fahrzeug gesetzt
- [ ] **Ride Height final oder dokumentiert** — Nullpunkt der Messung
- [ ] Castor eingestellt und notiert
- [ ] Camber eingestellt und notiert
- [ ] Statisches Toe eingestellt und notiert
- [ ] **Bind-Test bestanden** ([`CHAPTER_BIND_DIAGNOSIS.md`](CHAPTER_BIND_DIAGNOSIS.md) §6.1)

> **Warum der Bind-Test zuerst:** Ein verspanntes Fahrwerk bewegt sich nicht gleichmäßig über den Federweg. Die gemessene Kurve wäre dann eine Mischung aus Bump Steer und Reibung.

### A2 Mechanische Prüfung

- [ ] Radlager spielfrei
- [ ] Spurstangenköpfe spielfrei
- [ ] Idler Arm, Pitman Arm spielfrei
- [ ] Kugelgelenke spielfrei

> **Spiel ist der häufigste Messfehler.** Es erzeugt eine scheinbare Toe-Änderung, die von der Bewegungsrichtung abhängt — die Kurve sieht dann in Bump und Droop unterschiedlich aus, ohne dass Bump Steer vorliegt.

### A3 Federung entlasten

- [ ] Feder ausgebaut **oder** Fahrzeug so aufgebockt, dass die Feder entlastet ist
- [ ] Stoßdämpfer gelöst oder ausgebaut
- [ ] **Chassis fest abgestützt** — es darf sich während der Messung nicht bewegen
- [ ] Wagenheber unter dem **LCA** positioniert, um den Federweg zu steuern

### A4 Lenkung fixieren

> **Wichtig beim Mustang:** Eine Arretierung **am Lenkrad** reicht nicht aus. Zwischen Lenkrad und Spurstange liegen Lenksäule, Lenkgetriebe, Pitman Arm, Center Link und Idler Arm. Jedes Spiel in dieser Kette bleibt trotz blockiertem Lenkrad erhalten — und genau dieses Spiel wandert während der Messung.
>
> **Longacre fordert deshalb ausdrücklich:** der **Center Link** darf nicht wandern.

**Arretierung so weit wie möglich am Rad:**

| Rang | Ansatzpunkt | Wirkung |
|---:|---|---|
| **1** | **Center Link** gegen Chassis klemmen | schaltet Lenkgetriebe, Pitman und Idler komplett aus |
| 2 | Pitman Arm gegen Chassis | Lenkgetriebe ausgeschaltet, Center-Link-Spiel bleibt |
| 3 | Lenkrad gegen Sitz/Käfig | **gesamtes Lenkungsspiel bleibt wirksam** |

- [ ] Lenkrad in Geradeausstellung
- [ ] Arretierung angebracht, **spielfrei**
- [ ] **Center Link bewegt sich nicht** — von Hand geprüft
- [ ] Prüfung: Spurstange am Radträger lässt sich nicht bewegen

**Verwendete Arretierung:** ☐ **Spanngurt** (Projektlösung)  ☐ Center-Link-Klemmung  ☐ Pitman-Arm-Klemmung  ☐ ______________

### Projektlösung: Spanngurt

Am Fahrzeug bewährt und ausreichend, **sofern die Prüfung in A5 bestanden wird**.

- [ ] Lenkrad gegen festen Punkt verspannt (Sitzgestell, Käfig, Türholm)
- [ ] Gurt **auf Zug vorgespannt** — nicht nur angelegt
- [ ] Gurtschloss gesichert, kann nicht nachrutschen
- [ ] Angriffspunkte gepolstert
- [ ] Zweiter Gurt in Gegenrichtung, falls das Lenkrad in eine Richtung nachgibt

> **Warum zwei Gurte sinnvoll sind:** Ein einzelner Gurt hält nur in Zugrichtung. Gibt die Lenkung in die Gegenrichtung nach, wandert sie dorthin — und genau das passiert, wenn die Spurstange über den Federweg zieht und drückt.

> **Grenze der Methode:** Der Spanngurt greift am **Lenkrad** an, also am Anfang der Kette. Spiel in Lenkgetriebe, Pitman Arm, Center Link oder Idler bleibt wirksam. Deshalb ist die Prüfung in A5 hier **nicht optional**.

> **B-G BG5163 passt am Mustang nicht** — die Teleskopstange ist auf moderne Geometrie zwischen Lenkrad und Bremspedal ausgelegt.
>
> **Praktikable Alternativen:**
>
> - **Center Link direkt klemmen** — Schraubzwinge mit weichen Backen gegen einen festen Chassispunkt. Technisch die beste Lösung, weil sie die gesamte Lenkungskette umgeht. Auflagepunkte schützen.
> - **Spanngurt oder Teleskopstange** Lenkrad gegen Sitzgestell oder Überrollkäfig — nur in Verbindung mit einer Prüfung, dass die Spurstange sich wirklich nicht bewegt.
> - **Longacre Steering Wheel Alignment Indicator** (`56700` für 3/4"-Welle, `52-56702` für 1-1/8") ist **keine Arretierung**, sondern eine Anzeige der Lenkradstellung. Nützlich zum Wiederfinden der Mittelstellung, ersetzt die Fixierung aber nicht.
>
---

### A5 Prüfung der Arretierung — immer durchführen

> **Dies ist der wichtigste Handgriff vor der Messung.** Er dauert zehn Sekunden und entscheidet, ob die ganze Messreihe verwertbar ist.

**Vorgehen:**

1. Arretierung ist angebracht und vorgespannt
2. Am **Radträger** die Spurstange greifen — möglichst nah am äußeren Spurstangenkopf
3. Mit **kräftigem Handdruck** in beide Richtungen zu bewegen versuchen
4. Dabei auf die Spurstange und den Center Link **schauen**, nicht nur fühlen

| Beobachtung | Bewertung |
|---|---|
| nichts bewegt sich sichtbar oder fühlbar | **Arretierung ausreichend** |
| Spurstange federt leicht und kehrt zurück | Bauteilelastizität — akzeptabel |
| **Center Link wandert sichtbar** | **unzureichend** — nachspannen oder näher am Rad arretieren |
| **spürbares Klicken oder totes Spiel** | **unzureichend** — Ursache ist Spiel, nicht die Arretierung |

- [ ] **Prüfung bestanden**

> **Bei spürbarem totem Spiel:** Die Arretierung ist nicht das Problem. Lenkgetriebe, Spurstangenköpfe oder Idler Arm haben Spiel — das muss vor der Messung behoben werden (siehe A2). Sonst misst man Spiel statt Bump Steer.

> **Gegenprobe während der Messung:** Nach dem Durchfahren von Bump und Droop muss die Messuhr am Nullpunkt wieder **0** zeigen. Tut sie das nicht, hat sich etwas bewegt — meist die Lenkung.

---

## B — Gerät montieren

### B1 PCD-Platte

Mustang 1965/66: Lochkreis **5 × 4,5" = 5 × 114,3 mm** — liegt im BGR310-Bereich (5 × 100–130 mm).

- [ ] Platte spielfrei an der Nabe verschraubt
- [ ] Bremsscheibe/-trommel abgenommen oder Platte sitzt plan auf
- [ ] **Platte mit Libelle senkrecht ausgerichtet**
- [ ] Nabe dreht sich während der Messung nicht

### B2 Messgerät aufstellen

- [ ] Rahmen auf dem Boden, Höhe eingestellt
- [ ] Rollenlager liegt an der Platte an
- [ ] Messuhr etwa in **Mitte ihres Messbereichs**
- [ ] Gerät steht stabil, kippelt nicht

> Longacre: *„be sure that the indicator is set in the middle of its range"* — sonst läuft die Uhr beim Durchfahren des Federwegs an den Anschlag.

### B3 Nullpunkt setzen

- [ ] Aufhängung auf **Race-Ready Ride Height** gebracht
- [ ] Messuhr auf **0** gesetzt
- [ ] Federwegskala auf **0** gesetzt
- [ ] Nullpunkt zweimal angefahren, Wiederholbarkeit geprüft

**Wiederholbarkeit Nullpunkt:** 1. ______ mm  2. ______ mm  → Differenz ______ mm

> Liegt die Differenz über 0,1 mm, stimmt etwas nicht — Spiel, Bind oder lose Befestigung. **Nicht weitermessen.**

---

## C — Messung durchführen

### Ablauf

1. Von Null **nach Bump** durcharbeiten, jeden Punkt notieren
2. Zurück auf Null — **Nullpunkt prüfen**, muss wieder 0 zeigen
3. Von Null **nach Droop** durcharbeiten
4. Zurück auf Null — erneut prüfen

> **Immer in eine Richtung durchfahren**, nicht hin- und herpendeln. Sonst überlagert Spiel die Messung.

### Protokoll — Seite LF

**Datum:** ______  **Ride Height (Nullpunkt):** ______  **Castor:** ______  **Camber:** ______  **Statisches Toe:** ______
**Lenkwinkel:** ☐ 0° (geradeaus)  ☐ ______°

| Federweg | Toe-Änderung | Richtung | Bemerkung |
|---:|---:|---|---|
| −50 mm | | in / out | |
| −38 mm | | in / out | |
| −25 mm | | in / out | |
| −18 mm | | in / out | |
| −12 mm | | in / out | |
| −6 mm | | in / out | |
| **0 mm** | **0** | Referenz | |
| +6 mm | | in / out | |
| +12 mm | | in / out | |
| +18 mm | | in / out | |
| +25 mm | | in / out | |
| +38 mm | | in / out | |
| +50 mm | | in / out | |

**Nullpunktkontrolle nach Bump:** ______ mm  **nach Droop:** ______ mm

### Protokoll — Seite RF

**Ride Height (Nullpunkt):** ______  **Castor:** ______  **Camber:** ______  **Statisches Toe:** ______
**Lenkwinkel:** ☐ 0° (geradeaus)  ☐ ______°

| Federweg | Toe-Änderung | Richtung | Bemerkung |
|---:|---:|---|---|
| −50 mm | | in / out | |
| −38 mm | | in / out | |
| −25 mm | | in / out | |
| −18 mm | | in / out | |
| −12 mm | | in / out | |
| −6 mm | | in / out | |
| **0 mm** | **0** | Referenz | |
| +6 mm | | in / out | |
| +12 mm | | in / out | |
| +18 mm | | in / out | |
| +25 mm | | in / out | |
| +38 mm | | in / out | |
| +50 mm | | in / out | |

**Nullpunktkontrolle nach Bump:** ______ mm  **nach Droop:** ______ mm

> **Feiner messen um Null:** Das Fahrzeug arbeitet die meiste Zeit in einem begrenzten Fenster um die Fahrhöhe. Bei auffälligem Verhalten zusätzliche Punkte bei ±3 mm und ±9 mm aufnehmen.

---

## D — Kurve zeichnen

```text
Toe-Änderung (mm)
        │
   +1.0 ┤
        │
   +0.5 ┤
        │
      0 ┼────────────┬────────────
        │            0
   −0.5 ┤
        │
   −1.0 ┤
        └────────────────────────→
      −50  −25    0   +25   +50
              Federweg (mm)
```

LF und RF in **dasselbe** Diagramm, unterschiedliche Farben — so wird die Symmetrie sofort sichtbar.

---

## E — Auswertung

### E1 Relevantes Arbeitsfenster

Zuerst festlegen, welcher Federwegbereich real genutzt wird:

| Größe | Wert |
|---|---|
| Bump-Stop-Abstand (= max. Bump) | ______ mm |
| verfügbarer Droop | ______ mm |
| **geschätztes Arbeitsfenster** | ______ bis ______ mm |

> Ein Toe-Ausschlag bei −50 mm ist bedeutungslos, wenn die Aufhängung dort nie arbeitet.

### E2 Kennwerte im Arbeitsfenster

| Kennwert | LF | RF |
|---|---:|---:|
| max. Toe-in im Fenster | | |
| max. Toe-out im Fenster | | |
| **Gesamtausschlag** (max − min) | | |
| Kurve monoton? | ja / nein | ja / nein |
| Nulldurchgang bei | | |
| Steigung um Null (mm Toe / mm Weg) | | |

### E3 Symmetrie

| Prüfung | Ergebnis |
|---|---|
| Gleiche Richtung LF/RF? | ja / nein |
| Gleiche Größenordnung? | ja / nein |
| Gleiche Kurvenform? | ja / nein |
| Differenz im Arbeitsfenster | ______ mm |

> **Asymmetrie ist ein eigener Befund.** Mögliche Ursachen: unterschiedliche Tie-Rod-Geometrie, Idler/Pitman-Höhendifferenz, Chassistoleranz, verbogenes Teil, unterschiedliche Ride Height.

### E4 Bewertung

> **Projektgrundsatz:** Bump Steer wird **minimiert**, nicht auf einen Zahlenwert eingestellt. Longacre empfiehlt für ein seriennahes Chassis genau das.
>
> Der früher diskutierte Richtwert von ca. 0,020" je 1" Federweg (≈ 0,5 mm je 25 mm) ist **nicht belegt** und wird nicht als Ziel verwendet.

**Erste Bewertung:** ☐ unauffällig  ☐ auffällig  ☐ Korrektur nötig

**Begründung:**

---

## F — Hardwarezustand

Ohne diese Angaben ist die Kurve nicht reproduzierbar:

| Feld | LF | RF |
|---|---|---|
| Äußerer Tie-Rod-Pivot, Höhe/Position | | |
| Spacer-Stack unter dem Spurstangenkopf | | |
| Spurstangenlänge | | |
| Steering Arm / Spindel | | |
| Pitman Arm | | |
| Idler Arm | | |
| Center Link | | |
| Bump-Steer-Kit verbaut? | | |
| **LCA-Kit-Plattennummer** | | |
| **UCA-Heim-Position** | | |

> **Wichtig:** Das **LCA Camber Kit** verschiebt den inneren LCA-Anlenkpunkt quer. Die Spurstange bleibt, wo sie ist. Jede Änderung der Plattennummer verändert damit die Bump-Steer-Kurve. Siehe [`CHAPTER_FRONT_ADJUSTMENT_UCA_LCA.md`](CHAPTER_FRONT_ADJUSTMENT_UCA_LCA.md) §6.2 Schritt 9.

---

## G — Korrekturschleife

> **Bump Steer wird geometrisch korrigiert, nicht mit statischem Toe überdeckt.** Statisches Toe verschiebt nur den Ausgangswert, nicht die Kurvenform.

| Iteration | Was geändert | LF Ausschlag | RF Ausschlag | Bewertung |
|---:|---|---:|---:|---|
| 0 | Baseline | | | |
| 1 | | | | |
| 2 | | | | |
| 3 | | | | |

**Typische Stellgrößen:**

| Maßnahme | Wirkung |
|---|---|
| Höhe äußerer Tie-Rod-Pivot (Spacer) | Hauptstellgröße |
| Spurstangenlänge | verschiebt Kurve |
| Ride Height | verschiebt den Arbeitspunkt auf der Kurve |

**Endkurve akzeptiert:** ☐ ja  ☐ nein

---

## H — Nach der Messung

- [ ] Feder und Dämpfer wieder montiert
- [ ] Alle Befestigungen auf Drehmoment
- [ ] Lenkungsarretierung entfernt
- [ ] Fahrzeug gesetzt, Settling-Prozedur
- [ ] **Statisches Toe erneut geprüft** — die Messung kann es verstellt haben
- [ ] Castor und Camber kontrollmessen
- [ ] Kurve in Setup Log übertragen
- [ ] Hardwarezustand (Abschnitt F) vollständig eingetragen

---

## Quelle

**B-G Racing BGR310** — `docs/quellen/A-14-bg-racing-bgr310-bump-steer-gauge.md`
Belegt: Genauigkeit 0,1 mm, Auflösung 0,01 mm, PCD-Bereich, Einzelmessuhr-Prinzip, Rollenlager auf Gelenkbasis.

**Longacre — Bump Steer** — `docs/quellen/A-26-longacre-bump-steer.html`
Belegt: Messuhr in Bereichsmitte, Lenkung zentriert und arretiert, Ride Height und Alignment vor der Messung.
