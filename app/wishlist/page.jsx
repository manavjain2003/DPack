"use client";

import { useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  Heart,
  ShoppingCart,
  Trash2,
  ArrowLeft,
  LogIn,
} from "lucide-react";
import { useAuth } from "@/app/context/AuthContext";
import { addToCart } from "@/lib/cartBus";
import ProductCard from "@/components/ProductCard";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

function formatPrice(price) {
  if (price == null) return null;
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(price);
}

export default function WishlistPage() {
  const {
    user,
    hydrated,
    isLoggedIn,
    wishlist,
    wishlistCount,
    removeWishlistItem,
    openLogin,
  } = useAuth();

  // Optional: scroll to top
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  if (!hydrated) {
    return (
      <div className="mx-auto flex min-h-[50vh] max-w-6xl items-center justify-center px-4 py-16">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-rust border-t-transparent" />
      </div>
    );
  }

  if (!isLoggedIn) {
    return (
      <div className="mx-auto max-w-lg px-4 py-20 text-center">
        <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-rust/10">
          <Heart className="h-7 w-7 text-rust" />
        </div>
        <h1 className="font-display text-2xl font-bold text-ink">
          Your wishlist is waiting
        </h1>
        <p className="mt-2 text-[15px] text-ink/55">
          Login with your mobile number to view and manage saved products.
        </p>
        <button
          type="button"
          onClick={() => openLogin()}
          className="mt-6 inline-flex items-center gap-2 rounded-full bg-rust px-6 py-3 text-[14px] font-bold text-white transition hover:bg-rust/90"
        >
          <LogIn className="h-4 w-4" />
          Login to continue
        </button>
        <div className="mt-8">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-[13px] font-semibold text-ink/50 hover:text-ink"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Back to shop
          </Link>
        </div>
      </div>
    );
  }

  return ( 
    <>
    <Navbar/>
    <main className="min-h-screen bg-cream pt-24 pb-20 sm:pt-28">
      <div className="mx-auto max-w-8xl px-5 sm:px-8">
      {/* Header */}
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
           <Link
            href="/products"
            className="rounded-xl border border-gray-300 bg-white inline-flex items-center gap-1.5 text-sm font-medium text-ink/200 transition-colors hover:text-ink/50 px-4 py-2 mb-4"
          >
            <ArrowLeft className="h-4 w-4" />
            Continue shopping
          </Link>
          <h1 className="font-display text-2xl font-bold text-ink sm:text-3xl">
            Wishlist
          </h1>
          {/* <p className="mt-1 text-[14px] text-ink/50">
            {wishlistCount === 0
              ? "No items saved yet"
              : `${wishlistCount} item${wishlistCount === 1 ? "" : "s"} saved`}
            {user?.mobile && (
              <span className="ml-1.5 text-ink/35">
                · +91 {user.mobile}
              </span>
            )}
          </p> */}
        </div>
      </div>

      {wishlistCount === 0 ? (
        <div className="rounded-2xl border border-dashed border-ink/15 bg-[#F9F7F4] px-6 py-16 text-center">
          <Heart className="mx-auto h-10 w-10 text-ink/20" />
          <p className="mt-4 font-display text-lg font-bold text-ink">
            Nothing here yet
          </p>
          <p className="mt-1 text-[14px] text-ink/50">
            Tap the heart on any product to save it for later.
          </p>
          <Link
            href="/"
            className="mt-6 inline-flex items-center gap-2 rounded-full bg-ink px-5 py-2.5 text-[13px] font-bold text-cream transition hover:bg-ink/90"
          >
            Browse products
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          <AnimatePresence mode="popLayout">
            {wishlist.map((product, index) => (
              <motion.div
                key={product.id}
                layout
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9, y: -8 }}
                transition={{ duration: 0.25 }}
                className="relative"
              >
                <ProductCard product={product} index={index} />

                {/* Quick actions overlay on top-right of card body area */}
                <div className="absolute right-3 top-[13.5rem] z-20 flex gap-1.5 sm:top-[13.25rem]">
                  <button
                    type="button"
                    onClick={() => {
                      addToCart(product);
                    }}
                    title="Add to cart"
                    className="flex h-8 w-8 items-center justify-center rounded-full border border-ink/10 bg-white text-ink shadow-sm transition hover:border-rust/30 hover:text-rust"
                  >
                    <ShoppingCart className="h-3.5 w-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => removeWishlistItem(product.id)}
                    title="Remove from wishlist"
                    className="flex h-8 w-8 items-center justify-center rounded-full border border-ink/10 bg-white text-ink/60 shadow-sm transition hover:border-red-200 hover:text-red-600"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
    </main>
    <Footer/>
    </>
  );
}