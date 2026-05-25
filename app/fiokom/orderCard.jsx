import { useState, useEffect } from "react";
import { FiChevronDown, FiChevronUp } from "react-icons/fi";

export default function OrderCard({ order, cardOpen, setCardOpen }) {
  return (
    <div className="bg-neutral-800 rounded-xl overflow-hidden shadow-2xl border-l-4 border-teal-500 hover:border-teal-400 transition-all p-6 flex flex-col">
      <div
        className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 pb-4 border-b border-neutral-700 cursor-pointer select-none group w-full"
        onClick={() => setCardOpen(!cardOpen)}
      >
        <div className="flex flex-col sm:flex-row gap-4 sm:items-center w-full lg:w-auto">
          <div className="bg-neutral-900/50 p-3 rounded-xl border border-neutral-700 text-center min-w-[140px]">
            <span className="text-[10px] font-bold uppercase text-teal-500 tracking-widest block mb-1">
              Rendelés Dátuma
            </span>
            <h3 className="text-lg font-black text-white tracking-tight">
              {new Date(order.date).toLocaleDateString("hu-HU")}
            </h3>
          </div>

          <div className="space-y-1">
            <span className="text-[10px] font-bold uppercase text-teal-500 tracking-widest block">
              Azonosító
            </span>
            <h4
              className="text-gray-300 font-mono text-sm tracking-wider bg-neutral-900/60 px-3 py-1.5 rounded-lg border border-neutral-700/60 break-all select-all"
              onClick={(e) => e.stopPropagation()}
            >
              {order._id}
            </h4>
          </div>
        </div>

        {/* Fizetendő és az animált nyíl */}
        <div className="flex items-center justify-between lg:justify-end gap-4 w-full lg:w-auto">
          <div className="sm:text-right bg-neutral-900/40 px-5 py-3 rounded-xl border border-neutral-700/50 flex-1 lg:flex-none">
            <span className="text-[10px] font-bold uppercase text-gray-400 tracking-widest block mb-0.5">
              Fizetett összeg
            </span>
            <p className="text-[15px] font-black text-green-400 tracking-tight">
              {order.total.toLocaleString()} Ft
            </p>
          </div>

          <div className="p-2 rounded-lg bg-neutral-900/50 text-teal-400 group-hover:bg-teal-950 transition-colors shrink-0">
            {cardOpen ? (
              <FiChevronUp className="fill-white" size={24} />
            ) : (
              <FiChevronDown className="fill-white" size={24} />
            )}
          </div>
        </div>
      </div>

      <div
        className={`grid transition-all duration-500 ease-[cubic-bezier(0.85,0,0.15,1)] ${
          isOpen
            ? "grid-rows-[1fr] opacity-100 mt-6"
            : "grid-rows-[0fr] opacity-0 mt-0"
        }`}
      >
        <div className="overflow-hidden w-full space-y-4">
          <span className="text-xs font-bold uppercase text-teal-500 tracking-widest block mb-2">
            Rendelt ételek napok szerint
          </span>

          {order.items &&
            order.items
              .sort((a, b) => new Date(a.date) - new Date(b.date))
              .map((nap) => (
                // --- BELSŐ CIKLUS 1: NAPOK ---
                <div
                  key={nap.date}
                  className="bg-neutral-900/40 rounded-lg border border-teal-900/40 overflow-hidden"
                >
                  <div className="bg-teal-950/60 p-2.5 border-b border-teal-900/40 flex justify-between items-center">
                    <span className="text-teal-400 font-bold text-sm">
                      {nap.dayName}
                    </span>
                    <span className="text-[11px] text-teal-600 font-mono">
                      {nap.date}
                    </span>
                  </div>

                  <div className="p-3 flex flex-col gap-3 bg-neutral-900/20">
                    {/* --- BELSŐ CIKLUS 2: ÉTELEK --- */}
                    {nap.items.map((etel) => (
                      <div
                        key={`${nap.date}-${etel.name}`}
                        className="flex justify-between items-center border-b border-neutral-800 last:border-0 pb-2 last:pb-0 gap-4"
                      >
                        <div className="flex flex-col">
                          <p className="text-sm text-teal-50 font-medium leading-tight">
                            {etel.name}
                          </p>
                          <p className="text-xs text-teal-500/80 mt-0.5">
                            {etel.price} Ft / db
                          </p>
                        </div>

                        <div className="flex items-center gap-4 shrink-0">
                          <div className="bg-teal-900/30 text-teal-400 px-2.5 py-1 rounded text-xs font-bold border border-teal-900/60 min-w-[55px] text-center">
                            {etel.quantity} db
                          </div>
                          <div className="text-sm font-semibold text-teal-100 min-w-[70px] text-right">
                            {(etel.price * etel.quantity).toLocaleString()} Ft
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
          <div
            onClick={() => setCardOpen(!cardOpen)}
            className="p-2 rounded-lg bg-neutral-900/50 text-teal-400 group-hover:bg-teal-950 transition-colors shrink-0 cursor-pointer justify-self-center"
          >
            {isOpen ? (
              <FiChevronUp className="fill-white" size={24} />
            ) : (
              <FiChevronDown className="fill-white" size={24} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
