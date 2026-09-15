"use client";

import { useEffect, useRef } from "react";
import { motion, useInView, useMotionValue, useSpring } from "framer-motion";
import { stats } from "@/lib/products";

function Counter({ value, suffix }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  const mv = useMotionValue(0);
  const spring = useSpring(mv, { stiffness: 45, damping: 18 });

  useEffect(() => {
    if (inView) mv.set(value);
  }, [inView, value, mv]);

  useEffect(() => {
    const unsub = spring.on("change", (v) => {
      if (ref.current) ref.current.textContent = `${Math.round(v)}${suffix}`;
    });
    return unsub;
  }, [spring, suffix]);

  return <span ref={ref}>{`0${suffix}`}</span>;
}

export default function Stats() {
  return (
    <section className="bg-[#fef3e2] py-24 sm:py-28">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{
            duration: 0.7,
            ease: [0.22, 1, 0.36, 1],
          }}
          className="
            relative
            overflow-hidden
            rounded-[2.5rem]
            bg-[#fffbf2]
            px-8
            py-16
            shadow-[0_20px_50px_rgba(184,92,0,0.12)]
            sm:px-14
            border
            border-[#f5d98b]
          "
        >
          {/* Top-left amber glow */}
          <div
            className="
              pointer-events-none
              absolute
              -left-20
              -top-24
              h-72
              w-72
              rounded-full
              bg-[#f5a623]/20
              blur-3xl
            "
          />

          {/* Bottom-right terracotta glow */}
          <div
            className="
              pointer-events-none
              absolute
              -bottom-24
              -right-16
              h-72
              w-72
              rounded-full
              bg-[#e05c2a]/12
              blur-3xl
            "
          />

          {/* Eyebrow */}
          <div className="relative mb-12 max-w-2xl">
            <p
              className="
                mb-3
                flex
                items-center
                gap-3
                text-xs
                font-bold
                uppercase
                tracking-[0.28em]
                text-[#b85c00]
              "
            >
              <span className="h-px w-8 bg-[#b85c00]" />
              The catalogue in numbers
            </p>

            <h2
              className="
                font-display
                text-3xl
                font-bold
                tracking-tight
                text-[#1c1008]
                sm:text-4xl
              "
            >
              Specs you can plan your packing line around
            </h2>
          </div>

          {/* Stats */}
          <div className="relative grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
            {stats.map((s, i) => (
              <motion.div
                key={s.label}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{
                  duration: 0.55,
                  delay: i * 0.1,
                }}
                className="border-l-2 border-[#f5a623] pl-6"
              >
                <p className="font-display text-5xl font-bold text-[#1c1008]">
                  <Counter value={s.value} suffix={s.suffix} />
                </p>

                <p className="mt-2 text-sm font-medium text-[#8a5a1a]">
                  {s.label}
                </p>
              </motion.div>
            ))}
          </div>

          {/* Bottom accent bar */}
          <div
            className="
              absolute
              bottom-0
              left-0
              h-[3px]
              w-full
              bg-gradient-to-r
              from-transparent
              via-[#f5a623]
              to-transparent
            "
          />
        </motion.div>
      </div>
    </section>
  );
}