"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Mail } from "lucide-react";
import { EMAIL } from "@/lib/products";

export default function CTA() {
  return (
    <section className="pb-24 sm:pb-32">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <motion.div
          initial={{ opacity: 0, y: 40, scale: 0.98 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-rust via-rust to-rust-dark px-8 py-16 text-center shadow-lift sm:px-14 sm:py-20"
        >
          <div className="bg-grid-light pointer-events-none absolute inset-0 opacity-60" />
          <div className="pointer-events-none absolute -left-16 -top-20 h-64 w-64 rounded-full bg-cream/15 blur-3xl" />

          <div className="relative">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="mx-auto max-w-3xl font-display text-4xl font-bold tracking-tight text-cream sm:text-5xl"
            >
              Need bulk orders or have queries?
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="mx-auto mt-5 max-w-xl text-lg text-cream/85"
            >
              Reach out to us — customized solutions and bulk packaging
              supplies, dispatched the same day.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="mt-10 flex flex-wrap justify-center gap-4"
            >
              <a
                href={`mailto:${EMAIL}`}
                className="group inline-flex items-center gap-2 rounded-full bg-cream px-8 py-4 font-semibold text-ink transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lift"
              >
                <Mail className="h-4 w-4" />
                {EMAIL}
              </a>
              <Link
                href="/products"
                className="group inline-flex items-center gap-2 rounded-full border-2 border-cream/50 px-8 py-4 font-semibold text-cream transition-all duration-300 hover:border-cream hover:bg-cream/10"
              >
                Browse the catalogue
                <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
              </Link>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
