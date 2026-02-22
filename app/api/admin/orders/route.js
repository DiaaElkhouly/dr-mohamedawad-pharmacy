import { NextResponse } from "next/server";
import { getOrders } from "@/lib/db";

export async function GET() {
  try {
    const orders = getOrders();

    // Sort orders by createdAt (newest first)
    orders.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    return NextResponse.json({
      orders,
      total: orders.length,
    });
  } catch (error) {
    console.error("Error fetching orders:", error);
    return NextResponse.json(
      { error: "Failed to fetch orders" },
      { status: 500 },
    );
  }
}

export async function POST() {
  return NextResponse.json({ error: "Method not allowed" }, { status: 405 });
}
