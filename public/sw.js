const CACHE_NAME = 'conjurence-cache-v2';
const TIMEOUT_MS = 5000;

const PRECACHE_URLS = [
  '/',
  '/index.html',
  '/login',
  '/register',
  '/logout',
  '/app/event/create/new',
];

const NEXT_STATIC_REGEX = /^\/.next\/static\//;

async function fetchWithTimeout(request, timeoutMs) {
  return Promise.race([
    fetch(request),
    new Promise((_, reject) => setTimeout(() => reject(new Error('Fetch timeout')), timeoutMs)),
  ]);
}

self.addEventListener('install', event => {
  event.waitUntil(caches.open(CACHE_NAME).then(cache => cache.addAll(PRECACHE_URLS)));
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches
      .keys()
      .then(keys =>
        Promise.all(keys.filter(key => key !== CACHE_NAME).map(key => caches.delete(key)))
      )
  );
  self.clients.claim();
});

self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET') return;

  const url = new URL(event.request.url);

  // Cache-first for Next.js static assets
  if (NEXT_STATIC_REGEX.test(url.pathname)) {
    event.respondWith(
      caches.match(event.request).then(cached => {
        if (cached) return cached;
        return fetch(event.request).then(res => {
          caches.open(CACHE_NAME).then(cache => cache.put(event.request, res.clone()));
          return res;
        });
      })
    );
    return;
  }

  // Network-first with timeout for navigation (pages) and other GET requests
  if (event.request.mode === 'navigate' || url.origin === self.location.origin) {
    event.respondWith(
      fetchWithTimeout(event.request, TIMEOUT_MS)
        .then(async networkResponse => {
          const cache = await caches.open(CACHE_NAME);
          cache.put(event.request, networkResponse.clone());
          return networkResponse;
        })
        .catch(async () => {
          // Timeout or failure → try cache
          const cachedResponse = await caches.match(event.request);
          if (cachedResponse) return cachedResponse;

          // For navigation fallback, return cached index.html
          if (event.request.mode === 'navigate') {
            return caches.match('/index.html');
          }

          // Otherwise fail
          return new Response('Network error', { status: 408, statusText: 'Network timeout' });
        })
    );
    return;
  }

  // Default: try cache first, then network
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
