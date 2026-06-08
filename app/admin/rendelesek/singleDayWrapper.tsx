"use client";

import { useState } from "react";
import SingleModal from "./orderSinglePopup";

export default function SingleDayWrapper({
  day,
  orderId,
}: {
  day: any;
  orderId: any;
}) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <div className="flex flex-col rounded-sm border border-neutral-700 bg-white overflow-hidden">
        <div className="p-3 flex flex-col text-center">
          <h3 className="text-sm font-bold text-gray-800">{day.dayName}</h3>
          <p className="text-xs text-gray-800 mb-2">{day.date}</p>
          <span className="bg-neutral-800 text-white text-[15px] px-2 py-1 rounded-sm  ">
            {day.items?.reduce(
              (total: number, item: any) => total + item.quantity,
              0,
            )}{" "}
            étel
          </span>
        </div>
        {day.status === "ordered" ? (
          <div className="flex flex-row  items-center justify-center bg-orange-400 p-[10px] ">
            <p className=" text-[15px]">Megrendelve</p>
          </div>
        ) : (
          <div className="flex flex-row  items-center justify-center bg-green-700 p-[10px] ">
            <p className=" text-[15px]">Futárnak átadva</p>
          </div>
        )}

        <button
          onClick={() => setIsOpen(true)}
          className="w-full py-2 mt-auto bg-black/70 hover:bg-black text-white  text-xs font-bold transition-all border-t border-teal-500/20 cursor-pointer"
        >
          Megnyitás
        </button>
      </div>

      {isOpen && (
        <SingleModal
          orderId={orderId}
          day={day}
          onClose={() => setIsOpen(false)}
        />
      )}
    </>
  );
}
