"use client";

import Link from "next/link";
import { Heart } from "lucide-react";
import { useAuth } from "@/app/context/AuthContext";


export default function WishlistNavButton({ className = "" }) {
  const { isLoggedIn, wishlistCount, openLogin } = useAuth();

  if (!isLoggedIn) {
    return (
      <button
        type="button"
        onClick={() => openLogin()}
        className={`relative inline-flex items-center gap-1.5 rounded-full p-2 text-ink/70 transition hover:bg-ink/5 hover:text-ink ${className}`}
        aria-label="Wishlist – login required"
      >
        <Heart className="h-5 w-5" />
      </button>
    );
  }

  return (
    <Link
      href="/wishlist"
      className={`relative inline-flex items-center gap-1.5 rounded-full p-2 text-ink/70 transition hover:bg-ink/5 hover:text-ink ${className}`}
      aria-label={`Wishlist, ${wishlistCount} items`}
    >
      <Heart className="h-5 w-5" />
      {wishlistCount > 0 && (
        <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-rust px-1 text-[10px] font-bold text-white">
          {wishlistCount > 99 ? "99+" : wishlistCount}
        </span>
      )}
    </Link>
  );
}