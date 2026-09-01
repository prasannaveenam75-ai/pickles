"use client";

import { useState } from "react";
import { Play, BadgeCheck, Sparkles, Quote, ChevronRight } from "lucide-react";
import InstagramIcon from "@/components/ui/InstagramIcon";
import { StarRating } from "@/components/ui/StarRating";
import TestimonialVideoModal from "@/components/ui/TestimonialVideoModal";
import type { ITestimonial } from "@/types";

interface VideoCardProps {
  testimonial: ITestimonial;
  onOpen: (t: ITestimonial) => void;
}

function VideoCard({ testimonial, onOpen }: VideoCardProps) {
  const isReel = testimonial.type === "instagram";
  return (
    <button
      onClick={() => onOpen(testimonial)}
      type="button"
      aria-label={`Play testimonial by ${testimonial.customerName || "customer"}`}
      className="group relative w-full text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-green rounded-2xl overflow-hidden"
    >
      <div className={`relative rounded-2xl overflow-hidden bg-charcoal-dark ${isReel ? "aspect-[9/16]" : "aspect-video"}`}>
        {testimonial.thumbnailUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={testimonial.thumbnailUrl}
            alt={`${testimonial.customerName || "Customer"} testimonial`}
            loading="lazy"
            className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-green-dark to-green flex items-center justify-center">
            <span className="text-white/70 font-display font-bold uppercase text-sm px-4 text-center">Customer Video</span>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-black/20" />

        {isReel ? (
          <span className="absolute top-3 left-3 inline-flex items-center gap-1.5 bg-gradient-to-r from-[#833AB4] via-[#FD1D1D] to-[#FCB045] text-white text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full">
            <InstagramIcon className="w-3 h-3" /> Instagram Testimonial
          </span>
        ) : (
          <span className="absolute top-3 left-3 inline-flex items-center gap-1.5 bg-white/90 text-green text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full">
            Customer Video
          </span>
        )}

        {testimonial.isDemo && (
          <span className="absolute top-3 right-3 badge bg-golden text-white">
            <Sparkles className="w-3 h-3 inline mr-1" />Sample
          </span>
        )}

        <div className="absolute inset-0 flex items-center justify-center">
          <span className="w-16 h-16 rounded-full bg-white/90 backdrop-blur flex items-center justify-center shadow-xl group-hover:bg-green group-hover:scale-110 transition-all duration-300">
            <Play className="w-7 h-7 text-green group-hover:text-white fill-current ml-0.5" />
          </span>
        </div>

        <div className="absolute bottom-0 inset-x-0 p-4">
          <div className="flex items-center gap-2">
            <p className="text-white font-display font-bold text-sm uppercase drop-shadow">{testimonial.customerName || "Customer"}</p>
            {testimonial.verified && <BadgeCheck className="w-4 h-4 text-golden-light" />}
          </div>
          <div className="mt-1">
            <StarRating rating={Math.round(testimonial.rating || 5)} size="sm" />
          </div>
          <p className="mt-1.5 text-xs text-white/80 leading-snug line-clamp-2">
            {testimonial.caption || (testimonial.reviewText || "")}
          </p>
          {testimonial.productName && (
            <span className="mt-2 inline-block text-[10px] font-semibold text-white bg-white/20 px-2 py-0.5 rounded-full backdrop-blur">
              {testimonial.productName}
            </span>
          )}
        </div>
      </div>
    </button>
  );
}

export default function VideoTestimonialsSection({
  videos,
  featuredQuote,
  instagramUrl,
}: {
  videos: ITestimonial[];
  featuredQuote?: ITestimonial | null;
  instagramUrl?: string;
}) {
  const [active, setActive] = useState<ITestimonial | null>(null);

  if (!videos?.length) return null;

  const featuredVideo = videos.find((v) => v.featured) || videos[0];
  const restVideos = videos.filter((v) => v._id !== featuredVideo._id);
  const quote: ITestimonial | null = featuredQuote || videos.find((v) => v.reviewText) || null;

  return (
    <section id="customer-stories" className="py-20 bg-cream scroll-mt-24">
      <div className="container-custom mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-4">
          <p className="text-golden-dark font-display text-xs tracking-[0.25em] uppercase">Real Customers, Real Flavours</p>
          <h2 className="section-title mt-2">Video Testimonials</h2>
          <p className="section-subtitle">Watch our customers open, taste and rave about Devi Pickles.</p>
        </div>

        {featuredVideo && quote && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch mb-14 max-w-5xl mx-auto">
            <VideoCard testimonial={featuredVideo} onOpen={setActive} />
            <div className="bg-white rounded-2xl border border-cream-dark/50 p-8 flex flex-col justify-center shadow-sm">
              <Quote className="w-8 h-8 text-golden/70 transform -scale-x-100" aria-hidden="true" />
              <p className="mt-4 font-display text-xl md:text-2xl font-bold text-charcoal-dark leading-snug uppercase">
                {quote.reviewText}
              </p>
              <div className="mt-4">
                <StarRating rating={Math.round(quote.rating || 5)} size="md" />
              </div>
              <p className="mt-3 text-sm font-semibold text-charcoal-dark">
                {quote.customerName} <span className="text-charcoal-light font-normal">· {quote.customerLocation}</span>
              </p>
              <a
                href="#customer-stories"
                onClick={(e) => {
                  e.preventDefault();
                  document.querySelector("#customer-stories")?.scrollIntoView({ behavior: "smooth" });
                }}
                className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-green hover:text-green-light transition-colors"
              >
                Watch more customer stories <ChevronRight className="w-4 h-4" />
              </a>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {restVideos.map((v) => (
            <VideoCard key={String(v._id)} testimonial={v} onOpen={setActive} />
          ))}
        </div>

        {instagramUrl && (
          <div className="text-center mt-14">
            <h3 className="font-display text-lg font-bold text-charcoal-dark uppercase">See More From Our Customers</h3>
            <p className="text-charcoal-light mt-2 max-w-md mx-auto text-sm">
              Follow us and join the fun — share your pickle stories with #DeviPickles.
            </p>
            <a
              href={instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-6 inline-flex items-center gap-2 bg-gradient-to-r from-[#833AB4] via-[#FD1D1D] to-[#FCB045] text-white font-semibold text-sm uppercase tracking-wider px-8 py-3 rounded-lg hover:opacity-90 hover:shadow-lg transition-all"
            >
              <InstagramIcon className="w-5 h-5" />
              Follow Us On Instagram
            </a>
          </div>
        )}

        <TestimonialVideoModal testimonial={active} onClose={() => setActive(null)} />
      </div>
    </section>
  );
}