import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Marquee from "@/components/Marquee";
import FeaturedProducts from "@/components/FeaturedProducts";
import WhyUs from "@/components/WhyUs";
import Stats from "@/components/Stats";
import CTA from "@/components/CTA";
import Footer from "@/components/Footer";
import Categories from "@/components/Categories";
import Reviews from "@/components/Reviews";
import FAQSection from "@/components/FAQSection";
import QueryForm from "@/components/QueryForm";
import SmoothScroll from "@/components/SmoothScroll";
import Product360 from "@/components/Product360";
import ProductsClient from "@/components/ProductsClient";
import { getProducts, getFeaturedProducts } from "@/lib/products";

export default async function Home() {
  let featured = [];
  let allProducts = [];

  try {
    [featured, allProducts] = await Promise.all([
      getFeaturedProducts(),
      getProducts(),
    ]);
  } catch (e) {
    // DB not connected yet — graceful degradation
    console.warn("Could not fetch products from DB:", e.message);
  }

  return (
    <SmoothScroll>
      <main className="overflow-x-clip">
        <Navbar />
        <Hero />
        <Marquee />
        <Categories />
        <FeaturedProducts products={featured} />
        <Product360 />
        <ProductsClient products={allProducts} />
        <WhyUs />
        <Reviews />
        <Stats />
        <CTA />
        <FAQSection />
        <QueryForm />
        <Footer />
      </main>
    </SmoothScroll>
  );
}
