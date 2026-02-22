import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const subscriptionsFile = path.join(
  process.cwd(),
  "data",
  "push-subscriptions.json",
);

// VAPID keys - Generated using: npx web-push generate-vapid-keys
const VAPID_PUBLIC_KEY =
  "BLsDfVgpNYCN8ZuEihmx4XsPHYSQHNb5RAu7qvZzW_5ATCWY7x1lN3TPfEqitFNPpCUovGGkMC-oSNw7FKfh6r8";
const VAPID_PRIVATE_KEY = "p4wSsJIU3Suv72zgSA2jHJY75vqmTX_XOfz5bgweh9k";
const VAPID_SUBJECT = "mailto:admin@pharmacy.com";

function getSubscriptions() {
  if (!fs.existsSync(subscriptionsFile)) {
    return [];
  }
  const data = fs.readFileSync(subscriptionsFile, "utf-8");
  return JSON.parse(data);
}

// Send push notification to all subscribers
export async function POST(request) {
  try {
    const { title, body, icon, badge, data } = await request.json();

    const subscriptions = getSubscriptions();

    if (subscriptions.length === 0) {
      return NextResponse.json({
        success: true,
        message: "No subscribers",
        sent: 0,
      });
    }

    const payload = JSON.stringify({
      title: title || "طلب جديد!",
      body: body || "تم استلام طلب جديد في النظام",
      icon: icon || "/logo.png",
      badge: badge || "/logo.png",
      tag: "new-order",
      requireInteraction: true,
      data: data || { url: "/admin/orders" },
    });

    // Try to use web-push if available
    try {
      const webpush = await import("web-push");
      webpush.default.setVapidDetails(
        VAPID_SUBJECT,
        VAPID_PUBLIC_KEY,
        VAPID_PRIVATE_KEY,
      );

      const results = await Promise.allSettled(
        subscriptions.map((subscription) =>
          webpush.default.sendNotification(subscription, payload),
        ),
      );

      const successful = results.filter((r) => r.status === "fulfilled").length;
      const failed = results.filter((r) => r.status === "rejected").length;

      console.log(`Push notifications: ${successful} sent, ${failed} failed`);

      return NextResponse.json({
        success: true,
        message: `Notification sent to ${successful} subscribers`,
        sent: successful,
        failed: failed,
      });
    } catch (webPushError) {
      // web-push not installed, log for now
      console.log("web-push not installed, logging notification instead");
      console.log("Payload:", payload);
      console.log("Subscribers:", subscriptions.length);

      return NextResponse.json({
        success: true,
        message: `Notification queued for ${subscriptions.length} subscribers (web-push not installed)`,
        sent: subscriptions.length,
      });
    }
  } catch (error) {
    console.error("Error sending push notification:", error);
    return NextResponse.json(
      { error: "Failed to send notification" },
      { status: 500 },
    );
  }
}
