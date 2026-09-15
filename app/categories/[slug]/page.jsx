import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, PackageSearch } from "lucide-react";

import Navbar from "@/components/Navbar";
import PageHeader from "@/components/PageHeader";
import ProductCard from "@/components/ProductCard";
import CTA from "@/components/CTA";
import Footer from "@/components/Footer";
import {
  getCategoryBySlug,
  getCategories,
  getProducts,
} from "@/lib/products";

export const revalidate = 60;

export async function generateMetadata({ params }) {
  try {
    const name = await getCategoryBySlug(params.slug);
    if (!name) return { title: "Category not found — Dpack" };
    return {
      title: `${name} — Dpack`,
      description: `Shop ${name} — protective packaging that safeguards your products.`,
    };
  } catch {
    return { title: "Category — Dpack" };
  }
}

export default async function CategoryPage({ params }) {
  let name = null;
  let products = [];
  let allCategories = [];

  try {
    [name, allCategories] = await Promise.all([
      getCategoryBySlug(params.slug),
      getCategories(),
    ]);
    if (name) {
      products = await getProducts({ category: name });
    }
  } catch (e) {
    console.warn("Could not load category:", e.message);
  }

  if (!name) notFound();

  const otherCategories = allCategories.filter((c) => c !== "All" && c !== name);

  return (
    <main className="overflow-x-clip">
      <Navbar />
      <PageHeader
        eyebrow="Category"
        title={name}
        subtitle={
          products.length > 0
            ? `${products.length} product${products.length === 1 ? "" : "s"} in ${name}.`
            : `We're setting up products for ${name} — check back soon.`
        }
      />

      <section className="pb-24">
        <div className="mx-auto max-w-8xl px-5 sm:px-8">
          {otherCategories.length > 0 && (
            <div className="mb-10 flex flex-wrap gap-2.5">
              <Link
                href="/products"
                className="rounded-full border border-ink/12 px-5 py-2.5 text-sm font-semibold text-ink/60 transition-colors hover:border-ink hover:text-ink"
              >
                All
              </Link>
              <span className="rounded-full bg-ink px-5 py-2.5 text-sm font-semibold text-cream">
                {name}
              </span>
              {otherCategories.map((c) => (
                <Link
                  key={c}
                  href={`/categories/${buildSlug(c)}`}
                  className="rounded-full border border-ink/12 px-5 py-2.5 text-sm font-semibold text-ink/60 transition-colors hover:border-ink hover:text-ink"
                >
                  {c}
                </Link>
              ))}
            </div>
          )}

          {products.length === 0 ? (
            <div className="flex flex-col items-center rounded-3xl border border-ink/8 bg-[#F9F6F0] px-6 py-20 text-center">
              <div className="grid h-16 w-16 place-items-center rounded-full bg-rust/10">
                <PackageSearch className="h-7 w-7 text-rust" />
              </div>
              <h2 className="mt-5 font-display text-xl font-bold text-ink">
                No products here yet
              </h2>
              <p className="mt-2 max-w-xs text-sm text-ink/50">
                We haven't added products to {name} yet. Take a look at everything else we offer.
              </p>
              <Link
                href="/products"
                className="mt-6 inline-flex items-center gap-2 rounded-full bg-rust px-6 py-3 text-sm font-bold text-white transition-all hover:bg-rust/90"
              >
                Browse all products
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          ) : (
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {products.map((p, i) => (
                <ProductCard key={p.slug} product={p} index={i} />
              ))}
            </div>
          )}
        </div>
      </section>

      <CTA />
      <Footer />
    </main>
  );
}

function buildSlug(label) {
  return label.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}