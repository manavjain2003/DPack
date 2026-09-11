"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Search, User, ShoppingCart } from "lucide-react";
import { useCart } from "@/lib/cartBus";

const links = [
  { href: "/", label: "Home" },
  { href: "/products", label: "Products" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
const cartItems = useCart();
const cartCount = cartItems.reduce((n, i) => n + i.qty, 0);
  const [cartPulse, setCartPulse] = useState(0); 
  const pathname = usePathname();
 const [CartCount , setCartCount ] = useState()
  useEffect(() => {
    const onAdded = () => {
      setCartCount((c) => c + 1);
      setCartPulse((p) => p + 1);
    };
    window.addEventListener("cart:added", onAdded);
    return () => window.removeEventListener("cart:added", onAdded);
  }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close mobile menu whenever route changes
  useEffect(() => setOpen(false), [pathname]);

  return (
    <motion.header
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{
        duration: 0.6,
        ease: [0.22, 1, 0.36, 1],
      }}
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        scrolled || open
          ? "border-b border-ink/10 bg-cream/85 shadow-sm backdrop-blur-xl"
          : "bg-transparent"
      }`}
    >
      <nav className="mx-auto flex max-w-8xl items-center px-5 py-4 sm:px-8">
        {/* Logo — left */}
        <div className="flex flex-1 items-center">
          <Link href="/" className="group flex items-center gap-3">
            <img
              src="https://packingairbag.com/_next/image?url=%2Flogo.png&w=256&q=75"
              width={120}
              alt="Packing Airbag"
            />
          </Link>
        </div>

        {/* Desktop Navigation — center */}
        <ul className="hidden items-center gap-8 md:flex">
          {links.map((l) => {
            const active = pathname === l.href;
            return (
              <li key={l.href}>
                <Link
                  href={l.href}
                  className={`relative text-sm font-medium transition-colors
                    after:absolute after:-bottom-1 after:left-0
                    after:h-[2px] after:bg-rust
                    after:transition-all after:duration-300
                    ${
                      active
                        ? "text-ink after:w-full"
                        : "text-ink/70 hover:text-ink after:w-0 hover:after:w-full"
                    }
                  `}
                >
                  {l.label}
                </Link>
              </li>
            );
          })}
        </ul>

        {/* Icons + mobile button — always right */}
        <div className="flex flex-1 items-center justify-end gap-1 sm:gap-2">
          {/* Desktop Icons */}
          <div className="hidden items-center gap-1 sm:gap-2 md:flex">
            {/* Search */}
            <Link
              href="/search"
              aria-label="Search"
              className="group grid h-10 w-10 place-items-center rounded-full
                         text-ink/70 transition-all duration-300
                         hover:bg-ink hover:text-cream"
            >
              <Search
                className="h-5 w-5 transition-transform duration-300
                           group-hover:scale-110"
              />
            </Link>

            {/* User */}
            <Link
              href="/account"
              aria-label="Account"
              className="group grid h-10 w-10 place-items-center rounded-full
                         text-ink/70 transition-all duration-300
                         hover:bg-ink hover:text-cream"
            >
              <User
                className="h-5 w-5 transition-transform duration-300
                           group-hover:scale-110"
              />
            </Link>

            {/* Cart */}
            <Link
              href="/cart"
              aria-label="Shopping Cart"
              className="group relative grid h-10 w-10 place-items-center
                         rounded-full text-ink/70 transition-all duration-300
                         hover:bg-rust hover:text-cream"
            >
              <motion.span
                key={cartPulse}
                animate={
                  cartPulse > 0 && {
                    scale: [1, 1.45, 0.85, 1.12, 1],
                    rotate: [0, -14, 10, 0],
                    y: [0, -5, 0],
                  }
                }
                transition={{ duration: 0.6, ease: "easeOut" }}
                className="grid place-items-center"
              >
                <ShoppingCart
                  className="h-5 w-5 transition-transform duration-300
                             group-hover:scale-110"
                />
              </motion.span>

             <AnimatePresence>
               {cartCount > 0 && (
                  <motion.span
                    key={cartCount}
                    initial={{ scale: 0.3, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.3, opacity: 0 }}
                    transition={{ type: "spring", stiffness: 500, damping: 22 }}
                    className="absolute -right-1 -top-1 grid h-4 w-4
                               place-items-center rounded-full bg-rust
                               text-[10px] font-bold text-white"
                  >
                    {cartCount}
                  </motion.span>
                )}
             </AnimatePresence>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setOpen((v) => !v)}
            className="grid h-10 w-10 place-items-center rounded-xl
                       border border-ink/10 md:hidden"
            aria-label="Toggle menu"
          >
            {open ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{
              duration: 0.35,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="overflow-hidden md:hidden"
          >
            <ul className="space-y-1 px-5 py-4">
              {links.map((l) => (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    className={`block rounded-xl px-4 py-3
                                font-display text-lg font-semibold
                                transition-colors ${
                      pathname === l.href
                        ? "bg-rust/10 text-ink"
                        : "text-ink/80 hover:bg-rust/10 hover:text-ink"
                    }`}
                  >
                    {l.label}
                  </Link>
                </li>
              ))}

              {/* Mobile Actions */}
              <li className="mt-3 border-t border-ink/10 pt-3">
                <div className="flex items-center gap-3 px-4">
                  <Link
                    href="/search"
                    className="grid h-11 w-11 place-items-center
                               rounded-xl border border-ink/10
                               text-ink/70 hover:bg-ink hover:text-cream"
                    aria-label="Search"
                  >
                    <Search className="h-5 w-5" />
                  </Link>
                  <Link
                    href="/account"
                    className="grid h-11 w-11 place-items-center
                               rounded-xl border border-ink/10
                               text-ink/70 hover:bg-ink hover:text-cream"
                    aria-label="Account"
                  >
                    <User className="h-5 w-5" />
                  </Link>
                  <Link
                    href="/cart"
                    className="grid h-11 w-11 place-items-center
                               rounded-xl border border-ink/10
                               text-ink/70 hover:bg-rust hover:text-cream"
                    aria-label="Shopping Cart"
                  >
                    <ShoppingCart className="h-5 w-5" />
                  </Link>
                </div>
              </li>
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}