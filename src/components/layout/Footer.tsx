"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

interface FooterCategory {
  _id: string;
  name: string;
  slug: string;
}

export default function Footer() {
  const [categories, setCategories] = useState<FooterCategory[]>([]);

  useEffect(() => {
    fetch("/api/shop/categories")
      .then((r) => r.json())
      .then((d) => { if (d.success) setCategories(d.data || []); })
      .catch(() => {});
  }, []);

  return (
    <footer className="bg-maroon-dark text-white">
      <div className="container-custom mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          <div className="lg:col-span-2">
            <div className="mb-4">
              <span className="text-2xl font-display font-bold tracking-tight">DEVI PICKLES</span>
              <p className="text-golden text-xs tracking-[0.2em] uppercase mt-1">Swad Jo Dil Jeet Le!</p>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed mb-6 max-w-sm">
              Traditional homemade pickles and snacks crafted with care. Pure, fresh and made with love. Every jar carries the warmth of authentic Indian cooking.
            </p>
            <div className="flex gap-3 mb-6">
              <a href="https://wa.me/918008062755" target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-veg/20 rounded-lg flex items-center justify-center hover:bg-veg/40 transition-colors text-veg text-xs font-bold" aria-label="WhatsApp">
                WA
              </a>
              <a href="https://instagram.com/" target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center hover:bg-white/20 transition-colors text-white text-xs font-bold" aria-label="Instagram">
                IG
              </a>
            </div>
            <div className="text-xs text-gray-500 space-y-1">
              <p>FSSAI Lic. No. 20126122000228</p>
              <p>Devi Pickles, Andhra Pradesh, India</p>
            </div>
          </div>

          <div>
            <h4 className="font-semibold text-sm uppercase tracking-wider mb-4 text-golden">Quick Links</h4>
            <ul className="space-y-2.5">
              {[{ href: "/", label: "Home" }, { href: "/shop", label: "Shop" }, { href: "/about", label: "About" }, { href: "/contact", label: "Contact" }].map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-gray-400 text-sm hover:text-white transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-sm uppercase tracking-wider mb-4 text-golden">Customer Care</h4>
            <ul className="space-y-2.5">
              {[{ href: "/track-order", label: "Track Order" }, { href: "/shipping-policy", label: "Shipping Policy" }, { href: "/refund-policy", label: "Refund Policy" }, { href: "/faq", label: "FAQ" }].map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-gray-400 text-sm hover:text-white transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-sm uppercase tracking-wider mb-4 text-golden">Categories</h4>
            <ul className="space-y-2.5">
              {categories.slice(0, 8).map((cat) => (
                <li key={cat._id}>
                  <Link href={`/shop/${cat.slug}`} className="text-gray-400 text-sm hover:text-white transition-colors">
                    {cat.name}
                  </Link>
                </li>
              ))}
              {categories.length === 0 && (
                <>
                  <li><Link href="/shop/veg-pickles" className="text-gray-400 text-sm hover:text-white transition-colors">Veg Pickles</Link></li>
                  <li><Link href="/shop/non-veg-pickles" className="text-gray-400 text-sm hover:text-white transition-colors">Non-Veg Pickles</Link></li>
                  <li><Link href="/shop/powders" className="text-gray-400 text-sm hover:text-white transition-colors">Powders</Link></li>
                </>
              )}
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10 mt-12 pt-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="text-sm text-gray-500">
              &copy; {new Date().getFullYear()} Devi Pickles. All rights reserved.
            </div>
            <div className="flex gap-4">
              {[{ href: "/privacy-policy", label: "Privacy Policy" }, { href: "/terms", label: "Terms & Conditions" }, { href: "/shipping-policy", label: "Shipping" }, { href: "/refund-policy", label: "Refund/Cancellation" }].map((link) => (
                <Link key={link.href} href={link.href} className="text-xs text-gray-500 hover:text-gray-300 transition-colors">
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}