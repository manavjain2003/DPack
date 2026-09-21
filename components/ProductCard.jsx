"use client";

import { memo, useRef, useState, useCallback } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingCart, Check, Zap, Play, Heart } from "lucide-react";
import { addToCart } from "@/lib/cartBus";
import { useAuth } from "@/app/context/AuthContext";
import { getPrimaryVideo, getYouTubeEmbedUrl } from "@/lib/videoLinks";



function ProductCard({ product, index = 0 }) {
  const [hovered, setHovered] = useState(false);
  const [added, setAdded] = useState(false);
  const [ripples, setRipples] = useState([]);
  const [wishAnim, setWishAnim] = useState(false);
  const btnRef = useRef(null);

  const { isWishlisted, toggleWishlist, isLoggedIn } = useAuth();
  const wishlisted = product?.id ? isWishlisted(product.id) : false;

  if (!product) return null;

  const href = product.slug ? `/products/${product.slug}` : null;
  const outOfStock = product.trackInventory !== false && (product.stock ?? 0) <= 0;

  // Product video is an admin-supplied YouTube and/or Instagram link.
  // YouTube takes priority whenever both are present. Only YouTube can be
  // muted/looped inline via iframe for the hover preview; an Instagram-only
  // link just shows a "Watch on Instagram" hint instead of an inline preview.
  const primaryVideo = getPrimaryVideo(product);
  const hasVideo = Boolean(primaryVideo);
  const hoverEmbedUrl =
    primaryVideo?.type === "youtube"
      ? getYouTubeEmbedUrl(primaryVideo.url, { autoplay: true, muted: true, controls: false })
      : null;

  const handleMouseEnter = useCallback(() => {
    setHovered(true);
  }, []);

  const handleMouseLeave = useCallback(() => {
    setHovered(false);
  }, []);

  const formatPrice = (price) => {
    if (price == null) return null;
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(price);
  };

  const discountPercent =
    product.compareAtPrice && product.compareAtPrice > product.price
      ? Math.round(
          ((product.compareAtPrice - product.price) / product.compareAtPrice) *
            100
        )
      : null;

  const handleAddToCart = useCallback(
    (e) => {
      if (added || outOfStock) return;

      const rect = btnRef.current?.getBoundingClientRect();
      if (rect) {
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const id = Date.now() + Math.random();
        setRipples((prev) => [...prev, { id, x, y }]);
        setTimeout(() => {
          setRipples((prev) => prev.filter((r) => r.id !== id));
        }, 600);
      }

      setAdded(true);
      setTimeout(() => setAdded(false), 2200);
      addToCart(product);
    },
    [added, outOfStock, product]
  );

  const handleWishlist = useCallback(
    (e) => {
      e.preventDefault();
      e.stopPropagation();
      const result = toggleWishlist(product);
      if (result.added) {
        setWishAnim(true);
        setTimeout(() => setWishAnim(false), 500);
      }
    },
    [product, toggleWishlist]
  );

  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.4, delay: Math.min(index % 6, 5) * 0.05 }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className="group relative flex h-full w-full flex-col overflow-hidden rounded-2xl bg-white border border-ink/8 transition-all duration-300 hover:border-ink/20 hover:shadow-[0_16px_40px_-8px_rgba(0,0,0,0.13)]"
    >
      <Link
        href={href ?? "#"}
        aria-label={product.name}
        onClick={(e) => {
          if (!href) e.preventDefault();
        }}
        className="relative block h-64 shrink-0 overflow-hidden bg-[#F5F3EF]"
      >
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_60%_at_50%_50%,rgba(255,255,255,0.85)_0%,rgba(245,243,239,0)_100%)]" />

        <div
          className={`pointer-events-none absolute bottom-[-20px] left-1/2 h-20 w-20 -translate-x-1/2 rounded-full bg-rust/20 blur-2xl transition-opacity duration-500 ${
            hovered ? "opacity-100" : "opacity-0"
          }`}
        />

        <img
          src={product.image}
          alt={product.name}
          loading={index < 3 ? "eager" : "lazy"}
          decoding="async"
          className={`absolute inset-0 m-auto h-full w-full transition-all object-fit duration-500 ${
            outOfStock ? "opacity-60 grayscale-[35%]" : ""
          } ${
            hovered && hoverEmbedUrl
              ? "opacity-0 scale-105"
              : outOfStock
              ? ""
              : "opacity-100 scale-100 group-hover:scale-[1.06]"
          }`}
        />

        {hoverEmbedUrl && hovered && (
          <iframe
            src={hoverEmbedUrl}
            title={`${product.name} video preview`}
            className="pointer-events-none absolute inset-0 h-full w-full scale-[1.35] object-cover opacity-100 transition-opacity duration-400"
            allow="autoplay; encrypted-media"
            frameBorder="0"
          />
        )}

        <div
          className={`absolute inset-0 bg-gradient-to-t from-ink/70 via-transparent to-transparent transition-opacity duration-300 ${
            hovered && hoverEmbedUrl ? "opacity-100" : "opacity-0"
          }`}
        />

        <span className="absolute left-3 top-3 z-10 rounded-full bg-ink px-2.5 py-1 text-[9px] font-bold uppercase tracking-widest text-cream">
          {product?.category}
        </span>

        {outOfStock ? (
          <span className="absolute right-3 top-3 z-10 rounded-full bg-ink/80 px-2.5 py-1 text-[9px] font-bold uppercase tracking-wider text-white">
            Out of stock
          </span>
        ) : (
          discountPercent && (
            <span className="absolute right-3 top-3 z-10 flex items-center gap-1 rounded-full bg-rust px-2.5 py-1 text-[9px] font-bold text-white">
              <Zap className="h-2.5 w-2.5" />
              {discountPercent}% off
            </span>
          )
        )}

        <button
          type="button"
          onClick={handleWishlist}
          aria-label={wishlisted ? "Remove from wishlist" : "Add to wishlist"}
          className={`absolute bottom-3 left-3 z-10 flex h-9 w-9 items-center justify-center rounded-full border transition-all duration-200 ${
            wishlisted
              ? "border-rust/30 bg-rust text-white shadow-[0_4px_14px_-2px_rgba(224,92,42,0.45)]"
              : "border-white/20 bg-black/45 text-white backdrop-blur-md hover:bg-black/60"
          }`}
        >
          <motion.span
            animate={wishAnim ? { scale: [1, 1.35, 1] } : { scale: 1 }}
            transition={{ duration: 0.35 }}
          >
            <Heart
              className={`h-4 w-4 ${wishlisted ? "fill-current" : ""}`}
              strokeWidth={wishlisted ? 0 : 2}
            />
          </motion.span>
        </button>

        <AnimatePresence>
          {hovered && hasVideo && (
            <motion.div
              key="play-hint"
              initial={{ opacity: 0, x: 8 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 6 }}
              transition={{ duration: 0.2 }}
              className="absolute bottom-3 right-3 z-10"
            >
              <div className="flex items-center gap-1.5 rounded-full bg-black/55 px-3 py-1.5 text-[11px] font-semibold text-white backdrop-blur-md border border-white/15 shadow-sm">
                <Play className="h-3 w-3 fill-white" />
                <span>{primaryVideo?.type === "youtube" ? "Product demo" : "Watch on Instagram"}</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </Link>

      <div className="flex flex-1 flex-col px-5 py-4">
        <Link href={href ?? "#"} onClick={(e) => { if (!href) e.preventDefault(); }}>
          <h3 className="font-display text-[20px] font-bold leading-tight text-ink transition-colors hover:text-rust">
            {product.name}
          </h3>

          <p className="mt-1.5 text-[13px] leading-relaxed text-ink/50 line-clamp-2">
            {product.description}
          </p>
        </Link>

        {product.sizes?.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-1">
            {product.sizes.slice(0, 3).map((s) => (
              <span
                key={s}
                className="rounded-md bg-ink/5 px-2 py-0.5 text-[10px] font-semibold text-ink/50"
              >
                {s}
              </span>
            ))}
            {product.sizes.length > 3 && (
              <span className="rounded-md bg-rust/10 px-2 py-0.5 text-[10px] font-semibold text-rust">
                +{product.sizes.length - 3} more
              </span>
            )}
          </div>
        )}



        <div className="mt-auto">
          <div className="mt-4 h-px w-full bg-ink/6" />

          <div className="flex items-center justify-between gap-2 pt-3.5">
            {product.price != null && (
              <div className="flex flex-col leading-none">
                <span className="font-display text-xl font-extrabold tabular-nums text-ink">
                  {formatPrice(product.price)}
                </span>
                {product.compareAtPrice != null &&
                  product.compareAtPrice > product.price && (
                    <span className="mt-0.5 text-[11px] tabular-nums text-ink/35 line-through">
                      {formatPrice(product.compareAtPrice)}
                    </span>
                  )}
              </div>
            )}

            <button
              ref={btnRef}
              type="button"
              onClick={handleAddToCart}
              disabled={outOfStock}
              aria-disabled={outOfStock}
              className={`group/btn relative inline-flex shrink-0 items-center gap-2 overflow-hidden rounded-full px-4 py-2.5 text-[12px] font-bold text-white transition-colors duration-300 active:scale-[0.96] ${
                outOfStock
                  ? "cursor-not-allowed bg-ink/25 hover:bg-ink/25 active:scale-100"
                  : added
                  ? "bg-green-600 hover:bg-green-700"
                  : "bg-rust hover:bg-rust/90 hover:shadow-[0_4px_18px_-2px_rgba(224,92,42,0.45)]"
              }`}
            >
              <AnimatePresence>
                {!outOfStock &&
                  ripples.map((r) => (
                    <motion.span
                      key={r.id}
                      initial={{ scale: 0, opacity: 0.6 }}
                      animate={{ scale: 3.2, opacity: 0 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.55, ease: "easeOut" }}
                      className="pointer-events-none absolute rounded-full bg-white/35"
                      style={{
                        left: r.x,
                        top: r.y,
                        width: 100,
                        height: 100,
                        marginLeft: -50,
                        marginTop: -50,
                      }}
                    />
                  ))}
              </AnimatePresence>

              <AnimatePresence mode="wait" initial={false}>
                {outOfStock ? (
                  <motion.span
                    key="out-of-stock"
                    initial={{ scale: 0.7, opacity: 0, y: 4 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    exit={{ scale: 0.7, opacity: 0, y: -4 }}
                    transition={{ duration: 0.18 }}
                    className="flex items-center gap-1.5"
                  >
                    Out of stock
                  </motion.span>
                ) : added ? (
                  <motion.span
                    key="added"
                    initial={{ scale: 0.7, opacity: 0, y: 4 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    exit={{ scale: 0.7, opacity: 0, y: -4 }}
                    transition={{ duration: 0.18 }}
                    className="flex items-center gap-1.5"
                  >
                    <Check className="h-3.5 w-3.5" strokeWidth={2.5} />
                    Added!
                  </motion.span>
                ) : (
                  <motion.span
                    key="cart"
                    initial={{ scale: 0.7, opacity: 0, y: 4 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    exit={{ scale: 0.7, opacity: 0, y: -4 }}
                    transition={{ duration: 0.18 }}
                    className="flex items-center gap-1.5"
                  >
                    <ShoppingCart className="h-3.5 w-3.5 transition-transform duration-200 group-hover/btn:-translate-y-0.5" />
                    Add to cart
                  </motion.span>
                )}
              </AnimatePresence>
            </button>
          </div>
        </div>
      </div>
    </motion.article>
  );
}

export default memo(ProductCard);