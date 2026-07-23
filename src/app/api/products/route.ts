import { NextResponse } from "next/server";
import { getAllProducts } from "@/lib/repository/products";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const products = await getAllProducts();
    return NextResponse.json({ products, success: true });
  } catch (error) {
    console.error("[API /api/products] Error al obtener productos:", error);
    return NextResponse.json({ products: [], success: false, error: String(error) }, { status: 500 });
  }
}
