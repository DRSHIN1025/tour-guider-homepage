// Service Worker for Push Notifications
const CACHE_NAME = 'tour-guider-v1';
const STATIC_CACHE = 'tour-guider-static-v1';

// Install event - cache static assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(STATIC_CACHE).then((cache) => {
      return cache.addAll([
        '/',
        '/offline.html',
        '/manifest.json'
      ]);
    })
  );
  self.skipWaiting();
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== STATIC_CACHE && cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// Push event - handle push notifications
self.addEventListener('push', (event) => {
  if (!event.data) return;

  try {
    const data = event.data.json();
    const options = {
      body: data.message || '새로운 알림이 있습니다.',
      icon: '/favicon.ico',
      badge: '/favicon.ico',
      tag: data.tag || 'default',
      data: data.data || {},
      actions: data.actions || [],
      requireInteraction: data.requireInteraction || false,
      silent: false,
      vibrate: [200, 100, 200],
      timestamp: Date.now()
    };

    // Show notification
    event.waitUntil(
      self.registration.showNotification(data.title || '투어가이더', options)
    );
  } catch (error) {
    console.error('Push notification error:', error);
    
    // Fallback notification
    const fallbackOptions = {
      body: '새로운 알림이 있습니다.',
      icon: '/favicon.ico',
      badge: '/favicon.ico',
      tag: 'fallback'
    };

    event.waitUntil(
      self.registration.showNotification('투어가이더', fallbackOptions)
    );
  }
});

// Notification click event
self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  if (event.action) {
    // Handle custom actions
    handleNotificationAction(event.action, event.notification.data);
  } else {
    // Default click behavior - focus or open the app
    event.waitUntil(
      self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clients) => {
        if (clients.length > 0) {
          // Focus existing window
          clients[0].focus();
        } else {
          // Open new window
          self.clients.openWindow('/');
        }
      })
    );
  }
});

// Handle notification actions
function handleNotificationAction(action, data) {
  switch (action) {
    case 'view_payment':
      if (data.paymentId) {
        self.clients.openWindow(`/dashboard?tab=payments&payment=${data.paymentId}`);
      }
      break;
    case 'view_quote':
      if (data.quoteId) {
        self.clients.openWindow(`/dashboard?tab=quotes&quote=${data.quoteId}`);
      }
      break;
    case 'contact_support':
      self.clients.openWindow('/about');
      break;
    default:
      self.clients.openWindow('/');
  }
}

// Background sync for offline functionality
self.addEventListener('sync', (event) => {
  if (event.tag === 'background-sync') {
    event.waitUntil(doBackgroundSync());
  }
});

async function doBackgroundSync() {
  try {
    // Implement background sync logic here
    // For example, sync offline data when connection is restored
    console.log('Background sync completed');
  } catch (error) {
    console.error('Background sync failed:', error);
  }
}

// Fetch event - handle offline functionality
self.addEventListener('fetch', (event) => {
  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request).catch(() => {
        return caches.match('/offline.html');
      })
    );
  }
});
