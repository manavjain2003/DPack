"use client";

import { useLayoutEffect, useMemo, useRef } from "react";
import { motion } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const defaultFeatures = [
  {
    title: "Built for every angle of impact",
    text: "Independent air columns run the full length of the bag, so cushioning is even whichever side takes the hit — not just the top and bottom.",
  },
  {
    title: "Self-inflating, zero setup",
    text: "One check valve per column means the bag inflates in seconds at the packing station and holds pressure through the entire shipment.",
  },
  {
    title: "Puncture-resistant film",
    text: "Multi-layer nylon film shrugs off sharp edges and rough handling, keeping the cushion intact from warehouse to doorstep.",
  },
  {
    title: "Sized to your product line",
    text: "Available in widths from 120mm to 240mm, so you're not over-packing small items or under-protecting large ones.",
  },
];

const COLUMN_COUNT = 18;
const RADIUS = 120;
const CYLINDER_HEIGHT = 360;

export default function Product360({
  name = "Air Column Rolls",
  eyebrow = "360° view",
  features = defaultFeatures,
}) {
  const sectionRef = useRef(null);
  const ringRef = useRef(null);

  const { columns, films } = useMemo(() => {
    const angleStep = 360 / COLUMN_COUNT;
    const rawWidth = 2 * RADIUS * Math.tan(Math.PI / COLUMN_COUNT);

    const columnWidth = rawWidth * 0.88;

    const filmWidth = rawWidth * 0.28;

    const columns = Array.from({ length: COLUMN_COUNT }).map((_, i) => ({
      id: i,
      width: columnWidth,
      transform: `rotateY(${i * angleStep}deg) translateZ(${RADIUS}px)`,
    }));

    const films = Array.from({ length: COLUMN_COUNT }).map((_, i) => ({
      id: i,
      width: filmWidth,
      transform: `rotateY(${(i + 0.5) * angleStep}deg) translateZ(${RADIUS * 0.97}px)`,
    }));

    return { columns, films };
  }, []);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      gsap.to(ringRef.current, {
        rotateY: 360,
        ease: "none",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: "bottom bottom",
          scrub: 1,
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="bg-cream-dark/60 py-14 sm:py-12">
      <div className="mx-auto grid max-w-8xl px-5 sm:px-8 lg:grid-cols-2">
        <div className="flex h-[60vh] items-center justify-center lg:sticky lg:top-24 lg:h-[75vh]">
          <div
            className="relative flex h-full w-full items-center justify-center"
            style={{ perspective: "1000px" }}
          >
            <div className="absolute h-64 w-64 rounded-full bg-rust/15 blur-3xl" />
            <div className="absolute bottom-[18%] h-8 w-56 rounded-full bg-ink/20 blur-xl" />

            <div
              ref={ringRef}
              className="relative"
              style={{
                width: RADIUS * 2,
                height: CYLINDER_HEIGHT,
                transformStyle: "preserve-3d",
              }}
            >
              {films.map((f) => (
                <div
                  key={`film-${f.id}`}
                  className="absolute left-1/2 top-1/2"
                  style={{
                    width: f.width,
                    height: CYLINDER_HEIGHT,
                    marginLeft: -f.width / 2,
                    marginTop: -CYLINDER_HEIGHT / 2,
                    transform: f.transform,
                    background:
                      "linear-gradient(90deg, rgba(226,232,240,0.45) 0%, rgba(241,245,249,0.7) 45%, rgba(226,232,240,0.4) 100%)",
                    opacity: 0.75,
                    borderLeft: "1px solid rgba(255,255,255,0.35)",
                    borderRight: "1px solid rgba(255,255,255,0.2)",
                    boxShadow: "inset 0 0 12px rgba(255,255,255,0.25)",
                  }}
                />
              ))}

              {columns.map((c) => (
                <div
                  key={`col-${c.id}`}
                  className="absolute left-1/2 top-1/2 rounded-[999px]"
                  style={{
                    width: c.width,
                    height: CYLINDER_HEIGHT,
                    marginLeft: -c.width / 2,
                    marginTop: -CYLINDER_HEIGHT / 2,
                    transform: c.transform,
                    background:
                      "linear-gradient(90deg, rgba(15,23,42,0.12) 0%, rgba(255,255,255,0.85) 20%, rgba(255,255,255,0.35) 45%, rgba(15,23,42,0.05) 75%, rgba(15,23,42,0.16) 100%)",
                    backgroundColor: "#e4eaef",
                    boxShadow: "inset 0 0 16px rgba(15,23,42,0.1)",
                    borderLeft: "1px solid rgba(15,23,42,0.08)",
                    borderRight: "1px solid rgba(15,23,42,0.08)",
                  }}
                />
              ))}

              <div
                className="absolute left-1/2 top-0 rounded-full"
                style={{
                  width: RADIUS * 2 * 0.94,
                  height: RADIUS * 2 * 0.94,
                  marginLeft: -(RADIUS * 0.94),
                  marginTop: -(RADIUS * 0.94),
                  transform: "rotateX(90deg) translateZ(0px)",
                  background:
                    "radial-gradient(circle at 35% 35%, #f8fafc 0%, #cbd5e1 70%, #94a3b8 100%)",
                }}
              />
            </div>

            <span className="absolute bottom-0 rounded-full bg-ink px-4 py-1.5 text-[11px] font-semibold uppercase tracking-wider text-cream">
              Scroll to rotate
            </span>
          </div>
        </div>

        <div className="flex flex-col gap-4 py-8 lg:gap-6 lg:py-8">
          <div>
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.5 }}
              className="mb-3 flex items-center gap-3 text-xs font-bold uppercase tracking-[0.28em] text-rust"
            >
              <span className="h-px w-8 bg-rust" />
              {eyebrow}
            </motion.p>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.6, delay: 0.08 }}
              className="font-display text-4xl font-bold tracking-tight sm:text-5xl"
            >
              {name}
            </motion.h2>
          </div>

          {features.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6 }}
              className="w-full"
            >
              <span className="mb-4 block font-display text-sm font-bold text-rust">
                {String(i + 1).padStart(2, "0")}
              </span>
              <h3 className="font-display text-2xl font-bold leading-snug">
                {f.title}
              </h3>
              <p className="mt-3 leading-relaxed text-ink/60">{f.text}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}