# Quellenregister

**Stand:** 2026-10-05
**Zweck:** Lokaler Spiegel aller Quellen, auf die sich technische Aussagen im Projekt berufen.

Eine Aussage im Handbuch darf sich nur auf eine Quelle berufen, die hier liegt oder hier ausdrücklich als „nicht beschaffbar" geführt ist. Prüfsummen in `SHA256SUMS`, prüfbar mit `sha256sum -c SHA256SUMS`.

Quellenklassen nach [`CONVENTIONS.md`](../../temp3/CONVENTIONS.md) §16:
**A** Primärquelle · **B** Fachliteratur/wissenschaftlich · **C** kompetente Sekundärquelle · **D** Erfahrungswert

---

## A — Primärquellen

### Fahrzeughersteller

| Kennung | Datei | Inhalt | Zustand |
|---|---|---|---|
| **A-11** | `A-11-ford-1966-shop-manual-ocr.txt` | Ford Shop Manual 1966 (Cougar/Falcon/Fairlane/**Mustang**), 793 S., OCR-Volltext | Spaltenvermischung in Tabellen; Fließtext verwertbar |

**Belegt u. a.:** UCA-Shim-Verfahren Castor/Camber mit Richtungen, 1/32" ≈ 1/2° Castor, 1/16" ≈ 1/3° Camber, Grenzwerte 1/16" Differenz und 9/16" Gesamtpaket, Symmetrietoleranz max. 1/2° bevorzugt 1/4°, Toe nach Castor/Camber, Turning Angle als Diagnosegröße, Curb-Height-Messung mit Werkzeug T65P-3000.

Original: https://archive.org/details/1966-falcon-shop-manual

> **Fehlt noch:** Part 3-6 Spezifikationstabelle in lesbarer Form (Original-PDF 121 MB), Fig. 39 und Fig. 28.

### Komponentenhersteller

| Kennung | Datei | Inhalt |
|---|---|---|
| **A-10** | `A-10-sot-lca-camber-kit-instructions.pdf` | Street or Track — LCA Camber Kit Einbauanleitung |
| **A-12** | `A-12-spicer-driveline-operating-angle-rules.md` | Dana/Spicer — Driveline Operating Angle Regeln, Textextrakt |
| **A-13** | `A-13-tremec-driveline-app-instructions.pdf` | TREMEC — Driveline Angle Finder App Instructions |

**A-10 belegt:** Platte #1 = Serienposition, nummerierte Platten als diskrete Verstellung, Langloch nur horizontal („Be careful not to grind any metal vertically"), Schweißeinbau.

**A-12 belegt:** 0,5° Mindestwinkel, 1° Differenz zwischen den Gelenken, 3° für vibrationsfreien Betrieb, **drehzahlabhängige Maximaltabelle 1500–5000 rpm**, Messgenauigkeit 1/4°, Slope-Konvention Up/Down, Einschränkung „does not address compound drive angles".
Original: https://spicerparts.com/calculators/driveline-operating-angle-calculator

**A-13 belegt:** max. 3° Einzelwinkel und **max. 2° Differenz**, „equal and opposite" als Zielzustand, 0,0° gilt als out-of-spec, Winkeländerung unter Federbewegung und Last, Korrekturwege.

> **Abweichung zwischen A-12 und A-13:** Spicer nennt 1° Differenz, TREMEC 2°. Spicer ist strenger und gilt im Projekt als Zielwert, TREMEC als Obergrenze.

### Messmittelhersteller — Longacre Racing

| Kennung | Datei | Thema |
|---|---|---|
| **A-19** | `A-19-longacre-artikel-textextrakte.md` | **Sammelextrakt aller 19 Artikel** — für Volltextsuche |
| A-20 | `A-20-longacre-scaling-a-race-car-properly.html` | Scaling-Verfahren |
| A-21 | `A-21-longacre-why-should-i-scale-my-car.html` | Begründung Radlastmessung |
| A-22 | `A-22-longacre-bind-free-chassis-setups.html` | Fahrwerksbindung vermeiden |
| A-23 | `A-23-longacre-set-toe-properly.html` | Toe-Einstellverfahren |
| A-24 | `A-24-longacre-toe-plates.html` | Toe Plates |
| A-25 | `A-25-longacre-toe-in-gauge-instructions.html` | Toe-In Gauge / Tire Scribe |
| A-26 | `A-26-longacre-bump-steer.html` | Bump Steer messen |
| A-27 | `A-27-longacre-bumpsteer-back-to-basics.html` | Bump Steer Grundlagen |
| A-28 | `A-28-longacre-camber-simplified.html` | Camber |
| A-29 | `A-29-longacre-caster-simplified.html` | Castor |
| A-30 | `A-30-longacre-ackermann-effect.html` | Ackermann |
| A-31 | `A-31-longacre-chassis-dynamics.html` | Chassis Dynamics |
| A-32 | `A-32-longacre-pyrometer-tips.html` | Pyrometer-Praxis |
| A-33 | `A-33-longacre-memory-pyrometer-instructions.html` | Memory Pyrometer |
| A-34 | `A-34-longacre-digital-tire-pressure-gauge.html` | Digitaler Druckprüfer |
| A-35 | `A-35-longacre-proper-durometer-use.html` | Durometer-Anwendung |
| A-36 | `A-36-longacre-digital-durometer-instructions.html` | Digitales Durometer |
| A-37 | `A-37-longacre-laser-chassis-height-checker.html` | Laser Ride Height |
| A-38 | `A-38-longacre-easy-to-use-chassis-height-gauge.html` | Ride-Height-Lehre |

**Belegte Kernaussagen (Auswahl):**

- Race-Ready-Zustand vor vergleichbaren Messungen (A-20, A-23)
- *„To make changes to **Left side or Rear percentages** you will need to **move lead or other mass** within the car."* (A-20)
- Vor finalem Toe: *„Ride heights set, weight percentages correct, driver weight accounted for, bump steer set, camber and caster set, Ackerman set, air pressure set"* (A-23)
- Camber, Reifendruck und Bindung beeinflussen angezeigte Radlasten (A-20, A-22)
- Pyrometer-Reihenfolge RF → RR → LR → LF, gleiche Einstichtiefe (A-32, A-33)

> **Quellenkritik:** Longacre-Techtexte stammen überwiegend aus dem **US-Oval-Racing-Kontext**. Übernommen werden Messprinzipien und allgemeingültige mechanische Zusammenhänge — **nicht** Oval-Zielwerte wie „mehr Cross = tight" oder asymmetrische Alignment-Vorgaben.

> **Technischer Hinweis:** Die HTML-Spiegel enthalten je ~440 KB Shop-Chrome. Der Artikeltext steht im `rte`-Block. Für Zitate ist **A-19** die praktikable Fassung; die HTML-Dateien dienen als unveränderter Beleg.

---

## B — Fachliteratur / technische Dokumentation

| Kennung | Datei | Inhalt |
|---|---|---|
| **B-01** | `B-01-arning-shelby-suspension-drop.pdf` | *The Arning/Shelby Control Arm Drop* — David Suesz, mit Jeff Burgy |

**Belegt:**

- Maß: UCA-Anlenkpunkte **1" tiefer**, bei 64–66 Mustang zusätzlich **1/8" nach hinten**
- Der Rückversatz ist beim 67–70 **nicht möglich** (Platzverhältnisse im Federdom)
- **Fahrzeug wird dabei nur ca. 5/8" tiefer** — und das ist *nicht* der Grund für die Wirkung
- Wirkprinzip: *„The **roll center** of the suspension is **raised**, which causes the front suspension to resist body roll … as though a larger sway bar were installed."*
- *„It also serves to keep the wheels **more square in contact with the road surface**."*
- Zweck: *„radial-tuning"* einer Geometrie, die für schmale Diagonalreifen ausgelegt war
- **Beim Zusammenbau 1/8" Shims entfernen**, um die geänderte UCA-Winkellage auszugleichen
- Alignment nach der Modifikation zwingend erforderlich
- Historie: Geometrie stammt aus Klaus Arnings IRS-Entwicklung; der Handling-Gewinn kam überwiegend aus der Vorderachsänderung, nicht aus der IRS

> **Korrigiert zwei Aussagen im Altbestand:** Die Formulierung „Shelby Drop = 1 inch tieferes Auto ist falsch" war richtig, aber unvollständig — das Fahrzeug wird tatsächlich ca. 5/8" tiefer, nur ist das ein Nebeneffekt. Und: Die 1/8" Shim-Entnahme beim Einbau war im Konzept nicht erwähnt.

Original: https://mustangbarn.com/wp-content/uploads/2023/03/ArningShelby-Suspension-Drop.pdf

---

## C — Kompetente Sekundärquellen

| Kennung | Datei | Inhalt |
|---|---|---|
| **C-01** | `C-01-maier-racing-alignment-recommendations.pdf` | Maier Racing — Alignment Recommendations |

**Belegt:** Camber −0,5° bis −1,5°, Castor +1,5° bis +3° positiv, Toe 1/16" in bis 1/16" out. Zusätze: *„higher sustained corner speeds call for additional camber"*, *„Adjustable or modified strut rods may be required to achieve higher caster angles"*.

> Es sind **Straßen-/Performance-Werte**, kein Rundstrecken-Setup. Einordnung in [`00_PROJECT.md`](../../temp3/00_PROJECT.md) §8.

---

## Noch nicht gespiegelt

Referenziert, aber bislang nur als Online-Verweis geführt:

| Quelle | Thema | Priorität |
|---|---|---|
| Street or Track — Produktseiten UCA / LCA-Kit | Verstellbereiche, Track-Beispiel | mittel — Inhalte sind in den Kapiteln zitiert |
| Global West — Produktseiten (Bump Steer Kit, Del-A-Lum, UCA) | Blattfederbuchsen, lateraler Achsversatz | mittel |
| Maier Racing — Panhard Rod Kit, Rear Suspension Kit, FAQ | Panhard-Konzept, Traction Bars | mittel |
| OptimumG — 3 Artikel | Fahrdynamik, Datenanalyse | niedrig |
| Racecar Engineering — Tech Explained: Chassis | Grundlagen | niedrig |
| Opentracker — Produkt-/Techseiten | Alignment-Ranges | **blockiert** (Cloudflare) |
| Dunlop CG/4-5, CG/6 Operating Instructions | Messverfahren | **beim Nutzer** — Scans vorhanden, noch nicht abgelegt |
| dazecars.com — Shelby Drop | durch B-01 ersetzt | erledigt |

---

## B — Fachliteratur: Beschaffungsstatus

Die drei Grundlagenkapitel (`CHAPTER_VEHICLE_DYNAMICS`, `CHAPTER_TIRE_MECHANICS`, `CHAPTER_SPRINGS_ROLL_STIFFNESS`) stützen sich auf etablierte Fahrzeugdynamik, die bislang **nicht gegen eine zitierfähige Quelle geprüft** ist. Prüfung der Verfügbarkeit:

| Werk | Autor | Internet Archive | Status |
|---|---|---|---|
| *Race Car Vehicle Dynamics* | Milliken & Milliken | `race-car-vehicle-dynamics-milliken-milliken` | Sammlung `opensource`, **keine Leihbeschränkung** |
| *Tune to Win* | Carroll Smith (1987) | `tunetowinartscie0000smit` | `access-restricted-item: true` — **nur Controlled Digital Lending** |
| *Chassis Engineering* | Herb Adams (1993) | `chassisengineeri0000adam` | `access-restricted-item: true` — **nur Controlled Digital Lending** |

**Bewertung:**

- **Milliken** ist formal als `opensource` eingestellt. Ob das rechtlich korrekt ist, lässt sich von außen nicht beurteilen — das Werk ist regulär im Handel (SAE International). **Nicht gespiegelt.**
- **Smith** und **Adams** sind leihbeschränkt. Eine Spiegelung wäre eine Umgehung der Zugangsbeschränkung und kommt nicht in Frage.

> **Projektentscheidung:** Fachliteratur wird **nicht** in `docs/quellen/` gespiegelt. Für die Grundlagenkapitel wird stattdessen so verfahren:
>
> 1. Die dargestellten Zusammenhänge bleiben als **„aus physikalischen Grundlagen hergeleitet"** gekennzeichnet — so stehen sie bereits in allen drei Kapiteln.
> 2. Wo eine Aussage einen Beleg braucht, wird **die konkrete Textstelle** mit Werk, Auflage und Seitenzahl zitiert — aus einem rechtmäßig beschafften Exemplar.
> 3. Keine Zahlenwerte aus Literatur ohne Seitenbeleg.
>
> Das ist konsistent mit der Regel „Kein Sollwert ohne Quelle" — und mit dem Umstand, dass die Grundlagenkapitel bewusst **keine** Zahlenwerte enthalten.

**Empfehlung zur Anschaffung**, falls die Kapitel belegt werden sollen:

| Priorität | Werk | Deckt ab |
|---|---|---|
| 1 | Carroll Smith, *Tune to Win* | praxisnahe Balance-Abstimmung, alle drei Kapitel |
| 2 | Herb Adams, *Chassis Engineering* | Motion Ratio, Rollzentren am US-Fahrzeug |
| 3 | Milliken & Milliken, *RCVD* | Reifenkennfelder, Load Sensitivity, Lasttransfer — Referenzwerk, aber sehr umfangreich |

Für ein Fahrzeug mit **begrenzten Verstellmöglichkeiten** ist Smith der praktischste Einstieg; Milliken liefert die Theorie, von der nur ein Bruchteil umsetzbar ist.

---

## Nicht beschaffbar

| Gesucht | Zweck | Status |
|---|---|---|
| **Shelby GT350R / Trans-Am Werks-Alignment** | Rundstrecken-Referenzwerte für 65/66 | In Foren kursierende Zahlen sind **nicht nachprüfbar** und werden nicht aufgenommen. Mögliche Primärquellen: Shelby American Racing Team Service Bulletins, SAAC-Archiv, Ford Trans-Am Competition Preparation Manual. |
| Ford Shop Manual Part 3-6, lesbare Tabelle | Werksspezifikation Alignment | OCR unbrauchbar; Original-PDF noch nicht geholt |
| Avon CR6ZZ Herstellerdaten | Reifendruck, Betriebsbereich | noch nicht gesucht |

---

## Rechtehinweis

Die gespiegelten Dokumente dienen ausschließlich der technischen Nachvollziehbarkeit dieses privaten Projekts. Alle Rechte verbleiben bei den jeweiligen Rechteinhabern — Ford Motor Company, Dana Incorporated, TREMEC, Longacre Racing Products, Street or Track LLC, Maier Racing, den Autoren des Arning/Shelby-Dokuments. Auf Aufforderung eines Rechteinhabers werden die betreffenden Dateien entfernt.
