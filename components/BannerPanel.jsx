"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Package, FileText } from "lucide-react";

const PANELS = [
  {
    id: "products",
    image: "/bg1.webp",
    heading: "Protective Packaging Solutions",
    description: "Air dunnage bags engineered to secure any load — from pallets to heavy machinery.",
    cta: {
      label: "Explore our products",
      href: "/products",
      Icon: Package,
      variant: "light",
    },
    overlay: "bg-gradient-to-t from-black/75 via-black/40 to-black/20",
  },
  {
    id: "bulk",
    image: "/bg2.webp",
    heading: "Bulk Orders Made Simple",
    description: "Custom quantities, fast lead times, and pricing that scales with your packing line.",
    cta: {
      label: "Get a bulk quote",
      href: "/contact",
      Icon: FileText,
      variant: "rust",
    },
    overlay: "bg-gradient-to-t from-black/75 via-black/40 to-black/20",
  },
];

function BannerPanel({ panel, index }) {
  const { image, heading, description, cta, overlay } = panel;

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1], delay: index * 0.1 }}
      className="group relative overflow-hidden rounded-2xl"
      style={{ minHeight: 420 }}
    >
      <img
        src={image}
        alt={heading}
        className="absolute inset-0 h-full w-full object-fill transition-transform duration-700 ease-out group-hover:scale-[1.03]"
      />
      <div className={`pointer-events-none absolute inset-0 ${overlay}`} />

      <div
        className="relative flex h-full flex-col justify-between p-7 sm:p-9"
        style={{ minHeight: 420 }}
      >
        <div className="max-w-[70%] mt-12">
          <motion.h3
            initial={{ opacity: 0, y: -12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: index * 0.1 + 0.15 }}
            className="text-xl font-bold leading-snug text-white sm:text-3xl"
          >
            {heading}
          </motion.h3>

          <motion.p
            initial={{ opacity: 0, y: -8 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: index * 0.1 + 0.25 }}
            className="mt-2 text-sm leading-relaxed text-white/75 sm:text-[18px]"
          >
            {description}
          </motion.p>
        </div>

        <div>
          <Link
            href={cta.href}
            className={`group/btn inline-flex items-center gap-2 rounded-full px-6 py-3 text-[13.5px] font-bold transition-all duration-300 hover:-translate-y-0.5 ${
              cta.variant === "rust"
                ? "bg-rust text-white shadow-[0_6px_20px_rgba(224,92,42,0.4)] hover:shadow-[0_8px_28px_rgba(224,92,42,0.5)]"
                : "bg-white text-ink shadow-[0_6px_20px_rgba(0,0,0,0.18)] hover:shadow-[0_8px_28px_rgba(0,0,0,0.24)]"
            }`}
          >
            <cta.Icon className="h-4 w-4 shrink-0" strokeWidth={2} />
            {cta.label}
            <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover/btn:translate-x-1" />
          </Link>
        </div>
      </div>
    </motion.div>
  );
}

export default function DualBanner() {
  return (
    <section className="mx-auto max-w-8xl px-5 py-14 sm:px-8 sm:py-20">
      <div className="grid gap-4 sm:grid-cols-2 sm:gap-5">
        {PANELS.map((panel, i) => (
          <BannerPanel key={panel.id} panel={panel} index={i} />
        ))}
      </div>
    </section>
  );
}