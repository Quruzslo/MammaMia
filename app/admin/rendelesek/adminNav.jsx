"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";

export default function AdminNav() {
  const pathname = usePathname();

  return (
    <nav className="flex flex-row gap-2 bg-neutral-900/80 px-[20px] rounded-xl border border-neutral-800/80 w-full py-[35px] my-[20px]">
      <Link
        href="/admin/rendelesek"
        className={`px-4 py-2 text-xs font-bold uppercase tracking-wider rounded-lg transition-all duration-200 items-center flex ${
          pathname === "/admin/rendelesek"
            ? "bg-teal-600 text-white shadow-md shadow-teal-600/10"
            : "text-gray-400 hover:text-gray-200 hover:bg-neutral-800/60"
        }`}
      >
        Rendelések kezelése
      </Link>

      <Link
        href="/admin/feltoltes"
        className={`px-4 py-2 text-xs font-bold uppercase tracking-wider rounded-lg transition-all duration-200 items-center flex ${
          pathname === "/admin/feltoltes"
            ? "bg-teal-600 text-white shadow-md shadow-teal-600/10"
            : "text-gray-400 hover:text-gray-200 hover:bg-neutral-800/60"
        }`}
      >
        Ételek feltöltése
      </Link>
      <button
        className="ml-auto bg-red-300/70 p-2 rounded-xl hover:bg-red-500"
        onClick={() => signOut()}
      >
        Kilépés
      </button>
    </nav>
  );
}
