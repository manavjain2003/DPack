"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Smartphone, KeyRound, Loader2, CheckCircle2, Info } from "lucide-react";
import { useAuth } from "@/app/context/AuthContext";

export default function LoginSidebar() {
  const { loginOpen, closeLogin, sendOtp, loginWithOtp } = useAuth();
  const [step, setStep] = useState("mobile");
  const [mobile, setMobile] = useState("");
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [info, setInfo] = useState("");
  const [devOtp, setDevOtp] = useState("");
  const otpRefs = useRef([]);

  useEffect(() => {
    if (!loginOpen) {
      const t = setTimeout(() => {
        setStep("mobile"); setMobile(""); setOtp(["","","","","",""]);
        setError(""); setInfo(""); setLoading(false); setDevOtp("");
      }, 300);
      return () => clearTimeout(t);
    }
  }, [loginOpen]);

  const handleRequestOtp = useCallback(async (e) => {
    e?.preventDefault();
    setError(""); setInfo(""); setDevOtp("");
    setLoading(true);
    const result = await sendOtp(mobile);
    setLoading(false);
    if (!result.ok) { setError(result.error); return; }
    setInfo(result.message || "OTP sent");
    if (result.devOtp) setDevOtp(result.devOtp);
    setStep("otp");
    setTimeout(() => otpRefs.current[0]?.focus(), 50);
  }, [mobile, sendOtp]);

  const handleVerify = useCallback(async (e) => {
    e?.preventDefault();
    setError(""); setLoading(true);
    const result = await loginWithOtp(mobile, otp.join(""));
    setLoading(false);
    if (!result.ok) setError(result.error);
  }, [mobile, otp, loginWithOtp]);

  const onOtpChange = (index, value) => {
    const digit = value.replace(/\D/g, "").slice(-1);
    const next = [...otp]; next[index] = digit; setOtp(next);
    if (digit && index < 5) otpRefs.current[index + 1]?.focus();
  };

  const onOtpKeyDown = (index, e) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) otpRefs.current[index - 1]?.focus();
  };

  const onOtpPaste = (e) => {
    const text = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    if (text.length === 6) setOtp(text.split(""));
  };

  return (
    <AnimatePresence>
      {loginOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm"
            onClick={closeLogin}
          />
          <motion.aside
            initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="fixed inset-y-0 right-0 z-50 flex w-full max-w-sm flex-col bg-cream shadow-2xl"
          >
            <div className="flex items-center justify-between border-b border-ink/10 px-6 py-5">
              <div>
                <h2 className="font-display text-lg font-bold text-ink">
                  {step === "mobile" ? "Sign in" : "Verify OTP"}
                </h2>
                <p className="mt-0.5 text-sm text-ink/50">
                  {step === "mobile" ? "Enter your mobile to continue" : `Sent to +91 ${mobile}`}
                </p>
              </div>
              <button onClick={closeLogin} className="flex h-9 w-9 items-center justify-center rounded-full text-ink/40 transition hover:bg-ink/8 hover:text-ink">
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-6 py-8">
              {step === "mobile" ? (
                <form onSubmit={handleRequestOtp} className="space-y-5">
                  <div>
                    <label className="mb-2 block text-sm font-medium text-ink">Mobile Number</label>
                    <div className="relative">
                      <Smartphone className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink/40" />
                      <input
                        autoFocus type="tel" required maxLength={10}
                        value={mobile} onChange={(e) => setMobile(e.target.value.replace(/\D/g, "").slice(0, 10))}
                        placeholder="10-digit mobile number"
                        className="w-full rounded-xl border border-ink/15 bg-white py-3 pl-10 pr-4 text-sm text-ink outline-none transition focus:border-ink/40 focus:ring-2 focus:ring-ink/10"
                      />
                    </div>
                  </div>
                  {error && <p className="rounded-xl bg-red-50 px-4 py-2.5 text-sm text-red-600">{error}</p>}
                  <button
                    type="submit" disabled={loading || mobile.length !== 10}
                    className="flex w-full items-center justify-center gap-2 rounded-xl bg-rust py-3.5 text-sm font-bold text-white transition hover:bg-rust/90 disabled:opacity-50"
                  >
                    {loading && <Loader2 className="h-4 w-4 animate-spin" />}
                    Send OTP
                  </button>
                </form>
              ) : (
                <form onSubmit={handleVerify} className="space-y-6">
                  {info && (
                    <div className="flex items-start gap-2 rounded-xl bg-green-50 px-4 py-3 text-sm text-green-700">
                      <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" />
                      {info}
                    </div>
                  )}
                  {devOtp && (
                    <div className="flex items-center gap-2 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
                      <Info className="h-4 w-4 shrink-0" />
                      Your OTP: <strong className="font-mono">{devOtp}</strong>
                    </div>
                  )}
                  <div>
                    <label className="mb-3 block text-sm font-medium text-ink">Enter 6-digit OTP</label>
                    <div className="flex gap-2.5" onPaste={onOtpPaste}>
                      {otp.map((d, i) => (
                        <input
                          key={i} ref={(el) => (otpRefs.current[i] = el)}
                          type="text" inputMode="numeric" maxLength={1} value={d}
                          onChange={(e) => onOtpChange(i, e.target.value)}
                          onKeyDown={(e) => onOtpKeyDown(i, e)}
                          className="h-12 w-10 rounded-xl border border-ink/15 bg-white text-center text-lg font-bold text-ink outline-none transition focus:border-rust focus:ring-2 focus:ring-rust/20"
                        />
                      ))}
                    </div>
                  </div>
                  {error && <p className="rounded-xl bg-red-50 px-4 py-2.5 text-sm text-red-600">{error}</p>}
                  <button
                    type="submit" disabled={loading || otp.join("").length !== 6}
                    className="flex w-full items-center justify-center gap-2 rounded-xl bg-rust py-3.5 text-sm font-bold text-white transition hover:bg-rust/90 disabled:opacity-50"
                  >
                    {loading && <Loader2 className="h-4 w-4 animate-spin" />}
                    Verify & Sign In
                  </button>
                  <button
                    type="button" onClick={() => { setStep("mobile"); setOtp(["","","","","",""]); setError(""); setDevOtp(""); }}
                    className="w-full text-center text-sm text-ink/50 hover:text-ink"
                  >
                    ← Change number
                  </button>
                </form>
              )}
            </div>

            <div className="border-t border-ink/10 px-6 py-4">
              <p className="text-center text-xs text-ink/35">
                By signing in you agree to our Terms & Privacy Policy
              </p>
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}