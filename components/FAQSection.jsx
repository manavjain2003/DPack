"use client";

import { useState } from "react";

// ─── Theme tokens ───────────────────────────────────────────────
const T = {
  navy:        "#1B2A4A",
  navyHover:   "#22324F",
  navyBorder:  "#2E4070",
  amber:       "#D4891A",
  amberLight:  "#F5A623",
  amberBg:     "#FDF3E3",
  amberRing:   "rgba(212,137,26,0.16)",
  cream:       "#FAF7F2",
  inputBg:     "#F2EDE4",
  border:      "#E4DDD3",
  ink:         "#1B2A4A",
  muted:       "#6B7A99",
  white:       "#FFFFFF",
  success:     "#2E7D50",
  error:       "#C0392B",
};

// ─── FAQ data ────────────────────────────────────────────────────
const FAQS = [
  {
    question: "What are Packaging Air Bags and how do they work?",
    answer:
      "Packaging Air Bags are advanced inflatable packaging solutions designed to protect products from damage during storage and transportation. They work by creating air-filled cushions that absorb shocks, vibrations, and external pressure.",
  },
  {
    question: "What are Dunnage Air Bags used for in transportation?",
    answer:
      "Dunnage Air Bags are placed inside shipping containers, trucks, and railcars to fill empty spaces between cargo. Once inflated, they hold the load firmly in place, preventing shifting, collisions, and damage during transit.",
  },
  {
    question: "What are Air Column Bags and why are they ideal for fragile items?",
    answer:
      "Air Column Bags feature individual air pockets giving 360-degree cushioning. Because each column inflates independently, they wrap closely around fragile items like electronics and glassware, absorbing impact from every direction.",
  },
  {
    question: "Are Packaging Air Bags reusable and environmentally friendly?",
    answer:
      "Yes. Our air bags are made from durable, puncture-resistant film that can be deflated, stored, and reused across multiple shipments — using significantly less raw material than foam or bubble wrap.",
  },
  {
    question: "Do you offer bulk supply and wholesale pricing?",
    answer:
      "Yes, we supply Packaging Air Bags in bulk for manufacturers, logistics companies, and e-commerce businesses, with wholesale pricing tiers based on order volume. Reach out for a custom quote.",
  },
  {
    question: "Can the bags be customized per product requirements?",
    answer:
      "Absolutely. We customize bag size, film thickness, and cushioning pattern to match your product's dimensions and fragility. Custom branding is also available for bulk orders.",
  },
];

// ─── Shared style helpers ─────────────────────────────────────────
const eyebrowStyle = {
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  gap: "10px",
  fontSize: "11px",
  fontWeight: 700,
  letterSpacing: "0.22em",
  textTransform: "uppercase",
  color: T.amber,
  marginBottom: "12px",
};

function EyebrowRule({ label, align = "center" }) {
  return (
    <p style={{ ...eyebrowStyle, justifyContent: align === "left" ? "flex-start" : "center" }}>
      <span style={{ display: "block", width: "24px", height: "1.5px", background: T.amber }} />
      {label}
      <span style={{ display: "block", width: "24px", height: "1.5px", background: T.amber }} />
    </p>
  );
}

// ─── FAQ accordion item ───────────────────────────────────────────
function FaqItem({ item, open, onToggle }) {
  return (
    <div
      style={{
        borderRadius: "14px",
        border: `1.5px solid ${open ? T.amber : T.border}`,
        background: T.white,
        overflow: "hidden",
        transition: "border-color 0.25s, box-shadow 0.25s",
        boxShadow: open ? `0 0 0 3px ${T.amberRing}` : "none",
      }}
    >
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={open}
        style={{
          width: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "12px",
          padding: "16px 18px",
          background: open ? T.amberBg : "transparent",
          border: "none",
          borderLeft: `4px solid ${open ? T.amber : "transparent"}`,
          cursor: "pointer",
          textAlign: "left",
          transition: "background 0.2s, border-color 0.2s",
        }}
      >
        <span style={{ fontSize: "14px", fontWeight: 600, color: T.navy, lineHeight: 1.4 }}>
          {item.question}
        </span>
        <span
          style={{
            width: "26px",
            height: "26px",
            borderRadius: "50%",
            flexShrink: 0,
            background: open ? T.amber : "#EDE9E2",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            transform: open ? "rotate(45deg)" : "rotate(0deg)",
            transition: "background 0.25s, transform 0.3s",
            position: "relative",
          }}
        >
          <span style={{ position: "absolute", width: "10px", height: "2px", borderRadius: "1px", background: open ? "#fff" : T.navy, transition: "background 0.25s" }} />
          <span style={{ position: "absolute", width: "2px", height: "10px", borderRadius: "1px", background: open ? "#fff" : T.navy, transition: "background 0.25s" }} />
        </span>
      </button>

      <div
        style={{
          display: "grid",
          gridTemplateRows: open ? "1fr" : "0fr",
          opacity: open ? 1 : 0,
          transition: "grid-template-rows 0.32s cubic-bezier(0.4,0,0.2,1), opacity 0.28s",
          overflow: "hidden",
        }}
      >
        <div style={{ overflow: "hidden" }}>
          <p
            style={{
              padding: "0 18px 16px 22px",
              fontSize: "13px",
              lineHeight: 1.75,
              color: T.muted,
              borderLeft: `4px solid ${T.amber}`,
            }}
          >
            {item.answer}
          </p>
        </div>
      </div>
    </div>
  );
}

// ─── FAQ panel ────────────────────────────────────────────────────
function FaqPanel() {
  const [openIndex, setOpenIndex] = useState(0);
  const toggle = (i) => setOpenIndex((cur) => (cur === i ? -1 : i));

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
      <div style={{ marginBottom: "28px" }}>
        <EyebrowRule label="Got questions" align="left" />
        <h2 style={{ fontSize: "26px", fontWeight: 700, color: T.navy, letterSpacing: "-0.02em", lineHeight: 1.2, margin: 0 }}>
          Frequently asked questions
        </h2>
        <p style={{ marginTop: "8px", fontSize: "13px", color: T.muted, lineHeight: 1.65 }}>
          Everything you need to know about our packaging solutions.
        </p>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
        {FAQS.map((item, i) => (
          <FaqItem key={i} item={item} open={openIndex === i} onToggle={() => toggle(i)} />
        ))}
      </div>
    </div>
  );
}

// ─── Form field helper ────────────────────────────────────────────
function Field({ label, optional, children }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
      <label style={{ fontSize: "12px", fontWeight: 600, color: T.navy }}>
        {label}
        {optional && (
          <span style={{ fontWeight: 400, color: T.muted, marginLeft: "4px" }}>optional</span>
        )}
      </label>
      {children}
    </div>
  );
}

const sharedInputStyle = {
  border: `1.5px solid ${T.border}`,
  borderRadius: "10px",
  background: T.inputBg,
  padding: "10px 13px",
  fontSize: "13px",
  color: T.ink,
  outline: "none",
  width: "100%",
  fontFamily: "inherit",
  transition: "border-color 0.2s, background 0.2s, box-shadow 0.2s",
};

function Input({ focusHandlers, ...props }) {
  return <input style={sharedInputStyle} {...focusHandlers} {...props} />;
}

function Textarea({ focusHandlers, ...props }) {
  return <textarea style={{ ...sharedInputStyle, resize: "none" }} {...focusHandlers} {...props} />;
}

// ─── Query form panel ─────────────────────────────────────────────
const initialForm = { name: "", email: "", phone: "", company: "", message: "" };

function QueryFormPanel() {
  const [form, setForm] = useState(initialForm);
  const [status, setStatus] = useState("idle");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
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

  const focusHandlers = {
    onFocus: (e) => {
      e.target.style.borderColor = T.amber;
      e.target.style.background = T.white;
      e.target.style.boxShadow = `0 0 0 3px ${T.amberRing}`;
    },
    onBlur: (e) => {
      e.target.style.borderColor = T.border;
      e.target.style.background = T.inputBg;
      e.target.style.boxShadow = "none";
    },
  };

  return (
    <div
      style={{
        background: T.white,
        borderRadius: "20px",
        border: `1.5px solid ${T.border}`,
        padding: "32px 28px",
        height: "100%",
        boxSizing: "border-box",
      }}
    >
      <EyebrowRule label="Get in touch" align="left" />
      <h2 style={{ fontSize: "22px", fontWeight: 700, color: T.navy, letterSpacing: "-0.02em", margin: "0 0 4px" }}>
        Send us your query
      </h2>
      <p style={{ fontSize: "13px", color: T.muted, marginBottom: "24px", lineHeight: 1.6 }}>
        Our team will get back to you within 24 hours.
      </p>

      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px" }}>
          <Field label="Full name">
            <Input name="name" type="text" required placeholder="Your name" value={form.name} onChange={handleChange} focusHandlers={focusHandlers} />
          </Field>
          <Field label="Email address">
            <Input name="email" type="email" required placeholder="you@company.com" value={form.email} onChange={handleChange} focusHandlers={focusHandlers} />
          </Field>
          <Field label="Phone number" optional>
            <Input name="phone" type="tel" placeholder="+91 98765 43210" value={form.phone} onChange={handleChange} focusHandlers={focusHandlers} />
          </Field>
          <Field label="Company name" optional>
            <Input name="company" type="text" placeholder="Your company" value={form.company} onChange={handleChange} focusHandlers={focusHandlers} />
          </Field>
        </div>

        <Field label="Your query">
          <Textarea name="message" required rows={4} placeholder="Tell us about your packaging requirement — product type, quantity, and timeline." value={form.message} onChange={handleChange} focusHandlers={focusHandlers} />
        </Field>

        <div style={{ height: "1px", background: T.border, margin: "4px 0" }} />

        <div style={{ display: "flex", alignItems: "center", gap: "16px", flexWrap: "wrap" }}>
          <button
            type="submit"
            disabled={status === "submitting"}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              background: T.navy,
              color: "#fff",
              border: "none",
              borderRadius: "10px",
              padding: "11px 24px",
              fontSize: "13px",
              fontWeight: 600,
              cursor: status === "submitting" ? "not-allowed" : "pointer",
              opacity: status === "submitting" ? 0.65 : 1,
              transition: "background 0.2s",
              fontFamily: "inherit",
            }}
            onMouseEnter={(e) => { if (status !== "submitting") e.currentTarget.style.background = T.navyHover; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = T.navy; }}
          >
            {status === "submitting" ? (
              <>
                <span
                  style={{
                    width: "7px", height: "7px", borderRadius: "50%",
                    background: T.amberLight,
                    animation: "fq-pulse 1s infinite",
                    display: "inline-block",
                  }}
                />
                Sending…
              </>
            ) : "Send query"}
          </button>

          {status === "success" && (
            <p style={{ fontSize: "13px", fontWeight: 500, color: T.success, margin: 0 }}>
              ✓ Thanks — we'll be in touch soon.
            </p>
          )}
          {status === "error" && (
            <p style={{ fontSize: "13px", fontWeight: 500, color: T.error, margin: 0 }}>
              Something went wrong. Please try again.
            </p>
          )}
        </div>

        <p style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "11px", color: T.muted, margin: 0 }}>
          <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: T.amber, flexShrink: 0 }} />
          We typically respond within one business day. No spam, ever.
        </p>
      </form>

      <style>{`@keyframes fq-pulse { 0%,100%{opacity:1} 50%{opacity:0.3} }`}</style>
    </div>
  );
}

export default function FaqQuerySection() {
  return (
    <section style={{ background: T.cream, padding: "72px 24px" }}>
      <div style={{ textAlign: "center", marginBottom: "52px" }}>
        <EyebrowRule label="Support and contact" />
        <h1
          style={{
            fontSize: "clamp(28px, 4vw, 42px)",
            fontWeight: 700,
            color: T.navy,
            letterSpacing: "-0.025em",
            lineHeight: 1.15,
            margin: "0 auto",
            maxWidth: "560px",
          }}
        >
          Have questions or ready to order?
        </h1>
        <p style={{ marginTop: "12px", fontSize: "15px", color: T.muted, maxWidth: "420px", margin: "12px auto 0", lineHeight: 1.65 }}>
          Browse common questions on the left, or drop us a message directly — we'll handle both.
        </p>
      </div>

      <div
        style={{
          maxWidth: "1200px",
          margin: "0 auto",
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "32px",
          alignItems: "start",
        }}
      >
        <div>
          <FaqPanel />
        </div>

        <div style={{ position: "sticky", top: "24px" }}>
          <QueryFormPanel />
        </div>
      </div>

      <style>{`
        @media (max-width: 860px) {
          .faq-query-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </section>
  );
}