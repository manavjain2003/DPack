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
    <section
      className="py-24 sm:py-28"
      style={{
        background: "linear-gradient(135deg, #fff4d6 0%, #ffe8b0 40%, #ffd98a 100%)",
      }}
    >
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
            bg-[#0d2461]
            px-8
            py-16
            shadow-[0_20px_60px_rgba(160,80,0,0.22)]
            sm:px-14
            border
            border-[#3a2e1e]
          "
        >
          <div
            className="
              pointer-events-none
              absolute
              -left-24
              -top-28
              h-80
              w-80
              rounded-full
              bg-[#e8a830]/18
              blur-3xl
            "
          />

          <div
            className="
              pointer-events-none
              absolute
              -bottom-28
              -right-20
              h-80
              w-80
              rounded-full
              bg-[#c86428]/14
              blur-3xl
            "
          />

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
                text-[#e8a830]
              "
            >
              <span className="h-px w-8 bg-[#e8a830]" />
              The catalogue in numbers
            </p>

            <h2
              className="
                font-display
                text-3xl
                font-bold
                tracking-tight
                text-[#f5ede0]
                sm:text-4xl
              "
            >
              Specs you can plan your packing line around
            </h2>
          </div>

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
                className="border-l-2 border-[#e8a830] pl-6"
              >
                <p className="font-display text-5xl font-bold text-white">
                  <Counter value={s.value} suffix={s.suffix} />
                </p>

                <p className="mt-2 text-sm font-medium text-[#a08060]">
                  {s.label}
                </p>
              </motion.div>
            ))}
          </div>

          <div
            className="
              absolute
              bottom-0
              left-0
              h-[3px]
              w-full
              bg-gradient-to-r
              from-transparent
              via-[#e8a830]
              to-transparent
            "
          />
        </motion.div>
      </div>
    </section>
  );
}