"use client";

import Header from "@/components/customer/Header";
import Footer from "@/components/customer/Footer";
import { CartProvider } from "@/lib/cartContext";

export default function CustomerLayout({ children }) {
  return (
    <CartProvider>
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </div>
    </CartProvider>
  );
}
