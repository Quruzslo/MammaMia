"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import OrderActions from "./orderToggle";
import HandleCopy from "@/utils/handleCopy";

// Ikonok
import { FaSquarePhone, FaHouseUser, FaUserPen } from "react-icons/fa6";
import { MdEdit, MdClose, MdCheck } from "react-icons/md";
import { FaRegCalendarAlt } from "react-icons/fa";

export default function CustomerSection({ order }: { order: any }) {
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [activeExtraNotes, setActiveExtraNotes] = useState(false);

  const [isAcknowledging, setIsAcknowledging] = useState(false);

  // Form state feltöltése a meglévő adatokkal
  const [formData, setFormData] = useState({
    fullName: order.customer?.fullName || "",
    email: order.customer?.email || "",
    phone: order.customer?.phone || "",
    city: order.customer?.city || "",
    street: order.customer?.street || "",
    houseNumber: order.customer?.houseNumber || "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/modify-customer", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: order._id,
          ...formData,
        }),
      });

      if (res.ok) {
        setIsEditing(false);
        router.refresh();
      } else {
        alert("Hiba történt a mentés során.");
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  //Új rendelés státus törlése
  const unsetOrderNew = async (id: string) => {
    setIsAcknowledging(true);
    try {
      const res = await fetch("/api/admin/unset-new-state", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });

      if (res.ok) {
        router.refresh();
      } else {
        alert("Hiba történt a rögzítés során.");
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsAcknowledging(false);
    }
  };

  return (
    <div className="w-full border-r-0 lg:border-r border-neutral-700 relative h-full flex flex-col">
      {/* Dropdown/Státuszváltó */}
      <OrderActions
        orderId={order._id}
        currentStatus={order.status}
        setIsEditing={setIsEditing}
        isEditing={isEditing}
      />

      {order.newOrder ? (
        <button
          onClick={() => unsetOrderNew(order._id)}
          disabled={isAcknowledging}
          className="mt-3 mb-1 w-max bg-green-700 hover:bg-green-600 disabled:bg-green-900 text-white text-sm font-bold py-1.5 px-4 rounded transition-colors flex items-center gap-2"
        >
          {isAcknowledging ? "Folyamatban..." : "✔ Rögzítve (Láttamoztam)"}
        </button>
      ) : null}

      {!isEditing ? (
        /* --- user adatai --- */
        <div className="flex-grow">
          <div className="flex items-center justify-between mb-1 mt-2 w-max">
            <h2
              title="Megrendelő neve"
              className="font-bold text-xl text-white truncate "
            >
              {order.customer?.fullName}
            </h2>
          </div>
          <p
            title="Megrendelő e-mail címe"
            className="text-sm text-teal-500 mb-3"
          >
            {order.customer?.email}
          </p>

          <div className="flex flex-col gap-3">
            <div
              className="flex flex-row nowrap gap-2 items-center"
              title="Telefonszám"
            >
              <FaSquarePhone className="text-green-200 size-[20px]" />
              <p className="text-sm text-gray-100">{order.customer?.phone}</p>
            </div>

            <div
              className="flex flex-row nowrap gap-2 items-center"
              title="Szállítási cím"
            >
              <FaHouseUser className="text-green-200 size-[20px]" />
              <p className="text-sm text-gray-100">
                {order.customer?.city}, {order.customer?.street}{" "}
                {order.customer?.houseNumber}
              </p>
            </div>

            <div
              className="flex flex-row nowrap gap-2 items-center"
              title="Leadási dátum"
            >
              <FaRegCalendarAlt className="text-green-200 size-[20px]" />
              <p className="pt-2 italic text-sm text-gray-100">
                {new Date(order.date).toLocaleDateString("hu-HU")}
              </p>
            </div>

            <div className="flex flex-col nowrap gap-2 items-start">
              <p>Rendelésszám:</p>
              <HandleCopy textToCopy={order.orderId} />
            </div>

            {order.customer?.extraNote ? (
              <div className="flex flex-col gap-[10px] w-full mt-3">
                <div
                  className="flex flex-row gap-2 items-center"
                  title="Megjegyzés a rendeléshez"
                >
                  <FaUserPen className="text-green-200 size-[20px]" />
                  <button
                    type="button"
                    onClick={() => setActiveExtraNotes((prev) => !prev)}
                    className="text-left text-[15px] text-white hover:underline cursor-pointer mr-auto"
                  >
                    {activeExtraNotes ? "Bezárás" : "Megjegyzés"}
                  </button>
                </div>

                <div
                  className={`w-full bg-white border border-neutral-800 rounded  transition-all duration-300 grid ${
                    activeExtraNotes
                      ? "grid-rows-[1fr] p-2"
                      : "grid-rows-[0fr] p-0"
                  }`}
                >
                  <div className="overflow-hidden">
                    <p className="text-black text-[15px]">
                      {order.customer.extraNote}
                    </p>
                  </div>
                </div>
              </div>
            ) : null}
          </div>
        </div>
      ) : (
        /* --- SZERKESZTŐ MÓD (Input fields) --- */
        <div className="space-y-3 mt-2 flex-grow">
          <div className="flex items-center justify-between border-b border-neutral-700 pb-1">
            <span className="text-xs font-semibold uppercase tracking-wider text-teal-500">
              Adatok szerkesztése
            </span>
            <div className="flex gap-1">
              <button
                onClick={handleSave}
                disabled={loading}
                className="p-1 bg-green-700 hover:bg-green-600 rounded text-white transition-colors cursor-pointer"
              >
                <MdCheck size={16} />
              </button>
              <button
                onClick={() => setIsEditing(false)}
                className="p-1 bg-neutral-700 hover:bg-neutral-600 rounded text-white transition-colors cursor-pointer"
              >
                <MdClose size={16} />
              </button>
            </div>
          </div>

          <div>
            <label className="text-[10px] uppercase text-neutral-400 block mb-0.5">
              Név
            </label>
            <input
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              className="w-full bg-neutral-900 border border-neutral-700 rounded px-2 py-1 text-sm text-white focus:outline-none focus:border-teal-500"
            />
          </div>

          <div>
            <label className="text-[10px] uppercase text-neutral-400 block mb-0.5">
              Email
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full bg-neutral-900 border border-neutral-700 rounded px-2 py-1 text-sm text-white focus:outline-none focus:border-teal-500"
            />
          </div>

          <div>
            <label className="text-[10px] uppercase text-neutral-400 block mb-0.5">
              Telefon
            </label>
            <input
              type="text"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className="w-full bg-neutral-900 border border-neutral-700 rounded px-2 py-1 text-sm text-white focus:outline-none focus:border-teal-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-[10px] uppercase text-neutral-400 block mb-0.5">
                Város
              </label>
              <input
                type="text"
                name="city"
                value={formData.city}
                onChange={handleChange}
                className="w-full bg-neutral-900 border border-neutral-700 rounded px-2 py-1 text-sm text-white focus:outline-none focus:border-teal-500"
              />
            </div>
            <div>
              <label className="text-[10px] uppercase text-neutral-400 block mb-0.5">
                Utca
              </label>
              <input
                type="text"
                name="street"
                value={formData.street}
                onChange={handleChange}
                className="w-full bg-neutral-900 border border-neutral-700 rounded px-2 py-1 text-sm text-white focus:outline-none focus:border-teal-500"
              />
            </div>
          </div>

          <div>
            <label className="text-[10px] uppercase text-neutral-400 block mb-0.5">
              Házszám / Egyéb
            </label>
            <input
              type="text"
              name="houseNumber"
              value={formData.houseNumber}
              onChange={handleChange}
              className="w-full bg-neutral-900 border border-neutral-700 rounded px-2 py-1 text-sm text-white focus:outline-none focus:border-teal-500"
            />
          </div>

          {loading && (
            <p className="text-xs text-neutral-400 italic">
              Mentés folyamatban...
            </p>
          )}
        </div>
      )}

      {/* Ár és státusz szekció az alján */}
      <div className="mt-4 pt-4 border-t border-neutral-700">
        <p className="text-lg font-bold text-white">
          {order.total?.toLocaleString()} Ft
        </p>
        <p className="text-xs text-neutral-100">
          Státusz:{" "}
          {order.status === "succeeded" ? (
            <span className="text-green-300 text-[12px]">Fizetve</span>
          ) : order.status === "deleted" ? (
            <span className="text-red-300 text-[12px]">Törölve</span>
          ) : (
            <span className="text-orange-300 text-[12px]">Nincs fizetve</span>
          )}
        </p>
      </div>
    </div>
  );
}
