"use client";

import { useState } from "react";
import SingleModal from "./orderSinglePopup";

export default function SingleDayWrapper({ day }: { day: any }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <div className="flex flex-col rounded-sm border border-neutral-700 bg-neutral-900/50 overflow-hidden">
        <div className="p-3 flex-grow text-center">
          <h3 className="text-sm font-bold text-gray-200">{day.dayName}</h3>
          <p className="text-xs text-gray-500 mb-2">{day.date}</p>
          <span className="bg-neutral-800 text-teal-400 text-[10px] px-2 py-1 rounded-full uppercase tracking-tighter border border-teal-900/50">
            {day.items?.reduce(
              (total: number, item: any) => total + item.quantity,
              0,
            )}{" "}
            étel
          </span>
        </div>

        <button
          onClick={() => setIsOpen(true)}
          className="w-full py-2 bg-teal-600/10 hover:bg-teal-600 text-teal-400 hover:text-white text-xs font-bold transition-all border-t border-teal-500/20 cursor-pointer"
        >
          Megnyitás
        </button>
      </div>

      {isOpen && <SingleModal day={day} onClose={() => setIsOpen(false)} />}
    </>
  );
}
