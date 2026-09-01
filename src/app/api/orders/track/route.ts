import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { Order } from "@/lib/models";

export async function GET(request: NextRequest) {
  try {
    await connectToDatabase();
    const { searchParams } = new URL(request.url);
    const orderNumber = searchParams.get("orderNumber");
    const phone = searchParams.get("phone");

    if (!orderNumber || !phone) {
      return NextResponse.json({ success: false, message: "Order number and phone are required" }, { status: 400 });
    }

    const order = await Order.findOne({
      orderNumber: orderNumber.toUpperCase(),
      "customer.phone": phone,
    }).lean();

    if (!order) {
      return NextResponse.json({ success: false, message: "Order not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: order });
  } catch (error) {
    console.error("Track order error:", error);
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 });
  }
}
