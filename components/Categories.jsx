"use client";

import Link from "next/link";
import { motion, useMotionValue, useSpring, AnimatePresence } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ChevronLeft, ChevronRight } from "lucide-react";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

// Rotating palette so each category gets a distinct visual style
const PALETTE = [
  { tint: "#E2591B", bg: "#FDF0EA", border: "#F5C4AA" },
  { tint: "#7C6A52", bg: "#F5F0E8", border: "#D4C4A8" },
  { tint: "#4A7C6B", bg: "#EBF3F0", border: "#A8CCBF" },
  { tint: "#3B6B99", bg: "#EAF0F7", border: "#A8C0DA" },
  { tint: "#1A1A1A", bg: "#EFEFEF", border: "#C0C0C0" },
  { tint: "#5A4FCF", bg: "#EEECFB", border: "#B8B3E8" },
  { tint: "#B5452A", bg: "#FBF0EE", border: "#E8B8AE" },
  { tint: "#2D7D52", bg: "#EAF5EF", border: "#A8D4BA" },
];

// Fallback category list shown while API loads
const FALLBACK_CATEGORIES = [
  { slug: "machines", label: "Machines" },
  { slug: "films-rolls", label: "Films & Rolls" },
  { slug: "void-fill", label: "Void Fill" },
  { slug: "wrap", label: "Wrap" },
  { slug: "securing", label: "Securing" },
  { slug: "boxes", label: "Boxes" },
].map((c, i) => ({
  ...c,
  image: "https://images.unsplash.com/photo-1607166452427-7e4477079cb9?auto=format&fit=crop&w=400&q=80",
  ...PALETTE[i % PALETTE.length],
}));

function buildSlug(label) {
  return label.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

function buildCategories(names) {
  return names
    .filter((n) => n !== "All")
    .map((label, i) => ({
      slug: buildSlug(label),
      label,
      image: "https://images.unsplash.com/photo-1607166452427-7e4477079cb9?auto=format&fit=crop&w=400&q=80",
      ...PALETTE[i % PALETTE.length],
    }));
}

const PAGE_SIZE = 6;
const totalPages = Math.ceil(CATEGORIES.length / PAGE_SIZE);

function CategoryCircle({ cat }) {
  const circleRef = useRef(null);
  const rippleRef = useRef(null);
  const imgRef = useRef(null);

  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const sx = useSpring(mx, { stiffness: 200, damping: 22 });
  const sy = useSpring(my, { stiffness: 200, damping: 22 });

  const onMove = (e) => {
    const r = circleRef.current?.getBoundingClientRect();
    if (!r) return;
    mx.set((e.clientX - (r.left + r.width / 2)) * 0.18);
    my.set((e.clientY - (r.top + r.height / 2)) * 0.18);
  };
  const onLeave = () => {
    mx.set(0);
    my.set(0);
  };

  const onEnter = () => {
    gsap.to(".cat-circle-inner", {
      scale: 0.86,
      opacity: 0.4,
      duration: 0.32,
      ease: "power2.out",
      overwrite: "auto",
    });
    gsap.to(circleRef.current?.querySelector(".cat-circle-inner"), {
      scale: 1.07,
      opacity: 1,
      duration: 0.42,
      ease: "back.out(1.5)",
      overwrite: "auto",
    });
    if (rippleRef.current) {
      gsap.fromTo(
        rippleRef.current,
        { scale: 0.9, opacity: 0.65 },
        { scale: 1.18, opacity: 0, duration: 0.6, ease: "power2.out" }
      );
    }
    if (imgRef.current) {
      gsap.to(imgRef.current, {
        y: -8,
        scale: 1.12,
        duration: 0.38,
        ease: "power2.out",
      });
    }
  };

  const onExit = () => {
    gsap.to(".cat-circle-inner", {
      scale: 1,
      opacity: 1,
      duration: 0.42,
      ease: "power3.out",
      overwrite: "auto",
    });
    if (imgRef.current) {
      gsap.to(imgRef.current, {
        y: 0,
        scale: 1,
        duration: 0.38,
        ease: "power2.out",
      });
    }
  };

  return (
    <motion.div
      ref={circleRef}
      className="cat-circle flex flex-col items-center gap-4 cursor-pointer select-none"
      style={{ x: sx, y: sy }}
      onMouseMove={onMove}
      onMouseEnter={onEnter}
      onMouseLeave={() => {
        onLeave();
        onExit();
      }}
    >
      <Link href={`/categories/${cat.slug}`} className="flex flex-col items-center gap-4">
        <div className="relative">
          <div
            className="cat-circle-inner relative flex h-44 w-44 items-center justify-center overflow-hidden rounded-full sm:h-56 sm:w-56"
            style={{
              border: `1.5px solid ${cat.border}`,
              boxShadow: `0 6px 28px 0 ${cat.tint}28, inset 0 1.5px 0 rgba(255,255,255,0.92)`,
            }}
          >
            <img
              ref={imgRef}
              src={cat.image}
              alt={cat.label}
              className="absolute inset-0 z-0 h-full w-full rounded-full object-cover"
              style={{ willChange: "transform" }}
            />

            <div
              ref={rippleRef}
              className="pointer-events-none absolute inset-0 rounded-full"
              style={{ border: `2px solid ${cat.tint}`, opacity: 0 }}
            />

            <div
              className="pointer-events-none absolute inset-0 rounded-full"
              style={{
                background: `radial-gradient(ellipse at 32% 22%, rgba(255,255,255,0.35) 0%, transparent 58%)`,
              }}
            />

            <div
              className="pointer-events-none absolute bottom-0 left-0 right-0 h-14 rounded-b-full"
              style={{
                background: `linear-gradient(to top, ${cat.tint}55, transparent)`,
              }}
            />
          </div>

        </div>

        <span className="max-w-[9rem] text-center text-[13px] font-semibold leading-tight text-ink/70">
          {cat.label}
        </span>
      </Link>
    </motion.div>
  );
}

function ArrowBtn({ dir, onClick, disabled }) {
  return (
    <motion.button
      onClick={onClick}
      disabled={disabled}
      whileHover={disabled ? {} : { scale: 1.08 }}
      whileTap={disabled ? {} : { scale: 0.94 }}
      className="relative flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-ink/15 bg-white shadow-sm transition-colors duration-200 disabled:cursor-not-allowed disabled:opacity-30 hover:border-rust hover:text-rust"
      aria-label={dir === "left" ? "Previous categories" : "Next categories"}
    >
      {dir === "left" ? (
        <ChevronLeft className="h-5 w-5" />
      ) : (
        <ChevronRight className="h-5 w-5" />
      )}
    </motion.button>
  );
}

export default function CategorySection() {
  const sectionRef = useRef(null);
  const headingRef = useRef(null);
  const lineRef = useRef(null);
  const gridRef = useRef(null);
  const [page, setPage] = useState(0);
  const [categories, setCategories] = useState(FALLBACK_CATEGORIES);

  // Fetch real categories from DB on mount
  useEffect(() => {
    fetch("/api/categories")
      .then((r) => r.json())
      .then((data) => {
        if (data?.categories?.length > 0) {
          setCategories(buildCategories(data.categories));
          setPage(0); // reset page when categories change
        }
      })
      .catch(() => {}); // keep fallback on error
  }, []);

  const totalPages = Math.ceil(categories.length / PAGE_SIZE);
  const canPrev = page > 0;
  const canNext = page < totalPages - 1;

  const goPrev = () => canPrev && setPage((p) => p - 1);
  const goNext = () => canNext && setPage((p) => p + 1);

  const visible = categories.slice(page * PAGE_SIZE, page * PAGE_SIZE + PAGE_SIZE);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const heading = headingRef.current;
      if (heading) {
        const text = heading.textContent;
        heading.innerHTML = text
          .split("")
          .map((ch) =>
            ch === " "
              ? `<span style="display:inline-block;width:0.28em">&nbsp;</span>`
              : `<span class="char" style="display:inline-block;opacity:0;transform:translateY(30px)">${ch}</span>`
          )
          .join("");

        ScrollTrigger.create({
          trigger: heading,
          start: "top 84%",
          once: true,
          onEnter: () => {
            gsap.to(heading.querySelectorAll(".char"), {
              opacity: 1,
              y: 0,
              duration: 0.58,
              ease: "power3.out",
              stagger: 0.02,
            });
          },
        });
      }

      if (lineRef.current) {
        gsap.fromTo(
          lineRef.current,
          { scaleX: 0, transformOrigin: "left center" },
          {
            scaleX: 1,
            duration: 0.9,
            ease: "power3.inOut",
            scrollTrigger: { trigger: lineRef.current, start: "top 86%", once: true },
          }
        );
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  useEffect(() => {
    const circles = gridRef.current?.querySelectorAll(".cat-circle");
    if (!circles?.length) return;

    const anim = gsap.fromTo(
      circles,
      { opacity: 0, y: 56, scale: 0.72 },
      {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 0.72,
        ease: "back.out(1.7)",
        stagger: { amount: 0.5, from: "start" },
      }
    );

    return () => anim.kill();
  }, [page]);

  return (
    <section ref={sectionRef} className="overflow-hidden pt-24 sm:pt-32">
      <div className="mx-auto max-w-8xl">
        <div className="mb-14 flex flex-wrap items-end justify-between gap-6 px-6">
          <div>
            <div className="mb-4 flex items-center gap-3">
              <div ref={lineRef} className="h-px w-10 bg-rust" />
              <span
                className="text-xs font-bold text-rust"
                style={{ textTransform: "uppercase", letterSpacing: "0.24em" }}
              >
                Browse by category
              </span>
            </div>
            <h2
              ref={headingRef}
              className="font-display text-4xl font-bold tracking-tight sm:text-5xl"
            >
              Every protection need, covered
            </h2>
          </div>

          {totalPages > 1 && (
            <div className="flex items-center gap-3">
              <ArrowBtn dir="left" onClick={goPrev} disabled={!canPrev} />
              <ArrowBtn dir="right" onClick={goNext} disabled={!canNext} />
            </div>
          )}
        </div>

        <div className="relative overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.div
              key={page}
              ref={gridRef}
              initial={{ opacity: 0, x: 24 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -24 }}
              transition={{ duration: 0.35, ease: "easeOut" }}
              className="grid grid-cols-2 gap-x-4 gap-y-10 pb-6 pt-6 sm:grid-cols-3 sm:gap-4 lg:grid-cols-6"
            >
              {visible.map((cat) => (
                <CategoryCircle key={cat.slug} cat={cat} />
              ))}
            </motion.div>
          </AnimatePresence>
        </div>

        {totalPages > 1 && (
          <div className="mt-6 flex justify-center gap-1.5">
            {Array.from({ length: totalPages }).map((_, i) => (
              <button
                key={i}
                onClick={() => setPage(i)}
                aria-label={`Go to page ${i + 1}`}
                className="h-1.5 rounded-full transition-all duration-300"
                style={{
                  width: i === page ? "1.75rem" : "1.5rem",
                  background: i === page ? "#E2591B" : "rgba(26,26,26,0.2)",
                }}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}