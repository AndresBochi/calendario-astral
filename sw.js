/* Service worker: lets the installed app open offline.
   The app's own files are fetched fresh when online (so updates show up right
   away) and served from the cache when offline or when the network is too slow.
   Fonts are served from the cache and refreshed in the background. Town lookups
   (OpenStreetMap) are left alone: they need internet anyway. */

const CACHE = "calendario-astral-v1";
const NETWORK_TIMEOUT = 3000;

// On install, cache the page and every local file it links to (the ?v= versions
// it currently uses), so the first offline launch already works.
self.addEventListener("install", (event) => {
  event.waitUntil((async () => {
    const cache = await caches.open(CACHE);
    const res = await fetch("./", { cache: "no-cache" });
    const html = await res.clone().text();
    await cache.put("./", res);
    const links = [...html.matchAll(/(?:src|href)="([^"]+)"/g)]
      .map((m) => m[1])
      .filter((url) => !/^(https?:)?\/\//.test(url));
    await cache.addAll([...new Set(["manifest.webmanifest", ...links])]);
    await self.skipWaiting();
  })());
});

self.addEventListener("activate", (event) => {
  event.waitUntil((async () => {
    for (const key of await caches.keys()) if (key !== CACHE) await caches.delete(key);
    await self.clients.claim();
  })());
});

async function networkFirst(request) {
  const cache = await caches.open(CACHE);
  const network = fetch(request).then((res) => {
    if (res.ok) cache.put(request, res.clone());
    return res;
  });
  const timeout = new Promise((resolve) => setTimeout(resolve, NETWORK_TIMEOUT));
  try {
    const res = await Promise.race([network, timeout]);
    if (res) return res;
  } catch {}
  const cached = await cache.match(request, { ignoreSearch: request.mode === "navigate" });
  return cached || network;
}

async function staleWhileRevalidate(request) {
  const cache = await caches.open(CACHE);
  const cached = await cache.match(request);
  const network = fetch(request).then((res) => {
    if (res.ok || res.type === "opaque") cache.put(request, res.clone());
    return res;
  });
  return cached || network;
}

self.addEventListener("fetch", (event) => {
  const { request } = event;
  if (request.method !== "GET") return;
  const url = new URL(request.url);
  if (url.origin === location.origin) {
    event.respondWith(networkFirst(request));
  } else if (url.hostname === "fonts.googleapis.com" || url.hostname === "fonts.gstatic.com") {
    event.respondWith(staleWhileRevalidate(request));
  }
});
