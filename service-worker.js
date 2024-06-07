// Define your shared data endpoint
const SHARED_DATA_ENDPOINT = '/token';

// Activate clients immediately to ensure service worker takes control
self.addEventListener('activate', event => {
  event.waitUntil(clients.claim());
});

// Listen for fetch events
self.addEventListener('fetch', event => {
  const { request, request: { url, method } } = event;
  
  // Check if the request matches the shared data endpoint
  if (url.match(SHARED_DATA_ENDPOINT)) {
    if (method === 'POST') {
      // If it's a POST request, save the request body to cache
      request.json().then(body => {
        caches.open(SHARED_DATA_ENDPOINT).then(cache => {
          cache.put(SHARED_DATA_ENDPOINT, new Response(JSON.stringify(body)));
        });
      });
      // Respond with an empty response
      return new Response('{}');
    } else {
      // If it's a GET request, try to retrieve data from cache
      event.respondWith(
        caches.open(SHARED_DATA_ENDPOINT).then(cache => {
          return cache.match(SHARED_DATA_ENDPOINT).then(response => {
            return response || new Response('{}');
          }) || new Response('{}');
        })
      );
    }
  } else {
    // If the request is not for the shared data endpoint, proceed as normal
    return event;
  }
});
