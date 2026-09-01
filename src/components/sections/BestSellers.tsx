import type { IProduct } from "@/types";
import ProductCard from "@/components/ui/ProductCard";
import Link from "next/link";

export default function BestSellers({ products }: { products: IProduct[] }) {
  if (!products?.length) return null;

  return (
    <section className="section-padding bg-white">
      <div className="container-custom mx-auto">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-10">
          <div>
            <h2 className="section-title text-left">Our Bestsellers</h2>
            <p className="text-charcoal-light mt-3">Loved by our customers. Prepared with tradition.</p>
          </div>
          <Link href="/shop" className="mt-4 md:mt-0 text-sm font-semibold text-green hover:text-green-light uppercase tracking-wider inline-flex items-center gap-2">
            View All
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {products.slice(0, 8).map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
}
