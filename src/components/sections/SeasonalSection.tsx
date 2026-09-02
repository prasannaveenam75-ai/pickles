import Link from "next/link";
import ProductCard from "@/components/ui/ProductCard";

export default function SeasonalSection({ products, title, subtitle }: { products: any[]; title?: string; subtitle?: string }) {
  if (!products?.length) return null;

  return (
    <section className="py-16 md:py-20 bg-gradient-to-br from-maroon-dark via-maroon to-maroon-dark text-white relative overflow-hidden">
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-10 left-10 w-40 h-40 bg-golden rounded-full blur-3xl" />
        <div className="absolute bottom-10 right-10 w-60 h-60 bg-golden rounded-full blur-3xl" />
      </div>
      <div className="container-custom mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-12">
          <p className="text-golden font-display text-xs tracking-[0.25em] uppercase">Limited Time</p>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-center font-display mt-2">{title || "Summer Specials"}</h2>
          <p className="text-base md:text-lg text-white/70 text-center mt-4 max-w-2xl mx-auto">
            {subtitle || "Traditional favourites made especially for the summer season."}
          </p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {products.map((product) => (
            <div key={product._id} className="bg-white/10 backdrop-blur-sm rounded-xl overflow-hidden border border-white/10 hover:border-golden/30 transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
              <div className="aspect-square bg-white/5 overflow-hidden relative">
                {product.images?.[0] ? (
                  <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover" loading="lazy" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <span className="text-4xl font-display font-bold text-white/10">{product.name.charAt(0)}</span>
                  </div>
                )}
                {product.seasonal && (
                  <span className="absolute top-3 left-3 bg-golden text-maroon-dark text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full">
                    Seasonal
                  </span>
                )}
              </div>
              <div className="p-4">
                <h3 className="font-display font-bold text-sm text-white line-clamp-1">{product.name}</h3>
                <p className="text-xs text-white/50 mt-0.5">{product.category}</p>
                <div className="flex items-center gap-2 mt-3">
                  <span className="text-golden font-bold text-lg">
                    ₹{Math.min(...product.variants.map((v: any) => v.price))}
                  </span>
                  {product.variants[0]?.compareAtPrice && (
                    <span className="text-white/40 text-xs line-through">₹{product.variants[0].compareAtPrice}</span>
                  )}
                </div>
                <div className="flex items-center gap-1 mt-2">
                  {product.variants.slice(0, 3).map((v: any) => (
                    <span key={v._id} className="text-[10px] text-white/60 bg-white/10 px-1.5 py-0.5 rounded">
                      {v.weight}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="text-center mt-10">
          <Link href="/shop?seasonal=true" className="inline-flex items-center justify-center px-8 py-3 bg-golden text-maroon-dark font-semibold tracking-wider text-sm uppercase rounded-lg transition-all duration-300 hover:bg-golden-light hover:shadow-lg">
            Shop Seasonal
          </Link>
        </div>
      </div>
    </section>
  );
}