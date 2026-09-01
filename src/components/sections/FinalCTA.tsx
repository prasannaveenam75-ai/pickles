import Link from "next/link";

interface FinalCTAProps {
  heading: string;
  description: string;
  buttonText: string;
  buttonUrl: string;
}

export default function FinalCTA({ heading, description, buttonText, buttonUrl }: FinalCTAProps) {
  return (
    <section className="relative py-24 bg-green-dark overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(212,160,23,0.15),transparent_50%)]" />
      <div className="relative z-10 container-custom mx-auto px-4 text-center">
        <h2 className="text-3xl md:text-5xl font-display font-bold text-white mb-4">
          {heading || "BRING HOME THE TASTE OF TRADITION."}
        </h2>
        <p className="text-cream/80 text-base md:text-lg mb-10 max-w-xl mx-auto">
          {description || "Authentic homemade flavours, prepared with care."}
        </p>
        {buttonUrl && (
          <Link href={buttonUrl} className="btn-golden btn-lg">
            {buttonText || "SHOP NOW"}
          </Link>
        )}
      </div>
    </section>
  );
}
