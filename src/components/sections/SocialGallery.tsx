import Image from "next/image";

export default function SocialGallery({ images }: { images?: string[] }) {
  if (!images?.length) return null;

  return (
    <section className="py-20 bg-cream">
      <div className="container-custom mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <span className="text-golden-dark uppercase tracking-[0.3em] text-xs font-semibold">@devipickles</span>
          <h2 className="section-title mt-3">Follow The Flavour</h2>
          <p className="section-subtitle">Join us on Instagram for daily flavour inspiration.</p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {images.map((src, index) => (
            <div key={index} className="aspect-square rounded-xl overflow-hidden group relative">
              <Image
                src={src}
                alt={`Devi Pickles gallery image ${index + 1}`}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-500"
                loading="lazy"
                sizes="(min-width: 768px) 25vw, 50vw"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
