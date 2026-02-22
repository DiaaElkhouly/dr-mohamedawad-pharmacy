# Push Notifications Setup Guide

## Overview

This implementation adds background push notifications that work even when the admin page is closed. The admin will receive desktop notifications on their computer or phone when new orders arrive.

## Files Created/Modified

### 1. Service Worker (`public/sw.js`)

- Handles push events in the background
- Displays notifications when the page is closed
- Opens the app when notification is clicked

### 2. Push Utilities (`lib/pushNotifications.js`)

- Registers Service Worker
- Subscribes to push notifications
- Manages subscription storage

### 3. API Endpoints

- `app/api/push/subscribe/route.js` - Store push subscriptions
- `app/api/push/unsubscribe/route.js` - Remove subscriptions
- `app/api/push/send/route.js` - Send push notifications

### 4. Order Creation (`app/api/orders/route.js`)

- Automatically sends push notification when new order is created
- Works even if admin page is closed

### 5. Admin Layout (`app/(admin)/layout.js`)

- Auto-registers Service Worker on admin page load
- Initializes push notifications

## Setup Instructions

### Step 1: Generate VAPID Keys

```bash
npx web-push generate-vapid-keys
```

### Step 2: Update VAPID Key

Replace `YOUR_VAPID_PUBLIC_KEY_HERE` in `lib/pushNotifications.js` with your generated public key.

### Step 3: Install web-push (for production)

```bash
npm install web-push
```

### Step 4: Update Push Send API

In `app/api/push/send/route.js`, uncomment and implement the web-push logic with your VAPID keys.

## How It Works

1. **Admin opens admin page** → Service Worker registers automatically
2. **Admin grants notification permission** → Browser subscribes to push
3. **Customer creates order** → Server sends push to all subscribed admins
4. **Admin receives notification** → Even if browser is closed/minimized
5. **Admin clicks notification** → Opens the orders page

## Browser Support

- Chrome (desktop & mobile)
- Firefox
- Edge
- Safari (limited support)

## Important Notes

- Requires HTTPS in production (localhost works for testing)
- User must grant notification permission
- Works on Android Chrome even when browser is closed
- iOS Safari has limited support (requires PWA installation)

## Testing

1. Open http://localhost:3001/admin/orders
2. Grant notification permission when prompted
3. Create a new order from customer side
4. Close the admin tab
5. You should still receive a desktop notification!
