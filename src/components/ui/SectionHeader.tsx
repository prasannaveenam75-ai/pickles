import Link from "next/link";

interface SectionHeaderProps {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  viewAllHref?: string;
  viewAllLabel?: string;
  align?: "left" | "center";
}

export default function SectionHeader({
  eyebrow,
  title,
  subtitle,
  viewAllHref,
  viewAllLabel = "View All",
  align = "left",
}: SectionHeaderProps) {
  if (align === "center") {
    return (
      <div className="text-center mb-8 md:mb-12">
        {eyebrow && (
          <span className="text-golden-dark font-display text-[11px] md:text-xs tracking-[0.25em] uppercase font-semibold">
            {eyebrow}
          </span>
        )}
        <h2 className="section-title mt-1 md:mt-2">{title}</h2>
        {subtitle && <p className="section-subtitle">{subtitle}</p>}
      </div>
    );
  }

  return (
    <div className="flex items-end justify-between mb-6 md:mb-8">
      <div>
        {eyebrow && (
          <span className="text-golden-dark font-display text-[11px] md:text-xs tracking-[0.25em] uppercase font-semibold">
            {eyebrow}
          </span>
        )}
        <h2 className="text-xl md:text-3xl lg:text-4xl font-display font-bold text-charcoal-dark mt-0.5">
          {title}
        </h2>
        {subtitle && <p className="text-xs md:text-sm text-charcoal-light mt-1">{subtitle}</p>}
      </div>
      {viewAllHref && (
        <Link
          href={viewAllHref}
          className="text-xs md:text-sm font-bold text-maroon hover:text-maroon-light uppercase tracking-wider inline-flex items-center gap-1.5 flex-shrink-0"
        >
          {viewAllLabel}
          <span className="inline-block w-5 h-5 rounded-full bg-maroon text-white flex items-center justify-center text-[10px]">→</span>
        </Link>
      )}
    </div>
  );
}
