import Link from "next/link";

const footerLinks = {
  quickLinks: [
    { href: "/", label: "Home" },
    { href: "/shop", label: "Shop" },
    { href: "/about", label: "About" },
    { href: "/contact", label: "Contact" },
  ],
  customerCare: [
    { href: "/track-order", label: "Track Order" },
    { href: "/shipping-policy", label: "Shipping Policy" },
    { href: "/refund-policy", label: "Refund Policy" },
    { href: "/faq", label: "FAQ" },
  ],
  categories: [
    { href: "/shop/veg-pickles", label: "Veg Pickles" },
    { href: "/shop/non-veg-pickles", label: "Non-Veg Pickles" },
    { href: "/shop/powders", label: "Powders" },
  ],
  policies: [
    { href: "/privacy-policy", label: "Privacy Policy" },
    { href: "/terms", label: "Terms & Conditions" },
    { href: "/shipping-policy", label: "Shipping" },
    { href: "/refund-policy", label: "Refund/Cancellation" },
  ],
};

export default function Footer() {
  return (
    <footer className="bg-charcoal-dark text-white">
      <div className="container-custom mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          <div className="lg:col-span-2">
            <div className="mb-4">
              <span className="text-2xl font-display font-bold tracking-tight">DEVI PICKLES</span>
              <p className="text-golden text-xs tracking-[0.2em] uppercase mt-1">Swad Jo Dil Jeet Le!</p>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed mb-6 max-w-sm">
              Traditional homemade pickles crafted with care. Pure, fresh and made with love. Every jar carries the warmth of authentic Indian cooking.
            </p>
            <div className="flex gap-4">
              <Link href="https://wa.me/" className="w-10 h-10 bg-green/20 rounded-lg flex items-center justify-center hover:bg-green/40 transition-colors text-sm font-bold text-green">
                WA
              </Link>
            </div>
          </div>

          <div>
            <h4 className="font-semibold text-sm uppercase tracking-wider mb-4 text-golden">Quick Links</h4>
            <ul className="space-y-2.5">
              {footerLinks.quickLinks.map((link) => (
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
              {footerLinks.customerCare.map((link) => (
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
              {footerLinks.categories.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-gray-400 text-sm hover:text-white transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10 mt-12 pt-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="text-sm text-gray-500">
              &copy; {new Date().getFullYear()} Devi Pickles. All rights reserved.
            </div>
            <div className="flex gap-4">
              {footerLinks.policies.map((link) => (
                <Link key={link.href + link.label} href={link.href} className="text-xs text-gray-500 hover:text-gray-300 transition-colors">
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
