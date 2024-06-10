// Define the cache name
const CACHE_NAME = 'propulsopod';

// Define the URLs to cache
const URLS_TO_CACHE = [
  '/',
  '/index.html',
  '/index.css',
  '/app.js',
  '/manifest.json',
  '/icon.png'
];

// Listen for the install event
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      console.log('Opened cache');
      return cache.addAll(URLS_TO_CACHE);
    }).catch(error => {
      console.error('Error caching files:', error);
    })
  );
});

// Listen for the fetch event
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(response => {
      if (response) {
        console.log('Found in cache:', event.request.url);
        return response;
      }
      console.log('Fetching from network:', event.request.url);
      return fetch(event.request);
    }).catch(error => {
      console.error('Error fetching from cache:', error);
      return new Response('Offline');
    })
  );
});
