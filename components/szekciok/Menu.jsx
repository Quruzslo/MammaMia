"use client";
import { LiaCartPlusSolid } from "react-icons/lia";
import { PiBowlFood } from "react-icons/pi";
import { useEffect, useState, useContext } from "react";
import { cartContext } from "@/components/contexts/cartProvider";
import { toast } from "react-toastify";
import WeeklyMenuDisplay from "./WeeklyMenuDisplay";

export default function Menu() {
  const [menu, setMenu] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("current");
  const { addToCart } = useContext(cartContext);

  useEffect(() => {
    const fetchMenu = async () => {
      try {
        const response = await fetch("/api/foods", { cache: "default" });
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

  // SORBA RENDEZÉS DÁTUM SZERINT
  const sortedMenuByDate = [...menu].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
  );

  //  DÁtum a heteknek
  const ma = new Date();

  // Aktuális hét hétfő
  const jelenHetHetfo = new Date(ma);
  const napAHetben = ma.getDay();
  const korrekcio = napAHetben === 0 ? -6 : 1 - napAHetben;
  jelenHetHetfo.setDate(ma.getDate() + korrekcio);
  jelenHetHetfo.setHours(0, 0, 0, 0);

  // Jövő hét hétfő
  const jovoHetHetfo = new Date(jelenHetHetfo);
  jovoHetHetfo.setDate(jelenHetHetfo.getDate() + 7);

  // Jövő hét vasárnap
  const jovoHetVasarnap = new Date(jovoHetHetfo);
  jovoHetVasarnap.setDate(jovoHetHetfo.getDate() + 7);

  // Lista szétválasztása két hétre
  const eHetiNapok = sortedMenuByDate.filter((nap) => {
    const napIdo = new Date(nap.date).getTime();
    return napIdo >= jelenHetHetfo.getTime() && napIdo < jovoHetHetfo.getTime();
  });

  const jovoHetiNapok = sortedMenuByDate.filter((nap) => {
    const napIdo = new Date(nap.date).getTime();
    return (
      napIdo >= jovoHetHetfo.getTime() && napIdo < jovoHetVasarnap.getTime()
    );
  });

  // KOSÁRBA RAKÁS ÉS ÉRTESÍTÉS
  const handleAddToCartWithNotification = (item, date, dayName) => {
    addToCart(item, date, dayName);
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
      <h2 className="text-3xl font-bold mb-6 text-center text-teal-400 border-b-4 border-teal-900/50 pb-4 uppercase tracking-widest">
        Heti Menü
      </h2>

      {/* TABS VEZÉRLŐ GOMBOK */}
      <div className="flex justify-center gap-4 mb-10">
        <button
          onClick={() => setActiveTab("current")}
          className={`px-6 py-2 rounded-xl font-bold uppercase text-xs tracking-wider transition-all cursor-pointer border ${
            activeTab === "current"
              ? "bg-teal-600 text-white border-teal-500 shadow-lg shadow-teal-600/20"
              : "bg-neutral-900 text-gray-400 border-neutral-800 hover:text-teal-400"
          }`}
        >
          E heti ajánlat
        </button>
        <button
          onClick={() => setActiveTab("next")}
          className={`px-6 py-2 rounded-xl font-bold uppercase text-xs tracking-wider transition-all cursor-pointer border ${
            activeTab === "next"
              ? "bg-teal-600 text-white border-teal-500 shadow-lg shadow-teal-600/20"
              : "bg-neutral-900 text-gray-400 border-neutral-800 hover:text-teal-400"
          }`}
        >
          Jövő heti ajánlat
        </button>
      </div>

      {/* RENDERELÉS A KIVÁLASZTOTT FÜL ALAPJÁN */}
      <div id="menu">
        {activeTab === "current" ? (
          <WeeklyMenuDisplay
            days={eHetiNapok}
            onAddToCart={handleAddToCartWithNotification}
          />
        ) : (
          <WeeklyMenuDisplay
            days={jovoHetiNapok}
            onAddToCart={handleAddToCartWithNotification}
          />
        )}
      </div>
    </section>
  );
}
