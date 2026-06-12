"use client";

import { useState, useEffect } from "react";
import { FiChevronDown, FiChevronUp } from "react-icons/fi";
import OrderCard from "./orderCard";
import { useSession, signOut } from "next-auth/react";

export default function UserOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeOrderId, setActiveOrderId] = useState(null);
  const { status, data: session } = useSession();

  useEffect(() => {
    const fetchUserOrders = async () => {
      try {
        const userId = session?.user?.userId;
        if (!userId) throw new Error("Nem található userId a session-ben");

        const res = await fetch("/api/user-orders", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId }),
        });

        if (!res.ok) throw new Error("Szerver hiba a lekérés során");

        const data = await res.json();
        setOrders(data);
        setLoading(false);
      } catch (error) {
        console.error("Hiba a fetchelés során:", error);
      }
    };

    if (session?.user?.userId) {
      fetchUserOrders();
    }
  }, [session?.user?.userId]);

  if (loading) {
    return (
      <div className="max-w-md mx-auto py-16 text-center">
        <p className="text-gray-400 font-medium">Betöltés...</p>
      </div>
    );
  }

  if (status === "unauthenticated") {
    return (
      <div className="max-w-md mx-auto py-16 text-center">
        <p className="text-red-400 font-medium">Nem vagy bejelentkezve.</p>
      </div>
    );
  }

  //  Ha be van töltve és hitelesítve van a user
  return (
    <section className="max-w-[1800px] w-[100%] mx-auto p-[10px] ">
      {/*  Dashboard címsor */}
      <div className="border-b border-stone-200 pb-5 mb-10">
        <h2 className="text-[20px] md:text-3xl font-black text-black">
          Rendelési előzmények
        </h2>
      </div>

      {orders.length === 0 || status === !"loading" ? (
        <div className="bg-white border border-stone-200 rounded-sm p-[10px] text-center  mx-auto ">
          <p className="text-stone-400 font-bold uppercase text-xs tracking-wider mb-2">
            Nincsenek adatok
          </p>
          <p className="text-stone-500 text-sm italic">
            Még nincsenek rendelési előzményeid ebben a fiókban.
          </p>
        </div>
      ) : (
        /* Rendelések listája */
        <div className="grid grid-cols-1 gap-3 items-start">
          {orders.map((order) => (
            <OrderCard
              key={order._id}
              order={order}
              cardOpen={activeOrderId === order._id}
              setCardOpen={() =>
                setActiveOrderId(activeOrderId === order._id ? null : order._id)
              }
            />
          ))}
        </div>
      )}
    </section>
  );
}
