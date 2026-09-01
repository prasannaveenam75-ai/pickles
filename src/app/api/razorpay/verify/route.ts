import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import { connectToDatabase } from "@/lib/mongodb";
import { Order, Customer } from "@/lib/models";

export async function POST(request: NextRequest) {
  try {
    await connectToDatabase();
    const body = await request.json();
    const { razorpayOrderId, razorpayPaymentId, razorpaySignature, orderId } = body;

    if (!razorpayOrderId || !razorpayPaymentId || !razorpaySignature || !orderId) {
      return NextResponse.json({ success: false, message: "Missing payment verification data" }, { status: 400 });
    }

    if (!mongoose.isValidObjectId(orderId)) {
      return NextResponse.json({ success: false, message: "Order not found" }, { status: 404 });
    }

    const existingOrder = await Order.findById(orderId).lean();
    if (!existingOrder) {
      return NextResponse.json({ success: false, message: "Order not found" }, { status: 404 });
    }

    if (existingOrder.razorpayOrderId !== razorpayOrderId) {
      return NextResponse.json({ success: false, message: "Razorpay order mismatch" }, { status: 400 });
    }

    const crypto = await import("crypto");
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET || "")
      .update(`${razorpayOrderId}|${razorpayPaymentId}`)
      .digest("hex");

    if (expectedSignature !== razorpaySignature) {
      await Order.findByIdAndUpdate(orderId, {
        paymentStatus: "FAILED",
        $push: { statusHistory: { status: "PAYMENT_FAILED", timestamp: new Date(), note: "Payment signature verification failed" } },
      });
      const { Product } = await import("@/lib/models");
      for (const item of existingOrder.items) {
        await Product.updateOne(
          { _id: item.product, "variants._id": item.variantId },
          { $inc: { "variants.$.stock": item.quantity } }
        );
      }
      return NextResponse.json({ success: false, message: "Payment verification failed" }, { status: 400 });
    }

    const order = await Order.findByIdAndUpdate(
      orderId,
      {
        paymentStatus: "PAID",
        orderStatus: "CONFIRMED",
        razorpayPaymentId,
        razorpaySignature,
        $push: {
          statusHistory: [
            { status: "PAYMENT_RECEIVED", timestamp: new Date(), note: "Payment verified" },
            { status: "CONFIRMED", timestamp: new Date(), note: "Order confirmed after payment" },
          ],
        },
      },
      { new: true }
    );

    if (!order) {
      return NextResponse.json({ success: false, message: "Order not found" }, { status: 404 });
    }

    const customer = await Customer.findOne({ phone: order.customer.phone });
    if (customer) {
      customer.totalOrders += 1;
      customer.totalSpent += order.grandTotal;
      await customer.save();
    } else {
      await Customer.create({
        name: order.customer.name,
        phone: order.customer.phone,
        email: order.customer.email,
        totalOrders: 1,
        totalSpent: order.grandTotal,
      });
    }

    return NextResponse.json({
      success: true,
      data: {
        orderNumber: order.orderNumber,
        grandTotal: order.grandTotal,
        paymentStatus: order.paymentStatus,
      },
    });
  } catch (error) {
    console.error("Razorpay verify error:", error);
    return NextResponse.json({ success: false, message: "Payment verification failed" }, { status: 500 });
  }
}
