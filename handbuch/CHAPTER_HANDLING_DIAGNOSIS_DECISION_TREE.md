# Mustang Track Chassis Setup - Handling Diagnosis & Setup Decision Tree

**Fahrzeug:** Ford Mustang 1966 - europäische Rundstrecke  
**Version:** 0.1 - 2026-10-04  
**Status:** Fachkapitel; GitHub unverändert

## 1. Ziel

Dieses Kapitel soll verhindern, dass das Fahrzeug nach dem Schema

> **Symptom -> irgendein Bauteil verstellen**

abgestimmt wird.

Stattdessen gilt:

```text
SYMPTOM
   ↓
KURVENPHASE
   ↓
FAHREREINGABEN / RANDBEDINGUNGEN
   ↓
OBJEKTIVE DATEN
   ↓
MÖGLICHE URSACHEN EINENGEN
   ↓
HYPOTHESE
   ↓
EINE GEZIELTE ÄNDERUNG
   ↓
A/B-TEST
   ↓
ERGEBNIS
```

OptimumG weist darauf hin, dass sich aus einem Lenkprofil Balance-Tendenzen erkennen lassen, aber nicht automatisch die technische Ursache. Das ist eine zentrale Leitlinie dieses Projekts.

---

## 2. Kurve in Phasen zerlegen

Für das Projekt verwenden wir:

1. **Braking**
2. **Initial Turn-in**
3. **Entry / Trail Braking**
4. **Mid-Corner / Apex**
5. **Initial Throttle**
6. **Corner Exit**
7. **Straight / High-Speed Stability**
8. **Bumps / Kerbs / Transients**

Longacre beschreibt denselben Grundgedanken: Frühere Kurvenphasen beeinflussen die späteren. Dieses Prinzip ist auch für Rundstrecke sinnvoll, auch wenn viele konkrete Longacre-Tuningempfehlungen aus dem Oval-Racing stammen.

---

## 3. Warum "Untersteuern" zu ungenau ist

Es kann bedeuten:

- Untersteuern beim ersten Lenkeinschlag
- nur unter Trail Braking
- bei konstantem Gas am Apex
- erst beim Gasgeben
- nur in schnellen Kurven
- nur in langsamen Kurven
- erst nach mehreren Runden

Diese Fälle können völlig unterschiedliche Ursachen haben.

---

## 4. Fahrerinput und Trackbedingungen zuerst dokumentieren

Vor einer Setupänderung erfassen:

- Geschwindigkeit
- Gang
- Bremsstärke / Trail Brake
- Lenkwinkel
- Throttle-Position
- Kurvenradius
- Links-/Rechtskurve
- Kerb / Bodenwelle
- Reifenzustand
- Fuel
- Luft-/Asphalttemperatur
- Verkehr / Linie

OptimumG zeigt z. B., dass zu starke oder zu schnelle Gasannahme durch longitudinalen Lasttransfer selbst Understeer am Exit erzeugen kann.

> Nicht jedes Handlingproblem ist ein Chassisproblem.

---

## 5. Diagnosehierarchie

> **Vorgeschaltet:** Bevor eine Hypothese gebildet wird, muss die Messung reproduzierbar sein. Bind-Test nach [`CHAPTER_BIND_DIAGNOSIS.md`](CHAPTER_BIND_DIAGNOSIS.md) §6.
>
> **Stellgrößen:** Welcher Hebel wie stark wirkt und was an diesem Fahrzeug überhaupt verfügbar ist, steht in [`CHAPTER_SPRINGS_ROLL_STIFFNESS.md`](CHAPTER_SPRINGS_ROLL_STIFFNESS.md) §6.

### A. Sicherheit / Mechanik
- Spiel
- lose Bauteile
- Radlager
- Bremse hängt
- Reifen beschädigt
- Druckverlust
- Dämpferleck
- Blattfeder / Panhard / U-Bolts
- Tie Rods

### B. Reproduzierbarkeit
- tritt es mehrfach auf?
- dieselbe Kurve?
- dieselbe Phase?
- beide Richtungen?

### C. Reifen
- Druck
- Temperatur O/M/I
- Shore / Alter
- Reifenbild
- Heat Cycles

### D. Geometrie
- Ride Height
- Corner Weights
- Camber
- Castor
- Toe
- Thrust
- Bump Steer
- Ackermann

### E. Feder-/Roll-/Dämpfersystem
- Federn
- Blattfedern
- Stabilisatoren
- Dämpfer
- Bump Stops
- Panhard-Höhe

---

## 6. Brake Instability

**Symptom:** Das Auto zieht, wandert oder verlangt Lenkkorrekturen beim harten Bremsen.

### Zuerst prüfen
- Reifendruck links/rechts
- Bremswirkung links/rechts
- Radlager
- Toe
- Thrust Angle
- Bump Steer
- Cross Weight
- Ride Height links/rechts
- Reifenalter / Grip-Unterschied

### Mögliche geometrische Ursachen
- asymmetrisches Toe
- Thrust Angle
- Bump Steer beim Dive
- starke Castor-/Camber-Asymmetrie
- Hinterachse nicht square

### Nicht sofort
- mehr Toe-in
- Castor ändern
- Dämpfer verstellen

ohne gemessene Ursache.

---

## 7. Instabil beim Trail Braking

**Symptom:** Geradeausbremsen gut, Instabilität entsteht erst mit Lenkwinkel.

Prüfen:
- Trail-Brake-Intensität
- Front-Bump-Steer bei Dive + Steering
- Rear Compliance / Panhard / Blattfeder
- Bremsbalance
- Corner Weight
- Reifen-Temperatur
- Ackermann
- Dämpfertransienten

Wenn das Verhalten erst mit **Lenkwinkel + Federweg** auftritt, reicht eine reine statische Toe-Messung nicht.

---

## 8. Entry Understeer

### Prüfen
- Vorderreifen heiß/kalt?
- Hot Pressure
- Front Camber
- Total/Individual Toe
- Steering Box on-center
- Castor
- Reifenalter/Shore
- Front Ride Height
- Bump Steer nahe Nullpunkt
- Fahrerlenkrate

### Mögliche Ursachenfamilien
- Reifen nicht im Arbeitsfenster
- zu alter/harter Frontreifensatz
- ungeeignetes statisches Toe
- unpassender Camber
- Bump Steer / Compliance
- relative Vorderachsüberlastung

Mehr Toe-out kann Turn-in verbessern, aber Geradeaus- und Bremsstabilität verschlechtern. Deshalb nur kontrolliert testen.

---

## 9. Entry Oversteer

Prüfen:
- Trail Brake
- Hinterreifen-Temperatur / Druck
- Rear Ride Height
- Cross Weight
- Panhard / Hinterachslage
- Reifenalter hinten
- Bremsbalance
- Fahrer-Lenkrate

Viele Lenkkorrekturen können entweder vom Fahrer, von Instabilität oder vom Fahrzeug selbst kommen. Fahrerfeedback und Messdaten müssen zusammen gelesen werden.

---

## 10. Mid-Corner Understeer

Das Fahrzeug ist gesetzt; Bremsen weitgehend gelöst, Gas neutral oder konstant.

### Prüfen

**Reifen**
- Front O/M/I
- Rear O/M/I
- Hot Pressures
- Shore
- Reifenbild

**Alignment**
- Front Camber
- Toe
- Ackermann bei relevantem Lenkwinkel

**Balance**
- Cross Weight
- Front/Rear-Massenverteilung als Randbedingung

**Rollsystem**
- Front vs. Rear Rollsteifigkeit
- Bump Stops
- Panhard-Höhe
- Blattfeder-/Dämpferzustand

**Kinematik**
- Camber Gain
- Bump Steer
- Rollcenter

### Entscheidungslogik

Wenn Frontreifen außen deutlich überarbeitet und Reifenbild/Pyrometer passen:
-> Camber/Roll-Geometrie als Hypothese.

Wenn Temperaturen plausibel, aber Lenkwinkel ungewöhnlich hoch und Ackermann auffällig:
-> Steering Geometry untersuchen.

Wenn Problem erst nach mehreren Runden entsteht:
-> Druck/Temperatur/Reifenalter zuerst.

---

## 11. Mid-Corner Oversteer

Prüfen:
- Hinterreifen-Druck / Temperatur
- Rear Shore / Heat Cycles
- Panhard-Höhe
- Blattfeder / Dämpfer
- Rear Bump Stop
- Cross Weight
- Hinterachsposition
- Thrust
- konstantes Gas?

Ein loses Entry kann späteres Mid-Corner-Verhalten verfälschen. Frühere Phase zuerst lösen.

---

## 12. Understeer beim ersten Gasgeben

Zu schneller oder zu starker Throttle-Input kann durch Lasttransfer Vorderachsgrip reduzieren.

Prüfen:
- entsteht es exakt mit Throttle?
- Fahrerinput
- Rear Squat
- Front Droop/Bump-Steer-Verhalten
- Differential / Traktion
- Reifen
- Dämpfer

Nicht automatisch Frontfahrwerk oder Toe ändern.

---

## 13. Power Oversteer / Traktionsverlust

### Reifen
- Rear Hot Pressure
- Temperaturen
- Shore
- Alter

### Hinterachse
- Blattfeder
- Axle Wrap
- Wheel Hop
- Dämpfer
- Panhard
- Bump Stops

### Antrieb / Fahrer
- Differential
- Gasannahme
- Gang / Drehmoment
- Throttle Rate
- Lenkwinkel beim Gasgeben

---

## 14. Nervös über Kerbs / Bodenwellen

Besonders verdächtig:
- Bump Steer
- zu wenig Bump Travel
- Bump-Stop-Kontakt
- Dämpfer
- Reifen
- Radlager / Spiel
- Fahrwerksreibung
- Panhard Arc / Bind
- Blattfeder-/Buchsenbindung

Wenn das Problem klar mit Vertikalbewegung gekoppelt ist, bekommt Kinematik höhere Diagnosepriorität.

---

## 15. Nur Linkskurven oder nur Rechtskurven problematisch

Zuerst prüfen:
- Reifen links/rechts
- Druck
- Shore
- Corner Weights
- Cross
- Ride Height
- Camber L/R
- Castor L/R
- Bump Steer L/R
- Ackermann L/R
- Panhard / Hinterachsposition
- Thrust
- Fahrwerksbindung

Eine starke Links-/Rechts-Asymmetrie wird nicht vorschnell mit absichtlich asymmetrischen Alignment-Zielen "repariert".

---

## 16. Problem wird mit jeder Runde stärker

Priorität:
1. Hot Pressure
2. O/M/I Temperaturen
3. Reifenalter / Shore
4. Brake Drag / Temperatur
5. Dämpfer-Fade
6. Fuel-Veränderung
7. Fahrer

Das deutet eher auf einen zustands-/temperaturabhängigen Effekt als auf einen statischen Geometriewert allein.

---

## 17. Nur High-Speed problematisch

Unterscheiden:
- mechanische Balance
- Aero
- Reifen
- Dämpfer
- Bottoming
- Ride Height
- Lenkempfindlichkeit

Racecar Engineering zeigt, dass dieselbe Setupänderung Low- und High-Speed unterschiedlich beeinflussen kann. Geschwindigkeit und Kurventyp werden deshalb getrennt dokumentiert.

---

## 18. Nur Low-Speed problematisch

Priorisieren:
- Ackermann
- mechanischer Grip
- Differential
- Steering Geometry
- Reifen
- Throttle
- Rollsteifigkeit

Aero spielt hier deutlich weniger Rolle.

---

## 19. Strukturierter Fahrerfragebogen

Für das Projekt bekommt jeder Punkt eine 1-5-Skala:

| Kriterium | 1 | 3 | 5 |
|---|---|---|---|
| Steering response | träge | neutral | sehr direkt |
| Stability | nervös | akzeptabel | sehr stabil |
| Balance | stark US/OS | leicht | neutral |
| Breakaway | abrupt | mittel | progressiv |
| Traction | gering | mittel | hoch |
| Confidence | gering | mittel | hoch |

Zusätzlich Freitext.

---

## 20. Einheitliche Symptomcodes

Statt nur "US" / "OS":

- `ENTRY-US`
- `ENTRY-OS`
- `MID-US`
- `MID-OS`
- `POWER-US`
- `POWER-OS`
- `HIGH-SPEED-US`
- `HIGH-SPEED-OS`
- `BUMP-INSTABILITY`
- `BRAKE-INSTABILITY`

Damit werden Setup-Logs später durchsuchbar.

---

## 21. Setup-Levers sind Hypothesen, keine Rezepte

### Alignment
- Camber
- Castor
- Toe
- Ackermann
- Bump Steer

### Balance
- Cross Weight
- Ride Height
- reale Massenposition

### Front
- Spring
- Anti-roll bar
- Damping
- Bump Stop

### Rear
- Leaf spring
- Rear anti-roll bar, falls vorhanden
- Panhard height
- Damping
- Bump Stop

### Tires
- Cold Pressure
- Tire set / age

Eine Änderung wird nur gewählt, wenn Messdaten einen plausiblen Zusammenhang herstellen.

---

## 22. Change Impact Sheet

Vor jeder Änderung:

```text
Symptom:
Phase:
Kurven:
Daten:

Hypothese:
Warum?

Geplante Änderung:

Erwartete Primärwirkung:
Erwartete Nebenwirkung:
Welche frühere Phase könnte verschlechtert werden?

Messgröße für Erfolg:
Abbruchkriterium:
```

---

## 23. Beispiel: Mid-Corner Understeer

```text
Symptom:
MID-US in langen Rechtskurven

Daten:
Temperaturprofil
Hot Pressure
Camber
Ackermann
Cross
Reifenalter

Hypothese:
Außenrad verliert Contact Patch durch unzureichenden dynamischen Camber

Test:
Camber symmetrisch um 0,25° negativer

Erwartung:
weniger Lenkwinkel / besserer Mid-Corner Grip

Nebenwirkung:
möglicherweise schlechtere Bremsfläche und stärkere Innenkantenbelastung

Validierung:
gleiche Kurven + Pyrometer + Fahrerfeedback + Rundenzeit
```

Das ist eine Methodik, kein automatischer Setupvorschlag.

---

## 24. Beispiel: Instabil über Kerbs

```text
Symptom:
BUMP-INSTABILITY

Daten:
tritt nur bei Vertikalbewegung auf
statisches Toe korrekt
Radlager spielfrei

Hypothese:
Bump-Steer-Kurve im relevanten Federweg ungünstig

Test:
Bump-Steer-Kurve messen

Noch keine Änderung.

Erst Messung -> dann Tie-Rod-Geometrie.
```

---

## 25. Stop-Regeln

Setup-Session stoppen bei:

- mechanischem Spiel
- Reifenschaden
- Druckverlust
- Bremsproblem
- ungewöhnlichen Geräuschen
- losen U-Bolts / Suspension Hardware
- nicht reproduzierbaren Messdaten

Dann wird nicht weiter "getuned".

---

## 26. Früheste fehlerhafte Kurvenphase zuerst

Wenn Entry schlecht ist und Mid-Corner ebenfalls schlecht:

> zuerst Entry lösen.

Der Fahrer kann durch ein instabiles Entry bereits eine Linie oder Lenkeingabe erzwingen, die das spätere Verhalten verfälscht.

---

## 27. Daten und Fahrerfeedback

**Fahrer ohne Daten:** kann Ursache und Symptom verwechseln.  
**Daten ohne Fahrer:** zeigen nicht immer, wie kontrollierbar und vertrauenswürdig sich das Auto anfühlt.

> Fahrerfeedback formuliert das Problem; Messdaten grenzen die Ursache ein.

---

## 28. Minimaler Datensatz pro Setupentscheidung

Keine relevante Änderung ohne:

- Session-ID
- Reifen-ID
- Cold/Hot Pressure
- relevante Pyrometerdaten
- aktuelle Alignment-Baseline
- Ride Height
- relevante Radlastdaten
- Fahrerfeedback mit Kurvenphase
- exakt dokumentierte Änderung

---

## 29. Entscheidungsmatrix

| Symptom | Erst prüfen | Danach prüfen | Nicht sofort ändern |
|---|---|---|---|
| Brake instability | Bremsen, Druck, Toe, Thrust | Bump Steer, Cross | Federn |
| Entry understeer | Reifen, Toe, Fahrerinput | Camber, Castor, Bump | Panhard |
| Entry oversteer | Trail Brake, Rear Tire | Cross, Dämpfer, Rear Geo | Front Toe blind |
| Mid understeer | Front Temp/Druck | Camber, Ackermann, Roll Balance | mehrere Dinge |
| Mid oversteer | Rear Temp/Druck | Rear Roll, Panhard, Cross | Toe blind |
| Power understeer | Throttle rate | Weight Transfer, Front Droop | Camber blind |
| Power oversteer | Rear Tire, Throttle | Leaf/Damper/Diff | Front Alignment |
| Bump instability | Spiel, Reifen | Bump Steer, Travel | statisches Toe |
| L/R asymmetry | Reifen, Corner Weight | Alignment, Thrust, Panhard | asymmetrische Targets |
| Degrades with laps | Hot Pressure/Temp | Tire Age, Brakes, Dampers | Geometry zuerst |

---

## 30. Interaktive Website-Idee

Dieses Kapitel eignet sich später für einen Diagnose-Assistenten:

```text
Was macht das Auto?
      ↓
[Braking] [Entry] [Mid] [Exit] [Bumps]

Welche Tendenz?
      ↓
[Understeer] [Oversteer] [Instability]

Nur wann?
      ↓
[Low speed] [High speed] [L/R] [hot tires]

Ergebnis:
- zuerst zu prüfende Messwerte
- mögliche Ursachen
- relevante Kapitel
- KEINE automatische Setupanweisung
```

---

## 31. Quellen

### OptimumG - Data Analysis, Vehicle Setup and Common Misconceptions
https://optimumg.com/data-analysis-vehicle-setup-and-common-misconceptions-qa-series-ep-3/

### OptimumG - On the Throttle
https://optimumg.com/on-the-throttle/

### OptimumG - Automotive Services / subjective evaluation
https://optimumg.com/services/automotive-services/

### Longacre - Chassis Dynamics
https://longacreracing.com/pages/chassis-dynamics

**Hinweis:** konkrete Oval-Tuningregeln werden nicht ungeprüft übernommen.

### Racecar Engineering - Vehicle Handling Model
https://www.racecar-engineering.com/digiissues/raracsn22.pdf

---

## 32. Definition of Done

- [x] Kurvenphasen definiert
- [x] Symptom und Ursache getrennt
- [x] Fahrerinput als Variable aufgenommen
- [x] Reifen-/Geometrie-/Balance-Hierarchie
- [x] Brake-/Entry-/Mid-/Exit-Diagnose
- [x] Kerb/Bump-Diagnose
- [x] Links/Rechts-Asymmetrie
- [x] temperaturabhängige Probleme
- [x] Low-/High-Speed getrennt
- [x] Hypothesentest
- [x] Stop-Regeln
- [x] Decision Matrix
- [x] interaktive Website-Idee
- [ ] reale Fahrerbewertungsskala kalibrieren
- [ ] Dämpfer-/Stabi-Daten des Mustang ergänzen
- [ ] Setup-Levers erst nach Hardwareinventar quantifizieren
