import StorefrontLayout from "@/components/layout/StorefrontLayout";
import { HeroSkeleton, ProductGridSkeleton } from "@/components/ui/LoadingSkeleton";

export default function Loading() {
  return (
    <StorefrontLayout>
      <HeroSkeleton />
      <div className="container-custom mx-auto px-4 py-8">
        <ProductGridSkeleton count={8} />
      </div>
    </StorefrontLayout>
  );
}
