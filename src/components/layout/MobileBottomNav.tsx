"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Search, ShoppingBag, Heart, User } from "lucide-react";
import { useCartStore } from "@/store/cart";

const navItems = [
  { href: "/", icon: Home, label: "Home" },
  { href: "/shop", icon: Search, label: "Shop" },
  { href: "/cart", icon: ShoppingBag, label: "Cart" },
  { href: "/wishlist", icon: Heart, label: "Wishlist" },
  { href: "/track-order", icon: User, label: "Account" },
];

export default function MobileBottomNav() {
  const pathname = usePathname();
  const itemCount = useCartStore((s) => s.getItemCount());

  return (
    <nav className="mobile-bottom-nav">
      <div className="flex items-center justify-around h-16 px-2">
        {navItems.map((item) => {
          const isActive = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href));
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center justify-center gap-0.5 w-16 py-1 rounded-xl transition-colors ${
                isActive ? "text-maroon" : "text-charcoal-light"
              }`}
            >
              <div className="relative">
                <item.icon className={`w-5 h-5 ${isActive ? "stroke-[2.5px]" : "stroke-[1.5px]"}`} />
                {item.href === "/cart" && itemCount > 0 && (
                  <span className="absolute -top-1.5 -right-2 bg-maroon text-white text-[8px] font-bold min-w-[14px] h-[14px] rounded-full flex items-center justify-center">
                    {itemCount > 9 ? "9+" : itemCount}
                  </span>
                )}
              </div>
              <span className={`text-[10px] ${isActive ? "font-semibold" : "font-medium"}`}>{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
