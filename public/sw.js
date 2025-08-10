// public/sw.js
const CACHE = "audio-v2"; // bump to invalidate old entries

const isAudio = (req) =>
  req.destination === "audio" || /\.(mp3|m4a|wav|ogg)$/i.test(req.url);

self.addEventListener("install", (e) => self.skipWaiting());
self.addEventListener("activate", (e) => self.clients.claim());

self.addEventListener("fetch", (event) => {
  const { request } = event;
  if (!isAudio(request)) return; // ignore non-audio

  // 1) Let byte-range requests go straight to the network.
  // Media elements often use Range for seeking/streaming. Caching partials causes stalls.
  if (request.headers.has("range")) {
    return; // no respondWith => default network fetch path
  }

  // 2) Network-first; if it fails (offline), fall back to cache.
  event.respondWith(
    (async () => {
      try {
        const net = await fetch(request, { cache: "no-store" });
        // Cache only full 200 OK responses (not partials)
        if (net && net.ok && net.status === 200) {
          const cache = await caches.open(CACHE);
          event.waitUntil(cache.put(request, net.clone()));
        }
        return net;
      } catch {
        const cache = await caches.open(CACHE);
        const hit = await cache.match(request);
        if (hit) return hit;
        // As a last resort, rethrow to let the browser show a real error
        throw new Error("offline and not cached");
      }
    })()
  );
});
