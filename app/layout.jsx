import { Sora, Inter } from "next/font/google";
import "./globals.css";

import CartSidebar from "@/components/CartSidebar";
import LoginSidebar from "@/components/LoginSidebar";
import { AuthProvider } from "./context/AuthContext";

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
  icons: {
    icon: "https://packingairbag.com/_next/image?url=%2Flogo.png&w=256&q=75", 
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${sora.variable} ${inter.variable}`}
      >
        <AuthProvider>
          {children}
          <LoginSidebar />
          <CartSidebar />
        </AuthProvider>
      </body>
    </html>
  );
}