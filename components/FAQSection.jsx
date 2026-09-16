"use client";
import { useState } from "react";

const FAQS = [
  {
    question: "What are Packaging Air Bags and how do they work?",
    answer:
      "Packaging Air Bags are advanced inflatable packaging solutions designed to protect products from damage during storage and transportation. They work by creating air-filled cushions that absorb shocks, vibrations, and external pressure. This protective layer ensures that products remain safe and intact throughout the shipping process, especially for fragile and high-value items.",
  },
  {
    question: "What are Dunnage Air Bags used for in transportation?",
    answer:
      "Dunnage Air Bags are placed inside shipping containers, trucks, and railcars to fill empty spaces between cargo. Once inflated, they hold the load firmly in place, preventing shifting, collisions, and damage caused by movement during transit.",
  },
  {
    question: "What are Air Column Bags and why are they ideal for fragile items?",
    answer:
      "Air Column Bags are made up of individual air pockets running along the length of the bag, giving 360-degree cushioning around a product. Because each column inflates independently, they wrap closely around fragile items like electronics and glassware, absorbing impact from every direction.",
  },
  {
    question: "Are Packaging Air Bags reusable and environmentally friendly?",
    answer:
      "Yes. Our air bags are made from durable, puncture-resistant film that can be deflated, stored, and reused across multiple shipments. They also use significantly less raw material than traditional packaging like foam or bubble wrap, reducing overall waste.",
  },
  {
    question: "Do you offer bulk supply and wholesale pricing for Packaging Air Bags?",
    answer:
      "Yes, we supply Packaging Air Bags in bulk for manufacturers, logistics companies, and e-commerce businesses, with wholesale pricing tiers based on order volume. Reach out to our team with your monthly requirement for a custom quote.",
  },
  {
    question: "Can Packaging Air Bags be customized as per product requirements?",
    answer:
      "Absolutely. We customize bag size, film thickness, and cushioning pattern to match your product's dimensions and fragility. Custom branding and packaging specifications are also available for bulk orders.",
  },
];

function PlusMinusIcon({ open }) {
  return (
    <span
      className="relative flex h-7 w-7 shrink-0 items-center justify-center rounded-full transition-all duration-300"
      style={{
        backgroundColor: open ? "#D4891A" : "#EDE9E2",
        transform: open ? "rotate(45deg)" : "rotate(0deg)",
      }}
    >
      {/* Horizontal bar */}
      <span
        className="absolute h-0.5 w-2.5 rounded-sm transition-colors duration-300"
        style={{ backgroundColor: open ? "#ffffff" : "#1B2A4A" }}
      />
      {/* Vertical bar */}
      <span
        className="absolute h-2.5 w-0.5 rounded-sm transition-colors duration-300"
        style={{ backgroundColor: open ? "#ffffff" : "#1B2A4A" }}
      />
    </span>
  );
}

function FaqItem({ item, open, onToggle }) {
  return (
    <div
      className="overflow-hidden rounded-2xl border bg-white transition-all duration-300"
      style={{
        borderColor: open ? "#D4891A" : "#E8E2D9",
        borderWidth: "1.5px",
        boxShadow: open ? "0 0 0 3px rgba(212,137,26,0.10)" : "none",
      }}
    >
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={open}
        className="flex w-full items-center justify-between gap-4 border-l-4 px-5 py-[18px] text-left transition-all duration-300 sm:px-6"
        style={{
          borderLeftColor: open ? "#D4891A" : "transparent",
          backgroundColor: open ? "#FDF3E3" : "transparent",
        }}
      >
        <span
          className="text-[15px] font-semibold leading-snug"
          style={{ color: "#1B2A4A" }}
        >
          {item.question}
        </span>
        <PlusMinusIcon open={open} />
      </button>

      <div
        className={`grid overflow-hidden transition-all duration-300 ease-in-out ${
          open ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
        }`}
      >
        <div className="overflow-hidden">
          <p
            className="border-l-4 pb-5 pl-5 pr-6 pt-4 text-sm leading-relaxed sm:pl-6"
            style={{
              color: "#6B7A99",
              borderLeftColor: "#D4891A",
              marginLeft: "0",
            }}
          >
            {item.answer}
          </p>
        </div>
      </div>
    </div>
  );
}

export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState(0);

  const toggle = (i) => setOpenIndex((current) => (current === i ? -1 : i));

  return (
    <section className="py-20" style={{ backgroundColor: "#FAF7F2" }}>
      <div className="mx-auto max-w-6xl px-6">
        {/* Header */}
        <div className="text-center">
          <p
            className="mb-3 flex items-center justify-center gap-3 text-[11px] font-bold uppercase tracking-[0.22em]"
            style={{ color: "#D4891A" }}
          >
            <span
              className="h-px w-7"
              style={{ backgroundColor: "#D4891A" }}
            />
            Got questions
            <span
              className="h-px w-7"
              style={{ backgroundColor: "#D4891A" }}
            />
          </p>
          <h2
            className="font-display text-4xl font-bold tracking-tight sm:text-5xl"
            style={{ color: "#1B2A4A" }}
          >
            Frequently Asked Questions
          </h2>
          <p className="mt-4 text-base" style={{ color: "#6B7A99" }}>
            Everything you need to know about our packaging solutions.
          </p>
        </div>

        {/* FAQ List */}
        <div className="mt-12 flex flex-col gap-3">
          {FAQS.map((item, i) => (
            <FaqItem
              key={i}
              item={item}
              open={openIndex === i}
              onToggle={() => toggle(i)}
            />
          ))}
        </div>
      </div>
    </section>
  );
}