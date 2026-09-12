"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Smartphone, KeyRound, Loader2, CheckCircle2 } from "lucide-react";
import { useAuth } from "@/app/context/AuthContext";

export default function LoginSidebar() {
  const { loginOpen, closeLogin, sendOtp, loginWithOtp, loginIntent } =
    useAuth();

  const [step, setStep] = useState("mobile"); // 'mobile' | 'otp'
  const [mobile, setMobile] = useState("");
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [info, setInfo] = useState("");
  const otpRefs = useRef([]);

  // Reset when closed
  useEffect(() => {
    if (!loginOpen) {
      const t = setTimeout(() => {
        setStep("mobile");
        setMobile("");
        setOtp(["", "", "", "", "", ""]);
        setError("");
        setInfo("");
        setLoading(false);
      }, 300);
      return () => clearTimeout(t);
    }
  }, [loginOpen]);

  const handleRequestOtp = useCallback(
    async (e) => {
      e?.preventDefault();
      setError("");
      setInfo("");
      setLoading(true);
      // tiny delay for UX
      await new Promise((r) => setTimeout(r, 400));
      const result = sendOtp(mobile);
      setLoading(false);
      if (!result.ok) {
        setError(result.error);
        return;
      }
      setInfo(result.message);
      setStep("otp");
      setTimeout(() => otpRefs.current[0]?.focus(), 50);
    },
    [mobile, sendOtp]
  );

  const handleVerify = useCallback(
    async (e) => {
      e?.preventDefault();
      setError("");
      setLoading(true);
      await new Promise((r) => setTimeout(r, 350));
      const otpStr = otp.join("");
      const result = loginWithOtp(mobile, otpStr);
      setLoading(false);
      if (!result.ok) {
        setError(result.error);
      }
    },
    [mobile, otp, loginWithOtp]
  );

  const onOtpChange = (index, value) => {
    const digit = value.replace(/\D/g, "").slice(-1);
    const next = [...otp];
    next[index] = digit;
    setOtp(next);
    if (digit && index < 5) {
      otpRefs.current[index + 1]?.focus();
    }
  };

  const onOtpKeyDown = (index, e) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      otpRefs.current[index - 1]?.focus();
    }
  };

  const onOtpPaste = (e) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    if (!pasted) return;
    const next = [...otp];
    for (let i = 0; i < 6; i++) next[i] = pasted[i] || "";
    setOtp(next);
    const focusIdx = Math.min(pasted.length, 5);
    otpRefs.current[focusIdx]?.focus();
  };

  return (
    <AnimatePresence>
      {loginOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            key="login-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-[90] bg-ink/40 backdrop-blur-[2px]"
            onClick={closeLogin}
          />

          {/* Sidebar */}
          <motion.aside
            key="login-sidebar"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 28, stiffness: 320 }}
            className="fixed right-0 top-0 z-[100] flex h-full w-full max-w-[400px] flex-col bg-white shadow-[-12px_0_40px_-8px_rgba(0,0,0,0.18)]"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-ink/8 px-5 py-4">
              <div>
                <h2 className="font-display text-lg font-bold text-ink">
                  {step === "mobile" ? "Login" : "Verify OTP"}
                </h2>
                <p className="mt-0.5 text-[12px] text-ink/50">
                  {loginIntent?.type === "wishlist"
                    ? "Login to save items to wishlist"
                    : "Continue with your mobile number"}
                </p>
              </div>
              <button
                type="button"
                onClick={closeLogin}
                className="rounded-full p-2 text-ink/50 transition hover:bg-ink/5 hover:text-ink"
                aria-label="Close"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="flex flex-1 flex-col px-5 py-6">
              {step === "mobile" ? (
                <form onSubmit={handleRequestOtp} className="flex flex-1 flex-col">
                  <label className="mb-1.5 text-[12px] font-semibold uppercase tracking-wider text-ink/45">
                    Mobile number
                  </label>
                  <div className="relative">
                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[14px] font-medium text-ink/40">
                      +91
                    </span>
                    <input
                      type="tel"
                      inputMode="numeric"
                      maxLength={10}
                      value={mobile}
                      onChange={(e) =>
                        setMobile(e.target.value.replace(/\D/g, "").slice(0, 10))
                      }
                      placeholder="10-digit number"
                      className="w-full rounded-xl border border-ink/12 bg-[#F9F7F4] py-3.5 pl-12 pr-4 text-[15px] font-medium text-ink outline-none transition focus:border-rust/50 focus:ring-2 focus:ring-rust/15"
                      autoFocus
                    />
                    <Smartphone className="pointer-events-none absolute right-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-ink/30" />
                  </div>

                  {error && (
                    <p className="mt-3 text-[13px] font-medium text-red-600">
                      {error}
                    </p>
                  )}
                  {info && (
                    <p className="mt-3 text-[13px] font-medium text-green-700">
                      {info}
                    </p>
                  )}

                  <button
                    type="submit"
                    disabled={loading || mobile.length !== 10}
                    className="mt-6 flex w-full items-center justify-center gap-2 rounded-full bg-rust py-3.5 text-[14px] font-bold text-white transition hover:bg-rust/90 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {loading ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      "Send OTP"
                    )}
                  </button>

                  <p className="mt-4 text-center text-[12px] text-ink/40">
                    Demo OTP is always{" "}
                    <span className="font-semibold text-ink/60">123456</span>
                  </p>

                  <div className="mt-auto pt-8">
                    <div className="rounded-xl bg-ink/4 px-4 py-3 text-[12px] leading-relaxed text-ink/55">
                      By continuing you agree to our Terms of Service and Privacy
                      Policy. Your wishlist is saved locally on this device.
                    </div>
                  </div>
                </form>
              ) : (
                <form onSubmit={handleVerify} className="flex flex-1 flex-col">
                  <p className="mb-1 text-[13px] text-ink/55">
                    Enter the 6-digit OTP sent to
                  </p>
                  <p className="mb-5 font-display text-[16px] font-bold text-ink">
                    +91 {mobile}
                    <button
                      type="button"
                      onClick={() => {
                        setStep("mobile");
                        setOtp(["", "", "", "", "", ""]);
                        setError("");
                      }}
                      className="ml-2 text-[12px] font-semibold text-rust hover:underline"
                    >
                      Change
                    </button>
                  </p>

                  <label className="mb-2 text-[12px] font-semibold uppercase tracking-wider text-ink/45">
                    OTP
                  </label>
                  <div className="flex gap-2" onPaste={onOtpPaste}>
                    {otp.map((digit, i) => (
                      <input
                        key={i}
                        ref={(el) => (otpRefs.current[i] = el)}
                        type="text"
                        inputMode="numeric"
                        maxLength={1}
                        value={digit}
                        onChange={(e) => onOtpChange(i, e.target.value)}
                        onKeyDown={(e) => onOtpKeyDown(i, e)}
                        className="h-12 w-full rounded-xl border border-ink/12 bg-[#F9F7F4] text-center text-[18px] font-bold text-ink outline-none transition focus:border-rust/50 focus:ring-2 focus:ring-rust/15"
                      />
                    ))}
                  </div>

                  {error && (
                    <p className="mt-3 text-[13px] font-medium text-red-600">
                      {error}
                    </p>
                  )}

                  <button
                    type="submit"
                    disabled={loading || otp.join("").length !== 6}
                    className="mt-6 flex w-full items-center justify-center gap-2 rounded-full bg-rust py-3.5 text-[14px] font-bold text-white transition hover:bg-rust/90 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {loading ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <>
                        <KeyRound className="h-4 w-4" />
                        Verify & Login
                      </>
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={handleRequestOtp}
                    disabled={loading}
                    className="mt-4 text-center text-[13px] font-semibold text-rust hover:underline disabled:opacity-50"
                  >
                    Resend OTP
                  </button>

                  <div className="mt-auto flex items-start gap-2 rounded-xl bg-green-50 px-4 py-3 text-[12px] text-green-800">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" />
                    <span>
                      Demo mode: enter <strong>123456</strong> to login
                      instantly.
                    </span>
                  </div>
                </form>
              )}
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}