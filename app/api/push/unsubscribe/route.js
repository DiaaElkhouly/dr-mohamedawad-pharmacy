import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const subscriptionsFile = path.join(
  process.cwd(),
  "data",
  "push-subscriptions.json",
);

function getSubscriptions() {
  if (!fs.existsSync(subscriptionsFile)) {
    return [];
  }
  const data = fs.readFileSync(subscriptionsFile, "utf-8");
  return JSON.parse(data);
}

function removeSubscription(endpoint) {
  const subscriptions = getSubscriptions();
  const filtered = subscriptions.filter((sub) => sub.endpoint !== endpoint);
  fs.writeFileSync(subscriptionsFile, JSON.stringify(filtered, null, 2));
}

export async function POST(request) {
  try {
    const { endpoint } = await request.json();

    if (!endpoint) {
      return NextResponse.json({ error: "Endpoint required" }, { status: 400 });
    }

    removeSubscription(endpoint);

    return NextResponse.json({
      success: true,
      message: "Subscription removed",
    });
  } catch (error) {
    console.error("Error removing subscription:", error);
    return NextResponse.json(
      { error: "Failed to remove subscription" },
      { status: 500 },
    );
  }
}
