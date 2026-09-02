import Link from "next/link";
import ProductCard from "@/components/ui/ProductCard";

export default function CategoryShowcase({ categories }: { categories: any[] }) {
  if (!categories?.length) return null;

  return (
    <section className="py-16 md:py-20 bg-white">
      <div className="container-custom mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <p className="text-golden-dark font-display text-xs tracking-[0.25em] uppercase">Our Collection</p>
          <h2 className="section-title mt-2">Explore Our Flavours</h2>
          <p className="section-subtitle">Something delicious for every meal.</p>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {categories.map((cat) => (
            <Link key={cat._id} href={`/shop/${cat.slug}`} className="group block">
              <div className="card overflow-hidden">
                <div className="aspect-[4/3] bg-cream overflow-hidden relative">
                  {cat.image ? (
                    <img src={cat.image} alt={cat.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy" />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-maroon/10 to-golden/10 flex items-center justify-center">
                      <span className="text-3xl font-display font-bold text-maroon/20">{cat.name.charAt(0)}</span>
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <div className="absolute bottom-0 inset-x-0 p-3 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                    <span className="text-white text-xs font-semibold uppercase tracking-wider bg-maroon/90 px-3 py-1.5 rounded-full">
                      View Collection
                    </span>
                  </div>
                </div>
                <div className="p-4 text-center">
                  <h3 className="font-display font-bold text-sm text-charcoal-dark group-hover:text-maroon transition-colors">
                    {cat.name}
                  </h3>
                  {cat.description && (
                    <p className="text-xs text-charcoal-light mt-1 line-clamp-1">{cat.description}</p>
                  )}
                  {cat.productCount !== undefined && (
                    <p className="text-[10px] text-charcoal-light/60 mt-1">{cat.productCount} products</p>
                  )}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}