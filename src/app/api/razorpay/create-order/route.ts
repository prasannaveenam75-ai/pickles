import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import { connectToDatabase } from "@/lib/mongodb";
import { Order, Product } from "@/lib/models";
import { calculateServerDelivery } from "@/lib/services/delivery";
import { validateCoupon } from "@/lib/services/coupon";
import { generateOrderNumber } from "@/lib/utils";
import Razorpay from "razorpay";

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID || "",
  key_secret: process.env.RAZORPAY_KEY_SECRET || "",
});

export async function POST(request: NextRequest) {
  try {
    await connectToDatabase();
    const body = await request.json();
    const { items, shippingAddress, couponCode } = body;

    if (!items?.length || !shippingAddress) {
      return NextResponse.json({ success: false, message: "Items and shipping address are required" }, { status: 400 });
    }

    let subtotal = 0;
    let totalWeight = 0;
    const orderItems = [];

    for (const item of items) {
      if (!mongoose.isValidObjectId(item.productId)) {
        return NextResponse.json({ success: false, message: `Product not found: ${item.productId}` }, { status: 400 });
      }
      const product = await Product.findById(item.productId).lean();
      if (!product || !product.active) {
        return NextResponse.json({ success: false, message: `Product not found: ${item.productId}` }, { status: 400 });
      }

      const variant = product.variants.find((v: { _id?: { toString(): string } }) => v._id?.toString() === item.variantId);
      if (!variant || !variant.active) {
        return NextResponse.json({ success: false, message: `Variant not found: ${item.variantName}` }, { status: 400 });
      }

      if (variant.stock < item.quantity) {
        return NextResponse.json({ success: false, message: `Insufficient stock for ${product.name} ${variant.name}` }, { status: 400 });
      }

      const itemTotal = variant.price * item.quantity;
      subtotal += itemTotal;
      totalWeight += variant.weightInGrams * item.quantity;

      orderItems.push({
        product: product._id,
        productName: product.name,
        variantId: variant._id,
        variantName: variant.name,
        weightInGrams: variant.weightInGrams,
        quantity: item.quantity,
        price: variant.price,
        weight: variant.weight,
      });
    }

    let discount = 0;
    if (couponCode) {
      const validation = await validateCoupon(couponCode, subtotal);
      if (validation.valid && validation.discount) {
        discount = validation.discount;
      }
    }

    const afterDiscount = subtotal - discount;
    const deliveryCharge = await calculateServerDelivery(totalWeight);
    const grandTotal = afterDiscount + deliveryCharge;

    const razorpayOrder = await razorpay.orders.create({
      amount: Math.round(grandTotal * 100),
      currency: "INR",
      receipt: `rcpt_${Date.now()}`,
    });

    const orderNumber = generateOrderNumber();
    const order = await Order.create({
      orderNumber,
      customer: { name: shippingAddress.fullName, phone: shippingAddress.phone, email: shippingAddress.email },
      items: orderItems,
      shippingAddress,
      paymentMethod: "razorpay",
      paymentStatus: "PENDING",
      orderStatus: "PENDING",
      subtotal,
      deliveryCharge,
      totalWeight,
      grandTotal,
      couponCode: couponCode || undefined,
      discountAmount: discount,
      razorpayOrderId: razorpayOrder.id,
      statusHistory: [{ status: "PENDING", timestamp: new Date(), note: "Order created, awaiting payment" }],
    });

    for (const item of items) {
      await Product.updateOne(
        { _id: item.productId, "variants._id": item.variantId },
        { $inc: { "variants.$.stock": -item.quantity } }
      );
    }

    return NextResponse.json({
      success: true,
      data: {
        razorpayOrderId: razorpayOrder.id,
        amount: grandTotal,
        currency: "INR",
        orderId: order._id,
        orderNumber: order.orderNumber,
      },
    }, { status: 201 });
  } catch (error) {
    console.error("Razorpay order error:", error);
    return NextResponse.json({ success: false, message: "Failed to create order" }, { status: 500 });
  }
}
