"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { FaUtensils, FaBookOpen } from "react-icons/fa6";

export default function SelectFood() {
  return (
    <section className="w-[90%] mx-auto py-12 lg:py-20 flex flex-col lg:flex-row justify-between items-stretch gap-12">
      {/* NAPI MENÜ KÁRTYA */}
      <div className="w-full lg:w-1/2 flex flex-col items-center justify-between text-center p-6 lg:p-8 rounded-2xl bg-background border border-card-border/50 shadow-sm">
        <div className="flex flex-col items-center">
          <div className="flex flex-row gap-3 items-center justify-center mb-4">
            <div className="w-[50px] h-[50px] rounded-full bg-sarga text-white relative flex items-center justify-center shrink-0 shadow-md">
              <Image
                width={30}
                height={30}
                alt="Napimenü rendelés Kaposvár, Kaposfüred, Juta"
                src="/icons/dailymenu.svg"
                className="w-[30px] h-[30px] object-contain"
              />
            </div>

            <h2 className="text-xl lg:text-3xl font-bold text-foreground">
              Napi menüt rendelek
            </h2>
          </div>

          <p className="text-sm lg:text-base text-foreground/80 max-w-lg mb-6 leading-relaxed">
            Friss alapanyagok, házias ízek és megbízható kiszállítás minden
            hétköznap. Rendeld meg az ebédet pár kattintással, és élvezd a
            forró, laktató fogásokat otthonodban vagy az irodában!
          </p>
        </div>

        {/* Gomb */}
        <div className="relative inline-block group mt-2">
          <motion.div
            animate={{
              scale: [1, 1.05, 1],
              opacity: [0.4, 0.7, 0.4],
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="absolute -inset-1 rounded-full bg-sarga blur-md opacity-60 group-hover:opacity-100 transition duration-300"
          />

          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Link
              href="/napimenu"
              className="relative flex items-center justify-center gap-2.5 px-8 py-3.5 rounded-full bg-sarga text-white font-extrabold text-lg shadow-lg overflow-hidden transition-all duration-300 hover:shadow-sarga/50"
            >
              <span className="absolute top-0 left-0 w-1/2 h-full bg-white/30 skew-x-[-20deg] -translate-x-[calc(100%+50px)] group-hover:translate-x-[300%] transition-transform duration-700 ease-in-out" />

              <FaUtensils className="w-5 h-5 transition-transform duration-300 group-hover:-rotate-12" />
              <span>Menü rendelés</span>
            </Link>
          </motion.div>
        </div>
      </div>

      {/* ÉTLAP KÁRTYA */}
      <div className="w-full lg:w-1/2 flex flex-col items-center justify-between text-center p-6 lg:p-8 rounded-2xl bg-background border border-card-border/50 shadow-sm">
        <div className="flex flex-col items-center">
          <div className="flex flex-row gap-3 items-center justify-center mb-4">
            <div className="w-[50px] h-[50px] rounded-full bg-sarga text-white relative flex items-center justify-center shrink-0 shadow-md">
              <FaBookOpen className="w-5 h-5" />
            </div>

            <h2 className="text-xl lg:text-3xl font-bold text-foreground">
              Étlapról rendelek
            </h2>
          </div>

          <p className="text-sm lg:text-base text-foreground/80 max-w-lg mb-6 leading-relaxed">
            Válogass állandó kínálatunkból: levesek, bőséges frissensültek,
            tészták és desszertek széles választéka vár. Rendelj egyedi igényeid
            szerint a hét bármely napján!
          </p>
        </div>

        {/* Gomb */}
        <div className="relative inline-block group mt-2">
          <motion.div
            animate={{
              scale: [1, 1.05, 1],
              opacity: [0.4, 0.7, 0.4],
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="absolute -inset-1 rounded-full bg-sarga blur-md opacity-60 group-hover:opacity-100 transition duration-300"
          />

          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Link
              href="/etlap"
              className="relative flex items-center justify-center gap-2.5 px-8 py-3.5 rounded-full bg-sarga text-white font-extrabold text-lg shadow-lg overflow-hidden transition-all duration-300 hover:shadow-sarga/50"
            >
              <span className="absolute top-0 left-0 w-1/2 h-full bg-white/30 skew-x-[-20deg] -translate-x-[calc(100%+50px)] group-hover:translate-x-[300%] transition-transform duration-700 ease-in-out" />

              <FaBookOpen className="w-5 h-5 transition-transform duration-300 group-hover:-rotate-12" />
              <span>Étlap megtekintése</span>
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
