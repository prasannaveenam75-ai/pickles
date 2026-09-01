import StorefrontLayout from "@/components/layout/StorefrontLayout";

export const metadata = {
  title: "Privacy Policy",
  description: "Devi Pickles privacy policy - how we collect, use and protect your information.",
};

export default function PrivacyPolicyPage() {
  return (
    <StorefrontLayout>
      <div className="bg-green-dark text-white py-16">
        <div className="container-custom mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-display font-bold">PRIVACY POLICY</h1>
        </div>
      </div>
      <section className="py-16 bg-cream">
        <div className="container-custom mx-auto px-4 sm:px-6 lg:px-8 max-w-3xl">
          <h2 className="font-display text-2xl font-bold mb-4">Introduction</h2>
          <p className="text-charcoal-light leading-relaxed mb-6">
            Devi Pickles is committed to protecting your privacy. This policy explains how we collect, use and safeguard your personal information when you use our website.
          </p>

          <h2 className="font-display text-2xl font-bold mb-4">Information We Collect</h2>
          <p className="text-charcoal-light leading-relaxed mb-6">
            We collect information you provide directly, including your name, mobile number, email address, and delivery address when you place an order or contact us.
          </p>

          <h2 className="font-display text-2xl font-bold mb-4">How We Use Your Information</h2>
          <ul className="list-disc ml-5 space-y-2 text-charcoal-light leading-relaxed mb-6">
            <li>To process and deliver your orders</li>
            <li>To communicate about your orders and inquiries</li>
            <li>To improve our products and services</li>
            <li>To send relevant updates if you opt in</li>
          </ul>

          <h2 className="font-display text-2xl font-bold mb-4">Data Protection</h2>
          <p className="text-charcoal-light leading-relaxed mb-6">
            We use reasonable security measures to protect your personal information. Payment transactions are processed securely through trusted payment gateways with industry-standard encryption.
          </p>

          <h2 className="font-display text-2xl font-bold mb-4">Data Sharing</h2>
          <p className="text-charcoal-light leading-relaxed mb-6">
            We do not sell, trade or share your personal information with third parties except as necessary to process your orders (e.g., payment gateways and delivery partners).
          </p>

          <h2 className="font-display text-2xl font-bold mb-4">Your Rights</h2>
          <p className="text-charcoal-light leading-relaxed mb-6">
            You have the right to request access to, correction of, or deletion of your personal information. Contact us on WhatsApp to exercise these rights.
          </p>
        </div>
      </section>
    </StorefrontLayout>
  );
}
