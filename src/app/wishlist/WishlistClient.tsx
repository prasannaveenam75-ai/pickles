"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Heart, ShoppingCart, Trash2 } from "lucide-react";
import { useWishlistStore } from "@/store/wishlist";
import { useCartStore } from "@/store/cart";
import { formatPrice } from "@/lib/utils";

export default function WishlistClient() {
  const { items, remove } = useWishlistStore();
  const addItem = useCartStore((s) => s.addItem);
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      if (!items.length) { setProducts([]); setLoading(false); return; }
      setLoading(true);
      try {
        const ids = items.map((i) => i.productId);
        const res = await fetch(`/api/shop?limit=50`);
        const data = await res.json();
        if (data.success) {
          const all = data.data || [];
          setProducts(all.filter((p: any) => ids.includes(String(p._id))));
        }
      } catch {
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [items]);

  const handleAddToCart = (p: any) => {
    const selected = p.variants?.filter((v: any) => v.active)?.[0];
    if (!selected) return;
    addItem({
      productId: p._id,
      productName: p.name,
      variantId: selected._id || "",
      variantName: selected.name,
      weight: selected.weight,
      weightInGrams: selected.weightInGrams,
      price: selected.price,
      image: p.images?.[0] || "",
      quantity: 1,
      stock: selected.stock,
      category: p.category,
    });
  };

  return (
    <div className="container-custom mx-auto px-4 py-8 md:py-12 min-h-[50vh]">
      <div className="flex items-center justify-between mb-6 md:mb-8">
        <div>
          <h1 className="text-2xl md:text-3xl font-display font-bold text-charcoal-dark flex items-center gap-2">
            <Heart className="w-6 h-6 text-red" /> My Wishlist
          </h1>
          <p className="text-sm text-charcoal-light mt-1">
            {items.length > 0 ? `${items.length} saved item${items.length > 1 ? "s" : ""}` : "Save your favourite products here"}
          </p>
        </div>
        <Link href="/shop" className="text-sm font-semibold text-maroon hover:text-maroon-light uppercase tracking-wider">
          Shop All
        </Link>
      </div>

      {loading ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-5">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="skeleton aspect-[3/4] rounded-2xl" />
          ))}
        </div>
      ) : products.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-cream-dark/20">
          <div className="w-20 h-20 bg-red/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <Heart className="w-10 h-10 text-red/40" />
          </div>
          <h2 className="font-display text-xl font-bold text-charcoal mb-2">Your wishlist is empty</h2>
          <p className="text-charcoal-light mb-8">Tap the heart on any product to save it here.</p>
          <Link href="/shop" className="btn-primary">Explore Products</Link>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-5">
          {products.map((p) => {
            const minPrice = p.variants?.length ? Math.min(...p.variants.map((v: any) => v.price)) : 0;
            const hasStock = p.variants?.some((v: any) => v.active && v.stock > 0);
            return (
              <div key={p._id} className="product-card group flex flex-col">
                <Link href={`/product/${p.slug}`} className="relative block overflow-hidden">
                  <div className="aspect-square bg-sand-light relative overflow-hidden">
                    {p.images?.[0] ? (
                      <Image src={p.images[0]} alt={p.name} width={400} height={400} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <span className="font-display text-2xl font-bold text-maroon/30">{p.name.charAt(0)}</span>
                      </div>
                    )}
                  </div>
                </Link>
                <div className="p-3 md:p-4 flex flex-col flex-1">
                  <span className="text-[9px] md:text-[10px] uppercase text-charcoal-light/60 font-semibold">{p.category}</span>
                  <Link href={`/product/${p.slug}`}>
                    <h3 className="font-display text-[13px] md:text-sm font-bold text-charcoal-dark line-clamp-1 mt-0.5">{p.name}</h3>
                  </Link>
                  <div className="flex items-baseline gap-2 mt-1.5">
                    <span className="font-bold text-maroon text-sm md:text-base">{formatPrice(minPrice)}</span>
                  </div>
                  <div className="mt-auto pt-3 flex items-center gap-2">
                    {!hasStock && (
                      <span className="flex-1 text-center text-xs font-semibold text-red py-2.5">Out of Stock</span>
                    )}
                    {hasStock && (
                      <button
                        onClick={() => handleAddToCart(p)}
                        className="flex-1 inline-flex items-center justify-center gap-1 bg-maroon text-white text-xs font-semibold py-2.5 rounded-full hover:bg-maroon-light transition-colors"
                      >
                        <ShoppingCart className="w-3.5 h-3.5" /> ADD
                      </button>
                    )}
                    <button
                      onClick={() => remove(p._id)}
                      className="w-9 h-9 rounded-full flex items-center justify-center text-red bg-red/10 hover:bg-red hover:text-white transition-colors"
                      aria-label="Remove from wishlist"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
