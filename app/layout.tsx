import type { Metadata } from "next";
import { Geist, Geist_Mono, Nunito } from "next/font/google";
import "./globals.css";
import CartProvider from "@/components/contexts/cartProvider";
import UserProvider from "@/components/contexts/userProvider";
import Header from "@/components/szekciok/Header";
import SideCart from "@/components/szekciok/SideCart";
import Footer from "@/components/szekciok/Footer";
import ScrollToTop from "@/components/szekciok/scrollToTop";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";
import Image from "next/image"; // Beimportáljuk a Next Image-et

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const nunito = Nunito({
  variable: "--font-nunito",
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
      lang="hu"
      data-scroll-behavior="smooth"
      className={`${geistSans.variable} ${geistMono.variable} ${nunito.variable} h-full antialiased`}
    >
      <body className="font-nunito flex flex-col relative min-h-screen text-gray-100 bg-neutral-950">
        {/* bg kép */}
        <div className="fixed inset-0 -z-50 pointer-events-none select-none">
          <div className="absolute inset-0 bg-black/80 z-10" />

          <Image
            src="/root-bg.jpg"
            alt="Mamma Mia Háttér"
            fill
            sizes="100vw"
            priority
            quality={60}
            className="object-cover object-center"
          />
        </div>

        {/* Tartalom */}
        <div className="relative z-10 flex flex-col min-h-screen">
          <UserProvider>
            <CartProvider>
              <Header></Header>
              <SideCart></SideCart>
              <ToastContainer
                position="bottom-right"
                autoClose={1000}
                theme="dark"
              />
              {children}
              <ScrollToTop></ScrollToTop>
              <Footer></Footer>
            </CartProvider>
          </UserProvider>
        </div>
      </body>
    </html>
  );
}
