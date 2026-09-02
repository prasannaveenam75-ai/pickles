"use client";

import { useMemo, useState } from "react";
import { Search, SlidersHorizontal, X, ChevronDown } from "lucide-react";
import ProductGrid from "@/components/ui/ProductGrid";

interface ShopControlsProps {
  products: any[];
  categories: any[];
}

export default function ShopControls({ products, categories }: ShopControlsProps) {
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedSubcategory, setSelectedSubcategory] = useState("all");
  const [sortBy, setSortBy] = useState("featured");
  const [priceFilter, setPriceFilter] = useState("all");
  const [weightFilter, setWeightFilter] = useState("all");
  const [showFilters, setShowFilters] = useState(false);

  const parentCategories = categories.filter((c: any) => !c.parent);
  const subcategories = useMemo(() => {
    if (selectedCategory === "all") return [];
    const parent = categories.find((c: any) => c.name === selectedCategory && !c.parent);
    return parent ? categories.filter((c: any) => c.parent === parent._id) : [];
  }, [selectedCategory, categories]);

  const allWeights = useMemo(() => {
    const set = new Set<string>();
    products.forEach((p: any) => p.variants?.forEach((v: any) => set.add(v.weight)));
    return Array.from(set).sort();
  }, [products]);

  const filtered = useMemo(() => {
    let result = [...products];

    if (search) {
      const q = search.toLowerCase();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.description?.toLowerCase().includes(q) ||
          p.category?.toLowerCase().includes(q) ||
          p.subcategory?.toLowerCase().includes(q) ||
          p.tags?.some((t: string) => t.toLowerCase().includes(q))
      );
    }

    if (selectedCategory !== "all") {
      result = result.filter((p) => p.category === selectedCategory);
    }

    if (selectedSubcategory !== "all") {
      result = result.filter((p) => p.subcategory === selectedSubcategory);
    }

    if (priceFilter !== "all") {
      const [min, max] = priceFilter.split("-").map(Number);
      result = result.filter((p) => {
        const minPrice = Math.min(...p.variants.map((v: any) => v.price));
        if (max) return minPrice >= min && minPrice <= max;
        return minPrice >= min;
      });
    }

    if (weightFilter !== "all") {
      result = result.filter((p) =>
        p.variants?.some((v: any) => v.weight === weightFilter)
      );
    }

    switch (sortBy) {
      case "price_asc":
        result.sort((a, b) => Math.min(...a.variants.map((v: any) => v.price)) - Math.min(...b.variants.map((v: any) => v.price)));
        break;
      case "price_desc":
        result.sort((a, b) => Math.min(...b.variants.map((v: any) => v.price)) - Math.min(...a.variants.map((v: any) => v.price)));
        break;
      case "name":
        result.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case "bestSeller":
        result.sort((a, b) => (b.bestSeller ? 1 : 0) - (a.bestSeller ? 1 : 0));
        break;
      case "newest":
        result.sort((a, b) => (b.newProduct ? 1 : 0) - (a.newProduct ? 1 : 0));
        break;
      default:
        result.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
    }

    return result;
  }, [products, search, selectedCategory, selectedSubcategory, sortBy, priceFilter, weightFilter]);

  const clearFilters = () => {
    setSearch("");
    setSelectedCategory("all");
    setSelectedSubcategory("all");
    setSortBy("featured");
    setPriceFilter("all");
    setWeightFilter("all");
  };

  const hasActiveFilters = selectedCategory !== "all" || selectedSubcategory !== "all" || priceFilter !== "all" || weightFilter !== "all";

  const FilterSidebar = () => (
    <div className="bg-white rounded-xl p-5 border border-cream-dark/30 space-y-6 lg:sticky lg:top-24">
      <div>
        <h3 className="font-semibold text-charcoal-dark text-sm mb-3">Category</h3>
        <div className="space-y-1.5">
          <button
            onClick={() => { setSelectedCategory("all"); setSelectedSubcategory("all"); }}
            className={`block w-full text-left text-sm px-3 py-2 rounded-lg transition-colors ${
              selectedCategory === "all" ? "bg-maroon text-white font-medium" : "text-charcoal-light hover:bg-cream"
            }`}
          >
            All Categories
          </button>
          {parentCategories.map((cat: any) => (
            <div key={cat._id}>
              <button
                onClick={() => { setSelectedCategory(cat.name); setSelectedSubcategory("all"); }}
                className={`block w-full text-left text-sm px-3 py-2 rounded-lg transition-colors ${
                  selectedCategory === cat.name ? "bg-maroon text-white font-medium" : "text-charcoal-light hover:bg-cream"
                }`}
              >
                {cat.name}
              </button>
            </div>
          ))}
        </div>
      </div>

      {subcategories.length > 0 && (
        <div>
          <h3 className="font-semibold text-charcoal-dark text-sm mb-3">Subcategory</h3>
          <div className="space-y-1.5">
            <button
              onClick={() => setSelectedSubcategory("all")}
              className={`block w-full text-left text-sm px-3 py-2 rounded-lg transition-colors ${
                selectedSubcategory === "all" ? "bg-maroon text-white font-medium" : "text-charcoal-light hover:bg-cream"
              }`}
            >
              All {selectedCategory}
            </button>
            {subcategories.map((sub: any) => (
              <button
                key={sub._id}
                onClick={() => setSelectedSubcategory(sub.name)}
                className={`block w-full text-left text-sm px-3 py-2 rounded-lg transition-colors ${
                  selectedSubcategory === sub.name ? "bg-maroon text-white font-medium" : "text-charcoal-light hover:bg-cream"
                }`}
              >
                {sub.name}
              </button>
            ))}
          </div>
        </div>
      )}

      <div>
        <h3 className="font-semibold text-charcoal-dark text-sm mb-3">Price Range</h3>
        <div className="space-y-1.5">
          {[
            { label: "All Prices", value: "all" },
            { label: "Under ₹200", value: "0-200" },
            { label: "₹200 – ₹400", value: "200-400" },
            { label: "₹400 – ₹700", value: "400-700" },
            { label: "Above ₹700", value: "700-" },
          ].map((opt) => (
            <button
              key={opt.value}
              onClick={() => setPriceFilter(opt.value)}
              className={`block w-full text-left text-sm px-3 py-2 rounded-lg transition-colors ${
                priceFilter === opt.value ? "bg-maroon text-white font-medium" : "text-charcoal-light hover:bg-cream"
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {allWeights.length > 1 && (
        <div>
          <h3 className="font-semibold text-charcoal-dark text-sm mb-3">Weight</h3>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setWeightFilter("all")}
              className={`text-xs px-3 py-1.5 rounded-full border transition-colors ${
                weightFilter === "all" ? "bg-maroon text-white border-maroon" : "border-cream-dark text-charcoal-light hover:border-maroon/50"
              }`}
            >
              All
            </button>
            {allWeights.map((w) => (
              <button
                key={w}
                onClick={() => setWeightFilter(w)}
                className={`text-xs px-3 py-1.5 rounded-full border transition-colors ${
                  weightFilter === w ? "bg-maroon text-white border-maroon" : "border-cream-dark text-charcoal-light hover:border-maroon/50"
                }`}
              >
                {w}
              </button>
            ))}
          </div>
        </div>
      )}

      {hasActiveFilters && (
        <button onClick={clearFilters} className="text-xs text-red hover:text-red/80 uppercase tracking-wider flex items-center gap-1">
          <X className="w-3 h-3" /> Clear All Filters
        </button>
      )}
    </div>
  );

  return (
    <div className="container-custom mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex flex-col lg:flex-row gap-4 mb-8">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-charcoal-light/50" />
          <input
            type="text"
            placeholder="Search pickles, snacks, sweets..."
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
          {hasActiveFilters && <span className="w-2 h-2 bg-maroon rounded-full" />}
        </button>
      </div>

      <div className="grid gap-6 lg:grid-cols-[240px_1fr]">
        <aside className={`lg:block ${showFilters ? "block" : "hidden"}`}>
          {showFilters && (
            <div className="lg:hidden mb-4">
              <FilterSidebar />
            </div>
          )}
          <div className="hidden lg:block">
            <FilterSidebar />
          </div>
        </aside>

        <div>
          <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
            <p className="text-sm text-charcoal-light">
              Showing <span className="font-semibold text-charcoal-dark">{filtered.length}</span> of {products.length} products
              {hasActiveFilters && (
                <button onClick={clearFilters} className="ml-2 text-maroon underline text-xs">clear filters</button>
              )}
            </p>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="input-field w-auto px-3 py-2 text-sm"
              aria-label="Sort products"
            >
              <option value="featured">Featured</option>
              <option value="bestSeller">Best Selling</option>
              <option value="newest">Newest</option>
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