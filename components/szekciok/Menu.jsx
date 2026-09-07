"use client";
import { LiaCartPlusSolid } from "react-icons/lia";
import { PiBowlFood } from "react-icons/pi";
import { useEffect, useState, useContext, useRef } from "react";
import { cartContext } from "@/components/contexts/cartProvider";
import { toast } from "react-toastify";
import WeeklyMenuDisplay from "./WeeklyMenuDisplay";

export default function Menu() {
  const [menu, setMenu] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("current");
  const { addToCart } = useContext(cartContext);

  const timeoutRef = useRef(null);
  const intervalRef = useRef(null);

  useEffect(() => {
    const clearAllTimers = () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      if (intervalRef.current) clearInterval(intervalRef.current);
    };

    const fetchMenu = async () => {
      try {
        const response = await fetch("/api/foods", { cache: "no-store" });
        if (!response.ok) throw new Error(`Hiba: ${response.status}`);
        const data = await response.json();
        setMenu(data);
      } catch (error) {
        console.error("Hiba a fetchelés során:", error);
      } finally {
        setLoading(false);
      }
    };

    const startTimers = () => {
      clearAllTimers();

      const most = new Date();
      const msAKovetkezoOraig =
        ((60 - most.getMinutes()) * 60 - most.getSeconds()) * 1000;

      timeoutRef.current = setTimeout(() => {
        fetchMenu();
        intervalRef.current = setInterval(fetchMenu, 3600 * 1000);
      }, msAKovetkezoOraig);
    };

    fetchMenu();
    startTimers();

    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        fetchMenu();
        startTimers();
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      clearAllTimers();
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);

  if (loading)
    return (
      <div className="flex justify-center items-center py-20">
        <p className="text-teal-400 animate-pulse text-lg">
          Az étlap töltődik...
        </p>
      </div>
    );

  const sortedMenuByDate = [...menu].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
  );

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

  // RENDELHETŐ-E MÉG AZ ÉTEL
  const isOrderable = (napDatum) => {
    const most = new Date();
    const nap = new Date(napDatum);
    nap.setHours(0, 0, 0, 0);

    const maiNap = new Date(most);
    maiNap.setHours(0, 0, 0, 0);

    if (nap.getTime() < maiNap.getTime()) return false;
    if (nap.getTime() === maiNap.getTime() && most.getHours() >= 12)
      return false;

    return true;
  };

  // LISTA SZÉTVÁLASZTÁSA KÉT HÉTRE + ORDERABLE HOZZÁADÁSA
  const eHetiNapok = sortedMenuByDate
    .filter((nap) => {
      const napIdo = new Date(nap.date).getTime();
      return (
        napIdo >= jelenHetHetfo.getTime() && napIdo < jovoHetHetfo.getTime()
      );
    })
    .map((nap) => ({ ...nap, orderable: isOrderable(nap.date) }));

  const jovoHetiNapok = sortedMenuByDate
    .filter((nap) => {
      const napIdo = new Date(nap.date).getTime();
      return (
        napIdo >= jovoHetHetfo.getTime() && napIdo < jovoHetVasarnap.getTime()
      );
    })
    .map((nap) => ({ ...nap, orderable: isOrderable(nap.date) }));

  // KOSÁRBA RAKÁS ÉS ÉRTESÍTÉS
  const handleAddToCartWithNotification = (item, date, dayName) => {
    // Elsődleges borítókép kiválasztása a toast-hoz (ha több kép van, az első érvényeset használjuk)
    const primaryImage =
      Array.isArray(item.images) && item.images.length > 0
        ? item.images[0]
        : item.imageUrl || null;

    addToCart(item, date, dayName);

    toast(
      <div className="flex items-center gap-3">
        {primaryImage ? (
          <img
            src={primaryImage}
            alt={item.name}
            className="w-10 h-10 object-cover rounded-lg border border-neutral-700"
          />
        ) : (
          <PiBowlFood size={24} className="fill-teal-100" />
        )}
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
    <section className="w-full mx-auto py-[10px]">
      <h2 className="text-3xl relative font-bold mb-6 text-center text-white uppercase underlined w-fit mx-auto">
        Heti Menü
      </h2>

      {/* TABS VEZÉRLŐ GOMBOK */}
      <div className="flex justify-center gap-4 mb-10">
        <button
          onClick={() => setActiveTab("current")}
          className={`rendeles-btn relative flex !text-white w-fit cursor-pointer my-[10px] ${
            activeTab === "current" ? "bg-sarga" : null
          }`}
        >
          E heti ajánlat
        </button>
        <button
          onClick={() => setActiveTab("next")}
          className={`rendeles-btn relative flex !text-white w-fit cursor-pointer my-[10px] ${
            activeTab === "next" ? "bg-sarga" : null
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
