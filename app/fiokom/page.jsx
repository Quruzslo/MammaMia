"use client";
import UserOrders from "./userOrders";
import UserData from "./userData";
import { CiViewList } from "react-icons/ci";
import { CiLogout } from "react-icons/ci";
import { PiBowlFood } from "react-icons/pi";
import { SessionProvider } from "next-auth/react";
import { signOut } from "next-auth/react";
import { useState } from "react";

export default function UserDashboard() {
  const [currentMenu, setCurrentMenu] = useState("orders");
  return (
    <div className="user-dashboard flex flex-row gap-3 w-[90%] md:w-[80%] max-w-[1800px] my-[50px] mx-auto min-h-[100vh] items-start">
      <div className="user-dashboard-nav flex flex-col gap-3 px-2.5 py-[25px] bg-neutral-900/70 rounded-lg overflow-y-auto w-[250px]">
        <div
          onClick={() => signOut()}
          className="flex flex-row w-full relative p-2.5 rounded-xl bg-neutral-700 border border-neutral-800 hover:border-teal-500/50 transition-all gap-3 cursor-pointer "
        >
          <CiLogout size={24} className="fill-teal-100" />
          <button className="text-red-300">Kilépés</button>
        </div>
        <div
          onClick={() => setCurrentMenu("orders")}
          className="flex flex-row w-full relative p-2.5 rounded-xl bg-neutral-700 border border-neutral-800 hover:border-teal-500/50 transition-all gap-3 cursor-pointer"
        >
          <PiBowlFood size={24} className="fill-teal-100" />
          <button className="text-white">Rendeléseim</button>
        </div>
        <div
          onClick={() => setCurrentMenu("datas")}
          className="flex flex-row w-full relative p-2.5 rounded-xl bg-neutral-700 border border-neutral-800 hover:border-teal-500/50 transition-all gap-3 cursor-pointer"
        >
          <CiViewList size={24} className="fill-teal-100" />
          <button className="text-white">Adataim</button>
        </div>
      </div>

      <div className="user-dashboard-main w-[80%] p-2 bg-neutral-900/70 rounded-lg ">
        {currentMenu === "orders" ? <UserOrders /> : <UserData />}
      </div>
    </div>
  );
}
