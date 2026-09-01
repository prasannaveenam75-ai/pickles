import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { Category } from "@/lib/models";

export async function GET() {
  try {
    await connectToDatabase();
    const categories = await Category.find({ active: true }).sort({ displayOrder: 1 }).lean();
    return NextResponse.json({ success: true, data: categories });
  } catch (error) {
    console.error("Categories GET error:", error);
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 });
  }
}
