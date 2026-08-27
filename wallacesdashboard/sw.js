// Wallace's Dashboard — Service Worker
// Handles: offline caching, push notifications, notification clicks

const CACHE_NAME = 'wallace-v12';
const SHELL = [
  '/', '/index.html', '/health.html', '/gym.html',
  '/finance.html', '/notifications.html',
  '/calendar.html', '/notifications.js', '/topbar.js',
  '/icons/w-192.png', '/icons/w-512.png', '/manifest.json'
];

// ── Install: cache app shell ──────────────────────────────────────────────
self.addEventListener('install', e => {
  self.skipWaiting();
  e.waitUntil(
    caches.open(CACHE_NAME).then(cache =>
      cache.addAll(SHELL).catch(() => {}) // soft fail for missing files
    )
  );
});

// ── Activate: clean old caches ───────────────────────────────────────────
self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

// ── Fetch: network-first for API, cache-first for shell ──────────────────
self.addEventListener('fetch', e => {
  const url = new URL(e.request.url);
  // Always pass through API calls and external resources
  if (!url.pathname.startsWith('/') || url.origin !== self.location.origin) return;
  if (url.pathname.startsWith('/api/') || url.pathname.startsWith('/yahoo-proxy/')) return;

  e.respondWith(
    fetch(e.request)
      .then(res => {
        if (res.ok) {
          const clone = res.clone();
          caches.open(CACHE_NAME).then(c => c.put(e.request, clone));
        }
        return res;
      })
      .catch(() => caches.match(e.request))
  );
});

// ── Push: show notification from push server ──────────────────────────────
self.addEventListener('push', e => {
  let data = { title: "Wallace's Dashboard", body: 'Check your dashboard.' };
  try { if (e.data) data = e.data.json(); } catch {}
  e.waitUntil(
    self.registration.showNotification(data.title, {
      body: data.body,
      icon: '/icons/w-192.png',
      badge: '/icons/w-192.png',
      tag: data.tag || 'dashboard',
      renotify: true,
      data: { url: data.url || '/index.html' }
    })
  );
});

// ── Message: show notification triggered from page JS ────────────────────
self.addEventListener('message', e => {
  if (!e.data || e.data.type !== 'SHOW_NOTIFICATION') return;
  self.registration.showNotification(e.data.title, {
    body: e.data.body,
    icon: '/icons/w-192.png',
    badge: '/icons/w-192.png',
    tag: e.data.tag || 'dashboard',
    renotify: true,
    data: { url: e.data.url || '/index.html' }
  });
});

// ── Notification click: open / focus the app ─────────────────────────────
self.addEventListener('notificationclick', e => {
  e.notification.close();
  const target = (e.notification.data && e.notification.data.url) || '/index.html';
  e.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then(list => {
      const existing = list.find(c => c.url.includes(self.location.origin));
      if (existing) return existing.focus();
      return clients.openWindow(target);
    })
  );
});
