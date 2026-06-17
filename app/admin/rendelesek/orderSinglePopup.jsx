import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function SingleModal({ day, onClose, orderId }) {
  // Ha nincs kiválasztott nap a propból, akkor bezárul
  if (!day) return null;

  const router = useRouter();

  const settingOrder = async (orderId, orderDate, nextStatus) => {
    try {
      const res = await fetch("/api/admin/modify-order", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: orderId,
          dayDate: orderDate,
          status: nextStatus,
        }),
      });

      if (res.ok) {
        router.refresh();
      } else {
        console.error("Hiba történt a státusz frissítésekor");
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div
      className="fixed inset-0 flex items-center justify-center bg-white/50 z-[100] p-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-lg max-h-[90vh] overflow-hidden flex flex-col bg-black  border border-neutral-200 "
        style={{
          borderRadius: "4px",
          boxShadow: "0 4px 24px rgba(0,0,0,0.12)",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Fejléc */}
        <div className="flex items-stretch border-b border-neutral-200 ">
          {/* Bal oldali csík */}
          <div
            className={`w-[5px] flex-shrink-0 ${day.status === "ordered" ? "bg-orange-400" : "bg-green-400"}`}
          />

          <div className="flex-1 px-5 py-4 flex justify-between items-center">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-widest text-neutral-400 mb-0.5">
                Rendelés részletei
              </p>
              <h2 className="text-base font-medium text-neutral-900 dark:text-neutral-100 mb-0.5">
                {day.dayName}
              </h2>
              <p className="text-xs text-neutral-500">{day.date}</p>
            </div>

            <div className="flex items-center gap-2">
              {day.status === "ordered" ? (
                <button
                  onClick={() => settingOrder(orderId, day.date, "shipped")}
                  className="text-xs font-medium hover:bg-green-600 bg-transparent text-white px-3.5 py-1.5 cursor-pointer transition-colors border border-green-600"
                  style={{ borderRadius: "2px" }}
                >
                  Kiszállítás alá
                </button>
              ) : (
                <button
                  onClick={() => settingOrder(orderId, day.date, "ordered")}
                  className="text-xs font-medium transparent  hover:bg-neutral-50  text-neutral-100 hover:text-neutral-800  border border-neutral-300  px-3.5 py-1.5 cursor-pointer transition-colors "
                  style={{ borderRadius: "2px" }}
                >
                  Visszaállítás
                </button>
              )}

              <button
                onClick={onClose}
                className="text-sm font-medium text-neutral-200  border border-neutral-300  hover:bg-neutral-50 hover:text-black px-3.5 py-1.5 transition-colors cursor-pointer"
                style={{ borderRadius: "2px" }}
              >
                X
              </button>
            </div>
          </div>
        </div>

        {/* Tartalom */}
        <div className="flex-1 overflow-y-auto px-5 py-4 space-y-2 bg-neutral-50 dark:bg-neutral-900/30">
          {day.items.map((item, index) => (
            <div
              key={index}
              className="border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950"
              style={{ borderRadius: "2px" }}
            >
              <div className="px-3.5 py-3">
                <div className="flex justify-between items-center mb-1.5">
                  <span className="text-[10px] font-semibold uppercase tracking-widest text-neutral-400">
                    {item.category}
                  </span>
                  <span className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">
                    {(item.price * item.quantity).toLocaleString("hu-HU")} Ft
                  </span>
                </div>
                <p className="text-sm font-medium text-neutral-800 dark:text-neutral-200 mb-1">
                  {item.name}
                </p>
                <div className="flex justify-between">
                  <span className="text-xs text-neutral-100">
                    {item.price.toLocaleString("hu-HU")} Ft / adag
                  </span>
                  <span className="text-xs text-neutral-100">
                    {item.quantity} db
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Lábléc */}
        <div className="border-t border-neutral-200 d px-5 py-3.5 flex justify-between items-center">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-widest text-neutral-100 mb-0.5">
              Összesen
            </p>
            <p className="text-lg font-semibold text-neutral-900 dark:text-neutral-100">
              {day.items
                .reduce((sum, item) => sum + item.price * item.quantity, 0)
                .toLocaleString("hu-HU")}{" "}
              Ft
            </p>
          </div>
          <button
            onClick={() => {
              settingOrder(orderId, day.date, "deleted");
              onClose();
            }}
            className="text-xs font-medium bg-red-200  hover:bg-neutral-50  text-neutral-600  border border-neutral-300  px-3.5 py-1.5 cursor-pointer transition-colors"
            style={{ borderRadius: "2px" }}
          >
            Törlés
          </button>
        </div>
      </div>
    </div>
  );
}
