import Link from "next/link";
import { EMAIL, fullRange, products } from "@/lib/products";

export default function Footer() {
  return (
    <footer className="bg-grid-light bg-ink pb-10 pt-16 text-cream/70">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <div className="grid gap-12 md:grid-cols-[1.4fr_1fr_1fr_1fr]">
          <div>
            <Link href="/" className="flex items-center gap-3">
              <img src="https://packingairbag.com/_next/image?url=%2Flogo.png&w=256&q=75"  width={120}/>
            </Link>
            <p className="mt-5 max-w-xs text-sm leading-relaxed">
              The official online store of Dpack — cargo securing and
              industrial packaging for logistics, warehousing and e-commerce.
            </p>
          </div>

          <div>
            <h4 className="mb-4 font-display text-sm font-bold uppercase tracking-[0.2em] text-cream">
              Products
            </h4>
            <ul className="space-y-2.5 text-sm">
              {products.slice(0, 5).map((p) => (
                <li key={p.slug}>
                  <Link
                    href="/products"
                    className="transition-colors hover:text-rust-light"
                  >
                    {p.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="mb-4 font-display text-sm font-bold uppercase tracking-[0.2em] text-cream">
              Company
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link href="/" className="transition-colors hover:text-rust-light">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/products" className="transition-colors hover:text-rust-light">
                  Products
                </Link>
              </li>
              <li>
                <Link href="/about" className="transition-colors hover:text-rust-light">
                  About
                </Link>
              </li>
              <li>
                <Link href="/contact" className="transition-colors hover:text-rust-light">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="mb-4 font-display text-sm font-bold uppercase tracking-[0.2em] text-cream">
              Contact
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <a
                  href={`mailto:${EMAIL}`}
                  className="transition-colors hover:text-rust-light"
                >
                  {EMAIL}
                </a>
              </li>
              <li className="text-cream/50">Same-day dispatch</li>
              <li className="text-cream/50">Delivery in 7–10 working days</li>
            </ul>
          </div>
        </div>

        <div className="mt-14 flex flex-wrap items-center justify-between gap-4 border-t border-cream/10 pt-6 text-xs text-cream/40">
          <p>© {new Date().getFullYear()} Dpackshop. All rights reserved.</p>
          <p>{fullRange.length}+ categories · Machines · Wraps · Void fill · Securing</p>
        </div>
      </div>
    </footer>
  );
}
