"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import TestimonialQuoteCard from "@/components/ui/TestimonialQuoteCard";
import type { ITestimonial } from "@/types";

const AUTOPLAY_MS = 6000;

export default function TestimonialsSection({ testimonials }: { testimonials: ITestimonial[] }) {
  const [perView, setPerView] = useState(3);
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const touchX = useRef<number | null>(null);

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(reduce.matches);
    const onReduce = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    reduce.addEventListener("change", onReduce);

    const update = () => setPerView(window.innerWidth >= 1024 ? 3 : window.innerWidth >= 768 ? 2 : 1);
    update();
    window.addEventListener("resize", update);
    return () => {
      reduce.removeEventListener("change", onReduce);
      window.removeEventListener("resize", update);
    };
  }, []);

  const maxIndex = Math.max(0, testimonials.length - perView);

  useEffect(() => {
    setIndex((i) => Math.min(i, maxIndex));
  }, [maxIndex]);

  useEffect(() => {
    if (reducedMotion || paused || testimonials.length <= perView) return;
    const timer = setInterval(() => {
      setIndex((i) => (i >= maxIndex ? 0 : i + 1));
    }, AUTOPLAY_MS);
    return () => clearInterval(timer);
  }, [reducedMotion, paused, perView, maxIndex, testimonials.length]);

  const go = useCallback((i: number) => setIndex(Math.max(0, Math.min(i, maxIndex))), [maxIndex]);

  if (!testimonials?.length) return null;

  const pageCount = maxIndex + 1;

  return (
    <section className="py-20 bg-white overflow-hidden">
      <div className="container-custom mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8 md:mb-12">
          <p className="text-golden-dark font-display text-[11px] md:text-xs tracking-[0.25em] uppercase font-semibold">Our Stories</p>
          <h2 className="section-title mt-1 md:mt-2">Loved by Our Customers ❤️</h2>
          <p className="section-subtitle">
            From our kitchen to your table — hear what our customers have to say.
          </p>
        </div>

        {testimonials.length <= perView ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {testimonials.map((t) => (
              <TestimonialQuoteCard key={String(t._id)} testimonial={t} />
            ))}
          </div>
        ) : (
          <div
            className="relative max-w-5xl mx-auto mt-10"
            onMouseEnter={() => setPaused(true)}
            onMouseLeave={() => setPaused(false)}
            onFocusCapture={() => setPaused(true)}
            onBlurCapture={() => setPaused(false)}
            onTouchStart={(e) => {
              setPaused(true);
              touchX.current = e.touches[0].clientX;
            }}
            onTouchEnd={(e) => {
              if (touchX.current === null) return;
              const diff = touchX.current - e.changedTouches[0].clientX;
              touchX.current = null;
              if (diff > 40) go(index + 1);
              else if (diff < -40) go(index - 1);
              setPaused(false);
            }}
          >
            <div className="overflow-hidden">
              <div
                className="flex transition-transform duration-500 ease-out"
                style={{ transform: `translateX(-${index * (100 / perView)}%)` }}
              >
                {testimonials.map((t) => (
                  <div
                    key={String(t._id)}
                    className="px-3"
                    style={{ flex: `0 0 ${100 / perView}%` }}
                  >
                    <TestimonialQuoteCard testimonial={t} />
                  </div>
                ))}
              </div>
            </div>

            {index > 0 && (
              <button
                onClick={() => go(index - 1)}
                aria-label="Previous testimonials"
                className="absolute -left-3 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-white border border-cream-dark shadow-md flex items-center justify-center text-charcoal hover:text-green hover:shadow-lg transition-all"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
            )}
            {index < maxIndex && (
              <button
                onClick={() => go(index + 1)}
                aria-label="Next testimonials"
                className="absolute -right-3 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-white border border-cream-dark shadow-md flex items-center justify-center text-charcoal hover:text-green hover:shadow-lg transition-all"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            )}

            <div className="flex items-center justify-center gap-2 mt-8">
              {Array.from({ length: pageCount }).map((_, i) => (
                <button
                  key={i}
                  onClick={() => go(i)}
                  aria-label={`Go to testimonial slide ${i + 1}`}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    i === index ? "w-8 bg-green" : "w-2 bg-green/20 hover:bg-green/40"
                  }`}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}