"use client";

import Image from "next/image";
import Link from "next/link";
import { useCartStore } from "@/store/cart";
import { formatPrice } from "@/lib/utils";
import { StarRating } from "@/components/ui/StarRating";
import type { IProduct } from "@/types";

export default function ProductCard({ product }: { product: IProduct }) {
  const addItem = useCartStore((s) => s.addItem);

  if (!product) return null;

  const activeVariants = product.variants?.filter((v) => v.active) || [];
  const minPrice = activeVariants.length > 0
    ? Math.min(...activeVariants.map((v) => v.price))
    : 0;
  const firstVariant = activeVariants[0];
  const minVariant =
    activeVariants.length > 0
      ? activeVariants.reduce((a, b) => (a.price <= b.price ? a : b))
      : null;
  const multiplePrices = new Set(activeVariants.map((v) => v.price)).size > 1;
  const offerPct =
    minVariant?.compareAtPrice && minVariant.compareAtPrice > minVariant.price
      ? Math.round(((minVariant.compareAtPrice - minVariant.price) / minVariant.compareAtPrice) * 100)
      : 0;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!firstVariant) return;
    addItem({
      productId: product._id,
      productName: product.name,
      variantId: firstVariant._id || "",
      variantName: firstVariant.name,
      weight: firstVariant.weight,
      weightInGrams: firstVariant.weightInGrams,
      price: firstVariant.price,
      image: product.images?.[0] || "",
      quantity: 1,
      stock: firstVariant.stock,
      category: product.category,
    });
  };

  const variantNames = activeVariants.map((v) => v.weight).join(" • ");

  return (
    <div className="product-card flex flex-col">
      <Link href={`/product/${product.slug}`} className="relative block overflow-hidden">
        <div className="aspect-square bg-cream-dark/30 flex items-center justify-center overflow-hidden">
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
            <div className="w-full h-full flex items-center justify-center bg-cream-dark/50">
              <span className="text-charcoal-light/40 font-display text-sm uppercase tracking-wider">
                {product.name}
              </span>
            </div>
          )}
        </div>
        {product.bestSeller && (
          <span className="absolute top-3 left-3 badge bg-red text-white">Best Seller</span>
        )}
        {offerPct > 0 && (
          <span className="absolute top-3 right-3 badge bg-golden text-white">{offerPct}% OFF</span>
        )}
      </Link>

      <div className="p-4 flex flex-col flex-1">
        <span className="text-[10px] tracking-wider uppercase text-charcoal-light/60 font-semibold">
          {product.category}
        </span>
        <Link href={`/product/${product.slug}`} className="block mt-1">
          <h3 className="font-display text-sm font-bold text-charcoal-dark hover:text-green transition-colors leading-tight uppercase">
            {product.name}
          </h3>
        </Link>

        <div className="mt-2 flex flex-col gap-1.5">
          {product.rating > 0 && (
            <div className="flex items-center gap-1.5">
              <StarRating rating={Math.round(product.rating)} size="sm" />
              <span className="text-[11px] text-charcoal-light">
                {product.rating.toFixed(1)} ({product.reviewCount || 0})
              </span>
            </div>
          )}
          <div className="flex items-baseline gap-2 flex-wrap">
            <span className="font-semibold text-green text-base">
              {minPrice > 0 ? `${multiplePrices ? "From " : ""}${formatPrice(minPrice)}` : "Sold Out"}
            </span>
            {minVariant?.compareAtPrice && minVariant.compareAtPrice > minVariant.price && (
              <span className="text-xs text-charcoal-light line-through">
                {formatPrice(minVariant.compareAtPrice)}
              </span>
            )}
          </div>
        </div>
        <p className="mt-1 text-[11px] text-charcoal-light/60">{variantNames}</p>

        <div className="mt-auto pt-4 grid grid-cols-2 gap-2">
          <button
            onClick={handleAddToCart}
            disabled={!firstVariant || firstVariant.stock <= 0}
            className="btn-primary btn-sm disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Add
          </button>
          <Link
            href={firstVariant?.stock > 0 ? `/product/${product.slug}` : "#"}
            className="btn-golden btn-sm text-center disabled:opacity-40"
            aria-disabled={!firstVariant || firstVariant.stock <= 0}
          >
            Buy Now
          </Link>
        </div>
      </div>
    </div>
  );
}
