"use client";

import { motion } from "framer-motion";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import Image from "next/image";

export default function PageHeader({
  eyebrow,
  title,
  subtitle,
  lottieSrc,
  backgroundImage,
  backgroundOpacity = 0.35,
}) {
  return (
    <section className="relative min-h-[520px] overflow-hidden pb-20 pt-44 sm:min-h-[600px] sm:pb-28 sm:pt-52 mt-20">
      {backgroundImage && (
        <>
          <div className="absolute inset-0">
            <Image
              src={backgroundImage}
              alt="contact"
              fill
              priority
              className="object-cover"
              sizes="90vw"
            />
          </div>
          <div
            className="absolute inset-0 bg-cream/80"
            style={{ opacity: backgroundOpacity }}
          />
        </>
      )}

      <div className="pointer-events-none absolute -left-28 top-8 h-80 w-80 rounded-full bg-rust/15 blur-3xl" />
      <div className="pointer-events-none absolute -right-24 bottom-0 h-72 w-72 rounded-full bg-kraft/20 blur-3xl" />

      <div className="pointer-events-none absolute inset-0 bg-grid opacity-40" />

      <div className="relative mx-auto max-w-7xl px-5 sm:px-8">
        <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-2 lg:gap-16">
          <div>
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

          {/* {lottieSrc && (
            <motion.div
              initial={{ opacity: 0, scale: 0.92 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.7, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
              className="relative mx-auto h-[420px] w-full max-w-md sm:h-[500px] lg:h-[560px] lg:max-w-none"
            >
              <DotLottieReact
                src={lottieSrc}
                loop
                autoplay
                className="h-full w-full"
                style={{ width: "100%", height: "100%" }}
              />
            </motion.div>
          )} */}
        </div>
      </div>
    </section>
  );
}