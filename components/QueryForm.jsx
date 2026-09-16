"use client";

import { useState } from "react";

const initialForm = {
  name: "",
  email: "",
  phone: "",
  company: "",
  message: "",
};

export default function QueryForm() {
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
      await new Promise((resolve) => setTimeout(resolve, 800));
      setStatus("success");
      setForm(initialForm);
    } catch {
      setStatus("error");
    }
  };

  const inputClass =
    "rounded-xl border px-4 py-3 text-sm outline-none transition-all duration-200";
  const inputStyle = {
    borderColor: "#DDD8CC",
    backgroundColor: "#F0EDE6",
    color: "#1A3C2E",
  };

  return (
    <section className="py-20" style={{ backgroundColor: "#F7F4EE" }}>
      <div className="mx-auto max-w-6xl px-6">
        {/* Header */}
        <div className="text-center">
          <p
            className="mb-3 flex items-center justify-center gap-3 text-[11px] font-bold uppercase tracking-[0.22em]"
            style={{ color: "#B8860B" }}
          >
            <span className="h-px w-7" style={{ backgroundColor: "#B8860B" }} />
            Get in touch
            <span className="h-px w-7" style={{ backgroundColor: "#B8860B" }} />
          </p>
          <h2
            className="text-4xl font-bold tracking-tight sm:text-5xl"
            style={{ color: "#1A3C2E" }}
          >
            Send Us Your Query
          </h2>
          <p className="mt-4 text-sm" style={{ color: "#6B7A6E" }}>
            Tell us what you need and our team will get back to you within 24 hours.
          </p>
        </div>

        {/* Card */}
        <form
          onSubmit={handleSubmit}
          className="mt-12 rounded-2xl bg-white p-8 sm:p-10"
          style={{ border: "1.5px solid #DDD8CC" }}
        >
          <div className="grid gap-5 sm:grid-cols-2">
            {/* Full name */}
            <div className="flex flex-col gap-2">
              <label
                htmlFor="name"
                className="text-sm font-semibold"
                style={{ color: "#1A3C2E" }}
              >
                Full name
              </label>
              <input
                id="name"
                name="name"
                type="text"
                required
                value={form.name}
                onChange={handleChange}
                placeholder="Your name"
                className={inputClass}
                style={inputStyle}
                onFocus={(e) => {
                  e.target.style.borderColor = "#B8860B";
                  e.target.style.backgroundColor = "#ffffff";
                  e.target.style.boxShadow = "0 0 0 3px rgba(184,134,11,0.18)";
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = "#DDD8CC";
                  e.target.style.backgroundColor = "#F0EDE6";
                  e.target.style.boxShadow = "none";
                }}
              />
            </div>

            {/* Email */}
            <div className="flex flex-col gap-2">
              <label
                htmlFor="email"
                className="text-sm font-semibold"
                style={{ color: "#1A3C2E" }}
              >
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                value={form.email}
                onChange={handleChange}
                placeholder="you@company.com"
                className={inputClass}
                style={inputStyle}
                onFocus={(e) => {
                  e.target.style.borderColor = "#B8860B";
                  e.target.style.backgroundColor = "#ffffff";
                  e.target.style.boxShadow = "0 0 0 3px rgba(184,134,11,0.18)";
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = "#DDD8CC";
                  e.target.style.backgroundColor = "#F0EDE6";
                  e.target.style.boxShadow = "none";
                }}
              />
            </div>

            {/* Phone */}
            <div className="flex flex-col gap-2">
              <label
                htmlFor="phone"
                className="text-sm font-semibold"
                style={{ color: "#1A3C2E" }}
              >
                Phone number{" "}
                <span className="text-xs font-normal" style={{ color: "#6B7A6E" }}>
                  optional
                </span>
              </label>
              <input
                id="phone"
                name="phone"
                type="tel"
                value={form.phone}
                onChange={handleChange}
                placeholder="+91 98765 43210"
                className={inputClass}
                style={inputStyle}
                onFocus={(e) => {
                  e.target.style.borderColor = "#B8860B";
                  e.target.style.backgroundColor = "#ffffff";
                  e.target.style.boxShadow = "0 0 0 3px rgba(184,134,11,0.18)";
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = "#DDD8CC";
                  e.target.style.backgroundColor = "#F0EDE6";
                  e.target.style.boxShadow = "none";
                }}
              />
            </div>

            {/* Company */}
            <div className="flex flex-col gap-2">
              <label
                htmlFor="company"
                className="text-sm font-semibold"
                style={{ color: "#1A3C2E" }}
              >
                Company name{" "}
                <span className="text-xs font-normal" style={{ color: "#6B7A6E" }}>
                  optional
                </span>
              </label>
              <input
                id="company"
                name="company"
                type="text"
                value={form.company}
                onChange={handleChange}
                placeholder="Your company"
                className={inputClass}
                style={inputStyle}
                onFocus={(e) => {
                  e.target.style.borderColor = "#B8860B";
                  e.target.style.backgroundColor = "#ffffff";
                  e.target.style.boxShadow = "0 0 0 3px rgba(184,134,11,0.18)";
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = "#DDD8CC";
                  e.target.style.backgroundColor = "#F0EDE6";
                  e.target.style.boxShadow = "none";
                }}
              />
            </div>
          </div>

          {/* Message */}
          <div className="mt-5 flex flex-col gap-2">
            <label
              htmlFor="message"
              className="text-sm font-semibold"
              style={{ color: "#1A3C2E" }}
            >
              Your query
            </label>
            <textarea
              id="message"
              name="message"
              required
              rows={5}
              value={form.message}
              onChange={handleChange}
              placeholder="Tell us about your packaging requirement — product type, quantity, and timeline."
              className={`resize-none ${inputClass}`}
              style={inputStyle}
              onFocus={(e) => {
                e.target.style.borderColor = "#B8860B";
                e.target.style.backgroundColor = "#ffffff";
                e.target.style.boxShadow = "0 0 0 3px rgba(184,134,11,0.18)";
              }}
              onBlur={(e) => {
                e.target.style.borderColor = "#DDD8CC";
                e.target.style.backgroundColor = "#F0EDE6";
                e.target.style.boxShadow = "none";
              }}
            />
          </div>

          {/* Divider */}
          <div className="mt-7 h-px" style={{ backgroundColor: "#DDD8CC" }} />

          {/* Footer */}
          <div className="mt-6 flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between">
            <button
              type="submit"
              disabled={status === "submitting"}
              className="inline-flex items-center gap-2 rounded-xl px-8 py-3 text-sm font-semibold text-white transition-all duration-200 disabled:cursor-not-allowed disabled:opacity-60"
              style={{ backgroundColor: "#1A3C2E" }}
              onMouseEnter={(e) => {
                if (status !== "submitting") e.target.style.backgroundColor = "#22503D";
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = "#1A3C2E";
              }}
            >
              {status === "submitting" ? (
                <>
                  <span
                    className="h-2 w-2 animate-pulse rounded-full"
                    style={{ backgroundColor: "#D4A017" }}
                  />
                  Sending…
                </>
              ) : (
                "Send query"
              )}
            </button>

            {status === "success" && (
              <p className="text-sm font-medium" style={{ color: "#2E7D50" }}>
                ✓ Thanks — we'll be in touch soon.
              </p>
            )}
            {status === "error" && (
              <p className="text-sm font-medium" style={{ color: "#C0392B" }}>
                Something went wrong. Please try again.
              </p>
            )}
          </div>

          {/* Footnote */}
          <p className="mt-4 flex items-center gap-2 text-xs" style={{ color: "#6B7A6E" }}>
            <span
              className="h-1.5 w-1.5 rounded-full"
              style={{ backgroundColor: "#B8860B" }}
            />
            We typically respond within one business day. No spam, ever.
          </p>
        </form>
      </div>
    </section>
  );
}