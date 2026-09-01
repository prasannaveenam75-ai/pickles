import Image from "next/image";
import Link from "next/link";

interface NonVegSectionProps {
  heading: string;
  description: string;
  image: string;
  ctaText: string;
  ctaUrl: string;
}

export default function NonVegSection({ heading, description, image, ctaText, ctaUrl }: NonVegSectionProps) {
  return (
    <section className="relative py-24 lg:py-32 overflow-hidden bg-charcoal-dark">
      {image && (
        <Image
          src={image}
          alt={heading}
          fill
          className="object-cover opacity-30"
          sizes="100vw"
        />
      )}
      <div className="relative z-10 container-custom mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl">
          <span className="text-golden tracking-[0.3em] text-xs uppercase font-semibold">Signature Range</span>
          <h2 className="text-3xl md:text-5xl font-display font-bold text-white mt-4 mb-6">
            {heading || "Premium Non-Veg Pickles"}
          </h2>
          <p className="text-gray-300 text-base md:text-lg leading-relaxed mb-8">
            {description}
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-10">
            {["Chicken Pickle", "Boneless Chicken", "Mutton Pickle", "Prawns Pickle"].map((item) => (
              <div key={item} className="bg-white/5 border border-white/10 rounded-xl p-4 text-center">
                <span className="text-white text-sm font-medium">{item}</span>
              </div>
            ))}
          </div>
          {ctaUrl && (
            <Link href={ctaUrl} className="btn-red">
              {ctaText || "EXPLORE NON-VEG PICKLES"}
            </Link>
          )}
        </div>
      </div>
    </section>
  );
}
