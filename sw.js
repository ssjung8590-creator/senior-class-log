// v9 - Force fresh network fetch for HTML and Cloud Sync APIs
self.addEventListener('install', (e) => {
  self.skipWaiting();
});

self.addEventListener('activate', (e) => {
  e.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(keys.map(k => caches.delete(k)));
    await self.clients.claim();
    const clients = await self.clients.matchAll({ type: 'window' });
    for (const client of clients) {
      client.navigate(client.url).catch(() => {});
    }
  })());
});

self.addEventListener('fetch', (e) => {
  const url = e.request.url;
  if (e.request.mode === 'navigate' || url.includes('index.html') || url.includes('pndsn.com')) {
    e.respondWith(fetch(e.request, { cache: 'no-store' }));
  }
});
