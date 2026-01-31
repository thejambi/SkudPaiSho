/* eslint-env serviceworker */
/**
 * Service Worker for The Garden Gate PWA
 * Handles push notifications and notification clicks
 */

// Skip waiting and claim clients immediately
self.addEventListener('install', (event) => {
    self.skipWaiting();
});

self.addEventListener('activate', (event) => {
    event.waitUntil(clients.claim());
});

// Handle incoming push notifications
self.addEventListener('push', (event) => {
    let data = {
        type: 'move', // 'move' or 'chat'
        title: 'The Garden Gate',
        body: 'Your opponent made a move!',
        gameId: null,
        icon: '/android-icon-192x192.png',
        badge: '/android-icon-96x96.png'
    };

    if (event.data) {
        try {
            const payload = event.data.json();
            data = { ...data, ...payload };
        } catch (e) {
            // If not JSON, use text as body
            data.body = event.data.text();
        }
    }

    const options = {
        body: data.body,
        icon: data.icon,
        badge: data.badge,
        vibrate: [100, 50, 100],
        data: {
            gameId: data.gameId,
            url: data.gameId ? `/?gameInApp=${data.gameId}` : '/'
        },
        actions: [
            { action: 'open', title: 'Open Game' },
            { action: 'dismiss', title: 'Dismiss' }
        ],
        // Use gameId and type as tag to replace existing notifications
        tag: data.gameId ? `${data.type}-${data.gameId}` : `${data.type}-notification`,
        renotify: true,
        requireInteraction: false
    };

    // For chat notifications, suppress if any app window is focused
    if (data.type === 'chat' && data.gameId) {
        event.waitUntil(
            clients.matchAll({ type: 'window', includeUncontrolled: true })
                .then((clientList) => {
                    const appIsFocused = clientList.some(client =>
                        client.url.includes(self.location.origin) && client.focused
                    );

                    if (!appIsFocused) {
                        // Set app badge for Android PWA
                        if (navigator.setAppBadge) {
                            navigator.setAppBadge();
                        }
                        return self.registration.showNotification(data.title, options);
                    }
                })
        );
    } else {
        // Move notifications: suppress if any app window is focused
        event.waitUntil(
            clients.matchAll({ type: 'window', includeUncontrolled: true })
                .then((clientList) => {
                    const appIsFocused = clientList.some(client =>
                        client.url.includes(self.location.origin) && client.focused
                    );

                    if (!appIsFocused) {
                        // Set app badge for Android PWA
                        if (navigator.setAppBadge) {
                            navigator.setAppBadge();
                        }
                        return self.registration.showNotification(data.title, options);
                    }
                })
        );
    }
});

// Handle notification clicks
self.addEventListener('notificationclick', (event) => {
    event.notification.close();

    // Clear app badge for Android PWA
    if (navigator.clearAppBadge) {
        navigator.clearAppBadge();
    }

    // If user clicked dismiss, do nothing
    if (event.action === 'dismiss') {
        return;
    }

    const urlToOpen = event.notification.data?.url || '/';

    event.waitUntil(
        clients.matchAll({ type: 'window', includeUncontrolled: true })
            .then((clientList) => {
                // Try to find an existing window
                for (const client of clientList) {
                    if (client.url.includes(self.location.origin) && 'focus' in client) {
                        return client.focus().then(() => {
                            // Send message to app to navigate to the game
                            if (event.notification.data?.gameId) {
                                client.postMessage({
                                    type: 'NAVIGATE_TO_GAME',
                                    gameId: event.notification.data.gameId
                                });
                            }
                        });
                    }
                }
                // No existing window, open a new one
                if (clients.openWindow) {
                    return clients.openWindow(urlToOpen);
                }
            })
    );
});

// Handle notification close (for analytics if needed)
self.addEventListener('notificationclose', (event) => {
    // Could log analytics here if desired
});
