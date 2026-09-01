import ProductCard from "@/components/ui/ProductCard";
import type { IProduct } from "@/types";

export default function ProductGrid({ products }: { products: IProduct[] }) {
  if (!products?.length) {
    return (
      <div className="text-center py-16">
        <p className="text-charcoal-light">No products found.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
      {products.map((product) => (
        <ProductCard key={product._id} product={product} />
      ))}
    </div>
  );
}
