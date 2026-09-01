import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import { connectToDatabase } from "@/lib/mongodb";
import { Category } from "@/lib/models";
import { requireAdmin, isAdminResponse } from "@/lib/api-auth";

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const auth = await requireAdmin(request);
    if (isAdminResponse(auth)) return auth;
    await connectToDatabase();
    const { id } = await params;
    if (!mongoose.isValidObjectId(id)) {
      return NextResponse.json({ success: false, message: "Category not found" }, { status: 404 });
    }
    const category = await Category.findById(id).lean();
    if (!category) {
      return NextResponse.json({ success: false, message: "Category not found" }, { status: 404 });
    }
    return NextResponse.json({ success: true, data: category });
  } catch (error) {
    console.error("Category GET error:", error);
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
      return NextResponse.json({ success: false, message: "Category not found" }, { status: 404 });
    }
    const body = await request.json();
    const category = await Category.findByIdAndUpdate(id, body, { new: true, runValidators: true });
    if (!category) {
      return NextResponse.json({ success: false, message: "Category not found" }, { status: 404 });
    }
    return NextResponse.json({ success: true, data: category });
  } catch (error) {
    console.error("Category PUT error:", error);
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
      return NextResponse.json({ success: false, message: "Category not found" }, { status: 404 });
    }
    const category = await Category.findByIdAndDelete(id);
    if (!category) {
      return NextResponse.json({ success: false, message: "Category not found" }, { status: 404 });
    }
    return NextResponse.json({ success: true, message: "Category deleted" });
  } catch (error) {
    console.error("Category DELETE error:", error);
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 });
  }
}