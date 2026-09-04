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
      <div className="hero-right w-full lg:w-[50%] flex justify-center items-center">
        <div className="relative w-full h-full  md:w-[450px] md:h-[450px] lg:w-[400px] lg:h-[400px] xl:w-[500px] xl:h-[500px] aspect-square overflow-hidden shadow-2xl rounded-[30px] border border-neutral-700/30">
          <Image
            src="/picture1.jpg"
            fill
            priority
            alt="Heti menü rendelés Kaposvár és környékén"
          ></Image>
          {/* <LiquidSwap
            imageSrc={"/picture1.jpg"}
            className="w-full h-full object-cover"
            hoverSrc={"/picture2.jpg"}
            width={1000}
            height={1000}
            intensity={0.45}
            speed={1.6}
            noiseScale={1}
            style={{ width: "100%", height: "100%" }}
          /> */}
          <button
            onClick={handleScroll}
            className="rendelek flex flex-row rounded-full w-[100px] h-[100px] absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-black/20 backdrop-blur-[15px] items-center justify-center cursor-pointer"
          >
            <span className="text-white text-md font-black">Rendelek</span>
          </button>
        </div>
      </div>
    </>
  );
}
