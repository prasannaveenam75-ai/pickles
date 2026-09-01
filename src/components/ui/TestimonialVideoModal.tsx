"use client";

import { useEffect, useRef, useState } from "react";
import { X, ExternalLink } from "lucide-react";
import InstagramIcon from "@/components/ui/InstagramIcon";
import { StarRating } from "@/components/ui/StarRating";
import { instagramEmbedUrl, instagramPostUrl, TESTIMONIAL_TYPE_LABELS } from "@/lib/utils/testimonial";
import type { ITestimonial } from "@/types";

const EMBED_TIMEOUT_MS = 3500;

export default function TestimonialVideoModal({
  testimonial,
  onClose,
}: {
  testimonial: ITestimonial | null;
  onClose: () => void;
}) {
  const [embedLoaded, setEmbedLoaded] = useState(false);
  const [embedExpired, setEmbedExpired] = useState(false);
  const [videoFailed, setVideoFailed] = useState(false);
  const closeRef = useRef<HTMLButtonElement>(null);

  // Reset state whenever a new testimonial is opened.
  useEffect(() => {
    setEmbedLoaded(false);
    setEmbedExpired(false);
    setVideoFailed(false);
  }, [testimonial?._id]);

  useEffect(() => {
    if (!testimonial) return;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [testimonial, onClose]);

  useEffect(() => {
    if (!testimonial || testimonial.type !== "instagram" || embedLoaded) return;
    const timer = setTimeout(() => setEmbedExpired(true), EMBED_TIMEOUT_MS);
    return () => clearTimeout(timer);
  }, [testimonial, embedLoaded]);

  if (!testimonial) return null;

  const showEmbed = testimonial.type === "instagram" && embedLoaded;
  const showInstagramFallback = testimonial.type === "instagram" && !embedLoaded && embedExpired;
  const openInstagram = instagramPostUrl(testimonial.instagramUrl || "");

  return (
    <div
      className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-sm flex items-center justify-center p-4 sm:p-8"
      role="dialog"
      aria-modal="true"
      aria-label={`${testimonial.customerName || "Customer"} testimonial`}
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-3xl bg-warm-white rounded-2xl overflow-hidden shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          ref={closeRef}
          onClick={onClose}
          aria-label="Close testimonial"
          className="absolute top-3 right-3 z-20 w-10 h-10 rounded-full bg-black/60 text-white hover:bg-red transition-colors flex items-center justify-center"
        >
          <X className="w-5 h-5" />
        </button>

        {showEmbed && (
          <div className="bg-black flex flex-col items-center justify-center min-h-[50vh]">
            <div className="w-full max-w-md">
              {/* eslint-disable-next-line @next/next/no-iframe-element */}
              <iframe
                src={instagramEmbedUrl(testimonial.instagramUrl || "")}
                className="w-full h-[75vh] bg-black"
                allow="autoplay; encrypted-media"
                loading="lazy"
                referrerPolicy="no-referrer"
                title={`Instagram ${testimonial.instagramCode ? "reel" : "post"} by ${testimonial.customerName || "customer"}`}
              />
            </div>
            <a
              href={openInstagram || "#"}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 inline-flex items-center gap-2 text-sm text-white bg-gradient-to-r from-[#833AB4] via-[#FD1D1D] to-[#FCB045] px-4 py-2 rounded-lg font-semibold"
            >
              <InstagramIcon className="w-4 h-4" />
              Watch on Instagram
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        )}

        {showEmbed === false && (() => {
          if (testimonial.type === "instagram") {
            if (!showInstagramFallback) {
              // Loading embed (spinner) — matches fallback styling until embed/timeout resolves.
              return (
                <div className="bg-black flex items-center justify-center min-h-[50vh]">
                  <div className="w-10 h-10 border-4 border-white/20 border-t-green rounded-full animate-spin" aria-label="Loading Instagram embed" />
                </div>
              );
            }
            return (
              <div
                className="relative bg-charcoal-dark flex items-center justify-center min-h-[50vh] bg-cover bg-center"
                style={testimonial.thumbnailUrl ? { backgroundImage: `url(${testimonial.thumbnailUrl})` } : undefined}
              >
                <div className="absolute inset-0 bg-black/60" />
                <div className="relative text-center px-6 py-10 z-10">
                  {testimonial.thumbnailUrl && (
                    <div className="w-20 h-20 mx-auto mb-5 rounded-full bg-gradient-to-br from-[#833AB4] via-[#FD1D1D] to-[#FCB045] flex items-center justify-center shadow-lg">
                      <InstagramIcon className="w-9 h-9 text-white" />
                    </div>
                  )}
                  <p className="text-white font-display font-bold uppercase tracking-wider">
                    {testimonial.customerName || "Watch this story"}
                  </p>
                  <p className="text-cream/80 text-sm mt-1.5">{testimonial.caption || "A video from our customers."}</p>
                  <a
                    href={openInstagram || "#"}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-6 inline-flex items-center gap-2 bg-gradient-to-r from-[#833AB4] via-[#FD1D1D] to-[#FCB045] text-white font-semibold text-sm px-5 py-2.5 rounded-lg hover:opacity-90 transition-opacity"
                  >
                    <InstagramIcon className="w-4 h-4" />
                    Watch this testimonial on Instagram
                  </a>
                </div>
              </div>
            );
          }

          // Uploaded video
          if (videoFailed) {
            return (
              <div
                className="relative bg-charcoal-dark flex items-center justify-center min-h-[50vh] bg-cover bg-center"
                style={testimonial.thumbnailUrl ? { backgroundImage: `url(${testimonial.thumbnailUrl})` } : undefined}
              >
                <div className="absolute inset-0 bg-black/60" />
                <div className="relative text-center px-6 py-10 z-10">
                  <p className="text-white font-display font-bold text-lg">Video unavailable</p>
                  <p className="text-cream/80 text-sm mt-2">
                    This video could not be played. The admin can replace it anytime from the Testimonials panel.
                  </p>
                  <button
                    onClick={onClose}
                    className="mt-6 inline-flex items-center gap-2 bg-green text-white font-semibold text-sm px-5 py-2.5 rounded-lg hover:bg-green-light transition-colors"
                  >
                    Close
                  </button>
                </div>
              </div>
            );
          }

          return (
            <video
              key={testimonial.videoUrl}
              className="w-full max-h-[80vh] bg-black"
              controls
              autoPlay
              playsInline
              preload="metadata"
              poster={testimonial.thumbnailUrl || undefined}
              onError={() => setVideoFailed(true)}
            >
              <source src={testimonial.videoUrl || ""} />
            </video>
          );
        })()}

        <div className="p-5 border-t border-cream-dark/50 flex items-center gap-4">
          {testimonial.customerImage ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={testimonial.customerImage} alt={testimonial.customerName || ""} className="w-10 h-10 rounded-full object-cover" />
          ) : (
            <div className="w-10 h-10 rounded-full bg-green/10 text-green flex items-center justify-center font-display font-bold">
              {(testimonial.customerName || "C").charAt(0).toUpperCase()}
            </div>
          )}
          <div className="min-w-0">
            <p className="font-display text-sm font-bold text-charcoal-dark uppercase">
              {testimonial.customerName || "Customer"}{" "}
              {testimonial.customerLocation ? `· ${testimonial.customerLocation}` : ""}
            </p>
            <div className="flex items-center gap-2 mt-1">
              <StarRating rating={Math.round(testimonial.rating || 5)} size="sm" />
              {testimonial.isDemo && (
                <span className="text-[10px] font-semibold text-golden-dark uppercase">Sample Testimonial</span>
              )}
            </div>
          </div>
          {testimonial.type !== "written" && (
            <span className="ml-auto text-[11px] font-semibold text-charcoal-light/70 flex items-center gap-1.5">
              {testimonial.type === "instagram" ? (
<>
                  <InstagramIcon className="w-4 h-4" /> {TESTIMONIAL_TYPE_LABELS.instagram}
                </>
              ) : (
                <>{TESTIMONIAL_TYPE_LABELS.uploaded}</>
              )}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}