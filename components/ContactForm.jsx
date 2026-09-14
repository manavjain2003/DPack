"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Send } from "lucide-react";
import axios from "axios";
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
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const onChange = (e) =>
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const onSubmit = async (e) => {
    e.preventDefault();

    // Phone validation (10 digits) — only if a phone is provided
    if (form.phone && !/^\d{10}$/.test(form.phone.trim())) {
      return alert("Enter a valid 10-digit phone number");
    }

    const data = {
      platform: "DPACK Contact Page",
      supplierToken: "6a266629a0e54917311a8ce5",
      platformEmail: "dpacksolutionindia@gmail.com",
      name: form.name,
      email: form.email,
      company: "NA",
      phone: form.phone || "NA",
      product: "Dunnage Bag",
      place: "NA", // no city field in this form
      message: form.message,
    };

    try {
      setLoading(true);

      const res = await axios.post(
        "https://brandbnalo.com/api/form/add",
        data,
        { validateStatus: (status) => status >= 200 && status < 500 }
      );

      if (res.status >= 200 && res.status < 300) {
        setSubmitted(true);
        setForm({ name: "", email: "", phone: "", message: "" });

        // hide thank-you message after 3 seconds
        setTimeout(() => {
          setSubmitted(false);
        }, 3000);
      } else {
        alert("Something went wrong");
      }
    } catch (err) {
      console.log("ERROR:", err?.response || err.message);
      alert("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-[2rem] border border-ink/10 bg-cream-dark/40 p-7 shadow-card sm:p-9 text-center"
      >
        <h3 className="font-display text-2xl font-bold text-rust">
          🎉 Thank You!
        </h3>
        <p className="mt-2 text-ink/70">
          Your enquiry has been submitted successfully.
        </p>
        <p className="mt-1 text-sm text-ink/55">
          Our team will contact you shortly.
        </p>
      </motion.div>
    );
  }

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
        Fill this in and we’ll get back to you soon — or write to us directly at{" "}
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
        disabled={loading}
        className="group mt-6 inline-flex items-center gap-2 rounded-full bg-rust px-8 py-3.5 font-semibold text-cream shadow-card transition-all duration-300 hover:-translate-y-0.5 hover:bg-rust-dark disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:translate-y-0"
      >
        {loading ? "Submitting..." : "Send enquiry"}
        {!loading && (
          <Send className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        )}
      </button>
    </motion.form>
  );
}