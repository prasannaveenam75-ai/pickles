export default function LoadingSkeleton({ type = "product" }: { type?: "product" | "card" | "text" }) {
  if (type === "product") {
    return (
      <div className="product-card">
        <div className="aspect-square bg-cream-dark/50 animate-pulse" />
        <div className="p-4 space-y-3">
          <div className="h-2.5 bg-cream-dark/50 rounded animate-pulse w-1/3" />
          <div className="h-3.5 bg-cream-dark/50 rounded animate-pulse w-2/3" />
          <div className="h-3 bg-cream-dark/50 rounded animate-pulse w-1/2" />
          <div className="h-2 bg-cream-dark/50 rounded animate-pulse w-full" />
        </div>
      </div>
    );
  }

  if (type === "card") {
    return (
      <div className="card">
        <div className="p-3 h-full aspect-[4/3] bg-cream-dark/50 animate-pulse" />
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="h-3.5 bg-cream-dark/50 rounded animate-pulse w-3/4" />
      <div className="h-3.5 bg-cream-dark/50 rounded animate-pulse w-full" />
      <div className="h-3.5 bg-cream-dark/50 rounded animate-pulse w-5/6" />
    </div>
  );
}
