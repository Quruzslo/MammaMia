"use client";

import { useRouter } from "next/navigation";

interface OrderActionsProps {
  orderId: string;
  currentStatus: string;
}

export default function OrderActions({
  orderId,
  currentStatus,
}: OrderActionsProps) {
  const router = useRouter();

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

      router.refresh();
    } catch (error: any) {
      console.error("Hálózati vagy szerver hiba:", error);
      alert(error.message || "Nem sikerült a művelet!");
    }
  };

  return (
    <div className="editing-wrapper relative flex flex-col mb-[20px] group w-fit">
      {/* A 3 pötty */}
      <div className="editing-btn flex flex-row nowrap gap-[5px] cursor-pointer py-2">
        <div className="w-[7px] h-[7px] rounded-full bg-white" />
        <div className="w-[7px] h-[7px] rounded-full bg-white" />
        <div className="w-[7px] h-[7px] rounded-full bg-white" />
      </div>

      {/* A Dropdown Menü */}
      <div
        className="flex flex-col gap-2 bg-white rounded-sm p-[15px] shadow-xl absolute left-0 
                   top-[40px] invisible opacity-0 z-50 transition-all duration-300 ease-in-out
                   group-hover:visible group-hover:top-[30px] group-hover:opacity-100 group-active:visible group-active:top-[30px] group-active:opacity-100"
      >
        <div className="flex flex-row nowrap gap-2 cursor-pointer hover:bg-gray-100 px-[15px] py-3 rounded">
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

        {/* EXTRA: FIZETVE GOMB  */}
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
