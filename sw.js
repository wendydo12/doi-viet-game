// SW — "Cơm Bụi & Deadline": precache toàn bộ game (1 file index + src + assets)
// Chơi offline hoàn toàn; save lives in localStorage (không thuộc SW)
const V = 'com-bui-v26';
const PRECACHE = [
  '/index.html',
  '/manifest.webmanifest',
  '/src/core.js?v=26', '/src/pixelicons.js?v=26', '/src/canh3tp.js?v=26', '/src/game.js?v=26', '/src/render8.js?v=26',
  // meowa-r1
  '/assets/meowa-r1/char_00.png', '/assets/meowa-r1/char_01.png', '/assets/meowa-r1/char_02.png',
  '/assets/meowa-r1/char_03.png', '/assets/meowa-r1/char_04.png', '/assets/meowa-r1/char_05.png',
  '/assets/meowa-r1/char_06.png', '/assets/meowa-r1/char_07.png',
  '/assets/meowa-r1/food_00.png', '/assets/meowa-r1/food_01.png', '/assets/meowa-r1/food_02.png',
  '/assets/meowa-r1/food_03.png', '/assets/meowa-r1/food_04.png', '/assets/meowa-r1/food_05.png',
  '/assets/meowa-r1/food_06.png', '/assets/meowa-r1/food_07.png',
  '/assets/meowa-r1/scene_00.png',
  // portrait nữ
  '/assets/portrait/nu_01.png', '/assets/portrait/nu_02.png', '/assets/portrait/nu_03.png',
  '/assets/portrait/nu_04.png', '/assets/portrait/nu_05.png', '/assets/portrait/nu_06.png',
  // sfx + bgm
  '/assets/sfx/bgm_lofi_16bit.mp3', '/assets/sfx/sfx_8bit_game_1.mp3',
  '/assets/sfx/sfx_8bit_game_2.mp3', '/assets/sfx/sfx_8bit_game_3.mp3',
  '/assets/sfx/sfx_8bit_game_5.mp3', '/assets/sfx/sfx_peach_game_over_3.mp3',
  // icons
  '/assets/icon-192.png', '/assets/icon-512.png', '/assets/apple-touch-icon.png',
];

self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(V).then((c) => c.addAll(PRECACHE))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== V).map((k) => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

// Navigation: network-first (code mới nhất khi online) → fallback cache index.html (offline)
// Assets: cache-first (tải 1 lần, sau đó 100% offline)
self.addEventListener('fetch', (e) => {
  const url = new URL(e.request.url);
  if (url.origin !== self.location.origin) return;
  if (e.request.method !== 'GET') return;

  if (e.request.mode === 'navigate') {
    e.respondWith(
      fetch(e.request)
        .then((res) => {
          const copy = res.clone();
          caches.open(V).then((c) => c.put(e.request, copy));
          return res;
        })
        .catch(() => caches.match(e.request).then((r) => r || caches.match('/index.html')))
    );
    return;
  }

  e.respondWith(
    caches.match(e.request).then((hit) =>
      hit ||
      fetch(e.request).then((res) => {
        if (res.ok && res.status === 200) {
          const copy = res.clone();
          caches.open(V).then((c) => c.put(e.request, copy));
        }
        return res;
      })
    )
  );
});
