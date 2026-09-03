import StorefrontLayout from "@/components/layout/StorefrontLayout";
import Hero from "@/components/sections/Hero";
import TrustStrip from "@/components/sections/TrustStrip";
import CategoryShowcase from "@/components/sections/CategoryShowcase";
import BestSellers from "@/components/sections/BestSellers";
import StorySection from "@/components/sections/StorySection";
import WhyChooseUs from "@/components/sections/WhyChooseUs";
import PickleExperience from "@/components/sections/PickleExperience";
import SweetsSection from "@/components/sections/SweetsSection";
import SnacksSection from "@/components/sections/SnacksSection";
import SeasonalSection from "@/components/sections/SeasonalSection";
import TestimonialsSection from "@/components/sections/TestimonialsSection";
import VideoTestimonialsSection from "@/components/sections/VideoTestimonialsSection";
import SocialGallery from "@/components/sections/SocialGallery";
import FAQSection from "@/components/sections/FAQSection";
import FinalCTA from "@/components/sections/FinalCTA";
import FeaturedProducts from "@/components/sections/FeaturedProducts";
import { connectToDatabase } from "@/lib/mongodb";
import { Category, Homepage, Product, Testimonial, SiteSettings, FAQ } from "@/lib/models";
import { serialize } from "@/lib/utils/serialize";

export const revalidate = 300;

export default async function HomePage() {
  let categories: any[] = [], bestSellers: any[] = [], faqs: any[] = [], featured: any[] = [];
  let writtenTestimonials: any[] = [], videoTestimonials: any[] = [];
  let powderProducts: any[] = [], nonVegProducts: any[] = [], seasonalProducts: any[] = [];
  let instagramUrl = "";
  let hc: Record<string, any> = {};
  let productsByCategory: Record<string, number> = {};
  try {
    await connectToDatabase();

    const [cats, sellers, fqs, homepageData, writtenT, videoT, settings, powders, nonVeg, seasonal, catCounts] = await Promise.all([
      Category.find({ active: true }).sort({ displayOrder: 1 }).lean(),
      Product.find({ active: true, bestSeller: true }).limit(8).lean(),
      FAQ.find({ active: true }).sort({ displayOrder: 1 }).limit(6).lean(),
      Homepage.findOne().lean(),
      Testimonial.find({ active: true, type: "written" }).sort({ displayOrder: 1, createdAt: -1 }).limit(10).lean(),
      Testimonial.find({ active: true, type: { $in: ["instagram", "uploaded"] } }).sort({ displayOrder: 1, createdAt: -1 }).limit(6).lean(),
      SiteSettings.findOne().lean(),
      Product.find({ active: true, category: "Powders" }).limit(8).lean(),
      Product.find({ active: true, category: "Non-Veg Pickles" }).limit(8).lean(),
      Product.find({ active: true, seasonal: true }).limit(8).lean(),
      Product.aggregate([{ $match: { active: true } }, { $group: { _id: "$category", count: { $sum: 1 } } }]),
    ]);

    categories = cats;
    bestSellers = sellers;
    faqs = fqs;
    writtenTestimonials = writtenT;
    videoTestimonials = videoT;
    powderProducts = powders;
    nonVegProducts = nonVeg;
    seasonalProducts = seasonal;
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

  return (
    <StorefrontLayout>
      <Hero
        heading={hc.hero?.heading || "AUTHENTIC TASTE.\nMADE WITH LOVE."}
        subheading={hc.hero?.subheading || "Traditional homemade pickles crafted with care, packed fresh and delivered to your doorstep."}
        image={hc.hero?.image || ""}
        ctaText={hc.hero?.ctaText || "SHOP PICKLES"}
        ctaUrl={hc.hero?.ctaUrl || "/shop"}
      />
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
      <TrustStrip items={hc.trustItems} />
      <BestSellers products={serialize(bestSellers)} />
      {writtenTestimonials.length > 0 && (
        <TestimonialsSection testimonials={serialize(writtenTestimonials)} />
      )}
      <WhyChooseUs title={hc.whyChooseUs?.title} items={hc.whyChooseUs?.items} />
      <StorySection
        title={hc.storySection?.title || "TRADITION IN EVERY JAR"}
        text={hc.storySection?.text || "At Devi Pickles, every jar carries the warmth of traditional homemade cooking."}
        image={hc.storySection?.image || ""}
      />
      {nonVegProducts.length > 0 && (
        <SnacksSection products={serialize(nonVegProducts)} title="PREMIUM NON-VEG PICKLES" subtitle="Rich, fiery and prepared the traditional way with the finest ingredients." />
      )}
      {powderProducts.length > 0 && (
        <SweetsSection products={serialize(powderProducts)} title="TRADITIONAL POWDERS & PODIS" subtitle="Hand-roasted spice blends made the traditional way." />
      )}
      {seasonalProducts.length > 0 && (
        <SeasonalSection products={serialize(seasonalProducts)} />
      )}
      {featured.length > 0 && (
        <FeaturedProducts products={serialize(featured)} />
      )}
      <PickleExperience steps={hc.experienceSteps} />
      {videoTestimonials.length > 0 && (
        <VideoTestimonialsSection
          videos={serialize(videoTestimonials)}
          featuredQuote={
            serialize(writtenTestimonials).find((t: any) => t.featured) || null
          }
          instagramUrl={instagramUrl}
        />
      )}
      <SocialGallery images={hc.socialGallery} />
      <FAQSection
        faqs={faqs?.map((f: any) => ({ _id: f._id?.toString(), question: f.question, answer: f.answer }))}
      />
      <FinalCTA
        heading={hc.finalCta?.heading}
        description={hc.finalCta?.description}
        buttonText={hc.finalCta?.buttonText}
        buttonUrl={hc.finalCta?.buttonUrl}
      />
    </StorefrontLayout>
  );
}