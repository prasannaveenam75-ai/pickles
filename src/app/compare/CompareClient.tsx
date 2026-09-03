"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Scale, ShoppingCart, Trash2, Star, X } from "lucide-react";
import { useCompareStore } from "@/store/compare";
import { useCartStore } from "@/store/cart";
import { formatPrice } from "@/lib/utils";

export default function CompareClient() {
  const { items, remove, clear } = useCompareStore();
  const addItem = useCartStore((s) => s.addItem);
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      if (!items.length) {
        setProducts([]);
        setLoading(false);
        return;
      }
      setLoading(true);
      try {
        const res = await fetch(`/api/shop?limit=50`);
        const data = await res.json();
        if (data.success) {
          const all = data.data || [];
          const byId = new Map(all.map((p: any) => [String(p._id), p]));
          setProducts(items.map((i) => byId.get(i.productId)).filter(Boolean));
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
    const selected = p.variants?.filter((v: any) => v.active && v.stock > 0)?.[0];
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

  if (loading) {
    return (
      <div className="container-custom mx-auto px-4 py-8 md:py-12 min-h-[50vh]">
        <div className="skeleton h-8 w-48 mb-6 rounded-lg" />
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="skeleton aspect-[3/4] rounded-2xl" />
          ))}
        </div>
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="container-custom mx-auto px-4 py-8 md:py-12 min-h-[50vh]">
        <div className="text-center py-16 bg-white rounded-2xl border border-cream-dark/20">
          <div className="w-20 h-20 bg-maroon/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <Scale className="w-10 h-10 text-maroon/40" />
          </div>
          <h2 className="font-display text-xl font-bold text-charcoal mb-2">Nothing to compare yet</h2>
          <p className="text-charcoal-light mb-8">Tap the compare icon on any product to add it here.</p>
          <Link href="/shop" className="btn-primary">Explore Products</Link>
        </div>
      </div>
    );
  }

  const rows: { label: string; render: (p: any) => React.ReactNode }[] = [
    {
      label: "Price",
      render: (p) => {
        const prices = (p.variants || []).map((v: any) => v.price);
        const min = prices.length ? Math.min(...prices) : 0;
        return <span className="font-bold text-maroon text-base">{formatPrice(min)}</span>;
      },
    },
    { label: "Category", render: (p) => p.category },
    {
      label: "Rating",
      render: (p) => (
        <span className="inline-flex items-center gap-1 font-semibold">
          <Star className="w-4 h-4 text-golden fill-current" /> {p.rating || "—"}
        </span>
      ),
    },
    {
      label: "Weight Options",
      render: (p) => (
        <div className="flex flex-wrap gap-1.5 justify-center">
          {(p.variants || []).map((v: any) => (
            <span key={v._id || v.weight} className="text-[10px] font-semibold px-2.5 py-1 rounded-full border border-sand-dark">
              {v.weight}
            </span>
          ))}
        </div>
      ),
    },
    {
      label: "Description",
      render: (p) => <p className="text-xs leading-relaxed text-center max-w-[240px] mx-auto">{p.shortDescription || p.description || "—"}</p>,
    },
    {
      label: "Ingredients",
      render: (p) => (
        <div className="flex flex-wrap gap-1.5 justify-center max-w-[240px] mx-auto">
          {p.ingredients && p.ingredients.length
            ? p.ingredients.map((i: string) => (
                <span key={i} className="text-[10px] px-2 py-0.5 rounded-full bg-cream text-charcoal-light">
                  {i}
                </span>
              ))
            : "—"}
        </div>
      ),
    },
    {
      label: "Benefits",
      render: (p) => (
        <ul className="text-xs leading-relaxed list-disc list-inside text-left max-w-[240px] mx-auto space-y-1">
          {p.benefits && p.benefits.length ? p.benefits.map((b: string) => <li key={b}>{b}</li>) : "—"}
        </ul>
      ),
    },
    { label: "Shelf Life", render: (p) => p.shelfLife || "—" },
    { label: "Storage", render: (p) => p.storageInstructions || "—" },
    {
      label: "Stock",
      render: (p) => {
        const hasStock = (p.variants || []).some((v: any) => v.active && v.stock > 0);
        return hasStock ? (
          <span className="text-xs font-bold text-veg">In Stock</span>
        ) : (
          <span className="text-xs font-bold text-red">Out of Stock</span>
        );
      },
    },
  ];

  return (
    <div className="container-custom mx-auto px-4 py-8 md:py-12 min-h-[50vh]">
      <div className="flex items-center justify-between mb-6 md:mb-8 flex-wrap gap-3">
        <div>
          <h1 className="text-2xl md:text-3xl font-display font-bold text-charcoal-dark flex items-center gap-2">
            <Scale className="w-6 h-6 text-maroon" /> Compare Products
          </h1>
          <p className="text-sm text-charcoal-light mt-1">Compare {products.length} product{products.length > 1 ? "s" : ""} side by side</p>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/shop" className="text-sm font-semibold text-maroon hover:text-maroon-light uppercase tracking-wider">
            Shop All
          </Link>
          <button onClick={clear} className="text-sm font-medium text-red hover:text-red-dark">
            Clear All
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse min-w-[640px]">
          <thead>
            <tr>
              <th className="p-3 text-left align-bottom w-32">
                <span className="text-[10px] uppercase tracking-wider text-charcoal-light font-semibold">Specifications</span>
              </th>
              {products.map((p) => (
                <th key={p._id} className="p-3 text-center align-top">
                  <div className="relative inline-block">
                    <button
                      onClick={() => remove(p._id)}
                      className="absolute -top-2 -right-2 z-10 w-6 h-6 rounded-full bg-red text-white flex items-center justify-center shadow-sm hover:bg-red-dark transition-colors"
                      aria-label={`Remove ${p.name} from compare`}
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                    <Link href={`/product/${p.slug}`} className="block w-28 md:w-32">
                      <div className="aspect-square bg-sand-light rounded-xl overflow-hidden mb-2 border border-cream-dark/20">
                        {p.images?.[0] ? (
                          <Image src={p.images[0]} alt={p.name} width={200} height={200} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <span className="font-display text-xl font-bold text-maroon/30">{p.name.charAt(0)}</span>
                          </div>
                        )}
                      </div>
                      <h3 className="font-display text-[13px] font-bold text-charcoal-dark leading-snug line-clamp-2">{p.name}</h3>
                    </Link>
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.label} className="border-t border-cream-dark/20">
                <td className="p-3 text-[11px] uppercase tracking-wider text-charcoal-light font-semibold align-top bg-cream/30">
                  {row.label}
                </td>
                {products.map((p) => (
                  <td key={p._id} className="p-3 text-center text-sm text-charcoal align-top">
                    {row.render(p)}
                  </td>
                ))}
              </tr>
            ))}
            <tr className="border-t border-cream-dark/20">
              <td className="p-3 bg-cream/30" />
              {products.map((p) => {
                const hasStock = (p.variants || []).some((v: any) => v.active && v.stock > 0);
                return (
                  <td key={p._id} className="p-3 text-center">
                    {hasStock ? (
                      <button
                        onClick={() => handleAddToCart(p)}
                        className="inline-flex items-center gap-1.5 bg-maroon text-white text-xs font-semibold px-4 py-2.5 rounded-full hover:bg-maroon-light transition-colors"
                      >
                        <ShoppingCart className="w-3.5 h-3.5" /> ADD TO CART
                      </button>
                    ) : (
                      <span className="text-xs font-semibold text-red">Out of Stock</span>
                    )}
                  </td>
                );
              })}
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
