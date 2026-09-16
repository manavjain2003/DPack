export default function Marquee() {
  const texts = [
    "Best Customer Support",
    "Premium Quality",
    "Fast & Secure Shipping",
    "Trusted by Thousands",
    "100% Satisfaction Guarantee",
    "Expert Craftsmanship",
    "Free Returns",
  ];

  return (
    <section className="relative z-10 -my-4 -rotate-1 bg-black py-4 shadow-card">
      <div className="flex overflow-hidden">
        {[0, 1].map((copy) => (
          <div
            key={copy}
            aria-hidden={copy === 1}
            className="animate-marquee flex shrink-0 items-center"
          >
            {texts.map((t) => (
              <span
                key={t}
                className="mx-7 flex items-center gap-7 whitespace-nowrap text-sm font-bold uppercase tracking-[0.22em] text-cream"
              >
                {t}
                <span className="text-cream/50">✦</span>
              </span>
            ))}
          </div>
        ))}
      </div>
    </section>
  );
}