const CACHE_NAME = 'stock-haf-cache-v1';
const urlsToCache = [
  'index.html',
  'manifest.json'
];

// Instalación y almacenamiento en caché de la estructura base
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(urlsToCache))
      .then(() => self.skipWaiting())
  );
});

// Activación del SW
self.addEventListener('activate', event => {
  event.waitUntil(self.clients.claim());
});

// Intercepción de peticiones para trabajar Offline
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        if (response) {
          return response; // Retorna desde caché si existe
        }
        return fetch(event.request); // Si no va a buscar a la red
      })
  );
});
