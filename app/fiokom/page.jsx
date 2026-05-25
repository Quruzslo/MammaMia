"use client";
import UserOrders from "./userOrders";
// import { Link } from "react-router-dom";

import { CiViewList } from "react-icons/ci";

export default function UserDashboard() {
  return (
    <>
      <div className="user-dashboard flex flex-row gap-3 w-[90%] md:w-[80%] max-w-[1800px] mt-[50px] mx-auto">
        <div className="user-dashboard-nav flex flex-col gap-3 px-2.5 py-[25px]  bg-neutral-900/70 rounded-lg overflow-y-auto rounded-lg w-[250px]">
          <div className="flex flex-row w-full  relative p-2.5 rounded-xl bg-neutral-700 border border-neutral-800 hover:border-teal-500/50 transition-all gap-3 ">
            <CiViewList size={24} className="fill-teal-100" />
            <button className="text-teal-500">Rendeléseim</button>
          </div>
          <div className="flex flex-row w-full  relative p-2.5 rounded-xl bg-neutral-700 border border-neutral-800 hover:border-teal-500/50 transition-all gap-3 ">
            <CiViewList size={24} className="fill-teal-100" />

            <button className="text-teal-500">Adataim</button>
          </div>
        </div>

        <div className="user-dashboard-main w-[80%] p-2 bg-neutral-900/70 rounded-lg ">
          <UserOrders></UserOrders>
        </div>
      </div>
    </>
  );
}
