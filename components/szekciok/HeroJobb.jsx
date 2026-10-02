"use client";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import Image from "next/image";

export default function HeroRight() {
  const router = useRouter();
  const pathname = usePathname();

  return (
    <>
      {/* JOBB OLDAL  */}
      <div className="hero-right w-full md:w-[50%] flex justify-center items-center">
        <div className="hero-img relative w-full max-w-[450px] aspect-square shadow-2xl rounded-[30px] border border-neutral-700/30">
          <Image
            src="/picture1.jpg"
            fill
            priority
            alt="Heti menü rendelés Kaposvár és környékén"
            className="object-cover z-10 rounded-md"
          />

          <Link
            href="/napimenu"
            className="rendelek flex flex-row rounded-full z-10 w-[100px] h-[100px] absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-black/20 backdrop-blur-[15px] items-center justify-center cursor-pointer"
          >
            Rendelek
          </Link>
        </div>
      </div>
    </>
  );
}
