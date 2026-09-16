
"use client";

import Link from "next/link";
import { Heart } from "lucide-react";
import { useAuth } from "@/app/context/AuthContext";

export default function WishlistNavButton({ className = "" }) {
  const { isLoggedIn, wishlistCount, openLogin } = useAuth();

  const baseClassName = `
    relative inline-flex items-center justify-center
    h-10 w-10 rounded-full
    border border-ink/15
    bg-[#f97316] text-white
    transition-all duration-300
    hover:bg-black hover:text-white
    ${className}
  `;

  if (!isLoggedIn) {
    return (
      <button
        type="button"
        onClick={() => openLogin()}
        className={baseClassName}
        aria-label="Wishlist – login required"
      >
        <Heart className="h-5 w-5 transition-transform duration-300 hover:scale-110" />
      </button>
    );
  }

  return (
    <Link
      href="/wishlist"
      className={baseClassName}
      aria-label={`Wishlist, ${wishlistCount} items`}
    >
      <Heart className="h-5 w-5 transition-transform duration-300 hover:scale-110" />

      {wishlistCount > 0 && (
        <span
          className="
            absolute -right-1 -top-1
            flex h-4 min-w-4 items-center justify-center
            rounded-full bg-rust px-1
            text-[10px] font-bold text-white
          "
        >
          {wishlistCount > 99 ? "99+" : wishlistCount}
        </span>
      )}
    </Link>
  );
}
