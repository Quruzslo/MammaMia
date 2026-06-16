"use client";

import { useEffect, useState } from "react";

export default function FoodCounter() {
  const [stats, setStats] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch("/api/admin/food-to-cook");
        const result = await res.json();

        if (result.success) {
          setStats(result.data);
        } else {
          console.error("API hiba:", result.error);
        }
      } catch (error) {
        console.error("Hálózati vagy szerverhiba:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading)
    return (
      <p className="p-4 text-center animate-bounce">Adatok betöltése a ...</p>
    );

  return (
    <div className="p-[5px] w-[100%] mt-[25px]">
      <h1 className="text-2xl font-bold mb-4">Megrendelt ételek összesítő</h1>

      {stats.length === 0 ? (
        <p>Nincs aktív rendelés a mai/jövőbeli napokra.</p>
      ) : (
        <div className="overflow-x-auto w-[100%]">
          <table className="min-w-full border-collapse border border-gray-200">
            <thead>
              <tr className="bg-black">
                <th className="border p-2 text-left">Dátum</th>
                <th className="border p-2 text-left">Étel neve</th>
                <th className="border p-2 text-left">Kategória</th>
                <th className="border p-2 text-center">Mennyiség (adag)</th>
                <th className="border p-2 text-center">Rendelések</th>
              </tr>
            </thead>
            <tbody>
              {stats.map((item, index) => (
                <tr
                  key={index}
                  className="hover:bg-gray-50 group hover:text-black  odd:bg-neutral-500 even:bg-neutral-700"
                >
                  <td className="border p-2">
                    {item.date} ({item.dayName})
                  </td>
                  <td className="border p-2 font-semibold">{item.dishName}</td>
                  <td className="border p-2 text-sm ">{item.category}</td>
                  <td className="border p-2 text-center text-lg font-black">
                    {item.totalQuantity} db
                  </td>
                  <td className="border p-2 text-center text-sm ">
                    {item.orderCount} db rendelésből
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
