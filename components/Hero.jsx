"use client";

import Link from "next/link";
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  AnimatePresence,
} from "framer-motion";
import { ArrowRight, PackageCheck, ShieldCheck, Truck } from "lucide-react";
import { useEffect, useRef, useState } from "react";

const SLIDES = [
  {
    src: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80",
    alt: "Dpack air cushion machine producing inflatable cushions",
    title: "Air Cushion Machine",
    subtitle: "The smart replacement for bubble wrap rolls",
  },
  {
    src: "https://images.unsplash.com/photo-1609709295948-17d77cb2a69b?w=800&q=80",
    alt: "Dpack column air bags protecting fragile products",
    title: "Column Air Bags",
    subtitle: "Inflatable columns that cradle every corner",
  },
  {
    src: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=800&q=80",
    alt: "Dpack paper void-fill system",
    title: "Paper Void Fill",
    subtitle: "Sustainable fill for retail & e-commerce",
  },
];

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12, delayChildren: 0.15 } },
};

const item = {
  hidden: { opacity: 0, y: 28 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] },
  },
};

const slideVariants = {
  enter: { opacity: 0, scale: 0.96 },
  center: { opacity: 1, scale: 1, transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] } },
  exit: { opacity: 0, scale: 1.03, transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] } },
};

export default function Hero() {
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const sx = useSpring(mx, { stiffness: 60, damping: 18 });
  const sy = useSpring(my, { stiffness: 60, damping: 18 });
  const cardX = useTransform(sx, (v) => v * 20);
  const cardY = useTransform(sy, (v) => v * 20);

  const onMove = (e) => {
    const r = e.currentTarget.getBoundingClientRect();
    mx.set((e.clientX - r.left) / r.width - 0.5);
    my.set((e.clientY - r.top) / r.height - 0.5);
  };
  const cardRef = useRef(null);
  const localX = useMotionValue(0.5);
  const localY = useMotionValue(0.5);
  const slx = useSpring(localX, { stiffness: 120, damping: 22 });
  const sly = useSpring(localY, { stiffness: 120, damping: 22 });

  const rotateY = useTransform(slx, [0, 1], [12, -12]);
  const rotateX = useTransform(sly, [0, 1], [-10, 10]);

  const [isHovering, setIsHovering] = useState(false);
  const smoothRotateY = useSpring(isHovering ? rotateY : 0, { stiffness: 120, damping: 22 });
  const smoothRotateX = useSpring(isHovering ? rotateX : 0, { stiffness: 120, damping: 22 });

  const onCardMove = (e) => {
    const r = cardRef.current?.getBoundingClientRect();
    if (!r) return;
    localX.set((e.clientX - r.left) / r.width);
    localY.set((e.clientY - r.top) / r.height);
  };

  const [index, setIndex] = useState(0);
  const timerRef = useRef(null);

  const startTimer = () => {
    clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setIndex((i) => (i + 1) % SLIDES.length);
    }, 2000);
  };

  useEffect(() => {
    startTimer();
    return () => clearInterval(timerRef.current);
  }, []);

  const slide = SLIDES[index];

  return (
    <section
      onMouseMove={onMove}
      className="bg-grid relative overflow-hidden pb-24 pt-32 sm:pt-40"
    >
      <div className="pointer-events-none absolute -left-32 top-10 h-96 w-96 rounded-full bg-rust/15 blur-3xl" />
      <div className="pointer-events-none absolute -right-24 bottom-0 h-[28rem] w-[28rem] rounded-full bg-kraft/20 blur-3xl" />

      <div className="relative mx-auto grid max-w-8xl items-center gap-16 px-5 sm:px-8 lg:grid-cols-[1.05fr_0.95fr]">
        <motion.div variants={container} initial="hidden" animate="show">
         

          <motion.h1
            variants={item}
            className="font-display text-5xl font-bold leading-[1.05] tracking-tight sm:text-6xl lg:text-[4.2rem]"
          >
            We don&apos;t pack it.
            <br />
            <span className="relative inline-block text-rust">
              We offer safety packaging.
              <svg
                className="absolute -bottom-3 left-0 w-full"
                viewBox="0 0 340 14"
                fill="none"
                aria-hidden="true"
              >
                <motion.path
                  d="M4 10 C 70 2, 170 2, 336 8"
                  stroke="#E2591B"
                  strokeWidth="5"
                  strokeLinecap="round"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 1, delay: 1.1 }}
                />
              </svg>
            </span>
          </motion.h1>

          <motion.p
            variants={item}
            className="mt-8 max-w-xl text-lg leading-relaxed text-ink/65"
          >
            Dpackshop.com is the official online store of Dpack — protective
            packaging that safeguards your products across{" "}
            <span className="font-semibold text-ink">
              logistics, warehousing and e-commerce
            </span>
            .
          </motion.p>

          <motion.div variants={item} className="mt-10 flex flex-wrap gap-4">
            <Link
              href="/products"
              className="group inline-flex items-center gap-2 rounded-full bg-rust px-7 py-3.5 font-semibold text-cream shadow-card transition-all duration-300 hover:-translate-y-0.5 hover:bg-rust-dark hover:shadow-lift"
            >
              Browse products
              <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 rounded-full border-2 border-ink/15 px-7 py-3.5 font-semibold text-ink transition-all duration-300 hover:border-ink hover:bg-ink hover:text-cream"
            >
              Get a quote
            </Link>
          </motion.div>

          <motion.div
            variants={item}
            className="mt-12 flex flex-wrap items-center gap-x-8 gap-y-3 text-sm text-ink/55"
          >
            <span className="flex items-center gap-2">
              <PackageCheck className="h-4 w-4 text-rust" />
              14+ product categories
            </span>
            <span className="flex items-center gap-2">
              <Truck className="h-4 w-4 text-rust" />
              Same-day dispatch
            </span>
            <span className="flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-rust" />
              Bulk &amp; custom orders
            </span>
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.94, y: 40 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
          className="relative"
        >
          <motion.div
            ref={cardRef}
            onMouseMove={onCardMove}
            onMouseEnter={() => setIsHovering(true)}
            onMouseLeave={() => {
              setIsHovering(false);
              localX.set(0.5);
              localY.set(0.5);
            }}
            style={{
              x: cardX,
              y: cardY,
              rotateX: smoothRotateX,
              rotateY: smoothRotateY,
              transformPerspective: 900,
              transformStyle: "preserve-3d",
            }}
            className="relative overflow-hidden rounded-[2rem] border border-ink/10 bg-white p-8 shadow-lift sm:p-10"
          >
            <div className="pointer-events-none absolute -right-14 -top-14 h-52 w-52 rounded-full bg-rust/15 blur-3xl" />
            <div className="bg-grid pointer-events-none absolute inset-0 opacity-60" />

            <div className="relative mx-auto h-72 w-full">
              <AnimatePresence mode="sync">
                <motion.img
                  key={slide.src}
                  src={slide.src}
                  alt={slide.alt}
                  variants={slideVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  className="absolute inset-0 mx-auto max-h-72 w-full object-contain"
                />
              </AnimatePresence>
            </div>

            <div className="relative mt-8 flex items-end justify-between">
              <div>
                <AnimatePresence mode="wait">
                  <motion.p
                    key={slide.title}
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    transition={{ duration: 0.3 }}
                    className="font-display text-xl font-bold"
                  >
                    {slide.title}
                  </motion.p>
                </AnimatePresence>
                <AnimatePresence mode="wait">
                  <motion.p
                    key={slide.subtitle}
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    transition={{ duration: 0.3, delay: 0.05 }}
                    className="mt-1 text-sm text-ink/55"
                  >
                    {slide.subtitle}
                  </motion.p>
                </AnimatePresence>

                <div className="mt-3 flex gap-1.5">
                  {SLIDES.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => {
                        setIndex(i);
                        startTimer(); 
                      }}
                      aria-label={`Go to slide ${i + 1}`}
                      className={`h-1.5 rounded-full transition-all duration-300 ${
                        i === index
                          ? "w-5 bg-rust"
                          : "w-1.5 bg-ink/20 hover:bg-ink/40"
                      }`}
                    />
                  ))}
                </div>
              </div>

              <Link
                href="/products"
                className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-ink text-cream transition-colors hover:bg-rust"
                aria-label="View product"
              >
                <ArrowRight className="h-5 w-5" />
              </Link>
            </div>
          </motion.div>

          <motion.div
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
            className="absolute -left-3 top-8 flex items-center gap-2.5 rounded-2xl border border-ink/10 bg-cream px-4 py-3 shadow-card sm:-left-8"
          >
            <span className="grid h-9 w-9 place-items-center rounded-xl bg-rust/10 text-rust">
              <Truck className="h-4 w-4" />
            </span>
            <div className="leading-tight">
              <p className="text-sm font-semibold">Same-day dispatch</p>
              <p className="text-xs text-ink/50">On every order</p>
            </div>
          </motion.div>

          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
            className="absolute -bottom-6 right-2 flex items-center gap-2.5 rounded-2xl border border-ink/10 bg-cream px-4 py-3 shadow-card sm:-right-5"
          >
            <span className="grid h-9 w-9 place-items-center rounded-xl bg-ink/5 text-ink">
              <ShieldCheck className="h-4 w-4" />
            </span>
            <div className="leading-tight">
              <p className="text-sm font-semibold">7 column-bag sizes</p>
              <p className="text-xs text-ink/50">Ready to ship</p>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}