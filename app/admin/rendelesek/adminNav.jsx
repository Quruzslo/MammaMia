"use client";
// Ikonok---------------
import { TfiStatsUp } from "react-icons/tfi";
import { CiViewList } from "react-icons/ci";
import { FiUpload } from "react-icons/fi";
import { CiBookmarkPlus } from "react-icons/ci";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";

export default function AdminNav() {
  const pathname = usePathname();

  return (
    <nav className="flex flex-col gap-2 bg-neutral-900/80 px-[10px] rounded-sm border border-neutral-800/80 w-[100%] py-[20px] sticky top-[75px]">
      <Link
        href="/admin/statisztika"
        className={`px-4 py-2 text-xs font-bold uppercase tracking-wider rounded-sm transition-all duration-200 items-center flex flex-row nowrap gap-2 ${
          pathname === "/admin/statisztika"
            ? "bg-teal-600 text-white shadow-md shadow-teal-600/10"
            : "text-gray-400 hover:text-gray-200 hover:bg-neutral-800/60"
        }`}
      >
        <TfiStatsUp size={20} />
        Statisztikák
      </Link>
      <Link
        href="/admin/rendelesek"
        className={`px-4 py-2 text-xs font-bold uppercase tracking-wider rounded-sm transition-all duration-200 items-center flex flex-row nowrap gap-2 ${
          pathname === "/admin/rendelesek"
            ? "bg-teal-600 text-white shadow-lg shadow-teal-600/10"
            : "text-gray-400 hover:text-gray-200 hover:bg-neutral-800/60"
        }`}
      >
        <CiViewList size={20} />
        Rendelések kezelése
      </Link>
      <Link
        href="/admin/ujrendeles"
        className={`px-4 py-2 text-xs font-bold uppercase tracking-wider rounded-sm transition-all duration-200 items-center flex flex-row nowrap gap-2 ${
          pathname === "/admin/ujrendeles"
            ? "bg-teal-600 text-white shadow-md shadow-teal-600/10"
            : "text-gray-400 hover:text-gray-200 hover:bg-neutral-800/60"
        }`}
      >
        <CiBookmarkPlus size={20} />
        Új rendelés leadása
      </Link>

      <Link
        href="/admin/feltoltes"
        className={`px-4 py-2 text-xs font-bold uppercase tracking-wider rounded-sm transition-all duration-200 items-center flex flex-row nowrap gap-2  ${
          pathname === "/admin/feltoltes"
            ? "bg-teal-600 text-white shadow-md shadow-teal-600/10"
            : "text-gray-400 hover:text-gray-200 hover:bg-neutral-800/60"
        }`}
      >
        <FiUpload size={20} />
        Ételek feltöltése
      </Link>
      <button
        className="mr-auto bg-red-300/70 p-2 rounded-sm hover:bg-red-500 mt-[20px]"
        onClick={() => signOut()}
      >
        Kilépés
      </button>
    </nav>
  );
}
