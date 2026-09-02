"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { CheckCircle2, Package, ArrowRight } from "lucide-react";
import { formatPrice } from "@/lib/utils";

export default function OrderSuccessClient({ orderNumber }: { orderNumber: string }) {
  const [orderData, setOrderData] = useState<any>(null);

  useEffect(() => {
    const stored = localStorage.getItem("lastOrder");
    if (stored) {
      try {
        setOrderData(JSON.parse(stored));
      } catch {
        setOrderData({ orderNumber });
      }
    } else if (orderNumber) {
      setOrderData({ orderNumber });
    }
  }, [orderNumber]);

  return (
    <div className="container-custom mx-auto px-4 sm:px-6 lg:px-8 py-16 min-h-[60vh] text-center">
      <div className="w-24 h-24 bg-veg/10 rounded-full flex items-center justify-center mx-auto mb-8">
        <CheckCircle2 className="w-12 h-12 text-veg" />
      </div>

      <h1 className="font-display text-3xl md:text-4xl font-bold mb-4">
        THANK YOU FOR YOUR ORDER!
      </h1>

      <p className="text-charcoal-light text-lg mb-6">
        Your order has been placed successfully.
      </p>

      <div className="max-w-md mx-auto bg-white rounded-xl border border-cream-dark/50 p-8 mb-8">
        <div className="space-y-4">
          <div>
            <p className="text-xs text-charcoal-light uppercase tracking-wider">Order Number</p>
            <p className="text-xl font-bold text-veg">{orderData?.orderNumber || orderNumber || "N/A"}</p>
          </div>
          <div>
            <p className="text-xs text-charcoal-light uppercase tracking-wider">Payment Status</p>
            <p className="text-sm font-semibold text-veg">Payment Successful</p>
          </div>
          {orderData?.grandTotal && (
            <div>
              <p className="text-xs text-charcoal-light uppercase tracking-wider">Order Total</p>
              <p className="text-sm font-semibold">{formatPrice(orderData.grandTotal)}</p>
            </div>
          )}
          <div className="border-t border-cream-dark/50 pt-4">
            <p className="text-xs text-charcoal-light mb-1">Estimated Delivery</p>
            <p className="text-sm font-medium">3-7 business days after dispatch</p>
          </div>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Link href="/track-order" className="btn-primary">
          <Package className="w-5 h-5 mr-2" /> Track Order
        </Link>
        <Link href="/shop" className="btn-secondary">
          Continue Shopping <ArrowRight className="w-4 h-4 ml-2" />
        </Link>
      </div>
    </div>
  );
}
