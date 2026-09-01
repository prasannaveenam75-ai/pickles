import Image from "next/image";
import Link from "next/link";

interface PowdersSectionProps {
  heading: string;
  description: string;
  image: string;
  ctaText: string;
  ctaUrl: string;
}

export default function PowdersSection({ heading, description, image, ctaText, ctaUrl }: PowdersSectionProps) {
  return (
    <section className="py-20 lg:py-24 bg-cream">
      <div className="container-custom mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 items-center gap-10">
          <div className="order-2 lg:order-1">
            <div className="grid grid-cols-2 gap-4">
              {["Kura Kaaram", "Pappula Podi"].map((item) => (
                <div key={item} className="bg-white rounded-xl overflow-hidden shadow-sm border border-cream-dark/30">
                  <div className="aspect-square bg-gradient-to-br from-golden/20 to-green/20 flex items-center justify-center">
                    <span className="font-display text-charcoal-dark/70 text-sm uppercase tracking-wider text-center px-4">
                      {item}
                    </span>
                  </div>
                  <div className="p-3 text-center">
                    <span className="text-xs text-charcoal-light">From ₹350</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="order-1 lg:order-2">
            <span className="text-golden-dark uppercase tracking-[0.3em] text-xs font-semibold mb-3 block">Traditional Powders</span>
            <h2 className="text-3xl md:text-4xl mb-4">{heading || "Traditional Powders"}</h2>
            <p className="text-charcoal-light text-base md:text-lg mb-8 leading-relaxed">
              {description}
            </p>
            {ctaUrl && (
              <Link href={ctaUrl} className="btn-golden">
                {ctaText || "SHOP POWDERS"}
              </Link>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
