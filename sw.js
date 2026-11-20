/* Re-Late Kardia · VERSION LIMPIA v1.0.0 · SPDX-License-Identifier: AGPL-3.0-or-later */
const CACHE = "relate-kardia-v6";
const RECURSOS = [
  "./",
  "./index.html",
  "./mejoras.js",
  "./actividad-extra.js",
  "./inicio-panel.js",
  "./manifest.webmanifest"
];



self.addEventListener("install", (e) => {
  e.waitUntil(
    caches.open(CACHE).then((c) => c.addAll(RECURSOS)).then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches.keys()
      .then((ks) => Promise.all(ks.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (e) => {
  if (e.request.method !== "GET") return;
  e.respondWith(
    caches.match(e.request).then((r) => {
      return r || fetch(e.request).then((resp) => {
        const copia = resp.clone();
        caches.open(CACHE).then((c) => c.put(e.request, copia)).catch(() => {});
        return resp;
      }).catch(() => caches.match("./index.html"));
    })
  );
});
