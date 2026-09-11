import Navbar from "@/components/Navbar";
import PageHeader from "@/components/PageHeader";
import Marquee from "@/components/Marquee";
import CTA from "@/components/CTA";
import Footer from "@/components/Footer";

export const metadata = {
  title: "About — Dpack | Go Far With Solutions",
  description:
    "Dpackshop.com is the official online store of Dpack — cargo securing and industrial packaging for logistics, warehousing and e-commerce.",
};

const values = [
  {
    title: "One roof, full range",
    text: "Air column bags, gap fillers, air bags, e-commerce pouches, ratchet belts, lashing systems, bubble wrap, buckles, hooks, composite straps, cord straps, dunnage paper, PP bags and packaging tapes — everything in a single shop.",
  },
  {
    title: "Customized & bulk ready",
    text: "Whether you need customized solutions or bulk packaging supplies, Dpackshop scales to your operation without compromising quality.",
  },
  {
    title: "Quality & value",
    text: "Quality and reliability at competitive prices — the standard behind every dispatch that leaves our warehouse.",
  },
];

const gallery = [
  { src: "/images/shredder-inuse.png", alt: "Corrugation shredder producing protective mat" },
  { src: "/images/box-void-fill.png", alt: "Carton lined with shredded cardboard cushioning" },
  { src: "/images/bubble-inuse.png", alt: "Air bubble wrap protecting goods in a carton" },
];

export default function AboutPage() {
  return (
    <main className="overflow-x-clip">
      <Navbar />
      <PageHeader
        eyebrow="About us"
        title="We don't pack it. We offer safety packaging."
        subtitle="Dpackshop.com is the official online store of Dpack, offering a wide range of cargo securing and industrial packaging products tailored to meet the demands of logistics, warehousing, and e-commerce businesses."
      />

      {/* values */}
      <section className="pb-20">
        <div className="mx-auto grid max-w-7xl gap-5 px-5 sm:px-8 md:grid-cols-3">
          {values.map((v) => (
            <div
              key={v.title}
              className="rounded-3xl border border-ink/10 bg-white p-7 shadow-sm transition-shadow duration-300 hover:shadow-card"
            >
              <h3 className="font-display text-lg font-bold">{v.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-ink/55">{v.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* in-action gallery */}
      <section className="bg-cream-dark/60 py-20">
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          <p className="mb-3 flex items-center gap-3 text-xs font-bold uppercase tracking-[0.28em] text-rust">
            <span className="h-px w-8 bg-rust" />
            Protection in action
          </p>
          <h2 className="max-w-2xl font-display text-3xl font-bold tracking-tight sm:text-4xl">
            Safeguarding products on every leg of the journey
          </h2>
          <div className="mt-10 grid gap-5 sm:grid-cols-3">
            {gallery.map((g) => (
              <div
                key={g.src}
                className="group overflow-hidden rounded-3xl border border-ink/10 bg-white p-5 shadow-sm transition-shadow duration-300 hover:shadow-card"
              >
                <img
                  src={g.src}
                  alt={g.alt}
                  className="h-56 w-full object-contain transition-transform duration-500 group-hover:scale-105"
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      <Marquee />
      <div className="pt-20" />
      <CTA />
      <Footer />
    </main>
  );
}
