import Navbar from "@/components/Navbar";
import PageHeader from "@/components/PageHeader";
import ProductsClient from "@/components/ProductsClient";
import CTA from "@/components/CTA";
import Footer from "@/components/Footer";
import { getProducts } from "@/lib/products";

export const metadata = {
  title: "Products — Dpack | Protective Packaging & Cargo Securing",
  description:
    "Air column bags, gap fillers, air bags, e-commerce pouches, ratchet belts, lashing systems, bubble wrap and packaging tapes — all under one roof.",
};

export const revalidate = 60;

export default async function ProductsPage() {
  let products = [];
  try {
    products = await getProducts();
  } catch (e) {
    console.warn("Could not fetch products:", e.message);
  }

  return (
    <main className="overflow-x-clip">
      <Navbar />
     <PageHeader
        eyebrow="Catalogue"
        title="Products built for damage-free delivery"
        subtitle="From air column bags, gap fillers and air bags to ratchet belts, lashing systems, bubble wrap and packaging tapes — we've got it all under one roof."
           backgroundImage="/banner1.webp"
         />
      <section className="pb-24">
        <div className="mx-auto max-w-8xl px-5 sm:px-8">
          <ProductsClient products={products} />
        </div>
      </section>
      <CTA />
      <Footer />
    </main>
  );
}