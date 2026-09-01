import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import { connectToDatabase } from "@/lib/mongodb";
import { Coupon } from "@/lib/models";
import { requireAdmin, isAdminResponse } from "@/lib/api-auth";

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const auth = await requireAdmin(request);
    if (isAdminResponse(auth)) return auth;
    await connectToDatabase();
    const { id } = await params;
    if (!mongoose.isValidObjectId(id)) {
      return NextResponse.json({ success: false, message: "Coupon not found" }, { status: 404 });
    }
    const body = await request.json();
    const coupon = await Coupon.findByIdAndUpdate(id, body, { new: true });
    if (!coupon) {
      return NextResponse.json({ success: false, message: "Coupon not found" }, { status: 404 });
    }
    return NextResponse.json({ success: true, data: coupon });
  } catch (error) {
    console.error("Coupon PUT error:", error);
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const auth = await requireAdmin(request);
    if (isAdminResponse(auth)) return auth;
    await connectToDatabase();
    const { id } = await params;
    if (!mongoose.isValidObjectId(id)) {
      return NextResponse.json({ success: false, message: "Coupon not found" }, { status: 404 });
    }
    const coupon = await Coupon.findByIdAndDelete(id);
    if (!coupon) {
      return NextResponse.json({ success: false, message: "Coupon not found" }, { status: 404 });
    }
    return NextResponse.json({ success: true, message: "Coupon deleted" });
  } catch (error) {
    console.error("Coupon DELETE error:", error);
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 });
  }
}