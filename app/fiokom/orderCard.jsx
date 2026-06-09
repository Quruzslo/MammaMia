import { useState, useEffect } from "react";
import { FiChevronDown, FiChevronUp } from "react-icons/fi";

export default function OrderCard({ order, cardOpen, setCardOpen }) {
  return (
    <div className="bg-white rounded-sm border border-stone-200 shadow-[0_2px_12px_rgba(0,0,0,0.01)] transition-all duration-300 hover:border-stone-400 px-4 py-5 flex flex-col">
      {/* Kártya Fejléc (Kattintható sáv) */}
      <div
        className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 pb-4 border-b border-stone-100 cursor-pointer select-none group w-full"
        onClick={() => setCardOpen(!cardOpen)}
      >
        <div className="flex flex-col sm:flex-row gap-4 sm:items-center w-full lg:w-auto">
          {/* Rendelés Dátuma Blokk */}
          <div className="bg-[#faf9f6] p-[10px] rounded-sm border border-stone-200 text-center min-w-[140px]">
            <span className="text-[10px] font-black uppercase text-stone-400 tracking-widest block mb-1">
              Rendelés Dátuma
            </span>
            <h3 className="text-base font-black text-stone-900 tracking-wide text-[15px]">
              {new Date(order.date).toLocaleDateString("hu-HU")}
            </h3>
          </div>

          {/* Azonosító Blokk */}
          <div className="space-y-1">
            <span className="text-[10px] font-black uppercase text-stone-400 tracking-widest block">
              Azonosító
            </span>
            <h4
              className="text-stone-900 font-mono text-xs tracking-wide bg-[#faf9f6] px-3 py-1.5 rounded-sm border border-stone-200/80 break-all select-all mt-1"
              onClick={(e) => e.stopPropagation()}
            >
              {order._id}
            </h4>
          </div>
        </div>

        {/* Fizetendő és az animált nyíl */}
        <div className="flex items-center justify-between lg:justify-end gap-4 w-full lg:w-auto">
          {/* Fizetett összeg kijelző */}
          <div className="sm:text-right bg-[#faf9f6] px-5 py-3 rounded-sm border border-stone-200 flex-1 lg:flex-none">
            <span className="text-[10px] font-black uppercase text-stone-400 tracking-widest block mb-0.5">
              Fizetett összeg
            </span>
            <p className="text-[15px] font-black text-stone-900 tracking-tight">
              {order.total.toLocaleString()} Ft
            </p>
          </div>

          {/* Nyitó gomb */}
          <div className="p-2 rounded-full bg-stone-100 text-stone-600 group-hover:bg-stone-900 group-hover:text-white transition-colors shrink-0">
            {cardOpen ? <FiChevronUp size={20} /> : <FiChevronDown size={20} />}
          </div>
        </div>
      </div>

      {/* LENYÍLÓ TARTALOM  */}
      <div
        className={`grid transition-all duration-500 ease-[cubic-bezier(0.85,0,0.15,1)] ${
          cardOpen
            ? "grid-rows-[1fr] opacity-100 mt-6"
            : "grid-rows-[0fr] opacity-0 mt-0"
        }`}
      >
        <div className="overflow-hidden w-full space-y-4">
          <span className="text-xs font-black uppercase text-stone-400 tracking-widest block mb-2">
            Rendelt ételek napok szerint
          </span>

          {order.items &&
            order.items
              .sort((a, b) => new Date(a.date) - new Date(b.date))
              .map((nap) => (
                // --- BELSŐ CIKLUS 1: NAPOK ---
                <div
                  key={nap.date}
                  className="bg-white rounded-sm border border-stone-200 overflow-hidden shadow-sm"
                >
                  {/* Nap fejléce - Tiszta fekete sáv */}
                  <div className="bg-stone-900 p-2.5 px-4 border-b border-stone-900 flex justify-between items-center">
                    <span className="text-white font-black uppercase tracking-wider text-xs">
                      {nap.dayName}
                    </span>
                    <span className="text-[11px] text-stone-400 font-bold tracking-wider">
                      {nap.date}
                    </span>
                  </div>

                  {/* Ételek listája a napon belül */}
                  <div className="p-3 flex flex-col gap-3 bg-white">
                    {/* --- BELSŐ CIKLUS 2: ÉTELEK --- */}
                    {nap.items.map((etel) => (
                      <div
                        key={`${nap.date}-${etel.name}`}
                        className="flex justify-between items-center border-b border-stone-100 last:border-0 py-2.5 last:pb-0 gap-3 px-1"
                      >
                        <div className="flex flex-col">
                          <p className="text-sm text-stone-900 font-bold leading-tight">
                            {etel.name}
                          </p>
                          <p className="text-xs text-stone-400 font-bold mt-0.5">
                            {etel.price.toLocaleString()} Ft / db
                          </p>
                        </div>

                        <div className="flex flex-col md:flex-row items-center gap-2 ml-auto  w-auto justify-end">
                          {/* Mennyiség Tag */}
                          <div className="bg-stone-50 text-stone-800 px-2.5 py-1 rounded-sm text-xs font-black border border-stone-200 text-center text-nowrap">
                            {etel.quantity} db
                          </div>
                          {/* Részösszeg */}
                          <div className="text-sm font-black text-stone-900 text-right text-nowrap flex flex-row ">
                            {(etel.price * etel.quantity).toLocaleString()} Ft
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}

          {/* Alsó másodlagos bezáró gomb */}
          <div className="flex justify-center pt-2">
            <div
              onClick={() => setCardOpen(!cardOpen)}
              className="p-2 px-4 rounded-full bg-stone-100 hover:bg-stone-900 text-stone-600 hover:text-white transition-colors shrink-0 cursor-pointer text-xs font-black uppercase tracking-widest flex items-center gap-1 shadow-sm"
            >
              Bezárás <FiChevronUp size={16} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
