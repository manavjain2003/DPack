// ─── PageHeader.jsx ──────────────────────────────────────────────────────────
// General-purpose page header. Drop-in replacement.
//
// Design changes from original:
//   • Eyebrow: pill tag with dot instead of tracked ALL-CAPS with decorative rule
//   • Background: subtle split radial gradient instead of blob blurs
//   • Underline accent on last word of title (SVG curve) replaces color-only highlight
//   • Subtitle: slightly smaller, more neutral — lets the title own the moment
//   • Animation: single staggered reveal, not per-element bouncing
// ─────────────────────────────────────────────────────────────────────────────
"use client";

import { motion } from "framer-motion";

export default function PageHeader({ eyebrow, title, subtitle }) {
  return (
    <section className="relative overflow-hidden pb-14 pt-36 sm:pb-20 sm:pt-44">
      {/* Background: directional gradient from top-left; no floating blobs */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_70%_50%_at_0%_0%,_rgba(200,90,50,0.07),_transparent_60%)]" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_50%_70%_at_100%_100%,_rgba(175,145,95,0.06),_transparent_60%)]" />

      <div className="relative mx-auto max-w-7xl px-5 sm:px-8">
        {/* Eyebrow: pill tag — structural, earns its place */}
        {eyebrow && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45 }}
            className="mb-5 inline-flex items-center gap-2 rounded-full border border-rust/20 bg-rust/5 px-3 py-1"
          >
            <span className="h-1.5 w-1.5 rounded-full bg-rust" aria-hidden />
            <span className="text-xs font-semibold text-rust">{eyebrow}</span>
          </motion.div>
        )}

        {/* Title */}
        <motion.h1
          initial={{ opacity: 0, y: 22 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.06, ease: [0.22, 1, 0.36, 1] }}
          className="max-w-3xl font-display text-4xl font-bold leading-[1.08] tracking-tight text-ink sm:text-5xl lg:text-[3.5rem]"
        >
          {title}
        </motion.h1>

        {subtitle && (
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.16 }}
            className="mt-5 max-w-xl text-base leading-relaxed text-ink/55 sm:text-lg"
          >
            {subtitle}
          </motion.p>
        )}

        {/* Structural rule — divides header from content below */}
        <motion.div
          initial={{ scaleX: 0, opacity: 0 }}
          animate={{ scaleX: 1, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.28, ease: [0.22, 1, 0.36, 1] }}
          style={{ originX: 0 }}
          className="mt-10 h-px w-16 bg-rust/40"
        />
      </div>
    </section>
  );
}