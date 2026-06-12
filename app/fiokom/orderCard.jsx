import { useState, useEffect } from "react";
import { FiChevronDown, FiChevronUp } from "react-icons/fi";

export default function OrderCard({ order, cardOpen, setCardOpen }) {
  return (
    <div className="bg-gray-800 rounded-lg border border-gray-200 shadow-sm transition-all duration-300 hover:border-gray-300 p-[10px] flex flex-col mb-4 last:mb-0">
      {/* --- Fejléc --- */}
      <div
        className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3 pb-4 border-b border-gray-100 cursor-pointer select-none group w-full"
        onClick={() => setCardOpen(!cardOpen)}
      >
        <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto items-start sm:items-center min-w-0">
          {/* Rendelés Dátuma Blokk */}
          <div className=" text-center w-full sm:w-auto ">
            <span className="text-[10px] font-bold uppercase text-gray-100 tracking-widest block mb-1">
              Rendelés Dátuma
            </span>
            <h3 className="text-sm font-bold text-gray-900 bg-white p-[5px] rounded-sm tracking-wide">
              {new Date(order.date).toLocaleDateString("hu-HU")}
            </h3>
          </div>

          {/* Azonosító Blokk */}
          <div className="space-y-1 w-full sm:w-auto min-w-0">
            <span className="text-[10px] font-bold uppercase text-gray-100 tracking-widest block">
              Azonosító
            </span>
            <h4
              className="text-gray-700 font-mono text-xs tracking-wide bg-white p-[5px] rounded border border-gray-200 truncate sm:break-all select-all mt-1 w-full block"
              onClick={(e) => e.stopPropagation()}
            >
              {order.orderId}
            </h4>
          </div>
        </div>

        {/* Fizetendő és az animált nyíl */}
        <div className="flex items-center justify-between w-full md:w-auto gap-4  mt-2 md:mt-0">
          {/* Fizetett összeg kijelző */}
          <div className="text-left sm:text-right p-[5px] ">
            <span className="text-[10px] font-bold uppercase text-gray-100 tracking-widest block mb-0.5">
              Fizetett összeg
            </span>
            <p className="text-[15px] font-bold bg-gray-50 text-gray-900 tracking-tight rounded-sm p-[5px]">
              {order.total.toLocaleString()} Ft
            </p>
          </div>

          {/* Nyitó gomb */}
          <div className="p-2.5 rounded-full bg-gray-100 text-gray-600 group-hover:bg-black group-hover:text-white transition-colors shrink-0 flex items-center justify-center">
            {cardOpen ? <FiChevronUp size={20} /> : <FiChevronDown size={20} />}
          </div>
        </div>
      </div>

      {/* --- LENYÍLÓ TARTALOM --- */}
      <div
        className={`grid transition-all duration-500 ease-[cubic-bezier(0.85,0,0.15,1)] ${
          cardOpen
            ? "grid-rows-[1fr] opacity-100 mt-5"
            : "grid-rows-[0fr] opacity-0 mt-0"
        }`}
      >
        <div className="overflow-hidden w-full space-y-5">
          <span className="text-xs font-bold uppercase text-gray-400 tracking-widest block pt-2">
            Rendelt ételek napok szerint
          </span>

          {order.items &&
            order.items
              .sort((a, b) => new Date(a.date) - new Date(b.date))
              .map((nap) => (
                // --- BELSŐ CIKLUS 1: NAPOK ---
                <div
                  key={nap.date}
                  className="bg-white rounded-md border border-gray-200 overflow-hidden"
                >
                  {/* Nap fejléce */}
                  <div className="bg-gray-50 p-2.5 px-4 border-b border-gray-200 flex justify-between items-center">
                    <span className="text-gray-800 font-bold uppercase tracking-wider text-xs">
                      {nap.dayName}
                    </span>
                    <span className="text-[11px] text-gray-500 font-semibold tracking-wider">
                      {nap.date}
                    </span>
                  </div>

                  {/* Ételek listája  */}
                  <div className="p-3 sm:p-4 flex flex-col gap-1 bg-white">
                    {/* --- BELSŐ CIKLUS 2: ÉTELEK --- */}
                    {nap.items.map((etel) => (
                      <div
                        key={`${nap.date}-${etel.name}`}
                        className="flex flex-col sm:flex-row justify-between sm:items-center border-b-3 border-gray-400 last:border-0 py-3 last:pb-0 gap-2"
                      >
                        {/* Bal oldal: Név és Egységár */}
                        <div className="flex flex-col w-full sm:w-auto pr-0 sm:pr-4">
                          <p className="text-sm text-gray-900 font-semibold leading-tight">
                            {etel.name}
                          </p>
                          <p className="text-xs text-gray-500 mt-1">
                            {etel.price.toLocaleString()} Ft / db
                          </p>
                        </div>

                        {/* Jobb oldal: Mennyiség és Összesen  */}
                        <div className="flex flex-row items-center justify-between sm:justify-end gap-4 w-full sm:w-auto border-t sm:border-0 border-gray-100 pt-2 sm:pt-0">
                          {/* Mennyiség Tag */}
                          <div className="bg-gray-100 text-gray-800 px-3 py-1.5 rounded text-xs font-semibold border border-gray-200 text-center whitespace-nowrap shrink-0">
                            {etel.quantity} db
                          </div>
                          {/* Részösszeg */}
                          <div className="text-sm font-bold text-gray-900 text-right whitespace-nowrap min-w-[70px]">
                            {(etel.price * etel.quantity).toLocaleString()} Ft
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}

          {/* Alsó másodlagos bezáró gomb */}
          <div className="flex justify-center pt-3 pb-1">
            <div
              onClick={() => setCardOpen(!cardOpen)}
              className="px-6 py-2.5 rounded-full bg-gray-100 hover:bg-black text-gray-700 hover:text-white transition-colors shrink-0 cursor-pointer text-xs font-bold uppercase tracking-widest flex items-center gap-2"
            >
              Bezárás <FiChevronUp size={16} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
