"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { MdEdit, MdClose, MdCheck } from "react-icons/md";

interface OrderActionsProps {
  orderId: string;
  currentStatus: string;
  setIsEditing: any;
  isEditing: boolean;
}

export default function OrderActions({
  orderId,
  currentStatus,
  setIsEditing,
  isEditing,
}: OrderActionsProps) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);

  const handleUpdateStatus = async (targetStatus: string) => {
    try {
      const res = await fetch("/api/admin/delete-reset-order", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          orderId: orderId,
          targetStatus: targetStatus,
        }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Hiba történt");
      }

      setIsOpen(false);
      router.refresh();
    } catch (error: any) {
      console.error("Hálózati vagy szerver hiba:", error);
      alert(error.message || "Nem sikerült a művelet!");
    }
  };

  return (
    <div className="editing-wrapper relative flex flex-col mb-[20px] w-fit">
      {/* 3 pötty */}
      <div
        onClick={() => setIsOpen(!isOpen)}
        className="editing-btn flex flex-row nowrap gap-[5px] cursor-pointer py-2 px-1 hover:opacity-80"
      >
        <div className="w-[7px] h-[7px] rounded-full bg-white" />
        <div className="w-[7px] h-[7px] rounded-full bg-white" />
        <div className="w-[7px] h-[7px] rounded-full bg-white" />
      </div>

      {/* A Dropdown Menü */}
      <div
        className={`flex flex-col gap-2 bg-white rounded-sm p-[15px] shadow-xl absolute left-0 
                   z-50 transition-all duration-300 ease-in-out
                   ${
                     isOpen
                       ? "visible top-[30px] opacity-100"
                       : "invisible top-[40px] opacity-0"
                   }`}
      >
        <div
          onClick={() => {
            setIsEditing(!isEditing);
            setIsOpen(false);
          }}
          className="flex flex-row nowrap gap-2 cursor-pointer hover:bg-gray-100 px-[15px] py-3 rounded"
        >
          <MdEdit fill={"black"} size={18} />
          <p className="text-black text-sm !text-nowrap">Adatok szerkesztése</p>
        </div>

        {/* DINAMIKUS TÖRLÉS / VISSZAÁLLÍTÁS GOMB */}
        {currentStatus === "deleted" ? (
          <div
            onClick={() => handleUpdateStatus("pending")}
            className="flex flex-row nowrap gap-2 cursor-pointer hover:bg-gray-100 px-[15px] py-3 rounded"
          >
            <p className="text-green-600 text-sm !text-nowrap">
              Rendelés visszaállítása
            </p>
          </div>
        ) : (
          <div
            onClick={() => handleUpdateStatus("deleted")}
            className="flex flex-row nowrap gap-2 cursor-pointer hover:bg-gray-100 px-[15px] py-3 rounded"
          >
            <p className="text-red-600 text-sm !text-nowrap">
              Rendelés törlése
            </p>
          </div>
        )}

        {/* EXTRA: FIZETVE GOMB */}
        {currentStatus === "pending" && (
          <div
            onClick={() => handleUpdateStatus("succeeded")}
            className="flex flex-row nowrap gap-2 cursor-pointer hover:bg-gray-100 px-[15px] py-3 rounded"
          >
            <p className="text-emerald-600 text-sm !text-nowrap">
              Megjelölés fizetettként
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
