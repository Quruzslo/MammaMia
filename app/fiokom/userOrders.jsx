"use client";

import { useState, useEffect } from "react";
import { FiChevronDown, FiChevronUp } from "react-icons/fi";
import OrderCard from "./orderCard";

export default function UserOrders() {
  const [orders, setOrders] = useState([]);
  const [isOpen, setIsOpen] = useState(false);

  // useEffect(() => {
  //   const fetchUserOrders = async () => {
  //     try {
  //       const fetching = await fetch(`http://localhost:3000/fiokom/${userId}`, {
  //         method: "GET",
  //         headers: {
  //           "Content-Type": "application/json",
  //           Authorization: `Bearer ${localStorage.getItem("token")}`,
  //         },
  //       });

  //       const data = await fetching.json();
  //       setOrders(data);
  //     } catch (error) {
  //       console.error("Hiba a fetchelés során:", error);
  //       alert("Nem sikerült lekérni a rendeléseket.");
  //     }
  //   };

  //   if (userId) {
  //     fetchUserOrders();
  //   }
  // }, [userId]);

  return (
    <section className="max-w-[1800px] mx-auto py-8 px-4 animate-fade-in">
      <h2 className="text-3xl font-bold mb-10 text-center text-teal-400 border-b-4 border-teal-900/50 pb-4 uppercase tracking-widest">
        Rendeléseim
      </h2>

      {orders.length === 0 ? (
        <div className="bg-neutral-800 rounded-xl p-8 text-center border-l-4 border-teal-600/30 max-w-md mx-auto shadow-2xl">
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
              cardOpen={isOpen}
              setCardOpen={setIsOpen}
            />
          ))}
        </div>
      )}
    </section>
  );
}
