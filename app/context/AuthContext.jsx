"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
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
import { auth, RecaptchaVerifier, signInWithPhoneNumber } from "@/lib/firebase";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [hydrated, setHydrated] = useState(false);
  const [wishlist, setWishlistState] = useState([]);
  const [loginOpen, setLoginOpen] = useState(false);
  const [loginIntent, setLoginIntent] = useState(null);
  const confirmationResultRef = useRef(null);

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

  const setupRecaptcha = useCallback(() => {
    if (typeof window === "undefined") return null;
    if (!window.recaptchaVerifier) {
      window.recaptchaVerifier = new RecaptchaVerifier(auth, "recaptcha-container", {
        size: "invisible",
      });
    }
    return window.recaptchaVerifier;
  }, []);

  const sendOtp = useCallback(
    async (mobile) => {
      try {
        const verifier = setupRecaptcha();
        const result = await signInWithPhoneNumber(auth, `+91${mobile}`, verifier);
        confirmationResultRef.current = result;
        return { ok: true, message: "OTP sent" };
      } catch (e) {
        if (typeof window !== "undefined" && window.recaptchaVerifier) {
          window.recaptchaVerifier.clear();
          window.recaptchaVerifier = null;
        }
        return { ok: false, error: e.message || "Failed to send OTP" };
      }
    },
    [setupRecaptcha]
  );

  const loginWithOtp = useCallback(
    async (mobile, otp) => {
      try {
        if (!confirmationResultRef.current) {
          return { ok: false, error: "OTP session expired. Please request a new OTP." };
        }

        const cred = await confirmationResultRef.current.confirm(otp);
        const idToken = await cred.user.getIdToken();

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
        confirmationResultRef.current = null;
        return { ok: true, user: res.user };
      } catch (e) {
        return { ok: false, error: e.message || "Invalid OTP" };
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