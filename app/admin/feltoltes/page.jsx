"use client";
import { useState, useEffect, useMemo } from "react";
import { toast } from "react-toastify";
import AdminNav from "../admin-components/adminNav";
import PusherComponent from "../rendelesek/pusher";
import FoodSelect from "./FoodSelect";

const getHungarianDayName = (dateString) => {
  if (!dateString) return "";
  const days = [
    "Vasárnap",
    "Hétfő",
    "Kedd",
    "Szerda",
    "Csütörtök",
    "Péntek",
    "Szombat",
  ];
  const date = new Date(dateString);
  return days[date.getDay()];
};

export default function AdminMenuUpload() {
  const [date, setDate] = useState("");
  const [isClosed, setIsClosed] = useState(false);
  const [loading, setLoading] = useState(false);

  // Adatbázisból lekért ételek
  const [dbFoods, setDbFoods] = useState([]);
  const [fetchingFoods, setFetchingFoods] = useState(true);
  const [soupId, setSoupId] = useState("");
  const [fixId, setFixId] = useState("");

  const [mainMenus, setMainMenus] = useState([
    { type: "main", category: "A menü", mainId: "", sideId: "", saladId: "" },
    { type: "main", category: "B menü", mainId: "", sideId: "", saladId: "" },
    { type: "main", category: "C menü", mainId: "", sideId: "", saladId: "" },
    { type: "main", category: "D menü", mainId: "", sideId: "", saladId: "" },
  ]);

  useEffect(() => {
    const fetchFoods = async () => {
      try {
        const res = await fetch("/api/admin/foods/get-foods");
        if (res.ok) {
          const data = await res.json();
          setDbFoods(data);
        }
      } catch (err) {
        console.error("Hiba az ételek lekérésekor:", err);
        toast.error("Nem sikerült betölteni az ételeket.");
      } finally {
        setFetchingFoods(false);
      }
    };
    fetchFoods();
  }, []);

  const soupsList = useMemo(
    () => dbFoods.filter((f) => f.type === "Leves"),
    [dbFoods],
  );
  const mainsList = useMemo(
    () => dbFoods.filter((f) => f.type === "Főétel"),
    [dbFoods],
  );
  const sidesList = useMemo(
    () => dbFoods.filter((f) => f.type === "Köret"),
    [dbFoods],
  );
  const saladsList = useMemo(
    () => dbFoods.filter((f) => f.type === "Saláta" || f.type === "Savanyúság"),
    [dbFoods],
  );
  const fixList = useMemo(
    () => dbFoods.filter((f) => f.type === "Állandó"),
    [dbFoods],
  );

  const handleMenuChange = (index, field, value) => {
    const updated = [...mainMenus];
    updated[index][field] = value;
    setMainMenus(updated);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!date) return toast.error("Kérlek, válassz ki egy dátumot!");

    setLoading(true);

    const payloadItems = [];

    if (!isClosed) {
      // 1. Leves hozzáadása
      if (soupId) {
        const soupObj = dbFoods.find((f) => f._id === soupId);
        if (soupObj) {
          payloadItems.push({
            type: "soup",
            name: soupObj.name,
            price: Number(soupObj.price),
            category: "leves",
            imageUrl: soupObj.image || "",
          });
        }
      }

      // A, B, C, D Menük összefűzése
      mainMenus.forEach((m) => {
        if (m.mainId) {
          const mainFood = dbFoods.find((f) => f._id === m.mainId);
          const sideFood = dbFoods.find((f) => f._id === m.sideId);
          const saladFood = dbFoods.find((f) => f._id === m.saladId);

          if (mainFood) {
            const nameParts = [
              mainFood.name,
              sideFood?.name,
              saladFood?.name,
            ].filter(Boolean);

            const combinedImages = [
              mainFood.image,
              sideFood?.image,
              saladFood?.image,
            ].filter(Boolean);

            payloadItems.push({
              type: "main",
              name: nameParts.join(", "),
              price: Number(mainFood.price),
              category: m.category,
              imageUrls: combinedImages,
            });
          }
        }
      });

      // Állandó kaja
      if (fixId) {
        const fixObj = dbFoods.find((f) => f._id === fixId);
        if (fixObj) {
          payloadItems.push({
            type: "fix",
            name: fixObj.name,
            price: Number(fixObj.price),
            category: "Állandó",
            imageUrl: fixObj.image || "",
          });
        }
      }
    }

    const payload = {
      weeksMenu: [
        {
          date,
          dayName: getHungarianDayName(date),
          isClosed,
          items: payloadItems,
        },
      ],
    };

    try {
      const response = await fetch("/api/admin/upload", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const resData = await response.json();

      if (!response.ok) {
        throw new Error(resData.error || "Hiba a mentés során");
      }

      toast.success(`${getHungarianDayName(date)}i menü sikeresen mentve!`);

      // Form visszaállítása
      setSoupId("");
      setFixId("");
      setMainMenus([
        {
          type: "main",
          category: "A menü",
          mainId: "",
          sideId: "",
          saladId: "",
        },
        {
          type: "main",
          category: "B menü",
          mainId: "",
          sideId: "",
          saladId: "",
        },
        {
          type: "main",
          category: "C menü",
          mainId: "",
          sideId: "",
          saladId: "",
        },
        {
          type: "main",
          category: "D menü",
          mainId: "",
          sideId: "",
          saladId: "",
        },
      ]);
      setIsClosed(false);
    } catch (error) {
      console.error(error);
      toast.error(error.message || "Valami hiba történt a mentésnél.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="py-6 px-4 w-full gap-3 mx-auto min-h-screen bg-neutral-900 text-gray-100 flex flex-col md:flex-row">
      <div className="w-full md:w-[300px]">
        <AdminNav />
      </div>
      <PusherComponent />

      <div className="bg-neutral-900 mx-auto w-full max-w-[1800px]">
        <h2 className="text-2xl font-bold text-teal-400 mb-6 uppercase tracking-wider border-b border-neutral-800 pb-4">
          Napi menü összeállítása
        </h2>

        {fetchingFoods ? (
          <div className="text-center py-10 text-gray-400 animate-pulse">
            Ételek betöltése...
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Dátum & Zárva opció */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-6 bg-neutral-800/40 p-4 rounded-xl border border-neutral-800">
              <div className="flex flex-col gap-2">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                  Válassz Dátumot{" "}
                  {date && (
                    <span className="text-teal-400">
                      ({getHungarianDayName(date)})
                    </span>
                  )}
                </label>
                <input
                  type="date"
                  required
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="bg-neutral-100 border border-neutral-700 text-gray-900 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-teal-500 cursor-pointer"
                />
              </div>

              <div className="flex items-center gap-3 sm:mt-6">
                <input
                  type="checkbox"
                  id="isClosed"
                  checked={isClosed}
                  onChange={(e) => setIsClosed(e.target.checked)}
                  className="w-5 h-5 accent-teal-500 rounded border-neutral-700 cursor-pointer"
                />
                <label
                  htmlFor="isClosed"
                  className="text-sm font-semibold text-gray-300 cursor-pointer select-none"
                >
                  Ezen a napon zárva vagyunk (Ünnepnap / Szünnap)
                </label>
              </div>
            </div>

            {!isClosed && (
              <div className="space-y-6">
                {/* LEVES */}
                <div className="bg-neutral-800/30 p-4 rounded-xl border border-neutral-800">
                  <h3 className="text-xs font-bold text-teal-400 uppercase tracking-widest mb-3">
                    Napi Leves
                  </h3>
                  <FoodSelect
                    items={soupsList}
                    value={soupId}
                    onChange={setSoupId}
                    placeholder="-- Válassz vagy keress levest --"
                    showPrice={true}
                    inputClassName="bg-neutral-900 border border-neutral-700 p-2.5 text-sm"
                  />
                </div>

                {/* MENÜK */}
                <div className="space-y-4">
                  <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest">
                    Napi Menük
                  </h3>

                  {mainMenus.map((menu, index) => {
                    const selectedMain = mainsList.find(
                      (f) => f._id === menu.mainId,
                    );

                    return (
                      <div
                        key={index}
                        className="bg-neutral-900/60 p-4 rounded-xl border border-neutral-800/80 space-y-3"
                      >
                        <div className="flex justify-between items-center border-b border-neutral-800 pb-2 mb-4">
                          <span className="text-sm font-bold text-teal-400 uppercase">
                            {menu.category}
                          </span>
                          {selectedMain && (
                            <span className="text-xs font-bold text-teal-400 bg-teal-950/80 border border-teal-800 px-3 py-1 rounded-full shadow-sm">
                              Ár: {selectedMain.price} Ft
                            </span>
                          )}
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                          {/* Főétel */}
                          <div className="relative">
                            <label className="block text-[10px] uppercase font-bold text-gray-400 mb-1.5">
                              Főétel (ennek az ára számít)
                            </label>
                            <FoodSelect
                              items={mainsList}
                              value={menu.mainId}
                              onChange={(val) =>
                                handleMenuChange(index, "mainId", val)
                              }
                              placeholder="-- Főétel keresése --"
                              showPrice={true}
                              inputClassName="bg-neutral-950 border border-neutral-700 p-2 text-xs"
                            />
                          </div>

                          {/* Köret */}
                          <div className="relative">
                            <label className="block text-[10px] uppercase font-bold text-gray-400 mb-1.5">
                              Köret
                            </label>
                            <FoodSelect
                              items={sidesList}
                              value={menu.sideId}
                              onChange={(val) =>
                                handleMenuChange(index, "sideId", val)
                              }
                              placeholder="-- Köret keresése (opcionális) --"
                              showPrice={false}
                              inputClassName="bg-neutral-950 border border-neutral-700 p-2 text-xs"
                            />
                          </div>

                          {/* Saláta / Savanyúság */}
                          <div className="relative">
                            <label className="block text-[10px] uppercase font-bold text-gray-400 mb-1.5">
                              Saláta / Savanyúság
                            </label>
                            <FoodSelect
                              items={saladsList}
                              value={menu.saladId}
                              onChange={(val) =>
                                handleMenuChange(index, "saladId", val)
                              }
                              placeholder="-- Saláta keresése (opcionális) --"
                              showPrice={false}
                              inputClassName="bg-neutral-950 border border-neutral-700 p-2 text-xs"
                            />
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* ÁLLANDÓ MENÜ */}
                <div className="bg-neutral-800/30 p-4 rounded-xl border border-neutral-800">
                  <h3 className="text-xs font-bold text-teal-400 uppercase tracking-widest mb-3">
                    Fix / Állandó Menü
                  </h3>
                  <FoodSelect
                    items={fixList}
                    value={fixId}
                    onChange={setFixId}
                    placeholder="-- Válassz vagy keress állandó ételt --"
                    showPrice={true}
                    inputClassName="bg-neutral-900 border border-neutral-700 p-2.5 text-sm"
                  />
                </div>
              </div>
            )}

            {/* MENTÉS GOMB */}
            <div className="flex justify-end pt-4 border-t border-neutral-800">
              <button
                type="submit"
                disabled={loading}
                className={`px-8 py-3 bg-teal-600 text-white font-bold rounded-xl text-sm uppercase tracking-wider hover:bg-teal-500 active:bg-teal-700 transition-all shadow-lg shadow-teal-600/10 cursor-pointer ${
                  loading ? "opacity-50 cursor-not-allowed animate-pulse" : ""
                }`}
              >
                {loading ? "Mentés folyamatban..." : "Napi menü mentése"}
              </button>
            </div>
          </form>
        )}
      </div>
    </section>
  );
}
