import { NextResponse } from "next/server";
import { createOrder } from "@/lib/db";

// Send push notification to all subscribers
async function sendPushNotification(orderData) {
  try {
    // Call the push send API internally
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
    await fetch(`${baseUrl}/api/push/send`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title: "طلب جديد!",
        body: `طلب جديد من ${orderData.customerName} - ${orderData.totalAmount.toFixed(2)} ج.م`,
        icon: "/logo.png",
        badge: "/logo.png",
        data: {
          url: "/admin/orders",
          orderId: orderData.id,
        },
      }),
    });
  } catch (error) {
    console.error("Error sending push notification:", error);
  }
}

export async function POST(request) {
  try {
    const body = await request.json();

    // Validate required fields
    if (
      !body.customerName ||
      !body.phone ||
      !body.address ||
      !body.items ||
      body.items.length === 0
    ) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 },
      );
    }

    // Calculate total amount
    const totalAmount = body.items.reduce((sum, item) => {
      return sum + item.price * item.quantity;
    }, 0);

    // Create order
    const order = createOrder({
      customerName: body.customerName,
      phone: body.phone,
      address: body.address,
      details: body.details || "",
      items: body.items,
      totalAmount,
    });

    // Note: Push notification removed to prevent server errors
    // The order is successfully created in the database

    return NextResponse.json(
      {
        success: true,
        order,
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("Error creating order:", error);
    return NextResponse.json(
      { error: "Failed to create order" },
      { status: 500 },
    );
  }
}

export async function GET() {
  // This endpoint is for admin only, customers should use admin endpoint
  return NextResponse.json({ error: "Method not allowed" }, { status: 405 });
}
