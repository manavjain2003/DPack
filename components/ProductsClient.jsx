"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { categories } from "@/lib/products";
import ProductCard from "@/components/ProductCard";

export default function ProductsClient({ products }) {
  const [active, setActive] = useState("All");
  const visible =
    active === "All" ? products : products.filter((p) => p.category === active);

  return (
    <div>
      {/* category filter */}
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

      <motion.div layout className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        <AnimatePresence mode="popLayout">
          {visible.map((p, i) => (
            <ProductCard key={p.slug} product={p} index={i} />
          ))}
        </AnimatePresence>
      </motion.div>

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
