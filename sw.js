// cache app
const CACHE = "tgq-v1";
const SHELL = ["./", "index.html", "manifest.webmanifest", "icon.svg"];

self.addEventListener("install", (e) => {
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll(SHELL)).then(() => self.skipWaiting()));
});
self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== CACHE && !k.startsWith("transformers")).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});
self.addEventListener("fetch", (e) => {
  const u = new URL(e.request.url);
  if (e.request.method !== "GET") return;
  const sameOrigin = u.origin === location.origin;
  if (!sameOrigin && u.hostname !== "cdn.jsdelivr.net") return;
  const store = (res) => { if (res.ok) { const copy = res.clone(); caches.open(CACHE).then((c) => c.put(e.request, copy)); } return res; };
  if (sameOrigin) {
    // network first
    e.respondWith(fetch(e.request).then(store).catch(() => caches.match(e.request, { ignoreSearch: true })));
  } else {
    // cache first
    e.respondWith(caches.match(e.request).then((hit) => hit || fetch(e.request).then(store)));
  }
});
