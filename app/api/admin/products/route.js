import { NextResponse } from "next/server";
import { getProducts, addProduct } from "@/lib/db";
import { Product } from "@/models/Product";

// GET all products
export async function GET() {
  try {
    const products = getProducts();
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

// POST create new product
export async function POST(request) {
  try {
    const data = await request.json();

    // Validate product data
    const validation = Product.validate(data);
    if (!validation.isValid) {
      return NextResponse.json(
        { error: "Validation failed", details: validation.errors },
        { status: 400 },
      );
    }

    // Create product using model
    const productData = Product.create(data);

    // Save to database
    const newProduct = addProduct(productData);

    return NextResponse.json(
      { product: newProduct, message: "Product created successfully" },
      { status: 201 },
    );
  } catch (error) {
    console.error("Error creating product:", error);
    return NextResponse.json(
      { error: "Failed to create product" },
      { status: 500 },
    );
  }
}
