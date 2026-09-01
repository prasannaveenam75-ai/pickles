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
    <section className="relative min-h-[85vh] flex items-center justify-center overflow-hidden bg-charcoal-dark">
      {image ? (
        <Image
          src={image}
          alt="Devi Pickles - Traditional homemade pickles"
          fill
          priority
          className="object-cover opacity-40"
          sizes="100vw"
        />
      ) : (
        <div className="absolute inset-0 bg-gradient-to-br from-green-dark via-charcoal-dark to-charcoal opacity-90" />
      )}

      <div className="relative z-10 max-w-4xl mx-auto px-4 text-center py-20">
        <p className="text-golden tracking-[0.3em] text-xs md:text-sm uppercase mb-6 font-medium">
          Pure. Fresh. Homemade with Love.
        </p>
        <h1 className="text-4xl md:text-6xl lg:text-7xl font-display font-bold text-white leading-tight mb-6">
          {headingParts.map((part, i) => (
            <span key={i} className="block">
              {part}
            </span>
          ))}
        </h1>
        <p className="text-cream/90 text-base md:text-lg max-w-2xl mx-auto mb-10 leading-relaxed">
          {subheading}
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          {ctaUrl && (
            <Link href={ctaUrl} className="btn-primary">
              {ctaText || "SHOP PICKLES"}
            </Link>
          )}
          <Link href="/about" className="btn-secondary text-white border-white/50 hover:bg-white/10 hover:border-white hover:text-white">
            Explore Our Story
          </Link>
        </div>
      </div>

      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-1.5" aria-hidden="true">
        <span className="w-1.5 h-1.5 rounded-full bg-white/60 animate-pulse" />
        <span className="w-1.5 h-1.5 rounded-full bg-white/30" />
        <span className="w-1.5 h-1.5 rounded-full bg-white/30" />
      </div>
    </section>
  );
}
