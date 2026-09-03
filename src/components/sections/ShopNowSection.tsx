import Link from "next/link";
import type { IProduct } from "@/types";
import ProductCard from "@/components/ui/ProductCard";

export default function ShopNowSection({ products }: { products: IProduct[] }) {
  if (!products?.length) return null;

  return (
    <section className="py-10 md:py-16 bg-white">
      <div className="container-custom mx-auto px-4">
        <div className="flex items-end justify-between mb-6 md:mb-8">
          <div>
            <span className="text-golden-dark font-display text-[11px] md:text-xs tracking-[0.25em] uppercase font-semibold">
              Fresh &amp; Ready
            </span>
            <h2 className="text-xl md:text-3xl lg:text-4xl font-display font-bold text-charcoal-dark mt-1">
              Shop Your Favourites
            </h2>
            <p className="text-xs md:text-sm text-charcoal-light mt-1">
              Pick your favourites and get them delivered to your door.
            </p>
          </div>
          <Link
            href="/shop"
            className="text-xs md:text-sm font-bold text-maroon hover:text-maroon-light uppercase tracking-wider inline-flex items-center gap-1.5 flex-shrink-0"
          >
            Shop All
            <span className="inline-block w-5 h-5 rounded-full bg-maroon text-white flex items-center justify-center text-[10px]">→</span>
          </Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-5">
          {products.slice(0, 8).map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
}
