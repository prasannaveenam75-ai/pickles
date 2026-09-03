"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Package,
  Heart,
  MapPin,
  User,
  MessageCircle,
  ChevronRight,
  ClipboardList,
  ShieldCheck,
  LogOut,
  Loader2,
} from "lucide-react";
import { useWishlistStore } from "@/store/wishlist";
import { useAuthStore } from "@/store/auth";

export default function AccountClient() {
  const { status, user, init, login, register, logout } = useAuthStore();
  const wishlistCount = useWishlistStore((s) => s.items.length);
  const whatsappNum = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "918008062755";

  const [mode, setMode] = useState<"login" | "register">("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    init();
  }, [init]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    const result =
      mode === "login"
        ? await login({ email, password })
        : await register({ name, email, phone, password });
    setSubmitting(false);
    if (!result.ok) setError(result.message || "Something went wrong");
  };

  const menuItems = [
    { href: "/track-order", icon: Package, label: "Track My Order", desc: "Check the status of your order", color: "bg-maroon/10 text-maroon" },
    { href: "/wishlist", icon: Heart, label: "My Wishlist", desc: `${wishlistCount} saved item${wishlistCount === 1 ? "" : "s"}`, color: "bg-red/10 text-red" },
    { href: "/compare", icon: ClipboardList, label: "Compare", desc: "Compare products side by side", color: "bg-golden/15 text-golden-dark" },
    { href: "/shipping-policy", icon: MapPin, label: "My Addresses", desc: "Shipping & delivery info", color: "bg-blue-500/10 text-blue-600" },
  ];

  if (status === "loading") {
    return (
      <div className="container-custom mx-auto px-4 py-8 md:py-12 min-h-[60vh] max-w-3xl">
        <div className="skeleton h-9 w-48 mb-6 rounded-lg" />
        <div className="skeleton h-40 rounded-2xl mb-4" />
        <div className="skeleton h-52 rounded-2xl" />
      </div>
    );
  }

  if (status === "authenticated" && user) {
    return (
      <div className="container-custom mx-auto px-4 py-8 md:py-12 min-h-[60vh] max-w-3xl">
        <h1 className="text-2xl md:text-3xl font-display font-bold text-charcoal-dark mb-6">My Account</h1>

        <div className="bg-white rounded-2xl border border-cream-dark/20 p-6 mb-8 flex flex-col sm:flex-row sm:items-center gap-4">
          <div className="flex items-center gap-4 flex-1">
            <div className="w-14 h-14 rounded-full bg-maroon text-white flex items-center justify-center text-xl font-display font-bold">
              {user.name.charAt(0).toUpperCase()}
            </div>
            <div>
              <h2 className="font-display text-lg font-bold text-charcoal-dark">{user.name}</h2>
              <p className="text-sm text-charcoal-light">{user.email}</p>
              <p className="text-xs text-charcoal-light">+{user.phone}</p>
            </div>
          </div>
          <button
            onClick={async () => { await logout(); }}
            className="inline-flex items-center gap-2 text-sm font-semibold text-red px-4 py-2 rounded-full border border-red/30 hover:bg-red hover:text-white transition-colors self-start sm:self-auto"
          >
            <LogOut className="w-4 h-4" /> Sign Out
          </button>
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

  return (
    <div className="container-custom mx-auto px-4 py-8 md:py-12 min-h-[60vh] max-w-md">
      <div className="text-center mb-8">
        <div className="w-16 h-16 rounded-full bg-maroon text-white flex items-center justify-center mx-auto mb-4">
          <User className="w-8 h-8" />
        </div>
        <h1 className="text-2xl md:text-3xl font-display font-bold text-charcoal-dark">
          {mode === "login" ? "Welcome Back" : "Create Account"}
        </h1>
        <p className="text-sm text-charcoal-light mt-1">
          {mode === "login"
            ? "Sign in to manage your orders and account."
            : "Join Devi Pickles to save favourites and order faster."}
        </p>
      </div>

      <div className="bg-white rounded-2xl border border-cream-dark/20 p-6 shadow-sm">
        <div className="grid grid-cols-2 gap-1 bg-cream rounded-full p-1 mb-6">
          <button
            onClick={() => { setMode("login"); setError(""); }}
            className={`py-2.5 text-sm font-semibold rounded-full transition-all ${mode === "login" ? "bg-maroon text-white shadow" : "text-charcoal-light"}`}
          >
            Login
          </button>
          <button
            onClick={() => { setMode("register"); setError(""); }}
            className={`py-2.5 text-sm font-semibold rounded-full transition-all ${mode === "register" ? "bg-maroon text-white shadow" : "text-charcoal-light"}`}
          >
            Register
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === "register" && (
            <div>
              <label className="block text-xs font-semibold text-charcoal-light mb-1.5 uppercase tracking-wider">Full Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                placeholder="Your name"
                className="w-full px-4 py-3 rounded-xl border border-cream-dark bg-cream/30 text-sm outline-none focus:border-maroon focus:ring-2 focus:ring-maroon/20 transition-all"
              />
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-charcoal-light mb-1.5 uppercase tracking-wider">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="you@example.com"
              className="w-full px-4 py-3 rounded-xl border border-cream-dark bg-cream/30 text-sm outline-none focus:border-maroon focus:ring-2 focus:ring-maroon/20 transition-all"
            />
          </div>

          {mode === "register" && (
            <div>
              <label className="block text-xs font-semibold text-charcoal-light mb-1.5 uppercase tracking-wider">Phone</label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
                pattern="[0-9]{10}"
                placeholder="10-digit mobile number"
                className="w-full px-4 py-3 rounded-xl border border-cream-dark bg-cream/30 text-sm outline-none focus:border-maroon focus:ring-2 focus:ring-maroon/20 transition-all"
              />
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-charcoal-light mb-1.5 uppercase tracking-wider">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
              placeholder="At least 6 characters"
              className="w-full px-4 py-3 rounded-xl border border-cream-dark bg-cream/30 text-sm outline-none focus:border-maroon focus:ring-2 focus:ring-maroon/20 transition-all"
            />
          </div>

          {error && (
            <div className="text-sm text-red bg-red/5 border border-red/20 rounded-xl px-4 py-3">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="w-full inline-flex items-center justify-center gap-2 bg-maroon text-white text-sm font-semibold py-3.5 rounded-full hover:bg-maroon-light transition-all disabled:opacity-60"
          >
            {submitting && <Loader2 className="w-4 h-4 animate-spin" />}
            {mode === "login" ? "Sign In" : "Create Account"}
          </button>
        </form>

        {(status === "error") && (
          <p className="text-xs text-amber-600 mt-4 text-center">Having trouble connecting. Please try again.</p>
        )}
      </div>

      <div className="mt-5 flex items-center justify-center gap-2 text-xs text-charcoal-light">
        <ShieldCheck className="w-4 h-4" /> Your account is secure with us.
      </div>
    </div>
  );
}
