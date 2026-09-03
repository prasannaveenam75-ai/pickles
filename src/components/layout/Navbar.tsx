"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import { useCartStore } from "@/store/cart";
import { ShoppingCart, Search, Menu, X, ChevronDown, ChevronRight, ArrowRight, Scale, User } from "lucide-react";
import { useCompareStore } from "@/store/compare";

interface NavCategory {
  _id: string;
  name: string;
  slug: string;
  parent?: string | null;
  displayOrder: number;
}

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [categoriesOpen, setCategoriesOpen] = useState(false);
  const [categories, setCategories] = useState<NavCategory[]>([]);
  const [mobileAccordion, setMobileAccordion] = useState<string | null>(null);
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [searching, setSearching] = useState(false);
  const itemCount = useCartStore((s) => s.getItemCount());
  const compareCount = useCompareStore((s) => s.items.length);
  const searchTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetch("/api/shop/categories")
      .then((r) => r.json())
      .then((d) => { if (d.success) setCategories(d.data || []); })
      .catch(() => {});
  }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (mobileOpen || searchOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen, searchOpen]);

  useEffect(() => {
    if (searchOpen && searchInputRef.current) {
      setTimeout(() => searchInputRef.current?.focus(), 100);
    }
    if (!searchOpen) {
      setSearchQuery("");
      setSearchResults([]);
    }
  }, [searchOpen]);

  const debouncedSearch = useCallback((q: string) => {
    if (searchTimeout.current) clearTimeout(searchTimeout.current);
    if (q.length < 2) { setSearchResults([]); setSearching(false); return; }
    setSearching(true);
    searchTimeout.current = setTimeout(async () => {
      try {
        const res = await fetch(`/api/shop?search=${encodeURIComponent(q)}&limit=6`);
        const data = await res.json();
        setSearchResults(data.data || []);
      } catch { setSearchResults([]); }
      setSearching(false);
    }, 300);
  }, []);

  const topLevel = categories.filter((c) => !c.parent);
  const getChildren = (parentId: string) => categories.filter((c) => c.parent === parentId);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/shop?search=${encodeURIComponent(searchQuery.trim())}`;
      setSearchOpen(false);
    }
  };

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? "bg-maroon-dark shadow-lg"
            : "bg-maroon-dark"
        }`}
        style={{ top: "32px" }}
      >
        <div className="container-custom mx-auto px-4">
          <div className="flex items-center justify-between h-14 md:h-16">
            {/* Mobile: hamburger left */}
            <button
              className="lg:hidden p-2 -ml-2 text-white/90 hover:text-white"
              onClick={() => setMobileOpen(true)}
              aria-label="Open menu"
            >
              <Menu className="w-6 h-6" />
            </button>

            {/* Logo center on mobile, left on desktop */}
            <Link href="/" className="flex items-center gap-2">
              <div className="flex flex-col items-center lg:items-start">
                <span className="text-lg md:text-xl font-display font-bold text-white tracking-tight leading-none">
                  DEVI PICKLES
                </span>
                <span className="text-[8px] md:text-[9px] text-golden tracking-[0.2em] uppercase font-medium hidden sm:block">
                  Swad Jo Dil Jeet Le!
                </span>
              </div>
            </Link>

            {/* Desktop nav */}
            <nav className="hidden lg:flex items-center gap-1 mx-8">
              <Link
                href="/"
                className="px-3 py-2 text-sm font-medium text-white/80 hover:text-white rounded-lg hover:bg-white/10 transition-all"
              >
                Home
              </Link>
              <Link
                href="/shop"
                className="px-3 py-2 text-sm font-medium text-white/80 hover:text-white rounded-lg hover:bg-white/10 transition-all"
              >
                Shop All
              </Link>
              {topLevel
                .filter((c) => c.slug !== "shop-all")
                .map((cat) => (
                  <Link
                    key={cat._id}
                    href={cat.slug === "shop-all" ? "/shop" : `/shop/${cat.slug}`}
                    className="px-3 py-2 text-sm font-medium text-white/80 hover:text-white rounded-lg hover:bg-white/10 transition-all whitespace-nowrap"
                  >
                    {cat.name === "Non-Veg Pickles" ? "Non-Veg Pickles" : cat.name}
                  </Link>
                ))}
              <Link
                href="/about"
                className="px-3 py-2 text-sm font-medium text-white/80 hover:text-white rounded-lg hover:bg-white/10 transition-all"
              >
                About Us
              </Link>
            </nav>

            {/* Right icons */}
            <div className="flex items-center gap-1 md:gap-2">
              <Link href="/account" className="p-2 text-white/80 hover:text-white transition-colors" aria-label="My Account">
                <User className="w-5 h-5" />
              </Link>
              <button
                onClick={() => setSearchOpen(true)}
                className="p-2 text-white/80 hover:text-white transition-colors"
                aria-label="Search"
              >
                <Search className="w-5 h-5" />
              </button>
              <Link href="/compare" className="relative p-2 text-white/80 hover:text-white transition-colors" aria-label="Compare">
                <Scale className="w-5 h-5" />
                {compareCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 bg-golden text-white text-[9px] font-bold min-w-[18px] h-[18px] rounded-full flex items-center justify-center">
                    {compareCount > 9 ? "9+" : compareCount}
                  </span>
                )}
              </Link>
              <Link href="/cart" className="relative p-2 text-white/80 hover:text-white transition-colors" aria-label="Cart">
                <ShoppingCart className="w-5 h-5" />
                {itemCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 bg-golden text-white text-[9px] font-bold min-w-[18px] h-[18px] rounded-full flex items-center justify-center">
                    {itemCount > 99 ? "99+" : itemCount}
                  </span>
                )}
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Search Modal */}
      {searchOpen && (
        <div className="fixed inset-0 z-[70] bg-black/60 backdrop-blur-sm" onClick={() => setSearchOpen(false)}>
          <div className="w-full max-w-lg mx-auto mt-20 px-4 animate-slide-up" onClick={(e) => e.stopPropagation()}>
            <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
              <form onSubmit={handleSearch} className="flex items-center gap-3 p-4 border-b border-sand-dark/20">
                <Search className="w-5 h-5 text-charcoal-light flex-shrink-0" />
                <input
                  ref={searchInputRef}
                  type="text"
                  value={searchQuery}
                  onChange={(e) => { setSearchQuery(e.target.value); debouncedSearch(e.target.value); }}
                  placeholder="Search for pickles, powders..."
                  className="flex-1 text-base outline-none text-charcoal bg-transparent placeholder:text-charcoal-light/40"
                />
                <button type="button" onClick={() => setSearchOpen(false)} className="p-1 text-charcoal-light hover:text-charcoal">
                  <X className="w-5 h-5" />
                </button>
              </form>

              {searchResults.length > 0 && (
                <div className="max-h-80 overflow-y-auto">
                  {searchResults.map((p: any) => (
                    <Link
                      key={p._id}
                      href={`/product/${p.slug}`}
                      onClick={() => setSearchOpen(false)}
                      className="flex items-center gap-3 px-4 py-3 hover:bg-cream transition-colors"
                    >
                      <div className="w-12 h-12 rounded-lg overflow-hidden bg-cream-dark/30 flex-shrink-0">
                        {p.images?.[0] ? (
                          <img src={p.images[0]} alt={p.name} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <span className="text-[8px] text-charcoal-light">{p.name.charAt(0)}</span>
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-charcoal-dark truncate">{p.name}</p>
                        <p className="text-xs text-charcoal-light">{p.category}</p>
                      </div>
                      <span className="text-sm font-semibold text-maroon">
                        ₹{Math.min(...(p.variants?.map((v: any) => v.price) || [0]))}
                      </span>
                    </Link>
                  ))}
                </div>
              )}

              {searchQuery.length >= 2 && searchResults.length === 0 && !searching && (
                <div className="p-8 text-center">
                  <p className="text-sm text-charcoal-light">No products found</p>
                </div>
              )}

              {searchQuery.length < 2 && (
                <div className="p-4">
                  <p className="text-[10px] text-charcoal-light uppercase tracking-wider mb-2 font-semibold">Popular Searches</p>
                  <div className="flex flex-wrap gap-2">
                    {["Avakai Pickle", "Chicken Pickle", "Gongura Pickle", "Lemon Pickle", "Pappula Podi"].map((term) => (
                      <button
                        key={term}
                        onClick={() => { setSearchQuery(term); debouncedSearch(term); }}
                        className="px-3 py-1.5 text-xs bg-cream rounded-full text-charcoal-light hover:bg-cream-dark transition-colors"
                      >
                        {term}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Mobile Slide-out Menu */}
      {mobileOpen && (
        <div className="fixed inset-0 z-[60] lg:hidden">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setMobileOpen(false)} />
          <div className="absolute top-0 left-0 w-80 max-w-[85vw] h-full bg-white shadow-2xl animate-slide-in-left overflow-y-auto">
            <div className="p-5">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <span className="text-lg font-display font-bold text-maroon">DEVI PICKLES</span>
                  <p className="text-[9px] text-charcoal-light tracking-wider uppercase">Swad Jo Dil Jeet Le!</p>
                </div>
                <button onClick={() => setMobileOpen(false)} className="p-2 text-charcoal-light hover:text-red transition-colors">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <nav className="space-y-1">
                {[
                  { href: "/", label: "Home" },
                  { href: "/shop", label: "Shop All" },
                  { href: "/compare", label: "Compare" },
                  { href: "/track-order", label: "Track Order" },
                  { href: "/account", label: "My Account" },
                  { href: "/about", label: "About Us" },
                  { href: "/contact", label: "Contact" },
                ].map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setMobileOpen(false)}
                    className="flex items-center justify-between px-4 py-3 text-charcoal hover:bg-cream hover:text-maroon rounded-xl transition-colors font-medium text-sm"
                  >
                    {link.label}
                    <ArrowRight className="w-4 h-4 text-charcoal-light/40" />
                  </Link>
                ))}

                <div className="pt-2">
                  <p className="px-4 py-2 text-[10px] text-charcoal-light uppercase tracking-wider font-semibold">Categories</p>
                  {topLevel.map((cat) => {
                    const children = getChildren(cat._id);
                    const isOpen = mobileAccordion === cat._id;
                    return (
                      <div key={cat._id}>
                        <div className="flex items-center">
                          <Link
                            href={`/shop/${cat.slug}`}
                            onClick={() => setMobileOpen(false)}
                            className="flex-1 px-4 py-2.5 text-charcoal hover:bg-cream hover:text-maroon rounded-xl transition-colors font-medium text-sm"
                          >
                            {cat.name}
                          </Link>
                          {children.length > 0 && (
                            <button
                              onClick={() => setMobileAccordion(isOpen ? null : cat._id)}
                              className="p-2.5 text-charcoal-light"
                            >
                              <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? "rotate-180" : ""}`} />
                            </button>
                          )}
                        </div>
                        {isOpen && children.length > 0 && (
                          <div className="pl-6 pb-1">
                            {children.map((child) => (
                              <Link
                                key={child._id}
                                href={`/shop/${child.slug}`}
                                onClick={() => setMobileOpen(false)}
                                className="block px-4 py-2 text-sm text-charcoal-light hover:text-maroon transition-colors"
                              >
                                {child.name}
                              </Link>
                            ))}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </nav>

              <div className="mt-6 pt-4 border-t border-sand-dark/30">
                <a
                  href="https://wa.me/918008062755?text=Hi! I'm interested in Devi Pickles."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 px-4 py-3 bg-veg/10 rounded-xl text-veg font-medium text-sm"
                >
                  <span className="w-8 h-8 bg-veg rounded-full flex items-center justify-center text-white text-xs font-bold">WA</span>
                  Chat on WhatsApp
                </a>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="h-[88px] md:h-[96px]" />
    </>
  );
}
