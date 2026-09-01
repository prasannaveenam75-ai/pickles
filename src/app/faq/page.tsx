import StorefrontLayout from "@/components/layout/StorefrontLayout";
import FAQAccordion from "@/components/ui/FAQAccordion";
import { connectToDatabase } from "@/lib/mongodb";
import { FAQ } from "@/lib/models";

export const revalidate = 300;

export const metadata = {
  title: "FAQ",
  description: "Frequently asked questions about Devi Pickles - weights, delivery, tracking, cancellations and more.",
};

export default async function FAQPage() {
  let faqs: any[] = [];
  try {
    await connectToDatabase();
    faqs = await FAQ.find({ active: true }).sort({ displayOrder: 1 }).lean();
  } catch {
    // fall through to default FAQs
  }

  const defaultFaqs = [
    {
      question: "What weights are available?",
      answer: "Most pickles are available in 500g and 1kg packs. You can select your preferred weight on each product page.",
    },
    {
      question: "How are orders packed?",
      answer: "Orders are hygienically packed to preserve freshness and prevent leakage during delivery.",
    },
    {
      question: "How is delivery calculated?",
      answer: "Delivery is calculated based on total order weight at ₹100 per kg. For example, a 500g order costs ₹100, and a 1.5kg order costs ₹150.",
    },
    {
      question: "How can I track my order?",
      answer: "You can track your order by visiting the Track Order page and entering your order number and mobile number.",
    },
    {
      question: "Do you accept cancellations?",
      answer: "Cancellations are accepted before the order is dispatched. Please contact us on WhatsApp at the earliest.",
    },
    {
      question: "How can I contact you?",
      answer: "You can contact us via WhatsApp, phone or email. Visit our Contact page for details.",
    },
  ];

  const displayFaqs = faqs?.length ? faqs.map((f: any) => ({
    _id: f._id?.toString(),
    question: f.question,
    answer: f.answer,
  })) : defaultFaqs;

  return (
    <StorefrontLayout>
      <section className="bg-green-dark text-white py-16">
        <div className="container-custom mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-display font-bold mb-4">FREQUENTLY ASKED QUESTIONS</h1>
          <p className="text-cream/80 max-w-lg mx-auto">Find answers to common questions about our products and ordering.</p>
        </div>
      </section>

      <section className="py-16 bg-cream">
        <div className="container-custom mx-auto px-4 sm:px-6 lg:px-8 max-w-3xl">
          <FAQAccordion faqs={displayFaqs} />
        </div>
      </section>
    </StorefrontLayout>
  );
}
