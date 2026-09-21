import Navbar from "@/components/Navbar";
import PageHeader from "@/components/PageHeader";
import Marquee from "@/components/Marquee";
import CTA from "@/components/CTA";
import Footer from "@/components/Footer";
import AboutContent from "@/components/AboutContent";
// import FeaturedProducts from "@/components/FeaturedProducts";

export const metadata = {
  title: "About Dpack | Packaging Air Bag Manufacturer & Supplier",
  description:
    "Learn about Dpack, a trusted packaging air bag manufacturer & supplier specializing in air cushion bags, dunnage bags, air column packaging & protective solutions.",
};

export default function AboutPage() {
  return (
    <main className="overflow-x-clip">
      <Navbar />
      <PageHeader
        eyebrow="About us"
        title="10+ Years of Industry Experience"
        subtitle="From Dpack Solutions to Dpack, backed by 10+ years of experience, we deliver reliable, high-performance packaging solutions that protect, optimize, and add value to your business. We take pride in being a reliable partner for businesses seeking innovative and dependable packaging solutions."
      />

      <AboutContent />

      {/* <FeaturedProducts /> */}
      <Marquee />
      <div className="pt-20" />
      <CTA />
      <Footer />
    </main>
  );
}