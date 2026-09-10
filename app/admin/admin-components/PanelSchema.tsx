"use client";

import AdminNav from "./adminNav";
import PusherComponent from "../rendelesek/pusher";
export default function PanelSchema({ children }: any) {
  return (
    <section className="py-6 px-4 w-[100%] mx-auto min-h-screen bg-neutral-900 !text-gray-100 flex flex-col md:flex-row gap-3">
      <div
        className={`flex flex-col gap-3 mb-[35px]  !min-h-full  transition-all ease duration-300 w-full md:w-fit`}
      >
        <AdminNav />
      </div>
      <div className="flex flex-col w-[100%] p-[10px] max-w-[1800px] mx-auto">
        <PusherComponent></PusherComponent>
        {children}
      </div>
    </section>
  );
}
