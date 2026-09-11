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
    <svg
      viewBox="0 0 20 20"
      className={`h-4 w-4 shrink-0 fill-amber-500 transition-transform duration-200 ${
        open ? "rotate-180" : ""
      }`}
    >
      <rect x="8.5" y="2" width="3" height="16" className={open ? "opacity-0" : "opacity-100"} />
      <rect x="2" y="8.5" width="16" height="3" />
    </svg>
  );
}

function FaqItem({ item, open, onToggle }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-slate-50">
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={open}
        className="flex w-full items-center justify-between gap-6 px-7 py-6 text-left"
      >
        <span className="text-base font-semibold text-slate-900">
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
          <p className="px-7 pb-6 text-[15px] leading-relaxed text-slate-500">
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
    <section className="bg-white py-20">
      <div className="mx-auto max-w-6xl px-6">
        <div className="text-center">
          <h2 className="text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl">
            Frequently Asked Questions
          </h2>
          <p className="mt-4 text-base text-slate-500">
            Everything you need to know about our packaging solutions.
          </p>
        </div>

        <div className="mt-12 flex flex-col gap-4">
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