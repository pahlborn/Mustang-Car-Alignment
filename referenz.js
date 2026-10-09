/**
 * referenz.js - Nachschlagekarte der Konventionen.
 *
 * Vorzeichen, Einheiten, Formeln und Evidenzklassen - das, was man am
 * Fahrzeug nachschlagen muss, ohne lange zu blaettern.
 *
 * BELEGE
 *
 * Jede Zeile traegt eine Zeichenkette, die in handbuch/CONVENTIONS.md
 * vorkommen MUSS. tests/referenz.test.mjs prueft beides: dass jeder Beleg
 * dort steht, und dass es genauso viele Belege wie Zeilen gibt - ohne die
 * zweite Pruefung koennten die Listen gegeneinander verrutschen.
 *
 * Das Verfahren stammt aus jericos reference.js. Es loest ein Problem, das
 * eine blosse Abschrift nicht loest: die Karte ist eine Verkuerzung, keine
 * Kopie. Wortgleichheit laesst sich darum nicht pruefen - wohl aber, dass
 * der Satz, auf den sie sich stuetzt, noch da ist.
 */
(function (global) {
  'use strict';

  var REFERENZ = {
    titel: 'Konventionen',
    untertitel: 'Vorzeichen, Formeln und Klassen \u2013 verbindlich nach CONVENTIONS.md',

    gruppen: [
      {
        id: 'ref-vorzeichen',
        titel: 'Vorzeichen',
        hinweis: 'Ein verdrehtes Vorzeichen ist kein Messfehler, sondern das Gegenteil der Aussage.',
        spalten: ['Gr\u00f6\u00dfe', 'negativ', 'positiv'],
        zeilen: [
          ['Camber', 'Rad oben nach innen', 'Rad oben nach au\u00dfen'],
          ['Castor', 'Lenkachse oben nach vorn', 'Lenkachse oben nach hinten'],
          ['Toe', 'Toe-out', 'Toe-in'],
          ['Federweg', 'Droop / Ausfedern', 'Bump / Einfedern']
        ],
        belege: [
          'Rad oben nach innen',
          'Castor',
          'Toe-in',
          'positiver Federweg'
        ]
      },
      {
        id: 'ref-toe',
        titel: 'Toe',
        spalten: ['Gr\u00f6\u00dfe', 'Formel / Regel'],
        zeilen: [
          ['Total Toe', 'R \u2212 F, positiv = Toe-in'],
          ['Individual Toe', 'je Rad gegen die Fahrzeugl\u00e4ngsachse'],
          ['mm in Grad', 'a = atan(\u0394 / D)'],
          ['N\u00e4herung', 'a[\u00b0] \u2248 (\u0394 / D) \u00d7 57,3'],
          ['Messbasis D', 'ohne D keine Winkelumrechnung']
        ],
        belege: [
          'Total Toe',
          'Individual Toe',
          'atan',
          '57,3',
          'Keine Winkelumrechnung ohne definierte Geometrie'
        ]
      },
      {
        id: 'ref-radlast',
        titel: 'Radlasten',
        hinweis: '50 % Cross ist ein symmetrischer Ausgangspunkt, kein universeller Sollwert. '
               + 'An diesem Fahrzeug ohnehin nicht gezielt einstellbar.',
        spalten: ['Gr\u00f6\u00dfe', 'Formel'],
        zeilen: [
          ['Total', 'LF + RF + LR + RR'],
          ['Front %', '(LF + RF) / Total \u00d7 100'],
          ['Rear %', '(LR + RR) / Total \u00d7 100'],
          ['Left %', '(LF + LR) / Total \u00d7 100'],
          ['Right %', '(RF + RR) / Total \u00d7 100'],
          ['Cross %', '(RF + LR) / Total \u00d7 100'],
          ['Opposite Cross %', '(LF + RR) / Total \u00d7 100']
        ],
        belege: [
          'Total = LF + RF + LR + RR',
          'Front % = (LF + RF) / Total',
          'Rear % = (LR + RR) / Total',
          'Left % = (LF + LR) / Total',
          'Right % = (RF + RR) / Total',
          'Cross % = (RF + LR) / Total',
          'Opposite Cross % = (LF + RR) / Total'
        ]
      },
      {
        id: 'ref-evidenz',
        titel: 'Evidenzgrade',
        hinweis: 'Kein Sollwert ohne Quelle. Fehlt der Beleg, wird der Wert als offen '
               + 'gekennzeichnet \u2013 nicht geraten. Grad D darf keine '
               + 'sicherheits- oder setupkritische Aussage allein tragen.',
        spalten: ['Grad', 'Bedeutung'],
        zeilen: [
          ['A', 'Prim\u00e4rquelle: Hersteller, Originaldokumentation'],
          ['B', 'etablierte Fachliteratur'],
          ['C', 'kompetente technische Sekund\u00e4rquelle'],
          ['D', 'Erfahrungswert, Forum, Einzelmeinung \u2013 nur unterst\u00fctzend']
        ],
        belege: [
          'Prim\u00e4rquelle: Hersteller',
          'etablierte Fachliteratur',
          'kompetente technische Sekund\u00e4rquelle',
          'Erfahrungswert / Forum / Einzelmeinung'
        ]
      },
      {
        id: 'ref-verifikation',
        titel: 'Verifizierungsstatus',
        hinweis: 'Gilt f\u00fcr Fahrzeug- und Hardwaredaten \u2013 nicht zu verwechseln '
               + 'mit Baseline, Target und Messwert.',
        spalten: ['Status', 'Bedeutung'],
        zeilen: [
          ['Verifiziert', 'am aktuellen Fahrzeug best\u00e4tigt'],
          ['Projektangabe', 'aus dem Projektkontext \u00fcbernommen, nicht erneut gepr\u00fcft'],
          ['Legacy-Angabe', 'aus \u00e4lteren Unterlagen, Aktualit\u00e4t zu pr\u00fcfen'],
          ['Offen', 'noch nicht ausreichend bestimmt']
        ],
        belege: [
          'am aktuellen Fahrzeug bzw. anhand eines eindeutigen aktuellen Nachweises',
          'aus dem bisherigen Nutzer-/Projektkontext',
          'aus \u00e4lteren Projektunterlagen',
          'noch nicht ausreichend bestimmt'
        ]
      },
      {
        id: 'ref-ids',
        titel: 'Kennungen',
        spalten: ['Art', 'Schema'],
        zeilen: [
          ['Baseline', 'BL-JJJJMMTT-NN'],
          ['Change', 'CHG-JJJJMMTT-NN'],
          ['Track Session', 'SES-JJJJMMTT-NN'],
          ['Reifensatz', 'TYRE-<eindeutig>']
        ],
        belege: [
          'BL-YYYYMMDD-NN',
          'CHG-YYYYMMDD-NN',
          'SES-YYYYMMDD-NN',
          'TYRE-'
        ]
      },
      {
        id: 'ref-begriffe',
        titel: 'Baseline, Target, Messwert',
        hinweis: 'Ein Baseline-Wert ist nicht automatisch ein Zielwert.',
        spalten: ['Begriff', 'Bedeutung'],
        zeilen: [
          ['Measurement', 'tats\u00e4chlich gemessener Zustand'],
          ['Baseline', 'eingefrorener Vergleichszustand'],
          ['Target', 'bewusst angestrebter Wert'],
          ['Source Example', 'Wert aus Hersteller- oder Literaturbeispiel'],
          ['Working Hypothesis', 'noch zu validierende Annahme']
        ],
        belege: [
          'Measurement / Messwert',
          'Baseline:',
          'Target / Zielwert',
          'Source Example',
          'Working Hypothesis'
        ]
      },
      {
        id: 'ref-ab',
        titel: 'A/B-Test',
        spalten: ['Begriff', 'Bedeutung'],
        zeilen: [
          ['A', 'dokumentierte Baseline'],
          ['B', 'Zustand nach genau einer \u00c4nderung'],
          ['Ergebnis', 'besser / schlechter / neutral / nicht aussagekr\u00e4ftig']
        ],
        belege: [
          'dokumentierte Baseline',
          'prim\u00e4ren Setup\u00e4nderung',
          'Mehrere gleichzeitig ver\u00e4nderte Setupgr\u00f6\u00dfen sind kein sauberer A/B-Test'
        ]
      }
    ]
  };

  global.Referenz = { REFERENZ: REFERENZ };
})(typeof window !== 'undefined' ? window : globalThis);
