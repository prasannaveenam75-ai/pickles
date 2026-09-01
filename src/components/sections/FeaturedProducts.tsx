import type { IProduct } from "@/types";
import ProductCard from "@/components/ui/ProductCard";

export default function FeaturedProducts({ products }: { products: IProduct[] }) {
  if (!products?.length) return null;

  return (
    <section className="py-20 bg-cream-dark/30">
      <div className="container-custom mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="section-title">Featured Delicacies</h2>
          <p className="section-subtitle">Handpicked favourites, prepared with love.</p>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {products.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
}
