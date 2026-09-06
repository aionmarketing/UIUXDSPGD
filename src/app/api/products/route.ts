import { NextResponse } from "next/server";
import { getDbProducts } from "@/db/queries";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const products = await getDbProducts();
    return NextResponse.json({
      success: true,
      products,
      count: products.length,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Erro ao carregar catálogo";
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 }
    );
  }
}
