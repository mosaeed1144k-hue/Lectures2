const CACHE_NAME = 'lectures-app-v1';
const urlsToCache = [
  './',
  './index.html',
  './manifest.json',
  './sw.js'
];

// تثبيت SW وتهيئة الكاش
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(urlsToCache))
      .then(() => self.skipWaiting())
  );
});

// تفعيل SW وحذف الكاش القديم
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys.filter(key => key !== CACHE_NAME)
            .map(key => caches.delete(key))
      )
    )
  );
});

// جلب الملفات من الكاش أولًا، ثم الشبكة
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(response => {
      if (response) return response;
      return fetch(event.request).catch(() => {
        // لو Offline ومافيش الملف في الكاش، نعرض index.html
        if (event.request.destination === 'document') return caches.match('./index.html');
      });
    })
  );
});
