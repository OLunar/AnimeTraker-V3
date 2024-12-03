const CACHE_NAME = 'anime-tracker-v2';
const urlsToCache = [
  '/',
  '/index.html',
  'offline.html',
  '/style.css',
  '/app.js',
  '/manifest.json',
  'https://cdnjs.cloudflare.com/ajax/libs/materialize/1.0.0/css/materialize.min.css',
  'https://cdnjs.cloudflare.com/ajax/libs/materialize/1.0.0/js/materialize.min.js', 
  '/src/firebase/firebase.js', 
  '/src/indexeddb/indexeddb.js'
];

// Install a service worker
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
  );
});

// Cache and return requests
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        return response || fetch(event.request).then(async fetchResponse => {
          const cache = await caches.open(CACHE_NAME);
          cache.put(event.request, fetchResponse.clone());
          return fetchResponse;
        });
      })
      .catch(() => {
        // Fallback mechanism if both cache and network are unavailable
        return caches.match('/offline.html');
      })
  );
});

// Update the service worker
self.addEventListener('activate', event => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (!cacheWhitelist.includes(cacheName)) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});
