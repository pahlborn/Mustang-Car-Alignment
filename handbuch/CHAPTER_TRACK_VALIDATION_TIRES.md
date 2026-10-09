# Mustang Track Chassis Setup - Track Validation: Reifendruck, Pyrometer, Shore-Haerte & Fahrerfeedback
## Kapitel: Track Validation - Reifendruck, Pyrometer, Shore-Härte & Fahrerfeedback

**Fahrzeug:** Ford Mustang 1966 - Rundstrecke  
**Version:** 0.1 - 2026-10-04  
**Status:** Fachkapitel; GitHub unverändert

---

## 1. Ziel

Das statische Werkstatt-Setup ist nur der Ausgangspunkt.

Auf der Strecke muss geprüft werden, ob:

- Reifen im richtigen Arbeitsbereich arbeiten,
- Camber zur realen Belastung passt,
- Druckentwicklung reproduzierbar ist,
- Links-/Rechtsunterschiede plausibel sind,
- der Reifen über seine Lebensdauer konsistent bleibt,
- und das Fahrerfeedback zu den Messdaten passt.

Für dieses Projekt stehen bereits zur Verfügung:

- **Longacre digitaler Reifendruckprüfer**
- **Longacre Einstich-Pyrometer**
- **Shore-A-Messgerät / Reifen-Durometer**

Damit ist ein sehr brauchbares Reifen-Datenset möglich.

---

## 2. Grundprinzip

Nicht:

> Reifendruck messen -> irgendeinen Wert einstellen.

Sondern:

```text
BASELINE SETUP
      ↓
STINT
      ↓
SOFORT MESSEN
      ↓
Druck + Temperatur + Härte/Alterung + Reifenbild
      ↓
Fahrerfeedback
      ↓
Hypothese
      ↓
eine gezielte Änderung
      ↓
erneuter Stint
      ↓
Vergleich
```

---

## 3. Druck - was tatsächlich gemessen wird

Reifendruck verändert sich mit Temperatur.

Deshalb muss immer unterschieden werden zwischen:

- **Cold Pressure**
- **Hot Pressure**
- **Pressure Gain**

Für das Projekt:

`Pressure Gain = Hot Pressure - Cold Pressure`

Die absolute Zahl allein ist weniger aussagekräftig als:

- Ausgangsdruck
- Enddruck
- Temperatur
- Fahrzeit
- Strecke
- Reifenposition

---

## 4. Longacre Digital Gauge

Longacre weist bei digitalen Druckprüfern darauf hin:

- Gerät beim Einschalten automatisch nullen lassen
- nicht mit angelegtem Druck einschalten
- bei Bedarf manuell nullen
- Einheit auf bar / psi festlegen
- Gerät sauber und trocken halten
- nicht über den zulässigen Messbereich belasten

Quelle:
https://longacreracing.com/pages/digital-tire-pressure-gauge-instructions

### Projektstandard

Wir verwenden **bar** als Hauptwert.

Optional wird psi zusätzlich gespeichert, wenn Herstellerdaten in psi vorliegen.

---

## 5. Messreihenfolge Druck

Damit zeitliche Abkühlung reproduzierbar bleibt:

Immer dieselbe Reihenfolge.

Empfehlung für dieses Projekt:

1. RF
2. RR
3. LR
4. LF

Das entspricht auch der Reihenfolge vieler Longacre-Speichergeräte und harmoniert mit dem Pyrometer-Ablauf.

### Wichtig

Nach Ende des Stints:

- direkt zur Messposition
- keine lange Cool-down-Runde, wenn Temperaturdaten ausgewertet werden sollen
- Druck sofort erfassen
- danach Pyrometer

Die Verzögerungszeit muss dokumentiert werden.

---

## 6. Aktuelle Baseline

Bisher im Projekt verwendet:

**Warmdruck: 2,2 bar**

Dieser Wert bleibt:

> **Baseline V1 - nicht automatisch endgültiger Sollwert.**

Er wird künftig gegen:

- Reifenbild
- Pyrometerdaten
- Handling
- Herstellerinformationen
- Track-Ergebnisse

validiert.

---

## 7. Warum ein Druckwert allein nicht reicht

Ein Reifen kann denselben Hot Pressure erreichen bei:

- zu niedrigem Startdruck + hoher Erwärmung
- höherem Startdruck + geringer Erwärmung

Das sind unterschiedliche Betriebszustände.

Deshalb immer gemeinsam speichern:

| Reifen | Cold | Hot | Gain |
|---|---:|---:|---:|
| LF | | | |
| RF | | | |
| LR | | | |
| RR | | | |

---

## 8. Einstich-Pyrometer - warum besser als IR

Longacre empfiehlt für belastbare Reifenanalyse ein Einstich-Pyrometer.

Der Grund:

- IR misst primär Oberflächentemperatur
- Oberfläche kühlt sehr schnell ab
- die Sonde misst tiefer im Gummi
- damit ist die Messung näher an der thermischen Belastung des Reifens

Für unser Track-Setup ist das vorhandene Longacre-Probe-Pyrometer daher genau das richtige Werkzeug.

Quelle:
https://longacreracing.com/pages/pyrometer-tips

---

## 9. Drei Temperaturpunkte je Reifen

Longacre empfiehlt:

- **Outside**
- **Middle**
- **Inside**

mit möglichst gleicher Position und gleicher Einstichtiefe an allen Reifen.

Longacre nennt ungefähr 1,5" Abstand von den Rändern als typische Messposition.

Für das Projekt wird wichtiger sein:

> gleiche relative Position auf jedem Reifen, jedes Mal.

---

## 10. Einstichtiefe

Die Sonde muss jedes Mal möglichst gleich tief in den Reifen.

Longacre weist ausdrücklich darauf hin:

- tiefer eingestochen -> typischerweise höhere Temperatur
- unterschiedliche Tiefe erzeugt künstliche Temperaturdifferenzen

Projektregel:

- gleiche Sonde
- gleiche Tiefe
- gleiche Stelle
- gleiche Reihenfolge

---

## 11. Messreihenfolge Temperatur

Longacre Memory Pyrometer verwendet:

1. RF
2. RR
3. LR
4. LF

und je Reifen:

1. Outside
2. Center
3. Inside

Diese Reihenfolge wird im Projekt übernommen.

Damit ist die Zeitverzögerung zwischen Reifen jedes Mal möglichst gleich.

---

## 12. Zeit ist ein Messfehler

Nach dem Verlassen der Strecke verändert sich die Reifentemperatur sofort.

Daher protokollieren:

- Zeitpunkt Ende schneller Runde
- Zeitpunkt Stillstand
- Beginn Temperaturmessung
- Ende Temperaturmessung

Je reproduzierbarer dieser Ablauf, desto besser sind Stints vergleichbar.

---

## 13. Camber aus Temperaturdaten beurteilen

Ein Temperaturprofil kann Hinweise auf Camber liefern.

Beispiel:

```text
Outside    Center    Inside
  72°C       78°C      88°C
```

Das kann auf stärkere Belastung der Innenseite hinweisen.

Aber:

> Ein einzelner Temperaturgradient beweist nicht automatisch "zu viel Camber".

Mit hineinspielen:

- Druck
- Fahrstil
- Kurvenverteilung
- Bremsen
- letzte Kurve vor Box
- Messverzögerung
- Reifenbauart
- Spur
- Track Direction

Daher werden Temperaturdaten immer gemeinsam mit Druck, Reifenbild und Fahrverhalten ausgewertet.

---

## 14. Center Temperature und Druck

Ein stark abweichendes Temperaturzentrum kann Hinweise auf Druck bzw. Karkassenarbeit geben.

Aber auch hier keine einfache Regel:

- Mitte heißer = nicht automatisch zu viel Druck
- Mitte kälter = nicht automatisch zu wenig Druck

Die reale Reifenstruktur, Belastung und Temperaturentwicklung müssen berücksichtigt werden.

Für den Avon CR6ZZ sollen deshalb keine pauschalen Slick-Regeln ungeprüft übernommen werden.

---

## 15. Links-/Rechts-Asymmetrie

> **Streckenabhängig:** Die Kurvenrichtungsverteilung der fünf Projektstrecken steht in [`CHAPTER_TRACKS.md`](CHAPTER_TRACKS.md) §2. Auf rechtslastigen Strecken wie Pannoniaring (11R/7L) ist ein heißeres linkes Vorderrad **normal**.

Auf europäischen Rundstrecken ist die Kurvenbelastung selten exakt symmetrisch.

Daher ist z. B.:

- LF deutlich heißer als RF

nicht automatisch ein Fahrwerksfehler.

Zusätzlich betrachten:

- Streckenrichtung
- Anzahl schneller Links-/Rechtskurven
- letzte belastete Kurve vor Boxeneinfahrt
- Bremszonen

Das Setup Log bekommt deshalb eine kleine **Track Load Map**.

---

## 16. Shore-A / Reifen-Durometer

Ein Shore-A-Durometer misst die relative Härte der Gummimischung.

Longacre beschreibt es als Werkzeug, um:

- neue Reifen zu vergleichen
- Alterung über Lebensdauer zu verfolgen
- zu erkennen, wann ein Reifensatz deutlich härter wird

Das Gerät misst **nicht direkt Grip**.

Quelle:
https://longacreracing.com/pages/proper-durometer-use

---

## 17. Warum Shore-Werte nützlich sind

Mit zunehmendem Alter können Rennreifen härter werden durch:

- Wärmezyklen
- Oxidation
- Alterung
- Lagerung

Daher kann ein Reifensatz mit noch gutem Profil trotzdem deutlich weniger Grip besitzen.

Der Shore-Wert liefert dafür eine zusätzliche objektive Trendgröße.

---

## 18. Shore-Messung korrekt durchführen

Longacre empfiehlt:

1. mehrere Stellen messen
2. Mittelwert bilden
3. Gerät leicht schräg ansetzen
4. über die Senkrechte hinweg "rollen"
5. höchsten Wert erfassen
6. schnell messen
7. nicht lange auf derselben Stelle stehen lassen

Warum?

Das Gummi verformt sich unter dem Prüfstift. Bei zu langer Messzeit entsteht ein falscher Wert.

---

## 19. Temperaturabhängigkeit der Shore-Härte

Ein Shore-Wert ist temperaturabhängig.

Deshalb dürfen Werte nur sinnvoll verglichen werden, wenn die Reifen ungefähr dieselbe Temperatur haben.

Projektstandard:

> Shore-Messungen primär **kalt und konditioniert** durchführen.

Beispielsweise:
- Werkstatt
- Reifen mehrere Stunden gleiche Umgebung
- Oberflächentemperatur notieren

Nicht:
- einen Reifen heiß aus der Box
- einen anderen morgens kalt

miteinander vergleichen.

---

## 20. Shore-Messpunkte

Für jeden Reifen mehrere Messpunkte:

- innerer Laufstreifen
- Mitte
- äußerer Laufstreifen

jeweils mehrere Wiederholungen.

Dann:

- Mittelwert
- Streuung

dokumentieren.

Damit kann auch erkannt werden, ob der Reifen lokal unterschiedlich gealtert ist.

---

## 21. Shore ist kein Track-Tuning-Regler

Nicht:

> Shore ist 62 statt 58 -> Fahrwerk ändern.

Sondern:

> Shore zeigt, dass dieser Reifensatz nicht mehr direkt mit einem frischen Satz vergleichbar ist.

Das ist besonders wichtig für A/B-Tests.

Wenn zwischen zwei Setup-Stints gleichzeitig der Reifen deutlich gealtert ist, kann das Ergebnis falsch dem Fahrwerk zugeschrieben werden.

---

## 22. Reifenalter als Variable

Jeder Reifensatz erhält eine ID.

Beispiel:

```text
AVON-A-2026-01
```

Zu speichern:

- Kaufdatum
- DOT / Herstellungsdatum
- erster Einsatz
- Anzahl Tracktage
- Anzahl Heat Cycles
- Shore kalt
- Profiltiefe
- sichtbare Schäden

Damit lässt sich Reifenalter von Setupänderungen trennen.

---

## 23. Heat Cycles

Für Trackreifen ist nicht nur Kilometerleistung interessant, sondern auch thermische Zyklen.

Projektdefinition:

Ein **Heat Cycle** wird dokumentiert, wenn der Reifen von kaltem Zustand auf echte Tracktemperatur erwärmt und anschließend wieder vollständig abgekühlt ist.

Damit können Shore-Härte und Performance über Lebensdauer verfolgt werden.

---

## 24. Reifenbild

Nach jedem aussagekräftigen Stint kontrollieren:

- Innenkante
- Mitte
- Außenkante
- Feathering
- Graining
- Pickup
- Chunking
- Blistering
- ungewöhnliche lokale Abrasion

Fotos immer:

- gleiche Perspektive
- Reifen-ID sichtbar
- Position LF/RF/LR/RR
- Stintnummer

---

## 25. Fahrerfeedback strukturieren

Nicht:

> "Auto war schlecht."

Sondern nach Kurvenphase:

### Braking
- stabil?
- zieht?
- Hinterachse nervös?

### Turn-in
- spontan?
- träge?
- überschießt?

### Entry
- Front grip?
- Rear stability?

### Mid-corner
- understeer?
- oversteer?
- neutral?

### Exit
- Traktion?
- power oversteer?
- push?

### High Speed
- stabil?
- nervös?
- Lenkkorrekturen?

### Kerbs / Bumps
- darting?
- hop?
- Lenkrückschlag?

---

## 26. Handling-Diagnose: Messung vor Änderung

Beispiel:

### Symptom
Mid-corner understeer

Mögliche Ursachen:
- Frontreifen überlastet
- Camber
- Druck
- Front roll stiffness
- rear grip zu hoch
- Bump Steer
- Fahrstil
- Reifenalter

Daher zuerst prüfen:

- Fronttemperaturen I/M/A
- Hot Pressure
- Shore / Reifenalter
- Reifenbild
- Vergleich LF/RF
- Radlasten / Setup
- Feedback

Erst danach Änderung.

---

## 27. Eine Änderung pro Test

Grundregel:

> **Pro Vergleichszyklus nur eine relevante Setup-Änderung.**

Beispiele:

Gut:
- Camber -2,0° -> -2,5°

Schlecht:
- Camber ändern
- Toe ändern
- Druck ändern
- Stabi ändern

und danach versuchen, die Ursache des Effekts zu erraten.

Ausnahmen:
- Sicherheitsproblem
- Reparatur
- klar gekoppelter technischer Zwang

---

## 28. A/B-Test

Ein sauberer Track-Test:

### A
Baseline-Stint

### B
eine Änderung

Dann möglichst gleich halten:
- Reifen
- Fuel
- Fahrer
- Strecke
- Wetter
- Verkehr
- Stintlänge

Perfekte Gleichheit ist auf Trackdays unmöglich, aber die Randbedingungen werden dokumentiert.

---

## 29. Track Session Sheet

```text
Event:
Strecke:
Datum:
Session:
Uhrzeit:

Wetter:
Luft:
Asphalt:
trocken/nass:

Reifensatz:
Heat Cycles:
Shore cold:
LF:
RF:
LR:
RR:

Cold pressure:
LF:
RF:
LR:
RR:

Setup:
Camber L/R:
Castor L/R:
Toe:
Cross:
Ride Height:

Stint:
Runden:
Best lap:
Fuel start/end:

Hot pressure:
LF:
RF:
LR:
RR:

Temperaturen:
          OUT    MID    IN
LF:
RF:
LR:
RR:

Reifenbild:
LF:
RF:
LR:
RR:

Fahrerfeedback:
Braking:
Turn-in:
Entry:
Mid:
Exit:
High speed:
Kerbs:

Änderung gegenüber vorher:
Ergebnis:
```

---

## 30. Reihenfolge direkt nach dem Stint

Projektstandard V0.1:

1. Fahrzeug anhalten
2. Uhrzeit notieren
3. **Hot Pressures**
4. **Pyrometer RF -> RR -> LR -> LF**
5. Reifenbild fotografieren
6. Fahrerfeedback sofort notieren
7. Shore **nicht heiß als Lebensdauervergleich**, sondern später kalt/konditioniert
8. Setupänderung erst nach Datenauswertung

---

## 31. Warum Shore später kommt

Druck und Temperatur verlieren nach dem Stint schnell ihre Aussagekraft.

Shore-Härte für Reifenalter soll dagegen standardisiert bei vergleichbarer Temperatur gemessen werden.

Daher:

- Hot Pressure + Pyrometer sofort
- Shore später, kalt und konditioniert

---

## 32. Instrumenten-Check

### Longacre Pressure Gauge
Vor Event:
- Batterie
- Nullpunkt
- Einheit bar
- Vergleich mit Referenzgerät, falls vorhanden

### Longacre Pyrometer
Vor Event:
- Probe kontrollieren
- Stecker korrekt
- Batterie
- gleiche Einstichtiefe markieren
- Longacre nennt kochendes Wasser als schnellen Kalibriercheck für bestimmte Modelle

### Shore Meter
Vor Event:
- Zero
- Testblock, falls vorhanden
- gleiche Messtemperatur
- saubere Prüfspitze

---

## 33. Was wir noch nicht als feste Zielwerte definieren

Noch offen:

- optimaler Cold Pressure Avon CR6ZZ
- optimaler Hot Pressure
- idealer Temperaturgradient
- idealer Shore-Wert
- maximal akzeptabler Heat-Cycle-Verlust

Solche Werte werden nur übernommen, wenn:

1. Herstellerdaten existieren, oder
2. sie aus unseren reproduzierbaren Trackdaten validiert werden.

Die bisherige 2,2-bar-Warmdruck-Baseline bleibt zunächst dokumentiert.

---

## 34. Tool-Integration in die spätere Website

Die Hauptseite bleibt **Wissen und Interpretation**.

Untergeordnet:

### Tool Guide: Longacre Digital Pressure Gauge
- Nullung
- Einheit
- Messablauf
- Pflege

### Tool Guide: Longacre Probe Pyrometer
- Messreihenfolge
- Einstichtiefe
- Speicherfunktion je nach Modell
- Kalibriercheck

### Tool Guide: Shore-A Durometer
- rocking technique
- mehrere Messpunkte
- Mittelwert
- Temperaturstandardisierung

---

## 35. Quellen

### Longacre - Digital Tire Pressure Gauge Instructions
https://longacreracing.com/pages/digital-tire-pressure-gauge-instructions

### Longacre - Standard Memory Tire Pyrometer Instructions
https://longacreracing.com/pages/standard-memory-tire-pyrometer-instructions

### Longacre - Pyrometer Tips
https://longacreracing.com/pages/pyrometer-tips

### Longacre - Proper Durometer Use
https://longacreracing.com/pages/proper-durometer-use

### Longacre - Digital Durometer Instructions
https://longacreracing.com/pages/digital-durometer-instructions

---

## 36. Definition of Done

- [x] Pressure cold/hot/gain getrennt
- [x] Longacre Gauge integriert
- [x] Probe-Pyrometer integriert
- [x] Messreihenfolge definiert
- [x] Einstichtiefe berücksichtigt
- [x] Temperaturinterpretation gegen Simplifizierung abgesichert
- [x] Shore-A als Reifenalter-/Vergleichswerkzeug eingeordnet
- [x] Temperaturabhängigkeit der Shore-Messung berücksichtigt
- [x] Heat Cycles aufgenommen
- [x] Reifenbild aufgenommen
- [x] Fahrerfeedback strukturiert
- [x] A/B-Testlogik definiert
- [x] Session Sheet erstellt
- [ ] exakte Longacre-Modellnummern dokumentiert
- [ ] Avon-Primärdaten für CR6ZZ recherchiert
- [ ] reale Cold-/Hot-Pressure-Daten gesammelt
- [ ] reale Pyrometer-Baseline gesammelt
- [ ] Shore-Baseline neuer/aktueller Reifen erfasst
