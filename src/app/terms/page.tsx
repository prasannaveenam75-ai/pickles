import StorefrontLayout from "@/components/layout/StorefrontLayout";

export const metadata = {
  title: "Terms & Conditions",
  description: "Devi Pickles terms and conditions for using our website and placing orders.",
};

export default function TermsPage() {
  return (
    <StorefrontLayout>
      <div className="bg-green-dark text-white py-16">
        <div className="container-custom mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-display font-bold">TERMS & CONDITIONS</h1>
        </div>
      </div>
      <section className="py-16 bg-cream">
        <div className="container-custom mx-auto px-4 sm:px-6 lg:px-8 max-w-3xl">
          <h2 className="font-display text-2xl font-bold mb-4">Terms of Use</h2>
          <p className="text-charcoal-light leading-relaxed mb-6">
            By accessing or using the Devi Pickles website, you agree to be bound by these terms and conditions. Please read them carefully before making a purchase.
          </p>

          <h2 className="font-display text-2xl font-bold mb-4">Products & Pricing</h2>
          <p className="text-charcoal-light leading-relaxed mb-6">
            All product prices are listed in Indian Rupees (INR) and are inclusive of applicable taxes. Prices may change without prior notice, but the price at the time of order confirmation will apply.
          </p>

          <h2 className="font-display text-2xl font-bold mb-4">Orders</h2>
          <p className="text-charcoal-light leading-relaxed mb-6">
            All orders are subject to product availability and confirmation. We reserve the right to refuse or cancel any order at our discretion.
          </p>

          <h2 className="font-display text-2xl font-bold mb-4">Payment</h2>
          <p className="text-charcoal-light leading-relaxed mb-6">
            Payments are processed securely through Razorpay or via WhatsApp order. All transactions are encrypted and protected.
          </p>

          <h2 className="font-display text-2xl font-bold mb-4">Intellectual Property</h2>
          <p className="text-charcoal-light leading-relaxed mb-6">
            All content on this website, including text, graphics, logos and images, is the property of Devi Pickles and may not be used without permission.
          </p>

          <h2 className="font-display text-2xl font-bold mb-4">Limitation of Liability</h2>
          <p className="text-charcoal-light leading-relaxed mb-6">
            Devi Pickles shall not be liable for any indirect, incidental, or consequential damages arising from the use of this website or products purchased.
          </p>

          <h2 className="font-display text-2xl font-bold mb-4">Contact</h2>
          <p className="text-charcoal-light leading-relaxed">
            For questions regarding these terms, contact us via WhatsApp or email.
          </p>
        </div>
      </section>
    </StorefrontLayout>
  );
}
