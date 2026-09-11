import { fullRange } from "@/lib/products";

export default function Marquee() {
  return (
    <section className="relative z-10 -my-4 -rotate-1 bg-rust py-4 shadow-card">
      <div className="flex overflow-hidden">
        {[0, 1].map((copy) => (
          <div
            key={copy}
            aria-hidden={copy === 1}
            className="animate-marquee flex shrink-0 items-center"
          >
            {fullRange.map((t) => (
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
