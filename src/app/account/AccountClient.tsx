"use client";

import Link from "next/link";
import { Package, Heart, MapPin, User, MessageCircle, ChevronRight, ClipboardList } from "lucide-react";
import { useWishlistStore } from "@/store/wishlist";

export default function AccountClient() {
  const wishlistCount = useWishlistStore((s) => s.items.length);
  const whatsappNum = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "918008062755";

  const menuItems = [
    { href: "/track-order", icon: Package, label: "Track My Order", desc: "Check the status of your order", color: "bg-maroon/10 text-maroon" },
    { href: "/wishlist", icon: Heart, label: "My Wishlist", desc: `${wishlistCount} saved item${wishlistCount === 1 ? "" : "s"}`, color: "bg-red/10 text-red" },
    { href: "/shop", icon: ClipboardList, label: "My Orders", desc: "Browse products and reorder", color: "bg-golden/15 text-golden-dark" },
    { href: "/about", icon: User, label: "My Profile", desc: "Learn about our story", color: "bg-veg/10 text-veg" },
    { href: "/shipping-policy", icon: MapPin, label: "My Addresses", desc: "Shipping & delivery info", color: "bg-blue-500/10 text-blue-600" },
  ];

  return (
    <div className="container-custom mx-auto px-4 py-8 md:py-12 min-h-[60vh] max-w-3xl">
      <h1 className="text-2xl md:text-3xl font-display font-bold text-charcoal-dark mb-6">My Account</h1>

      <div className="bg-white rounded-2xl border border-cream-dark/20 p-6 mb-8">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-full bg-maroon text-white flex items-center justify-center text-xl font-display font-bold">
            G
          </div>
          <div>
            <h2 className="font-display text-lg font-bold text-charcoal-dark">Guest Customer</h2>
            <p className="text-sm text-charcoal-light">Manage your orders & wishlist</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-3">
        {menuItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="flex items-center gap-4 bg-white rounded-2xl border border-cream-dark/20 p-4 hover:shadow-md hover:border-maroon/30 transition-all group"
          >
            <div className={`w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 ${item.color}`}>
              <item.icon className="w-5 h-5" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-charcoal-dark group-hover:text-maroon transition-colors">{item.label}</h3>
              <p className="text-xs text-charcoal-light">{item.desc}</p>
            </div>
            <ChevronRight className="w-5 h-5 text-charcoal-light/40 group-hover:text-maroon transition-colors" />
          </Link>
        ))}
      </div>

      <div className="mt-8 bg-veg/5 rounded-2xl border border-veg/20 p-6 flex flex-col sm:flex-row items-center gap-4">
        <div className="w-12 h-12 rounded-full bg-veg flex items-center justify-center text-white flex-shrink-0">
          <MessageCircle className="w-6 h-6" />
        </div>
        <div className="flex-1 text-center sm:text-left">
          <h3 className="font-semibold text-charcoal-dark">Need help with your order?</h3>
          <p className="text-sm text-charcoal-light">Chat with us on WhatsApp for fast support.</p>
        </div>
        <a
          href={`https://wa.me/${whatsappNum}?text=${encodeURIComponent("Hi! I need help with my Devi Pickles order.")}`}
          target="_blank"
          rel="noopener noreferrer"
          className="btn-primary btn-sm flex-shrink-0"
        >
          Contact Support
        </a>
      </div>
    </div>
  );
}
