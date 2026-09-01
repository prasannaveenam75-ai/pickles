import StorefrontLayout from "@/components/layout/StorefrontLayout";

export const metadata = {
  title: "Shipping Policy",
  description: "Devi Pickles shipping policy - delivery charges, timeframes and important information.",
};

export default function ShippingPolicyPage() {
  return (
    <StorefrontLayout>
      <div className="bg-green-dark text-white py-16">
        <div className="container-custom mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-display font-bold">SHIPPING POLICY</h1>
        </div>
      </div>
      <section className="py-16 bg-cream">
        <div className="container-custom mx-auto px-4 sm:px-6 lg:px-8 max-w-3xl prose prose-green">
          <h2 className="font-display text-2xl font-bold mb-4">Delivery Charges</h2>
          <p className="text-charcoal-light leading-relaxed mb-6">
            Delivery charges are calculated based on the total weight of your order at the rate of ₹100 per kg.
          </p>
          <div className="bg-white rounded-xl border border-cream-dark/40 p-6 mb-8">
            <h3 className="font-semibold mb-4">Examples:</h3>
            <ul className="space-y-2 text-charcoal-light">
              <li>• 500g order (0.5kg) — Delivery ₹100</li>
              <li>• 1kg order — Delivery ₹100</li>
              <li>• 1.5kg order — Delivery ₹150</li>
              <li>• 2kg order — Delivery ₹200</li>
            </ul>
          </div>

          <h2 className="font-display text-2xl font-bold mb-4">Delivery Timeframe</h2>
          <p className="text-charcoal-light leading-relaxed mb-6">
            Orders are typically dispatched within 1–2 business days after confirmation and received within 3–7 business days depending on your location.
          </p>

          <h2 className="font-display text-2xl font-bold mb-4">Order Tracking</h2>
          <p className="text-charcoal-light leading-relaxed mb-6">
            Once your order is placed, you can track its status using the Track Order feature with your order number and mobile number.
          </p>

          <h2 className="font-display text-2xl font-bold mb-4">Important Notes</h2>
          <ul className="space-y-3 text-charcoal-light leading-relaxed">
            <li>• Please provide accurate delivery address and contact details.</li>
            <li>• Delivery times may vary based on location and order volume.</li>
            <li>• For any delivery-related concerns, contact us on WhatsApp.</li>
          </ul>
        </div>
      </section>
    </StorefrontLayout>
  );
}
