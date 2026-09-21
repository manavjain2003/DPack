import Navbar from "@/components/Navbar";
import PageHeader from "@/components/PageHeader";
import Marquee from "@/components/Marquee";
import CTA from "@/components/CTA";
import Footer from "@/components/Footer";
import FeaturedProducts from "@/components/FeaturedProducts";

export const metadata = {
  title: "About Dpack | Packaging Air Bag Manufacturer & Supplier",
  description:
    "Learn about Dpack, a trusted packaging air bag manufacturer & supplier specializing in air cushion bags, dunnage bags, air column packaging & protective solutions.",
};

const pillars = [
  {
    title: "Our Journey",
    text: "Over the years, D Pack has built a strong reputation as a trusted Packaging Air Bag Manufacturer, Supplier, and Wholesaler. Driven by innovation and consistency, we have expanded our product range from Air Column Packaging Rolls to advanced Air Tube Bag Packaging, serving multiple industries with reliable solutions.",
  },
  {
    title: "Customer Commitment",
    text: "Customer satisfaction is at the core of our business. We work closely with our clients to understand their needs and deliver customized packaging solutions that improve product safety and efficiency. Our commitment to quality and service helps us build long-term relationships.",
  },
  {
    title: "Quality Standards",
    text: "We follow strict quality control processes to ensure every product meets high-performance standards. Our Packaging Air Bags, including Air Cushion Bags, Dunnage Bags, and Air Column Bags, are made using premium materials and advanced technology to ensure durability and reliability.",
  },
];

const whyChoose = [
  {
    title: "High Strength & Durable Packaging Solutions",
    text: "Our Packaging Air Bags and Dunnage Air Bags are made from high-quality materials, ensuring excellent strength and durability for securing cargo and protecting products during transit.",
  },
  {
    title: "Superior Cushioning with Air Cushion Bags & Air Column Bags",
    text: "Our Air Cushion Bags and Air Column Bags provide exceptional shock absorption, protecting fragile items from impact, vibration, and external pressure.",
  },
  {
    title: "Lightweight & Cost-Efficient Air Packaging",
    text: "All our Packaging Air Bags, including Air Tube Bag Packaging and Air Column Packaging Rolls, are lightweight, helping reduce shipping costs while maintaining strong protective performance.",
  },
  {
    title: "Quick & Easy to Use",
    text: "Our Air Cushion Bags and Air Tube Bag Packaging solutions are designed for quick inflation and easy handling, improving packaging speed and operational efficiency.",
  },
  {
    title: "Eco-Friendly & Recyclable Materials",
    text: "Our Packaging Air Bags and Air Column Bags are made using recyclable materials, making them an environmentally responsible choice for modern businesses.",
  },
  {
    title: "Wide Range of Applications",
    text: "From Dunnage Air Bags for logistics to Air Column Bags for laptops and electronics, our solutions are suitable for e-commerce, manufacturing, automotive, and fragile product packaging.",
  },
];

export default function AboutPage() {
  return (
    <main className="overflow-x-clip">
      <Navbar />
      <PageHeader
        eyebrow="About us"
        title="10+ Years of Industry Experience"
        subtitle="From Dpack Solutions to Dpack, backed by 10+ years of experience, we deliver reliable, high-performance packaging solutions that protect, optimize, and add value to your business. We take pride in being a reliable partner for businesses seeking innovative and dependable packaging solutions."
      />

      <section className="pb-20">
        <div className="mx-auto grid max-w-7xl items-center gap-10 px-5 sm:px-8 md:grid-cols-2">
          <div>
            <p className="mb-3 flex items-center gap-3 text-xs font-bold uppercase tracking-[0.28em] text-rust">
              <span className="h-px w-8 bg-rust" />
              Who we are
            </p>
            <h2 className="font-display text-3xl font-bold tracking-tight sm:text-4xl">
              We specialize in high-performance Packaging Air Bags
            </h2>
            <p className="mt-5 leading-relaxed text-ink/60">
              At Dpack, we specialize in manufacturing high-performance
              Packaging Air Bags, including Air Cushion Bags, Dunnage Air Bags,
              and Air Column Bags. Our products are designed to provide maximum
              protection during storage and transit, ensuring the safety of your
              goods at every stage.
            </p>
            <p className="mt-4 leading-relaxed text-ink/60">
              With a strong focus on quality, efficiency, and cost-effectiveness,
              we are committed to delivering solutions that enhance your
              packaging process and support your business growth. At Dpack, your
              trust drives us to continuously innovate and improve.
            </p>
          </div>
          <div className="overflow-hidden rounded-3xl border border-ink/10 bg-white p-5 shadow-sm">
            <img
              src="https://packingairbag.com/check/bg1.webp"
              alt="Dpack dunnage air bags — packaging solutions"
              className="h-full w-full rounded-2xl object-cover transition-transform duration-500 hover:scale-105"
            />
          </div>
        </div>
      </section>

      <section className="bg-cream-dark/60 py-20">
        <div className="mx-auto grid max-w-7xl gap-5 px-5 sm:px-8 md:grid-cols-3">
          {pillars.map((v) => (
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

      <section className="py-20">
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          <p className="mb-3 flex items-center gap-3 text-xs font-bold uppercase tracking-[0.28em] text-rust">
            <span className="h-px w-8 bg-rust" />
            Why choose us
          </p>
          <h2 className="max-w-2xl font-display text-3xl font-bold tracking-tight sm:text-4xl">
            Why Choose D Pack as Your Packaging Air Bag Partner
          </h2>
          <p className="mt-4 max-w-2xl leading-relaxed text-ink/60">
            At D Pack, we are committed to delivering reliable, high-quality
            packaging solutions that meet the evolving needs of modern
            businesses. Our focus on innovation, quality, and customer
            satisfaction make us the preferred choice for protective packaging.
          </p>
          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {whyChoose.map((w) => (
              <div
                key={w.title}
                className="rounded-3xl border border-ink/10 bg-white p-7 shadow-sm transition-shadow duration-300 hover:shadow-card"
              >
                <h3 className="font-display text-base font-bold">{w.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-ink/55">{w.text}</p>
              </div>
            ))}
          </div>
          <p className="mt-10 text-center text-sm font-medium text-ink/50">
            Designed for protection, efficiency, and reliability across all
            packaging needs.
          </p>
        </div>
      </section>

<FeaturedProducts/>
      <Marquee />
      <div className="pt-20" />
      <CTA />
      <Footer />fire
    </main>
  );
}