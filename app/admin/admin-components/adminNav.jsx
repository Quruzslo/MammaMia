"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import { adminLinks } from "./adminLinks";

export default function AdminNav() {
  const pathname = usePathname();

  return (
    <nav className="flex flex-col gap-2 bg-neutral-900/80 px-[10px] rounded-sm border border-neutral-800/80 w-[100%] py-[20px] sticky top-[75px]">
      {adminLinks.map((link) => {
        const Icon = link.icon;
        const isActive = pathname === link.path;

        return (
          <Link
            key={link.path}
            href={link.path}
            className={`px-4 py-2 text-xs font-bold uppercase tracking-wider rounded-sm transition-all duration-200 items-center flex flex-row nowrap gap-2 ${
              isActive
                ? "bg-teal-600 text-white shadow-md shadow-teal-600/10"
                : "text-gray-400 hover:text-gray-200 hover:bg-neutral-800/60"
            }`}
          >
            <Icon size={20} />
            {link.name}
          </Link>
        );
      })}

      <button
        className="mr-auto bg-red-300/70 p-2 rounded-sm hover:bg-red-500 mt-[50px] transition-all duration-200 text-xs font-bold uppercase tracking-wider"
        onClick={() => signOut()}
      >
        Kilépés
      </button>
    </nav>
  );
}
