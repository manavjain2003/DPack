"use client";

import { motion } from "framer-motion";

export default function PageHeader({ eyebrow, title, subtitle }) {
  return (
    <section className="bg-grid relative overflow-hidden pb-14 pt-36 sm:pb-20 sm:pt-44">
      <div className="pointer-events-none absolute -left-28 top-8 h-80 w-80 rounded-full bg-rust/15 blur-3xl" />
      <div className="pointer-events-none absolute -right-24 bottom-0 h-72 w-72 rounded-full bg-kraft/20 blur-3xl" />

      <div className="relative mx-auto max-w-7xl px-5 sm:px-8">
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-4 flex items-center gap-3 text-xs font-bold uppercase tracking-[0.28em] text-rust"
        >
          <span className="h-px w-8 bg-rust" />
          {eyebrow}
        </motion.p>
        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.65, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
          className="max-w-3xl font-display text-4xl font-bold leading-[1.08] tracking-tight sm:text-5xl lg:text-6xl"
        >
          {title}
        </motion.h1>
        {subtitle && (
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.18 }}
            className="mt-6 max-w-2xl text-lg leading-relaxed text-ink/60"
          >
            {subtitle}
          </motion.p>
        )}
      </div>
    </section>
  );
}
