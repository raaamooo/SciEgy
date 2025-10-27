// Cache resources for offline functionality
const CACHE_NAME = 'scistudy-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/timer.html',
  '/study.html',
  '/main.js',
  '/timer.js',
  '/study.js',
  '/scientific_terms.js',
  '/resources/app-icon.png',
  '/hero-science.png'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(urlsToCache))
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => response || fetch(event.request))
  );
});