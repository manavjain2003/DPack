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


let searchIndexCache = null;
let searchIndexPromise = null;
function getSearchIndex() {
  if (searchIndexCache) return Promise.resolve(searchIndexCache);
  if (!searchIndexPromise) {
    searchIndexPromise = fetch("/api/products?limit=200")
      .then((r) => r.json())
      .then((data) => {
        searchIndexCache = data.products || [];
        return searchIndexCache;
      })
      .catch(() => {
        searchIndexPromise = null; 
        return [];
      });
  }
  return searchIndexPromise;
}

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [cartPulse, setCartPulse] = useState(0);
  const [accountOpen, setAccountOpen] = useState(false);
const [searchOpen, setSearchOpen] = useState(false);
const [searchQuery, setSearchQuery] = useState("");
const [allProducts, setAllProducts] = useState([]); 
const pathname = usePathname();

  const cartItems = useCart();

  const cartCount = cartItems.reduce(
    (total, item) => total + item.qty,
    0
  );

  const {
    user,
    isLoggedIn,
    openLogin,
    logout,
  } = useAuth();


  const userInitial =
    user?.name?.trim()?.charAt(0)?.toUpperCase() || "U";

    useEffect(() => {
  let cancelled = false;
  getSearchIndex().then((products) => {
    if (!cancelled) setAllProducts(products);
  });
  return () => {
    cancelled = true;
  };
}, []);

  useEffect(() => {
    const onAdded = () => {
      setCartPulse((p) => p + 1);
    };

    window.addEventListener("cart:added", onAdded);

    return () => {
      window.removeEventListener("cart:added", onAdded);
    };
  }, []);
const searchResults = searchQuery.trim()
  ? allProducts
      .filter((product) => {
        if (!product) return false; 
        const query = searchQuery.toLowerCase();
        return (
        product.name?.toLowerCase()?.includes(query) ||
product.category?.toLowerCase()?.includes(query) ||
product.description?.toLowerCase()?.includes(query)
        );
      })
      .slice(0, 6)
  : [];

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

  const handleLogout = () => {
    setAccountOpen(false);
    setOpen(false);
    logout();
  };

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        scrolled || open
          ? "border-b border-ink/10 bg-cream/85 shadow-sm backdrop-blur-xl"
          : "bg-transparent"
      }`}
    >
      <nav className="mx-auto flex max-w-8xl items-center px-5 py-4 sm:px-8">

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

           <div className="relative">
  <AnimatePresence mode="wait">
    {!searchOpen ? (
      <motion.button
        key="search-button"
        type="button"
        onClick={() => setSearchOpen(true)}
        aria-label="Open search"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="group grid h-10 w-10 place-items-center
                   rounded-full text-ink/70
                   transition-all duration-300
                   hover:bg-ink hover:text-cream"
      >
        <Search
          className="h-5 w-5 transition-transform duration-300
                     group-hover:scale-110"
        />
      </motion.button>
    ) : (
      <motion.div
        key="search-input"
        initial={{ width: 40, opacity: 0 }}
        animate={{ width: 300, opacity: 1 }}
        exit={{ width: 40, opacity: 0 }}
        transition={{
          duration: 0.25,
          ease: "easeOut",
        }}
        className="relative"
      >
        <div
          className="flex h-10 items-center gap-2
                     rounded-full border border-ink/10
                     bg-cream px-3 shadow-sm"
        >
          <Search className="h-4 w-4 shrink-0 text-ink/50" />

          <input
            autoFocus
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search products..."
            className="min-w-0 flex-1 bg-transparent
                       text-sm text-ink outline-none
                       placeholder:text-ink/40"
          />

          <button
            type="button"
            onClick={() => {
              setSearchOpen(false);
              setSearchQuery("");
            }}
            aria-label="Close search"
            className="grid h-7 w-7 shrink-0 place-items-center
                       rounded-full text-ink/50
                       transition-colors
                       hover:bg-ink/10 hover:text-ink"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <AnimatePresence>
          {searchQuery.trim() && (
            <motion.div
              initial={{
                opacity: 0,
                y: -8,
                scale: 0.98,
              }}
              animate={{
                opacity: 1,
                y: 0,
                scale: 1,
              }}
              exit={{
                opacity: 0,
                y: -8,
                scale: 0.98,
              }}
              transition={{ duration: 0.18 }}
              className="absolute right-0 top-12 z-[60]
                         w-[360px] overflow-hidden
                         rounded-2xl border border-ink/10
                         bg-cream shadow-2xl"
            >
              {searchResults.length > 0 ? (
                <div className="max-h-[420px] overflow-y-auto p-2">
                  {searchResults.map((product) => (
                    <Link
                      key={product.id}
                      href={`/products/${product.slug}`}
                      onClick={() => {
                        setSearchOpen(false);
                        setSearchQuery("");
                      }}
                      className="flex items-center gap-3
                                 rounded-xl p-3
                                 transition-colors
                                 hover:bg-ink/5"
                    >
                      <div
                        className="h-14 w-14 shrink-0
                                   overflow-hidden rounded-lg
                                   bg-white"
                      >
                        <img
                          src={product.image}
                          alt={product.name}
                          className="h-full w-full object-contain"
                        />
                      </div>

                      <div className="min-w-0 flex-1">
                        <p
                          className="truncate text-sm
                                     font-semibold text-ink"
                        >
                          {product.name}
                        </p>

                        <p className="mt-0.5 text-xs text-ink/50">
                         {product?.category}
                        </p>

                        <p className="mt-1 text-sm font-medium text-rust">
                          ₹{product.price.toLocaleString("en-IN")}
                        </p>
                      </div>
                    </Link>
                  ))}
                </div>
              ) : (
                <div className="px-5 py-8 text-center">
                  <Search
                    className="mx-auto h-8 w-8
                               text-ink/20"
                  />

                  <p className="mt-3 text-sm font-semibold text-ink">
                    No products found
                  </p>

                  <p className="mt-1 text-xs text-ink/50">
                    Try searching for another product.
                  </p>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    )}
  </AnimatePresence>
</div>

  

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

              <li className="mt-3 border-t border-ink/10 pt-3">
                <div className="flex items-center gap-3 px-4">

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
                                           hover:bg-ink/5"
                              >
                                <UserCircle className="h-5 w-5" />

                                <span>Profile</span>
                              </Link>

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

                  <WishlistNavButton
                    className="h-11 w-11 rounded-xl border border-ink/10"
                  />

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
    </header>
  );
}