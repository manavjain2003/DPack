import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronRight } from "lucide-react";

import Navbar from "@/components/Navbar";
import ProductDetail from "@/components/ProductDetail";
import ProductCard from "@/components/ProductCard";
import CTA from "@/components/CTA";
import Footer from "@/components/Footer";
import { getProductBySlug, getRelatedProducts, getAllSlugs } from "@/lib/products";

export const dynamic = "force-dynamic";

export async function generateStaticParams() {
  try {
    const slugs = await getAllSlugs();
    return slugs.map((slug) => ({ slug }));
  } catch {
    return [];
  }
}

export async function generateMetadata({ params }) {
  try {
    const product = await getProductBySlug(params.slug);
    if (!product) return { title: "Product not found — Dpack" };
    return {
      title: `${product.name} — Dpack`,
      description: product.description,
      openGraph: {
        title: product.name,
        description: product.description,
        images: product.image ? [product.image] : undefined,
      },
    };
  } catch {
    return { title: "Product — Dpack" };
  }
}

export default async function ProductDetailPage({ params }) {
  let product = null;
  let related = [];

  try {
    product = await getProductBySlug(params.slug);
    if (!product) notFound();
    related = await getRelatedProducts(product, 4);
  } catch {
    notFound();
  }

  return (
    <main className="overflow-x-clip">
      <Navbar />

      <div className="relative mt-[90px] h-[220px] w-full overflow-hidden sm:h-[260px]">
        {product.image && (
          <img
            src={product.image}
            alt=""
            aria-hidden="true"
            className="absolute inset-0 h-full w-full object-cover object-center scale-110 blur-[2px]"
          />
        )}
        <div className="absolute inset-0 bg-[#3d7a72]/80" />

        <div className="relative z-10 flex h-full flex-col items-center justify-center gap-3 px-4 text-center">
          <h1 className="font-display text-[32px] font-extrabold tracking-tight text-white drop-shadow-sm sm:text-[42px]">
            {product.name}
          </h1>
          <nav
            aria-label="Breadcrumb"
            className="flex flex-wrap items-center justify-center gap-x-1.5 gap-y-1 text-[13px] font-medium text-white/80"
          >
            <Link href="/" className="transition hover:text-white">Home</Link>
            <ChevronRight className="h-3.5 w-3.5 text-white/50" />
            <Link href="/products" className="transition hover:text-white">{product.category}</Link>
            <ChevronRight className="h-3.5 w-3.5 text-white/50" />
            <span className="text-white">{product.name}</span>
          </nav>
        </div>
      </div>

      <section className="pb-16 pt-12 sm:pb-20 sm:pt-16">
        <div className="mx-auto max-w-8xl px-5 sm:px-8">
          <ProductDetail product={product} />
        </div>
      </section>

      {related.length > 0 && (
        <section className="pb-20 sm:pb-24">
          <div className="mx-auto max-w-8xl px-5 sm:px-8">
            <h2 className="font-display text-2xl font-bold tracking-tight text-ink sm:text-3xl">
              You might also like
            </h2>
            <p className="mt-1.5 text-[14px] text-ink/50">More from {product.category}</p>
            <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {related.map((p, i) => (
                <ProductCard key={p.slug} product={p} index={i} />
              ))}
            </div>
          </div>
        </section>
      )}

      <CTA />
      <Footer />
    </main>
  );
}
