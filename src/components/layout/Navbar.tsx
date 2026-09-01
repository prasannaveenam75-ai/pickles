"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useCartStore } from "@/store/cart";
import { ShoppingCart, Search, Menu, X, User, ChevronDown } from "lucide-react";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/shop", label: "Shop" },
  { href: "/shop/veg-pickles", label: "Veg Pickles" },
  { href: "/shop/non-veg-pickles", label: "Non-Veg Pickles" },
  { href: "/shop/powders", label: "Powders" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [categoriesOpen, setCategoriesOpen] = useState(false);
  const itemCount = useCartStore((s) => s.getItemCount());

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (mobileOpen) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen]);

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? "bg-white/95 backdrop-blur-md shadow-md py-2"
            : "bg-white/80 backdrop-blur-sm py-4"
        }`}
      >
        <div className="container-custom mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2">
              <div className="flex flex-col">
                <span className="text-xl md:text-2xl font-display font-bold text-green tracking-tight leading-none">
                  DEVI PICKLES
                </span>
                <span className="text-[9px] md:text-[10px] text-golden-dark tracking-[0.2em] uppercase font-medium">
                  Swad Jo Dil Jeet Le!
                </span>
              </div>
            </Link>

            <nav className="hidden lg:flex items-center gap-8">
              {navLinks.slice(0, 2).map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-sm font-medium text-charcoal hover:text-green transition-colors relative after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-green after:transition-all hover:after:w-full"
                >
                  {link.label}
                </Link>
              ))}
              <div
                className="relative"
                onMouseEnter={() => setCategoriesOpen(true)}
                onMouseLeave={() => setCategoriesOpen(false)}
              >
                <button className="flex items-center gap-1 text-sm font-medium text-charcoal hover:text-green transition-colors">
                  Categories <ChevronDown className={`w-3 h-3 transition-transform ${categoriesOpen ? "rotate-180" : ""}`} />
                </button>
                {categoriesOpen && (
                  <div className="absolute top-full left-0 mt-2 w-52 bg-white rounded-xl shadow-lg border border-cream-dark/50 py-2 animate-fade-in">
                    {navLinks.slice(2, 5).map((link) => (
                      <Link
                        key={link.href}
                        href={link.href}
                        className="block px-4 py-2.5 text-sm text-charcoal hover:bg-cream hover:text-green transition-colors"
                      >
                        {link.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
              {navLinks.slice(5).map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-sm font-medium text-charcoal hover:text-green transition-colors relative after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-green after:transition-all hover:after:w-full"
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            <div className="flex items-center gap-3 md:gap-4">
              <Link href="/shop" className="hidden md:flex p-2 text-charcoal hover:text-green transition-colors" aria-label="Search">
                <Search className="w-5 h-5" />
              </Link>
              <Link href="/track-order" className="hidden md:flex p-2 text-charcoal hover:text-green transition-colors" aria-label="Track order">
                <User className="w-5 h-5" />
              </Link>
              <Link href="/cart" className="relative p-2 text-charcoal hover:text-green transition-colors" aria-label="Cart">
                <ShoppingCart className="w-5 h-5" />
                {itemCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 bg-red text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center">
                    {itemCount > 99 ? "99+" : itemCount}
                  </span>
                )}
              </Link>
              <button
                className="lg:hidden p-2 text-charcoal hover:text-green transition-colors"
                onClick={() => setMobileOpen(true)}
                aria-label="Open menu"
              >
                <Menu className="w-6 h-6" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {mobileOpen && (
        <div className="fixed inset-0 z-[60] lg:hidden">
          <div className="absolute inset-0 bg-black/50" onClick={() => setMobileOpen(false)} />
          <div className="absolute top-0 right-0 w-80 max-w-[85vw] h-full bg-white shadow-xl animate-slide-in-left overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-8">
                <span className="text-lg font-display font-bold text-green">DEVI PICKLES</span>
                <button onClick={() => setMobileOpen(false)} className="p-2 text-charcoal hover:text-red transition-colors">
                  <X className="w-6 h-6" />
                </button>
              </div>
              <nav className="flex flex-col gap-1">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setMobileOpen(false)}
                    className="px-4 py-3 text-charcoal hover:bg-cream hover:text-green rounded-lg transition-colors font-medium"
                  >
                    {link.label}
                  </Link>
                ))}
                <Link
                  href="/track-order"
                  onClick={() => setMobileOpen(false)}
                  className="px-4 py-3 text-charcoal hover:bg-cream hover:text-green rounded-lg transition-colors font-medium"
                >
                  Track Order
                </Link>
              </nav>
            </div>
          </div>
        </div>
      )}

      <div className="h-[72px] md:h-[80px]" />
    </>
  );
}
