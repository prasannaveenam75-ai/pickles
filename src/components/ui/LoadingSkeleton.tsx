import Link from "next/link";
import { RefreshCcw } from "lucide-react";

export function ProductCardSkeleton() {
  return (
    <div className="card overflow-hidden">
      <div className="aspect-square skeleton" />
      <div className="p-3 space-y-2">
        <div className="h-3 skeleton rounded w-1/3" />
        <div className="h-4 skeleton rounded w-3/4" />
        <div className="h-4 skeleton rounded w-1/2" />
        <div className="h-8 skeleton rounded mt-2" />
      </div>
    </div>
  );
}

export function ProductGridSkeleton({ count = 8 }: { count?: number }) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <ProductCardSkeleton key={i} />
      ))}
    </div>
  );
}

export function HeroSkeleton() {
  return <div className="min-h-[70vh] skeleton" />;
}

export function SectionSkeleton({ cards = 4 }: { cards?: number }) {
  return (
    <div className="section-padding">
      <div className="text-center mb-8 space-y-3">
        <div className="h-3 skeleton rounded w-40 mx-auto" />
        <div className="h-8 skeleton rounded w-72 max-w-full mx-auto" />
        <div className="h-4 skeleton rounded w-96 max-w-full mx-auto" />
      </div>
      <ProductGridSkeleton count={cards} />
    </div>
  );
}

export function LoadError({
  title = "Couldn't load this content",
  onRetry,
  href,
  hrefLabel = "Back to Shop",
}: {
  title?: string;
  onRetry?: () => void;
  href?: string;
  hrefLabel?: string;
}) {
  return (
    <div className="min-h-[50vh] flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <p className="font-display text-6xl font-bold text-red/20">!</p>
        <h2 className="font-display text-2xl font-bold mt-4 mb-2">{title}</h2>
        <p className="text-charcoal-light mb-8">
          Something went wrong while loading. Please try again.
        </p>
        <div className="flex flex-wrap justify-center gap-3">
          {onRetry && (
            <button onClick={onRetry} className="btn-primary">
              <RefreshCcw className="w-4 h-4 mr-2" /> Retry
            </button>
          )}
          {href && (
            <Link href={href} className="btn-secondary">
              {hrefLabel}
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
