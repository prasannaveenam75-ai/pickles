"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useCartStore } from "@/store/cart";
import { ShoppingCart, Search, Menu, X, User, ChevronDown, ChevronRight } from "lucide-react";

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
  const itemCount = useCartStore((s) => s.getItemCount());

  useEffect(() => {
    fetch("/api/shop/categories")
      .then((r) => r.json())
      .then((d) => { if (d.success) setCategories(d.data || []); })
      .catch(() => {});
  }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (mobileOpen || searchOpen) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen, searchOpen]);

  useEffect(() => {
    if (!searchOpen) setSearchQuery("");
  }, [searchOpen]);

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
            ? "bg-maroon-dark/97 backdrop-blur-md shadow-lg py-2"
            : "bg-maroon-dark/90 backdrop-blur-sm py-3"
        }`}
      >
        <div className="container-custom mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2">
              <div className="flex flex-col">
                <span className="text-xl md:text-2xl font-display font-bold text-white tracking-tight leading-none">
                  DEVI PICKLES
                </span>
                <span className="text-[9px] md:text-[10px] text-golden tracking-[0.2em] uppercase font-medium">
                  Swad Jo Dil Jeet Le!
                </span>
              </div>
            </Link>

            <nav className="hidden lg:flex items-center gap-7">
              <Link href="/" className="text-sm font-medium text-white/80 hover:text-white transition-colors relative after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-golden after:transition-all hover:after:w-full">
                Home
              </Link>
              <Link href="/shop" className="text-sm font-medium text-white/80 hover:text-white transition-colors relative after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-golden after:transition-all hover:after:w-full">
                Shop
              </Link>
              <div
                className="relative"
                onMouseEnter={() => setCategoriesOpen(true)}
                onMouseLeave={() => setCategoriesOpen(false)}
              >
                <button className="flex items-center gap-1 text-sm font-medium text-white/80 hover:text-white transition-colors">
                  Categories <ChevronDown className={`w-3 h-3 transition-transform ${categoriesOpen ? "rotate-180" : ""}`} />
                </button>
                {categoriesOpen && (
                  <div className="absolute top-full left-0 mt-2 w-64 bg-white rounded-xl shadow-xl border border-sand-dark/30 py-2 animate-fade-in z-50">
                    {topLevel.map((cat) => {
                      const children = getChildren(cat._id);
                      return (
                        <div key={cat._id}>
                          <Link
                            href={`/shop/${cat.slug}`}
                            className="flex items-center justify-between px-4 py-2.5 text-sm text-charcoal hover:bg-cream hover:text-maroon transition-colors font-medium"
                            onClick={() => setCategoriesOpen(false)}
                          >
                            {cat.name}
                            {children.length > 0 && <ChevronRight className="w-3 h-3" />}
                          </Link>
                          {children.length > 0 && (
                            <div className="pl-6 pb-1">
                              {children.map((child) => (
                                <Link
                                  key={child._id}
                                  href={`/shop/${child.slug}`}
                                  className="block px-4 py-1.5 text-xs text-charcoal-light hover:text-maroon transition-colors"
                                  onClick={() => setCategoriesOpen(false)}
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
                )}
              </div>
              <Link href="/about" className="text-sm font-medium text-white/80 hover:text-white transition-colors relative after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-golden after:transition-all hover:after:w-full">
                About
              </Link>
              <Link href="/contact" className="text-sm font-medium text-white/80 hover:text-white transition-colors relative after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-golden after:transition-all hover:after:w-full">
                Contact
              </Link>
            </nav>

            <div className="flex items-center gap-2 md:gap-3">
              <button
                onClick={() => setSearchOpen(true)}
                className="p-2 text-white/80 hover:text-white transition-colors"
                aria-label="Search"
              >
                <Search className="w-5 h-5" />
              </button>
              <Link href="/track-order" className="hidden md:flex p-2 text-white/80 hover:text-white transition-colors" aria-label="Track order">
                <User className="w-5 h-5" />
              </Link>
              <Link href="/cart" className="relative p-2 text-white/80 hover:text-white transition-colors" aria-label="Cart">
                <ShoppingCart className="w-5 h-5" />
                {itemCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 bg-golden text-maroon-dark text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center">
                    {itemCount > 99 ? "99+" : itemCount}
                  </span>
                )}
              </Link>
              <button
                className="lg:hidden p-2 text-white/80 hover:text-white transition-colors"
                onClick={() => setMobileOpen(true)}
                aria-label="Open menu"
              >
                <Menu className="w-6 h-6" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {searchOpen && (
        <div className="fixed inset-0 z-[70] bg-black/80 backdrop-blur-sm flex items-start justify-center pt-24 px-4" onClick={() => setSearchOpen(false)}>
          <div className="w-full max-w-xl bg-white rounded-2xl shadow-2xl overflow-hidden animate-slide-up" onClick={(e) => e.stopPropagation()}>
            <form onSubmit={handleSearch} className="flex items-center gap-3 p-4">
              <Search className="w-5 h-5 text-charcoal-light flex-shrink-0" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search for pickles, sweets, snacks..."
                className="flex-1 text-lg outline-none text-charcoal bg-transparent placeholder:text-charcoal-light/50"
                autoFocus
              />
              <button type="button" onClick={() => setSearchOpen(false)} className="p-1 text-charcoal-light hover:text-charcoal">
                <X className="w-5 h-5" />
              </button>
            </form>
            {searchQuery.length < 2 && (
              <div className="px-4 pb-4 border-t border-cream-dark/50">
                <p className="text-xs text-charcoal-light uppercase tracking-wider mt-3 mb-2">Popular Searches</p>
                <div className="flex flex-wrap gap-2">
                  {["Avakai Pickle", "Chicken Pickle", "Gongura Pickle", "Lemon Pickle", "Pappula Podi"].map((term) => (
                    <button
                      key={term}
                      onClick={() => { setSearchQuery(term); }}
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
      )}

      {mobileOpen && (
        <div className="fixed inset-0 z-[60] lg:hidden">
          <div className="absolute inset-0 bg-black/50" onClick={() => setMobileOpen(false)} />
          <div className="absolute top-0 right-0 w-80 max-w-[85vw] h-full bg-white shadow-xl animate-slide-in-left overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-8">
                <span className="text-lg font-display font-bold text-maroon">DEVI PICKLES</span>
                <button onClick={() => setMobileOpen(false)} className="p-2 text-charcoal hover:text-red transition-colors">
                  <X className="w-6 h-6" />
                </button>
              </div>
              <nav className="flex flex-col gap-1">
                <Link href="/" onClick={() => setMobileOpen(false)} className="px-4 py-3 text-charcoal hover:bg-cream hover:text-maroon rounded-lg transition-colors font-medium">
                  Home
                </Link>
                <Link href="/shop" onClick={() => setMobileOpen(false)} className="px-4 py-3 text-charcoal hover:bg-cream hover:text-maroon rounded-lg transition-colors font-medium">
                  Shop All
                </Link>
                {topLevel.map((cat) => {
                  const children = getChildren(cat._id);
                  const isOpen = mobileAccordion === cat._id;
                  return (
                    <div key={cat._id}>
                      <div className="flex items-center">
                        <Link
                          href={`/shop/${cat.slug}`}
                          onClick={() => setMobileOpen(false)}
                          className="flex-1 px-4 py-3 text-charcoal hover:bg-cream hover:text-maroon rounded-lg transition-colors font-medium"
                        >
                          {cat.name}
                        </Link>
                        {children.length > 0 && (
                          <button
                            onClick={() => setMobileAccordion(isOpen ? null : cat._id)}
                            className="p-3 text-charcoal-light"
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
                <Link href="/about" onClick={() => setMobileOpen(false)} className="px-4 py-3 text-charcoal hover:bg-cream hover:text-maroon rounded-lg transition-colors font-medium">
                  About
                </Link>
                <Link href="/contact" onClick={() => setMobileOpen(false)} className="px-4 py-3 text-charcoal hover:bg-cream hover:text-maroon rounded-lg transition-colors font-medium">
                  Contact
                </Link>
                <Link href="/track-order" onClick={() => setMobileOpen(false)} className="px-4 py-3 text-charcoal hover:bg-cream hover:text-maroon rounded-lg transition-colors font-medium">
                  Track Order
                </Link>
              </nav>
            </div>
          </div>
        </div>
      )}

      <div className="h-[60px] md:h-[68px]" />
    </>
  );
}