import StorefrontLayout from "@/components/layout/StorefrontLayout";
import Hero from "@/components/sections/Hero";
import TrustStrip from "@/components/sections/TrustStrip";
import CategoryShowcase from "@/components/sections/CategoryShowcase";
import BestSellers from "@/components/sections/BestSellers";
import StorySection from "@/components/sections/StorySection";
import TestimonialsSection from "@/components/sections/TestimonialsSection";
import VideoTestimonialsSection from "@/components/sections/VideoTestimonialsSection";
import ShopNowSection from "@/components/sections/ShopNowSection";
import ScrollingDisclaimer from "@/components/sections/ScrollingDisclaimer";
import PolicySection from "@/components/sections/PolicySection";
import WhyChooseUs from "@/components/sections/WhyChooseUs";
import FounderSection from "@/components/sections/FounderSection";
import FinalCTA from "@/components/sections/FinalCTA";
import { connectToDatabase } from "@/lib/mongodb";
import { Category, Homepage, Product, Testimonial, SiteSettings } from "@/lib/models";
import { serialize } from "@/lib/utils/serialize";

export const revalidate = 300;

export default async function HomePage() {
  let categories: any[] = [], bestSellers: any[] = [], featured: any[] = [];
  let writtenTestimonials: any[] = [], videoTestimonials: any[] = [];
  let instagramUrl = "";
  let hc: Record<string, any> = {};
  let productsByCategory: Record<string, number> = {};
  try {
    await connectToDatabase();

    const [cats, sellers, homepageData, writtenT, videoT, settings, catCounts] = await Promise.all([
      Category.find({ active: true }).sort({ displayOrder: 1 }).lean(),
      Product.find({ active: true, bestSeller: true }).limit(8).lean(),
      Homepage.findOne().lean(),
      Testimonial.find({ active: true, type: "written" }).sort({ displayOrder: 1, createdAt: -1 }).limit(10).lean(),
      Testimonial.find({ active: true, type: { $in: ["instagram", "uploaded"] } }).sort({ displayOrder: 1, createdAt: -1 }).limit(6).lean(),
      SiteSettings.findOne().lean(),
      Product.aggregate([{ $match: { active: true } }, { $group: { _id: "$category", count: { $sum: 1 } } }]),
    ]);

    categories = cats;
    bestSellers = sellers;
    writtenTestimonials = writtenT;
    videoTestimonials = videoT;
    (catCounts || []).forEach((c: any) => { productsByCategory[c._id] = c.count; });
    instagramUrl = (settings as any)?.instagramUrl || "";
    hc = serialize((homepageData as Record<string, any>) || {});
    const featuredIds = hc.featuredProducts || [];
    featured = featuredIds.length
      ? await Product.find({ _id: { $in: featuredIds }, active: true }).lean()
      : [];
  } catch (err) {
    console.error("Homepage DB error:", err);
  }

  const hero = hc.hero || {};
  const founder = hc.founder || {};
  const policies = hc.policies || {};
  const whyChooseUs = hc.whyChooseUs || {};

  return (
    <StorefrontLayout>
      {/* 1. Hero */}
      <Hero hero={hero} />

      {/* 2. Our Categories */}
      <CategoryShowcase
        categories={categories?.filter((c: any) => !c.parent).map((c: any) => ({
          _id: c._id?.toString(),
          name: c.name,
          slug: c.slug,
          description: c.description,
          image: c.image,
          productCount: productsByCategory?.[c.name] || 0,
        }))}
      />

      {/* 3. Our Best Sellers */}
      <BestSellers products={serialize(bestSellers)} />

      {/* 4. Loved by Thousands */}
      {writtenTestimonials.length > 0 && (
        <TestimonialsSection testimonials={serialize(writtenTestimonials)} />
      )}

      {/* 5. Video Testimonials */}
      {videoTestimonials.length > 0 && (
        <VideoTestimonialsSection
          videos={serialize(videoTestimonials)}
          featuredQuote={serialize(writtenTestimonials).find((t: any) => t.featured) || null}
          instagramUrl={instagramUrl}
        />
      )}

      {/* 6. About brand - TRADITION IN EVERY JAR */}
      <StorySection
        title={hc.storySection?.title || "TRADITION IN EVERY JAR"}
        text={hc.storySection?.text || "At Devi Pickles, every jar carries the warmth of traditional homemade cooking."}
        image={hc.storySection?.image || ""}
      />

      {/* 7. Shop Your Favourites */}
      <ShopNowSection products={serialize(featured.length ? featured : bestSellers)} />

      {/* 8. Unboxing video disclaimer (scrolling) */}
      <ScrollingDisclaimer text={policies?.unboxingDisclaimer} />

      {/* 9. Trust marquee */}
      <TrustStrip items={hc.trustItems} />

      {/* 10. Why Choose Devi Pickles */}
      <WhyChooseUs title={whyChooseUs?.title || "WHY CHOOSE DEVI PICKLES?"} items={whyChooseUs?.items || []} />

      {/* 11. No Return / Refund / Replacement */}
      <PolicySection policies={policies} />

      {/* 12. About Founder */}
      <FounderSection founder={founder} />

      {/* 13. Final CTA */}
      <FinalCTA
        heading={hc.finalCta?.heading || ""}
        description={hc.finalCta?.description || ""}
        buttonText={hc.finalCta?.buttonText || ""}
        buttonUrl={hc.finalCta?.buttonUrl || ""}
      />
    </StorefrontLayout>
  );
}
