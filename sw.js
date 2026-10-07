const CACHE_NAME = 'scheda-palestra-v2';
const ASSETS = [
  'index.html',
  'manifest.json',
  'icon.png',
  'scheda_allenamento.pdf',
  'giorno1.pdf',
  'giorno2.pdf',
  'giorno3.pdf',
  'giorno4.pdf'
];

// Installazione Service Worker e cache dei file
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS);
    }).then(() => self.skipWaiting())
  );
});

// Attivazione e pulizia della vecchia cache
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

// Strategia di recupero: Cache prima, poi Rete
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) {
        return cachedResponse;
      }
      return fetch(event.request).catch(() => {
        // Se si è offline e il file non è in cache, evita la schermata di errore bloccante
        return new Response('Offline: Risorsa non disponibile', {
          headers: { 'Content-Type': 'text/plain; charset=utf-8' }
        });
      });
    })
  );
});
