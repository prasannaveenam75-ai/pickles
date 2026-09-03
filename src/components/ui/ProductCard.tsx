"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Heart, ShoppingCart, Minus, Plus, Scale } from "lucide-react";
import { useCartStore } from "@/store/cart";
import { useWishlistStore } from "@/store/wishlist";
import { useCompareStore } from "@/store/compare";
import { formatPrice } from "@/lib/utils";
import type { IProduct } from "@/types";

export default function ProductCard({ product }: { product: IProduct }) {
  const addItem = useCartStore((s) => s.addItem);
  const wishlist = useWishlistStore();
  const compare = useCompareStore();
  const [selectedIdx, setSelectedIdx] = useState(0);
  const [qty, setQty] = useState(1);

  if (!product) return null;

  const activeVariants = product.variants?.filter((v) => v.active) || [];
  const selected = activeVariants[selectedIdx] || activeVariants[0];
  const isOutOfStock = !selected || selected.stock <= 0;
  const isWishlisted = wishlist.has(product._id);
  const isCompared = compare.has(product._id);
  const offerPct =
    selected?.compareAtPrice && selected.compareAtPrice > selected.price
      ? Math.round(((selected.compareAtPrice - selected.price) / selected.compareAtPrice) * 100)
      : 0;
  const prices = activeVariants.map((v) => v.price).filter((n) => n != null);
  const minPrice = prices.length ? Math.min(...prices) : 0;
  const maxPrice = prices.length ? Math.max(...prices) : 0;

  const handleAddToCart = () => {
    if (!selected) return;
    const q = Math.min(qty, selected.stock);
    addItem({
      productId: product._id,
      productName: product.name,
      variantId: selected._id || "",
      variantName: selected.name,
      weight: selected.weight,
      weightInGrams: selected.weightInGrams,
      price: selected.price,
      image: product.images?.[0] || "",
      quantity: q,
      stock: selected.stock,
      category: product.category,
    });
    setQty(1);
  };

  return (
    <div className="product-card flex flex-col group">
      <Link href={`/product/${product.slug}`} className="relative block overflow-hidden">
        <div className="aspect-square bg-sand-light relative overflow-hidden">
          {product.images?.[0] ? (
            <Image
              src={product.images[0]}
              alt={product.name}
              width={500}
              height={500}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              loading="lazy"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-maroon/10 to-golden/10">
              <span className="font-display text-2xl font-bold text-maroon/30 uppercase">{product.name.charAt(0)}</span>
            </div>
          )}

          <div className="absolute top-2.5 right-2.5 flex flex-col gap-1.5">
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                wishlist.toggle(product._id);
              }}
              className={`w-9 h-9 rounded-full flex items-center justify-center shadow-sm backdrop-blur transition-all duration-300 ${
                isWishlisted
                  ? "bg-red text-white scale-110"
                  : "bg-white/90 text-charcoal-light hover:text-red hover:scale-110"
              }`}
              aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
            >
              <Heart className={`w-4.5 h-4.5 ${isWishlisted ? "fill-current" : ""}`} />
            </button>
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                if (compare.has(product._id)) {
                  compare.remove(product._id);
                } else if (compare.items.length >= 4) {
                  window.alert("You can compare up to 4 products at a time.");
                } else {
                  compare.toggle(product._id);
                }
              }}
              className={`w-9 h-9 rounded-full flex items-center justify-center shadow-sm backdrop-blur transition-all duration-300 ${
                isCompared
                  ? "bg-maroon text-white scale-110"
                  : "bg-white/90 text-charcoal-light hover:text-maroon hover:scale-110"
              }`}
              aria-label={isCompared ? "Remove from compare" : "Add to compare"}
              title="Compare"
            >
              <Scale className={`w-4.5 h-4.5 ${isCompared ? "fill-current" : ""}`} />
            </button>
          </div>

          <div className="absolute top-2.5 left-2.5 flex flex-col gap-1">
            {product.bestSeller && <span className="badge bg-red text-white">Best Seller</span>}
            {product.newProduct && <span className="badge bg-veg text-white">New</span>}
            {offerPct > 0 && <span className="badge bg-golden text-white">{offerPct}% OFF</span>}
          </div>
        </div>
      </Link>

      <div className="p-3 md:p-4 flex flex-col flex-1">
        <span className="text-[9px] md:text-[10px] tracking-wider uppercase text-charcoal-light/60 font-semibold">
          {product.category}
        </span>
        <Link href={`/product/${product.slug}`} className="mt-1">
          <h3 className="font-display text-[13px] md:text-sm font-bold text-charcoal-dark group-hover:text-maroon transition-colors leading-snug line-clamp-1">
            {product.name}
          </h3>
        </Link>

        <div className="flex items-baseline gap-2 mt-1.5">
          {activeVariants.length > 1 && maxPrice > minPrice ? (
            <span className="font-bold text-maroon text-[15px] md:text-base">
              {formatPrice(minPrice)} – {formatPrice(maxPrice)}
            </span>
          ) : (
            <span className="font-bold text-maroon text-[15px] md:text-base">
              {selected ? formatPrice(selected.price) : "Sold Out"}
            </span>
          )}
          {activeVariants.length === 1 && selected?.compareAtPrice && selected.compareAtPrice > selected.price && (
            <span className="text-[11px] text-charcoal-light/50 line-through">
              {formatPrice(selected.compareAtPrice)}
            </span>
          )}
        </div>

        {activeVariants.length > 1 ? (
          <div className="flex flex-wrap gap-1.5 mt-2.5">
            {activeVariants.map((v, i) => (
              <button
                key={v._id || i}
                onClick={() => { setSelectedIdx(i); setQty(1); }}
                className={`text-[10px] font-semibold px-2.5 py-1 rounded-full border transition-all ${
                  selectedIdx === i
                    ? "bg-maroon text-white border-maroon shadow-sm"
                    : "bg-white text-charcoal-light border-sand-dark hover:border-maroon/50"
                }`}
              >
                {v.weight}
              </button>
            ))}
          </div>
        ) : (
          activeVariants.length === 1 && (
            <span className="text-[10px] text-charcoal-light/60 mt-2">
              {activeVariants[0].weight}
            </span>
          )
        )}

        <div className="mt-auto pt-3 flex items-center gap-2">
          {!isOutOfStock && (
            <div className="flex items-center rounded-full border border-sand-dark overflow-hidden flex-shrink-0">
              <button
                onClick={() => setQty((q) => Math.max(1, q - 1))}
                className="w-7 h-7 flex items-center justify-center text-charcoal-light hover:bg-cream transition-colors"
                aria-label="Decrease quantity"
              >
                <Minus className="w-3 h-3" />
              </button>
              <span className="w-6 text-center text-xs font-semibold">{qty}</span>
              <button
                onClick={() => setQty((q) => Math.min(selected?.stock || 1, q + 1))}
                className="w-7 h-7 flex items-center justify-center text-charcoal-light hover:bg-cream transition-colors"
                aria-label="Increase quantity"
              >
                <Plus className="w-3 h-3" />
              </button>
            </div>
          )}
          {isOutOfStock ? (
            <span className="flex-1 text-center text-xs font-semibold text-red py-2.5">
              Out of Stock
            </span>
          ) : (
            <button
              onClick={handleAddToCart}
              className="flex-1 inline-flex items-center justify-center gap-1 bg-maroon text-white text-xs font-semibold py-2.5 rounded-full hover:bg-maroon-light transition-colors min-w-[64px]"
            >
              <ShoppingCart className="w-3.5 h-3.5" />
              ADD
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
