"use client";

import { useState } from "react";

export default function FAQAccordion({ faqs }) {
  const [openIndex, setOpenIndex] = useState(null);

  const toggle = (index) => {
    setOpenIndex((prev) => (prev === index ? null : index));
  };

  return (
    <div className="flex flex-col gap-2">
      {faqs.map((faq, index) => {
        const isOpen = openIndex === index;

        return (
          <div
            key={faq.q}
            className={`overflow-hidden rounded-[14px] border-[1.5px] bg-white transition-[border-color,box-shadow] duration-250 ${
              isOpen
                ? "border-[#D4891A] shadow-[0_0_0_3px_rgba(212,137,26,0.16)]"
                : "border-[#E4DDD3]"
            }`}
          >
            <button
              type="button"
              onClick={() => toggle(index)}
              className={`flex w-full cursor-pointer items-center justify-between gap-3 border-l-4 bg-transparent px-[18px] py-4 text-left transition-colors duration-200 ${
                isOpen
                  ? "border-[#D4891A] bg-[#FDF3E3]"
                  : "border-transparent"
              }`}
            >
              <span className="text-sm font-semibold leading-snug text-[#1B2A4A]">
                {faq.q}
              </span>
              <span
                className={`relative grid h-[26px] w-[26px] shrink-0 place-items-center rounded-full transition-all duration-300 ${
                  isOpen ? "rotate-45 bg-[#D4891A]" : "bg-[#EDE9E2]"
                }`}
              >
                <span
                  className={`absolute h-0.5 w-2.5 rounded-sm transition-colors duration-250 ${
                    isOpen ? "bg-white" : "bg-[#1B2A4A]"
                  }`}
                />
                <span
                  className={`absolute h-2.5 w-0.5 rounded-sm transition-colors duration-250 ${
                    isOpen ? "bg-white" : "bg-[#1B2A4A]"
                  }`}
                />
              </span>
            </button>

            <div
              className={`grid transition-all duration-300 ease-in-out ${
                isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
              }`}
            >
              <div className="overflow-hidden">
                <p className="border-l-4 border-[#D4891A] px-[18px] pt-2 pb-4 pl-[22px] text-[13px] leading-[1.75] text-[#6B7A99]">
                  {faq.a}
                </p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}