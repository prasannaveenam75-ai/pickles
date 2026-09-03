import Link from "next/link";

interface CategoryItem {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  image?: string;
  productCount?: number;
}

export default function CategoryShowcase({ categories }: { categories: CategoryItem[] }) {
  if (!categories?.length) return null;

  return (
    <section className="py-10 md:py-16 bg-cream">
      <div className="container-custom mx-auto px-4">
        <div className="text-center mb-8 md:mb-12">
          <span className="text-golden-dark font-display text-[11px] md:text-xs tracking-[0.25em] uppercase font-semibold">Explore</span>
          <h2 className="section-title mt-1 md:mt-2">Our Categories</h2>
          <p className="section-subtitle">Find your favourite homemade delicacies.</p>
        </div>

        <div className="flex md:grid items-stretch gap-4 md:gap-8 overflow-x-auto snap-x snap-mandatory pb-2 scrollbar-hide -mx-4 px-4 md:mx-0 md:px-0 md:overflow-visible md:grid-cols-4 lg:grid-cols-6 max-w-5xl mx-auto">
          {categories.map((cat) => (
            <Link key={cat._id} href={`/shop/${cat.slug}`} className="group flex flex-col items-center text-center snap-center shrink-0 w-24 sm:w-28 md:w-auto md:shrink">
              <div className="relative w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 rounded-full overflow-hidden bg-cream-dark/40 ring-4 ring-white shadow-md group-hover:shadow-xl group-hover:ring-golden/50 transition-all duration-300">
                {cat.image ? (
                  <img
                    src={cat.image}
                    alt={cat.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    loading="lazy"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-maroon/15 to-golden/20 flex items-center justify-center">
                    <span className="font-display text-2xl md:text-3xl font-bold text-maroon/30">
                      {cat.name.charAt(0)}
                    </span>
                  </div>
                )}
              </div>
              <span className="mt-2.5 md:mt-3 text-[11px] md:text-sm font-semibold text-charcoal-dark group-hover:text-maroon transition-colors leading-tight">
                {cat.name}
              </span>
              {cat.productCount !== undefined && (
                <span className="text-[9px] md:text-[10px] text-charcoal-light/70 mt-0.5">
                  {cat.productCount} products
                </span>
              )}
            </Link>
          ))}

          {/* "Shop All" circle */}
          <Link href="/shop" className="group flex flex-col items-center text-center snap-center shrink-0 w-24 sm:w-28 md:w-auto md:shrink">
            <div className="relative w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 rounded-full overflow-hidden bg-maroon text-white shadow-md group-hover:shadow-xl group-hover:bg-maroon-light flex items-center justify-center transition-all duration-300">
              <span className="font-display text-3xl md:text-4xl font-bold text-golden/80">+</span>
            </div>
            <span className="mt-2.5 md:mt-3 text-[11px] md:text-sm font-semibold text-charcoal-dark group-hover:text-maroon transition-colors">
              Shop All
            </span>
          </Link>
        </div>
      </div>
    </section>
  );
}
