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
  authAPI,
  userAPI,
  setToken,
  getToken,
  clearToken,
} from "@/lib/apiClient";
import { syncCartFromServer } from "@/lib/cartBus";
import { sendFirebaseOtp, verifyFirebaseOtp } from "@/lib/firebase";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [hydrated, setHydrated] = useState(false);
  const [wishlist, setWishlistState] = useState([]);
  const [loginOpen, setLoginOpen] = useState(false);
  const [loginIntent, setLoginIntent] = useState(null);

  const loginWithToken = useCallback(async (token) => {
    setToken(token);
    try {
      const data = await authAPI.me();
      setUser(data.user);
    } catch {
      clearToken();
      throw new Error("Failed to verify token");
    }
  }, []);

  useEffect(() => {
    const init = async () => {
      const token = getToken();
      if (token) {
        try {
          const data = await authAPI.me();
          setUser(data.user);
          try {
            const wl = await userAPI.getWishlist();
            setWishlistState(wl.wishlist || []);
          } catch {
            setWishlistState([]);
          }
          syncCartFromServer();
        } catch {
          clearToken();
        }
      }
      setHydrated(true);
    };
    init();
  }, []);

  const openLogin = useCallback((intent = null) => {
    setLoginIntent(intent);
    setLoginOpen(true);
  }, []);

  const closeLogin = useCallback(() => {
    setLoginOpen(false);
    setLoginIntent(null);
  }, []);

  const logout = useCallback(() => {
    clearToken();
    setUser(null);
    setWishlistState([]);
  }, []);

  const sendOtp = useCallback(async (mobile) => {
    const phone = `+91${mobile}`;
    const result = await sendFirebaseOtp(phone, "recaptcha-container");

    if (!result.success) {
      return { ok: false, error: result.error?.message || "Failed to send OTP" };
    }
    return { ok: true, message: "OTP sent" };
  }, []);

  const loginWithOtp = useCallback(
    async (mobile, otp) => {
      const result = await verifyFirebaseOtp(otp);
      if (!result.success) {
        return { ok: false, error: result.error?.message || "Invalid OTP" };
      }

      try {
        const idToken = await result.user.getIdToken();
        const res = await authAPI.firebaseLogin(idToken);
        setToken(res.token);
        setUser(res.user);

        try {
          const wl = await userAPI.getWishlist();
          setWishlistState(wl.wishlist || []);
        } catch {
          setWishlistState([]);
        }

        if (loginIntent?.type === "wishlist" && loginIntent.productId) {
          try {
            await userAPI.addToWishlist(loginIntent.productId);
            const wl = await userAPI.getWishlist();
            setWishlistState(wl.wishlist || []);
          } catch {}
        }

        syncCartFromServer();
        closeLogin();
        return { ok: true, user: res.user };
      } catch (e) {
        return { ok: false, error: e.message || "Login failed" };
      }
    },
    [loginIntent, closeLogin]
  );

  const isWishlisted = useCallback(
    (productId) => wishlist.some((p) => p._id === productId || p.id === productId),
    [wishlist]
  );

  const toggleWishlist = useCallback(
    async (product) => {
      if (!user) {
        openLogin({ type: "wishlist", productId: product._id || product.id });
        return { added: false, requiresLogin: true };
      }

      const productId = product._id || product.id;
      const alreadyIn = isWishlisted(productId);

      try {
        if (alreadyIn) {
          await userAPI.removeFromWishlist(productId);
          setWishlistState((prev) =>
            prev.filter((p) => p._id !== productId && p.id !== productId)
          );
          return { added: false, requiresLogin: false };
        } else {
          await userAPI.addToWishlist(productId);
          const wl = await userAPI.getWishlist();
          setWishlistState(wl.wishlist || []);
          return { added: true, requiresLogin: false };
        }
      } catch {
        return { added: false, requiresLogin: false };
      }
    },
    [user, isWishlisted, openLogin]
  );

  const removeWishlistItem = useCallback(
    async (productId) => {
      if (!user) return;
      try {
        await userAPI.removeFromWishlist(productId);
        setWishlistState((prev) =>
          prev.filter((p) => p._id !== productId && p.id !== productId)
        );
      } catch {}
    },
    [user]
  );

  const value = useMemo(
    () => ({
      user,
      hydrated,
      isLoggedIn: !!user,
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
      loginWithToken,
      logout,
    }),
    [
      user, hydrated, wishlist,
      isWishlisted, toggleWishlist, removeWishlistItem,
      loginOpen, openLogin, closeLogin, loginIntent,
      sendOtp, loginWithOtp, loginWithToken, logout,
    ]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}