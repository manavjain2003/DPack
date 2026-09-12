import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Marquee from "@/components/Marquee";
import FeaturedProducts from "@/components/FeaturedProducts";
import WhyUs from "@/components/WhyUs";
import Stats from "@/components/Stats";
import CTA from "@/components/CTA";
import Footer from "@/components/Footer";
import { products } from "@/lib/products";
import Categories from "@/components/Categories";
import Reviews from "@/components/Reviews";
import FAQSection from "@/components/FAQSection";
import QueryForm from "@/components/QueryForm";
import SmoothScroll from "@/components/SmoothScroll";
import Product360 from "@/components/Product360";
import ProductsClient from "@/components/ProductsClient";

export default function Home() {
  const featured = products.filter((p) => p.featured);

  return (
    <SmoothScroll>
      <main className="overflow-x-clip">
        <Navbar />
        <Hero />
        <Marquee />
        <Categories />
        <FeaturedProducts products={featured} />
        <Product360/>
        <ProductsClient products={products} />
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