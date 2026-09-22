"use client";

import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import { motion } from "framer-motion";

export default function PageHeader({ eyebrow, title, subtitle }) {
  return (
    <section className="relative overflow-hidden pb-14 pt-36 sm:pb-20 sm:pt-44">
      
<div className="bg-grid absolute inset-0" />
      
<div
  className="absolute inset-0"
  style={{
    background: "linear-gradient(to right, transparent 85%, white 80%)",
  }}
/>

      <div className="pointer-events-none absolute -left-28 top-8 h-80 w-80 rounded-full bg-rust/15 blur-3xl" />
      <div className="pointer-events-none absolute -right-24 bottom-0 h-72 w-72 rounded-full bg-kraft/20 blur-3xl" />

      <div className="relative mx-auto max-w-7xl px-5 sm:px-8">
        <div className="flex items-center gap-8 lg:gap-16">

          <div className="flex-1 min-w-0">
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
              className="font-display text-4xl font-bold leading-[1.08] tracking-tight sm:text-5xl lg:text-6xl"
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

          <motion.div
            initial={{ opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.12, ease: [0.22, 1, 0.36, 1] }}
            className="hidden shrink-0 md:block"
            style={{ width: "min(40%, 620px)" }}
          >
            <DotLottieReact
              src="/Chat_Walk_cycle.lottie"
              themeId="Light-mode"
              autoplay
              loop
            />
          </motion.div>

        </div>
      </div>
    </section>
  );
}