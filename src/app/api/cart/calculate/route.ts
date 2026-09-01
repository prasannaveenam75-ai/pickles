import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import { connectToDatabase } from "@/lib/mongodb";
import { Product } from "@/lib/models";
import { calculateServerDelivery } from "@/lib/services/delivery";

export async function POST(request: NextRequest) {
  try {
    await connectToDatabase();
    const body = await request.json();
    const { items, couponCode } = body;

    if (!items?.length) {
      return NextResponse.json({ success: false, message: "Items are required" }, { status: 400 });
    }

    let subtotal = 0;
    let totalWeight = 0;
    const calculatedItems = [];

    for (const item of items) {
      if (!mongoose.isValidObjectId(item.productId)) continue;
      const product = await Product.findById(item.productId).lean();
      if (!product) continue;

      const variant = product.variants.find((v: { _id?: { toString(): string } }) => v._id?.toString() === item.variantId);
      if (!variant) continue;

      const itemTotal = variant.price * item.quantity;
      const itemWeight = variant.weightInGrams * item.quantity;
      subtotal += itemTotal;
      totalWeight += itemWeight;

      calculatedItems.push({
        productId: product._id,
        productName: product.name,
        variantId: variant._id,
        variantName: variant.name,
        weight: variant.weight,
        weightInGrams: variant.weightInGrams,
        price: variant.price,
        quantity: item.quantity,
        itemTotal,
        itemWeight,
      });
    }

    const deliveryCharge = await calculateServerDelivery(totalWeight);

    return NextResponse.json({
      success: true,
      data: {
        items: calculatedItems,
        subtotal,
        totalWeight,
        deliveryCharge,
        grandTotal: subtotal + deliveryCharge,
      },
    });
  } catch (error) {
    console.error("Cart calculate error:", error);
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 });
  }
}
