var CACHE_NAME = 'chassis-v1';
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
  './styles.css',
  './app.js',
  './version.js',
  './changelog.js',
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
