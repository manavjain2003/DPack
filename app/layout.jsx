import { Sora, Inter } from "next/font/google";
import "./globals.css";
import CartSidebar from "@/components/CartSidebar";

const sora = Sora({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
});

export const metadata = {
  title: "Dpack — Protective Packaging That Safeguards Your Products",
  description:
    "Air cushion machines, air column rolls, honeycomb sleeves, pallet belts and corrugation shredders. Everything you need to ship fragile goods damage-free.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        {children}
        <CartSidebar />
      </body>
    </html>
  );
}
