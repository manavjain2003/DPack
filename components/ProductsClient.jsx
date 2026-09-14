"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ProductCard from "@/components/ProductCard";

export default function ProductsClient({ products }) {
  const [active, setActive] = useState("All");

  const categories = useMemo(() => {
    const unique = [...new Set((products ?? []).filter(Boolean).map((p) => p?.category).filter(Boolean))].sort();
    return ["All", ...unique];
  }, [products]);

  const visible = useMemo(
    () =>
      active === "All"
        ? products
       : (products ?? []).filter((p) => p?.category === active),
    [active, products]
  );

  return (
    <div className="m-8">
      <div className="mb-12 flex flex-wrap gap-2.5">
        {categories.map((c) => {
          const isActive = active === c;
          return (
            <button
              key={c}
              onClick={() => setActive(c)}
              className={`relative rounded-full px-5 py-2.5 text-sm font-semibold transition-colors duration-300 ${
                isActive ? "text-cream" : "text-ink/60 hover:text-ink"
              }`}
            >
              {isActive && (
                <motion.span
                  layoutId="cat-pill"
                  transition={{ type: "spring", stiffness: 350, damping: 30 }}
                  className="absolute inset-0 rounded-full bg-ink"
                />
              )}
              <span className="relative">{c}</span>
            </button>
          );
        })}
      </div>

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <AnimatePresence mode="popLayout">
        {visible.filter(Boolean).map((p, i) => (
  <ProductCard key={p.slug} product={p} index={i} />
          ))}
        </AnimatePresence>
      </div>

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