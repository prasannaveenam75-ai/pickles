import Image from "next/image";
import Link from "next/link";

interface StorySectionProps {
  title: string;
  text: string;
  image: string;
}

export default function StorySection({ title, text, image }: StorySectionProps) {
  return (
    <section className="py-20 lg:py-28 bg-cream overflow-hidden">
      <div className="container-custom mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="relative">
            <div className="aspect-[4/5] rounded-2xl overflow-hidden bg-cream-dark/40 shadow-xl">
              {image ? (
                <Image
                  src={image}
                  alt="Traditional pickle preparation"
                  fill
                  className="object-cover"
                  sizes="(min-width: 1024px) 50vw, 100vw"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-green-dark to-green">
                  <span className="text-white/40 font-display text-lg uppercase tracking-widest">
                    Tradition
                  </span>
                </div>
              )}
            </div>
            <div className="absolute -bottom-6 -right-6 hidden md:block w-40 h-40 bg-golden/20 rounded-2xl -z-10" />
          </div>

          <div>
            <span className="text-golden-dark uppercase tracking-[0.3em] text-xs font-semibold mb-4 block">
              Our Story
            </span>
            <h2 className="text-3xl md:text-4xl lg:text-5xl mb-6">{title}</h2>
            <p className="text-charcoal-light text-base md:text-lg leading-relaxed mb-8">
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
