---
created: 2026-10-28
source: ai-generated
topic: Bewertung Handbuch und App alignment aus Mechanikersicht
---

# Alignment – Prüfung aus Mechanikersicht

Geprüft: Repo `pahlborn/Mustang-Car-Alignment` (lokal `Peters Bastelbude\alignment`), Stand v22 (`d720dd4`), keine offenen PRs oder Issues. Gelesen wurden `handbuch/02_WORKFLOW.md`, alle Fachkapitel und die Werkstatt-App (Übersicht, Werkstatt, Messblatt, Bind, Bump Steer). Geändert wurde nichts.

Die Frage lautete: Ist das für einen Mechaniker verständlich, gut durchdacht und gut aufgebaut? Und ist das Vorgehen praxisnah?

## Kurzurteil

| Frage | Urteil |
|---|---|
| Gut durchdacht? | **Ja.** Die Reihenfolge stimmt im Kern. Rückkopplungen und Quellen sind sauber behandelt. |
| Für einen Mechaniker verständlich? | **Eher nein.** Es liest sich wie ein Ingenieur- und Rechercheordner, nicht wie eine Werkstattanleitung. |
| Gut strukturiert? | **Teilweise.** Der Workflow ist klar. Die Kapitel haben aber eigene, abweichende Reihenfolgen und viele Doppelungen. |
| Praxisnah? | **In der Richtung ja, im Handgriff nein.** Es steht da, *was* zu tun ist, selten *wie*, *womit* und *wann es passt*. |

## Was gut ist

- **Die Reihenfolge entspricht dem üblichen Vorgehen:** erst die Mechanik prüfen, dann eine ebene Standfläche herstellen und das Auto fahrfertig machen. Danach folgen Fahrhöhe, Hinterachse, Castor, Camber, grobe Spur, Wiegen, Bump Steer und das finale Ausrichten. Am Ende wird noch einmal gewogen.
- **Zwei Durchgänge, ein grober und ein finaler,** mit der Begründung aus den Longacre-Anleitungen. So arbeiten erfahrene Fahrwerksleute.
- **Die Tabelle „was wann erneut prüfen"** (`02_WORKFLOW.md` §27) ist wertvoll. Sie unterscheidet „neu messen" von „mitmessen".
- **Die Stop-Regel bei Spiel oder Schaden** und die Prioritätenliste (Sicherheit vor Mechanik vor Messung …) sind richtig.
- **Wiederholmessung:** anheben, absetzen, setzen, erneut messen, ebenso das Vorrollen vor jeder Messung. Das ist echte Werkstattpraxis.
- **Das Bind-Kapitel und die Bump-Steer-Vorbereitung** sind die konkretesten Teile, z. B. „Panhard-Bolzen ohne Kraft einführen, nicht hebeln".
- **Die Shim-Regeln für den oberen Querlenker** sind sauber aus dem Ford-Handbuch belegt.
- **Cross Weight gilt als Diagnosegröße, nicht als Stellschraube.** Das ist bei diesem Auto realistisch.

## Was einen Mechaniker bremst

### 1. Es fehlt das „Wie"

Pro Phase gibt es selten Werkzeug, Handgriff, Messpunkt, Toleranz und ein „fertig, wenn …".

- Phase 1 ist eine reine Bauteilliste („Ball Joints spielfrei") ohne Prüfmethode und ohne Spielgrenze.
- Phase 2 sagt „Boden vermessen", nennt aber keine erlaubte Unebenheit.
- Phase 6 nennt den „gewünschten Castor-Bereich", aber welcher das ist, steht nirgends.
- **Kein einziges Anzugsmoment** im ganzen Handbuch.
- „Was tun bei Abweichung?" steht nur an drei Stellen.

### 2. Es fehlen die typischen Schritte nach einem Komplettumbau

- **Einfahren und Setzen:** Neue Federn und Blattfedern setzen sich erst nach einigen Kilometern. Vor Phase 4 (Fahrhöhe) fehlt der Schritt „erst grobe Spur, dann fahren, dann messen".
- **Gummi- und Kunststofflager erst bei Fahrhöhe festziehen:** Strut Rods, Federaugen, Shackles, Panhard. Das steht nirgends.
- **U-Bolts über Kreuz anziehen** und nach der ersten Fahrt nachziehen.
- **Shims tauschen am Mustang:** Die Feder drückt auf den oberen Querlenker. Wie man ihn abfängt, steht nirgends.
- **Lenkung mittig stellen:** Umdrehungen von Anschlag zu Anschlag halbieren, Lenkrad feststellen, Klemmschellen der Spurstangenhülsen lösen und anziehen.
- **Bremse feststellen bei der Castor-Messung** (Pedalstütze).
- **Federausbau für Bump Steer:** Federspanner und Sicherheitshinweis fehlen.

### 3. Sprache und Textart

- Durchgehender Mix aus Deutsch und Englisch („LF Chassis-to-Ground", „Center Pins / Spring Perches", „nicht auf 50,00 % Cross jagen").
- Grob 15–25 % der Texte sind Verwaltungstext: Versionsstände, Definition of Done, Prüfsummen, „Projektfestlegung vom …". Dazu Korrekturhinweise zu Altfassungen und Ideen für die Website.
  - Beispiel Phase 9: „sie wäre eine zweite, unvollständige Fassung derselben Tabelle und liefe über kurz oder lang gegen sie".
  - Das widerspricht auch Regel 11 im Repo („kein Rückblick im Seitentext").
- Am Auto weiß man oft das *Warum*, aber nicht den nächsten Handgriff.

### 4. Mehrere Reihenfolgen nebeneinander

Neben dem Workflow haben die Kapitel Fahrhöhe, Einstellmechanik, Spur, Bump Steer, Hinterachse und Legacy je eine eigene Reihenfolge, teils abweichend:

- Das Kapitel Einstellmechanik setzt „Full Lock" und Bump Steer vor das finale Toe.
- Das Hinterachskapitel wiegt vor dem Ausrichten der Achse.
- Für das „Setzen" gibt es drei verschiedene Verfahren: rollen, anheben oder auf und ab bewegen.
- Das Legacy-Kapitel enthält alte Stände und eine alte Baseline als „bestätigt". Das verwirrt.

### 5. Ohne Startwerte

Die Regel „kein Sollwert ohne Quelle" ist sauber. Für die Werkstatt heißt sie aber: **Der Mechaniker hat keinen Startwert.** Die Baseline (+3,0° Castor, −2,0° Camber, +1,6 mm Spur) steht nur in `00_PROJECT.md` als „offen", nie neben dem Messfeld.

## Fachliche Fehler und Widersprüche (nachgeprüft)

| Stelle | Befund |
|---|---|
| `CHAPTER_SPRINGS_ROLL_STIFFNESS.md:65` und `:171` | „Die Feder sitzt auf dem unteren Querlenker". **Falsch.** Beim 65/66 Mustang sitzt die Schraubenfeder über dem oberen Querlenker im Federturm. Das ist relevant für die Motion Ratio. |
| `CHAPTER_FRONT_ADJUSTMENT_UCA_LCA.md:120` gegen `:331` | Gegenläufig shimmen: einmal „+1° je 1/32"", einmal „1/2° je 1/32"". Hier fehlt vermutlich „je Bolzen" oder „Gesamtdifferenz". |
| `CHAPTER_FRONT_ADJUSTMENT_UCA_LCA.md:233` | KPI soll sich bei LCA-Verstellung „gleichsinnig" zum Camber ändern, bei UCA-Verstellung „gegensinnig". Der Achsschenkel ist starr, der eingeschlossene Winkel bleibt fest. Also ändern sich Camber und KPI in beiden Fällen gleich zueinander, nämlich gegenläufig. |
| `CHAPTER_FRONT_ADJUSTMENT_UCA_LCA.md:346` gegen `02_WORKFLOW.md:276` | Einmal sind Castor und Camber „vollständig getrennt einstellbar", einmal „koppeln" sie sich. Für Phase 6 ist das gerade die Begründung der Reihenfolge. |
| `CHAPTER_BIND_DIAGNOSIS.md:102` | Die Starrachse habe „fünf geführt, einer frei". Ungenau: Einfedern **und** Verschränken (Rollen gegen die Karosserie) müssen frei bleiben. |
| `02_WORKFLOW.md:199` | Zirkel: Der Bind-Test steht vor Phase 4. Ein schief sitzender Panhard lässt ihn durchfallen, ausgerichtet wird der Panhard aber erst in Phase 5. |
| Bump-Steer-Kapitel | Das Messgerät BGR310 ist laut Kopf vorhanden, an anderer Stelle aber „noch festzulegen". |

> [!NOTE]
> **Korrigiert am 2026-10-28 (Commit `664ad0f`, CI grün)**
> Alle sieben Stellen sind bearbeitet:
> 1. **Feder:** sitzt auf dem oberen Querlenker. Beleg: Ford Shop Manual 1966 (A-11), „A coil spring seats between the upper arm and the top of the spring housing".
> 2. **Shims:** Ford sagt ½° je 1/32" **an einem Bolzen**. Gegenläufig, also an jedem Bolzen 1/32", ergibt das 1°. §2.4 stimmte, die Wirkungsmatrix in §5 war falsch.
> 3. **KPI:** ändert sich auch bei LCA-Verstellung gegensinnig zum Camber, weil der Achsschenkel starr ist. Ohne Formel, die Konvention für den Included Angle bleibt offen.
> 4. **Castor/Camber:** „weitgehend getrennt". Gegenläufige und gleichsinnige Shims trennen sauber, Strut Rod und einseitige Shims koppeln. Die Workflow-Begründung ist angeglichen.
> 5. **Starrachse:** vier Freiheitsgrade geführt, zwei frei (Einfedern, Verschränken).
> 6. **Bind-Schranke:** Der Panhard muss nur kraftfrei sitzen, nicht ausgerichtet sein. Nach jeder Panhard-Änderung in Phase 5 wird der Test wiederholt (Workflow §6, Bind-Kapitel Regel 4).
> 7. **BGR310:** Die Einträge „noch festzulegen" und „zu beschaffen" sind bereinigt (Bump-Steer- und Strecken-Kapitel).
>
> **Für Schritt 2 (App) vorgemerkt:** Eine Panhard-Änderung macht den Bind-Test in der App bisher nicht ungültig, das sollte sie nach der neuen Regel.

> [!NOTE]
> **Schritt 2 umgesetzt am 2026-10-28: alignment v23 (`5f84626`), CI grün, live**
> - **Messen ist kein Verstellen:** Nur Stellgrößen (Shims, Heim-Gelenke, LCA-Platte, Strut Rod, Kaltdruck) melden eine Änderung. Messwerte (Winkel, Höhen, Radlasten, Bump Steer) melden nichts mehr. 100 % sind damit erreichbar.
> - **Hinterer Shim** meldet jetzt Castor statt Camber (Ford: ½° je 1/32" an einem Bolzen). Vorher zog die App danach Castor und Freigängigkeit nicht nach.
> - **Panhard-Änderung nach dem Bind-Test:** Werkstatt und Übersicht verlangen „Bind-Test wiederholen". Bis dahin gilt das Auto nicht als rennstreckenbereit.
> - Der Hinweis im Messblatt „UCA-Shims und Strut Rods koppeln beide" ist korrigiert.
> - Unfallregister: sechzehnter Vorfall. Die alten Tests hatten ausdrücklich das falsche Verhalten geprüft.
>
> **Noch offen aus der Prüfung (App):** Messfelder hängen nicht an einer Phase und haben keinen Verlauf. Die Phasenkarte verlinkt nicht das Fachkapitel. Der Statusknopf ist klein, und ein Tipp zu viel setzt „erledigt" ohne Rückfrage zurück. Code-Namen erscheinen in der Anzeige. Phase 0 ist in der App nicht erledigbar. Bei „Änderung eintragen" fehlen Buchsen, Anschlagpuffer und Dämpfer.

> [!NOTE]
> **Bedienfehler bereinigt am 2026-10-28: alignment v24 (`c1a882a`), CI grün, live**
> - **Statusknopf** 44 px statt 22 px (Apple-Richtwert für Tippflächen).
> - **„Erledigt" zurücksetzen** nur nach Rückfrage „Wieder auf offen setzen?".
> - **Klartext statt Kennungen** in Werkstatt, Journal und Übersicht, z. B. „Spielfreiheit der Lager und Gelenke" statt „Mech Spielfreiheit".
> - **iOS-Zoom:** Alle Eingabefelder haben mindestens 16 px Schrift. Das Messblatt bleibt auch auf 375 px Breite ohne Überlauf.
> - **Buchsen Hinterachse** ist unter „Änderung eintragen" wählbar. Danach verlangt die App einen neuen Bind-Test (Bind-Kapitel §8 Regel 4).
>
> **Korrektur zu dieser Prüfung:** Der Befund „Phase 0 lässt sich nicht erledigen" war falsch. In der echten Seite lässt sich Phase 0 abhaken wie jede andere Phase (nachgeprüft im Browser).
>
> **Bewusst nicht umgesetzt:** Für **Anschlagpuffer** und **Dämpfer** nennt das Handbuch nicht, was nach einem Tausch neu zu messen ist. Ohne Quelle keine Regel. Sie bleiben offen, bis das Handbuch eine Festlegung trifft.
>
> **Weiter offen (App):** Messfelder hängen nicht an einer Phase und haben keinen Verlauf. Die Phasenkarte verlinkt nicht das Fachkapitel. Beides gehört zu Schritt 3 (Arbeitskarten).

## Die App in der Werkstatt

**Gut:**

- Übersicht mit Fortschritt und „rennstreckenbereit ja/nein"
- Bind-Seite mit klarer Sperre
- Vorschau, welche Phasen eine Verstellung entwertet
- gerechnete Werte (Gesamtspur, Cross, Differenz links/rechts)
- offline nutzbar

**Schwerster Befund:** Im Messblatt zählt **jedes Eintragen eines Messwerts wie eine Verstellung** („Jede Änderung an einem Messwert meldet sich selbst: die zugehörigen Werkstattphasen werden danach als veraltet markiert"). Wer in Phase 15 nur die Radlasten einträgt, macht damit frühere Phasen „veraltet". So erreicht man am Ende nie 100 %, und die Warnung verliert ihren Wert.

**Weitere Befunde:**

- Die Messfelder hängen nicht an einer Phase. Erst- und Endmessung landen im selben Feld, ohne Verlauf.
- Die Karte einer Phase verlinkt nur den Workflow, nicht das passende Fachkapitel. Bei Phase 6 und 13 fehlt so die Shim-Tabelle.
- **Bedienung mit schmutzigen Händen:**
  - Der Statusknopf ist sehr klein (22 px).
  - Ein Tipp zu viel setzt „erledigt" ohne Rückfrage zurück.
  - Die Schrift in den Feldern ist klein, iOS zoomt beim Antippen hinein.
- **Code-Namen in der Anzeige,** z. B. „Legt fest: Mech Spielfreiheit, Pad Ebene, Radstand Lr …".
- ~~Phase 0 (Inventar) lässt sich in der App nicht erledigen.~~ Falsch, siehe Korrektur oben (v24).
- Bei „Änderung eintragen" fehlen Buchsen, Anschlagpuffer und Dämpfer.

## Nachprüfung 2026-10-29 (Stand v24, `c1a882a`)

Seit der ersten Prüfung sind drei Commits dazugekommen, alle vom 28.10.:

- `664ad0f`: sieben Fachfehler korrigiert
- v23: Messen ist kein Verstellen
- v24: Bedienung in der Werkstatt

Die Tests auf GitHub (CI) laufen bei v23 und v24 grün. Die Inhalte der Kapitel für die Werkstatt sind sonst unverändert.

### Erledigt (nachgeprüft)

| Punkt | Ergebnis |
|---|---|
| Federsitz vorn | Jetzt „auf dem oberen Querlenker", mit Zitat aus dem Ford-Handbuch (A-11). Richtig. |
| Shims gegenläufig | Jetzt „1° je 1/32" an jedem Bolzen (2 × ½°)". Stimmt mit Ford überein: Unterlegscheiben vorn entfernen oder hinten einlegen bringt das Kugelgelenk nach vorn. |
| KPI beim LCA-Kit | Jetzt „ebenfalls gegensinnig", mit Begründung über den starren Achsschenkel. Richtig. |
| Castor/Camber getrennt oder gekoppelt | Einheitlich: „weitgehend getrennt". Der Strut Rod und ein Shim an nur einem Bolzen koppeln leicht. Richtig. |
| Freiheitsgrade der Starrachse | Jetzt vier geführt, zwei frei (Einfedern und Verschränken). Richtig. |
| Zirkel Bind-Test und Panhard | Gelöst. Für den Test reicht ein kraftfrei passender Bolzen. Nach einer Änderung an Länge oder Höhe des Panhard wird der Test erneut verlangt, auch in der App. |
| Messgerät Bump Steer | BGR310 überall als vorhanden geführt. |
| Messen = Verstellen | Behoben. Nur noch Stellgrößen melden eine Änderung: Shims, Heim-Gelenke, LCA-Platte, Strut Rod, Kaltdruck. Nebenbei korrigiert: Der hintere Shim meldet jetzt Castor statt Camber. |
| Bedienung | Statusknopf 44 px, Rückfrage vor dem Zurücksetzen, Klartext statt Kennungen, 16 px in den Feldern, „Buchsen Hinterachse" als Eingriff. |

### Neu gefunden

**Nach Phase 13 werden die Phasen 3 und 6 „veraltet".**

- Im finalen Ausrichten (Phase 13) verstellt man Shims. Die App meldet dann Castor.
- Das macht Phase 6 (grobes Ausrichten) veraltet, weil sie Castor auch liefert.
- Über die Kette Castor → Toe → Lenkungsmitte wird außerdem Phase 3 (Race-Ready) veraltet.
- Nachgerechnet mit `Recheck.phasenNach('castor')`: Ergebnis Phasen 3, 6, 13 und 17.

Fachlich ist Phase 6 aber nicht ungültig, sie ist planmäßig durch Phase 13 ersetzt. Wer den Ablauf genau einhält, muss also am Ende Phase 3 und Phase 6 erneut bestätigen, um auf 100 % zu kommen. Das ist derselbe Fehlertyp wie vor v23, nur kleiner.

**Vorschlag:** Eine Erstphase gilt als „ersetzt", nicht als „veraltet", sobald die spätere Phase mit denselben Größen (4 → 15, 6 → 13, 7 → 15) erledigt ist.

> [!NOTE]
> **Behoben in v25 (`e9fe089`, 2026-10-29)**
> Umgesetzt nach dem [Auftrag v25](2026-10-29-auftrag-v25-erstphasen-ersetzt.md). Die spätere Phase muss nach der Änderung erledigt sein. Phase 5 wird nach der Balance weiterhin neu verlangt.

### Weiter offen

- Arbeitskarten je Phase mit Werkzeug, Handgriff, Toleranz, „fertig, wenn …" und „bei Abweichung …": nichts geändert.
- Anzugsmomente: weiterhin keines im Handbuch.
- Schritte nach dem Umbau: Einfahren, Lager bei Fahrhöhe anziehen, U-Bolts nachziehen, Lenkungsmitte, Federkraft beim Shimmen. Nichts davon ergänzt.
- Startwerte neben den Messfeldern: fehlen.
- Die Phasenkarten verlinken weiterhin nur den Workflow, nicht das passende Fachkapitel (z. B. die Shim-Tabelle für Phase 6 und 13).
- Mehrere Reihenfolgen in den Kapiteln, das Legacy-Kapitel und der Verwaltungstext („GitHub unverändert" im Kopf von sechs Kapiteln): unverändert.

### Urteil Stand v24

- **Fachlich korrekt:** ja, die bekannten Fehler sind behoben.
- **Als Tagebuch und Statusanzeige brauchbar:** ja. Ausnahme ist der Punkt Phase 3 und 6 nach Phase 13.
- **Als Anleitung, mit der ein Mechaniker die Phasen 0–18 am Auto abarbeitet:** noch nicht. Das „Wie" fehlt weiterhin.

## Empfehlung (Reihenfolge)

1. **Fachfehler beheben:** die Tabelle oben. Das ist wenig Aufwand mit großer Wirkung.
2. **In der App Messen von Verstellen trennen:** Nur eine eingetragene Verstellung entwertet Phasen, das Messen nicht.
3. **Pro Werkstattphase 0–18 eine Arbeitskarte auf einer Seite:**
   - Werkzeug
   - Vorbereitung
   - Handgriffe
   - Messpunkt
   - Toleranz
   - „fertig, wenn …"
   - „bei Abweichung …"
   - Anzugsmomente mit Quelle (Ford-Handbuch oder Teilehersteller), sonst als „offen" markiert

   Erklärungen und Theorie kommen in einen Anhang „Warum".
4. **Fehlende Umbau-Schritte ergänzen:** Einfahren, Lager bei Fahrhöhe anziehen, U-Bolts, Lenkungsmitte, Federkraft beim Shimmen.
5. **Eine einzige Reihenfolge:** nur im Workflow, die Kapitel verweisen darauf. Das Legacy-Kapitel auflösen und archivieren.
6. **Sprache:** Deutsch, Fachwort bei der ersten Nennung in Klammern. Verwaltungstext aus den Seiten nehmen.
7. **Startwerte neben den Feldern zeigen,** gekennzeichnet als „Arbeitswert, unbelegt".
