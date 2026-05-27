import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import CartProvider from "@/components/contexts/cartProvider";
import UserProvider from "@/components/contexts/userProvider";
import Header from "@/components/szekciok/Header";
import SideCart from "@/components/szekciok/SideCart";
import Footer from "@/components/szekciok/Footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "MammaMia Kifőzde",
  description: "Heti Menü, kiszállítással, minden nap frissen",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <UserProvider>
          <CartProvider>
            <Header></Header>
            <SideCart></SideCart>
            {children}
            <Footer></Footer>
          </CartProvider>
        </UserProvider>
      </body>
    </html>
  );
}
