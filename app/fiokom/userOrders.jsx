"use client";

import { useState, useEffect } from "react";
import { FiChevronDown, FiChevronUp } from "react-icons/fi";
import OrderCard from "./orderCard";
import { useSession, signOut } from "next-auth/react";

export default function UserOrders() {
  const [orders, setOrders] = useState([]);

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
      } catch (error) {
        console.error("Hiba a fetchelés során:", error);
      }
    };

    if (session?.user?.userId) {
      fetchUserOrders();
    }
  }, [session?.user?.userId]);

  // 2. FELTÉTELEK: Csak a Hookok után jöhetnek a korai return-ök!
  if (status === "loading") {
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

  // 3. FŐ RENDERELÉS: Ha be van töltve és hitelesítve van a user
  return (
    <section className="max-w-[1800px] w-[100%] mx-auto py-8 px-[5px] animate-fade-in">
      <h2 className="text-3xl font-bold mb-10 text-center text-teal-400 border-b-4 border-teal-900/50 pb-4 uppercase tracking-widest">
        Rendeléseim
      </h2>

      {orders.length === 0 ? (
        <div className="bg-neutral-800 rounded-xl p-[5px] text-center border-l-4 border-teal-600/30 max-w-md mx-auto shadow-2xl">
          <p className="text-gray-400 font-medium">
            Még nincsenek rendelési előzményeid.
          </p>
        </div>
      ) : (
        <div className="space-y-6">
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
