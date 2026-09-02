"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Heart, ShoppingCart } from "lucide-react";
import { useCartStore } from "@/store/cart";
import { formatPrice } from "@/lib/utils";
import { StarRating } from "@/components/ui/StarRating";
import type { IProduct } from "@/types";

export default function ProductCard({ product }: { product: IProduct }) {
  const addItem = useCartStore((s) => s.addItem);
  const [selectedIdx, setSelectedIdx] = useState(0);

  if (!product) return null;

  const activeVariants = product.variants?.filter((v) => v.active) || [];
  const selected = activeVariants[selectedIdx] || activeVariants[0];
  const minPrice = activeVariants.length > 0 ? Math.min(...activeVariants.map((v) => v.price)) : 0;
  const offerPct =
    selected?.compareAtPrice && selected.compareAtPrice > selected.price
      ? Math.round(((selected.compareAtPrice - selected.price) / selected.compareAtPrice) * 100)
      : 0;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!selected) return;
    addItem({
      productId: product._id,
      productName: product.name,
      variantId: selected._id || "",
      variantName: selected.name,
      weight: selected.weight,
      weightInGrams: selected.weightInGrams,
      price: selected.price,
      image: product.images?.[0] || "",
      quantity: 1,
      stock: selected.stock,
      category: product.category,
    });
  };

  return (
    <div className="product-card flex flex-col group">
      <Link href={`/product/${product.slug}`} className="relative block overflow-hidden">
        <div className="aspect-square bg-sand-light/50 overflow-hidden relative">
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
            <div className="w-full h-full flex items-center justify-center">
              <span className="text-charcoal-light/30 font-display text-sm uppercase tracking-wider">{product.name}</span>
            </div>
          )}
          <button
            onClick={(e) => { e.preventDefault(); e.stopPropagation(); }}
            className="absolute top-3 right-3 w-8 h-8 bg-white/90 backdrop-blur rounded-full flex items-center justify-center text-charcoal-light hover:text-red transition-colors shadow-sm opacity-0 group-hover:opacity-100"
            aria-label="Add to wishlist"
          >
            <Heart className="w-4 h-4" />
          </button>
        </div>
        <div className="absolute top-3 left-3 flex flex-col gap-1.5">
          {product.bestSeller && <span className="badge bg-red text-white text-[9px]">Best Seller</span>}
          {product.newProduct && <span className="badge bg-veg text-white text-[9px]">New</span>}
          {product.seasonal && <span className="badge bg-golden text-maroon-dark text-[9px]">Seasonal</span>}
          {offerPct > 0 && <span className="badge bg-maroon text-white text-[9px]">{offerPct}% OFF</span>}
        </div>
      </Link>

      <div className="p-4 flex flex-col flex-1">
        <span className="text-[10px] tracking-wider uppercase text-charcoal-light/60 font-semibold">
          {product.category}
        </span>
        <Link href={`/product/${product.slug}`} className="block mt-1">
          <h3 className="font-display text-sm font-bold text-charcoal-dark group-hover:text-maroon transition-colors leading-tight uppercase">
            {product.name}
          </h3>
        </Link>

        {product.rating > 0 && (
          <div className="flex items-center gap-1.5 mt-1.5">
            <StarRating rating={Math.round(product.rating)} size="sm" />
            <span className="text-[11px] text-charcoal-light">
              {product.rating.toFixed(1)} ({product.reviewCount || 0})
            </span>
          </div>
        )}

        {activeVariants.length > 1 && (
          <div className="flex flex-wrap gap-1 mt-3">
            {activeVariants.map((v, i) => (
              <button
                key={v._id || i}
                onClick={(e) => { e.preventDefault(); e.stopPropagation(); setSelectedIdx(i); }}
                className={`text-[10px] font-semibold px-2.5 py-1 rounded-full border transition-all ${
                  selectedIdx === i
                    ? "bg-maroon text-white border-maroon"
                    : "bg-white text-charcoal-light border-sand-dark hover:border-maroon/50"
                }`}
              >
                {v.weight}
              </button>
            ))}
          </div>
        )}

        <div className="flex items-baseline gap-2 mt-2">
          <span className="font-bold text-maroon text-base">
            {selected ? formatPrice(selected.price) : "Sold Out"}
          </span>
          {selected?.compareAtPrice && selected.compareAtPrice > selected.price && (
            <span className="text-xs text-charcoal-light/60 line-through">
              {formatPrice(selected.compareAtPrice)}
            </span>
          )}
        </div>

        <div className="mt-auto pt-3 grid grid-cols-2 gap-2">
          <button
            onClick={handleAddToCart}
            disabled={!selected || selected.stock <= 0}
            className="btn-primary btn-sm disabled:opacity-40 disabled:cursor-not-allowed text-[11px]"
          >
            <ShoppingCart className="w-3.5 h-3.5 mr-1" />
            Add
          </button>
          <Link
            href={selected?.stock > 0 ? `/product/${product.slug}` : "#"}
            className="btn-golden btn-sm text-center text-[11px]"
          >
            Buy Now
          </Link>
        </div>
      </div>
    </div>
  );
}