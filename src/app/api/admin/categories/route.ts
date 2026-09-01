import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { Category } from "@/lib/models";
import { requireAdmin, isAdminResponse } from "@/lib/api-auth";

export async function GET(request: NextRequest) {
  try {
    const auth = await requireAdmin(request);
    if (isAdminResponse(auth)) return auth;
    await connectToDatabase();
    const categories = await Category.find({ active: true }).sort({ displayOrder: 1 }).lean();
    return NextResponse.json({ success: true, data: categories });
  } catch (error) {
    console.error("Categories GET error:", error);
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const auth = await requireAdmin(request);
    if (isAdminResponse(auth)) return auth;
    await connectToDatabase();
    const body = await request.json();
    if (!body.name) {
      return NextResponse.json({ success: false, message: "Name is required" }, { status: 400 });
    }
    if (!body.slug) {
      body.slug = body.name.toLowerCase().replace(/[^\w\s-]/g, "").replace(/[\s_]+/g, "-").replace(/^-+|-+$/g, "");
    }
    const category = await Category.create(body);
    return NextResponse.json({ success: true, data: category }, { status: 201 });
  } catch (error) {
    console.error("Category POST error:", error);
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 });
  }
}
