import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

// File to store push subscriptions
const subscriptionsFile = path.join(
  process.cwd(),
  "data",
  "push-subscriptions.json",
);

// Ensure subscriptions file exists
function ensureSubscriptionsFile() {
  if (!fs.existsSync(subscriptionsFile)) {
    fs.writeFileSync(subscriptionsFile, JSON.stringify([], null, 2));
  }
}

// Get all subscriptions
function getSubscriptions() {
  ensureSubscriptionsFile();
  const data = fs.readFileSync(subscriptionsFile, "utf-8");
  return JSON.parse(data);
}

// Save subscription
function saveSubscription(subscription) {
  const subscriptions = getSubscriptions();

  // Check if already exists
  const exists = subscriptions.some(
    (sub) => sub.endpoint === subscription.endpoint,
  );

  if (!exists) {
    subscriptions.push({
      ...subscription,
      createdAt: new Date().toISOString(),
    });
    fs.writeFileSync(subscriptionsFile, JSON.stringify(subscriptions, null, 2));
    return true;
  }

  return false;
}

export async function POST(request) {
  try {
    const subscription = await request.json();

    if (!subscription || !subscription.endpoint) {
      return NextResponse.json(
        { error: "Invalid subscription data" },
        { status: 400 },
      );
    }

    const saved = saveSubscription(subscription);

    return NextResponse.json({
      success: true,
      message: saved ? "Subscription saved" : "Already subscribed",
    });
  } catch (error) {
    console.error("Error saving subscription:", error);
    return NextResponse.json(
      { error: "Failed to save subscription" },
      { status: 500 },
    );
  }
}
