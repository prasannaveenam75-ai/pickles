import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import { connectToDatabase } from "@/lib/mongodb";
import { Product } from "@/lib/models";
import { requireAdmin, isAdminResponse } from "@/lib/api-auth";

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const auth = await requireAdmin(request);
    if (isAdminResponse(auth)) return auth;
    await connectToDatabase();
    const { id } = await params;
    if (!mongoose.isValidObjectId(id)) {
      return NextResponse.json({ success: false, message: "Product not found" }, { status: 404 });
    }
    const product = await Product.findById(id).lean();
    if (!product) {
      return NextResponse.json({ success: false, message: "Product not found" }, { status: 404 });
    }
    return NextResponse.json({ success: true, data: product });
  } catch (error) {
    console.error("Product GET error:", error);
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 });
  }
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const auth = await requireAdmin(request);
    if (isAdminResponse(auth)) return auth;
    await connectToDatabase();
    const { id } = await params;
    if (!mongoose.isValidObjectId(id)) {
      return NextResponse.json({ success: false, message: "Product not found" }, { status: 404 });
    }
    const body = await request.json();

    const product = await Product.findByIdAndUpdate(id, body, { new: true, runValidators: true });
    if (!product) {
      return NextResponse.json({ success: false, message: "Product not found" }, { status: 404 });
    }
    return NextResponse.json({ success: true, data: product });
  } catch (error) {
    console.error("Product PUT error:", error);
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
      return NextResponse.json({ success: false, message: "Product not found" }, { status: 404 });
    }
    const product = await Product.findByIdAndDelete(id);
    if (!product) {
      return NextResponse.json({ success: false, message: "Product not found" }, { status: 404 });
    }
    return NextResponse.json({ success: true, message: "Product deleted" });
  } catch (error) {
    console.error("Product DELETE error:", error);
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 });
  }
}