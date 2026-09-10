"use client";
import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import { adminLinks } from "./adminLinks";
import { LuPanelLeftClose, LuPanelLeftOpen } from "react-icons/lu";
import { BiLogOutCircle } from "react-icons/bi";
export default function AdminNav({}) {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(true);

  return (
    <nav
      className={`flex flex-col gap-2 w-[100%] bg-neutral-700 min-h-fit  rounded-sm  md:h-[calc(100vh-85px)] py-[20px] sticky top-[75px] transition-all duration-300 ease-in-out ${
        isOpen ? "md:w-64 px-[10px]" : "md:w-[50px] px-[5px]"
      }`}
    >
      <button
        onClick={() => setIsOpen(!isOpen)}
        className=" hidden md:flex mx-auto mb-[35px]"
      >
        {isOpen ? (
          <LuPanelLeftClose size={30} title="Panel bezárása" />
        ) : (
          <LuPanelLeftOpen size={30} title="Panel kinyitása" />
        )}
      </button>
      {adminLinks.map((link) => {
        const Icon = link.icon;
        const isActive = pathname === link.path;

        return (
          <Link
            key={link.path}
            href={link.path}
            title={!isOpen ? link.name : undefined}
            className={`p-[5px] text-[12px] font-bold transition-all duration-200 items-center flex flex-row nowrap overflow-hidden ${
              isActive
                ? "bg-white text-neutral-600 shadow-md shadow-teal-600/10 rounded-full"
                : "text-gray-400 hover:text-gray-200 hover:bg-neutral-800/60 rounded-sm"
            }`}
          >
            <Icon
              size={30}
              className={`transition-all ease duration-500 shrink-0 ${
                isActive
                  ? "bg-blue-600 text-white shadow-[0px_5px_10px_0px_rgba(0,0,0,0.4)]"
                  : "bg-white text-neutral-600"
              } p-[2px] rounded-full`}
            />

            <span
              className={`whitespace-nowrap transition-all duration-300 ease-in-out ml-2 ${
                isOpen
                  ? "opacity-100 translate-x-0 w-auto"
                  : "opacity-0 -translate-x-4 w-0 pointer-events-none"
              }`}
            >
              {link.name}
            </span>
          </Link>
        );
      })}

      <button
        className="bg-red-300/70 mt-auto p-2 rounded-sm hover:bg-red-500 mt-[50px] transition-all duration-200 text-xs font-bold uppercase tracking-wider flex justify-center items-center overflow-hidden"
        onClick={() => signOut()}
        title="Kilépés"
      >
        <span
          className={`whitespace-nowrap transition-all duration-300 ${
            isOpen ? "opacity-100" : "opacity-100"
          }`}
        >
          {isOpen ? "Kilépés" : <BiLogOutCircle size={30} />}
        </span>
      </button>
    </nav>
  );
}
