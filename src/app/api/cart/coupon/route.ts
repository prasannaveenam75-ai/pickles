import { NextRequest, NextResponse } from "next/server";
import { validateCoupon } from "@/lib/services/coupon";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { code, subtotal } = body;

    if (!code) {
      return NextResponse.json({ success: false, message: "Coupon code is required" }, { status: 400 });
    }

    const result = await validateCoupon(code, subtotal || 0);
    return NextResponse.json(result);
  } catch (error) {
    console.error("Coupon validate error:", error);
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 });
  }
}
