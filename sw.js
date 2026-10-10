var CACHE_NAME = 'chassis-v8';
// Relativ, nicht absolut: GitHub Pages unterscheidet Gross- und Kleinschreibung
// im Pfad. Ein absoluter Pfad in der falschen Schreibweise laesst cache.addAll
// scheitern - und damit die gesamte Installation des Service Workers, also den
// Offline-Betrieb. Das ist dem Schwesterprojekt jerico in v2 passiert.
//
// cache.addAll ist atomar: eine einzige fehlende Datei laesst die ganze
// Installation scheitern. Hier steht darum nur, was es wirklich gibt.
var urlsToCache = [
  './',
  './index.html',
  './werkstatt.html',
  './diagnose.html',
  './messblatt.html',
  './bumpsteer.html',
  './handbuch.html',
  './styles.css',
  './app.js',
  './version.js',
  './changelog.js',
  './recheck.js',
  './status.js',
  './werkstatt.js',
  './uebersicht.js',
  './diagnose.js',
  './diagnose-ui.js',
  './messwerte.js',
  './messblatt.js',
  './bumpsteer.js',
  './bumpsteer-chart.js',
  './bumpsteer-ui.js',
  './kapitel.js',
  './markdown.js',
  './handbuch-ui.js',
  './glossar.js',
  './referenz.js',
  './nachschlagen.js',
  // Die Kapitel werden zur Laufzeit gelesen, nicht abgeschrieben - also
  // muessen sie offline mit dabei sein. Zusammen rund 440 KB.
  './handbuch/00_PROJECT.md',
  './handbuch/01_ARCHITECTURE.md',
  './handbuch/02_WORKFLOW.md',
  './handbuch/CHAPTER_BALANCE_CORNER_WEIGHT.md',
  './handbuch/CHAPTER_BIND_DIAGNOSIS.md',
  './handbuch/CHAPTER_BUMP_STEER.md',
  './handbuch/CHAPTER_FRONT_ADJUSTMENT_UCA_LCA.md',
  './handbuch/CHAPTER_FRONT_GEOMETRY_CAMBER_CASTER_KPI.md',
  './handbuch/CHAPTER_HANDLING_DIAGNOSIS_DECISION_TREE.md',
  './handbuch/CHAPTER_REAR_SUSPENSION_PANHARD_PINION.md',
  './handbuch/CHAPTER_SETUP_PAD_RIDE_HEIGHT.md',
  './handbuch/CHAPTER_SPRINGS_ROLL_STIFFNESS.md',
  './handbuch/CHAPTER_TIRE_MECHANICS.md',
  './handbuch/CHAPTER_TOE_ACKERMANN_THRUST.md',
  './handbuch/CHAPTER_TRACKS.md',
  './handbuch/CHAPTER_TRACK_VALIDATION_TIRES.md',
  './handbuch/CHAPTER_VEHICLE_DYNAMICS.md',
  './handbuch/CONVENTIONS.md',
  './handbuch/DECISION_LEAF_SPRINGS.md',
  './handbuch/GLOSSAR.md',
  './handbuch/LEGACY_REAR_AXLE_LEAF_SPRINGS_PINION.md',
  './handbuch/MIGRATION_1-3.md',
  './handbuch/TEMPLATE_ALIGNMENT_SHEET.md',
  './handbuch/TEMPLATE_BUMP_STEER_SHEET.md',
  './handbuch/TEMPLATE_CHANGE_LOG.md',
  './handbuch/TEMPLATE_MASTER_SETUP_SHEET.md',
  './handbuch/TEMPLATE_SCALE_SHEET.md',
  './handbuch/TEMPLATE_SETUP_SHEET.md',
  './handbuch/TEMPLATE_TRACK_SESSION_SHEET.md',
  './errorlog.js',
  './field-sync.js',
  './validation.js',
  './icon-192.png',
  './icon-512.png'
];

self.addEventListener('install', function(event) {
  self.skipWaiting(); // Sofort aktiv, nicht auf das Schliessen alter Tabs warten
  event.waitUntil(
    caches.open(CACHE_NAME).then(function(cache) {
      return cache.addAll(urlsToCache);
    })
  );
});

self.addEventListener('activate', function(event) {
  event.waitUntil(
    caches.keys().then(function(names) {
      return Promise.all(
        names.filter(function(n) { return n !== CACHE_NAME; })
             .map(function(n) { return caches.delete(n); })
      );
    })
  );
  self.clients.claim();
});

self.addEventListener('fetch', function(event) {
  // Network-first: erst das Netz, bei Ausfall der Cache (Boxengasse ohne Empfang)
  event.respondWith(
    fetch(event.request).then(function(response) {
      if (response && response.status === 200) {
        var clone = response.clone();
        caches.open(CACHE_NAME).then(function(cache) {
          cache.put(event.request, clone);
        });
      }
      return response;
    }).catch(function() {
      return caches.match(event.request);
    })
  );
});
