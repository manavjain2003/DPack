import Navbar from "@/components/Navbar";
import PageHeader from "@/components/PageHeader";
import ContactForm from "@/components/ContactForm";
import Footer from "@/components/Footer";
import { EMAIL } from "@/lib/products";
import { Mail, Truck, Timer, PackageCheck } from "lucide-react";
import FAQAccordion from "@/components/FAQAccordion"; // ← new client component

export const metadata = {
  title: "Contact — Dpack | Bulk Orders & Queries",
  description:
    "Need bulk orders or have queries? Reach out to Dpackshop at info@dpacksolutions.com. All orders dispatched same day; delivery in 7–10 working days.",
};

const cards = [
  {
    icon: Mail,
    title: "Email us",
    lines: [EMAIL, "For orders, quotes & queries"],
  },
  {
    icon: Truck,
    title: "Dispatch",
    lines: ["Same day", "All orders are dispatched on the same day"],
  },
  {
    icon: Timer,
    title: "Delivery",
    lines: ["7–10 working days", "Timelines may vary by location"],
  },
  {
    icon: PackageCheck,
    title: "Bulk & custom",
    lines: ["Customized solutions", "Bulk packaging supplies available"],
  },
];

const faqs = [
  {
    q: "What is the delivery time?",
    a: "All orders are dispatched on the same day. Delivery typically takes 7–10 working days depending on your location.",
  },
  {
    q: "Do you offer bulk discounts?",
    a: "Yes, we offer competitive pricing for bulk orders. Reach out to us at the email above for a custom quote.",
  },
  {
    q: "Can you help me choose the right product?",
    a: "Absolutely. Contact us with your requirements and our team will recommend the best packaging solution for you.",
  },
  {
    q: "How can I track my order?",
    a: "Once dispatched, you'll receive a tracking number via email to monitor your delivery.",
  },
];

export default function ContactPage() {
  return (
    <main className="overflow-x-clip">
      <Navbar />
      <PageHeader
        eyebrow="Contact"
        title="Need bulk orders or have queries?"
        subtitle={`Reach out to us at ${EMAIL} — or send a message below and we'll get back with the right packaging solution.`}
        backgroundImage="/banner1.webp"
      />

      <section className="pb-24 pt-8">
        <div className="mx-auto max-w-8xl px-5 sm:px-8">
          <div className="mb-10 grid grid-cols-2 gap-5 sm:grid-cols-4">
            {cards.map((c) => (
              <div
                key={c.title}
                className="light-gold rounded-3xl border border-ink/10 p-6 shadow-sm transition-shadow duration-300 hover:shadow-card"
              >
                <span className="mb-4 grid h-11 w-11 place-items-center rounded-2xl bg-rust/10 text-rust">
                  <c.icon className="h-5 w-5" />
                </span>
                <h3 className="font-display text-base font-bold">{c.title}</h3>
                {c.lines.map((l, i) => (
                  <p
                    key={l}
                    className={`mt-1 ${i === 0 ? "font-semibold text-ink" : "text-sm text-ink/50"}`}
                  >
                    {l}
                  </p>
                ))}
              </div>
            ))}
          </div>

          <div className="grid gap-10 lg:grid-cols-[1fr_1fr]">
            <div className="flex flex-col gap-6">
              <ContactForm />
            </div>

            <div className="flex flex-col gap-8">
              <div className="relative overflow-hidden rounded-3xl">
                <img
                  src="/banner1.webp"
                  alt="Dpack office"
                  className="h-64 w-full object-cover"
                />
              </div>

              <div>
                <h2 className="mb-4 font-display text-xl font-bold text-ink">
                  Frequently Asked Questions
                </h2>
                {/* Exclusive accordion */}
                <FAQAccordion faqs={faqs} />
              </div>
            </div>
          </div>

          <div className="mt-14">
            {/* <div className="rounded-3xl border border-ink/10 bg-cream-dark/50 p-6 text-sm leading-relaxed text-ink/60">
              <span className="font-display font-bold text-ink">
                Disclaimer —{" "}
              </span>
              All orders are dispatched on the same day. Delivery timelines may
              vary and can take 7–10 working days.
            </div> */}
          </div>
        </div>

        <div className="mx-auto mt-14 max-w-8xl px-5 sm:px-8">
          <div className="mb-6">
            <h2 className="font-display text-2xl font-bold text-ink">
              Find Us
            </h2>
            <p className="mt-1 text-sm text-ink/50">
              Visit us at our location in New Delhi, India
            </p>
          </div>

          <div className="overflow-hidden rounded-3xl border shadow-2xl">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d448464.0016371671!2d77.186946!3d28.581021!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390d0514d5bc617f%3A0x956288c4b1ee3c64!2sDpack!5e0!3m2!1sen!2sus!4v1775736735172!5m2!1sen!2sus"
              width="100%"
              height="450"
              style={{ display: "block", border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}