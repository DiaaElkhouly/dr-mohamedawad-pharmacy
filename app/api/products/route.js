import { NextResponse } from "next/server";
import { getProducts } from "@/lib/db";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category");

    let products = getProducts();

    // Filter by category if provided
    if (category && category !== "all") {
      products = products.filter((p) => p.category === category);
    }

    return NextResponse.json({
      products,
      total: products.length,
    });
  } catch (error) {
    console.error("Error fetching products:", error);
    return NextResponse.json(
      { error: "Failed to fetch products" },
      { status: 500 },
    );
  }
}
