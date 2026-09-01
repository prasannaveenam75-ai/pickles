import { StarRating } from "@/components/ui/StarRating";
import type { IReview } from "@/types";

interface ReviewsSectionProps {
  reviews: IReview[];
}

export default function CustomerReviews({ reviews }: ReviewsSectionProps) {
  if (!reviews?.length) {
    return (
      <section className="py-20 bg-white">
        <div className="container-custom mx-auto px-4 text-center">
          <h2 className="section-title">Loved By Our Customers</h2>
          <p className="text-charcoal-light mt-6 max-w-lg mx-auto">
            Reviews from our happy customers will appear here soon.
          </p>
        </div>
      </section>
    );
  }

  const published = reviews.filter((r) => r.published);

  if (!published.length) {
    return (
      <section className="py-20 bg-white">
        <div className="container-custom mx-auto px-4 text-center">
          <h2 className="section-title">Loved By Our Customers</h2>
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 bg-white">
      <div className="container-custom mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="section-title">Loved By Our Customers</h2>
          <p className="section-subtitle">Real feedback from our pickle lovers.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {published.map((review) => (
            <div key={review._id} className="card p-6">
              <div className="flex items-center gap-4 mb-4">
                {review.photo ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={review.photo} alt={review.customerName} className="w-12 h-12 rounded-full object-cover" />
                ) : (
                  <div className="w-12 h-12 rounded-full bg-green/10 text-green flex items-center justify-center font-bold text-lg">
                    {review.customerName.charAt(0)}
                  </div>
                )}
                <div>
                  <h3 className="font-semibold text-charcoal-dark">{review.customerName}</h3>
                  {review.location && (
                    <p className="text-xs text-charcoal-light">{review.location}</p>
                  )}
                </div>
              </div>
              <StarRating rating={review.rating} />
              <p className="mt-3 text-sm text-charcoal-light leading-relaxed line-clamp-4">
                {review.review}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
