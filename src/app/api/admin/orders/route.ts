import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import { connectToDatabase } from "@/lib/mongodb";
import { Order, Customer, Product } from "@/lib/models";
import { calculateServerDelivery } from "@/lib/services/delivery";
import { validateCoupon } from "@/lib/services/coupon";
import { generateOrderNumber } from "@/lib/utils";
import { requireAdmin, isAdminResponse } from "@/lib/api-auth";

export async function GET(request: NextRequest) {
  try {
    const auth = await requireAdmin(request);
    if (isAdminResponse(auth)) return auth;
    await connectToDatabase();
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");
    const status = searchParams.get("status");
    const search = searchParams.get("search");

    const filter: Record<string, unknown> = {};
    if (status) filter.orderStatus = status;
    if (search) {
      filter.$or = [
        { orderNumber: { $regex: search, $options: "i" } },
        { "customer.phone": { $regex: search, $options: "i" } },
        { "customer.name": { $regex: search, $options: "i" } },
      ];
    }

    const total = await Order.countDocuments(filter);
    const orders = await Order.find(filter)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .lean();

    return NextResponse.json({
      success: true,
      data: orders,
      pagination: { page, limit, total, pages: Math.ceil(total / limit) },
    });
  } catch (error) {
    console.error("Orders GET error:", error);
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const auth = await requireAdmin(request);
    if (isAdminResponse(auth)) return auth;
    await connectToDatabase();
    const body = await request.json();
    const { items, shippingAddress, paymentMethod, couponCode } = body;

    if (!items?.length || !shippingAddress) {
      return NextResponse.json({ success: false, message: "Items and shipping address are required" }, { status: 400 });
    }

    let subtotal = 0;
    let totalWeight = 0;
    const orderItems = [];

    for (const item of items) {
      if (!mongoose.isValidObjectId(item.productId)) {
        return NextResponse.json({ success: false, message: `Product not found or inactive: ${item.productId}` }, { status: 400 });
      }
      const product = await Product.findById(item.productId).lean();
      if (!product || !product.active) {
        return NextResponse.json({ success: false, message: `Product not found or inactive: ${item.productId}` }, { status: 400 });
      }

      const variant = product.variants.find((v: { _id?: { toString(): string } }) => v._id?.toString() === item.variantId);
      if (!variant || !variant.active) {
        return NextResponse.json({ success: false, message: `Variant not found: ${item.variantName}` }, { status: 400 });
      }

      if (variant.stock < item.quantity) {
        return NextResponse.json({ success: false, message: `Insufficient stock for ${product.name} ${variant.name}` }, { status: 400 });
      }

      const itemTotal = variant.price * item.quantity;
      const itemWeight = variant.weightInGrams * item.quantity;
      subtotal += itemTotal;
      totalWeight += itemWeight;

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

    const orderNumber = generateOrderNumber();

    const order = await Order.create({
      orderNumber,
      customer: { name: shippingAddress.fullName, phone: shippingAddress.phone, email: shippingAddress.email },
      items: orderItems,
      shippingAddress,
      paymentMethod,
      paymentStatus: paymentMethod === "whatsapp" ? "PENDING" : "PENDING",
      orderStatus: "PENDING",
      subtotal,
      deliveryCharge,
      totalWeight,
      grandTotal,
      couponCode: couponCode || undefined,
      discountAmount: discount,
      statusHistory: [{ status: "PENDING", timestamp: new Date(), note: "Order placed" }],
    });

    for (const item of items) {
      await Product.updateOne(
        { _id: item.productId, "variants._id": item.variantId },
        { $inc: { "variants.$.stock": -item.quantity } }
      );
    }

    const customer = await Customer.findOne({ phone: shippingAddress.phone });
    if (customer) {
      customer.totalOrders += 1;
      customer.totalSpent += grandTotal;
      await customer.save();
    } else {
      await Customer.create({
        name: shippingAddress.fullName,
        phone: shippingAddress.phone,
        email: shippingAddress.email,
        totalOrders: 1,
        totalSpent: grandTotal,
      });
    }

    return NextResponse.json({
      success: true,
      data: {
        orderId: order._id,
        orderNumber: order.orderNumber,
        grandTotal: order.grandTotal,
        subtotal: order.subtotal,
        deliveryCharge: order.deliveryCharge,
        totalWeight: order.totalWeight,
        discount: discount,
      },
    }, { status: 201 });
  } catch (error) {
    console.error("Order POST error:", error);
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 });
  }
}
