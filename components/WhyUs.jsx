"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  ArrowRight,
  BadgeCheck,
  PackageCheck,
  Truck,
  Warehouse,
} from "lucide-react";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const features = [
  {
    icon: Truck,
    title: "Same-day dispatch",
    text: "All orders are dispatched on the same day — your packing line never has to wait for supplies.",
  },
  {
    icon: Warehouse,
    title: "Built for logistics & e-commerce",
    text: "Cargo securing and industrial packaging tailored to the demands of logistics, warehousing and e-commerce businesses.",
  },
  {
    icon: PackageCheck,
    title: "Customized & bulk orders",
    text: "Whether you need customized solutions or bulk packaging supplies, we size things to your operation.",
  },
  {
    icon: BadgeCheck,
    title: "Quality at competitive prices",
    text: "Dpackshop delivers quality and reliability at competitive prices — protection without the premium markup.",
  },
];

export default function WhyUs() {
  const sectionRef = useRef(null);
  const stickyRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.to(stickyRef.current, {
        y: -60,
        ease: "none",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top bottom",
          end: "bottom top",
          scrub: 1,
        },
      });

      const icons = gsap.utils.toArray(".whyus-icon");
      icons.forEach((icon, i) => {
        gsap.fromTo(
          icon,
          { scale: 0.4, rotate: -25, opacity: 0 },
          {
            scale: 1,
            rotate: 0,
            opacity: 1,
            duration: 0.6,
            ease: "back.out(2.2)",
            delay: i * 0.05,
            scrollTrigger: {
              trigger: icon,
              start: "top 88%",
              toggleActions: "play none none reverse",
            },
            onComplete: () => {
              gsap.to(icon, {
                y: -6,
                duration: 1.8,
                ease: "sine.inOut",
                yoyo: true,
                repeat: -1,
              });
            },
          }
        );
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="bg-cream-dark/60 py-24 sm:py-32"
    >
      <div className="mx-auto grid max-w-8xl gap-14 px-5 sm:px-8 lg:grid-cols-[0.9fr_1.1fr]">
        <div ref={stickyRef} className="lg:sticky lg:top-32 lg:self-start">
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.5 }}
            className="mb-3 flex items-center gap-3 text-xs font-bold uppercase tracking-[0.28em] text-rust"
          >
            <span className="h-px w-8 bg-rust" />
            Why Dpack
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.6, delay: 0.08 }}
            className="font-display text-4xl font-bold tracking-tight sm:text-5xl"
          >
            One roof. Every packaging problem solved.
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.6, delay: 0.16 }}
            className="mt-6 max-w-md leading-relaxed text-ink/60"
          >
            From air column bags and gap fillers to ratchet belts, composite
            straps and packaging tapes — Dpackshop carries the full cargo
            securing range, so you never juggle multiple vendors.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.6, delay: 0.24 }}
            className="mt-8"
          >
            <Link
              href="/about"
              className="group inline-flex items-center gap-2 rounded-full bg-rust px-7 py-3.5 font-semibold text-cream shadow-card transition-all duration-300 hover:-translate-y-0.5 hover:bg-rust-dark"
            >
              More about us
              <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
          </motion.div>
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.55, delay: i * 0.08 }}
              whileHover={{ y: -6 }}
              className={`rounded-3xl border border-ink/10 bg-cream p-7 shadow-sm transition-shadow duration-300 hover:shadow-card ${
                i % 2 === 1 ? "sm:translate-y-8" : ""
              }`}
            >
              <span className="whyus-icon mb-5 grid h-12 w-12 place-items-center rounded-2xl bg-ink text-cream">
                <f.icon className="h-6 w-6" strokeWidth={1.8} />
              </span>
              <h3 className="font-display text-lg font-bold">{f.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-ink/55">
                {f.text}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}