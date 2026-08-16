// VISNDT PWA Service Worker
// M21.5.2 Progressive Web App Foundation
// Cache Strategy: Static Assets (Cache First) + Pages (Network First) + Offline Fallback

const CACHE_VERSION = 'visndt-pwa-v1';
const STATIC_CACHE = `${CACHE_VERSION}-static`;
const PAGE_CACHE = `${CACHE_VERSION}-pages`;

// Static assets to pre-cache on install
const STATIC_ASSETS = [
  '/',
  '/offline',
  '/manifest.json',
];

// Static asset patterns (cache-first)
const STATIC_PATTERNS = [
  /\.(js|css|woff2?|ttf|eot)$/,
  /\/_next\/static\//,
  /\/icons\//,
  /\/images\//,
];

// Page patterns (network-first with cache fallback)
const PAGE_PATTERNS = [
  /^\/(products|knowledge|solutions|articles|insights|search|categories|tags|about|business)(\/|$)/,
];

// API & dynamic data patterns (NEVER cache)
const NO_CACHE_PATTERNS = [
  /\/api\//,
  /\/workspace\//,
  /\/dashboard\//,
  /\/login/,
  /\/register/,
  /\/auth\//,
];

function isStaticAsset(url) {
  return STATIC_PATTERNS.some(p => p.test(url.pathname));
}

function isPage(url) {
  return PAGE_PATTERNS.some(p => p.test(url.pathname));
}

function isNoCache(url) {
  return NO_CACHE_PATTERNS.some(p => p.test(url.pathname));
}

// Install: pre-cache static assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(STATIC_CACHE).then((cache) => {
      return cache.addAll(STATIC_ASSETS).catch((err) => {
        console.warn('[VISNDT SW] Pre-cache failed (non-critical):', err.message);
      });
    })
  );
  self.skipWaiting();
});

// Activate: clean old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys
          .filter((key) => key.startsWith('visndt-pwa-') && key !== STATIC_CACHE && key !== PAGE_CACHE)
          .map((key) => caches.delete(key))
      );
    }).then(() => self.clients.claim())
  );
});

// Fetch: apply cache strategy
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Only handle GET requests
  if (request.method !== 'GET') return;

  // Never cache API / workspace / auth data
  if (isNoCache(url)) return;

  // Static assets: Cache First
  if (isStaticAsset(url)) {
    event.respondWith(
      caches.match(request).then((cached) => {
        if (cached) return cached;
        return fetch(request).then((response) => {
          if (response.ok) {
            const clone = response.clone();
            caches.open(STATIC_CACHE).then((cache) => cache.put(request, clone));
          }
          return response;
        });
      })
    );
    return;
  }

  // Pages: Network First with cache fallback
  if (isPage(url) || url.pathname === '/') {
    event.respondWith(
      fetch(request)
        .then((response) => {
          if (response.ok) {
            const clone = response.clone();
            caches.open(PAGE_CACHE).then((cache) => cache.put(request, clone));
          }
          return response;
        })
        .catch(() => {
          return caches.match(request).then((cached) => {
            return cached || caches.match('/offline');
          });
        })
    );
    return;
  }

  // Default: Network first with offline fallback
  event.respondWith(
    fetch(request).catch(() => {
      return caches.match(request).then((cached) => {
        return cached || caches.match('/offline');
      });
    })
  );
});