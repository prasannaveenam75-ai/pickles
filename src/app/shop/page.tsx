import StorefrontLayout from "@/components/layout/StorefrontLayout";
import ProductGrid from "@/components/ui/ProductGrid";
import { connectToDatabase } from "@/lib/mongodb";
import { Product, Category } from "@/lib/models";
import { serialize } from "@/lib/utils/serialize";
import ShopControls from "./ShopControls";

export const revalidate = 300;

export const metadata = {
  title: "Shop All Pickles & Powders",
  description: "Browse our full collection of authentic homemade pickles and powders. Veg pickles, non-veg pickles and traditional powders.",
};

export default async function ShopPage() {
  let products: any[] = [], categories: any[] = [], counts: any[] = [];
  try {
    await connectToDatabase();
    [products, categories, counts] = await Promise.all([
      Product.find({ active: true }).sort({ featured: -1, createdAt: -1 }).lean(),
      Category.find({ active: true }).sort({ displayOrder: 1 }).lean(),
      Product.aggregate([{ $match: { active: true } }, { $group: { _id: "$category", count: { $sum: 1 } } }]),
    ]);
  } catch (err) {
    console.error("Shop page DB error:", err);
  }

  const catCountMap: Record<string, number> = {};
  (counts || []).forEach((c: any) => { catCountMap[c._id] = c.count; });

  const topLevel = serialize(categories.filter((c: any) => !c.parent));

  return (
    <StorefrontLayout>
      <div className="pt-2 md:pt-4">
        <div className="bg-maroon-dark text-white py-8 md:py-12">
          <div className="container-custom mx-auto px-4 text-center">
            <h1 className="text-2xl md:text-4xl lg:text-5xl font-display font-bold mb-2">Shop</h1>
            <p className="text-cream/80 text-sm max-w-xl mx-auto">
              Explore our complete collection of authentic homemade delicacies.
            </p>
          </div>
        </div>
      </div>

      <ShopControls
        products={serialize(products)}
        categories={serialize(categories)}
        catCountMap={catCountMap}
        topLevel={topLevel}
      />
    </StorefrontLayout>
  );
}
