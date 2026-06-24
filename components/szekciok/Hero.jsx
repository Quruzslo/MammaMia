import LiquidSwap from "../liquidswap/LiquidSwap";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";

import { FiClock, FiTruck } from "react-icons/fi";

export default function Hero() {
  // const router = useRouter();
  // const pathname = usePathname();

  // const handleScroll = (e) => {
  //   if (pathname === "/") {
  //     e.preventDefault();
  //     const target = document.getElementById("menu");
  //     target?.scrollIntoView({ behavior: "smooth" });
  //   }
  // };

  return (
    <section className="w-full mx-auto px-[10px]  py-12 lg:py-20 flex flex-col lg:flex-row justify-between items-center gap-12">
      {/* BAL OLDAL - Tartalom és információk */}
      <div className="hero-left w-full lg:w-[50%] space-y-6 text-center lg:text-left">
        {/* Címek */}
        <div className="space-y-2">
          <span className="text-teal-400 font-bold uppercase tracking-widest text-xs sm:text-sm block">
            Minden nap frissen
          </span>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-gray-100 tracking-tight leading-tight">
            Heti menü <span className="text-teal-400">kiszállítás</span>
          </h1>
          <h2 className="text-xl sm:text-2xl font-semibold text-gray-400 italic">
            Mamma Mia Kifőzde
          </h2>
        </div>

        {/* Info Kártyák (Időpontok és szállítás) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 max-w-md mx-auto lg:mx-0">
          {/* Szállítási napok */}
          <div className="flex items-center gap-3 bg-neutral-800/60 border border-neutral-700/50 p-4 rounded-xl shadow-lg">
            <div className="p-3 bg-teal-500  rounded-lg shrink-0">
              <FiTruck size={22} className="fill-teal-400" />
            </div>
            <div className="text-left">
              <p className="text-xs text-gray-400 font-medium">Kiszállítás</p>
              <p className="text-sm font-bold text-gray-200">
                Hétfőtől - Szombatig
              </p>
            </div>
          </div>

          {/* Rendelési határidő */}
          <div className="flex items-center gap-3 bg-neutral-800/60 border border-neutral-700/50 p-4 rounded-xl shadow-lg">
            <div className="p-3 bg-amber-500  rounded-lg shrink-0">
              <FiClock size={22} className="stroke-white" />
            </div>
            <div className="text-left">
              <p className="text-xs text-gray-400 font-medium">
                Rendelésfelvétel
              </p>
              <p className="text-sm font-bold text-gray-200">Aznap 12:00-ig</p>
            </div>
          </div>
        </div>

        {/* Tag-ek */}
        <div className="flex flex-wrap justify-center lg:justify-start gap-2 pt-2">
          <span className="px-3 py-1 bg-neutral-800 text-gray-300 border border-neutral-700 rounded-full text-xs font-medium tracking-wide">
            hetimenü
          </span>
          <span className="px-3 py-1 bg-neutral-800 text-gray-300 border border-neutral-700 rounded-full text-xs font-medium tracking-wide">
            kiszállítás
          </span>
          <span className="px-3 py-1 bg-neutral-800 text-gray-300 border border-neutral-700 rounded-full text-xs font-medium tracking-wide">
            kedvezőár
          </span>
          <span className="px-3 py-1 bg-neutral-800 text-gray-300 border border-neutral-700 rounded-full text-xs font-medium tracking-wide">
            háziasízek
          </span>
        </div>
      </div>

      {/* JOBB OLDAL - Liquid Canvas wrapper */}
      <div className="hero-right w-full lg:w-[50%] flex justify-center items-center">
        <div className="relative w-[250px] h-[250px]  md:w-[450px] md:h-[450px] lg:w-[400px] lg:h-[400px] xl:w-[500px] xl:h-[500px] aspect-square overflow-hidden shadow-2xl rounded-full border border-neutral-700/30">
          <LiquidSwap
            imageSrc={"/picture1.jpg"}
            className="w-full h-full object-cover"
            hoverSrc={"/picture2.jpg"}
            width={1000}
            height={1000}
            intensity={0.45}
            speed={1.6}
            noiseScale={1}
            style={{ width: "100%", height: "100%" }}
          />
          <button
            // onClick={handleScroll}
            className="rendelek flex flex-row rounded-full w-[100px] h-[100px] absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-black/20 backdrop-blur-[15px] items-center justify-center cursor-pointer"
          >
            <span className="text-white text-md font-black">Rendelek</span>
          </button>
        </div>
      </div>
    </section>
  );
}
