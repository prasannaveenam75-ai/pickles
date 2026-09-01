import Image from "next/image";
import StorefrontLayout from "@/components/layout/StorefrontLayout";
import Link from "next/link";

export const metadata = {
  title: "About Us",
  description: "Learn about Devi Pickles - a brand rooted in traditional Indian pickle-making, committed to authentic homemade taste and quality.",
};

export default function AboutPage() {
  return (
    <StorefrontLayout>
      <section className="bg-green-dark text-white pt-16 pb-20">
        <div className="container-custom mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-6xl font-display font-bold mb-4">OUR STORY</h1>
          <p className="text-cream/80 max-w-2xl mx-auto text-lg">
            Pure. Fresh. Homemade with love.
          </p>
        </div>
      </section>

      <section className="py-20 bg-cream">
        <div className="container-custom mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="relative">
              <div className="aspect-[4/5] rounded-2xl overflow-hidden bg-gradient-to-br from-green-dark to-green">
                <div className="w-full h-full flex items-center justify-center">
                  <span className="text-white/40 font-display text-xl uppercase tracking-widest">
                    Tradition
                  </span>
                </div>
              </div>
            </div>
            <div>
              <h2 className="font-display text-3xl md:text-4xl mb-6">TRADITION IN EVERY JAR</h2>
              <p className="text-charcoal-light text-lg leading-relaxed mb-6">
                At Devi Pickles, every jar carries the warmth of traditional homemade cooking. We believe great food does not need to be complicated — it needs authentic ingredients, time-tested recipes and a whole lot of love.
              </p>
              <p className="text-charcoal-light text-lg leading-relaxed">
                Our pickles are prepared using authentic traditional Indian recipes, passed down through generations. We take pride in delivering the taste of home — pure, fresh and full of flavour.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="container-custom mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="section-title mb-14">OUR PHILOSOPHY</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { title: "AUTHENTIC RECIPES", desc: "Traditional recipes and familiar flavours that remind you of home." },
              { title: "QUALITY INGREDIENTS", desc: "Carefully selected ingredients for the best taste in every jar." },
              { title: "HOMEMADE TASTE", desc: "Prepared with the warmth of traditional cooking methods." },
            ].map((item) => (
              <div key={item.title} className="card p-8 text-center">
                <h3 className="font-display font-bold text-lg mb-3 text-green">{item.title}</h3>
                <p className="text-charcoal-light leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-cream">
        <div className="container-custom mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="section-title mb-14">QUALITY & HYGIENE</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[
              { title: "HYGIENICALLY PREPARED", desc: "Every step of our preparation follows high standards of hygiene. We ensure clean, safe and delicious pickles in every jar." },
              { title: "100% NATURAL", desc: "Our pickles are made using natural ingredients with no artificial colours added." },
            ].map((item) => (
              <div key={item.title} className="bg-white rounded-xl border border-cream-dark/30 p-8">
                <h3 className="font-display font-bold text-lg mb-3 text-green">{item.title}</h3>
                <p className="text-charcoal-light leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="container-custom mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="section-title mb-14">WHAT MAKES US DIFFERENT</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { title: "TRADITIONAL METHODS", desc: "Time-honoured preparation techniques." },
              { title: "FRESH & FLAVOURFUL", desc: "Made to preserve authentic taste." },
              { title: "QUALITY YOU CAN TRUST", desc: "Consistency and care in every product." },
              { title: "PREMIUM HOMEMADE", desc: "Homemade quality with premium standards." },
            ].map((item) => (
              <div key={item.title} className="text-center p-6">
                <div className="w-12 h-12 rounded-full bg-golden/20 flex items-center justify-center text-golden-dark mx-auto mb-4 text-xl">✦</div>
                <h3 className="font-display font-bold mb-2">{item.title}</h3>
                <p className="text-sm text-charcoal-light">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-green-dark text-center">
        <div className="container-custom mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-display font-bold text-white mb-4">READY TO TASTE THE TRADITION?</h2>
          <p className="text-cream/80 mb-8">Bring home the taste of authentic homemade pickles.</p>
          <Link href="/shop" className="btn-golden btn-lg">SHOP NOW</Link>
        </div>
      </section>
    </StorefrontLayout>
  );
}
