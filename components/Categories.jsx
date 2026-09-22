"use client";

import Link from "next/link";
import { AnimatePresence, motion, useMotionValue, useTransform, useSpring } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ChevronLeft, ChevronRight, ArrowUpRight } from "lucide-react";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const PALETTE = [
  { tint: "#E2591B", border: "#E2591B" }, // orange
  { tint: "#3B6B99", border: "#3B6B99" }, // blue
  { tint: "#E0A526", border: "#E0A526" }, // yellow / gold
  { tint: "#1A1A1A", border: "#1A1A1A" }, // black
  { tint: "#F2994A", border: "#F2994A" }, // light orange
  { tint: "#5A8FBF", border: "#5A8FBF" }, // light blue
  { tint: "#D4A017", border: "#D4A017" }, // deep yellow
  { tint: "#333333", border: "#333333" }, // soft black
];

const DEFAULT_CATEGORY_IMAGE =
  "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQWmwkYA1Cd0QDokZkak3zDojn7oEPccY0aV89bk8fWvA&s=10";

const FALLBACK_CATEGORIES = [
  { slug: "machines", label: "Machines" },
  { slug: "films-rolls", label: "Films & Rolls" },
  { slug: "void-fill", label: "Void Fill" },
  { slug: "wrap", label: "Wrap" },
  { slug: "securing", label: "Securing" },
  { slug: "boxes", label: "Boxes" },
].map((c, i) => ({
  ...c,
  image: DEFAULT_CATEGORY_IMAGE,
  ...PALETTE[i % PALETTE.length],
}));

function buildSlug(label) {
  return label
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function buildCategories(names, categoryImages = {}) {
  return names
    .filter((n) => n !== "All")
    .map((label, i) => ({
      slug: buildSlug(label),
      label,
      image: categoryImages[label] || DEFAULT_CATEGORY_IMAGE,
      ...PALETTE[i % PALETTE.length],
    }));
}

const PAGE_SIZE = 5;

/* ----------------------------- Category Card ----------------------------- */

function CategoryCircle({ cat, index }) {
  const cardRef = useRef(null);

  // Tilt / magnetic hover tracking
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const rotateX = useSpring(useTransform(my, [-0.5, 0.5], [10, -10]), {
    stiffness: 220,
    damping: 18,
  });
  const rotateY = useSpring(useTransform(mx, [-0.5, 0.5], [-10, 10]), {
    stiffness: 220,
    damping: 18,
  });
  const lift = useSpring(useTransform(my, [-0.5, 0.5], [6, -6]), {
    stiffness: 220,
    damping: 18,
  });

  const handleMove = (e) => {
    const rect = cardRef.current?.getBoundingClientRect();
    if (!rect) return;
    mx.set((e.clientX - rect.left) / rect.width - 0.5);
    my.set((e.clientY - rect.top) / rect.height - 0.5);
  };

  const handleLeave = () => {
    mx.set(0);
    my.set(0);
  };

  return (
    <motion.div
      className="flex flex-col items-center gap-5"
      initial={{ opacity: 0, y: 46 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1], delay: index * 0.05 }}
    >
      <Link
        href={`/categories/${cat.slug}`}
        className="group relative flex flex-col items-center gap-5"
      >
        <div
          ref={cardRef}
          onMouseMove={handleMove}
          onMouseLeave={handleLeave}
          style={{ perspective: 800 }}
          className="relative"
        >
          <motion.div
            style={{ rotateX, rotateY, translateY: lift }}
            className="relative"
          >
            {/* Rotating conic gradient ring */}
            <motion.div
              className="absolute -inset-[6px] rounded-full opacity-70 group-hover:opacity-100"
              style={{
                background: `conic-gradient(from 0deg, ${cat.tint}, transparent 30%, transparent 70%, ${cat.tint})`,
                filter: "blur(0.3px)",
              }}
              animate={{ rotate: 360 }}
              transition={{ duration: 7, repeat: Infinity, ease: "linear" }}
            />

            {/* Static soft base ring */}
            <div
              className="absolute -inset-[6px] rounded-full"
              style={{
                boxShadow: `0 0 0 1px ${cat.tint}22`,
              }}
            />

            {/* Warm white gap */}
            <div
              className="relative rounded-full p-[5px]"
              style={{ background: "#FFFDF9" }}
            >
              <div
                className="relative h-40 w-40 overflow-hidden rounded-full sm:h-44 sm:w-44 transition-transform duration-500 ease-out group-hover:scale-[1.04]"
                style={{ boxShadow: `0 10px 30px -6px ${cat.tint}55` }}
              >
                <img
                  src={cat.image}
                  alt={cat.label}
                  className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                  style={{ display: "block" }}
                />
                <div
                  className="absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                  style={{
                    background: `linear-gradient(180deg, transparent 40%, ${cat.tint}66 100%)`,
                  }}
                />
                {/* Sheen sweep on hover */}
                <motion.div
                  className="pointer-events-none absolute inset-0"
                  initial={{ x: "-120%" }}
                  whileHover={{ x: "120%" }}
                  transition={{ duration: 0.8, ease: "easeInOut" }}
                  style={{
                    background:
                      "linear-gradient(115deg, transparent 40%, rgba(255,255,255,0.35) 50%, transparent 60%)",
                  }}
                />
              </div>

              {/* Arrow badge, appears on hover */}
              <motion.div
                initial={{ scale: 0, opacity: 0 }}
                whileHover={{ scale: 1, opacity: 1 }}
                animate={{ scale: 1, opacity: 1 }}
                className="absolute bottom-1 right-1 flex h-9 w-9 items-center justify-center rounded-full border border-white/60 opacity-0 shadow-md backdrop-blur-sm transition-opacity duration-300 group-hover:opacity-100"
                style={{ background: cat.tint }}
              >
                <ArrowUpRight className="h-4 w-4 text-white" strokeWidth={2.5} />
              </motion.div>
            </div>
          </motion.div>
        </div>

        <span className="max-w-[9.5rem] text-center text-[13.5px] font-semibold leading-tight text-ink/70 transition-colors duration-200 group-hover:text-ink">
          {cat.label}
        </span>

        {/* Underline grows on hover */}
        <span
          className="block h-[2px] w-0 rounded-full transition-all duration-300 ease-out group-hover:w-8"
          style={{ background: cat.tint, marginTop: "-0.75rem" }}
        />
      </Link>
    </motion.div>
  );
}

/* -------------------------------- Arrow Btn -------------------------------- */

function ArrowBtn({ dir, onClick, disabled }) {
  return (
    <motion.button
      onClick={onClick}
      disabled={disabled}
      whileHover={disabled ? {} : { scale: 1.08, y: -1 }}
      whileTap={disabled ? {} : { scale: 0.92 }}
      className="relative flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-ink/15 bg-white shadow-sm transition-colors duration-200 disabled:cursor-not-allowed disabled:opacity-30 hover:border-rust-dark hover:text-rust-dark hover:shadow-md"
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

/* ------------------------------ Section Root ------------------------------ */

export default function CategorySection() {
  const sectionRef = useRef(null);
  const headingRef = useRef(null);
  const lineRef = useRef(null);
  const [page, setPage] = useState(0);
  const [direction, setDirection] = useState(1);
  const [categories, setCategories] = useState(FALLBACK_CATEGORIES);

  useEffect(() => {
    fetch("/api/categories")
      .then((r) => r.json())
      .then((data) => {
        if (data?.categories?.length > 0) {
          setCategories(buildCategories(data.categories, data.categoryImages));
          setPage(0);
        }
      })
      .catch(() => {});
  }, []);

  const totalPages = Math.ceil(categories.length / PAGE_SIZE);
  const canPrev = page > 0;
  const canNext = page < totalPages - 1;

  const goPrev = () => {
    if (!canPrev) return;
    setDirection(-1);
    setPage((p) => p - 1);
  };
  const goNext = () => {
    if (!canNext) return;
    setDirection(1);
    setPage((p) => p + 1);
  };

  const visible = categories.slice(page * PAGE_SIZE, page * PAGE_SIZE + PAGE_SIZE);

  // Heading + underline reveal
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
            scrollTrigger: {
              trigger: lineRef.current,
              start: "top 86%",
              once: true,
            },
          }
        );
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const slideVariants = {
    enter: (dir) => ({ opacity: 0, x: dir > 0 ? 60 : -60 }),
    center: { opacity: 1, x: 0 },
    exit: (dir) => ({ opacity: 0, x: dir > 0 ? -60 : 60 }),
  };

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden pt-24 sm:pt-32"
      style={{
        background:
          "linear-gradient(180deg, #FFF9EE 0%, #FDF3E0 28%, #FBEFE4 55%, #F3F1EC 100%)",
      }}
    >
      {/* Soft dot-grid texture for depth */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.35]"
        style={{
          backgroundImage:
            "radial-gradient(rgba(26,26,26,0.06) 1px, transparent 1px)",
          backgroundSize: "22px 22px",
        }}
      />

      {/* Decorative background blobs — yellow, orange, blue, soft black */}
      <div
        aria-hidden
        className="pointer-events-none absolute -left-24 -top-24 h-80 w-80 rounded-full opacity-[0.35] blur-3xl"
        style={{ background: "#FFD36E" }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/3 -top-10 h-64 w-64 rounded-full opacity-[0.22] blur-3xl"
        style={{ background: "#E2591B" }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-32 -right-24 h-96 w-96 rounded-full opacity-[0.28] blur-3xl"
        style={{ background: "#6EA8DE" }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute bottom-10 left-10 h-48 w-48 rounded-full opacity-[0.08] blur-3xl"
        style={{ background: "#1A1A1A" }}
      />

      <div className="relative mx-auto max-w-8xl">
        <div className="mb-14 flex flex-wrap items-end justify-between gap-6 px-6">
          <div>
            <div className="mb-4 flex items-center gap-3">
              <div ref={lineRef} className="h-px w-10 bg-rust" />
              <span
                className="text-xs font-bold text-ink"
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

          {/* Progress readout */}
          {totalPages > 1 && (
            <div className="flex items-center gap-3 pb-1 text-sm font-medium text-ink/40">
              <span className="text-ink">{String(page + 1).padStart(2, "0")}</span>
              <span className="h-px w-8 bg-ink/20" />
              <span>{String(totalPages).padStart(2, "0")}</span>
            </div>
          )}
        </div>

        <div className="flex items-center gap-4 px-6">
          <div className={totalPages > 1 ? "shrink-0" : "shrink-0 invisible"}>
            <ArrowBtn dir="left" onClick={goPrev} disabled={!canPrev} />
          </div>

          <div className="relative min-w-0 flex-1 overflow-hidden">
            <AnimatePresence mode="wait" custom={direction}>
              <motion.div
                key={page}
                custom={direction}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                drag={totalPages > 1 ? "x" : false}
                dragConstraints={{ left: 0, right: 0 }}
                dragElastic={0.15}
                onDragEnd={(_, info) => {
                  if (info.offset.x < -60) goNext();
                  else if (info.offset.x > 60) goPrev();
                }}
                transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                className="grid grid-cols-2 gap-x-4 gap-y-12 pb-6 pt-6 sm:grid-cols-3 md:grid-cols-5"
              >
                {visible.map((cat, i) => (
                  <div key={cat.slug} className="flex justify-center">
                    <CategoryCircle cat={cat} index={i} />
                  </div>
                ))}
              </motion.div>
            </AnimatePresence>
          </div>

          <div className={totalPages > 1 ? "shrink-0" : "shrink-0 invisible"}>
            <ArrowBtn dir="right" onClick={goNext} disabled={!canNext} />
          </div>
        </div>

        {totalPages > 1 && (
          <div className="mt-8 flex justify-center gap-1.5">
            {Array.from({ length: totalPages }).map((_, i) => (
              <button
                key={i}
                onClick={() => {
                  setDirection(i > page ? 1 : -1);
                  setPage(i);
                }}
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