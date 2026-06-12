import { useState, useEffect } from "react";
import { FiChevronDown, FiChevronUp } from "react-icons/fi";

export default function OrderCard({ order, cardOpen, setCardOpen }) {
  return (
    <div
      className={`bg-white rounded-sm border transition-all duration-300 flex flex-col mb-4 last:mb-0 overflow-hidden ${
        cardOpen
          ? "border-gray-900 ring-1 ring-gray-900 shadow-md"
          : "border-gray-200 hover:border-gray-300  hover:shadow-md"
      }`}
    >
      {/* --- KÁRTYA FEJLÉC  --- */}
      <div
        className="grid grid-cols-2 sm:grid-cols-3  lg:grid-cols-6 items-center gap-4 p-4 md:p-5 cursor-pointer select-none group w-full border-b border-gray-50"
        onClick={() => setCardOpen(!cardOpen)}
      >
        {/* 1. Azonosító Blokk */}
        <div className="flex flex-col wrap order-1 md:order-1 col-span-1 items-start justify-start">
          <span className="text-[10px] font-bold uppercase text-gray-900 tracking-widest block mb-1 md:hidden">
            Azonosító
          </span>
          <span
            className="font-mono text-xs font-bold text-gray-900 bg-gray-100 px-2.5 py-1.5 rounded border border-gray-200 w-fit truncate select-all"
            onClick={(e) => e.stopPropagation()}
          >
            #{order.orderId || (order._id ? order._id.substring(0, 8) : "N/A")}
          </span>
        </div>

        {/* 2. Rendelés Dátuma  */}
        <div className="flex flex-col order-3 md:order-2 col-span-1 items-start justify-start">
          <span className="text-[10px] font-bold uppercase text-gray-400 tracking-widest block mb-1 md:hidden">
            Rendelés Dátuma
          </span>
          <span className="text-sm font-semibold text-gray-700">
            {new Date(order.date).toLocaleDateString("hu-HU", {
              year: "numeric",
              month: "short",
              day: "numeric",
            })}
          </span>
        </div>

        {/* 3. Ételek száma  */}
        <div className="flex flex-col order-4 md:order-3 col-span-1 items-start justify-start">
          <span className="text-[10px] font-bold uppercase text-gray-400 tracking-widest block mb-1 md:hidden">
            Mennyiség
          </span>
          <div className="flex items-baseline gap-1">
            <span className="text-lg md:text-xl font-bold tabular-nums text-gray-900">
              {order.items?.reduce(
                (osszMennyiseg, nap) =>
                  osszMennyiseg +
                  (nap.items?.reduce(
                    (napiOsszeg, etel) => napiOsszeg + etel.quantity,
                    0,
                  ) || 0),
                0,
              ) || 0}
            </span>
            <span className="text-xs font-medium text-gray-500">étel</span>
          </div>
        </div>

        {/* 4. Státusz Blokk  */}
        <div className="flex flex-col order-5 md:order-4 col-span-1 items-start justify-start">
          <span className="text-[10px] font-bold uppercase text-gray-400 tracking-widest block mb-1 md:hidden">
            Státusz
          </span>
          <span
            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-sm text-xs font-bold uppercase tracking-wide border w-fit ${
              order.status === "succeeded"
                ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                : order.status === "deleted"
                  ? "bg-rose-50 text-rose-700 border-rose-200"
                  : order.status === "shipped"
                    ? "bg-blue-50 text-blue-700 border-blue-200"
                    : "bg-amber-50 text-amber-700 border-amber-200"
            }`}
          >
            <span
              className={`w-1.5 h-1.5 rounded-full ${
                order.status === "succeeded"
                  ? "bg-emerald-500"
                  : order.status === "deleted"
                    ? "bg-rose-500"
                    : order.status === "shipped"
                      ? "bg-blue-500"
                      : "bg-amber-500"
              }`}
            />
            {order.status === "succeeded"
              ? "Megrendelve"
              : order.status === "deleted"
                ? "Törölve"
                : order.status === "shipped"
                  ? "Futárnál"
                  : "Függőben"}
          </span>
        </div>

        {/* 5. Fizetett összeg kijelző */}
        <div className="flex flex-col  order-2 md:order-5 col-span-1  items-start justify-start">
          <span className="text-[10px] font-bold uppercase text-gray-400 tracking-widest block mb-1 md:hidden">
            Fizetett összeg
          </span>
          <span className="text-sm font-black text-gray-900 bg-gray-50 border border-gray-100 px-3 py-1.5 rounded">
            {order.total.toLocaleString()} Ft
          </span>
        </div>

        {/* 6. Nyitó fül / gomb */}
        <div className="flex items-center justify-start order-6 md:order-6 col-span-1 sm:col-span-3 md:col-span-1 mt-2 md:mt-0 pt-2 sm:pt-0 border-t sm:border-0 border-gray-50">
          <button
            onClick={(e) => {
              e.stopPropagation();
              setCardOpen(!cardOpen);
            }}
            className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all border ${
              cardOpen
                ? "bg-gray-900 text-white border-gray-900 shadow-xs"
                : "bg-white text-gray-700 border-gray-200 group-hover:border-gray-900 group-hover:text-gray-900"
            }`}
          >
            <span>{cardOpen ? "Bezár" : "Megnyitás"}</span>
            {cardOpen ? <FiChevronUp size={14} /> : <FiChevronDown size={14} />}
          </button>
        </div>
      </div>

      {/* --- LENYÍLÓ TARTALOM (GRID ANIMÁCIÓ) --- */}
      <div
        className={`grid transition-all duration-500 ease-[cubic-bezier(0.85,0,0.15,1)] ${
          cardOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
        }`}
      >
        <div className="overflow-hidden bg-gray-50/50">
          <div className="p-4 md:p-6 space-y-4">
            <span className="text-xs font-bold uppercase text-gray-400 tracking-widest block">
              Rendelt ételek napok szerint
            </span>

            {/* Belső kártyák elrendezése modern hálózatba */}
            <div className="grid gap-4 sm:grid-cols-1 ">
              {order.items &&
                order.items
                  .sort((a, b) => new Date(a.date) - new Date(b.date))
                  .map((nap) => (
                    // --- BELSŐ CIKLUS 1: NAPOK ---
                    <div
                      key={nap.date}
                      className="bg-white rounded-xl border border-gray-200 shadow-xs overflow-hidden flex flex-col"
                    >
                      {/* Nap fejléce */}
                      <div className="bg-gray-50 p-3 px-4 border-b border-gray-200 flex justify-between items-center">
                        <span className="text-gray-900 font-bold uppercase tracking-wider text-xs">
                          {nap.dayName}
                        </span>
                        <span className="text-[11px] text-gray-500 font-bold tracking-wider">
                          {nap.date}
                        </span>
                      </div>

                      {/* Ételek listája */}
                      <div className="p-4 flex flex-col gap-1 flex-1 divide-y divide-gray-100">
                        {/* --- BELSŐ CIKLUS 2: ÉTELEK --- */}
                        {nap.items.map((etel) => (
                          <div
                            key={`${nap.date}-${etel.name}`}
                            className="flex flex-row justify-between items-center py-3.5 first:pt-0 last:pb-0 gap-3"
                          >
                            {/* Bal oldal: Név és Egységár */}
                            <div className="flex flex-col min-w-0 flex-1">
                              <p className="text-sm text-gray-900 font-bold truncate leading-tight">
                                {etel.name}
                              </p>
                              <p className="text-xs text-gray-500 mt-0.5">
                                {etel.price.toLocaleString()} Ft / db
                              </p>
                            </div>

                            {/* Jobb oldal: Mennyiség és Összesen */}
                            <div className="flex flex-row items-center justify-end gap-3 shrink-0">
                              <div className="bg-gray-100 text-gray-800 px-2 py-0.5 rounded text-xs font-bold border border-gray-200 text-center">
                                {etel.quantity} db
                              </div>
                              <div className="text-sm font-extrabold text-gray-900 text-right min-w-[70px]">
                                {(etel.price * etel.quantity).toLocaleString()}{" "}
                                Ft
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
            </div>

            {/* Alsó másodlagos bezáró gomb */}
            <div className="flex justify-center pt-4 pb-2">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setCardOpen(!cardOpen);
                }}
                className="px-6 py-2.5 rounded-full bg-white border border-gray-200 hover:border-gray-900 hover:bg-gray-900 text-gray-700 hover:text-white transition-colors shrink-0 cursor-pointer text-xs font-bold uppercase tracking-widest flex items-center gap-2 shadow-xs"
              >
                Bezárás <FiChevronUp size={16} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
