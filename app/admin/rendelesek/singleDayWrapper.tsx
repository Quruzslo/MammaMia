"use client";

import { useState } from "react";
import SingleModal from "./orderSinglePopup";

export default function SingleDayWrapper({
  day,
  orderId,
  orderObject,
}: {
  day: any;
  orderId: any;
  orderObject: any;
}) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <div className="flex flex-col rounded-[4px] border border-neutral-200 bg-black/50">
        <div className="border-b border-neutral-200 px-3.5 py-3.5">
          <p className="text-[14px] font-medium text-gray-100">{day.dayName}</p>
          <p className="text-[11px] text-gray-200">{day.date}</p>
        </div>

        <div className="flex items-baseline gap-1 border-b border-neutral-200 px-3.5 py-3">
          <span className="text-[26px] font-medium leading-none tabular-nums text-gray-200">
            {day.items?.reduce(
              (total: number, item: any) => total + item.quantity,
              0,
            )}
          </span>
          <span className="text-xs text-gray-200">étel</span>
        </div>

        <div>
          {orderObject.status === "pending" && (
            <div className="flex items-center gap-1.5 px-3.5 py-2.5">
              <div className="size-[10px] rounded-full bg-red-600" />
              <span className="text-xs text-gray-100">Függőben</span>
            </div>
          )}
          {orderObject.status !== "pending" && day.status === "ordered" && (
            <div className="flex items-center gap-1.5 px-3.5 py-2.5">
              <div className="size-[10px] rounded-full bg-amber-500" />
              <span className="text-xs text-gray-100">Megrendelve</span>
            </div>
          )}
          {orderObject.status !== "pending" && day.status !== "ordered" && (
            <div className="flex items-center gap-1.5 px-3.5 py-2.5">
              <div className="size-[10px]  rounded-full bg-green-700" />
              <span className="text-xs text-gray-100">Futárnak átadva</span>
            </div>
          )}
        </div>

        <button
          onClick={() => setIsOpen(true)}
          className="mt-auto w-full cursor-pointer border-t border-neutral-200 py-2.5 text-xs text-gray-400 transition-colors hover:bg-gray-50 hover:text-gray-700"
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
