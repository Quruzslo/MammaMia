"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import SingleModal from "./orderSinglePopup";

// Ikonok--------------
import { FaSquarePhone } from "react-icons/fa6";
import { FaHouseUser } from "react-icons/fa";
import { FaRegCalendarAlt } from "react-icons/fa";

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDay, setSelectedDay] = useState(null);

  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/admin");
      return;
    }

    if (status === "authenticated" && session?.user?.role !== "admin") {
      router.push("/");
      return;
    }

    const fetchOrders = async () => {
      try {
        const response = await fetch("/api/admin/orders");

        if (response.status === 401 || response.status === 403) {
          router.push("/admin");
          return;
        }

        const data = await response.json();

        const sortedData = data.sort((a, b) => {
          if (a.status === "succeeded" && b.status !== "succeeded") return -1;
          if (a.status !== "succeeded" && b.status === "succeeded") return 1;
          return new Date(b.date).getTime() - new Date(a.date).getTime();
        });

        setOrders(sortedData);
      } catch (error) {
        console.error("Hiba az adatok lekérésekor:", error.message);
      } finally {
        setLoading(false);
      }
    };

    if (status === "authenticated") {
      fetchOrders();
    }
  }, [status, session, router]);

  // Közös betöltő képernyő (amíg az auth vagy az API dolgozik)
  if (status === "loading" || loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-neutral-900">
        <p className="text-teal-500 animate-pulse text-xl">
          Rendelések betöltése...
        </p>
      </div>
    );
  }

  return (
    <section className="py-6 px-4 max-w-[1800px] mx-auto min-h-screen bg-neutral-900 text-gray-100">
      <h1 className="text-3xl font-bold mb-8 border-b border-neutral-800 pb-4">
        Rendelések kezelése
      </h1>

      <div className="grid gap-6">
        {orders.map((order) => (
          <div
            key={order.orderId || order._id}
            className={`p-5 border-l-4 rounded-xl bg-neutral-800 shadow-xl ${
              order.status === "succeeded"
                ? "border-green-500"
                : "border-red-500"
            }`}
          >
            <div className="flex flex-col lg:flex-row gap-6">
              {/* Vevő adatai szekció */}
              <div className="lg:w-1/4 border-r-0 lg:border-r border-neutral-700 pr-4">
                <h2 className="font-bold text-xl text-white mb-1">
                  {order.customer?.fullName}
                </h2>
                <p className="text-sm text-teal-500 mb-3">
                  {order.customer?.email}
                </p>

                <div className="flex flex-col gap-3">
                  <div className="flex flex-row nowrap gap-2 items-center">
                    <FaSquarePhone
                      style={{ width: "20px", height: "20px" }}
                      className="text-green-200"
                    />
                    <p className="text-sm text-gray-100">
                      {order.customer?.phone}
                    </p>
                  </div>

                  <div className="flex flex-row nowrap gap-2 items-center">
                    <FaHouseUser
                      style={{ width: "20px", height: "20px" }}
                      className="text-green-200"
                    />
                    <p className="text-sm text-gray-100">
                      {order.customer?.city}, {order.customer?.street}{" "}
                      {order.customer?.houseNumber}
                    </p>
                  </div>

                  <div className="flex flex-row nowrap gap-2 items-center">
                    <FaRegCalendarAlt
                      style={{ width: "20px", height: "20px" }}
                      className="text-green-200"
                    />
                    <p className="pt-2 italic text-sm text-gray-100">
                      {new Date(order.date).toLocaleDateString("hu-HU")}
                    </p>
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-neutral-700">
                  <p className="text-lg font-bold text-white">
                    {order.total?.toLocaleString()} Ft
                  </p>
                  <p className="text-xs text-gray-500">
                    Státusz:{" "}
                    {order.status === "succeeded" ? "Fizetve" : "Nincs fizetve"}
                  </p>
                </div>
              </div>

              {/* Napok grid szekció */}
              <div className="lg:w-3/4 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-3">
                {order.items?.map((day, idx) => (
                  <div
                    key={idx}
                    className="flex flex-col rounded-lg border border-neutral-700 bg-neutral-900/50 overflow-hidden"
                  >
                    <div className="p-3 flex-grow text-center">
                      <h3 className="text-sm font-bold text-gray-200">
                        {day.dayName}
                      </h3>
                      <p className="text-xs text-gray-500 mb-2">{day.date}</p>
                      <span className="bg-neutral-800 text-teal-400 text-[10px] px-2 py-1 rounded-full uppercase tracking-tighter border border-teal-900/50">
                        {day.items?.reduce(
                          (total, item) => total + item.quantity,
                          0,
                        )}{" "}
                        étel
                      </span>
                    </div>

                    <button
                      onClick={() => setSelectedDay(day)}
                      className="w-full py-2 bg-teal-600/10 hover:bg-teal-600 text-teal-400 hover:text-white text-xs font-bold transition-all border-t border-teal-500/20 cursor-pointer"
                    >
                      Megnyitás
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      <SingleModal day={selectedDay} onClose={() => setSelectedDay(null)} />
    </section>
  );
}
