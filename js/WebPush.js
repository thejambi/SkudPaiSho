/**
 * Web Push Notifications Module
 * Handles service worker registration and push subscription management
 */

import { onlinePlayEngine } from './PaiShoMain';
import { PREF_WEB_PUSH_SUBSCRIPTION, PREF_CHAT_NOTIFICATIONS } from './preferenceTypes';

const WEB_PUSH_ENABLED_KEY = 'webPushEnabled';
const WEB_PUSH_SUBSCRIPTION_KEY = 'webPushSubscription';
const CHAT_NOTIFICATIONS_ENABLED_KEY = 'chatNotificationsEnabled';

// VAPID public key - REPLACE THIS with your generated key from generateVapidKeys.php
const VAPID_PUBLIC_KEY = 'BAilGVU4jYQKHHZTI8bG_d74-OZxMsyzDNcFLnR3hfwn4CSx1H-L_QmVhup_PZSpxszk3kUmlNHpN8c90wmgZnY';

let swRegistration = null;

/**
 * Convert base64url-encoded VAPID key to Uint8Array for Push API
 */
function urlBase64ToUint8Array(base64String) {
    const padding = '='.repeat((4 - base64String.length % 4) % 4);
    const base64 = (base64String + padding)
        .replace(/-/g, '+')
        .replace(/_/g, '/');

    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);

    for (let i = 0; i < rawData.length; ++i) {
        outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
}

/**
 * Check if push notifications are supported in this browser
 */
export function isPushSupported() {
    return 'serviceWorker' in navigator &&
           'PushManager' in window &&
           'Notification' in window;
}

/**
 * Check if web push is currently enabled for this user
 */
export function isWebPushEnabled() {
    return localStorage.getItem(WEB_PUSH_ENABLED_KEY) === 'true';
}

/**
 * Register the service worker
 * Call this on app initialization
 */
export async function registerServiceWorker() {
    if (!('serviceWorker' in navigator)) {
        console.log('Service workers not supported');
        return null;
    }

    try {
        // Use variable to avoid Parcel's static analysis of service worker path
        const swPath = '/sw.js';
        swRegistration = await navigator.serviceWorker.register(swPath, {
            scope: '/'
        });
        console.log('Service Worker registered:', swRegistration.scope);
        return swRegistration;
    } catch (error) {
        console.error('Service Worker registration failed:', error);
        return null;
    }
}

/**
 * Get current push subscription status
 */
export async function getSubscriptionStatus() {
    if (!swRegistration) {
        try {
            swRegistration = await navigator.serviceWorker.ready;
        } catch (error) {
            return { isSubscribed: false, subscription: null };
        }
    }

    try {
        const subscription = await swRegistration.pushManager.getSubscription();
        return {
            isSubscribed: !!subscription,
            subscription: subscription
        };
    } catch (error) {
        console.error('Error getting subscription status:', error);
        return { isSubscribed: false, subscription: null };
    }
}

/**
 * Subscribe to push notifications
 * @param {Object} loginToken - Login token from getLoginToken()
 * @returns {PushSubscription|null} The subscription or null if failed
 */
export async function subscribeToPush(loginToken) {
    if (!isPushSupported()) {
        console.log('Push notifications not supported');
        return null;
    }

    if (!loginToken || !loginToken.userId) {
        console.log('Must be logged in to subscribe to push');
        return null;
    }

    // Check notification permission (don't request here - should be done by caller on user gesture)
    if (Notification.permission !== 'granted') {
        console.log('Notification permission not granted');
        return null;
    }

    // Ensure service worker is ready
    try {
        swRegistration = await navigator.serviceWorker.ready;
        console.log('Service worker ready, state:', swRegistration.active?.state);
    } catch (error) {
        console.error('Service worker not ready:', error);
        return null;
    }

    try {
        // Check for existing subscription first
        let existingSubscription = await swRegistration.pushManager.getSubscription();
        if (existingSubscription) {
            console.log('Found existing subscription, unsubscribing first to get fresh subscription...');
            await existingSubscription.unsubscribe();
            existingSubscription = null;
        }

        console.log('Creating new push subscription...');
        console.log('VAPID key length:', VAPID_PUBLIC_KEY.length);
        const applicationServerKey = urlBase64ToUint8Array(VAPID_PUBLIC_KEY);
        console.log('Converted key length:', applicationServerKey.length, '(should be 65)');

        // Subscribe to push manager
        const subscription = await swRegistration.pushManager.subscribe({
            userVisibleOnly: true,
            applicationServerKey: applicationServerKey
        });

        console.log('Push subscription created:', subscription);

        // Save subscription to backend
        const subscriptionJson = JSON.stringify(subscription.toJSON());

        onlinePlayEngine.addUserPreferenceValue(
            loginToken,
            PREF_WEB_PUSH_SUBSCRIPTION,
            subscriptionJson,
            () => {
                console.log('Web push subscription saved to server');
                localStorage.setItem(WEB_PUSH_ENABLED_KEY, 'true');
                localStorage.setItem(WEB_PUSH_SUBSCRIPTION_KEY, subscriptionJson);
            }
        );

        return subscription;
    } catch (error) {
        console.error('Failed to subscribe to push:', error);
        console.error('Error name:', error.name);
        console.error('Error message:', error.message);
        if (error.stack) console.error('Stack:', error.stack);
        return null;
    }
}

/**
 * Unsubscribe from push notifications
 */
export async function unsubscribeFromPush() {
    const { subscription } = await getSubscriptionStatus();

    if (subscription) {
        try {
            await subscription.unsubscribe();
            console.log('Unsubscribed from push notifications');
        } catch (error) {
            console.error('Error unsubscribing:', error);
        }
    }

    localStorage.removeItem(WEB_PUSH_ENABLED_KEY);
    localStorage.removeItem(WEB_PUSH_SUBSCRIPTION_KEY);
}

/**
 * Initialize web push system
 * Call this once on app startup
 */
export async function initWebPush() {
    if (!isPushSupported()) {
        console.log('Web Push not supported in this browser');
        return;
    }

    // Clear app badge when app opens (Android PWA)
    if (navigator.clearAppBadge) {
        navigator.clearAppBadge();
    }

    await registerServiceWorker();
}

/**
 * Sync local storage state with actual subscription status
 * Call this after login verification
 * @param {Object} loginToken - Login token from getLoginToken()
 */
export async function saveWebPushSubscriptionIfNeeded(loginToken) {
    if (!isPushSupported() || !loginToken || !loginToken.userId) {
        return;
    }

    // Just sync the local storage state with actual subscription status
    // Don't auto-subscribe - let user explicitly enable via checkbox
    const { isSubscribed } = await getSubscriptionStatus();

    if (isSubscribed) {
        localStorage.setItem(WEB_PUSH_ENABLED_KEY, 'true');
    } else {
        // If not subscribed, clear the enabled flag
        localStorage.removeItem(WEB_PUSH_ENABLED_KEY);
    }
}

/**
 * Check if chat notifications are currently enabled
 */
export function isChatNotificationsEnabled() {
    return localStorage.getItem(CHAT_NOTIFICATIONS_ENABLED_KEY) === 'true';
}

/**
 * Enable chat notifications
 * @param {Object} loginToken - Login token from getLoginToken()
 * @returns {boolean} Success status
 */
export async function enableChatNotifications(loginToken) {
    if (!loginToken || !loginToken.userId) {
        console.log('Must be logged in to enable chat notifications');
        return false;
    }

    return new Promise((resolve) => {
        onlinePlayEngine.addUserPreferenceValue(
            loginToken,
            PREF_CHAT_NOTIFICATIONS,
            'true',
            () => {
                console.log('Chat notifications enabled');
                localStorage.setItem(CHAT_NOTIFICATIONS_ENABLED_KEY, 'true');
                resolve(true);
            }
        );
    });
}

/**
 * Disable chat notifications
 * @param {Object} loginToken - Login token from getLoginToken()
 * @returns {boolean} Success status
 */
export async function disableChatNotifications(loginToken) {
    if (!loginToken || !loginToken.userId) {
        console.log('Must be logged in to disable chat notifications');
        return false;
    }

    return new Promise((resolve) => {
        onlinePlayEngine.addUserPreferenceValue(
            loginToken,
            PREF_CHAT_NOTIFICATIONS,
            'false',
            () => {
                console.log('Chat notifications disabled');
                localStorage.removeItem(CHAT_NOTIFICATIONS_ENABLED_KEY);
                resolve(true);
            }
        );
    });
}
