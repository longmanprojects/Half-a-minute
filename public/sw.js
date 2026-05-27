const CACHE = 'half-a-minute-v1'

// On install, cache the app shell immediately
self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE).then(cache => cache.add('/')).catch(() => {})
  )
  self.skipWaiting()
})

self.addEventListener('activate', (e) => {
  // Remove old cache versions
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
    ).then(() => clients.claim())
  )
})

self.addEventListener('fetch', (e) => {
  if (e.request.method !== 'GET') return

  e.respondWith(
    fetch(e.request)
      .then(response => {
        // Cache valid responses (including opaque cross-origin responses for fonts)
        if (response.ok || response.type === 'opaque') {
          const clone = response.clone()
          caches.open(CACHE).then(cache => cache.put(e.request, clone)).catch(() => {})
        }
        return response
      })
      .catch(() => caches.match(e.request))
  )
})
