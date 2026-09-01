import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { Coupon } from "@/lib/models";
import { requireAdmin, isAdminResponse } from "@/lib/api-auth";

export async function GET(request: NextRequest) {
  try {
    const auth = await requireAdmin(request);
    if (isAdminResponse(auth)) return auth;
    await connectToDatabase();
    const coupons = await Coupon.find().sort({ createdAt: -1 }).lean();
    return NextResponse.json({ success: true, data: coupons });
  } catch (error) {
    console.error("Coupons GET error:", error);
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const auth = await requireAdmin(request);
    if (isAdminResponse(auth)) return auth;
    await connectToDatabase();
    const body = await request.json();
    if (!body.code) {
      return NextResponse.json({ success: false, message: "Coupon code is required" }, { status: 400 });
    }
    const existing = await Coupon.findOne({ code: body.code.toUpperCase() });
    if (existing) {
      return NextResponse.json({ success: false, message: "Coupon code already exists" }, { status: 400 });
    }
    body.code = body.code.toUpperCase();
    const coupon = await Coupon.create(body);
    return NextResponse.json({ success: true, data: coupon }, { status: 201 });
  } catch (error) {
    console.error("Coupon POST error:", error);
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 });
  }
}
