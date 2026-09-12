"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  getStoredUser,
  setStoredUser,
  clearStoredUser,
  requestOtp,
  verifyOtp,
} from "@/lib/auth";

import {
  getWishlist,
  addToWishlist,
  removeFromWishlist,
  toggleWishlist as toggleWishlistLib,
} from "@/lib/wishlist";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [hydrated, setHydrated] = useState(false);
  const [wishlist, setWishlistState] = useState([]);
  const [loginOpen, setLoginOpen] = useState(false);
  const [loginIntent, setLoginIntent] = useState(null);

  // Hydrate user from localStorage
  useEffect(() => {
    const storedUser = getStoredUser();

    setUser(storedUser);

    if (storedUser?.mobile) {
      setWishlistState(getWishlist(storedUser.mobile));
    }

    setHydrated(true);

    const onAuth = (event) => {
      const nextUser = event.detail;

      setUser(nextUser);

      setWishlistState(
        nextUser?.mobile ? getWishlist(nextUser.mobile) : []
      );
    };

    const onWishlist = (event) => {
      const items = event.detail?.items;

      if (items) {
        setWishlistState(items);
      }
    };

    window.addEventListener("auth-change", onAuth);
    window.addEventListener("wishlist-change", onWishlist);

    return () => {
      window.removeEventListener("auth-change", onAuth);
      window.removeEventListener("wishlist-change", onWishlist);
    };
  }, []);

  // Keep wishlist synchronized when logged-in user changes
  useEffect(() => {
    if (!hydrated) return;

    if (user?.mobile) {
      setWishlistState(getWishlist(user.mobile));
    } else {
      setWishlistState([]);
    }
  }, [user?.mobile, hydrated]);

  // Open login sidebar
  const openLogin = useCallback((intent = null) => {
    setLoginIntent(intent);
    setLoginOpen(true);
  }, []);

  // Close login sidebar
  const closeLogin = useCallback(() => {
    setLoginOpen(false);
    setLoginIntent(null);
  }, []);

  // Logout
  const logout = useCallback(() => {
    clearStoredUser();
    setUser(null);
    setWishlistState([]);
  }, []);

  // Send OTP
  const sendOtp = useCallback(
    (mobile) => requestOtp(mobile),
    []
  );

  // Login using OTP
  const loginWithOtp = useCallback(
    (mobile, otp) => {
      const result = verifyOtp(mobile, otp);

      if (result.ok) {
        setStoredUser(result.user);
        setUser(result.user);

        const userWishlist = getWishlist(result.user.mobile);

        setWishlistState(userWishlist);

        // If login was opened because user
        // wanted to add a product to wishlist
        if (
          loginIntent?.type === "wishlist" &&
          loginIntent.product
        ) {
          addToWishlist(
            result.user.mobile,
            loginIntent.product
          );

          setWishlistState(
            getWishlist(result.user.mobile)
          );
        }

        closeLogin();
      }

      return result;
    },
    [loginIntent, closeLogin]
  );

  // Check whether a product is in wishlist
  const isWishlisted = useCallback(
    (productId) => {
      if (!user?.mobile) {
        return false;
      }

      return wishlist.some(
        (product) => product.id === productId
      );
    },
    [user?.mobile, wishlist]
  );

  // Add/remove product from wishlist
  const toggleWishlist = useCallback(
    (product) => {
      // User is not logged in
      if (!user?.mobile) {
        openLogin({
          type: "wishlist",
          product,
        });

        return {
          added: false,
          requiresLogin: true,
        };
      }

      // User is logged in
      const { list, added } = toggleWishlistLib(
        user.mobile,
        product
      );

      setWishlistState(list);

      return {
        added,
        requiresLogin: false,
      };
    },
    [user?.mobile, openLogin]
  );

  // Remove product from wishlist
  const removeWishlistItem = useCallback(
    (productId) => {
      if (!user?.mobile) {
        return;
      }

      const next = removeFromWishlist(
        user.mobile,
        productId
      );

      setWishlistState(next);
    },
    [user?.mobile]
  );

  // Context value
  const value = useMemo(
    () => ({
      user,
      hydrated,

      isLoggedIn: !!user?.mobile,

      wishlist,
      wishlistCount: wishlist.length,

      isWishlisted,
      toggleWishlist,
      removeWishlistItem,

      loginOpen,
      openLogin,
      closeLogin,
      loginIntent,

      sendOtp,
      loginWithOtp,

      logout,
    }),
    [
      user,
      hydrated,
      wishlist,

      isWishlisted,
      toggleWishlist,
      removeWishlistItem,

      loginOpen,
      openLogin,
      closeLogin,
      loginIntent,

      sendOtp,
      loginWithOtp,

      logout,
    ]
  );

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);

  if (!ctx) {
    throw new Error(
      "useAuth must be used within AuthProvider"
    );
  }

  return ctx;
}