"use client";

import { useState, useMemo, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import ProductCard from "@/components/ProductCard";

function ProductSkeleton() {
  return (
    <div className="relative flex h-full w-full flex-col overflow-hidden rounded-2xl border border-ink/8 bg-white">
      <div className="h-64 shrink-0 bg-ink/[0.06] animate-pulse" />

      <div className="flex flex-1 flex-col px-5 py-4 gap-3">
        <div className="h-3 w-16 rounded-full bg-ink/[0.07] animate-pulse" />
        <div className="h-4 w-3/4 rounded-full bg-ink/[0.07] animate-pulse" />
        <div className="h-3 w-full rounded-full bg-ink/[0.05] animate-pulse" />
        <div className="h-3 w-2/3 rounded-full bg-ink/[0.05] animate-pulse" />

        <div className="mt-auto">
          <div className="mt-4 h-px w-full bg-ink/6" />
          <div className="flex items-center justify-between pt-3.5">
            <div className="h-6 w-20 rounded-full bg-ink/[0.08] animate-pulse" />
            <div className="h-9 w-28 rounded-full bg-ink/[0.07] animate-pulse" />
          </div>
        </div>
      </div>
    </div>
  );
}

const SKELETON_COUNT = 8;
const PAGE_LIMIT = 8;

export default function OverviewProducts({ products }) {
  const [active, setActive] = useState("All");
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [displayed, setDisplayed] = useState(products);
  const timeoutRef = useRef(null);

  const categories = useMemo(() => {
    const unique = [
      ...new Set(
        (products ?? [])
          .filter(Boolean)
          .map((p) => p?.category)
          .filter(Boolean)
      ),
    ].sort();
    return ["All", ...unique];
  }, [products]);

  const filtered = useMemo(
    () =>
      active === "All"
        ? products
        : (products ?? []).filter((p) => p?.category === active),
    [active, products]
  );

  const sliced = useMemo(() => displayed.filter(Boolean).slice(0, PAGE_LIMIT), [displayed]);
  const hasMore = filtered.filter(Boolean).length > PAGE_LIMIT;

  const handleCategoryChange = (c) => {
    if (c === active) return;
    clearTimeout(timeoutRef.current);

    setActive(c);
    setIsTransitioning(true);

    timeoutRef.current = setTimeout(() => {
      setDisplayed(
        c === "All"
          ? products
          : (products ?? []).filter((p) => p?.category === c)
      );
      setIsTransitioning(false);
    }, 320);
  };

  useEffect(() => {
    if (!isTransitioning) {
      setDisplayed(filtered);
    }
  }, [filtered, isTransitioning]);

  const viewAllHref =
    active === "All" ? "/products" : `/products?category=${encodeURIComponent(active)}`;

  return (
    <div className="m-8">
      <div className="mb-12 flex flex-wrap gap-2.5">
        {categories.map((c) => {
          const isActive = active === c;
          return (
            <button
              key={c}
              onClick={() => handleCategoryChange(c)}
              className={`relative rounded-full px-5 py-2.5 text-sm font-semibold transition-colors duration-300 ${
                isActive ? "text-white" : "text-ink/60 hover:text-ink"
              }`}
            >
              {isActive && (
                <motion.span
                  layoutId="cat-pill"
                  transition={{ type: "spring", stiffness: 350, damping: 30 }}
                  className="absolute inset-0 rounded-full bg-rust"
                />
              )}
              <span className="relative">{c}</span>
            </button>
          );
        })}
      </div>

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <AnimatePresence mode="popLayout">
          {isTransitioning
            ? Array.from({ length: SKELETON_COUNT }).map((_, i) => (
                <motion.div
                  key={`skeleton-${i}`}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.15, delay: i * 0.02 }}
                >
                  <ProductSkeleton />
                </motion.div>
              ))
            : sliced.map((p, i) => (
                <ProductCard key={p.slug} product={p} index={i} />
              ))}
        </AnimatePresence>
      </div>

      {/* View all button — only when this tab has more than 8 products */}
      <AnimatePresence>
        {!isTransitioning && hasMore && (
          <motion.div
            key={`view-all-${active}`}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="mt-10 flex justify-center"
          >
            <Link
              href={viewAllHref}
              className="group inline-flex items-center gap-2 rounded-full border-2 border-rust/30 px-8 py-3.5 text-sm font-semibold text-rust transition-all duration-300 hover:border-rust hover:bg-rust hover:text-white"
            >
              View all {active !== "All" ? active : ""} products
              <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
          </motion.div>
        )}
      </AnimatePresence>

      <p className="mt-12 text-center text-sm text-ink/50">
        Looking for ratchet belts, lashing systems, cord straps, dunnage paper,
        PP bags or packaging tapes?{" "}
        <a
          href={`mailto:${"info@dpacksolutions.com"}`}
          className="font-semibold text-rust underline-offset-4 hover:underline"
        >
          Ask us
        </a>{" "}
        — we&apos;ve got it all under one roof.
      </p>
    </div>
  );
}