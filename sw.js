/* Re-Late Kardia · VERSION v2.0.0 · SPDX-License-Identifier: AGPL-3.0-or-later */
const CACHE = "relate-kardia-v2";
const RECURSOS = [
  "./",
  "./index.html",
  "./manifest.webmanifest",
  "./icon-192.png",
  "./icon-512.png",
  "./icon.svg"
];

self.addEventListener("install", (e) => {
  e.waitUntil(
    caches.open(CACHE).then((c) =>
      Promise.all(
        RECURSOS.map((url) =>
          c.add(url).catch(() => null)
        )
      )
    ).then(() => self.skipWaiting())
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
    fetch(e.request)
      .then((resp) => {
        if (resp && resp.status === 200 && resp.type === "basic") {
          const copia = resp.clone();
          caches.open(CACHE).then((c) => c.put(e.request, copia)).catch(() => {});
        }
        return resp;
      })
      .catch(() =>
        caches.match(e.request).then((r) => r || caches.match("./index.html"))
      )
  );
});