# Mustang Track Chassis Setup — Vorderachse: Einstellmechanik UCA und LCA

**Dokumentrolle:** Fachkapitel — Einstellmöglichkeiten Castor/Camber und ihre Kopplung
**Version:** 0.2
**Datum:** 2026-10-05
**Status:** Shim-Mechanik aus Ford-Primärquelle belegt; LCA-Kit aus Herstelleranleitung belegt
**Bezug:** Fahrzeugdaten [`00_PROJECT.md`](00_PROJECT.md) · Konventionen [`CONVENTIONS.md`](CONVENTIONS.md) · Ablauf [`02_WORKFLOW.md`](02_WORKFLOW.md)

---

## 1. Warum dieses Kapitel eigenständig ist

`CHAPTER_FRONT_GEOMETRY_CAMBER_CASTER_KPI` erklärt, **was** Camber, Castor und KPI sind und **wie** sie gemessen werden.

Dieses Kapitel erklärt ausschließlich, **wie sie an diesem Fahrzeug verstellt werden**.

Der Grund für die Trennung: Das Fahrzeug hat **vier** Verstellebenen, die auf dieselben zwei Winkel wirken.

| # | Ebene | Bauteil | Wirkt auf | Quellenklasse |
|---|---|---|---|---|
| 1 | oben, Länge | **SoT Tubular UCA**, Heim-Gelenke | Camber **und** Castor | **A** — SoT Produktinfo |
| 2 | oben, Lage | Shims an der UCA-Querachse | Camber und/oder Castor | **A** — Ford Shop Manual 1966 |
| 3 | unten | **SoT LCA Camber Kit** | Camber | **A** — SoT Einbauanleitung |
| 4 | vorn | Adjustable Strut Rods | Castor | — |

Alle Primärquellen liegen gespiegelt in `docs/quellen/` vor. Die Angaben in diesem Kapitel sind daraus belegt, nicht abgeleitet.

> **Hardwarestand:** Das Fahrzeug hat laut [`00_PROJECT.md`](00_PROJECT.md) §3 den **Street or Track Tubular +Caster UCA (`SOT-UCA65-66`)**. Damit entfällt die in Version 0.1 dieses Kapitels offene Frage nach dem UCA-Typ — und es kommt eine Verstellebene hinzu, die der Serien-UCA nicht hat.

---

## 2. Ford-Serienmechanik: Shims an der UCA-Querachse

### 2.1 Was genau gemeint ist

Beim 64½–66 Mustang ist der obere Querlenker nicht direkt am Federbeindom verschraubt. Dazwischen sitzt eine **Querachse** (*inner shaft of the front suspension upper arm*), die mit **zwei Schrauben** an der Karosserie befestigt ist — eine vorn, eine hinten in Fahrtrichtung.

Zwischen Querachse und Karosserie liegen **Blechscheiben** (Shims). Das sind die einzigen serienmäßigen Alignment-Einsteller der Vorderachse.

Ford beschreibt das so:

> „Caster and camber can be adjusted by **removing or installing shims between the inner shaft of the front suspension upper arm and the underbody** (Fig. 39). Both caster and camber adjustments can be made at the same time by loosening the nuts on the two bolts that fasten the inner shaft to the underbody."
> — Ford Shop Manual 1966, Group 20, Maintenance Operations, S. 20-17

```text
Draufsicht Federbeindom, linke Fahrzeugseite

        Fahrtrichtung ↑

   ┌───────────────────────────┐
   │   ○ ← vordere Schraube    │
   │     [Shim-Paket vorn]     │   Karosserie / Federbeindom
   │  ═══ UCA-Querachse ═══    │
   │     [Shim-Paket hinten]   │
   │   ○ ← hintere Schraube    │
   └───────────────────────────┘
                 │
          oberes Kugelgelenk
```

Es gibt **vier unabhängige Shim-Pakete** am Fahrzeug: vorn/hinten × links/rechts. Das `TEMPLATE_ALIGNMENT_SHEET` bildet genau das ab.

### 2.2 Castor — Ford-Originalregel

> **„To adjust caster, remove or install shims at either the front bolt or the rear bolt.**
> The **removal of shims at the front bolt** or the **installation of shims at the rear bolt** will cause the **upper ball joint to move forward**. The **removal of shims at the rear bolt** or the **installation of shims at the front bolt** will cause the ball joint to **move rearward**.
> A **1/32-inch change of shim thickness at either bolt will change the caster angle approximately 1/2°**. The **difference between the shim stack thickness at the two bolts should not exceed 1/16-inch**."
> — Ford Shop Manual 1966, S. 20-18

Daraus in Tabellenform:

| Maßnahme | oberes Kugelgelenk | Castor |
|---|---|---|
| Shims **vorn entfernen** | wandert **nach vorn** | wird **negativer** |
| Shims **hinten hinzufügen** | wandert **nach vorn** | wird **negativer** |
| Shims **vorn hinzufügen** | wandert **nach hinten** | wird **positiver** |
| Shims **hinten entfernen** | wandert **nach hinten** | wird **positiver** |

> **Begründung der Vorzeichen:** Castor ist positiv, wenn die Lenkachse oben nach hinten geneigt ist ([`CONVENTIONS.md`](CONVENTIONS.md) §5). Das obere Kugelgelenk nach hinten zu bewegen, neigt die Achse oben nach hinten → mehr positiver Castor.

**Belegte Größenordnungen:**

| Größe | Ford-Angabe |
|---|---|
| Wirkung | **1/32" an einem Bolzen ≈ 1/2° Castor** |
| Grenze | **max. 1/16" Differenz** zwischen vorderem und hinterem Paket |
| Shim-Dicken | 1/32" und 1/8" |

Die Differenzgrenze von 1/16" entspricht damit rund **±1° Castor-Verstellbereich** über Shims allein. Mehr ist mit dem Serienteil nicht vorgesehen — alles darüber muss über Strut Rods oder andere UCA-Geometrie kommen.

### 2.3 Camber — Ford-Originalregel

> **„To adjust camber, remove or install equal shim thicknesses at both bolts.**
> The **removal of equal shims at both bolts will move the upper ball joint inward**. The **installation of equal shims at both bolts will move the ball joint outward**.
> A **1/16-inch change of shim thickness at both bolts will change the camber angle 1/3°**. The **total shim stack thickness at each bolt should not exceed 9/16 inch**."
> — Ford Shop Manual 1966, S. 20-18

| Maßnahme | oberes Kugelgelenk | Camber |
|---|---|---|
| Shims **an beiden Bolzen gleich entfernen** | wandert **nach innen** | wird **negativer** |
| Shims **an beiden Bolzen gleich hinzufügen** | wandert **nach außen** | wird **positiver** |

**Belegte Größenordnungen:**

| Größe | Ford-Angabe |
|---|---|
| Wirkung | **1/16" an beiden Bolzen ≈ 1/3° Camber** |
| Grenze | **max. 9/16" Gesamtpaket je Bolzen** |

> **Damit ist auch die Richtungsfrage aus Version 0.1 dieses Kapitels beantwortet:** Shims **entfernen** → Kugelgelenk nach innen → **negativer** Camber. Das deckt sich mit der Street-or-Track-Aussage, dass Serienfahrzeuge negativen Camber durch Entfernen von Shims erzeugen.

### 2.4 Die vier Grundoperationen

Aus den beiden Ford-Regeln folgt die vollständige Mechanik:

| Operation | Castor | Camber |
|---|---|---|
| beide Bolzen gleich **hinzufügen** | — | **+1/3° je 1/16"** |
| beide Bolzen gleich **entfernen** | — | **−1/3° je 1/16"** |
| vorn **hinzufügen**, hinten **entfernen** (gleiche Dicke) | **+1° je 1/32"** | — |
| vorn **entfernen**, hinten **hinzufügen** (gleiche Dicke) | **−1° je 1/32"** | — |
| nur an **einem** Bolzen ändern | halbe Castorwirkung | halbe Camberwirkung |

**Das ist der zentrale Punkt dieses Kapitels:** Die Kopplung von Castor und Camber ist **nicht zwangsläufig**. Wer gegenläufig shimt, verstellt nur Castor. Wer gleichsinnig shimt, verstellt nur Camber.

Die bisherige Formulierung im Konzept — „Castor und Camber sind über die serienmäßige Shim-Logik gekoppelt" — beschreibt nur den Fall der einseitigen Änderung. Das ist der Fall, den man vermeiden sollte, wenn man beide Größen kontrolliert einstellen will.

> **Anmerkung zur bisherigen Global-West-Zuschreibung:** Die in der Altfassung genannten Aussagen („Shim vorn hinzufügen → mehr positiver Castor", „Shim hinten entfernen → mehr positiver Castor") sind **inhaltlich korrekt** und stimmen mit dem Ford Shop Manual überein. Die Zuschreibung an Global West ist jedoch entbehrlich — Ford ist hier die Primärquelle und nennt zusätzlich die Größenordnungen und Grenzwerte, die bei Global West fehlen.

### 2.5 Ford-Toleranzen für die Symmetrie

Ebenfalls belegt und für ein Track-Setup relevant:

> „The maximum difference between both front wheel **caster** angles should not exceed 1/2°. However, a difference of not more than **1/4° is preferred**."
> „The maximum difference between both front wheel **camber** angles should not exceed 1/2°. However, a difference of not more than **1/4° is preferred**."
> — Ford Shop Manual 1966, S. 20-17

Für unseren symmetrischen Rundstreckenansatz ([`CHAPTER_FRONT_GEOMETRY`](CHAPTER_FRONT_GEOMETRY_CAMBER_CASTER_KPI.md) §14) ist 1/4° die sinnvolle Obergrenze, nicht 1/2°.

### 2.6 Weitere belegte Ford-Vorgaben

| Thema | Ford-Angabe |
|---|---|
| **Reihenfolge** | „Toe-in should only be checked and adjusted **after the caster and camber have been adjusted** to specifications." |
| **Turning Angle** | „The turning angle **cannot be adjusted directly** because it is a result of the combination of caster, camber, and toe-in adjustments and should therefore be measured **only after these adjustments** have been made. If the turning angle does not measure to specifications, **check the spindle or other suspension parts for a bent condition**." |
| **Verbot** | „**Do not attempt to adjust the front wheel alignment by bending the suspension or steering parts.**" |
| **Shim-Stapelung** | „The 1/32-inch shims should be placed **against the fender housing sheet metal or between the 1/8-inch shims**." |

Die Turning-Angle-Aussage stützt das, was `CHAPTER_TOE_ACKERMANN_THRUST` §15 inhaltlich sagt: Ackermann ist keine Einstellgröße, sondern ein **Diagnoseergebnis**. Weicht es ab, ist ein Bauteil verbogen.

### 2.7 Grenzen der Shim-Methode

Drei harte Grenzen, alle belegt:

| Grenze | Quelle | Wert |
|---|---|---|
| Castor-Differenz vorn/hinten | Ford | max. 1/16" → ca. ±1° |
| Gesamtpaket je Bolzen | Ford | max. 9/16" |
| negativer Camber nach unten | konstruktiv | **wenn keine Shims mehr da sind, ist Schluss** |

Street or Track beschreibt die letzte Grenze als Begründung für ihr Kit:

> „65-66 cars in stock form had **no adjustment on the lower control arm** leaving all camber adjustments down to shortening the upper arm by removing shims. **You can only take out so many shims and then you are stuck with whatever maximum negative camber figure you get!**"
> — Street or Track, Produktbeschreibung SOT-LCACK65-66

> **Konsequenz für dieses Fahrzeug:** Genau wegen dieser Grenze wurde das LCA Camber Kit verbaut.

---

## 3. Das Street or Track LCA Camber Kit

### 3.1 Identifikation

| Merkmal | Angabe | Status |
|---|---|---|
| Hersteller | Street or Track LLC | Projektangabe |
| Bezeichnung | Lower Control Arm Camber Kit for 65-66 Mustangs | Projektangabe |
| Teilenummer | `SOT-LCACK65-66` (auch `STLCACK65-66`) | Projektangabe |
| Listenpreis | $129.00 (Stand 10/2026) | Projektangabe |
| Einbauanleitung | `docs/quellen/A-10-sot-lca-camber-kit-instructions.pdf` | **beschafft** |
| Einbau am Fahrzeug | vorhanden | Projektangabe, **Plattennummern unbekannt** |

### 3.2 Wirkprinzip — aus der Einbauanleitung

Das Kit ersetzt die feste Bohrung der inneren LCA-Anlenkung durch ein **Langloch mit nummerierten Platten**.

Einbau laut Herstelleranleitung (gekürzt):

1. LCA und Motorquerträger ausbauen
2. Plattenwiege mit der **Platte #1** über der Serienbohrung anschrauben — *„The #1 plate represents the stock location so this ensures the plate cradle is centered over the stock hole"*
3. Schlitz **parallel zum Boden** ausrichten, heften
4. Platte #1 und Schraube entfernen, Wiege verschweißen
5. Serienbohrung zum Langloch aufarbeiten (Körnen, 1/8" Vorbohrungen, Hartmetallfräser) — *„Be careful not to grind any metal vertically"*
6. Blankes Metall lackieren
7. *„Align the car using the **numbered plates in different configurations** until you achieve your desired camber figure"*

Daraus folgen die entscheidenden Eigenschaften:

| Eigenschaft | Angabe | Quelle |
|---|---|---|
| Verstellbereich | **±3/8" (±9,5 mm)** gegenüber Serienposition | Produktbeschreibung |
| Verstellung | **diskret** über nummerierte Platten, nicht stufenlos | Einbauanleitung |
| Nullposition | **Platte #1 = Serienposition** | Einbauanleitung |
| Fixierung | formschlüssig über Vierkant-Platten | Produktbeschreibung |
| Bewegungsrichtung | **nur horizontal** — Langloch bewusst nicht vertikal | Einbauanleitung |
| Einbau | geschweißt, Material abtragend — **irreversibel** | Einbauanleitung |

**Zwei Details, die operativ wichtig sind:**

- **„Platte #1 = Serienposition"** ist die Referenz für die Dokumentation. Die aktuelle Plattenkonfiguration am Fahrzeug ist damit eindeutig beschreibbar, sobald sie abgelesen wurde.
- **„Nicht vertikal ausschleifen"** — die Höhe des inneren LCA-Anlenkpunkts darf sich nicht ändern. Sie bestimmt Roll Center und Bump Steer. Eine vertikale Aufweitung wäre ein nicht korrigierbarer Fehler.

### 3.3 Warum das geometrisch anders wirkt als ein UCA-Shim

Beide verändern Camber, aber an unterschiedlichen Enden des Radträgers.

```text
Frontansicht, schematisch

   UCA-Verstellung (Shims)         LCA-Verstellung (Camber Kit)

   ╳ ←→ oberer Punkt wandert       ○    oberer Punkt bleibt
   │                               │
   │  Rad                          │  Rad
   │                               │
   ○    unterer Punkt bleibt       ╳ ←→ unterer Punkt wandert
```

| Größe | UCA-Shims | LCA Camber Kit |
|---|---|---|
| **Camber statisch** | ja (1/3° je 1/16") | ja |
| **Castor** | ja, bei gegenläufiger Änderung | **nein** |
| **KPI / SAI** | ändert sich gegensinnig zum Camber | ändert sich **gleichsinnig** zum Camber |
| **Spurweite** | gering | **bis ±9,5 mm je Rad** |
| **Roll Center** | gering | **relevant** |
| **Camber Gain** | über wirksame UCA-Länge | über LCA-Geometrie |

**Die beiden sind keine austauschbaren Wege zum selben Camberwert.** Gleicher statischer Camber, unterschiedliche Fahrzeuggeometrie.

> **Noch offen:** Welche Plattennummer welcher Richtung entspricht, geht aus der Anleitung nicht hervor — sie nennt nur „#1 = stock". Kinematisch gilt: LCA-Anlenkpunkt **nach innen** → unteres Kugelgelenk nach innen → Radunterkante nach innen → **positiver** Camber; nach außen → negativer Camber. Die Zuordnung Plattennummer ↔ Richtung ist am Fahrzeug zu bestimmen (§7.1).

### 3.4 Das Herstellerbeispiel — und was es wirklich zeigt

Street or Track dokumentiert an einem eigenen 66er Testfahrzeug:

> „When combined with a set of our Tubular Lower Control Arms and a Lower Control Arm Camber Kit we were able to achieve **over −5 degrees camber** with the bearing threaded all the way in and the arm bolted straight to the shock tower on our 66 Mustang test car. **We then left the UCA bolted to the tower and used the Lower Control Arm Camber Kit to pull the LCA in** so we could get our track alignment camber setting of **−2.75 degrees**. Combined with our Adjustable Strut Rods we set in **+5 degrees of caster**."
> — Street or Track, Produktbeschreibung SOT-UCA65-66

Die Arbeitsreihenfolge ist aufschlussreich:

1. UCA **ohne Shims** direkt am Dom → maximaler negativer Camber (über −5°)
2. Camber mit dem **LCA-Kit** auf −2,75° **zurückgenommen**
3. Castor **separat** über Strut Rods auf +5°

Also nicht „Camber mit Shims einstellen", sondern Shims weglassen und über den LCA zurückregeln. Vorteil: steifste mögliche Anbindung, reproduzierbarer Ausgangspunkt.

**Aber:** Dieses Beispiel gilt für ein Fahrzeug mit **SOT Tubular UCA** (längenverstellbar über Heim-Gelenke) **und SOT Tubular LCA**. Das ist eine dritte Verstellebene, die unser Fahrzeug nach aktuellem Kenntnisstand nicht hat.

> **−2,75° / +5° ist damit kein übertragbarer Zielwert, sondern das Ergebnis einer anderen Hardwarekonfiguration.** Es bleibt eine Referenz für die Größenordnung des Machbaren.

### 3.5 Der SoT Tubular UCA als vierte Verstellebene

Das Fahrzeug hat den **`SOT-UCA65-66`**. Dieser Querlenker ist über **Heim-Gelenke mit Gewinde** längenverstellbar — eine Verstellmöglichkeit, die der Serien-UCA nicht besitzt.

**Auslieferungszustand laut Hersteller:**

> „These arms are shipped with **3 degrees of positive caster dialed into the adjustable heim bearings**. More caster is achievable by threading in or out the heim bearings. **Track width can also be adjusted.**"
> „Shipped with the **front bearing 3 turns further out than the rear**. This adds approx. **+3 degrees of positive caster** to the spindle when installed before having to shim the front bolt or shorten the strut rod."
> — Street or Track, SOT-UCA65-66

Daraus folgt die Wirkmechanik:

| Verstellung | Wirkung |
|---|---|
| **beide** Heim-Gelenke gleich **hineindrehen** → Arm kürzer | mehr **negativer Camber** |
| **beide** gleich **herausdrehen** → Arm länger | mehr **positiver Camber** |
| **vorderes** weiter heraus als hinteres | mehr **positiver Castor** |
| Auslieferungszustand | vorn 3 Umdrehungen weiter heraus ≈ **+3° Castor** |

Das ist dieselbe Logik wie bei den Shims — nur über Gewinde statt über Blechscheiben, und mit größerem Bereich.

**Die zentrale Herstellerregel:**

> „We didn't want to use a barrel adjuster to change the arm's length because having arms at **different lengths would mean the pivot points wouldn't be equal side to side. This would result in different camber curves left and right.** … By adjusting the length of the arms to get the correct alignment, inevitably you'll end up with different length arms and thus a different camber curve on each side of the vehicle. **This is only beneficial for your alignment guy, not your car's handling.**"
> — Street or Track, SOT-UCA65-66

> **Projektregel:** **Beide UCA müssen gleich lang sein.** Camber wird über das **LCA Camber Kit** eingestellt, nicht über unterschiedliche UCA-Längen. Die UCA-Länge ist eine *Grundeinstellung des Fahrzeugs*, keine Alignment-Schraube.

SoT verweist für die Begründung auf Bob Bolles, *Stock Car Setup Secrets* (ISBN 1557884013).

**Zwei weitere belegte Nebenwirkungen:**

| Thema | Herstellerangabe |
|---|---|
| Reifenfreigängigkeit | „a shorter UCA also **increases tire clearance**" — mit kurzem UCA + LCA-Kit passt ein 245/45/17 (mit gebördeltem Kotflügel) |
| Castor über UCA statt Strut Rod | „the front heim bearing can be un-threaded further than the rear. This dials in positive caster **so the strut rod doesn't have to be as short**, giving more tire clearance to the front valance" |

**Noch zu erfassen:**

- **Cross-Shaft-Variante:** Der UCA ist in zwei Ausführungen lieferbar — *Standard* (Shelby Drop muss gebohrt werden) und *Dropped* (Drop baulich eingearbeitet, kein Bohren). Welche verbaut ist, bestimmt die reale UCA-Innenlagerposition und damit Camber Gain und Roll Center.
- **Heim-Gelenk-Position** vorn/hinten je Seite, in Umdrehungen oder Gewindelänge
- ob beide Arme tatsächlich gleich lang sind (Projektregel oben)
- **LCA-Typ:** Serien-LCA oder SoT Tubular (`SOT-LCA6566`) — das SoT-Track-Beispiel nutzt den Tubular LCA

---

## 4. Die dritte Ebene: Adjustable Strut Rods

Der Strut Rod stützt den LCA nach vorn ab. Seine Länge bestimmt die **Längsposition des unteren Kugelgelenks** — und damit Castor.

| Maßnahme | Primärwirkung | Nebenwirkung |
|---|---|---|
| Strut Rod **kürzer** | mehr positiver Castor | Rad wandert **nach vorn** — Freigängigkeit prüfen |
| Strut Rod **länger** | weniger positiver Castor | Rad wandert nach hinten |

Street or Track bestätigt die Kopplung:

> „To gain even more caster and tire to front fender clearance, the front heim bearing can be un-threaded further than the rear bearing. This dials in positive caster **so the strut rod doesn't have to be as short** giving more tire clearance to the front valance if using a large tire."

Castor über UCA-Geometrie zu erzeugen **schont also die Freigängigkeit**. Bei 225er Reifen auf 15×7 ist das ein realer Gesichtspunkt.

---

## 5. Vollständige Wirkungsmatrix

| Maßnahme | Castor | Camber | KPI | Spurweite | Radpos. längs | Grenze / Hinweis |
|---|---|---|---|---|---|---|
| **UCA Heim beide gleich** ± | — | **voll** | gegensinnig | **ja** | — | *Grundeinstellung, nicht Alignment-Schraube* |
| **UCA Heim vorn ≠ hinten** | **voll** | gering | gering | gering | — | Auslieferung: 3 Umdr. ≈ +3° |
| Shims **beide gleich** ± | — | **1/3° je 1/16"** | gegensinnig | gering | — | max. 9/16" je Bolzen |
| Shims **gegenläufig** | **1/2° je 1/32"** | — | gering | — | — | max. 1/16" Differenz ≈ ±1° |
| Shim **nur ein Bolzen** | halb | halb | ja | gering | — | erzeugt Kopplung — vermeiden |
| **LCA Camber Kit** | **—** | **voll** | gleichsinnig | **bis ±9,5 mm** | — | ±3/8", diskrete Stufen |
| **Strut Rod** ± | **voll** | gering | gering | — | **ja** | Freigängigkeit vorn |
| Ride Height | ja | ja | gering | ja | gering | siehe Ride-Height-Kapitel |

**Die vier Zeilen, auf die es ankommt:**

| Zeile | Rolle | Bereich |
|---|---|---|
| UCA Heim beide gleich | **Grundeinstellung Camber** — einmalig, dann fest | groß |
| LCA Camber Kit | **Camber grob** im Betrieb | ±3/8", diskret |
| Shims gegenläufig | **Castor fein** | ±1° |
| Strut Rod | **Castor grob** | groß, Freigängigkeit beachten |

Castor und Camber sind an diesem Fahrzeug damit **vollständig getrennt einstellbar**.

### Warum nicht die UCA-Länge als Camber-Regler?

Weil unterschiedlich lange Arme links und rechts **unterschiedliche Camberkurven** erzeugen (§3.5). Der statische Camber wäre dann zwar symmetrisch, das dynamische Verhalten in Links- und Rechtskurven aber nicht. Das ist für ein Rundstreckenfahrzeug der schlechtere Kompromiss.

Die UCA-Länge wird deshalb **einmal** festgelegt — so kurz wie sinnvoll, für Camber Gain und Reifenfreigängigkeit — und danach nicht mehr als Einstellschraube benutzt.

---

## 6. Einstellstrategie für dieses Fahrzeug

### 6.1 Rollenverteilung

| Regler | Aufgabe | Häufigkeit | Begründung |
|---|---|---|---|
| **UCA Heim-Gelenke** | Grundeinstellung Camberbereich | **einmalig** | gleiche Länge L/R zwingend — sonst ungleiche Camberkurven |
| **LCA Camber Kit** | Camber grob | je Setup | großer Bereich, entkoppelt von Castor, formschlüssig |
| **UCA-Shims gleichsinnig** | Camber fein, L/R-Abgleich | je Setup | 1/3° je 1/16" — feiner als die LCA-Plattenstufen |
| **UCA-Shims gegenläufig** | Castor fein (±1°) | je Setup | Ford-Verfahren, belegte Größenordnung |
| **Strut Rods** | Castor grob | selten | wenn Shim-Bereich nicht reicht; Freigängigkeit beachten |

**Das Street-or-Track-Verfahren im Original** (§3.4): UCA ohne Shims direkt am Dom, Heim-Gelenke ganz hineingedreht → maximaler negativer Camber (über −5°), dann mit dem LCA-Kit auf den Zielwert zurück. Vorteil: steifste Anbindung, reproduzierbarer Ausgangspunkt. Für dieses Fahrzeug eine ernsthafte Option, weil die Hardware dieselbe ist.

### 6.2 Vorgeschlagene Reihenfolge

Eingebettet in [`02_WORKFLOW.md`](02_WORKFLOW.md) Phase 6 bzw. Phase 13:

```text
0.  Hardware identifizieren (UCA-Typ!)
    Istzustand dokumentieren: Shim-Dicken, LCA-Plattennummern,
    Strut-Rod-Längen — je Seite
         ↓
1.  Ride Height und Race-Ready-Zustand stabil
         ↓
2.  CASTOR grob
    – Strut Rods, falls großer Sprung nötig
    – Ziel: links/rechts innerhalb 1/4° (Ford-Vorgabe)
         ↓
3.  CAMBER grob
    – LCA Camber Kit, Plattenkonfiguration
    – Castor bleibt dabei unberührt
         ↓
4.  CASTOR fein
    – UCA-Shims gegenläufig, 1/32" ≈ 1/2°
    – Differenzgrenze 1/16" einhalten
         ↓
5.  CAMBER fein
    – UCA-Shims gleichsinnig, 1/16" ≈ 1/3°
    – Gesamtpaket je Bolzen max. 9/16"
         ↓
6.  Castor und Camber beide Seiten KONTROLLMESSEN
    Symmetrie ≤ 1/4° anstreben
         ↓
7.  KPI messen und dokumentieren (Diagnosewert)
         ↓
8.  Full Lock / Freigängigkeit prüfen
         ↓
9.  BUMP STEER prüfen
    – zwingend nach jeder LCA-Kit-Änderung
         ↓
10. TOE final
    (Ford: „only after caster and camber have been adjusted")
         ↓
11. Turning Angle / Ackermann messen
    (Ford: Diagnose, nicht Einstellgröße)
```

**Schritt 9 ist nicht optional.** Das LCA Camber Kit verschiebt den inneren LCA-Anlenkpunkt quer. Die Spurstange bleibt, wo sie ist. Damit ändert sich das Verhältnis der Bewegungsbahnen — also genau die Ursache von Bump Steer (`CHAPTER_BUMP_STEER` §2).

### 6.3 Dokumentationspflicht — Stellgröße und Messgröße getrennt

**Grundsatz:** Eine Plattennummer ist **keine Gradzahl**. Eine Shim-Dicke ist **keine Gradzahl**. Es sind zwei verschiedene Größen, und beide müssen erfasst werden:

| | Was es ist | Warum es gebraucht wird |
|---|---|---|
| **Stellgröße** | Plattennummer, Shim-Dicke, Umdrehungen | **Reproduzierbarkeit** — nur damit lässt sich ein Zustand wiederherstellen |
| **Messgröße** | gemessener Winkel in Grad | **Wirkung** — nur damit lässt sich bewerten, ob die Änderung das Gewünschte bewirkt hat |

Das Verhältnis zwischen beiden ist **nicht linear und nicht fahrzeugübergreifend gültig**. Es hängt ab von Ride Height, UCA-Länge, Shelby-Drop-Ausführung, Reifendurchmesser und Fertigungstoleranzen. Es kann links und rechts unterschiedlich sein.

> Wer nur die Plattennummer notiert, kann den Zustand wiederherstellen, weiß aber nicht, was er bewirkt. Wer nur den Winkel notiert, weiß was herauskam, kann es aber nicht reproduzieren. **Erst beides zusammen erlaubt, aus der nächsten Änderung zu lernen.**

#### Erfassungsschema je Rad

| Feld | Typ | Format | Beispiel |
|---|---|---|---|
| `uca_heim_front` | Stellgröße | Umdrehungen ab Anschlag | 3,0 |
| `uca_heim_rear` | Stellgröße | Umdrehungen ab Anschlag | 0,0 |
| `uca_shim_front` | Stellgröße | Gesamtdicke mm | 3,2 |
| `uca_shim_rear` | Stellgröße | Gesamtdicke mm | 1,6 |
| `lca_plate` | Stellgröße | **Plattennummer** (#1 = Serie) | #3 |
| `strut_rod_len` | Stellgröße | mm | — |
| `camber_meas` | **Messgröße** | ° | −2,1 |
| `castor_meas` | **Messgröße** | ° | +3,2 |
| `kpi_meas` | **Messgröße** | ° | — |
| `track_width_front` | Messgröße | mm | — |

Shim-Dicken werden als **Gesamtdicke** erfasst, nicht als Stückzahl — Ford liefert 1/32" und 1/8" gemischt, „3 Scheiben" ist damit mehrdeutig.

#### Daraus entsteht die fahrzeugspezifische Verstelltabelle

Mit jeder dokumentierten Änderung wächst eine Tabelle, die für **dieses** Fahrzeug gilt:

```text
LCA-Platte   Camber links   Camber rechts
   #1          −1,2°          −1,3°
   #2          −1,8°          −1,9°
   #3          −2,4°          −2,5°
```

Diese Tabelle ersetzt jede Literaturangabe. Sie ist das eigentliche Ergebnis der Setup-Arbeit — wertvoller als ein einzelner „richtiger" Camberwert, weil sie die nächste Änderung planbar macht.

> **Dasselbe gilt für die Shims.** Ford nennt 1/32" ≈ 1/2° Castor und 1/16" ≈ 1/3° Camber. Das sind Werksangaben für die Serienkonfiguration bei Curb Height mit Werkzeug T65P-3000. Unser Fahrzeug hat Shelby Drop, SoT Tubular UCA und andere Reifen — die realen Werte sind gegenzuprüfen, nicht zu übernehmen.

---

## 7. Was noch nicht belegt ist

### 7.1 Am Fahrzeug zu bestimmen

| Größe | Verfahren | Vorhandene Referenz |
|---|---|---|
| **Grad Camber je LCA-Plattenstufe** | eine Stufe ändern, vorher/nachher messen | keine |
| **Richtung** LCA-Plattennummer → Camber-Vorzeichen | dito, Vorzeichen notieren | keine |
| **Spurweitenänderung je Plattenstufe** | messen | ±3/8" gesamt |
| Castor je 1/32" Shim am realen Fahrzeug | Gegenprobe zur Ford-Angabe | Ford: ≈ 1/2° |
| Camber je 1/16" Shim am realen Fahrzeug | Gegenprobe zur Ford-Angabe | Ford: ≈ 1/3° |
| **Grad je Umdrehung UCA-Heim** | eine Umdrehung, vorher/nachher | SoT: 3 Umdr. ≈ +3° Castor |
| Ist beide UCA gleich lang? | Gewindelänge messen | Projektregel §3.5 |

Die Ford-Werte gelten für die **Serienkonfiguration bei Curb Height mit Werkzeug T65P-3000**. Unser Fahrzeug hat Shelby Drop, SoT Tubular UCA und andere Reifen — sie sind Ausgangspunkt, nicht Ergebnis.

Vorgehen: **eine** Änderung, Settling-Prozedur ([`02_WORKFLOW.md`](02_WORKFLOW.md) §17), messen, zurückstellen, gegenmessen. Stellgröße **und** Messgröße protokollieren (§6.3).

### 7.2 Noch zu beschaffen

| Quelle | wofür | Priorität |
|---|---|---|
| Ford Shop Manual 1966, **Part 3-6 Specifications** | Werks-Sollwerte Castor/Camber/Toe für Mustang | mittel — nur als historische Referenz, nicht als Track-Ziel |
| SOT-UCA65-66 Alignment-Beiblatt | nur relevant, falls dieser UCA verbaut ist | abhängig von §3.5 |

> Die Werksangaben aus Part 3-6 sind **Straßenwerte von 1966** und ausdrücklich kein Track-Zielwert. Sie sind nur als Ausgangsreferenz und für die Beurteilung „ist das Fahrzeug noch im Werksfenster" interessant.

### 7.3 Offene Fahrzeugfragen

| Frage | Warum relevant |
|---|---|
| **UCA Cross-Shaft-Variante** — Standard oder „Dropped" | bestimmt reale Innenlagerposition, Camber Gain, Roll Center |
| **UCA Heim-Position** vorn/hinten je Seite | Grundeinstellung Camber/Castor |
| **Sind beide UCA gleich lang?** | Projektregel §3.5 — ungleiche Länge = ungleiche Camberkurven |
| **LCA-Typ** — Serie oder SoT Tubular | SoT-Track-Beispiel nutzt den Tubular LCA |
| aktuelle LCA-Plattenkonfiguration L/R | Istzustand, Reproduzierbarkeit |
| aktuelle Shim-Pakete L/R in mm | Istzustand |
| aktuelle Strut-Rod-Längen | Istzustand |

Die ersten drei sind durch Sichtprüfung und Messen in einer Stunde zu klären und sollten **vor** der ersten Setup-Session erledigt sein.

---

## 8. Quellen

### Primärquelle Fahrzeughersteller — Klasse A

**Ford Motor Company — 1966 Ford Cougar, Falcon, Fairlane and Mustang Shop Manual**
Lokale Kopie: `docs/quellen/A-11-ford-1966-shop-manual-ocr.txt`
Original: https://archive.org/details/1966-falcon-shop-manual
SHA256: `D9BF4E6CDD05231E9AAA59AFF449BFBADB1831AEA734F553EB25591E6478425F`

Belegt: Shim-Verfahren für Castor und Camber, Richtungen, Größenordnungen (1/32" ≈ 1/2° Castor; 1/16" ≈ 1/3° Camber), Grenzwerte (1/16" Differenz, 9/16" Gesamtpaket), Symmetrietoleranzen (1/2° max, 1/4° bevorzugt), Reihenfolge Toe nach Castor/Camber, Turning Angle als Diagnosegröße, Verbot des Richtens durch Biegen.

> **Hinweis:** Die vorliegende Kopie ist der OCR-Volltext des Internet-Archive-Scans. Für Zitate im Grenzbereich ist das Original-PDF (121 MB, Fig. 39 und Fig. 28) heranzuziehen. Die OCR hat an einzelnen Stellen Spalten vermischt; die hier zitierten Abschnitte wurden gegen zwei unabhängige Fundstellen im Dokument (Group 3 und Group 20) geprüft.

### Primärquelle Komponentenhersteller — Klasse A

**Street or Track LLC — Camber Kit Installation Instructions**
Lokale Kopie: `docs/quellen/A-10-sot-lca-camber-kit-instructions.pdf`
Original: http://www.streetortrack.com/files/images/st/camber_kit.pdf
SHA256: `F4B91893D853E8BD1969025C2A7D9359A49C87BC6EB347E2CB0B0A6A104991D9`

Belegt: Einbauverfahren, Platte #1 = Serienposition, nummerierte Platten als diskrete Verstellung, Langloch nur horizontal, Schweißeinbau.

**Street or Track LLC — Produktbeschreibungen**
https://streetortrack.com/suspension/front-suspension/lower-control-arms/lower-control-arm-camber-kit-for-65-66-mustangs
https://streetortrack.com/street-or-track-tubular-caster-upper-arms

Belegt: Verstellbereich LCA-Kit ±3/8", formschlüssige Fixierung, Grenze der Shim-Methode, Track-Beispiel −2,75°/+5° mit Hardwarekonfiguration, UCA-Auslieferungszustand (+3° Castor, vorn 3 Umdrehungen weiter heraus), Längenverstellung über Heim-Gelenke, **Regel gleiche Armlänge links/rechts wegen Camberkurve**, Zusammenhang Castor/Strut-Rod-Länge/Freigängigkeit, Cross-Shaft-Varianten Standard/Dropped.

### Vergleichswerte — Klasse C

Zur Einordnung der Größenordnung, nicht als Zielwerte. Vollständige Tabelle in [`00_PROJECT.md`](00_PROJECT.md) §8.

**Maier Racing — Alignment Recommendations**
Lokale Kopie: `docs/quellen/C-01-maier-racing-alignment-recommendations.pdf`
SHA256: `4273E8C3DF42B0212CD611C574971B1CB519925A8B66669034765A88774E8047`

Nennt für 1965–70 Mustang: Camber −0,5° bis −1,5°, Castor +1,5° bis +3° positiv, Toe 1/16" in bis 1/16" out. Zusatz: *„higher sustained corner speeds call for additional camber"* und *„Adjustable or modified strut rods may be required to achieve higher caster angles"*. Es sind **Straßen-/Performance-Werte**, kein Rundstrecken-Setup.

### Nicht mehr benötigt

Die bisherige Berufung auf **Global West** für die Shim-Richtungsaussagen entfällt. Ford ist die Primärquelle, nennt dieselben Richtungen und zusätzlich die Größenordnungen und Grenzwerte.

### Nicht beschaffbar

Werksseitige Alignment-Vorgaben der **Shelby GT350R / Trans-Am**-Wettbewerbsfahrzeuge konnten aus keiner belastbaren Quelle beschafft werden. In Foren kursierende Zahlen sind nicht nachprüfbar und werden **nicht** aufgenommen. Mögliche Primärquellen: Shelby American Racing Team Service Bulletins, SAAC-Archiv, Ford Trans-Am Competition Preparation Manual.

---

## 9. Definition of Done

- [x] UCA-Shim-Mechanik aus Ford-Primärquelle belegt
- [x] Castor-Richtungen belegt, nicht abgeleitet
- [x] Camber-Richtungen belegt — Shims entfernen → negativer Camber
- [x] Größenordnungen belegt (1/32" ≈ 1/2° Castor, 1/16" ≈ 1/3° Camber)
- [x] Ford-Grenzwerte dokumentiert (1/16" Differenz, 9/16" Gesamtpaket)
- [x] Symmetrietoleranz belegt (1/4° bevorzugt)
- [x] Kopplung Castor/Camber als auflösbar dargestellt
- [x] vier Grundoperationen tabelliert
- [x] LCA Camber Kit identifiziert, Einbauanleitung beschafft
- [x] Platte #1 = Serienposition als Dokumentationsreferenz
- [x] geometrischer Unterschied UCA- vs. LCA-Verstellung
- [x] Track-Beispiel korrekt eingeordnet (andere Hardware)
- [x] vollständige Wirkungsmatrix mit belegten Zahlen
- [x] Einstellreihenfolge mit Rollenverteilung der drei Regler
- [x] Bump-Steer-Kontrolle nach LCA-Änderung verankert
- [x] alle Primärquellen lokal gespiegelt mit SHA256
- [x] UCA als SoT Tubular identifiziert, vierte Verstellebene aufgenommen
- [x] Regel „beide UCA gleich lang" mit Herstellerbegründung
- [x] Stellgröße und Messgröße als getrennte Felder definiert
- [x] Vergleichswerte Klasse C eingeordnet
- [ ] UCA Cross-Shaft-Variante (Standard/Dropped) erfasst
- [ ] UCA Heim-Position je Seite erfasst, Gleichheit geprüft
- [ ] LCA-Typ erfasst (Serie oder SoT Tubular)
- [ ] LCA-Plattennummer ↔ Camber-Richtung bestimmt
- [ ] Istzustand Shims/Platten/Strut Rods dokumentiert
- [ ] fahrzeugspezifische Verstelltabelle begonnen
- [ ] Ford-Größenordnungen am Fahrzeug gegengeprüft
- [ ] Original-PDF für Fig. 39 / Fig. 28 beschafft
- [ ] GT350R/Trans-Am-Werksdaten — Primärquelle gefunden?
