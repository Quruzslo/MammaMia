"use client";
// Ikonok ---------------
import { LiaCartPlusSolid } from "react-icons/lia";
import { PiBowlFood } from "react-icons/pi";
// React importok--------------
import { useEffect, useState, useContext } from "react";
import { cartContext } from "@/components/contexts/cartProvider";

// 1. IMPORTÁLD A TOAST-OT -----------------------------
import { toast } from "react-toastify";

export default function Menu() {
  const [menu, setMenu] = useState([]);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useContext(cartContext);

  useEffect(() => {
    const fetchMenu = async () => {
      try {
        const response = await fetch("/api/foods");
        if (!response.ok) throw new Error(`Hiba: ${response.status}`);
        const data = await response.json();
        setMenu(data);
      } catch (error) {
        console.error("Hiba a fetchelés során:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchMenu();
  }, []);

  if (loading)
    return (
      <div className="flex justify-center items-center py-20">
        <p className="text-teal-400 animate-pulse text-lg">
          Séfünk éppen készíti az étlapot...
        </p>
      </div>
    );

  const sortedMenuByDate = menu.sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
  );

  //  KOSÁRBA RAKÁS ÉS ÉRTESÍTÉS -----
  const handleAddToCartWithNotification = (item, date, dayName) => {
    // Elmentjük a kosárba
    addToCart(item, date, dayName);

    // Feldobjuk az értesítést
    toast(
      <div className="flex items-center gap-3">
        <PiBowlFood size={24} className="fill-teal-100" />
        <div>
          <h5 className="font-bold text-teal-400 text-sm">{item.name}</h5>
          <p className="text-xs text-gray-400">Hozzáadva a kosárhoz!</p>
        </div>
      </div>,
      {
        className:
          "bg-neutral-900 border border-teal-500/30 rounded-xl p-4 shadow-2xl",
        bodyClassName: "p-0 m-0",
        progressClassName: "!bg-teal-500",
      },
    );
  };

  return (
    <section className="w-full mx-auto py-[10px] ">
      <h2 className="text-3xl font-bold mb-10 text-center text-teal-400 border-b-4 border-teal-900/50 pb-4 uppercase tracking-widest">
        Heti Menü
      </h2>

      <div id="menu" className="space-y-8">
        {sortedMenuByDate.map((nap) => (
          <div
            key={nap.date}
            className={`flex flex-col lg:flex-row bg-neutral-800 rounded-xl overflow-hidden shadow-2xl border-l-4 ${
              nap.isClosed ? "border-red-500 opacity-75" : "border-teal-500"
            }`}
          >
            {/* Dátum és Nap szekció - Bal oldal */}
            <div className="lg:w-1/5 bg-neutral-900/50 p-[10px] flex flex-col justify-center items-center text-center border-b lg:border-b-0 lg:border-r border-neutral-700">
              <h3 className="text-2xl font-black text-teal-400 uppercase tracking-tighter">
                {nap.dayName}
              </h3>
              <span className="text-sm text-gray-400 mt-1">{nap.date}</span>
              {nap.isClosed && (
                <span className="mt-4 px-3 py-1 bg-red-500/10 text-red-500 border border-red-500/20 rounded-full text-xs font-bold uppercase">
                  Zárva
                </span>
              )}
            </div>

            {/* Ételek Grid - Jobb oldal */}
            <div className="lg:w-4/5 p-[10px]">
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-5 md:gap-4">
                {nap.items.map((item, ind) => (
                  <div
                    key={ind}
                    className="flex flex-col bg-neutral-900 rounded-lg border border-neutral-700 overflow-hidden hover:border-teal-500/50 transition-all group"
                  >
                    <div className="p-4 flex-grow">
                      <span className="text-[10px] font-bold uppercase text-teal-500 tracking-widest block mb-1">
                        {item.category}
                      </span>
                      <h4 className="text-gray-100 font-semibold leading-snug min-h-[40px] mb-2">
                        {item.name}
                      </h4>
                      <p className="text-teal-400 font-bold">
                        {item.price.toLocaleString()} Ft
                      </p>
                    </div>

                    {/* Kosárba gomb */}
                    <button
                      disabled={nap.isClosed}
                      onClick={() =>
                        handleAddToCartWithNotification(
                          item,
                          nap.date,
                          nap.dayName,
                        )
                      }
                      className={`w-full py-3 flex justify-center items-center transition-all cursor-pointer ${
                        nap.isClosed
                          ? "bg-neutral-800 text-gray-600 cursor-not-allowed"
                          : "bg-teal-600/10 text-teal-400 hover:bg-teal-600 hover:text-white active:bg-teal-700 active:text-white"
                      }`}
                    >
                      <LiaCartPlusSolid size={20} className=" fill-teal-100" />
                      <p className="ml-2 text-xs font-bold uppercase text-teal-100">
                        Kosárba
                      </p>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
