const CACHE = 'kardia-v3'; // sube el número en cada cambio que publiques

self.addEventListener('install', e => {
  e.waitUntil(self.skipWaiting());
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys()
      .then(ks => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  if (url.origin !== self.location.origin) return;

  e.respondWith(
    fetch(req).then(res => {
      const cp = res.clone();
      if (res.ok) caches.open(CACHE).then(c => c.put(req, cp)); // ⚠️ solo guarda respuestas OK
      return res;
    }).catch(() =>
      caches.match(req).then(hit =>
        hit || (req.mode === 'navigate' ? caches.match('./index.html') : Response.error())
      )
    )
  );
});
