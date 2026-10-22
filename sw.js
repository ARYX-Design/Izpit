// Service worker: ruan skedarët që aplikacioni të punojë edhe pa internet.
const CACHE = 'patenta-v4';
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
  'img/znaki/animals.svg',
  'img/znaki/children.svg',
  'img/znaki/crossroadsEqual.svg',
  'img/znaki/crossroadsPriority.svg',
  'img/znaki/crosswind.svg',
  'img/znaki/curveRight.svg',
  'img/znaki/danger.svg',
  'img/znaki/deadEnd.svg',
  'img/znaki/endNoOvertaking.svg',
  'img/znaki/endPriority.svg',
  'img/znaki/endSpeed.svg',
  'img/znaki/livingStreet.svg',
  'img/znaki/motorway.svg',
  'img/znaki/narrowing.svg',
  'img/znaki/noEntry.svg',
  'img/znaki/noHorn.svg',
  'img/znaki/noLeftTurn.svg',
  'img/znaki/noOvertaking.svg',
  'img/znaki/noParking.svg',
  'img/znaki/noStopping.svg',
  'img/znaki/noUTurn.svg',
  'img/znaki/noVehicles.svg',
  'img/znaki/oneWay.svg',
  'img/znaki/pedestrian.svg',
  'img/znaki/pedestrianAhead.svg',
  'img/znaki/priority.svg',
  'img/znaki/priorityBend.svg',
  'img/znaki/priorityOncoming.svg',
  'img/znaki/railway.svg',
  'img/znaki/railwayBarrier.svg',
  'img/znaki/railwayNoBarrier.svg',
  'img/znaki/roadworks.svg',
  'img/znaki/roundabout.svg',
  'img/znaki/roundaboutAhead.svg',
  'img/znaki/slippery.svg',
  'img/znaki/snowChains.svg',
  'img/znaki/speed50.svg',
  'img/znaki/stop.svg',
  'img/znaki/trafficLightAhead.svg',
  'img/znaki/turnRight.svg',
  'img/znaki/yield.svg',
  'img/znaki/yieldOncoming.svg',
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
