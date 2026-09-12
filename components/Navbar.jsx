"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

import {
  Menu,
  X,
  Search,
  User,
  ShoppingCart,
  LogOut,
  UserCircle,
} from "lucide-react";

import { useCart } from "@/lib/cartBus";
import { useAuth } from "@/app/context/AuthContext";
import WishlistNavButton from "@/components/WishlistNavButton";

const links = [
  { href: "/", label: "Home" },
  { href: "/products", label: "Products" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [cartPulse, setCartPulse] = useState(0);
  const [accountOpen, setAccountOpen] = useState(false);

  const pathname = usePathname();

  const cartItems = useCart();

  const cartCount = cartItems.reduce(
    (total, item) => total + item.qty,
    0
  );

  // Auth
  const {
    user,
    isLoggedIn,
    openLogin,
    logout,
  } = useAuth();


  const userInitial =
    user?.name?.trim()?.charAt(0)?.toUpperCase() || "U";

  useEffect(() => {
    const onAdded = () => {
      setCartPulse((p) => p + 1);
    };

    window.addEventListener("cart:added", onAdded);

    return () => {
      window.removeEventListener("cart:added", onAdded);
    };
  }, []);

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 24);
    };

    onScroll();

    window.addEventListener("scroll", onScroll, {
      passive: true,
    });

    return () => {
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  useEffect(() => {
    setOpen(false);
    setAccountOpen(false);
  }, [pathname]);

  // Logout
  const handleLogout = () => {
    setAccountOpen(false);
    setOpen(false);
    logout();
  };

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

        {/* Logo */}
        <div className="flex flex-1 items-center">
          <Link
            href="/"
            className="group flex items-center gap-3"
          >
            <img
              src="https://packingairbag.com/_next/image?url=%2Flogo.png&w=256&q=75"
              width={120}
              alt="Packing Airbag"
            />
          </Link>
        </div>

        <ul className="hidden items-center gap-8 md:flex">
          {links.map((link) => {
            const active = pathname === link.href;

            return (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className={`relative text-sm font-medium transition-colors
                    after:absolute after:-bottom-1
                    after:left-0 after:h-[2px]
                    after:bg-rust
                    after:transition-all after:duration-300
                    ${
                      active
                        ? "text-ink after:w-full"
                        : "text-ink/70 hover:text-ink after:w-0 hover:after:w-full"
                    }
                  `}
                >
                  {link.label}
                </Link>
              </li>
            );
          })}
        </ul>

        <div className="flex flex-1 items-center justify-end gap-1 sm:gap-2">

          <div className="hidden items-center gap-1 sm:gap-2 md:flex">

            <Link
              href="/search"
              aria-label="Search"
              className="group grid h-10 w-10 place-items-center
                         rounded-full text-ink/70
                         transition-all duration-300
                         hover:bg-ink hover:text-cream"
            >
              <Search
                className="h-5 w-5 transition-transform duration-300
                           group-hover:scale-110"
              />
            </Link>

  

            <WishlistNavButton />

            <Link
              href="/cart"
              aria-label={`Shopping Cart, ${cartCount} items`}
              className="group relative grid h-10 w-10
                         place-items-center rounded-full
                         text-ink/70 transition-all duration-300
                         hover:bg-rust hover:text-cream"
            >
              <motion.span
                key={cartPulse}
                animate={
                  cartPulse > 0
                    ? {
                        scale: [1, 1.45, 0.85, 1.12, 1],
                        rotate: [0, -14, 10, 0],
                        y: [0, -5, 0],
                      }
                    : {}
                }
                transition={{
                  duration: 0.6,
                  ease: "easeOut",
                }}
                className="grid place-items-center"
              >
                <ShoppingCart
                  className="h-5 w-5 transition-transform
                             duration-300 group-hover:scale-110"
                />
              </motion.span>

              {/* Cart Count */}
              <AnimatePresence>
                {cartCount > 0 && (
                  <motion.span
                    key={cartCount}
                    initial={{
                      scale: 0.3,
                      opacity: 0,
                    }}
                    animate={{
                      scale: 1,
                      opacity: 1,
                    }}
                    exit={{
                      scale: 0.3,
                      opacity: 0,
                    }}
                    transition={{
                      type: "spring",
                      stiffness: 500,
                      damping: 22,
                    }}
                    className="absolute -right-1 -top-1
                               grid h-4 min-w-4 place-items-center
                               rounded-full bg-rust px-1
                               text-[10px] font-bold text-white"
                  >
                    {cartCount}
                  </motion.span>
                )}
              </AnimatePresence>
            </Link>

                      <div className="relative">

              {!isLoggedIn ? (
                <button
                  type="button"
                  onClick={() => openLogin()}
                  aria-label="Login"
                  className="group grid h-10 w-10 place-items-center
                             rounded-full text-ink/70
                             transition-all duration-300
                             hover:bg-ink hover:text-cream"
                >
                  <User
                    className="h-5 w-5 transition-transform duration-300
                               group-hover:scale-110"
                  />
                </button>
              ) : (
               
                <>
                  <button
                    type="button"
                    onClick={() =>
                      setAccountOpen((value) => !value)
                    }
                    aria-label="Account menu"
                    aria-expanded={accountOpen}
                    className="grid h-10 w-10 place-items-center
                               rounded-full bg-rust
                               text-sm font-bold text-white
                               transition-all duration-300
                               hover:scale-105 hover:shadow-md"
                  >
                    {userInitial}
                  </button>

                  <AnimatePresence>
                    {accountOpen && (
                      <motion.div
                        initial={{
                          opacity: 0,
                          y: -8,
                          scale: 0.96,
                        }}
                        animate={{
                          opacity: 1,
                          y: 0,
                          scale: 1,
                        }}
                        exit={{
                          opacity: 0,
                          y: -8,
                          scale: 0.96,
                        }}
                        transition={{
                          duration: 0.18,
                        }}
                        className="absolute right-0 top-12 w-52
                                   overflow-hidden rounded-2xl
                                   border border-ink/10
                                   bg-cream shadow-xl"
                      >
                        <div className="border-b border-ink/10 px-4 py-3">
                          <p className="truncate text-sm font-semibold text-ink">
                            {user?.name || "User"}
                          </p>

                          {user?.email && (
                            <p className="mt-0.5 truncate text-xs text-ink/50">
                              {user.email}
                            </p>
                          )}
                        </div>

                        <Link
                          href="/account"
                          onClick={() =>
                            setAccountOpen(false)
                          }
                          className="flex items-center gap-3 px-4 py-3
                                     text-sm font-medium text-ink/80
                                     transition-colors
                                     hover:bg-ink/5 hover:text-ink"
                        >
                          <UserCircle className="h-5 w-5" />

                          <span>Profile</span>
                        </Link>

                        <button
                          type="button"
                          onClick={handleLogout}
                          className="flex w-full items-center gap-3
                                     px-4 py-3 text-left
                                     text-sm font-medium text-red-600
                                     transition-colors
                                     hover:bg-red-50"
                        >
                          <LogOut className="h-5 w-5" />

                          <span>Logout</span>
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </>
              )}
            </div>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setOpen((v) => !v)}
            className="grid h-10 w-10 place-items-center
                       rounded-xl border border-ink/10 md:hidden"
            aria-label="Toggle menu"
            aria-expanded={open}
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
            initial={{
              height: 0,
              opacity: 0,
            }}
            animate={{
              height: "auto",
              opacity: 1,
            }}
            exit={{
              height: 0,
              opacity: 0,
            }}
            transition={{
              duration: 0.35,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="overflow-hidden md:hidden"
          >
            <ul className="space-y-1 px-5 py-4">

              {/* Navigation Links */}
              {links.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className={`block rounded-xl px-4 py-3
                                font-display text-lg font-semibold
                                transition-colors ${
                                  pathname === link.href
                                    ? "bg-rust/10 text-ink"
                                    : "text-ink/80 hover:bg-rust/10 hover:text-ink"
                                }`}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}

              {/* Mobile Icons */}
              <li className="mt-3 border-t border-ink/10 pt-3">
                <div className="flex items-center gap-3 px-4">

                  {/* Search */}
                  <Link
                    href="/search"
                    className="grid h-11 w-11 place-items-center
                               rounded-xl border border-ink/10
                               text-ink/70
                               hover:bg-ink hover:text-cream"
                    aria-label="Search"
                  >
                    <Search className="h-5 w-5" />
                  </Link>

                  {/* Mobile Account */}
                  <div className="relative">

                    {!isLoggedIn ? (
                      <button
                        type="button"
                        onClick={() => openLogin()}
                        className="grid h-11 w-11 place-items-center
                                   rounded-xl border border-ink/10
                                   text-ink/70
                                   hover:bg-ink hover:text-cream"
                        aria-label="Login"
                      >
                        <User className="h-5 w-5" />
                      </button>
                    ) : (
                      <>
                        <button
                          type="button"
                          onClick={() =>
                            setAccountOpen((value) => !value)
                          }
                          className="grid h-11 w-11 place-items-center
                                     rounded-xl bg-rust
                                     text-sm font-bold text-white"
                          aria-label="Account menu"
                          aria-expanded={accountOpen}
                        >
                          {userInitial}
                        </button>

                        {/* Mobile Account Dropdown */}
                        <AnimatePresence>
                          {accountOpen && (
                            <motion.div
                              initial={{
                                opacity: 0,
                                y: -8,
                                scale: 0.96,
                              }}
                              animate={{
                                opacity: 1,
                                y: 0,
                                scale: 1,
                              }}
                              exit={{
                                opacity: 0,
                                y: -8,
                                scale: 0.96,
                              }}
                              className="absolute left-0 top-14 z-50
                                         w-52 overflow-hidden
                                         rounded-2xl
                                         border border-ink/10
                                         bg-cream shadow-xl"
                            >
                              {/* User Info */}
                              <div className="border-b border-ink/10 px-4 py-3">
                                <p className="truncate text-sm font-semibold text-ink">
                                  {user?.name || "User"}
                                </p>

                                {user?.email && (
                                  <p className="mt-0.5 truncate text-xs text-ink/50">
                                    {user.email}
                                  </p>
                                )}
                              </div>

                              {/* Profile */}
                              <Link
                                href="/account"
                                onClick={() =>
                                  setAccountOpen(false)
                                }
                                className="flex items-center gap-3 px-4 py-3
                                           text-sm font-medium text-ink/80
                                           hover:bg-ink/5"
                              >
                                <UserCircle className="h-5 w-5" />

                                <span>Profile</span>
                              </Link>

                              {/* Logout */}
                              <button
                                type="button"
                                onClick={handleLogout}
                                className="flex w-full items-center gap-3
                                           px-4 py-3 text-left
                                           text-sm font-medium
                                           text-red-600
                                           hover:bg-red-50"
                              >
                                <LogOut className="h-5 w-5" />

                                <span>Logout</span>
                              </button>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </>
                    )}
                  </div>

                  {/* Wishlist */}
                  <WishlistNavButton
                    className="h-11 w-11 rounded-xl border border-ink/10"
                  />

                  {/* Cart */}
                  <Link
                    href="/cart"
                    className="relative grid h-11 w-11
                               place-items-center rounded-xl
                               border border-ink/10
                               text-ink/70
                               hover:bg-rust hover:text-cream"
                    aria-label={`Shopping Cart, ${cartCount} items`}
                  >
                    <ShoppingCart className="h-5 w-5" />

                    {cartCount > 0 && (
                      <span
                        className="absolute -right-1 -top-1
                                   flex h-4 min-w-4 items-center
                                   justify-center rounded-full
                                   bg-rust px-1 text-[10px]
                                   font-bold text-white"
                      >
                        {cartCount}
                      </span>
                    )}
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