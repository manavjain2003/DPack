"use client";

import { useEffect, useState, useCallback, useRef } from "react";



const REVIEWS = [
  {
    quote:
      "We needed customized Packaging Air Bags, and D Pack delivered exactly what we were looking for. Great quality and professional service.",
    name: "Manufacturing Company",
    rating: 5,
  },
  {
    quote:
      "D Pack's Packaging Air Bags have greatly reduced product damage during our shipments. The quality is excellent and the service is always reliable.",
    name: "Logistics Company",
    location: "Delhi",
    rating: 5,
  },
  {
    quote:
      "We have been using their Air Column Bags for packaging electronics, and the protection level is outstanding. Highly recommended for fragile items.",
    name: "Electronics Distributor",
    rating: 5,
  },
  {
    quote:
      "The Dunnage Air Bags we sourced from D Pack are strong, easy to use, and perfect for securing our cargo during transportation.",
    name: "Supply Chain & Warehouse Manager",
    rating: 5,
  },
  {
    quote:
      "D Pack offers cost-effective packaging solutions without compromising on quality. Their team is very supportive and ensures timely delivery.",
    name: "E-commerce Business Owner",
    rating: 5,
  },
];

const CARD_STYLES =
  "flex h-full flex-col justify-between rounded-2xl border border-slate-200 bg-white p-7 shadow-sm";

function Stars({ count }) {
  return (
    <div className="flex gap-0.5" aria-label={`${count} out of 5 stars`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <svg
          key={i}
          viewBox="0 0 20 20"
          className={`h-4 w-4 ${i < count ? "fill-amber-500" : "fill-slate-200"}`}
        >
          <path d="M10 1.5l2.6 5.6 6.1.6-4.6 4.1 1.3 6-5.4-3.2-5.4 3.2 1.3-6L1.3 7.7l6.1-.6L10 1.5z" />
        </svg>
      ))}
    </div>
  );
}

function ReviewCard({ review }) {
  return (
    <div className={CARD_STYLES}>
      <p className="text-[15px] leading-relaxed text-slate-600">
        {review.quote}
      </p>
      <div className="mt-8 flex items-end justify-between border-t border-slate-100 pt-4">
        <div>
          <p className="text-sm font-semibold text-slate-900">
            {review.name}
          </p>
          {review.location && (
            <p className="text-sm text-slate-400">{review.location}</p>
          )}
        </div>
        <Stars count={review.rating} />
      </div>
    </div>
  );
}

export default function Testimonials() {
  const [perView, setPerView] = useState(3);
  const [index, setIndex] = useState(0);
  const autoplayRef = useRef(null);

  useEffect(() => {
    const updatePerView = () => {
      if (window.innerWidth < 640) setPerView(1);
      else if (window.innerWidth < 1024) setPerView(2);
      else setPerView(3);
    };
    updatePerView();
    window.addEventListener("resize", updatePerView);
    return () => window.removeEventListener("resize", updatePerView);
  }, []);

  const maxIndex = Math.max(0, REVIEWS.length - perView);

  useEffect(() => {
    setIndex((i) => Math.min(i, maxIndex));
  }, [maxIndex]);

  const goTo = useCallback(
    (i) => setIndex(Math.min(Math.max(i, 0), maxIndex)),
    [maxIndex]
  );
  const next = useCallback(
    () => setIndex((i) => (i >= maxIndex ? 0 : i + 1)),
    [maxIndex]
  );
  const prev = useCallback(
    () => setIndex((i) => (i <= 0 ? maxIndex : i - 1)),
    [maxIndex]
  );

  const [paused, setPaused] = useState(false);
  useEffect(() => {
    if (paused || maxIndex === 0) return;
    autoplayRef.current = setInterval(next, 5000);
    return () => {
      if (autoplayRef.current) clearInterval(autoplayRef.current);
    };
  }, [paused, next, maxIndex]);

  return (
    <section className="bg-slate-50 py-20">
      <div className="mx-auto max-w-8xl px-6">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl">
            What Our Clients Say
          </h2>
          <p className="mt-4 text-base leading-relaxed text-slate-500">
            Trusted by logistics companies, manufacturers, and e-commerce
            businesses across India.
          </p>
        </div>

        <div
          className="relative mt-14 "
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
          onFocus={() => setPaused(true)}
          onBlur={() => setPaused(false)}
        >
          <div className="overflow-hidden">
            <div
              className="flex transition-transform duration-500 ease-out"
              style={{
                transform: `translateX(-${index * (100 / perView)}%)`,
              }}
            >
              {REVIEWS.map((review, i) => (
                <div
                  key={i}
                  className="shrink-0 px-3"
                  style={{ width: `${100 / perView}%` }}
                >
                  <ReviewCard review={review} />
                </div>
              ))}
            </div>
          </div>

          {maxIndex > 0 && (
            <>
              <button
                type="button"
                onClick={prev}
                aria-label="Previous reviews"
                className="absolute left-0 top-1/2 hidden -translate-x-1/2 -translate-y-1/2 rounded-full border border-slate-200 bg-white p-2 shadow-sm transition hover:border-slate-300 hover:shadow md:flex"
              >
                <svg viewBox="0 0 20 20" className="h-5 w-5 fill-slate-600">
                  <path d="M12.5 15.5L7 10l5.5-5.5L14 6l-4 4 4 4-1.5 1.5z" />
                </svg>
              </button>
              <button
                type="button"
                onClick={next}
                aria-label="Next reviews"
                className="absolute right-0 top-1/2 hidden translate-x-1/2 -translate-y-1/2 rounded-full border border-slate-200 bg-white p-2 shadow-sm transition hover:border-slate-300 hover:shadow md:flex"
              >
                <svg viewBox="0 0 20 20" className="h-5 w-5 fill-slate-600">
                  <path d="M7.5 4.5L13 10l-5.5 5.5L6 14l4-4-4-4 1.5-1.5z" />
                </svg>
              </button>
            </>
          )}

          {maxIndex > 0 && (
            <div className="mt-10 flex justify-center gap-2">
              {Array.from({ length: maxIndex + 1 }).map((_, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => goTo(i)}
                  aria-label={`Go to slide ${i + 1}`}
                  className={`h-2 rounded-full transition-all ${
                    i === index ? "w-6 bg-slate-900" : "w-2 bg-slate-300"
                  }`}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}