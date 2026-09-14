const AUTH_KEY = "app_auth_user";
const OTP_KEY = "app_pending_otp";

export function getStoredUser() {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(AUTH_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function setStoredUser(user) {
  if (typeof window === "undefined") return;
  localStorage.setItem(AUTH_KEY, JSON.stringify(user));
  window.dispatchEvent(new CustomEvent("auth-change", { detail: user }));
}

export function clearStoredUser() {
  if (typeof window === "undefined") return;
  localStorage.removeItem(AUTH_KEY);
  window.dispatchEvent(new CustomEvent("auth-change", { detail: null }));
}

export function requestOtp(mobile) {
  const cleaned = String(mobile).replace(/\D/g, "").slice(-10);
  if (cleaned.length !== 10) {
    return { ok: false, error: "Enter a valid 10-digit mobile number" };
  }
  const otp = "123456";
  sessionStorage.setItem(OTP_KEY, JSON.stringify({ mobile: cleaned, otp, at: Date.now() }));
  return { ok: true, message: "OTP sent (use 123456 for demo)" };
}

export function verifyOtp(mobile, otpInput) {
  const cleaned = String(mobile).replace(/\D/g, "").slice(-10);
  try {
    const pending = JSON.parse(sessionStorage.getItem(OTP_KEY) || "null");
    if (!pending || pending.mobile !== cleaned) {
      return { ok: false, error: "Request OTP first" };
    }
    if (Date.now() - pending.at > 5 * 60 * 1000) {
      sessionStorage.removeItem(OTP_KEY);
      return { ok: false, error: "OTP expired. Request a new one." };
    }
    if (String(otpInput).trim() !== pending.otp) {
      return { ok: false, error: "Invalid OTP" };
    }
    sessionStorage.removeItem(OTP_KEY);
    const user = {
      mobile: cleaned,
      name: `User ${cleaned.slice(-4)}`,
      loggedInAt: new Date().toISOString(),
    };
    setStoredUser(user);
    return { ok: true, user };
  } catch {
    return { ok: false, error: "Something went wrong" };
  }
}