import StorefrontLayout from "@/components/layout/StorefrontLayout";
import Hero from "@/components/sections/Hero";
import TrustStrip from "@/components/sections/TrustStrip";
import CategoriesSection from "@/components/sections/CategoriesSection";
import BestSellers from "@/components/sections/BestSellers";
import StorySection from "@/components/sections/StorySection";
import WhyChooseUs from "@/components/sections/WhyChooseUs";
import PickleExperience from "@/components/sections/PickleExperience";
import NonVegSection from "@/components/sections/NonVegSection";
import PowdersSection from "@/components/sections/PowdersSection";
import CustomerReviews from "@/components/sections/CustomerReviews";
import SocialGallery from "@/components/sections/SocialGallery";
import FAQSection from "@/components/sections/FAQSection";
import FinalCTA from "@/components/sections/FinalCTA";
import FeaturedProducts from "@/components/sections/FeaturedProducts";
import { connectToDatabase } from "@/lib/mongodb";
import { Category, Homepage, Product, Review, FAQ } from "@/lib/models";
import { serialize } from "@/lib/utils/serialize";

export const revalidate = 300;

export default async function HomePage() {
  await connectToDatabase();

  const [categories, bestSellers, reviews, faqs, homepageData] = await Promise.all([
    Category.find({ active: true }).sort({ displayOrder: 1 }).lean(),
    Product.find({ active: true, bestSeller: true }).limit(8).lean(),
    Review.find({ published: true }).sort({ createdAt: -1 }).limit(6).lean(),
    FAQ.find({ active: true }).sort({ displayOrder: 1 }).limit(6).lean(),
    Homepage.findOne().lean(),
  ]);

  const hc = serialize((homepageData as Record<string, any>) || {});
  const featuredIds = hc.featuredProducts || [];
  const featured = featuredIds.length
    ? await Product.find({ _id: { $in: featuredIds }, active: true }).lean()
    : [];

  return (
    <StorefrontLayout>
      <Hero
        heading={hc.hero?.heading || "AUTHENTIC TASTE.\nMADE WITH LOVE."}
        subheading={hc.hero?.subheading || "Traditional homemade pickles crafted with care, packed fresh and delivered to your doorstep."}
        image={hc.hero?.image || ""}
        ctaText={hc.hero?.ctaText || "SHOP PICKLES"}
        ctaUrl={hc.hero?.ctaUrl || "/shop"}
      />
      <TrustStrip items={hc.trustItems} />
      <CategoriesSection
        categories={categories?.map((c: any) => ({
          _id: c._id?.toString(),
          name: c.name,
          slug: c.slug,
          description: c.description,
          image: c.image,
        }))}
      />
      <BestSellers products={serialize(bestSellers)} />
      <StorySection
        title={hc.storySection?.title || "TRADITION IN EVERY JAR"}
        text={hc.storySection?.text || "At Devi Pickles, every jar carries the warmth of traditional homemade cooking."}
        image={hc.storySection?.image || ""}
      />
      <WhyChooseUs title={hc.whyChooseUs?.title} items={hc.whyChooseUs?.items} />
      {featured.length > 0 && (
        <FeaturedProducts products={serialize(featured)} />
      )}
      <PickleExperience steps={hc.experienceSteps} />
      <NonVegSection
        heading={hc.nonVegSection?.heading}
        description={hc.nonVegSection?.description}
        image={hc.nonVegSection?.image}
        ctaText={hc.nonVegSection?.ctaText}
        ctaUrl={hc.nonVegSection?.ctaUrl}
      />
      <PowdersSection
        heading={hc.powdersSection?.heading}
        description={hc.powdersSection?.description}
        image={hc.powdersSection?.image}
        ctaText={hc.powdersSection?.ctaText}
        ctaUrl={hc.powdersSection?.ctaUrl}
      />
      <CustomerReviews reviews={serialize(reviews)} />
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
