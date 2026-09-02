import Image from "next/image";
import Link from "next/link";

interface StorySectionProps {
  title: string;
  text: string;
  image: string;
}

export default function StorySection({ title, text, image }: StorySectionProps) {
  return (
    <section className="py-14 md:py-20 bg-cream overflow-hidden">
      <div className="container-custom mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 items-center">
          {/* Image - first on mobile */}
          <div className="relative">
            <div className="aspect-[4/3] lg:aspect-[4/5] rounded-2xl overflow-hidden bg-cream-dark/40 shadow-xl">
              {image ? (
                <Image
                  src={image}
                  alt="Traditional pickle preparation"
                  fill
                  className="object-cover"
                  sizes="(min-width: 1024px) 50vw, 100vw"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-maroon-dark to-maroon">
                  <span className="text-white/40 font-display text-lg uppercase tracking-widest">
                    Tradition
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Text - second on mobile */}
          <div>
            <span className="text-golden-dark uppercase tracking-[0.25em] text-[11px] font-semibold mb-3 block">
              Our Story
            </span>
            <h2 className="text-2xl md:text-3xl lg:text-4xl mb-4 md:mb-6 leading-tight">
              {title || "Made With Love, Tradition & Quality"}
            </h2>
            <p className="text-charcoal-light text-sm md:text-base leading-relaxed mb-6 md:mb-8">
              {text}
            </p>
            <Link href="/about" className="btn-secondary">
              Our Story
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
