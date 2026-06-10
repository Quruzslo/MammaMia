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
    <div className="user-dashboard flex flex-col md:flex-row gap-3 w-[100%] bg-neutral-900  min-h-[100vh] items-start px-4 py-4">
      <div className="user-dashboard-nav w-[100%] md:sticky md:top-[75px] rounded-xl border border-neutral-600/80 grid grid-cols-1 md:grid-cols-3 md:w-[250px] md:flex md:flex-col gap-2 px-[5px] py-[25px]  rounded-lg overflow-y-auto ">
        <div
          onClick={() => signOut()}
          className="flex flex-row w-auto relative py-[5px] px-[20px] rounded-sm bg-neutral-700 border border-neutral-800 hover:border-teal-500/50 transition-all gap-2 cursor-pointer "
        >
          <CiLogout size={24} className="fill-white" />
          <button className="text-red-300">Kilépés</button>
        </div>
        <div
          onClick={() => setCurrentMenu("orders")}
          className="flex flex-row w-auto relative py-[5px] px-[20px] rounded-sm bg-neutral-700 border border-neutral-800 hover:border-teal-500/50 transition-all gap-2 cursor-pointer"
        >
          <PiBowlFood size={24} className="fill-white" />
          <button className="text-white">Rendeléseim</button>
        </div>
        <div
          onClick={() => setCurrentMenu("datas")}
          className="flex flex-row w-auto relative py-[5px] px-[20px] rounded-sm bg-neutral-700 border border-neutral-800 hover:border-teal-500/50 transition-all gap-2 cursor-pointer"
        >
          <CiViewList size={24} className="fill-white" />
          <button className="text-white">Adataim</button>
        </div>
      </div>

      <div className="user-dashboard-main w-[100%] md:w-[80%] p-2 bg-neutral-900/70 rounded-lg ">
        {currentMenu === "orders" ? <UserOrders /> : <UserData />}
      </div>
    </div>
  );
}
