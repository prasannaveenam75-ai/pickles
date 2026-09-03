import Image from "next/image";
import { Leaf } from "lucide-react";

interface FounderSectionProps {
  title?: string;
  text?: string;
  image?: string;
}

export default function FounderSection({ title, text, image }: FounderSectionProps) {
  return (
    <section className="py-14 md:py-20 bg-cream overflow-hidden">
      <div className="container-custom mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 items-center">
          <div className="relative order-2 lg:order-1">
            <div className="aspect-[4/3] lg:aspect-[4/5] rounded-2xl overflow-hidden bg-cream-dark/40 shadow-xl">
              {image ? (
                <Image
                  src={image}
                  alt="Devi Pickles founder"
                  fill
                  className="object-cover"
                  sizes="(min-width: 1024px) 50vw, 100vw"
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

          <div className="order-1 lg:order-2">
            <span className="text-golden-dark uppercase tracking-[0.25em] text-[11px] font-semibold mb-3 block">
              About The Founder
            </span>
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-display font-bold text-charcoal-dark mb-4 md:mb-6 leading-tight">
              {title || "A Legacy of Flavour, Passed Down With Love"}
            </h2>
            <p className="text-charcoal-light text-sm md:text-base leading-relaxed mb-5 whitespace-pre-line">
              {text ||
                "Devi Pickles began on our family terrace, where mangoes were sun-cured the way our grandmothers taught us. What started as a gift for friends and family grew into a mission — to share the authentic, homemade taste of our kitchen with the world.\n\nEvery jar we pack still follows those same time-honoured rituals, prepared in small batches with the finest natural ingredients and a whole lot of love."}
            </p>
            <div className="flex items-center gap-3 p-4 bg-white rounded-2xl border border-cream-dark/40 max-w-md">
              <div className="w-10 h-10 rounded-full bg-veg/10 flex items-center justify-center text-veg flex-shrink-0">
                <Leaf className="w-5 h-5" />
              </div>
              <p className="text-sm text-charcoal-dark">
                <span className="font-semibold">Homemade. Honest. Healthy.</span>
                <br />
                <span className="text-charcoal-light">Made the traditional way since the very first batch.</span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
