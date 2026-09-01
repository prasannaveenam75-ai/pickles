import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import { connectToDatabase } from "@/lib/mongodb";
import { Order } from "@/lib/models";
import { requireAdmin, isAdminResponse } from "@/lib/api-auth";

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const auth = await requireAdmin(request);
    if (isAdminResponse(auth)) return auth;
    await connectToDatabase();
    const { id } = await params;
    if (!mongoose.isValidObjectId(id)) {
      return NextResponse.json({ success: false, message: "Order not found" }, { status: 404 });
    }
    const order = await Order.findById(id).lean();
    if (!order) {
      return NextResponse.json({ success: false, message: "Order not found" }, { status: 404 });
    }
    return NextResponse.json({ success: true, data: order });
  } catch (error) {
    console.error("Order GET error:", error);
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
      return NextResponse.json({ success: false, message: "Order not found" }, { status: 404 });
    }
    const body = await request.json();
    const { orderStatus, paymentStatus, notes } = body;

    const updateData: Record<string, unknown> = {};
    if (orderStatus) {
      updateData.orderStatus = orderStatus;
      updateData.$push = {
        statusHistory: { status: orderStatus, timestamp: new Date(), note: notes || `Status changed to ${orderStatus}` },
      };
    }
    if (paymentStatus) updateData.paymentStatus = paymentStatus;
    if (notes && !orderStatus) updateData.notes = notes;

    const order = await Order.findByIdAndUpdate(id, updateData, { new: true });
    if (!order) {
      return NextResponse.json({ success: false, message: "Order not found" }, { status: 404 });
    }
    return NextResponse.json({ success: true, data: order });
  } catch (error) {
    console.error("Order PUT error:", error);
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 });
  }
}
