"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Minus, Plus, Trash2, ShoppingBag, ArrowRight } from "lucide-react";
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
      <div className="container-custom mx-auto px-4 py-16">
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
    <div className="container-custom mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex items-center justify-between mb-8">
        <h1 className="font-display text-3xl font-bold">
          <ShoppingBag className="inline w-7 h-7 mr-2 text-green" />
          Your Cart
        </h1>
        <Link href="/shop" className="text-sm text-green hover:text-green-light font-medium">
          Continue Shopping
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-8 mb-24 lg:mb-0">
        <div className="space-y-4">
          {items.map((item) => (
            <div key={`${item.productId}-${item.variantId}`} className="card p-4 md:p-5 flex gap-4">
              <div className="w-24 h-24 md:w-28 md:h-28 rounded-lg overflow-hidden bg-cream-dark/30 flex-shrink-0">
                {item.image ? (
                  <Image
                    src={item.image}
                    alt={item.productName}
                    width={112}
                    height={112}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-green-dark to-green">
                    <span className="text-white/50 text-xs uppercase tracking-wider text-center px-2">
                      {item.productName}
                    </span>
                  </div>
                )}
              </div>

              <div className="flex-1 flex flex-col md:flex-row md:items-start md:justify-between gap-3">
                <div>
                  <Link href={`/product/${item.productId}`}>
                    <h3 className="font-display font-bold text-sm uppercase text-charcoal-dark hover:text-green transition-colors">
                      {item.productName}
                    </h3>
                  </Link>
                  <p className="text-xs text-charcoal-light mt-1">
                    {item.variantName} • {item.category}
                  </p>
                  <p className="text-sm font-semibold text-charcoal-dark mt-2">
                    {formatPrice(item.price)}
                  </p>
                </div>

                <div className="flex flex-row md:flex-col md:items-end items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => updateQuantity(item.productId, item.variantId, item.quantity - 1)}
                      className="w-8 h-8 rounded-lg border border-cream-dark flex items-center justify-center hover:border-green transition-colors"
                      aria-label="Decrease"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="w-6 text-center text-sm font-semibold">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.productId, item.variantId, item.quantity + 1)}
                      disabled={item.quantity >= item.stock}
                      className="w-8 h-8 rounded-lg border border-cream-dark flex items-center justify-center hover:border-green transition-colors disabled:opacity-40"
                      aria-label="Increase"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <button
                    onClick={() => removeItem(item.productId, item.variantId)}
                    className="p-2 text-red hover:bg-red/10 rounded-lg transition-colors"
                    aria-label="Remove item"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="lg:sticky lg:top-24 h-fit">
          <div className="bg-white rounded-xl border border-cream-dark/50 p-6">
            <h2 className="font-display text-xl font-bold mb-6">Order Summary</h2>

            <div className="space-y-3 text-sm border-b border-cream-dark/50 pb-6 mb-6">
              <div className="flex justify-between">
                <span className="text-charcoal-light">Subtotal</span>
                <span className="font-semibold">{formatPrice(subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-charcoal-light">Total Weight</span>
                <span className="font-semibold">{(totalWeight / 1000).toFixed(2)} kg</span>
              </div>
              <div className="flex justify-between">
                <span className="text-charcoal-light">Delivery ({formatPrice(100)}/kg)</span>
                <span className="font-semibold">
                  {loading ? "..." : formatPrice(delivery)}
                </span>
              </div>
            </div>

            <div className="flex justify-between items-center mb-6">
              <span className="font-semibold text-charcoal-dark text-base">Grand Total</span>
              <span className="text-2xl font-bold text-charcoal-dark">{formatPrice(grandTotal)}</span>
            </div>

            <Link
              href="/checkout"
              className="btn-red btn-lg w-full justify-center"
            >
              Checkout
              <ArrowRight className="w-5 h-5 ml-2" />
            </Link>
          </div>
        </div>
      </div>

      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-cream-dark/50 p-4 lg:hidden z-40">
        <div className="container-custom mx-auto flex items-center justify-between gap-4">
          <div>
            <p className="text-xs text-charcoal-light">Total ({getItemCount()} items)</p>
            <p className="text-lg font-bold text-charcoal-dark">{formatPrice(grandTotal)}</p>
          </div>
          <Link href="/checkout" className="btn-red">
            Checkout
          </Link>
        </div>
      </div>
    </div>
  );
}
