"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { MessageCircle, MapPin, Mail } from "lucide-react";
import InstagramIcon from "@/components/ui/InstagramIcon";

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

  const whatsappNum = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "918008062755";

  return (
    <footer className="bg-maroon-dark text-white mt-8">
      <div className="container-custom mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-16">
        {/* Mobile: compact accordion; Desktop: full grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 md:gap-10">
          {/* Brand */}
          <div className="lg:col-span-2">
            <div className="mb-3">
              <span className="text-xl md:text-2xl font-display font-bold tracking-tight">DEVI PICKLES</span>
              <p className="text-golden text-[10px] tracking-[0.2em] uppercase mt-0.5">Swad Jo Dil Jeet Le!</p>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed mb-4 max-w-sm">
              Traditional homemade pickles and snacks crafted with care. Pure, fresh and made with love.
            </p>
            <div className="flex gap-2.5 mb-5">
              <a href={`https://wa.me/${whatsappNum}`} target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-veg/15 rounded-full flex items-center justify-center hover:bg-veg/40 transition-colors text-veg" aria-label="WhatsApp">
                <MessageCircle className="w-4 h-4" />
              </a>
              <a href="https://instagram.com/" target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-white/20 transition-colors" aria-label="Instagram">
                <InstagramIcon className="w-4 h-4" />
              </a>
            </div>
            <div className="text-[11px] text-gray-500 space-y-1">
              <p>FSSAI Lic. No. 20126122000228</p>
              <p className="flex items-center gap-1.5">
                <MapPin className="w-3 h-3" /> Andhra Pradesh, India
              </p>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold text-sm uppercase tracking-wider mb-4 text-golden">Quick Links</h4>
            <ul className="space-y-2.5">
              {[
                { href: "/", label: "Home" },
                { href: "/shop", label: "Shop" },
                { href: "/track-order", label: "Track Order" },
                { href: "/about", label: "About" },
                { href: "/contact", label: "Contact" },
              ].map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-gray-400 text-sm hover:text-white transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h4 className="font-semibold text-sm uppercase tracking-wider mb-4 text-golden">Categories</h4>
            <ul className="space-y-2.5">
              {categories.slice(0, 5).map((cat) => (
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

          {/* Customer Care */}
          <div>
            <h4 className="font-semibold text-sm uppercase tracking-wider mb-4 text-golden">Customer Care</h4>
            <ul className="space-y-2.5">
              {[
                { href: "/shipping-policy", label: "Shipping Policy" },
                { href: "/refund-policy", label: "Refund Policy" },
                { href: "/privacy-policy", label: "Privacy Policy" },
                { href: "/terms", label: "Terms" },
                { href: "/faq", label: "FAQ" },
              ].map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-gray-400 text-sm hover:text-white transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10 mt-8 md:mt-12 pt-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-3">
            <p className="text-xs text-gray-500">
              &copy; {new Date().getFullYear()} Devi Pickles. All rights reserved.
            </p>
            <p className="text-[11px] text-gray-500 flex items-center gap-1">
              Made with ❤️ in India
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
