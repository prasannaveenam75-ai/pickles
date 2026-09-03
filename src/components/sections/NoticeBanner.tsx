"use client";

import { Video, PackageX } from "lucide-react";

interface NoticeBannerProps {
  variant: "video" | "returns";
}

export default function NoticeBanner({ variant }: NoticeBannerProps) {
  if (variant === "video") {
    return (
      <section className="bg-maroon-dark">
        <div className="container-custom mx-auto px-4 py-8 md:py-10">
          <div className="flex flex-col sm:flex-row items-center gap-4 md:gap-6 justify-center text-center sm:text-left">
            <div className="w-12 h-12 md:w-14 md:h-14 rounded-full bg-white/10 flex items-center justify-center text-golden flex-shrink-0">
              <Video className="w-6 h-6 md:w-7 md:h-7" />
            </div>
            <div>
              <h3 className="font-display text-lg md:text-xl font-bold text-white uppercase">
                Important: Video is Mandatory for Any Issues
              </h3>
              <p className="text-cream/80 text-sm md:text-base mt-1 max-w-3xl">
                To help us resolve any issue quickly, please record an unboxing / opening video of your parcel. Claims
                without supporting video cannot be processed.
              </p>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="bg-cream-dark/40 border-y border-cream-dark/30">
      <div className="container-custom mx-auto px-4 py-8 md:py-10">
        <div className="flex flex-col sm:flex-row items-center gap-4 md:gap-6 justify-center text-center sm:text-left">
          <div className="w-12 h-12 md:w-14 md:h-14 rounded-full bg-red/10 flex items-center justify-center text-red flex-shrink-0">
            <PackageX className="w-6 h-6 md:w-7 md:h-7" />
          </div>
          <div>
            <h3 className="font-display text-lg md:text-xl font-bold text-charcoal-dark uppercase">
              No Return, Refund or Replacement
            </h3>
            <p className="text-charcoal-light text-sm md:text-base mt-1 max-w-3xl">
              As our food products are freshly prepared and perishable, we do not offer returns, refunds or
              replacements once an order is dispatched. Please review your order carefully before placing it.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
