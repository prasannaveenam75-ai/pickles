import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "Devi Pickles — Authentic Homemade Pickles",
    template: "%s | Devi Pickles",
  },
  description: "Traditional homemade pickles crafted with care, packed fresh and delivered to your doorstep. 100% natural, no artificial colours, no preservatives.",
  keywords: ["homemade pickles", "Indian pickles", "veg pickles", "non-veg pickles", "Andhra pickles", "authentic pickles", "natural pickles", "Devi Pickles"],
  openGraph: {
    title: "Devi Pickles — Authentic Homemade Pickles",
    description: "Traditional homemade pickles crafted with care. 100% natural ingredients, no artificial colours or preservatives.",
    type: "website",
    locale: "en_IN",
    siteName: "Devi Pickles",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Playfair+Display:wght@400;500;600;700;800;900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-screen flex flex-col">
        {children}
      </body>
    </html>
  );
}
