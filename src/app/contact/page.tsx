"use client";

import { useState } from "react";
import StorefrontLayout from "@/components/layout/StorefrontLayout";
import { Phone, Mail, MapPin, MessageCircle, Send, CheckCircle2 } from "lucide-react";

export default function ContactPage() {
  const [form, setForm] = useState({ name: "", phone: "", email: "", message: "" });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  const whatsappNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "919999999999";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.phone || !form.message) {
      setError("Please fill in name, phone and message");
      return;
    }
    setSubmitting(true);
    setError("");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (data.success) {
        setSubmitted(true);
        setForm({ name: "", phone: "", email: "", message: "" });
      } else {
        setError(data.message || "Failed to send message");
      }
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <StorefrontLayout>
      <section className="bg-green-dark text-white py-16">
        <div className="container-custom mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-display font-bold mb-4">GET IN TOUCH</h1>
          <p className="text-cream/80 max-w-lg mx-auto">Have a question, feedback or a special request? We'd love to hear from you.</p>
        </div>
      </section>

      <section className="py-16 bg-cream">
        <div className="container-custom mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div>
              <h2 className="font-display text-2xl font-bold mb-8">Contact Information</h2>
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-green/10 flex items-center justify-center text-green flex-shrink-0">
                    <MessageCircle className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">WhatsApp</h3>
                    <a href={`https://wa.me/${whatsappNumber}`} className="text-green hover:text-green-light">
                      Chat with us
                    </a>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-green/10 flex items-center justify-center text-green flex-shrink-0">
                    <Phone className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">Phone</h3>
                    <p className="text-charcoal-light">Contact us on WhatsApp for the fastest response</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-green/10 flex items-center justify-center text-green flex-shrink-0">
                    <Mail className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">Email</h3>
                    <p className="text-charcoal-light">support@devipickles.com</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-green/10 flex items-center justify-center text-green flex-shrink-0">
                    <MapPin className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">Business</h3>
                    <p className="text-charcoal-light">Devi Pickles<br />FSSAI Lic. No. 20126122000228</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-cream-dark/40 p-8">
              <h2 className="font-display text-2xl font-bold mb-6">Send us a message</h2>
              {submitted ? (
                <div className="text-center py-10">
                  <CheckCircle2 className="w-16 h-16 text-green mx-auto mb-4" />
                  <p className="font-semibold text-lg text-charcoal-dark mb-2">Message sent successfully!</p>
                  <p className="text-charcoal-light">Thank you for reaching out. We'll get back to you soon.</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  {error && (
                    <div className="bg-red/10 border border-red/30 text-red rounded-lg p-3 text-sm">{error}</div>
                  )}
                  <div>
                    <label className="block text-sm font-medium mb-1.5">Name *</label>
                    <input
                      type="text"
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      className="input-field"
                      placeholder="Your name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1.5">Phone *</label>
                    <input
                      type="tel"
                      value={form.phone}
                      onChange={(e) => setForm({ ...form, phone: e.target.value })}
                      className="input-field"
                      placeholder="Your phone number"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1.5">Email</label>
                    <input
                      type="email"
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      className="input-field"
                      placeholder="Your email (optional)"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1.5">Message *</label>
                    <textarea
                      value={form.message}
                      onChange={(e) => setForm({ ...form, message: e.target.value })}
                      className="input-field min-h-[120px]"
                      placeholder="How can we help?"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="btn-primary w-full justify-center disabled:opacity-60"
                  >
                    {submitting ? "Sending..." : (<><Send className="w-4 h-4 mr-2" /> Send Message</>)}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>
    </StorefrontLayout>
  );
}
