"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, X, FileText } from "lucide-react";
import { EMAIL } from "@/lib/products";

const T = {
  navy:       "#1B2A4A",
  navyHover:  "#22324F",
  amber:      "#D4891A",
  amberLight: "#F5A623",
  amberRing:  "rgba(212,137,26,0.16)",
  inputBg:    "#F2EDE4",
  border:     "#E4DDD3",
  muted:      "#6B7A99",
  success:    "#2E7D50",
  error:      "#C0392B",
};

const BG_IMAGE =
  "https://www.instantcustomboxes.com/wp-content/uploads/2023/02/ICB-BANNER-8-Feb-1-scaled.webp?lm=6AA1BDF0";

// ── Quote Modal ────────────────────────────────────────────────────
const initialForm = { name: "", email: "", phone: "", company: "", message: "" };

function QuoteModal({ onClose }) {
  const [form, setForm]     = useState(initialForm);
  const [status, setStatus] = useState("idle"); // idle | submitting | success | error

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("submitting");
    try {
      await new Promise((r) => setTimeout(r, 900));
      setStatus("success");
      setForm(initialForm);
    } catch {
      setStatus("error");
    }
  };

  // Shared focus/blur handlers for field highlight
  const fo = {
    onFocus: (e) => {
      e.target.style.borderColor     = T.amber;
      e.target.style.backgroundColor = "#fff";
      e.target.style.boxShadow       = `0 0 0 3px ${T.amberRing}`;
    },
    onBlur: (e) => {
      e.target.style.borderColor     = T.border;
      e.target.style.backgroundColor = T.inputBg;
      e.target.style.boxShadow       = "none";
    },
  };

  const fieldStyle = {
    border:          `1.5px solid ${T.border}`,
    borderRadius:    "10px",
    background:      T.inputBg,
    padding:         "10px 13px",
    fontSize:        "13px",
    color:           T.navy,
    outline:         "none",
    width:           "100%",
    fontFamily:      "inherit",
    transition:      "border-color .2s, background .2s, box-shadow .2s",
  };

  return (
    // Backdrop — stops scroll, centres modal
    <div
      onClick={onClose}
      style={{
        position:       "fixed",
        inset:          0,
        zIndex:         50,
        background:     "rgba(15, 23, 42, 0.65)",
        display:        "flex",
        alignItems:     "center",
        justifyContent: "center",
        padding:        "20px",
      }}
    >
      <motion.div
        onClick={(e) => e.stopPropagation()}
        initial={{ opacity: 0, y: 24, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 16, scale: 0.97 }}
        transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
        style={{
          background:   "#fff",
          borderRadius: "20px",
          border:       `1.5px solid ${T.border}`,
          width:        "100%",
          maxWidth:     "560px",
          padding:      "32px 28px",
          position:     "relative",
        }}
      >
        <button
          onClick={onClose}
          aria-label="Close"
          style={{
            position:        "absolute",
            top:             "16px",
            right:           "16px",
            background:      "none",
            border:          `1px solid ${T.border}`,
            borderRadius:    "8px",
            width:           "32px",
            height:          "32px",
            display:         "flex",
            alignItems:      "center",
            justifyContent:  "center",
            cursor:          "pointer",
            color:           T.muted,
            transition:      "background .15s, color .15s",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = "#F2EDE4";
            e.currentTarget.style.color      = T.navy;
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "none";
            e.currentTarget.style.color      = T.muted;
          }}
        >
          <X size={15} />
        </button>

        <div style={{ marginBottom: "24px" }}>
          <p style={{
            display:       "flex",
            alignItems:    "center",
            gap:           "8px",
            fontSize:      "11px",
            fontWeight:    700,
            letterSpacing: ".2em",
            textTransform: "uppercase",
            color:         T.amber,
            marginBottom:  "10px",
          }}>
            <span style={{ display: "block", width: "20px", height: "1.5px", background: T.amber }} />
            Get a quote
            <span style={{ display: "block", width: "20px", height: "1.5px", background: T.amber }} />
          </p>
          <h2 style={{ fontSize: "22px", fontWeight: 700, color: T.navy, letterSpacing: "-.02em", margin: 0 }}>
            Tell us what you need
          </h2>
          <p style={{ fontSize: "13px", color: T.muted, marginTop: "6px", lineHeight: 1.6 }}>
            We'll get back to you within 24 hours with a tailored quote.
          </p>
        </div>

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px" }}>
            <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
              <label style={{ fontSize: "12px", fontWeight: 600, color: T.navy }}>Full name</label>
              <input
                name="name" type="text" required
                placeholder="Your name"
                value={form.name} onChange={handleChange}
                style={fieldStyle} {...fo}
              />
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
              <label style={{ fontSize: "12px", fontWeight: 600, color: T.navy }}>Email address</label>
              <input
                name="email" type="email" required
                placeholder="you@company.com"
                value={form.email} onChange={handleChange}
                style={fieldStyle} {...fo}
              />
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
              <label style={{ fontSize: "12px", fontWeight: 600, color: T.navy }}>
                Phone <span style={{ fontWeight: 400, color: T.muted }}>optional</span>
              </label>
              <input
                name="phone" type="tel"
                placeholder="+91 98765 43210"
                value={form.phone} onChange={handleChange}
                style={fieldStyle} {...fo}
              />
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
              <label style={{ fontSize: "12px", fontWeight: 600, color: T.navy }}>
                Company <span style={{ fontWeight: 400, color: T.muted }}>optional</span>
              </label>
              <input
                name="company" type="text"
                placeholder="Your company"
                value={form.company} onChange={handleChange}
                style={fieldStyle} {...fo}
              />
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
            <label style={{ fontSize: "12px", fontWeight: 600, color: T.navy }}>Your requirement</label>
            <textarea
              name="message" required rows={4}
              placeholder="Product type, estimated quantity, packaging specs, timeline…"
              value={form.message} onChange={handleChange}
              style={{ ...fieldStyle, resize: "none" }}
              {...fo}
            />
          </div>

          <div style={{ height: "1px", background: T.border }} />

          <div style={{ display: "flex", alignItems: "center", gap: "14px", flexWrap: "wrap" }}>
            <button
              type="submit"
              disabled={status === "submitting"}
              style={{
                display:        "inline-flex",
                alignItems:     "center",
                gap:            "7px",
                background:     T.navy,
                color:          "#fff",
                border:         "none",
                borderRadius:   "10px",
                padding:        "11px 24px",
                fontSize:       "13px",
                fontWeight:     600,
                cursor:         status === "submitting" ? "not-allowed" : "pointer",
                opacity:        status === "submitting" ? 0.65 : 1,
                fontFamily:     "inherit",
                transition:     "background .2s",
              }}
              onMouseEnter={(e) => {
                if (status !== "submitting") e.currentTarget.style.background = T.navyHover;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = T.navy;
              }}
            >
              {status === "submitting" ? (
                <>
                  <span style={{
                    width: "7px", height: "7px", borderRadius: "50%",
                    background: T.amberLight,
                    display: "inline-block",
                    animation: "pcta-pulse 1s infinite",
                  }} />
                  Sending…
                </>
              ) : "Send request"}
            </button>

            {status === "success" && (
              <p style={{ fontSize: "13px", fontWeight: 500, color: T.success, margin: 0 }}>
                ✓ Received — we'll be in touch soon.
              </p>
            )}
            {status === "error" && (
              <p style={{ fontSize: "13px", fontWeight: 500, color: T.error, margin: 0 }}>
                Something went wrong. Try again.
              </p>
            )}
          </div>

          <p style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "11px", color: T.muted, margin: 0 }}>
            <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: T.amber, flexShrink: 0 }} />
            No spam. Typically replied within one business day.
          </p>
        </form>

        <style>{`@keyframes pcta-pulse { 0%,100%{opacity:1} 50%{opacity:.3} }`}</style>
      </motion.div>
    </div>
  );
}

export default function ProductCTA() {
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <>
      <section>
        <div className="mx-auto max-w-8xl">
          <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.98 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="relative overflow-hidden px-8 py-16 text-center shadow-[0_20px_50px_rgba(27,58,92,0.3)] sm:px-14 sm:py-20"
          >
            <div
              className="pointer-events-none absolute inset-0"
              style={{
                backgroundImage:    `url(${BG_IMAGE})`,
                backgroundSize:     "cover",
                backgroundPosition: "center",
              }}
            />

            <div className="pointer-events-none absolute inset-0 bg-[#1b3a5c]/75" />

            <div
              className="pointer-events-none absolute inset-0 opacity-100"
              style={{
                backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.09) 1px, transparent 1px)",
                backgroundSize:  "24px 24px",
              }}
            />

            <div className="pointer-events-none absolute -left-16 -top-20 h-64 w-64 rounded-full bg-[#4a9edd]/20 blur-3xl" />
            <div className="pointer-events-none absolute -bottom-20 -right-16 h-64 w-64 rounded-full bg-[#1ee8b0]/15 blur-3xl" />

            <div className="relative">
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="mx-auto max-w-3xl font-display text-4xl font-bold tracking-tight text-[#e8f3ff] sm:text-5xl"
              >
                Need bulk orders or have queries?
              </motion.h2>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="mx-auto mt-5 max-w-xl text-lg text-[#a8c8e8]"
              >
                Reach out to us — customized solutions and bulk packaging supplies, dispatched the same day.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="mt-10 flex flex-wrap justify-center gap-4"
              >
                <button
                  onClick={() => setModalOpen(true)}
                  className="group inline-flex items-center gap-2 rounded-full px-8 py-4 font-semibold transition-all duration-300 hover:-translate-y-0.5"
                  style={{
                    background: T.amber,
                    color:      "#fff",
                    border:     "none",
                    cursor:     "pointer",
                    fontFamily: "inherit",
                    fontSize:   "15px",
                    boxShadow:  "0 4px 16px rgba(212,137,26,0.35)",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background  = T.amberLight;
                    e.currentTarget.style.boxShadow   = "0 8px 24px rgba(212,137,26,0.45)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background  = T.amber;
                    e.currentTarget.style.boxShadow   = "0 4px 16px rgba(212,137,26,0.35)";
                  }}
                >
                  <FileText size={16} />
                  Get a quote
                </button>

<a
  href={`https://wa.me/919876543210?text=${encodeURIComponent(
    "Hello, I would like to know more about your products."
  )}`}
  target="_blank"
  rel="noopener noreferrer"
  className="bg-green-600 group inline-flex items-center gap-2 rounded-full border-2 border-[#4a9edd]/50 px-8 py-4 font-semibold text-[#e8f3ff] transition-all duration-300 hover:border-[#e8f3ff] hover:bg-white/10"
>
  Whatsapp Us
  <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
</a>

              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      <AnimatePresence>
        {modalOpen && <QuoteModal onClose={() => setModalOpen(false)} />}
      </AnimatePresence>
    </>
  );
}