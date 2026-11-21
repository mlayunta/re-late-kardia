/* Re-Late Kardia · VERSION v3.0.0 · SPDX-License-Identifier: AGPL-3.0-or-later */
"use strict";

const VERSION = "3.2.1";
const CACHE = "relate-kardia-v" + VERSION;
const PREFIX = "relate-kardia-";
const SCOPE_URL = new URL(self.registration.scope);
const APP_URL = new URL("index.html", SCOPE_URL).href;

const RECURSOS = [
  "./",
  "./index.html",
  "./manifest.webmanifest",
  "./icon-192.png",
  "./icon-512.png"
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE)
      .then((cache) => cache.addAll(RECURSOS))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(
        keys
          .filter((key) => key.startsWith(PREFIX) && key !== CACHE)
          .map((key) => caches.delete(key))
      ))
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (event) => {
  const req = event.request;
  if (req.method !== "GET") return;

  const url = new URL(req.url);
  if (url.origin !== SCOPE_URL.origin) return;

  // Navegación: red primero, con respaldo en caché (offline)
  if (req.mode === "navigate") {
    event.respondWith(
      fetch(req)
        .then((res) => {
          const copy = res.clone();
          caches.open(CACHE).then((cache) => cache.put(APP_URL, copy));
          return res;
        })
        .catch(() => caches.match(APP_URL).then((r) => r || caches.match("./index.html")))
    );
    return;
  }

  // Resto de recursos: caché primero, con respaldo en red
  event.respondWith(
    caches.match(req).then((cached) => {
      if (cached) return cached;
      return fetch(req).then((res) => {
        if (res && res.status === 200 && res.type === "basic") {
          const copy = res.clone();
          caches.open(CACHE).then((cache) => cache.put(req, copy));
        }
        return res;
      });
    })
  );
});
