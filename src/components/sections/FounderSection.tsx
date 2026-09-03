import Image from "next/image";
import { Quote, Leaf } from "lucide-react";

interface FounderContent {
  name?: string;
  designation?: string;
  story?: string;
  quote?: string;
  image?: string;
}

export default function FounderSection({ founder }: { founder?: FounderContent }) {
  const f = founder || {};

  return (
    <section className="py-14 md:py-20 bg-cream overflow-hidden">
      <div className="container-custom mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10 md:mb-14">
          <p className="text-golden-dark font-display text-[11px] md:text-xs tracking-[0.25em] uppercase font-semibold">
            Our Story
          </p>
          <h2 className="section-title mt-1 md:mt-2">MEET THE FOUNDER</h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-14 items-center max-w-5xl mx-auto">
          <div className="relative mx-auto w-full max-w-sm">
            <div className="aspect-[4/5] rounded-2xl overflow-hidden bg-cream-dark/40 shadow-xl ring-4 ring-white">
              {f.image ? (
                <Image
                  src={f.image}
                  alt={f.name ? `${f.name} - Founder of Devi Pickles` : "Devi Pickles founder"}
                  fill
                  className="object-cover"
                  sizes="(min-width: 1024px) 40vw, 100vw"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-maroon-dark to-maroon">
                  <span className="text-white/40 font-display text-lg uppercase tracking-widest">
                    Founders
                  </span>
                </div>
              )}
            </div>
          </div>

          <div>
            <h3 className="font-display text-2xl md:text-3xl font-bold text-charcoal-dark">
              {f.name || "The Family Behind Devi Pickles"}
            </h3>
            <p className="text-golden-dark font-display text-xs md:text-sm tracking-[0.2em] uppercase font-semibold mt-1 mb-5">
              {f.designation || "Founder &amp; Chief Pickle-Maker"}
            </p>
            <p className="text-charcoal-light text-sm md:text-base leading-relaxed mb-6 whitespace-pre-line">
              {f.story ||
                "What started as a small family tradition, sun-curing mangoes on the terrace the way our grandmothers taught us, grew into a mission to share the authentic taste of our home kitchen with the world.\n\nEvery jar we pack still follows those same time-honoured rituals — prepared in small batches with the finest natural ingredients and a whole lot of love."}
            </p>
            <blockquote className="relative bg-white rounded-2xl border border-cream-dark/40 p-5 md:p-6 mb-6">
              <Quote className="w-6 h-6 text-golden/70 mb-3" aria-hidden="true" />
              <p className="font-display text-lg md:text-xl font-semibold text-charcoal-dark italic leading-snug">
                “{f.quote || "Every jar should taste like it was made at home."}”
              </p>
            </blockquote>
            <div className="flex items-center gap-3 p-4 bg-white rounded-2xl border border-cream-dark/40 max-w-md">
              <div className="w-10 h-10 rounded-full bg-veg/10 flex items-center justify-center text-veg flex-shrink-0">
                <Leaf className="w-5 h-5" />
              </div>
              <p className="text-sm text-charcoal-dark">
                <span className="font-semibold">Homemade. Honest. Healthy.</span>
                <br />
                <span className="text-charcoal-light">Authentic Andhra flavours, made with care.</span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
