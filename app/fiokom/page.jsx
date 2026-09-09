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
    <div className="user-dashboard flex flex-col md:flex-row gap-6 w-full bg-gray-100 min-h-screen px-[10px] py-8">
      {/* Oldalsáv Menü */}
      <div className="user-dashboard-nav w-full h-[100%] md:sticky md:top-[75px] bg-white shadow-lg grid grid-cols-1 md:grid-cols-1 md:w-[250px] gap-1 p-3 rounded-lg overflow-y-auto">
        <div
          onClick={() => setCurrentMenu("orders")}
          className="flex flex-row items-center w-full py-2.5 px-4 rounded-sm text-black hover:bg-gray-100  hover:text-black transition-colors gap-3 cursor-pointer"
        >
          <PiBowlFood size={22} className="text-current" />
          <button className="font-semibold text-sm">Rendeléseim</button>
        </div>

        <div
          onClick={() => setCurrentMenu("datas")}
          className="flex flex-row items-center w-full py-2.5 px-4 rounded-sm  hover:bg-gray-100  text-black transition-colors gap-3 cursor-pointer"
        >
          <CiViewList size={22} className="text-current" />
          <button className="font-semibold text-sm">Adataim</button>
        </div>

        {/* Elválasztó vonal a Kilépés előtt */}
        <div className="h-px bg-gray-100 my-1 w-full"></div>

        <div
          onClick={() => signOut()}
          className="flex flex-row items-center mt-auto w-full py-2.5 px-4 rounded-md bg-white hover:bg-red-50 group transition-colors gap-3 cursor-pointer"
        >
          <CiLogout
            size={22}
            className="text-red-500 group-hover:text-red-600"
          />
          <button className="text-red-500 group-hover:text-red-600 font-semibold text-sm">
            Kilépés
          </button>
        </div>
      </div>

      {/* Fő tartalom */}
      <div className="user-dashboard-main w-full  p-[10px]  rounded-sm">
        {currentMenu === "orders" ? <UserOrders /> : <UserData />}
      </div>
    </div>
  );
}
