"use client";
import LiquidSwap from "../liquidswap/LiquidSwap";
import { useRouter, usePathname } from "next/navigation";
import Image from "next/image";

export default function HeroRight() {
  const router = useRouter();
  const pathname = usePathname();

  const handleScroll = (e) => {
    if (pathname === "/") {
      e.preventDefault();
      const target = document.getElementById("menu");
      target?.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <>
      {/* JOBB OLDAL  */}
      <div className="hero-right w-full md:w-[50%] flex justify-center items-center">
        <div className="hero-img relative w-full max-w-[450px] aspect-square shadow-2xl rounded-[30px] border border-neutral-700/30">
          <Image
            src="/picture1.jpg"
            fill
            alt="Heti menü rendelés Kaposvár és környékén"
            className="object-cover z-10 rounded-md"
          />

          <button
            onClick={handleScroll}
            className="rendelek flex flex-row rounded-full z-10 w-[100px] h-[100px] absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-black/20 backdrop-blur-[15px] items-center justify-center cursor-pointer"
          >
            <span className="text-white text-md font-black">Rendelek</span>
          </button>
        </div>
      </div>
    </>
  );
}
