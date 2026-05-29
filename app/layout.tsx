import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import CartProvider from "@/components/contexts/cartProvider";
import UserProvider from "@/components/contexts/userProvider";
import Header from "@/components/szekciok/Header";
import SideCart from "@/components/szekciok/SideCart";
import Footer from "@/components/szekciok/Footer";
import ScrollToTop from "@/components/szekciok/scrollToTop";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";
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
      data-scroll-behavior="smooth"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-[100vh] flex flex-col">
        <UserProvider>
          <CartProvider>
            <Header></Header>
            <SideCart></SideCart>
            <ToastContainer
              position="bottom-right"
              autoClose={2500}
              theme="dark"
            />
            {children}
            <ScrollToTop></ScrollToTop>
            <Footer></Footer>
          </CartProvider>
        </UserProvider>
      </body>
    </html>
  );
}
