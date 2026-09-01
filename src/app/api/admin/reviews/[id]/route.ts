import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import { connectToDatabase } from "@/lib/mongodb";
import { Review } from "@/lib/models";
import { requireAdmin, isAdminResponse } from "@/lib/api-auth";

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const auth = await requireAdmin(request);
    if (isAdminResponse(auth)) return auth;
    await connectToDatabase();
    const { id } = await params;
    if (!mongoose.isValidObjectId(id)) {
      return NextResponse.json({ success: false, message: "Review not found" }, { status: 404 });
    }
    const body = await request.json();
    const review = await Review.findByIdAndUpdate(id, body, { new: true });
    if (!review) {
      return NextResponse.json({ success: false, message: "Review not found" }, { status: 404 });
    }
    return NextResponse.json({ success: true, data: review });
  } catch (error) {
    console.error("Review PUT error:", error);
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
      return NextResponse.json({ success: false, message: "Review not found" }, { status: 404 });
    }
    const review = await Review.findByIdAndDelete(id);
    if (!review) {
      return NextResponse.json({ success: false, message: "Review not found" }, { status: 404 });
    }
    return NextResponse.json({ success: true, message: "Review deleted" });
  } catch (error) {
    console.error("Review DELETE error:", error);
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 });
  }
}
