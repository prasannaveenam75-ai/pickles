"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Minus, Plus, Trash2, ShoppingBag, ArrowRight, ShieldCheck } from "lucide-react";
import { useCartStore } from "@/store/cart";
import { formatPrice } from "@/lib/utils";
import EmptyState from "@/components/ui/EmptyState";

export default function CartPage() {
  const { items, removeItem, updateQuantity, getTotalWeight, getSubtotal, getItemCount } = useCartStore();
  const [delivery, setDelivery] = useState(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const calculate = async () => {
      const totalWeight = getTotalWeight();
      if (totalWeight <= 0) {
        setDelivery(0);
        return;
      }
      setLoading(true);
      try {
        const res = await fetch("/api/cart/calculate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            items: items.map((i) => ({ productId: i.productId, variantId: i.variantId, quantity: i.quantity })),
          }),
        });
        const data = await res.json();
        if (data.success) {
          setDelivery(data.data.deliveryCharge);
        }
      } catch {
        setDelivery(0);
      } finally {
        setLoading(false);
      }
    };
    if (items.length) calculate();
  }, [items, getTotalWeight]);

  const subtotal = getSubtotal();
  const totalWeight = getTotalWeight();
  const grandTotal = subtotal + delivery;

  if (!items.length) {
    return (
      <div className="container-custom mx-auto px-4 py-16 min-h-[60vh]">
        <EmptyState
          title="Your cart is empty"
          description="Looks like you haven't added any pickles yet. Explore our delicious collection!"
          actionLabel="Shop Pickles"
          actionHref="/shop"
        />
      </div>
    );
  }

  return (
    <div className="container-custom mx-auto px-4 py-8 md:py-12 min-h-[60vh]">
      <h1 className="text-2xl md:text-3xl font-display font-bold mb-1 flex items-center gap-2">
        <ShoppingBag className="w-6 h-6 text-maroon" /> Your Cart
      </h1>
      <p className="text-sm text-charcoal-light mb-6">{getItemCount()} item{getItemCount() > 1 ? "s" : ""}</p>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-6 lg:gap-8 mb-28 lg:mb-0">
        <div className="space-y-3 md:space-y-4">
          {items.map((item) => (
            <div key={`${item.productId}-${item.variantId}`} className="bg-white rounded-2xl p-4 border border-cream-dark/20 flex gap-3 md:gap-4">
              <div className="w-20 h-20 md:w-24 md:h-24 rounded-xl overflow-hidden bg-cream-dark/30 flex-shrink-0">
                {item.image ? (
                  <Image
                    src={item.image}
                    alt={item.productName}
                    width={96}
                    height={96}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-maroon-dark to-maroon">
                    <span className="text-white/50 text-xs uppercase tracking-wider text-center px-2">
                      {item.productName}
                    </span>
                  </div>
                )}
              </div>

              <div className="flex-1 flex flex-col">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <Link href={`/product/${item.productId}`}>
                      <h3 className="font-display font-bold text-sm uppercase text-charcoal-dark hover:text-maroon transition-colors line-clamp-1">
                        {item.productName}
                      </h3>
                    </Link>
                    <p className="text-xs text-charcoal-light mt-0.5">
                      {item.variantName} • {item.category}
                    </p>
                  </div>
                  <button
                    onClick={() => removeItem(item.productId, item.variantId)}
                    className="p-1.5 text-red hover:bg-red/10 rounded-lg transition-colors flex-shrink-0"
                    aria-label="Remove item"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <div className="mt-auto pt-2 flex items-center justify-between">
                  <div className="flex items-center rounded-full border border-cream-dark overflow-hidden">
                    <button
                      onClick={() => updateQuantity(item.productId, item.variantId, item.quantity - 1)}
                      className="w-8 h-8 flex items-center justify-center text-charcoal-light hover:bg-cream transition-colors"
                      aria-label="Decrease quantity"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="w-7 text-center text-sm font-semibold">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.productId, item.variantId, item.quantity + 1)}
                      disabled={item.quantity >= item.stock}
                      className="w-8 h-8 flex items-center justify-center text-charcoal-light hover:bg-cream transition-colors disabled:opacity-40"
                      aria-label="Increase quantity"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-charcoal-light">{formatPrice(item.price)}</p>
                    <p className="text-base font-bold text-charcoal-dark">{formatPrice(item.price * item.quantity)}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="lg:sticky lg:top-24 h-fit">
          <div className="bg-white rounded-2xl border border-cream-dark/20 p-6">
            <h2 className="font-display text-lg md:text-xl font-bold mb-5">Order Summary</h2>

            <div className="space-y-3 text-sm border-b border-cream-dark/30 pb-5 mb-5">
              <div className="flex justify-between">
                <span className="text-charcoal-light">Subtotal</span>
                <span className="font-semibold">{formatPrice(subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-charcoal-light">Total Weight</span>
                <span className="font-semibold">{(totalWeight / 1000).toFixed(2)} kg</span>
              </div>
              <div className="flex justify-between">
                <span className="text-charcoal-light">Delivery</span>
                <span className="font-semibold">
                  {loading ? "..." : formatPrice(delivery)}
                </span>
              </div>
            </div>

            <div className="flex justify-between items-center mb-5">
              <span className="font-semibold text-charcoal-dark text-base">Grand Total</span>
              <span className="text-xl md:text-2xl font-bold text-charcoal-dark">{formatPrice(grandTotal)}</span>
            </div>

            <Link
              href="/checkout"
              className="btn-red btn-lg w-full justify-center"
            >
              Checkout
              <ArrowRight className="w-5 h-5 ml-2" />
            </Link>
            <p className="text-center text-xs text-charcoal-light/60 mt-3 flex items-center justify-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-veg" /> Secure payment via Razorpay
            </p>
          </div>
        </div>
      </div>

      {/* Mobile bottom bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-cream-dark/30 p-3 lg:hidden z-40 safe-area-bottom">
        <div className="container-custom mx-auto flex items-center justify-between gap-3">
          <div>
            <p className="text-[10px] text-charcoal-light">Total ({getItemCount()} items)</p>
            <p className="text-base font-bold text-charcoal-dark">{formatPrice(grandTotal)}</p>
          </div>
          <Link href="/checkout" className="btn-red flex-1 max-w-[200px] justify-center">
            Checkout <ArrowRight className="w-4 h-4 ml-1.5" />
          </Link>
        </div>
      </div>
    </div>
  );
}
