"use client";

import { motion } from "framer-motion";

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0 },
};

const staggerContainer = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.12,
    },
  },
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

export default function AboutContent() {
  return (
    <>
      {/* Who we are */}
      <section className="pb-20">
        <div className="mx-auto grid max-w-7xl items-center gap-10 px-5 sm:px-8 md:grid-cols-2">
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: false, margin: "-80px" }}   // ← changed
          >
            <motion.p
              variants={fadeUp}
              transition={{ duration: 0.5 }}
              className="mb-3 flex items-center gap-3 text-xs font-bold uppercase tracking-[0.28em] text-rust"
            >
              <span className="h-px w-8 bg-rust" />
              Who we are
            </motion.p>

            <motion.h2
              variants={fadeUp}
              transition={{ duration: 0.55 }}
              className="font-display text-3xl font-bold tracking-tight sm:text-4xl"
            >
              We specialize in high-performance Packaging Air Bags
            </motion.h2>

            <motion.p
              variants={fadeUp}
              transition={{ duration: 0.55 }}
              className="mt-5 leading-relaxed text-ink/60"
            >
              At Dpack, we specialize in manufacturing high-performance
              Packaging Air Bags, including Air Cushion Bags, Dunnage Air Bags,
              and Air Column Bags. Our products are designed to provide maximum
              protection during storage and transit, ensuring the safety of your
              goods at every stage.
            </motion.p>

            <motion.p
              variants={fadeUp}
              transition={{ duration: 0.55 }}
              className="mt-4 leading-relaxed text-ink/60"
            >
              With a strong focus on quality, efficiency, and cost-effectiveness,
              we are committed to delivering solutions that enhance your
              packaging process and support your business growth. At Dpack, your
              trust drives us to continuously innovate and improve.
            </motion.p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 30 }}
            whileInView={{ opacity: 1, scale: 1, y: 0 }}
            viewport={{ once: false, margin: "-80px" }}   // ← changed
            transition={{ duration: 0.7, ease: "easeOut" }}
            className="overflow-hidden rounded-3xl border border-ink/10 bg-white p-5 shadow-sm"
          >
            <img
              src="https://packingairbag.com/check/bg1.webp"
              alt="Dpack dunnage air bags — packaging solutions"
              className="h-full w-full rounded-2xl object-cover transition-transform duration-500 hover:scale-105"
            />
          </motion.div>
        </div>
      </section>

      {/* Pillars */}
      <section className="bg-cream-dark/60 py-20">
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: false, margin: "-60px" }}   // ← changed
          className="mx-auto grid max-w-7xl gap-5 px-5 sm:px-8 md:grid-cols-3"
        >
          {pillars.map((v) => (
            <motion.div
              key={v.title}
              variants={fadeUp}
              transition={{ duration: 0.55 }}
              className="rounded-3xl border border-ink/10 bg-white p-7 shadow-sm transition-shadow duration-300 hover:shadow-card"
            >
              <h3 className="font-display text-lg font-bold">{v.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-ink/55">{v.text}</p>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* Why Choose Us */}
      <section className="py-20">
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: false, margin: "-80px" }}   // ← changed
          >
            <motion.p
              variants={fadeUp}
              transition={{ duration: 0.5 }}
              className="mb-3 flex items-center gap-3 text-xs font-bold uppercase tracking-[0.28em] text-rust"
            >
              <span className="h-px w-8 bg-rust" />
              Why choose us
            </motion.p>

            <motion.h2
              variants={fadeUp}
              transition={{ duration: 0.55 }}
              className="max-w-2xl font-display text-3xl font-bold tracking-tight sm:text-4xl"
            >
              Why Choose D Pack as Your Packaging Air Bag Partner
            </motion.h2>

            <motion.p
              variants={fadeUp}
              transition={{ duration: 0.55 }}
              className="mt-4 max-w-2xl leading-relaxed text-ink/60"
            >
              At D Pack, we are committed to delivering reliable, high-quality
              packaging solutions that meet the evolving needs of modern
              businesses. Our focus on innovation, quality, and customer
              satisfaction make us the preferred choice for protective packaging.
            </motion.p>
          </motion.div>

          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: false, margin: "-40px" }}   // ← changed
            className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3"
          >
            {whyChoose.map((w) => (
              <motion.div
                key={w.title}
                variants={fadeUp}
                transition={{ duration: 0.5 }}
                className="rounded-3xl border border-ink/10 bg-white p-7 shadow-sm transition-shadow duration-300 hover:shadow-card"
              >
                <h3 className="font-display text-base font-bold">{w.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-ink/55">{w.text}</p>
              </motion.div>
            ))}
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false }}                    // ← changed
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mt-10 text-center text-sm font-medium text-ink/50"
          >
            Designed for protection, efficiency, and reliability across all
            packaging needs.
          </motion.p>
        </div>
      </section>
    </>
  );
}