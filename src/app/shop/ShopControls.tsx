"use client";

import { useMemo, useState } from "react";
import { Search, SlidersHorizontal, X } from "lucide-react";
import ProductGrid from "@/components/ui/ProductGrid";

interface ShopControlsProps {
  products: any[];
  categories: any[];
}

export default function ShopControls({ products, categories }: ShopControlsProps) {
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [sortBy, setSortBy] = useState("featured");
  const [priceFilter, setPriceFilter] = useState("all");
  const [showFilters, setShowFilters] = useState(false);

  const filtered = useMemo(() => {
    let result = [...products];

    if (search) {
      const q = search.toLowerCase();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.description?.toLowerCase().includes(q) ||
          p.category?.toLowerCase().includes(q) ||
          p.tags?.some((t: string) => t.toLowerCase().includes(q))
      );
    }

    if (selectedCategory !== "all") {
      result = result.filter((p) => p.category === selectedCategory);
    }

    if (priceFilter !== "all") {
      const [min, max] = priceFilter.split("-").map(Number);
      result = result.filter((p) => {
        const minPrice = Math.min(...p.variants.map((v: any) => v.price));
        if (max) return minPrice >= min && minPrice <= max;
        return minPrice >= min;
      });
    }

    switch (sortBy) {
      case "price_asc":
        result.sort((a, b) => {
          const ap = Math.min(...a.variants.map((v: any) => v.price));
          const bp = Math.min(...b.variants.map((v: any) => v.price));
          return ap - bp;
        });
        break;
      case "price_desc":
        result.sort((a, b) => {
          const ap = Math.min(...a.variants.map((v: any) => v.price));
          const bp = Math.min(...b.variants.map((v: any) => v.price));
          return bp - ap;
        });
        break;
      case "name":
        result.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case "bestSeller":
        result.sort((a, b) => (b.bestSeller ? 1 : 0) - (a.bestSeller ? 1 : 0));
        break;
      default:
        result.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
    }

    return result;
  }, [products, search, selectedCategory, sortBy, priceFilter]);

  const clearFilters = () => {
    setSearch("");
    setSelectedCategory("all");
    setSortBy("featured");
    setPriceFilter("all");
  };

  return (
    <div className="container-custom mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex flex-col lg:flex-row gap-4 mb-8">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-charcoal-light/50" />
          <input
            type="text"
            placeholder="Search pickles..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="input-field pl-10"
            aria-label="Search products"
          />
        </div>
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="lg:hidden inline-flex items-center gap-2 px-4 py-3 bg-white border border-cream-dark/50 rounded-lg text-sm font-medium"
        >
          <SlidersHorizontal className="w-4 h-4" />
          Filters
        </button>
      </div>

      <div className={`grid gap-6 lg:grid-cols-[220px_1fr] ${showFilters ? "block" : ""}`}>
        <aside className={`lg:block ${showFilters ? "" : "hidden"}`}>
          <div className="bg-white rounded-xl p-5 border border-cream-dark/30 space-y-6 lg:sticky lg:top-24">
            <div>
              <h3 className="font-semibold text-charcoal-dark text-sm mb-3">Category</h3>
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm cursor-pointer">
                  <input
                    type="radio"
                    name="category"
                    value="all"
                    checked={selectedCategory === "all"}
                    onChange={() => setSelectedCategory("all")}
                    className="accent-green"
                  />
                  All Categories
                </label>
                {categories.map((cat) => (
                  <label key={cat._id} className="flex items-center gap-2 text-sm cursor-pointer">
                    <input
                      type="radio"
                      name="category"
                      value={cat.name}
                      checked={selectedCategory === cat.name}
                      onChange={() => setSelectedCategory(cat.name)}
                      className="accent-green"
                    />
                    {cat.name}
                  </label>
                ))}
              </div>
            </div>

            <div>
              <h3 className="font-semibold text-charcoal-dark text-sm mb-3">Price</h3>
              <div className="space-y-2">
                {[
                  { label: "All Prices", value: "all" },
                  { label: "₹100 – ₹300", value: "100-300" },
                  { label: "₹300 – ₹500", value: "300-500" },
                  { label: "₹500 – ₹1000", value: "500-1000" },
                  { label: "₹1000+", value: "1000-" },
                ].map((opt) => (
                  <label key={opt.value} className="flex items-center gap-2 text-sm cursor-pointer">
                    <input
                      type="radio"
                      name="price"
                      value={opt.value}
                      checked={priceFilter === opt.value}
                      onChange={() => setPriceFilter(opt.value)}
                      className="accent-green"
                    />
                    {opt.label}
                  </label>
                ))}
              </div>
            </div>

            <button onClick={clearFilters} className="text-xs text-charcoal-light hover:text-red uppercase tracking-wider flex items-center gap-1">
              <X className="w-3 h-3" /> Clear Filters
            </button>
          </div>
        </aside>

        <div>
          <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
            <p className="text-sm text-charcoal-light">
              Showing {filtered.length} of {products.length} products
            </p>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="input-field w-auto px-3 py-2 text-sm"
              aria-label="Sort products"
            >
              <option value="featured">Featured</option>
              <option value="bestSeller">Best Selling</option>
              <option value="price_asc">Price: Low to High</option>
              <option value="price_desc">Price: High to Low</option>
              <option value="name">Name: A to Z</option>
            </select>
          </div>

          {filtered.length > 0 ? (
            <ProductGrid products={filtered} />
          ) : (
            <div className="text-center py-16">
              <h3 className="font-display text-xl font-bold text-charcoal mb-2">No products found</h3>
              <p className="text-charcoal-light mb-6">Try adjusting your search or filters.</p>
              <button onClick={clearFilters} className="btn-secondary btn-sm">Clear Filters</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
