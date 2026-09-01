import StorefrontLayout from "@/components/layout/StorefrontLayout";

export const metadata = {
  title: "Refund & Cancellation Policy",
  description: "Devi Pickles refund and cancellation policy.",
};

export default function RefundPolicyPage() {
  return (
    <StorefrontLayout>
      <div className="bg-green-dark text-white py-16">
        <div className="container-custom mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-display font-bold">REFUND &amp; CANCELLATION POLICY</h1>
        </div>
      </div>
      <section className="py-16 bg-cream">
        <div className="container-custom mx-auto px-4 sm:px-6 lg:px-8 max-w-3xl">
          <h2 className="font-display text-2xl font-bold mb-4">Cancellation Policy</h2>
          <p className="text-charcoal-light leading-relaxed mb-6">
            Orders can be cancelled before they are dispatched. To request a cancellation, please contact us on WhatsApp with your order number as soon as possible.
          </p>

          <h2 className="font-display text-2xl font-bold mb-4">Refund Policy</h2>
          <p className="text-charcoal-light leading-relaxed mb-6">
            Refunds are provided in the following cases:
          </p>
          <ul className="list-disc ml-5 space-y-2 text-charcoal-light leading-relaxed mb-6">
            <li>Order cancelled before dispatch — full refund</li>
            <li>Payment made for an order that could not be fulfilled — full refund</li>
            <li>Damaged or incorrect items received — replacement or refund upon verification</li>
          </ul>

          <h2 className="font-display text-2xl font-bold mb-4">Refund Process</h2>
          <p className="text-charcoal-light leading-relaxed mb-6">
            Once a refund is approved, the amount will be credited back to the original payment method within 5–10 business days depending on your bank.
          </p>

          <h2 className="font-display text-2xl font-bold mb-4">Contact for Refunds</h2>
          <p className="text-charcoal-light leading-relaxed">
            For any refund or cancellation requests, please contact us on WhatsApp or email with your order number and details.
          </p>
        </div>
      </section>
    </StorefrontLayout>
  );
}
