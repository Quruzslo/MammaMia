"use client";
//ikonok
import { IoBagHandleOutline } from "react-icons/io5";
import { CiUser } from "react-icons/ci";
import { IoDocuments } from "react-icons/io5";
import { BsClockHistory } from "react-icons/bs";
import { PiBowlFood } from "react-icons/pi";
import { FaFacebook } from "react-icons/fa";
//Funkcionalitás
import { useContext, useState, useEffect } from "react";
import { cartContext } from "../contexts/cartProvider";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { usePathname } from "next/navigation";

export default function Header() {
  const { cartItems, animateSideCart } = useContext(cartContext);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // NextAuth
  const { data: session, status } = useSession();
  const isLoading = status === "loading";
  const isLoggedIn = status === "authenticated";

  const pathname = usePathname();

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
    <>
      <div className="z-[60] flex flex-row gap-2 w-full mx-auto bg-neutral-950/80 backdrop-blur-md px-[10px] md:px-[10%] border-b border-white py-2 gap-6 items-center">
        <div className=" gap-2 items-center hidden md:flex md:flex-row ">
          <BsClockHistory size={20} className="fill-white" />
          <p className="text-white text-[12px]">
            Hétfőtől - Szombatig, aznap 12:00-ig{" "}
          </p>
        </div>

        <div className="flex flex-row gap-2 items-center">
          <PiBowlFood size={20} className="fill-white" />
          <p className="text-white text-[12px]">Frissen, minden nap </p>
        </div>
        <a
          className="ml-auto group"
          href="https://www.facebook.com/mammamiakifozde"
          target="_blank"
          rel="noopener noreferrer"
        >
          <div className="flex flex-row gap-2 items-center">
            <FaFacebook
              size={20}
              className="fill-white transition-colors duration-200 group-hover:fill-blue-600"
            />

            <p className="text-white text-[12px] transition-colors duration-200 group-hover:text-blue-300">
              Facebook
            </p>
          </div>
        </a>
      </div>
      <header className="sticky top-0 z-[60] w-full px-[10px] md:px-[0px] py-3 bg-neutral-950/80 backdrop-blur-md border-b border-teal-900/30 flex flex-col gap-3">
        <div className=" w-[100%] md:w-[80%] max-w-[1800px] mx-auto flex items-center justify-between">
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
                <a
                  href="/#menu"
                  className={`nav-link ${pathname === "/" || pathname === "/#menu" ? "active" : ""}`}
                >
                  Étlap
                </a>
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
                className="relative p-[10px] border-2 border-transparent rounded-full  transition-all group hover:border-2 hover:border-white  active:border-2 active:border-white"
              >
                <IoBagHandleOutline size={"20px"} className="stroke-white" />
                {cartItems.length > 0 && (
                  <div className="absolute -top-1 -right-1 w-5 h-5 bg-white text-neutral-950 text-[10px] font-black rounded-full flex items-center justify-center shadow-lg">
                    {totalItemsAmount}
                  </div>
                )}
              </button>
              <div className="info-tooltip hidden md:flex rounded-xl bg-neutral-900 border border-neutral-800 transition-all p-4">
                <p className="text-teal-100/50 text-nowrap">Kosár</p>
              </div>
            </div>

            {/* Felhasználói fiók / Belépés gomb */}
            <div className="flex flex-row menu-btn-wrapper items-center gap-3">
              {isLoading ? (
                // Betöltési állapot dizájn
                <div className="p-[5px] rounded-full w-5 h-5 bg-neutral-900 border border-neutral-800 animate-pulse w-[46px] h-[46px]" />
              ) : isLoggedIn ? (
                // Ha be van jelentkezve: (Admin vagy Fiókom)
                <Link
                  href={
                    session?.user?.role === "admin"
                      ? "/admin/rendelesek"
                      : "/fiokom"
                  }
                >
                  <div className="relative w-[35px] h-[35px] rounded-full hover:border-2 hover:border-white  active:border-2 active:border-white transition-all group flex-row flex gap-3 items-center justify-center">
                    {session?.user?.image ? (
                      // Google profilkép
                      <img
                        src={session.user.image}
                        alt="Profilkép"
                        referrerPolicy="no-referrer"
                        className="w-full h-full rounded-full object-cover"
                      />
                    ) : (
                      // Név első betűje ikon helyett, ha nincs kép
                      <span className="text-teal-500 text-[15px] font-medium min-w-[14px] text-center">
                        {session?.user?.name?.charAt(0).toUpperCase() || "U"}
                      </span>
                    )}
                    {/* <IoDocuments size={24} className="fill-teal-500" /> */}
                  </div>
                </Link>
              ) : (
                // Ha nincs bejelentkezve
                <Link href="/belepes">
                  <button className="relative p-2.5 rounded-xl bg-neutral-900 border border-neutral-800 hover:border-white transition-all group">
                    <CiUser size={24} className="fill-white" />
                  </button>
                </Link>
              )}
              <div className="info-tooltip rounded-sm bg-neutral-900 border border-neutral-800 transition-all p-4">
                <p className="text-teal-100/50 !text-nowrap">
                  {isLoggedIn
                    ? `Fiók: ${session?.user?.name}`
                    : "Felhasználói fiók"}
                </p>
              </div>
            </div>

            {/* Mobil gomb */}

            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden relative w-12 h-12 flex flex-col justify-center items-center gap-1.5  text-white overflow-hidden"
            >
              {/* Felső vonal */}
              <span
                className={`w-6 h-0.5 bg-white rounded-full transition-all duration-300 ease-in-out origin-center
      ${isMenuOpen ? "translate-y-2 rotate-45" : ""}`}
              ></span>

              {/* Középső vonal */}
              <span
                className={`w-6 h-0.5 bg-white rounded-full transition-all duration-300 ease-in-out translate-x-[0px]
      ${isMenuOpen ? " translate-x-[40px]" : ""}`}
              ></span>

              {/* Alsó vonal */}
              <span
                className={`w-6 h-0.5 bg-white rounded-full transition-all duration-300 ease-in-out origin-center
      ${isMenuOpen ? "-translate-y-2 -rotate-45" : ""}`}
              ></span>
            </button>
          </div>
        </div>

        {/* Mobil menü overlay */}
        <div
          className={`fixed inset-0 bg-neutral-950 z-[65] md:hidden transition-all duration-500 ease-in-out min-h-[650px] h-[100vh] w-full ${
            isMenuOpen
              ? "opacity-100 translate-y-0"
              : "opacity-0 -translate-y-full pointer-events-none"
          }`}
        >
          <nav className="flex flex-col items-center justify-center h-full gap-8">
            <Link
              href="/"
              onClick={() => setIsMenuOpen(false)}
              className={`text-2xl font-black uppercase tracking-[0.2em] transition-colors ${pathname === "/" ? "text-teal-500" : "text-white hover:text-teal-500"}`}
            >
              Étlap
            </Link>
            <Link
              href={
                session?.user?.role === "admin"
                  ? "/admin/rendelesek"
                  : "/fiokom"
              }
              onClick={() => setIsMenuOpen(false)}
              className={`text-2xl font-black uppercase tracking-[0.2em] transition-colors ${pathname === "/fiokom" || pathname.startsWith("/admin") ? "text-teal-500" : "text-white hover:text-teal-500"}`}
            >
              {session?.user?.role === "admin"
                ? "Rendelések (Admin)"
                : "Fiókom"}
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
    </>
  );
}
