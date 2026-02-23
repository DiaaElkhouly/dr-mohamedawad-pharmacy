// Service Worker for PWA and Push Notifications
const CACHE_NAME = "pharmacy-pwa-v1";
const STATIC_CACHE = "pharmacy-static-v1";
const DYNAMIC_CACHE = "pharmacy-dynamic-v1";

// Assets to cache on install
const STATIC_ASSETS = [
  "/",
  "/logo.png",
  "/logo-192x192.png",
  "/logo-512x512.png",
  "/bg-hero.jpg",
  "/manifest.json",
  "/globals.css",
];

// Install event - cache assets
self.addEventListener("install", (event) => {
  console.log("Service Worker installing...");

  event.waitUntil(
    caches.open(STATIC_CACHE).then((cache) => {
      console.log("Caching static assets");
      return cache.addAll(STATIC_ASSETS).catch((err) => {
        console.log("Some assets failed to cache:", err);
        // Continue even if some assets fail
        return Promise.resolve();
      });
    }),
  );

  self.skipWaiting();
});

// Activate event - clean old caches and claim clients
self.addEventListener("activate", (event) => {
  console.log("Service Worker activating...");

  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((name) => {
            return (
              name.startsWith("pharmacy-") &&
              name !== STATIC_CACHE &&
              name !== DYNAMIC_CACHE
            );
          })
          .map((name) => {
            console.log("Deleting old cache:", name);
            return caches.delete(name);
          }),
      );
    }),
  );

  event.waitUntil(self.clients.claim());
});

// Push event - handle incoming push notifications
self.addEventListener("push", (event) => {
  console.log("Push received:", event);

  let data = {};
  try {
    data = event.data.json();
  } catch (e) {
    data = {
      title: "طلب جديد!",
      body: "تم استلام طلب جديد في النظام",
      icon: "/logo.png",
      badge: "/logo.png",
      tag: "new-order",
      requireInteraction: true,
      data: {
        url: "/admin/orders",
      },
    };
  }

  const options = {
    body: data.body || "تم استلام طلب جديد",
    icon: data.icon || "/logo.png",
    badge: data.badge || "/logo.png",
    tag: data.tag || "new-order",
    requireInteraction: data.requireInteraction !== false,
    vibrate: [200, 100, 200],
    data: data.data || { url: "/admin/orders" },
    actions: [
      {
        action: "open",
        title: "فتح الطلبات",
        icon: "/logo.png",
      },
      {
        action: "close",
        title: "إغلاق",
        icon: "/logo.png",
      },
    ],
  };

  event.waitUntil(
    self.registration.showNotification(data.title || "طلب جديد!", options),
  );

  // Play sound if possible
  try {
    // Try to notify all clients to play sound
    self.clients.matchAll({ type: "window" }).then((clients) => {
      clients.forEach((client) => {
        client.postMessage({
          type: "PLAY_NOTIFICATION_SOUND",
          data: data,
        });
      });
    });
  } catch (e) {
    console.log("Could not notify clients:", e);
  }
});

// Notification click event
self.addEventListener("notificationclick", (event) => {
  console.log("Notification clicked:", event);

  event.notification.close();

  const action = event.action;
  const notificationData = event.notification.data;

  if (action === "close") {
    return;
  }

  // Open the app
  event.waitUntil(
    self.clients
      .matchAll({ type: "window", includeUncontrolled: true })
      .then((clientList) => {
        // Check if app is already open
        for (const client of clientList) {
          if (client.url.includes("/admin") && "focus" in client) {
            return client.focus();
          }
        }

        // Open new window if not already open
        if (self.clients.openWindow) {
          return self.clients.openWindow(
            notificationData.url || "/admin/orders",
          );
        }
      }),
  );
});

// Fetch event - serve from cache or network
self.addEventListener("fetch", (event) => {
  // Skip non-GET requests
  if (event.request.method !== "GET") return;

  // Skip API calls
  if (event.request.url.includes("/api/")) return;

  // Skip external URLs (requests to other domains) - don't cache external resources
  const url = new URL(event.request.url);
  if (url.origin !== self.location.origin) return;

  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      // Return cached version or fetch from network
      if (cachedResponse) {
        // Update cache in background
        fetch(event.request)
          .then((networkResponse) => {
            if (networkResponse.ok) {
              caches.open(DYNAMIC_CACHE).then((cache) => {
                cache.put(event.request, networkResponse.clone());
              });
            }
          })
          .catch(() => {
            // Network failed, but we have cached version
          });
        return cachedResponse;
      }

      // Not in cache, fetch from network
      return fetch(event.request)
        .then((networkResponse) => {
          if (!networkResponse || networkResponse.status !== 200) {
            return networkResponse;
          }

          // Cache successful responses
          const responseToCache = networkResponse.clone();
          caches.open(DYNAMIC_CACHE).then((cache) => {
            cache.put(event.request, responseToCache);
          });

          return networkResponse;
        })
        .catch(() => {
          // Network failed and not in cache
          // Return offline fallback for navigation requests
          if (event.request.mode === "navigate") {
            return caches.match("/");
          }
        });
    }),
  );
});

// Message event - handle messages from main thread
self.addEventListener("message", (event) => {
  console.log("Message received in SW:", event.data);

  if (event.data && event.data.type === "SKIP_WAITING") {
    self.skipWaiting();
  }
});
