import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { Product } from "@/lib/models";

export async function GET(_request: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  try {
    await connectToDatabase();
    const { slug } = await params;
    const product = await Product.findOne({ slug, active: true }).lean();
    if (!product) {
      return NextResponse.json({ success: false, message: "Product not found" }, { status: 404 });
    }
    return NextResponse.json({ success: true, data: product });
  } catch (error) {
    console.error("Product detail error:", error);
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 });
  }
}
