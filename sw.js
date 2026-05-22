const CACHE_NAME = 'inventario-v2'; // <--- Cambiá el nombre de la versión cada vez que actualices el HTML
const assets = [
  'Balance.html',
  'manifest.json',
  'icon-192.png'
];

// 1. Instalación: Forzar al nuevo SW a tomar el control de inmediato
self.addEventListener('install', electoral => {
  electoral.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(assets);
    }).then(() => self.skipWaiting()) // <--- CRÍTICO: Activa el nuevo SW sin esperar a que cierres la app
  );
});

// 2. Activación: Limpiar cachés viejas automáticamente
self.addEventListener('activate', electoral => {
  electoral.waitUntil(
    caches.keys().then(keys => {
      return Promise.all(
        keys.filter(key => key !== CACHE_NAME).map(key => caches.delete(key))
      );
    }).then(() => self.clients.claim()) // <--- CRÍTICO: Toma el control de las pestañas activas ya mismo
  );
});

// 3. Estrategia de Red: Network First o Cache First según prefieras
self.addEventListener('fetch', electoral => {
  electoral.respondWith(
    caches.match(electoral.request).then(cachedResponse => {
      return cachedResponse || fetch(electoral.request);
    })
  );
});
