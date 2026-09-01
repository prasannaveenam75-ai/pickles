interface Step {
  number: string;
  title: string;
  description: string;
}

export default function PickleExperience({ steps }: { steps?: Step[] }) {
  const defaultSteps = [
    { number: "01", title: "SELECT", description: "Carefully selected ingredients from trusted sources." },
    { number: "02", title: "PREPARE", description: "Ingredients are cleaned and prepared with care." },
    { number: "03", title: "TRADITION", description: "Traditional recipes and time-tested preparation methods." },
    { number: "04", title: "PACK", description: "Packed carefully to preserve freshness and flavour." },
    { number: "05", title: "DELIVER", description: "Delivered to your doorstep with care." },
  ];
  const chosen = steps?.length ? steps : defaultSteps;

  return (
    <section className="section-padding bg-charcoal-dark text-white">
      <div className="container-custom mx-auto">
        <div className="text-center mb-14">
          <span className="text-golden tracking-[0.3em] text-xs uppercase font-semibold">Our Process</span>
          <h2 className="section-title text-white mt-4">The Pickle Experience</h2>
          <p className="text-gray-300 max-w-xl mx-auto mt-4">How our pickles are made — with patience, tradition and love.</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8">
          {chosen.map((step, index) => (
            <div key={step.number} className="relative text-center">
              {index < chosen.length - 1 && (
                <div className="hidden lg:block absolute top-8 left-[60%] w-[80%] h-px bg-white/10" />
              )}
              <div className="w-16 h-16 rounded-full bg-green/20 text-golden border border-golden/30 flex items-center justify-center font-display font-bold text-lg mx-auto mb-4 relative z-10">
                {step.number}
              </div>
              <h3 className="font-display font-bold text-sm uppercase tracking-wider mb-2">{step.title}</h3>
              <p className="text-gray-400 text-sm leading-relaxed">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
