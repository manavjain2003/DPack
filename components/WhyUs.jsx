"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  ArrowRight,
  BadgeCheck,
  PackageCheck,
  Truck,
  Warehouse,
} from "lucide-react";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const features = [
  {
    icon: Truck,
    title: "Same-day dispatch",
    text: "All orders are dispatched on the same day — your packing line never has to wait for supplies.",
  },
  {
    icon: Warehouse,
    title: "Built for logistics & e-commerce",
    text: "Cargo securing and industrial packaging tailored to the demands of logistics, warehousing and e-commerce businesses.",
  },
  {
    icon: PackageCheck,
    title: "Customized & bulk orders",
    text: "Whether you need customized solutions or bulk packaging supplies, we size things to your operation.",
  },
  {
    icon: BadgeCheck,
    title: "Quality at competitive prices",
    text: "Dpackshop delivers quality and reliability at competitive prices — protection without the premium markup.",
  },
];

export default function WhyUs() {
  const sectionRef = useRef(null);
  const stickyRef = useRef(null);
  const cardsRef = useRef([]);
  cardsRef.current = [];

  const addCardRef = (el) => {
    if (el && !cardsRef.current.includes(el)) {
      cardsRef.current.push(el);
    }
  };

  useEffect(() => {
    const cleanupFns = [];

    const ctx = gsap.context(() => {
      // Sticky column parallax
      gsap.to(stickyRef.current, {
        y: -60,
        ease: "none",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top bottom",
          end: "bottom top",
          scrub: 1,
        },
      });

      // --- Card entrance: staggered 3D flip-in with perspective ---
      cardsRef.current.forEach((card, i) => {
        gsap.set(card, { transformPerspective: 800 });

        gsap.fromTo(
          card,
          {
            opacity: 0,
            y: 70,
            rotateX: -25,
            scale: 0.9,
          },
          {
            opacity: 1,
            y: 0,
            rotateX: 0,
            scale: 1,
            duration: 0.9,
            ease: "power3.out",
            delay: i * 0.12,
            scrollTrigger: {
              trigger: card,
              start: "top 85%",
              toggleActions: "play none none reverse",
            },
          }
        );

        // Shine sweep across each card, replayed on every scroll-in
        const shine = card.querySelector(".card-shine");
        if (shine) {
          gsap.fromTo(
            shine,
            { xPercent: -150 },
            {
              xPercent: 150,
              duration: 1.1,
              ease: "power2.inOut",
              delay: i * 0.12 + 0.35,
              scrollTrigger: {
                trigger: card,
                start: "top 85%",
                toggleActions: "play none none reverse",
              },
            }
          );
        }
      });

      // --- Icon pop-in + idle float ---
      const icons = gsap.utils.toArray(".whyus-icon");
      icons.forEach((icon, i) => {
        gsap.fromTo(
          icon,
          { scale: 0.4, rotate: -25, opacity: 0 },
          {
            scale: 1,
            rotate: 0,
            opacity: 1,
            duration: 0.6,
            ease: "back.out(2.2)",
            delay: i * 0.05 + 0.2,
            scrollTrigger: {
              trigger: icon,
              start: "top 88%",
              toggleActions: "play none none reverse",
            },
            onComplete: () => {
              gsap.to(icon, {
                y: -6,
                duration: 1.8,
                ease: "sine.inOut",
                yoyo: true,
                repeat: -1,
              });
            },
          }
        );
      });

      // --- Magnetic tilt on hover (desktop only) ---
      const isDesktop = window.matchMedia("(hover: hover)").matches;
      if (isDesktop) {
        cardsRef.current.forEach((card) => {
          const xTo = gsap.quickTo(card, "rotateY", {
            duration: 0.5,
            ease: "power3.out",
          });
          const yTo = gsap.quickTo(card, "rotateX", {
            duration: 0.5,
            ease: "power3.out",
          });
          const liftTo = gsap.quickTo(card, "y", {
            duration: 0.5,
            ease: "power3.out",
          });

          const handleMove = (e) => {
            const rect = card.getBoundingClientRect();
            const px = (e.clientX - rect.left) / rect.width - 0.5;
            const py = (e.clientY - rect.top) / rect.height - 0.5;
            xTo(px * 14);
            yTo(py * -14);
            liftTo(-8);
          };

          const handleLeave = () => {
            xTo(0);
            yTo(0);
            liftTo(0);
          };

          card.addEventListener("mousemove", handleMove);
          card.addEventListener("mouseleave", handleLeave);

          cleanupFns.push(() => {
            card.removeEventListener("mousemove", handleMove);
            card.removeEventListener("mouseleave", handleLeave);
          });
        });
      }
    }, sectionRef);

    return () => {
      cleanupFns.forEach((fn) => fn());
      ctx.revert();
    };
  }, []);

  return (
    <section ref={sectionRef} className="bg-gray-50 py-24 sm:py-32">
      <div className="mx-auto grid max-w-8xl gap-14 px-5 sm:px-8 lg:grid-cols-[0.9fr_1.1fr]">
        <div ref={stickyRef} className="lg:sticky lg:top-32 lg:self-start">
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.5 }}
            className="mb-3 flex items-center gap-3 text-xs font-bold uppercase tracking-[0.28em] text-rust"
          >
            <span className="h-px w-8 bg-rust" />
            Why Dpack
          </motion.p>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.6, delay: 0.08 }}
            className="font-display text-4xl font-bold tracking-tight text-ink sm:text-5xl"
          >
            One roof. Every packaging problem solved.
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.6, delay: 0.16 }}
            className="mt-6 max-w-md leading-relaxed text-ink/60"
          >
            From air column bags and gap fillers to ratchet belts, composite
            straps and packaging tapes — Dpackshop carries the full cargo
            securing range, so you never juggle multiple vendors.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.6, delay: 0.24 }}
            className="mt-8"
          >
            <Link
              href="/about"
              className="group inline-flex items-center gap-2 rounded-full bg-ink px-7 py-3.5 font-semibold text-cream shadow-card transition-all duration-300 hover:-translate-y-0.5 hover:bg-rust hover:shadow-lift"
            >
              More about us
              <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
          </motion.div>
        </div>

        <div className="grid gap-5 sm:grid-cols-2" style={{ perspective: 1000 }}>
          {features.map((f, i) => (
            <div
              key={f.title}
              ref={addCardRef}
              className={`group relative overflow-hidden rounded-3xl border border-ink/10 bg-white p-7 shadow-sm transition-shadow duration-300 hover:shadow-card light-gold will-change-transform ${
                i % 2 === 1 ? "sm:translate-y-8" : ""
              }`}
              style={{ transformStyle: "preserve-3d" }}
            >
              {/* animated shine sweep */}
              <span
                className="card-shine pointer-events-none absolute inset-y-0 left-0 w-1/3 -skew-x-12 bg-gradient-to-r from-transparent via-white/60 to-transparent"
                aria-hidden="true"
              />

              {/* subtle number watermark for a stylish touch */}
              <span className="pointer-events-none absolute -right-2 -top-4 font-display text-7xl font-black text-ink/[0.04] select-none">
                {String(i + 1).padStart(2, "0")}
              </span>

              <span className="whyus-icon relative z-10 mb-5 grid h-12 w-12 place-items-center rounded-2xl bg-rust/10 text-rust transition-colors duration-300 group-hover:bg-rust group-hover:text-white">
                <f.icon className="h-6 w-6" strokeWidth={1.8} />
              </span>

              <h3 className="relative z-10 font-display text-lg font-bold text-ink">
                {f.title}
              </h3>
              <p className="relative z-10 mt-2 text-sm leading-relaxed text-ink/60">
                {f.text}
              </p>

              {/* accent underline that grows on hover */}
              <span className="relative z-10 mt-4 block h-0.5 w-8 origin-left scale-x-100 bg-rust/30 transition-all duration-300 group-hover:w-14 group-hover:bg-rust" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}