import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { Customer } from "@/lib/models";
import { getCustomerTokenFromRequest, verifyToken } from "@/lib/auth";

export async function GET(request: Request) {
  try {
    const token = getCustomerTokenFromRequest(request);
    if (!token) {
      return NextResponse.json({ success: false, message: "Not authenticated" }, { status: 401 });
    }

    const payload = await verifyToken(token);
    if (!payload || payload.role !== "customer") {
      return NextResponse.json({ success: false, message: "Invalid token" }, { status: 401 });
    }

    await connectToDatabase();
    const customer = await Customer.findById(payload.id).lean();
    if (!customer) {
      return NextResponse.json({ success: false, message: "Customer not found" }, { status: 401 });
    }

    return NextResponse.json({
      success: true,
      data: {
        customer: {
          id: customer._id,
          name: customer.name,
          email: customer.email,
          phone: customer.phone,
          totalOrders: customer.totalOrders,
          totalSpent: customer.totalSpent,
        },
      },
    });
  } catch {
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 });
  }
}
