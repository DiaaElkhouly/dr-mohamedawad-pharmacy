// Push Notification Utilities
// Handles Web Push API subscription and management

// VAPID Public Key - Generated using: npx web-push generate-vapid-keys
const PUBLIC_VAPID_KEY =
  "BLsDfVgpNYCN8ZuEihmx4XsPHYSQHNb5RAu7qvZzW_5ATCWY7x1lN3TPfEqitFNPpCUovGGkMC-oSNw7FKfh6r8";

// Convert VAPID key to Uint8Array
function urlBase64ToUint8Array(base64String) {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");
  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);
  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

// Register Service Worker
export async function registerServiceWorker() {
  if (!("serviceWorker" in navigator)) {
    console.log("Service Worker not supported");
    return null;
  }

  try {
    const registration = await navigator.serviceWorker.register("/sw.js");
    console.log("Service Worker registered:", registration);
    return registration;
  } catch (error) {
    console.error("Service Worker registration failed:", error);
    return null;
  }
}

// Subscribe to push notifications
export async function subscribeToPush(registration) {
  if (!registration) {
    console.log("No Service Worker registration");
    return null;
  }

  try {
    // Check if already subscribed
    let subscription = await registration.pushManager.getSubscription();

    if (subscription) {
      console.log("Already subscribed:", subscription);
      return subscription;
    }

    // Subscribe
    subscription = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array(PUBLIC_VAPID_KEY),
    });

    console.log("Push subscription:", subscription);

    // Send subscription to server
    await sendSubscriptionToServer(subscription);

    return subscription;
  } catch (error) {
    console.error("Push subscription failed:", error);
    return null;
  }
}

// Send subscription to server
async function sendSubscriptionToServer(subscription) {
  try {
    const response = await fetch("/api/push/subscribe", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(subscription),
    });

    if (!response.ok) {
      throw new Error("Failed to send subscription to server");
    }

    console.log("Subscription sent to server");
  } catch (error) {
    console.error("Error sending subscription:", error);
  }
}

// Unsubscribe from push notifications
export async function unsubscribeFromPush() {
  if (!("serviceWorker" in navigator)) {
    return;
  }

  const registration = await navigator.serviceWorker.ready;
  const subscription = await registration.pushManager.getSubscription();

  if (subscription) {
    await subscription.unsubscribe();
    console.log("Unsubscribed from push notifications");

    // Notify server
    try {
      await fetch("/api/push/unsubscribe", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ endpoint: subscription.endpoint }),
      });
    } catch (error) {
      console.error("Error notifying server:", error);
    }
  }
}

// Request notification permission
export async function requestNotificationPermission() {
  if (!("Notification" in window)) {
    console.log("Notifications not supported");
    return false;
  }

  const permission = await Notification.requestPermission();
  return permission === "granted";
}

// Initialize push notifications
export async function initializePushNotifications() {
  // Request permission first
  const permissionGranted = await requestNotificationPermission();
  if (!permissionGranted) {
    console.log("Notification permission denied");
    return false;
  }

  // Register Service Worker
  const registration = await registerServiceWorker();
  if (!registration) {
    return false;
  }

  // Subscribe to push
  const subscription = await subscribeToPush(registration);
  return !!subscription;
}

// Check if push is supported
export function isPushSupported() {
  return "serviceWorker" in navigator && "PushManager" in window;
}

// Check if basic notifications are supported (works on all modern browsers)
export function isNotificationSupported() {
  return "Notification" in window;
}

// Check current push subscription status
export async function getPushSubscriptionStatus() {
  if (!isPushSupported()) {
    return {
      supported: false,
      permission: "unsupported",
      subscribed: false,
      subscription: null,
    };
  }

  const permission = Notification.permission;

  try {
    const registration = await navigator.serviceWorker.ready;
    const subscription = await registration.pushManager.getSubscription();

    return {
      supported: true,
      permission: permission,
      subscribed: !!subscription,
      subscription: subscription,
    };
  } catch (error) {
    console.error("Error checking subscription status:", error);
    return {
      supported: true,
      permission: permission,
      subscribed: false,
      subscription: null,
      error: error.message,
    };
  }
}

// Get notification status for all browsers (basic notification permission)
export function getNotificationStatus() {
  if (!isNotificationSupported()) {
    return {
      supported: false,
      permission: "unsupported",
      granted: false,
    };
  }

  return {
    supported: true,
    permission: Notification.permission,
    granted: Notification.permission === "granted",
  };
}

// Initialize notifications for all browsers
// Returns true if notifications are enabled (either push or basic)
export async function initializeNotifications() {
  // First check if basic notifications are supported
  if (!isNotificationSupported()) {
    console.log("Notifications not supported in this browser");
    return false;
  }

  // Request permission if not already granted
  let permission = Notification.permission;
  if (permission === "default") {
    permission = await Notification.requestPermission();
  }

  if (permission !== "granted") {
    console.log("Notification permission denied");
    return false;
  }

  // Try to set up push notifications if supported
  if (isPushSupported()) {
    try {
      const registration = await registerServiceWorker();
      if (registration) {
        const subscription = await subscribeToPush(registration);
        return !!subscription;
      }
    } catch (error) {
      console.error(
        "Push setup failed, falling back to basic notifications:",
        error,
      );
      // Fall back to basic notifications
      return true;
    }
  }

  // Basic notifications are enabled (even without push)
  return true;
}

// Show notification - works on all browsers
export function showNotification(title, options = {}) {
  if (!isNotificationSupported() || Notification.permission !== "granted") {
    console.log("Cannot show notification: permission not granted");
    return;
  }

  // Try to use service worker notification for better support
  if (isPushSupported() && navigator.serviceWorker?.ready) {
    navigator.serviceWorker.ready
      .then((registration) => {
        registration.showNotification(title, {
          icon: "/logo.png",
          badge: "/logo.png",
          ...options,
        });
      })
      .catch(() => {
        // Fallback to regular notification
        new Notification(title, {
          icon: "/logo.png",
          ...options,
        });
      });
  } else {
    // Basic notification for browsers without service worker
    new Notification(title, {
      icon: "/logo.png",
      ...options,
    });
  }
}
