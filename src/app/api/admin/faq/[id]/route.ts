import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import { connectToDatabase } from "@/lib/mongodb";
import { FAQ } from "@/lib/models";
import { requireAdmin, isAdminResponse } from "@/lib/api-auth";

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const auth = await requireAdmin(request);
    if (isAdminResponse(auth)) return auth;
    await connectToDatabase();
    const { id } = await params;
    if (!mongoose.isValidObjectId(id)) return NextResponse.json({ success: false, message: "FAQ not found" }, { status: 404 });
    const body = await request.json();
    const faq = await FAQ.findByIdAndUpdate(id, body, { new: true });
    if (!faq) return NextResponse.json({ success: false, message: "FAQ not found" }, { status: 404 });
    return NextResponse.json({ success: true, data: faq });
  } catch (error) {
    console.error("FAQ PUT error:", error);
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const auth = await requireAdmin(request);
    if (isAdminResponse(auth)) return auth;
    await connectToDatabase();
    const { id } = await params;
    if (!mongoose.isValidObjectId(id)) return NextResponse.json({ success: false, message: "FAQ not found" }, { status: 404 });
    const faq = await FAQ.findByIdAndDelete(id);
    if (!faq) return NextResponse.json({ success: false, message: "FAQ not found" }, { status: 404 });
    return NextResponse.json({ success: true, message: "FAQ deleted" });
  } catch (error) {
    console.error("FAQ DELETE error:", error);
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 });
  }
}