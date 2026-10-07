const CACHE_NAME = 'scheda-palestra-v1';
const ASSETS = [
  './',
  './index.html',
  './manifest.json',
  './icon.png',
  './scheda_allenamento.pdf',
  './giorno1.pdf',
  './giorno2.pdf',
  './giorno3.pdf',
  './giorno4.pdf'
];

// Installazione Service Worker e salvataggio file in cache
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS);
    }).then(() => self.skipWaiting())
  );
});

// Attivazione e pulizia vecchie cache
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Recupero dei file dalla cache quando si è offline
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) {
        return cachedResponse;
      }
      return fetch(event.request);
    })
  );
});
