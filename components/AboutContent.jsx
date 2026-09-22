"use client";

import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

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
    title: "Our Mission",
    text: "To deliver high-performance, eco-friendly packaging solutions that protect products at every stage of transit. We are committed to quality, reliability, and service — helping businesses of all sizes package smarter and ship with confidence.",
    accent: "rust",
    icon: (
      <path
        d="M12 3.5 5 6v5.5c0 4.4 3 7.9 7 9 4-1.1 7-4.6 7-9V6l-7-2.5Z M9 12l2 2 4-4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    ),
  },
  {
    title: "Our Vision",
    text: "To be the most trusted name in protective packaging worldwide — driving the industry forward through continuous innovation, sustainable materials, and solutions that set a new standard for product safety and operational efficiency.",
    accent: "steel",
    icon: (
      <path
        d="M2 12a10 10 0 1 0 20 0 10 10 0 0 0-20 0ZM12 8v4l3 3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    ),
  },
];

const whyChoose = [
  {
    title: "High Strength & Durable Packaging Solutions",
    text: "Our Packaging Air Bags and Dunnage Air Bags are made from high-quality materials, ensuring excellent strength and durability for securing cargo and protecting products during transit.",
    accent: "rust",
    icon: (
      <path
        d="M12 3l7 3v5c0 5-3.5 8.5-7 10-3.5-1.5-7-5-7-10V6l7-3Z"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    ),
  },
  {
    title: "Superior Cushioning with Air Cushion Bags & Air Column Bags",
    text: "Our Air Cushion Bags and Air Column Bags provide exceptional shock absorption, protecting fragile items from impact, vibration, and external pressure.",
    accent: "steel",
    icon: (
      <>
        <circle cx="12" cy="12" r="7.5" />
        <circle cx="12" cy="12" r="3" />
      </>
    ),
  },
  {
    title: "Lightweight & Cost-Efficient Air Packaging",
    text: "All our Packaging Air Bags, including Air Tube Bag Packaging and Air Column Packaging Rolls, are lightweight, helping reduce shipping costs while maintaining strong protective performance.",
    accent: "sage",
    icon: (
      <path d="M12 19V5M5 12l7-7 7 7" strokeLinecap="round" strokeLinejoin="round" />
    ),
  },
  {
    title: "Quick & Easy to Use",
    text: "Our Air Cushion Bags and Air Tube Bag Packaging solutions are designed for quick inflation and easy handling, improving packaging speed and operational efficiency.",
    accent: "rust",
    icon: (
      <path
        d="M13 2 4 14h6l-1 8 9-12h-6l1-8Z"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    ),
  },
  {
    title: "Eco-Friendly & Recyclable Materials",
    text: "Our Packaging Air Bags and Air Column Bags are made using recyclable materials, making them an environmentally responsible choice for modern businesses.",
    accent: "sage",
    icon: (
      <path
        d="M4 20c0-9 6-15 15-15 0 9-6 15-15 15Z M6.5 17.5C10 14 14 10 17.5 6.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    ),
  },
  {
    title: "Wide Range of Applications",
    text: "From Dunnage Air Bags for logistics to Air Column Bags for laptops and electronics, our solutions are suitable for e-commerce, manufacturing, automotive, and fragile product packaging.",
    accent: "steel",
    icon: (
      <>
        <rect x="3" y="3" width="7" height="7" rx="1.5" />
        <rect x="14" y="3" width="7" height="7" rx="1.5" />
        <rect x="3" y="14" width="7" height="7" rx="1.5" />
        <rect x="14" y="14" width="7" height="7" rx="1.5" />
      </>
    ),
  },
];


const accentStyles = {
  rust: {
    cardBg: "bg-[linear-gradient(180deg,_#FFF9EE_0%,_#FDF3E0_28%,_#FBEFE4_55%,_#F3F1EC_100%)]",
    ring: "border-[#C1694F]/25",
    ringHover: "group-hover:border-[#C1694F]/60",
    wash: "from-white/40 via-white/0 to-transparent",
    iconBg: "bg-[#C1694F] text-white",
    valve: "bg-[#C1694F]",
    seam: "border-[#C1694F]/35",
    titleText: "text-[#7A3E2A]",
    bodyText: "text-[#7A3E2A]/70",
  },
  steel: {
    cardBg: "bg-[#F7E7DE]",
    ring: "border-[#3E6C8D]/25",
    ringHover: "group-hover:border-[#3E6C8D]/60",
    wash: "from-white/40 via-white/0 to-transparent",
    iconBg: "bg-[#3E6C8D] text-white",
    valve: "bg-[#3E6C8D]",
    seam: "border-[#3E6C8D]/35",
    titleText: "text-[#1F4258]",
    bodyText: "text-[#1F4258]/70",
  },
  sage: {
    cardBg: "bg-[linear-gradient(180deg,_#FFF9EE_0%,_#FDF3E0_28%,_#FBEFE4_55%,_#F3F1EC_100%)]",
    ring: "border-[#6B8F52]/25",
    ringHover: "group-hover:border-[#6B8F52]/60",
    wash: "from-white/40 via-white/0 to-transparent",
    iconBg: "bg-[#6B8F52] text-white",
    valve: "bg-[#6B8F52]",
    seam: "border-[#6B8F52]/35",
    titleText: "text-[#3F5730]",
    bodyText: "text-[#3F5730]/70",
  },
};

function PillarsSection() {
  const sectionRef = useRef(null);
  const lineRef = useRef(null);
  const cardRefs = useRef([]);
  cardRefs.current = [];

  const addCardRef = (el) => {
    if (el && !cardRefs.current.includes(el)) cardRefs.current.push(el);
  };

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.set(cardRefs.current, {
        opacity: 0,
        y: 46,
        scaleY: 0.82,
        transformOrigin: "bottom center",
      });
      gsap.set(lineRef.current, { scaleX: 0, transformOrigin: "left center" });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 75%",
          toggleActions: "play none none reverse",
        },
      });

      tl.to(lineRef.current, {
        scaleX: 1,
        duration: 0.5,
        ease: "power3.out",
      }).to(
        cardRefs.current,
        {
          opacity: 1,
          y: 0,
          scaleY: 1,
          duration: 0.85,
          ease: "elastic.out(1, 0.65)",
          stagger: 0.16,
        },
        "-=0.15"
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const handleEnter = (el, accent) => {
    gsap.to(el, {
      y: -8,
      boxShadow:
        accent === "rust"
          ? "0 20px 40px -18px rgba(193,105,79,0.35)"
          : "0 20px 40px -18px rgba(62,108,141,0.35)",
      duration: 0.4,
      ease: "power2.out",
    });
  };

  const handleLeave = (el) => {
    gsap.to(el, {
      y: 0,
      boxShadow: "0 1px 2px rgba(0,0,0,0.04)",
      duration: 0.45,
      ease: "power2.out",
    });
  };

  return (
    <section ref={sectionRef} className="relative overflow-hidden bg-cream-dark/60 py-20">
      {/* faint oversized watermark tying section back to the product */}
      <span
        aria-hidden
        className="pointer-events-none absolute -right-16 top-8 select-none font-display text-[220px] font-bold leading-none text-ink/[0.03]"
      >
        01
      </span>

      <div className="relative mx-auto max-w-7xl px-5 sm:px-8">
        <div className="mb-10 flex items-end justify-between gap-6">
          <div>
         <p className="mb-3 flex items-center gap-3 text-xs font-bold uppercase tracking-[0.28em] text-rust">
  <span ref={lineRef} className="h-px w-8 origin-left bg-rust" />
  Mission &amp; Vision
</p>
<h2 className="font-display text-3xl font-bold tracking-tight sm:text-4xl">
  Where we stand and where we're headed
</h2>
          </div>
        </div>

        <div className="grid gap-5 md:grid-cols-2">
          {pillars.map((p) => {
            const a = accentStyles[p.accent];
            return (
              <div
                key={p.title}
                ref={addCardRef}
                onMouseEnter={(e) => handleEnter(e.currentTarget, p.accent)}
                onMouseLeave={(e) => handleLeave(e.currentTarget)}
                className={`group relative overflow-hidden rounded-3xl border p-7 transition-colors duration-300 ${a.cardBg} ${a.ring} ${a.ringHover}`}
                style={{ boxShadow: "0 1px 2px rgba(0,0,0,0.06)" }}
              >
                <div
                  className={`pointer-events-none absolute inset-x-0 top-0 h-24 bg-gradient-to-b ${a.wash}`}
                />

               

                <div
                  className={`relative mb-5 flex h-11 w-11 items-center justify-center rounded-2xl shadow-sm ${a.iconBg}`}
                >
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.6"
                    className="h-5 w-5"
                  >
                    {p.icon}
                  </svg>
                </div>

                <h3 className={`relative font-display text-lg font-bold ${a.titleText}`}>{p.title}</h3>
                <p className={`relative mt-2 text-sm leading-relaxed ${a.bodyText}`}>{p.text}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function WhyChooseSection() {
  const sectionRef = useRef(null);
  const cardRefs = useRef([]);
  cardRefs.current = [];

  const addCardRef = (el) => {
    if (el && !cardRefs.current.includes(el)) cardRefs.current.push(el);
  };

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Distinct from the pillars' inflate: each card is treated like a
      // box flap swinging open — rotated flat on its top edge, then
      // dropping down into place as it individually enters view.
      gsap.set(cardRefs.current, {
        opacity: 0,
        rotateX: -75,
        y: 20,
        transformOrigin: "top center",
        transformPerspective: 700,
      });

      ScrollTrigger.batch(cardRefs.current, {
        start: "top 88%",
        onEnter: (batch) =>
          gsap.to(batch, {
            opacity: 1,
            rotateX: 0,
            y: 0,
            duration: 0.7,
            ease: "power3.out",
            stagger: 0.1,
            overwrite: true,
          }),
        onLeaveBack: (batch) =>
          gsap.to(batch, {
            opacity: 0,
            rotateX: -75,
            y: 20,
            duration: 0.4,
            ease: "power2.in",
            overwrite: true,
          }),
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const handleEnter = (icon) => {
    gsap.to(icon, { rotate: 12, scale: 1.1, duration: 0.35, ease: "back.out(2.5)" });
  };

  const handleLeave = (icon) => {
    gsap.to(icon, { rotate: 0, scale: 1, duration: 0.35, ease: "power2.out" });
  };

  return (
    <section ref={sectionRef} className="py-20">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <div>
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
        </div>

        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3" style={{ perspective: 800 }}>
          {whyChoose.map((w) => {
            const a = accentStyles[w.accent];
            return (
              <div
                key={w.title}
                ref={addCardRef}
                onMouseEnter={(e) => handleEnter(e.currentTarget.querySelector("[data-icon]"))}
                onMouseLeave={(e) => handleLeave(e.currentTarget.querySelector("[data-icon]"))}
                className={`rounded-2xl border p-7 transition-colors duration-300 ${a.cardBg} ${a.ring} ${a.ringHover}`}
              >
                <span className={`mb-5 block h-1 w-10 rounded-full ${a.valve}`} />
                <div
                  data-icon
                  className={`mb-5 flex h-10 w-10 items-center justify-center rounded-xl shadow-sm ${a.iconBg}`}
                >
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.6"
                    className="h-5 w-5"
                  >
                    {w.icon}
                  </svg>
                </div>
                <h3 className={`font-display text-base font-bold ${a.titleText}`}>{w.title}</h3>
                <p className={`mt-2 text-sm leading-relaxed ${a.bodyText}`}>{w.text}</p>
              </div>
            );
          })}
        </div>

        <p className="mt-10 text-center text-sm font-medium text-ink/50">
          Designed for protection, efficiency, and reliability across all
          packaging needs.
        </p>
      </div>
    </section>
  );
}

export default function AboutContent() {
  return (
    <>
      {/* Who we are */}
      <section className="pb-20 pt-8">
        <div className="mx-auto grid max-w-7xl items-center gap-10 px-5 sm:px-8 md:grid-cols-2">
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 30 }}
            whileInView={{ opacity: 1, scale: 1, y: 0 }}
            viewport={{ once: false, margin: "-80px" }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className="overflow-hidden rounded-3xl border border-ink/10 bg-white p-5 shadow-sm lg:h-[460px]"
          >
            <img
              src="https://packingairbag.com/check/bg1.webp"
              alt="Dpack dunnage air bags — packaging solutions"
              className="h-full w-full rounded-2xl object-cover transition-transform duration-500 hover:scale-105"
            />
          </motion.div>
             <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: false, margin: "-80px" }}
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
        </div>
      </section>

      <PillarsSection />

      <WhyChooseSection />
    </>
  );
}