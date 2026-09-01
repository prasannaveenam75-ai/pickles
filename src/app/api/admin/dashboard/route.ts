import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { Order, Product, Customer } from "@/lib/models";
import { requireAdmin, isAdminResponse } from "@/lib/api-auth";

export async function GET(request: NextRequest) {
  try {
    const auth = await requireAdmin(request);
    if (isAdminResponse(auth)) return auth;
    await connectToDatabase();

    const totalOrders = await Order.countDocuments();
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayOrders = await Order.countDocuments({ createdAt: { $gte: today } });
    const pendingOrders = await Order.countDocuments({ orderStatus: "PENDING" });
    const paidOrders = await Order.countDocuments({ paymentStatus: "PAID" });
    const deliveredOrders = await Order.countDocuments({ orderStatus: "DELIVERED" });

    const revenueResult = await Order.aggregate([
      { $match: { paymentStatus: "PAID" } },
      { $group: { _id: null, total: { $sum: "$grandTotal" } } },
    ]);
    const totalRevenue = revenueResult[0]?.total || 0;

    const totalProducts = await Product.countDocuments();
    const lowStockProducts = await Product.countDocuments({ "variants.stock": { $lte: 5 } });
    const totalCustomers = await Customer.countDocuments();

    const recentOrders = await Order.find().sort({ createdAt: -1 }).limit(10).lean();

    return NextResponse.json({
      success: true,
      data: {
        totalOrders,
        todayOrders,
        pendingOrders,
        paidOrders,
        deliveredOrders,
        totalRevenue,
        totalProducts,
        lowStockProducts,
        totalCustomers,
        recentOrders,
      },
    });
  } catch (error) {
    console.error("Dashboard error:", error);
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 });
  }
}
