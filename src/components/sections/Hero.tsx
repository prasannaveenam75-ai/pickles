"use client";

import Image from "next/image";
import Link from "next/link";

interface HeroProps {
  heading: string;
  subheading: string;
  image: string;
  ctaText: string;
  ctaUrl: string;
}

export default function Hero({ heading, subheading, image, ctaText, ctaUrl }: HeroProps) {
  const headingParts = heading.split("\n");

  return (
    <section className="relative min-h-[70vh] md:min-h-[80vh] flex items-center justify-center overflow-hidden bg-maroon-dark">
      {image ? (
        <Image
          src={image}
          alt="Devi Pickles - Traditional homemade pickles"
          fill
          priority
          className="object-cover opacity-50 md:opacity-40"
          sizes="100vw"
        />
      ) : (
        <div className="absolute inset-0 bg-gradient-to-br from-maroon-dark via-maroon to-maroon-dark" />
      )}

      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />

      <div className="relative z-10 max-w-4xl mx-auto px-5 text-center py-16 md:py-20">
        <p className="text-golden tracking-[0.25em] md:tracking-[0.3em] text-[10px] md:text-xs uppercase mb-4 md:mb-6 font-semibold">
          Pure. Fresh. Homemade with Love.
        </p>
        <h1 className="text-3xl md:text-5xl lg:text-6xl font-display font-bold text-white leading-tight mb-4 md:mb-6">
          {headingParts.map((part, i) => (
            <span key={i} className="block">{part}</span>
          ))}
        </h1>
        <p className="text-white/80 text-sm md:text-base max-w-xl mx-auto mb-8 md:mb-10 leading-relaxed">
          {subheading}
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          {ctaUrl && (
            <Link href={ctaUrl} className="btn-primary btn-lg">
              {ctaText || "SHOP PICKLES"}
            </Link>
          )}
          <Link href="/about" className="inline-flex items-center justify-center px-8 py-4 text-sm font-semibold text-white border-2 border-white/40 rounded-full uppercase tracking-wide hover:bg-white/10 hover:border-white transition-all duration-300">
            Our Story
          </Link>
        </div>
      </div>
    </section>
  );
}
