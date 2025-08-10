// public/sw.js
const CACHE = "audio-v1";

// Match only audio files (by type or extension)
const isAudio = (req) =>
  req.destination === "audio" || /\.(mp3|m4a|wav|ogg)$/i.test(req.url);

self.addEventListener("install", (e) => {
  self.skipWaiting();
});

self.addEventListener("activate", (e) => {
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  const { request } = event;
  if (!isAudio(request)) return; // let non-audio fetch normally

  event.respondWith(
    (async () => {
      const cache = await caches.open(CACHE);
      const cached = await cache.match(request);
      if (cached) {
        return cached; // use cached copy
      }

      // fetch from network & store in cache
      const resp = await fetch(request);
      if (!resp || !resp.ok) return resp;
      event.waitUntil(cache.put(request, resp.clone()));
      return resp;
    })()
  );
});
