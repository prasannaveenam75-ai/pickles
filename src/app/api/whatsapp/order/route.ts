import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import { SiteSettings } from "@/lib/models";

export async function POST(request: NextRequest) {
  try {
    await connectToDatabase();
    const body = await request.json();
    const { items, shippingAddress } = body;

    let totalWeight = 0;
    for (const item of items) {
      totalWeight += (item.weightInGrams || 0) * (item.quantity || 0);
    }

    const settings = await SiteSettings.findOne().lean();
    const ratePerKg = settings?.deliveryRatePerKg ?? 100;
    const minimumCharge = settings?.minimumDeliveryCharge ?? 100;
    const freeDeliveryEnabled = settings?.freeDeliveryEnabled ?? false;
    const freeDeliveryThreshold = settings?.freeDeliveryThreshold ?? 0;
    const whatsappNumber = settings?.whatsappNumber || process.env.WHATSAPP_NUMBER || "919999999999";

    const weightInKg = totalWeight / 1000;
    let delivery = Math.ceil(weightInKg) * ratePerKg;
    delivery = Math.max(delivery, minimumCharge);
    if (freeDeliveryEnabled && delivery >= freeDeliveryThreshold) delivery = 0;

    let subtotal = 0;
    const itemLines: string[] = [];
    for (const item of items) {
      const lineTotal = (item.price || 0) * (item.quantity || 0);
      subtotal += lineTotal;
      itemLines.push(`• ${item.productName} (${item.weight}) x ${item.quantity} = ₹${lineTotal}`);
    }

    const grandTotal = subtotal + delivery;

    const message = `DEVI PICKLES ORDER

Customer: ${shippingAddress?.fullName || "N/A"}
Mobile: ${shippingAddress?.phone || "N/A"}

Address:
${shippingAddress?.houseFlat || ""}, ${shippingAddress?.street || ""}
${shippingAddress?.area || ""}, ${shippingAddress?.city || ""}
${shippingAddress?.state || ""} - ${shippingAddress?.pincode || ""}

Items:
${itemLines.join("\n")}

Total Weight: ${(totalWeight / 1000).toFixed(1)} kg
Subtotal: ₹${subtotal}
Delivery: ₹${delivery}
Grand Total: ₹${grandTotal}`;

    const url = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;

    return NextResponse.json({ success: true, data: { url, message } });
  } catch (error) {
    console.error("WhatsApp order error:", error);
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 });
  }
}
