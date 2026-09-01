import { Quote, MapPin, BadgeCheck, Sparkles } from "lucide-react";
import { StarRating } from "@/components/ui/StarRating";
import type { ITestimonial } from "@/types";

export default function TestimonialQuoteCard({
  testimonial,
  clamp = true,
}: {
  testimonial: Partial<ITestimonial>;
  clamp?: boolean;
}) {
  const name = testimonial.customerName || "Customer";
  const initial = name.charAt(0).toUpperCase();

  return (
    <div className="relative flex flex-col h-full bg-gradient-to-br from-warm-white to-cream border border-cream-dark/60 rounded-2xl p-6 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
      <Quote className="w-8 h-8 text-golden/70 absolute top-5 right-5 transform -scale-x-100" aria-hidden="true" />

      {testimonial.isDemo && (
        <span className="absolute top-4 left-4 badge bg-golden/15 text-golden-dark">
          <Sparkles className="w-3 h-3 inline mr-1" />Sample Testimonial
        </span>
      )}

      <div className="flex items-center gap-3.5 mt-6">
        {testimonial.customerImage ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={testimonial.customerImage}
            alt={name}
            className="w-12 h-12 rounded-full object-cover ring-2 ring-green/20"
          />
        ) : (
          <div className="w-12 h-12 rounded-full bg-green/10 text-green flex items-center justify-center font-display font-bold text-lg ring-2 ring-green/20">
            {initial}
          </div>
        )}
        <div>
          <h3 className="font-display text-sm font-bold text-charcoal-dark uppercase leading-tight">
            {name}
          </h3>
          {testimonial.customerLocation && (
            <p className="text-xs text-charcoal-light flex items-center gap-1 mt-0.5">
              <MapPin className="w-3 h-3" aria-hidden="true" />
              {testimonial.customerLocation}
            </p>
          )}
        </div>
        {testimonial.verified && testimonial.verified === true && (
          <span className="ml-auto inline-flex items-center gap-1 text-[10px] font-semibold text-green">
            <BadgeCheck className="w-4 h-4" aria-hidden="true" />
            Verified Customer
          </span>
        )}
      </div>

      <div className="mt-4">
        <StarRating rating={Math.round(testimonial.rating || 5)} size="sm" />
      </div>

      <p
        className={`mt-3 text-sm text-charcoal-light leading-relaxed ${
          clamp ? "line-clamp-4" : ""
        }`}
      >
        {testimonial.reviewText}
      </p>

      {testimonial.productName && (
        <span className="mt-4 inline-flex self-start items-center gap-1.5 text-[11px] font-semibold text-green bg-green/10 px-3 py-1 rounded-full">
          {testimonial.productName}
        </span>
      )}

      {testimonial.createdAt && (
        <p className="mt-auto pt-4 text-[11px] text-charcoal-light/50">
          {new Date(testimonial.createdAt).toLocaleDateString("en-IN", {
            day: "numeric",
            month: "short",
            year: "numeric",
          })}
        </p>
      )}
    </div>
  );
}