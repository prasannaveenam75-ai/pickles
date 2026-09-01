import Image from "next/image";
import Link from "next/link";

export default function CategoryCard({
  name,
  slug,
  description,
  image,
}: {
  name: string;
  slug: string;
  description?: string;
  image?: string;
}) {
  return (
    <Link
      href={`/shop/${slug}`}
      className="card group h-full flex flex-col"
    >
      <div className="aspect-[4/3] overflow-hidden bg-cream-dark/30 flex items-center justify-center">
        {image ? (
          <Image
            src={image}
            alt={name}
            width={600}
            height={450}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <span className="text-charcoal-light/40 font-display text-lg uppercase tracking-wider">
              {name}
            </span>
          </div>
        )}
      </div>
      <div className="p-6 flex flex-col flex-1">
        <h3 className="font-display text-lg font-bold text-charcoal-dark uppercase">
          {name}
        </h3>
        {description && (
          <p className="text-sm text-charcoal-light mt-2 line-clamp-2">{description}</p>
        )}
        <span className="mt-auto pt-4 inline-flex items-center gap-2 text-sm font-semibold text-green uppercase tracking-wider">
          Explore
          <svg className="w-4 h-4 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </span>
      </div>
    </Link>
  );
}
