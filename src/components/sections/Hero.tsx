"use client";

import Image from "next/image";
import Link from "next/link";

export interface HeroContent {
  heading?: string;
  subheading?: string;
  badge?: string;
  image?: string;
  imageMobile?: string;
  videoUrl?: string;
  videoUrlMobile?: string;
  ctaText?: string;
  ctaUrl?: string;
  secondaryCtaText?: string;
  secondaryCtaUrl?: string;
}

export default function Hero({ hero }: { hero: HeroContent }) {
  const headingParts = (hero.heading || "AUTHENTIC TASTE.\nMADE WITH LOVE.").split("\n");
  const desktopImg = hero.image || "";
  const mobileImg = hero.imageMobile || hero.image || "";

  return (
    <section className="relative min-h-[78vh] md:min-h-[86vh] flex items-center justify-center overflow-hidden bg-maroon-dark">
      {/* Desktop video */}
      {hero.videoUrl && (
        <video
          className="hidden md:block absolute inset-0 w-full h-full object-cover"
          autoPlay
          muted
          loop
          playsInline
          poster={desktopImg || undefined}
        >
          <source src={hero.videoUrl} type="video/mp4" />
        </video>
      )}

      {/* Mobile video */}
      {hero.videoUrlMobile && (
        <video
          className="md:hidden absolute inset-0 w-full h-full object-cover"
          autoPlay
          muted
          loop
          playsInline
          poster={mobileImg || undefined}
        >
          <source src={hero.videoUrlMobile} type="video/mp4" />
        </video>
      )}

      {/* Desktop image (fallback when no desktop video) */}
      {!hero.videoUrl && desktopImg && (
        <Image
          src={desktopImg}
          alt="Devi Pickles - Traditional homemade pickles"
          fill
          priority
          className="hidden md:block object-cover object-center"
          sizes="100vw"
        />
      )}

      {/* Mobile image */}
      {!hero.videoUrlMobile && mobileImg && (
        <Image
          src={mobileImg}
          alt="Devi Pickles - Traditional homemade pickles"
          fill
          priority
          className="md:hidden object-cover object-center"
          sizes="100vw"
        />
      )}

      {!desktopImg && !hero.videoUrl && !hero.videoUrlMobile && (
        <div className="absolute inset-0 bg-gradient-to-br from-maroon-dark via-maroon to-maroon-dark" />
      )}

      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/25 to-black/10" />

      <div className="relative z-10 max-w-4xl mx-auto px-5 text-center py-20 md:py-24">
        <p className="text-golden tracking-[0.25em] md:tracking-[0.3em] text-[10px] md:text-xs uppercase mb-4 md:mb-6 font-semibold">
          {hero.badge || "PURE. FRESH. HOMEMADE WITH LOVE."}
        </p>
        <h1 className="text-3xl md:text-5xl lg:text-6xl font-display font-bold text-white leading-tight mb-4 md:mb-6 drop-shadow-lg">
          {headingParts.map((part, i) => (
            <span key={i} className="block">{part}</span>
          ))}
        </h1>
        <p className="text-white/85 text-sm md:text-base max-w-xl mx-auto mb-8 md:mb-10 leading-relaxed">
          {hero.subheading || "Traditional Andhra pickles & homemade delicacies, crafted with care."}
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          {hero.ctaUrl && (
            <Link href={hero.ctaUrl} className="btn-primary btn-lg">
              {hero.ctaText || "SHOP PICKLES"}
            </Link>
          )}
          <Link
            href={hero.secondaryCtaUrl || "/shop"}
            className="inline-flex items-center justify-center px-8 py-4 text-sm font-semibold text-white border-2 border-white/40 rounded-full uppercase tracking-wide hover:bg-white/10 hover:border-white transition-all duration-300"
          >
            {hero.secondaryCtaText || "Explore Our Collection"}
          </Link>
        </div>
      </div>
    </section>
  );
}
