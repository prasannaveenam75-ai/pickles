import { Star } from "lucide-react";

export function StarRating({ rating, size = "md" }: { rating: number; size?: "sm" | "md" }) {
  const starSize = size === "sm" ? "w-3.5 h-3.5" : "w-4 h-4";
  return (
    <div className="flex items-center gap-0.5" aria-label={`${rating} out of 5 stars`}>
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={`${starSize} ${
            star <= rating ? "text-golden fill-golden" : "text-gray-300"
          }`}
        />
      ))}
    </div>
  );
}
