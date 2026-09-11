"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Send } from "lucide-react";
import { EMAIL } from "@/lib/products";

const inputCls =
  "w-full rounded-2xl border border-ink/15 bg-white px-4 py-3 text-sm outline-none transition-all placeholder:text-ink/35 focus:border-rust focus:ring-2 focus:ring-rust/20";

export default function ContactForm() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });

  const onChange = (e) =>
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const onSubmit = (e) => {
    e.preventDefault();
    const subject = encodeURIComponent(`Website enquiry from ${form.name}`);
    const body = encodeURIComponent(
      `Name: ${form.name}\nEmail: ${form.email}\nPhone: ${form.phone}\n\n${form.message}`
    );
    window.location.href = `mailto:${EMAIL}?subject=${subject}&body=${body}`;
  };

  return (
    <motion.form
      onSubmit={onSubmit}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.6 }}
      className="rounded-[2rem] border border-ink/10 bg-cream-dark/40 p-7 shadow-card sm:p-9"
    >
      <h3 className="font-display text-2xl font-bold">Send us a message</h3>
      <p className="mt-1.5 text-sm text-ink/55">
        Fill this in and your email app will open — or write to us directly at{" "}
        <a href={`mailto:${EMAIL}`} className="font-semibold text-rust">
          {EMAIL}
        </a>
        .
      </p>

      <div className="mt-7 grid gap-4 sm:grid-cols-2">
        <input
          required
          name="name"
          value={form.name}
          onChange={onChange}
          placeholder="Your name"
          className={inputCls}
        />
        <input
          required
          type="email"
          name="email"
          value={form.email}
          onChange={onChange}
          placeholder="Email address"
          className={inputCls}
        />
        <input
          name="phone"
          value={form.phone}
          onChange={onChange}
          placeholder="Phone (optional)"
          className={`${inputCls} sm:col-span-2`}
        />
        <textarea
          required
          name="message"
          value={form.message}
          onChange={onChange}
          placeholder="What do you ship, and what do you need packed?"
          rows={5}
          className={`${inputCls} resize-none sm:col-span-2`}
        />
      </div>

      <button
        type="submit"
        className="group mt-6 inline-flex items-center gap-2 rounded-full bg-rust px-8 py-3.5 font-semibold text-cream shadow-card transition-all duration-300 hover:-translate-y-0.5 hover:bg-rust-dark"
      >
        Send enquiry
        <Send className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
      </button>
    </motion.form>
  );
}
