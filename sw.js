// Service worker: ruan skedarët që aplikacioni të punojë edhe pa internet.
const CACHE = 'patenta-v2';
const FILES = [
  './',
  'index.html',
  'css/style.css',
  'js/signs.js',
  'js/scenes.js',
  'js/questions.js',
  'js/app.js',
  'manifest.webmanifest',
  'icon.svg',
];

self.addEventListener('install', (event) => {
  event.waitUntil(caches.open(CACHE).then((cache) => cache.addAll(FILES)));
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
  );
  self.clients.claim();
});

// Rrjeti i pari, memoria si rezervë – kështu përditësimet arrijnë menjëherë.
self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;
  event.respondWith(
    fetch(event.request)
      .then((res) => {
        const copy = res.clone();
        caches.open(CACHE).then((cache) => cache.put(event.request, copy));
        return res;
      })
      .catch(() => caches.match(event.request, { ignoreSearch: true }))
  );
});
