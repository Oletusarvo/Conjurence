// service-worker.js

const CACHE_NAME = 'conjurence-cache-v1';
const STATIC_ASSETS = [
  '/', // root document
  '/index.html',
];
const NEXT_STATIC_REGEX = /^\/_next\/static\//;

// Install - cache shell
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(STATIC_ASSETS);
    })
  );
  self.skipWaiting();
});

// Activate - remove old caches
self.addEventListener('activate', event => {
  event.waitUntil(
    caches
      .keys()
      .then(keys => Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k))))
  );
  self.clients.claim();
});

// Fetch - network first for HTML, cache-first for static
self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET') return;

  const url = new URL(event.request.url);

  // Cache-first for Next.js static assets
  if (NEXT_STATIC_REGEX.test(url.pathname)) {
    event.respondWith(
      caches.match(event.request).then(cached => {
        return (
          cached ||
          fetch(event.request).then(res => {
            caches.open(CACHE_NAME).then(cache => cache.put(event.request, res.clone()));
            return res;
          })
        );
      })
    );
    return;
  }

  // Network-first for HTML pages (SPA fallback)
  if (event.request.mode === 'navigate') {
    event.respondWith(fetch(event.request).catch(() => caches.match('/index.html')));
    return;
  }

  // Default: try cache, then network
  event.respondWith(
    caches.match(event.request).then(cached => {
      return (
        cached ||
        fetch(event.request).then(res => {
          caches.open(CACHE_NAME).then(cache => cache.put(event.request, res.clone()));
          return res;
        })
      );
    })
  );
});
