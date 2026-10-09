# Mustang Track Chassis Setup - Radlasten, Corner Weight & Balance

**Fahrzeug:** Ford Mustang 1966 - Rundstrecke  
**Version:** 0.1 - 2026-10-04  
**Status:** Fachkapitel; GitHub unverändert

## 1. Kernidee

Vier Radlastwaagen liefern vier statische Vertikallasten: LF, RF, LR und RR. Daraus werden Gesamtgewicht, Front/Rear-, Left/Right- und Cross-Weight-Anteile berechnet.

Die Begriffe müssen strikt getrennt bleiben:

- **Mass Distribution:** Wo befindet sich reale Masse im Fahrzeug?
- **Corner Weight:** Welche statische Last trägt jedes Rad?
- **Cross Weight:** Wie verteilt sich die statische Last diagonal?

Feder-/Ride-Height-Verstellungen können die diagonale Lastverteilung verändern. Sie können aber die reale Front-/Heck- oder Links-/Rechts-Massenverteilung nicht beliebig verschieben. Dafür muss reale Masse im Fahrzeug verlagert werden.

---

## 2. Die vier Radlasten

```text
                    FAHRTRICHTUNG
                         ↑

                LF                 RF
             vorne links        vorne rechts

                LR                 RR
             hinten links       hinten rechts
```

### Formeln

`Total = LF + RF + LR + RR`

`Front % = (LF + RF) / Total × 100`

`Rear % = (LR + RR) / Total × 100`

`Left % = (LF + LR) / Total × 100`

`Right % = (RF + RR) / Total × 100`

Für dieses Projekt gilt einheitlich:

`Cross % = (RF + LR) / Total × 100`

Die Gegendiagonale ist:

`Opposite Cross % = (LF + RR) / Total × 100`

---

## 3. Schwerpunktlage aus den statischen Achslasten

Aus der statischen Front-/Rear-Verteilung lässt sich die Längslage des Schwerpunkts ableiten.

`Abstand CG von Hinterachse = Radstand × Frontgewicht / Gesamtgewicht`

`Abstand CG von Vorderachse = Radstand × Heckgewicht / Gesamtgewicht`

Das liefert die **Längslage**, nicht die Schwerpunktshöhe.

---

## 4. Was bedeutet 50 % Cross?

Bei 50 % gilt:

`RF + LR = LF + RR`

Für einen Rundstreckenwagen, der links und rechts fahren muss, ist 50 % ein sinnvoller **symmetrischer Ausgangspunkt**.

Es wird aber nicht als Naturgesetz behandelt. 50,00 % ist nicht automatisch das schnellste Setup, weil unter anderem folgende Faktoren ebenfalls wirken:

- asymmetrische Massenverteilung
- Front-/Rear-Bias
- unterschiedliche Rollsteifigkeit vorn/hinten
- Reifen-Load-Sensitivity
- Fahrerposition
- Bremsen und Beschleunigen
- Streckencharakteristik

**Projektregel:** 50 % ist Baseline für Symmetrie, nicht Dogma.

---

## 5. Massenverteilung ist nicht Cross Weight

Ein Mustang kann beispielsweise 57 % Frontgewicht besitzen und trotzdem exakt 50 % Cross Weight haben.

```text
Front-/Rear-Verteilung
-> beschreibt primär die Lage realer Masse in Längsrichtung

Cross Weight
-> beschreibt die statische diagonale Reaktionskraftverteilung
```

Mit Fahrwerkseinstellungen kann man Cross ändern. Um die echte Front-/Rear- oder Left-/Right-Verteilung wesentlich zu ändern, muss Masse bewegt werden, etwa Batterie, Tank, Ballast oder Bauteile.

Longacre weist ausdrücklich darauf hin, dass Left- oder Rear-Prozentwerte nicht durch bloßes Drehen an Jack Screws/Federauflagen verschoben werden; dafür muss Masse verlagert werden.

---

## 6. Was passiert beim Verstellen einer Ecke?

Eine Änderung der effektiven Federauflage belastet nicht nur eine Ecke isoliert. Das Fahrzeug reagiert diagonal.

Vereinfacht:

- mehr Last auf **RF + LR** -> Cross % steigt
- mehr Last auf **LF + RR** -> Cross % sinkt

Longacre beschreibt für typische verstellbare Rennfahrwerke zum Erhöhen von Cross Weight eine kombinierte Anpassung der vier Ecken, damit die Ride Heights möglichst erhalten bleiben.

Das konkrete Verhältnis ist **nicht universell**. Es hängt ab von Federrate, Motion Ratio, Federposition, Achskonstruktion, Fahrwerksreibung — und vor allem von der **vorhandenen Einstellhardware**.

> **Für dieses Fahrzeug ist dieser Abschnitt weitgehend theoretisch.** Die beschriebene Vier-Ecken-Anpassung setzt höhenverstellbare Federauflagen voraus. Dieses Fahrzeug hat sie nicht (§7). Der Abschnitt bleibt, weil er erklärt, **warum** eine Ecke nie isoliert reagiert — das ist für das Verständnis der Messwerte wichtig, auch wenn nicht danach eingestellt werden kann.

---

## 7. Besonderheit des 1966 Mustang

Der Mustang ist kein modernes Vierfach-Coilover-Fahrzeug.

### Vorderachse
- SLA-Geometrie
- Schraubenfeder
- Feder sitzt nicht direkt am Rad
- Motion Ratio ist relevant
- reale Ride-Height-Verstellmöglichkeit muss am Fahrzeug dokumentiert werden

### Hinterachse
- Ford 9" Starrachse
- Blattfedern
- Panhard Bar

Hinten existiert nicht automatisch eine unabhängige Federtellerverstellung.

Daraus folgt:

> Nicht um jeden Preis 50,00 % Cross erzeugen.

Ein perfekter Displaywert ist wertlos, wenn dafür unerwünschte Ride Height, Federbindung, Stabilisatorvorspannung oder ungünstige Panhard-Geometrie entsteht.

### Und: Die Hardware zum gezielten Verstellen fehlt

Zum kontrollierten Einstellen von Cross Weight braucht es **höhenverstellbare Federauflagen** an mindestens zwei Ecken. Dieses Fahrzeug hat sie nach aktuellem Kenntnisstand nicht:

| Achse | Lage |
|---|---|
| vorn | Serien-Federteller oder Roller Perches - **keine Höhenverstellung** |
| hinten | Blattfeder - **keine unabhängige Federtellerverstellung** |

**Was damit bleibt:**

| Möglich | Bemerkung |
|---|---|
| Cross Weight **messen** | zwingend, als Diagnosegröße |
| Ursache einer Asymmetrie **finden** | Federbogen, Bind, Chassistoleranz |
| grobe Korrektur über **Flat Shims** hinten | stufig, verändert auch Ride Height |
| Korrektur über **Ballast** | verändert Gesamtmasse |

> **Konsequenz:** Cross Weight ist an diesem Fahrzeug primär eine **Diagnosegröße**, keine Setup-Schraube. Weicht der Wert ab, liegt die Ursache meist bei Bind, Federbogen oder Ride Height - und dort gehört sie behoben, nicht über eine Cross-Verstellung überdeckt.
>
> Das relativiert auch die Oval-Literatur: Dort ist Cross die zentrale Stellgröße, **weil Jack Screws vorhanden sind**. Vollständige Einordnung in [`CHAPTER_VEHICLE_DYNAMICS.md`](CHAPTER_VEHICLE_DYNAMICS.md) §9.4.

---

## 8. Stabilisatorvorspannung

Ein Stabilisator kann die Radlastmessung verändern, wenn er im statischen Zustand vorgespannt ist.

Für eine neutrale Baseline:

1. Stabilisator lösen bzw. neutral stellen.
2. Fahrzeug vollständig auf den Waagen ausbalancieren.
3. endgültige Ride Height herstellen.
4. Stabilisator ohne zusätzliche Vorspannung anschließen.
5. Radlasten vor/nach Anschluss vergleichen.

Ändern sich die Radlasten deutlich, wurde ARB-Preload eingebracht.

---

## 9. Race-Ready-Zustand

Longacre verlangt einen vollständig reproduzierbaren Rennzustand.

Für unser Projekt werden vor einer vergleichbaren Messung festgelegt:

- Fahrer oder reproduzierbarer Fahrerballast
- definierter Kraftstoffstand
- alle Betriebsflüssigkeiten
- gleicher Rad-/Reifensatz
- definierter Reifendruck
- gleiche Fahrzeugkonfiguration
- Lenkrad gerade
- Hinterachse geometrisch geprüft
- keine Brems- oder Fahrwerksbindung
- keine losen Gegenstände

### Fahrer

Für Track-Setup-Vergleiche ist Fahrer bzw. Fahrerballast an Bord die sinnvollste Referenz, weil der Fahrer zum fahrenden Fahrzeug gehört.

### Kraftstoff

Der Kraftstoffstand muss definiert werden, z. B. volle, halbe oder typische Stintmenge. Entscheidend ist die Reproduzierbarkeit.

---

## 10. Reifendruck, Camber und Fahrzeugzustand beeinflussen die Waagen

Reifendruck verändert effektiven Radius, Steifigkeit und Chassishöhe. Camber kann Kontaktlage und Fahrzeughöhe geringfügig verändern.

Daher entsteht ein **iterativer Setup-Zyklus**:

```text
grobes Alignment
      ↓
Scaling / Ride Height
      ↓
Alignment korrigieren
      ↓
erneut Scaling
      ↓
Final Alignment
      ↓
Final Scaling Check
```

Nicht: einmal wiegen und fertig.

---

## 11. Fahrwerksreibung und Hysterese

Nach dem Anheben kann das Fahrzeug andere Radlasten zeigen, obwohl keine Einstellung verändert wurde.

Mögliche Ursachen:

- Dämpferdichtungsreibung
- Buchsenreibung
- Kugelgelenke
- Reifenverspannung
- Stabilisator
- Blattfederreibung
- fehlende seitliche Entspannung der Reifen

Longacre empfiehlt deshalb eine reproduzierbare **Settling-Prozedur** nach jeder Änderung.

> **Vollständige Bind-Diagnose:** [`CHAPTER_BIND_DIAGNOSIS.md`](CHAPTER_BIND_DIAGNOSIS.md) - Reproduzierbarkeitstest mit Schwellenwerten, Test auf laterale Überbestimmung und Hysteresetest.

### Vorläufige Projekt-Prozedur

1. Fahrzeug auf die Waagen.
2. Lenkrad gerade.
3. Bremsen lösen.
4. Vorder- und Hinterwagen definiert vertikal bewegen.
5. Chassis leicht bewegen, um Bindung zu lösen.
6. zur Ruhe kommen lassen.
7. Werte erfassen.
8. Prozedur wiederholen.
9. nur ausreichend reproduzierbare Messungen akzeptieren.

Die beste reale Settling-Methode soll am Mustang durch Wiederholungsmessungen bestimmt werden.

---

## 12. Setup Pad

Idealerweise liegen alle vier Waagenoberflächen:

- in einer gemeinsamen Ebene
- möglichst horizontal
- auf steifem Untergrund

Longacre unterscheidet sinnvoll zwischen **horizontal** und **coplanar**: Eine kleine gemeinsame Neigung aller vier Pads ist wesentlich weniger kritisch als ein einzelnes oder diagonales Pad außerhalb der gemeinsamen Ebene.

Ein höheres Einzelpad kann falsches Cross Weight erzeugen.

> Bevor Zehntelprozent Cross optimiert werden, muss bewiesen sein, dass nicht der Werkstattboden die Differenz erzeugt.

---

## 13. Longacre kabelgebundene Waage - Bedienprinzip

Das genaue Modell wird noch identifiziert. Für die kabelgebundenen Longacre AccuSet/Computerscales-Systeme ist das Grundprinzip:

1. Pads neben dem Fahrzeug positionieren.
2. LF/RF/LR/RR korrekt zuordnen.
3. Kabel an die korrekten Eingänge anschließen.
4. Steuergerät einschalten.
5. ungefähr eine Minute stabilisieren lassen.
6. unbelastet **ZERO** drücken.
7. Fahrzeug auf die Pads bringen.
8. **ZERO niemals mit Fahrzeug auf den Pads drücken.**
9. Fahrwerk setzen.
10. Werte erfassen.

---

## 14. Plausibilitätsprüfung der Waagen

Vor Setup-Entscheidungen:

- alle Pads unbelastet auf 0
- Kabel unbeschädigt
- Pads flächig und spannungsfrei
- bekannte Masse testweise auf verschiedenen Pads vergleichen
- Gesamtgewicht bei Wiederholungsmessung stabil
- Einzelradlasten nach erneutem Setzen ausreichend reproduzierbar

Eine bekannte Prüfmasse ist sinnvoller als blindes Vertrauen in viele Display-Nachkommastellen.

---

## 15. Messprotokoll

```text
Datum:
Setup-Pad-Version:
Waagenmodell:

Fahrer / Ballast:
Kraftstoff:
Reifen:
Druck:

Ride Height:
LF:
RF:
LR:
RR:

Radlasten:
LF:
RF:
LR:
RR:

Total:
Front %:
Rear %:
Left %:
Right %:
Cross % (RF+LR):

Settling Versuch 1:
Settling Versuch 2:
Differenz:

Stabilisator:
[ ] gelöst / neutral
[ ] angeschlossen

Radlaständerung nach Anschluss:

Bemerkungen:
```

---

## 16. Was vier statische Waagen NICHT direkt zeigen

Die Waagen messen keinen:

- dynamischen Lasttransfer einer konkreten Kurve
- Grip
- Dämpferverlauf
- Rollzentrum
- Rollsteifigkeitsverteilung
- Bump Steer
- dynamischen Camber
- transienten Turn-in
- automatisch optimalen Cross-Wert

Die Waage liefert einen sehr wichtigen **statischen Ausgangszustand**, aber kein vollständiges Fahrdynamikmodell.

---

## 17. Dynamischer Lasttransfer

Beim Bremsen gilt vereinfacht:

`ΔW_longitudinal ∝ Fahrzeuggewicht × Verzögerung × Schwerpunktshöhe / Radstand`

Beim Kurvenfahren hängt der gesamte laterale Lasttransfer unter anderem ab von:

- Fahrzeugmasse
- Querbeschleunigung
- Schwerpunktshöhe
- Spurweite

Wie sich der laterale Lasttransfer zwischen Vorder- und Hinterachse verteilt, hängt zusätzlich von Geometrie und Rollsteifigkeitsverteilung ab.

Daher:

> Statisches Cross Weight und dynamischer Load Transfer sind verwandt, aber nicht dasselbe.

---

## 18. Track-Validierung

Nach dem Scaling interessiert uns:

- Links-/Rechts-Symmetrie beim Turn-in
- Mid-Corner-Balance
- Traktion links/rechts
- Bremsstabilität
- Reifentemperaturen
- Warmdruck
- Reifenbild
- Verhalten mit sinkendem Kraftstoffstand
- Rundenzeit und Fahrerfeedback

Erst Trackdaten zeigen, ob die gewählte statische Balance funktioniert.

---

## 19. Erstes reales Messprogramm

### A - Istzustand

Keine Änderungen.

Erfassen:

- Setup-Pad
- Reifendruck
- Fahrer/Fahrerballast
- Fuel
- Ride Height
- LF/RF/LR/RR
- alle Prozentwerte
- mindestens zwei identische Settling-Zyklen
- Reproduzierbarkeit

### B - Fahrer-Einfluss

Optional:

- einmal ohne Fahrer
- einmal mit Fahrer

Damit wird sichtbar, wie sich der Fahrer auf alle vier Ecken verteilt.

### C - Fuel-Einfluss

Optional zwei definierte Kraftstoffstände vergleichen.

### Wichtig

Bei der ersten Waagensession **nicht sofort auf 50,00 % optimieren**.

Zuerst muss der Istzustand verstanden und reproduzierbar gemessen werden.

---

## 20. Mustang-spezifische offene Punkte

Vor Version 1.0 müssen dokumentiert werden:

- Vorderfeder und Federrate
- Federauflage / Höhenverstellung
- Stabilisator(en), Durchmesser und Koppelstangen
- Blattfederausführung und Rate
- reale Ride Heights an definierten Chassispunkten
- Links-/Rechts-Höhendifferenz
- Panhard-Höhe und Winkel
- exaktes Longacre-Waagenmodell
- reale vier Radlasten mit Fahrer
- Kraftstoff-Referenzzustand
- tatsächliche Möglichkeit, Cross Weight einzustellen

---

## 21. Quellen

### Primärquelle - Longacre

**Scaling A Race Car Properly**  
https://longacreracing.com/pages/scaling-a-race-car-properly

**Why Should I Scale My Car?**  
https://longacreracing.com/pages/why-should-i-scale-my-car

**Computerscales AccuSet II Instructions**  
https://www.longacreracing.com/tech-central.aspx?item=8137&title=computerscales-accuset-ii-instructions

### Fahrdynamische Sekundärquelle

**Racecar Engineering - Tech Explained: Chassis**  
https://www.racecar-engineering.com/articles/tech-explained-chassis/

---

## 22. Quellenkritik

Ein Teil der Longacre-Techtexte stammt deutlich aus dem US-Oval-Racing-Kontext.

Daher werden Oval-Regeln wie:

- "mehr Cross = tight"
- "weniger Cross = loose"
- bestimmte Left-% als pauschaler Zielwert

**nicht ungeprüft auf den europäischen Rundstrecken-Mustang übertragen**.

Übernommen werden nur belastbare Messprinzipien und allgemein gültige mechanische Zusammenhänge. Rundstrecken-Zielwerte werden separat validiert.

---

## 23. Definition of Done

- [x] Mass Distribution / Corner Weight / Cross Weight getrennt
- [x] Formeln festgelegt
- [x] 50-%-Cross differenziert
- [x] Setup-Pad erklärt
- [x] Race-ready definiert
- [x] Settling berücksichtigt
- [x] ARB-Preload berücksichtigt
- [x] statisch vs. dynamisch getrennt
- [x] Longacre-Grundbedienung integriert
- [x] Mustang-Besonderheiten markiert
- [ ] exaktes Longacre-Modell identifiziert
- [ ] reale Radlasten erfasst
- [ ] reale Ride-Height-Versteller dokumentiert
- [ ] Panhard-/Blattfeder-Einfluss am Fahrzeug vermessen
- [ ] Trackdaten vorhanden
