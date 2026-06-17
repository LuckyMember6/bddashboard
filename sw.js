// B+D Dashboard Service Worker
const CACHE_NAME = 'bd-dashboard-v1';
const URLS_TO_CACHE = ['/bddashboard/', '/bddashboard/index.html'];

self.addEventListener('install', function(event) {
  event.waitUntil(
    caches.open(CACHE_NAME).then(function(cache) {
      return cache.addAll(URLS_TO_CACHE);
    })
  );
  self.skipWaiting();
});

self.addEventListener('activate', function(event) {
  event.waitUntil(
    caches.keys().then(function(keys) {
      return Promise.all(keys.filter(function(k){ return k !== CACHE_NAME; }).map(function(k){ return caches.delete(k); }));
    })
  );
  self.clients.claim();
});

self.addEventListener('fetch', function(event) {
  // Nur GET Requests cachen, API Calls immer live
  if(event.request.method !== 'GET') return;
  if(event.request.url.includes('supabase.co') || event.request.url.includes('cashctrl.com') || event.request.url.includes('wixapis.com')) return;
  event.respondWith(
    fetch(event.request).catch(function() {
      return caches.match(event.request);
    })
  );
});
