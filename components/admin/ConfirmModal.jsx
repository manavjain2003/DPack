"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";
import { AlertTriangle, Info, Loader2, X } from "lucide-react";

const VARIANTS = {
  danger: {
    icon: AlertTriangle,
    iconWrap: "bg-red-50 text-red-600 ring-red-100",
    button: "bg-red-600 hover:bg-red-700 focus-visible:ring-red-500/40",
  },
  primary: {
    icon: Info,
    iconWrap: "bg-rust/10 text-rust ring-rust/15",
    button: "bg-rust hover:bg-rust-dark focus-visible:ring-rust/40",
  },
};

export default function ConfirmModal({
  open,
  onClose,
  onConfirm,
  title,
  description,
  children,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  variant = "primary",
  icon,
}) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [mounted, setMounted] = useState(false);
  const cancelRef = useRef(null);
  const v = VARIANTS[variant] || VARIANTS.primary;
  const Icon = icon || v.icon;

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (open) {
      setBusy(false);
      setError("");
    }
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e) => {
      if (e.key === "Escape" && !busy) onClose();
    };
    document.addEventListener("keydown", onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    cancelRef.current?.focus();
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [open, busy, onClose]);

  const handleConfirm = async () => {
    setBusy(true);
    setError("");
    try {
      await onConfirm();
      onClose();
    } catch (e) {
      setError(e?.message || "Something went wrong. Please try again.");
      setBusy(false);
    }
  };

  if (!mounted) return null;

  return createPortal(
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[100] flex items-end justify-center p-4 sm:items-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15 }}
        >
          <div
            className="absolute inset-0 bg-ink/50 backdrop-blur-[2px]"
            onClick={() => !busy && onClose()}
            aria-hidden="true"
          />

          <motion.div
            role="alertdialog"
            aria-modal="true"
            aria-labelledby="confirm-title"
            aria-describedby={description ? "confirm-desc" : undefined}
            className="relative w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-lift"
            initial={{ opacity: 0, y: 16, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.98 }}
            transition={{ type: "spring", stiffness: 420, damping: 32 }}
          >
            <button
              type="button"
              onClick={onClose}
              disabled={busy}
              aria-label="Close"
              className="absolute right-3 top-3 grid h-8 w-8 place-items-center rounded-lg text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600 disabled:opacity-50"
            >
              <X className="h-4 w-4" />
            </button>

            <div className="flex gap-4 p-6">
              <div
                className={`grid h-11 w-11 shrink-0 place-items-center rounded-full ring-8 ${v.iconWrap}`}
              >
                <Icon className="h-5 w-5" />
              </div>

              <div className="min-w-0 flex-1 pr-6 pt-0.5">
                <h2 id="confirm-title" className="text-base font-semibold text-gray-900">
                  {title}
                </h2>
                {description && (
                  <p id="confirm-desc" className="mt-1.5 text-sm leading-relaxed text-gray-500">
                    {description}
                  </p>
                )}
                {children && <div className="mt-4">{children}</div>}

                {error && (
                  <div
                    role="alert"
                    className="mt-4 rounded-lg border border-red-100 bg-red-50 px-3 py-2 text-sm text-red-700"
                  >
                    {error}
                  </div>
                )}
              </div>
            </div>

            <div className="flex flex-col-reverse gap-2 border-t border-gray-100 bg-gray-50/70 px-6 py-4 sm:flex-row sm:justify-end">
              <button
                ref={cancelRef}
                type="button"
                onClick={onClose}
                disabled={busy}
                className="rounded-xl border border-gray-200 bg-white px-5 py-2.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-300 disabled:opacity-50"
              >
                {cancelLabel}
              </button>
              <button
                type="button"
                onClick={handleConfirm}
                disabled={busy}
                className={`flex items-center justify-center gap-2 rounded-xl px-5 py-2.5 text-sm font-semibold text-white transition-colors focus-visible:outline-none focus-visible:ring-4 disabled:opacity-70 ${v.button}`}
              >
                {busy && <Loader2 className="h-4 w-4 animate-spin" />}
                {confirmLabel}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
}