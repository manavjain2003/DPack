import Navbar from "@/components/Navbar";
import PageHeader from "@/components/PageHeader";
import ContactForm from "@/components/ContactForm";
import Footer from "@/components/Footer";
import { EMAIL } from "@/lib/products";
import { Mail, Truck, Timer, PackageCheck } from "lucide-react";

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

export default function ContactPage() {
  return (
    <main className="overflow-x-clip">
      <Navbar />
      <PageHeader
        eyebrow="Contact"
        title="Need bulk orders or have queries?"
        subtitle={`Reach out to us at ${EMAIL} — or send a message below and we'll get back with the right packaging solution.`}
      />

      <section className="pb-24">
        <div className="mx-auto grid max-w-8xl gap-10 px-5 sm:px-8 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
            {cards.map((c) => (
              <div
                key={c.title}
                className="rounded-3xl border border-ink/10 bg-white p-6 shadow-sm transition-shadow duration-300 hover:shadow-card"
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

          <ContactForm />
        </div>

        <div className="mx-auto mt-14 max-w-7xl px-5 sm:px-8">
          <div className="rounded-3xl border border-ink/10 bg-cream-dark/50 p-6 text-sm leading-relaxed text-ink/60">
            <span className="font-display font-bold text-ink">Disclaimer — </span>
            All orders are dispatched on the same day. Delivery timelines may
            vary and can take 7–10 working days.
          </div>
        </div>
      </section>
      <h1 className="text-[28px] text-center font-semibold"> Visit our Office in Person Meetings and Consulatation</h1>
<div className="rounded-3xl overflow-hidden shadow-2xl border m-8">
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
      <Footer />
    </main>
  );
}
