"use client";

import { useEffect, useLayoutEffect, useRef, useState, useCallback } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import ProductCard from "@/components/ProductCard";

gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

function useSlidesPerView() {
  const [perView, setPerView] = useState(4);

  useEffect(() => {
    const update = () => {
      if (window.innerWidth < 640) setPerView(1);
      else if (window.innerWidth < 1024) setPerView(2);
      else setPerView(4);
    };
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  return perView;
}

export default function FeaturedProducts({ products = [] }) {
  const perView = useSlidesPerView();
  const pinRef = useRef(null);
  const containerRef = useRef(null);
  const trackRef = useRef(null);
  const scrollTriggerRef = useRef(null);
  const [index, setIndex] = useState(0);

  const list = (products ?? []).filter(Boolean);
  const maxIndex = Math.max(0, list.length - perView);

  useLayoutEffect(() => {
    if (maxIndex === 0) return;

    const ctx = gsap.context(() => {
      const track = trackRef.current;
      const container = containerRef.current;
      if (!track || !container) return;

      const getDistance = () =>
        Math.max(0, track.scrollWidth - container.offsetWidth);

      const tween = gsap.to(track, {
        x: () => -getDistance(),
        ease: "none",
        scrollTrigger: {
          trigger: pinRef.current,
          start: "top top+=88",
          end: () => `+=${getDistance()}`,
          scrub: 1,
          pin: true,
          pinSpacing: true,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          snap: {
            snapTo: (value) =>
              maxIndex === 0 ? 0 : Math.round(value * maxIndex) / maxIndex,
            duration: 0.4,
            ease: "power2.out",
          },
          onUpdate: (self) => {
            setIndex(Math.round(self.progress * maxIndex));
          },
        },
      });

      scrollTriggerRef.current = tween.scrollTrigger;
    }, pinRef);

    const t = requestAnimationFrame(() => ScrollTrigger.refresh());

    return () => {
      cancelAnimationFrame(t);
      ctx.revert();
      scrollTriggerRef.current = null;
    };
  }, [maxIndex, perView, list.length]);

  const dragStateRef = useRef({
    active: false,
    dragging: false,
    pointerId: null,
    lastX: 0,
  });

  const goTo = (i) => {
    const st = scrollTriggerRef.current;
    if (!st || maxIndex === 0) return;
    const clamped = Math.min(Math.max(i, 0), maxIndex);
    const target = st.start + (clamped / maxIndex) * (st.end - st.start);
    gsap.to(window, {
      scrollTo: { y: target, autoKill: false },
      duration: 0.9,
      ease: "power2.inOut",
    });
  };

  const prev = () => goTo(index - 1);
  const next = () => goTo(index + 1);
  const atStart = index === 0;
  const atEnd = index >= maxIndex;


  const DRAG_THRESHOLD = 6;

  const handlePointerDown = useCallback(
    (e) => {
      if (maxIndex === 0) return;
      if (e.pointerType === "mouse" && e.button !== 0) return;

      const state = dragStateRef.current;
      state.active = true;
      state.dragging = false;
      state.pointerId = e.pointerId;
      state.lastX = e.clientX;
    },
    [maxIndex]
  );

  const handlePointerMove = useCallback((e) => {
    const state = dragStateRef.current;
    if (!state.active || state.pointerId !== e.pointerId) return;

    const delta = e.clientX - state.lastX;

    if (!state.dragging) {
      if (Math.abs(delta) < DRAG_THRESHOLD) return;
      state.dragging = true;
      try {
        e.currentTarget.setPointerCapture(e.pointerId);
      } catch {}
    }

    e.preventDefault();
    state.lastX = e.clientX;

    window.scrollBy({ top: -delta, left: 0, behavior: "auto" });
  }, []);

  const endDrag = useCallback((e) => {
    const state = dragStateRef.current;
    if (state.pointerId !== e.pointerId) return;
    state.active = false;
    state.dragging = false;
    state.pointerId = null;
  }, []);

  return (
    <section className="relative py-16 sm:py-20 lg:py-24 bg-slate-50">
      <div className="mx-auto max-w-8xl px-5 sm:px-8">
        <div className="mb-8 flex flex-wrap items-end justify-between gap-6 sm:mb-10">
          <div className="max-w-xl">
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.5 }}
              className="mb-3 flex items-center gap-3 text-xs font-bold uppercase tracking-[0.28em] text-ink"
            >
              <span className="h-px w-8 bg-rust" />
              Best sellers
            </motion.p>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.6, delay: 0.08 }}
              className="font-display text-3xl font-bold tracking-tight sm:text-4xl"
            >
              Packaging that safeguards your products
            </motion.h2>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="flex items-center gap-3"
          >
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={prev}
                disabled={atStart}
                aria-label="Previous products"
                className="flex h-11 w-11 items-center justify-center rounded-full border-2 border-ink/15 text-ink transition-all duration-300 hover:border-ink hover:bg-ink hover:text-cream disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:border-ink/15 disabled:hover:bg-transparent disabled:hover:text-ink"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={next}
                disabled={atEnd}
                aria-label="Next products"
                className="flex h-11 w-11 items-center justify-center rounded-full border-2 border-ink/15 text-ink transition-all duration-300 hover:border-ink hover:bg-ink hover:text-cream disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:border-ink/15 disabled:hover:bg-transparent disabled:hover:text-ink"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>

            <Link
              href="/products"
              className="group inline-flex items-center gap-2 rounded-full border-2 border-ink/15 px-6 py-3 font-semibold text-ink transition-all duration-300 hover:border-rust-dark hover:bg-rust-dark hover:text-white"
            >
              View all products
              <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
          </motion.div>
        </div>
      </div>

      <div ref={pinRef} className="relative">
        <div
          ref={containerRef}
          className="mx-auto max-w-8xl px-5 pt-8 sm:px-8 sm:pt-10"
        >
          <div className="overflow-hidden">
            <div
              ref={trackRef}
              className="flex items-stretch will-change-transform"
            >
              {list.map((p, i) => (
                <div
                  key={p.slug}
                  className="flex shrink-0 px-2.5"
                  style={{ width: `${100 / perView}%` }}
                >
                  <ProductCard product={p} index={i} />
                </div>
              ))}
            </div>
          </div>

          {maxIndex > 0 && (
            <div className="mt-8 flex justify-center gap-2 sm:mt-10">
              {Array.from({ length: maxIndex + 1 }).map((_, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => goTo(i)}
                  aria-label={`Go to slide ${i + 1}`}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    i === index ? "w-6 bg-rust" : "w-2 bg-ink/15"
                  }`}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}