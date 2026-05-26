"use client";

import {
  IoBagHandleOutline,
  IoMenuOutline,
  IoCloseOutline,
} from "react-icons/io5";
import { CiUser } from "react-icons/ci";
import { IoDocuments } from "react-icons/io5";
import { useContext, useState, useEffect } from "react";
import { cartContext } from "../contexts/cartProvider";
import Link from "next/link";
import { useSession } from "next-auth/react";

export default function Header() {
  const { cartItems, animateSideCart } = useContext(cartContext);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // NextAuth kliensoldali logika
  const { data: session, status } = useSession();
  const isLoading = status === "loading";
  const isLoggedIn = status === "authenticated";

  const totalItemsAmount = cartItems.reduce((totalSum, day) => {
    const daySum = day.items.reduce((acc, food) => acc + food.quantity, 0);
    return totalSum + daySum;
  }, 0);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) setIsMenuOpen(false);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <header className="sticky top-0 z-[60] w-full px-4 py-3 bg-neutral-950/80 backdrop-blur-md border-b border-teal-900/30">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3 group z-[70]">
          <img
            src="/Mammamia1.jpg"
            alt="logo"
            className="w-10 h-10 md:w-12 md:h-12 rounded-xl object-cover border border-teal-500/30"
          />
          <h1 className="text-lg md:text-xl font-black text-white tracking-tighter uppercase italic">
            Mamma <span className="text-teal-500 not-italic">Mia</span>
          </h1>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:block">
          <ul className="flex gap-8 items-center">
            <li>
              <Link href="/" className="nav-link">
                Étlap
              </Link>
            </li>
            <li>
              <button className="nav-link">Kapcsolat</button>
            </li>
          </ul>
        </nav>

        {/* Jobb oldali gombok */}
        <div className="flex items-center gap-2 md:gap-4 z-[70]">
          {/* Kosár gomb */}
          <div className="flex flex-col menu-btn-wrapper">
            <button
              onClick={() => animateSideCart()}
              className="relative p-2.5 rounded-xl bg-neutral-900 border border-neutral-800 hover:border-teal-500/50 transition-all group"
            >
              <IoBagHandleOutline size={24} className="stroke-teal-500" />
              {cartItems.length > 0 && (
                <div className="absolute -top-1 -right-1 w-5 h-5 bg-teal-500 text-neutral-950 text-[10px] font-black rounded-full flex items-center justify-center shadow-lg">
                  {totalItemsAmount}
                </div>
              )}
            </button>
            <div className="info-tooltip rounded-xl bg-neutral-900 border border-neutral-800 transition-all p-4">
              <p className="text-teal-100/50 text-nowrap">Kosár</p>
            </div>
          </div>

          {/* Felhasználói fiók / Belépés gomb */}
          <div className="flex flex-row menu-btn-wrapper items-center gap-3">
            {isLoading ? (
              // Betöltési állapot dizájn
              <div className="p-2.5 rounded-xl bg-neutral-900 border border-neutral-800 animate-pulse w-[46px] h-[46px]" />
            ) : isLoggedIn ? (
              // Ha be van jelentkezve: (Admin vagy Fiókom)
              <Link
                href={
                  session?.user?.role === "admin" ? "/rendelesek" : "/fiokom"
                }
              >
                <div className="relative p-2.5 rounded-xl bg-neutral-900 border border-neutral-800 hover:border-teal-500/50 transition-all group flex-row flex gap-3 items-center">
                  {session?.user?.image ? (
                    // Google profilkép
                    <img
                      src={session.user.image}
                      alt="Profilkép"
                      referrerPolicy="no-referrer"
                      className="w-6 h-6 rounded-lg object-cover"
                    />
                  ) : (
                    // Név első betűje ikon helyett, ha nincs kép
                    <span className="text-teal-500 text-[15px] font-medium min-w-[14px] text-center">
                      {session?.user?.name?.charAt(0).toUpperCase() || "U"}
                    </span>
                  )}
                  <IoDocuments size={24} className="fill-teal-500" />
                </div>
              </Link>
            ) : (
              // Ha nincs bejelentkezve
              <Link href="/belepes">
                <button className="relative p-2.5 rounded-xl bg-neutral-900 border border-neutral-800 hover:border-teal-500/50 transition-all group">
                  <CiUser size={24} className="fill-teal-50/50" />
                </button>
              </Link>
            )}
            <div className="info-tooltip rounded-xl bg-neutral-900 border border-neutral-800 transition-all p-4">
              <p className="text-teal-100/50 text-nowrap">
                {isLoggedIn
                  ? `Fiók: ${session?.user?.name}`
                  : "Felhasználói fiók"}
              </p>
            </div>
          </div>

          {/* Mobil gomb */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2.5 rounded-xl bg-neutral-900 border border-neutral-800 text-teal-500"
          >
            {isMenuOpen ? (
              <IoCloseOutline size={24} className="stroke-teal-500" />
            ) : (
              <IoMenuOutline size={24} className="stroke-teal-100" />
            )}
          </button>
        </div>
      </div>

      {/* Mobil menü overlay */}
      <div
        className={`fixed inset-0 bg-neutral-950 z-[65] md:hidden transition-all duration-500 ease-in-out h-[100vh] w-full ${
          isMenuOpen
            ? "opacity-100 translate-y-0"
            : "opacity-0 -translate-y-full pointer-events-none"
        }`}
      >
        <nav className="flex flex-col items-center justify-center h-full gap-8">
          <Link
            href="/"
            onClick={() => setIsMenuOpen(false)}
            className="text-2xl font-black text-white uppercase tracking-[0.2em] hover:text-teal-500 transition-colors"
          >
            Étlap
          </Link>
          <Link
            href={session?.user?.role === "admin" ? "/rendelesek" : "/fiokom"}
            onClick={() => setIsMenuOpen(false)}
            className="text-2xl font-black text-white uppercase tracking-[0.2em] hover:text-teal-500 transition-colors"
          >
            {session?.user?.role === "admin" ? "Rendelések (Admin)" : "Fiókom"}
          </Link>
          <button
            onClick={() => setIsMenuOpen(false)}
            className="text-2xl font-black text-white uppercase tracking-[0.2em] hover:text-teal-500 transition-colors"
          >
            Kapcsolat
          </button>
          <div className="w-20 h-1 bg-teal-500 rounded-full mt-4"></div>
        </nav>
      </div>
    </header>
  );
}
