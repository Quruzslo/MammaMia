"use client";
import { useState } from "react";
import { toast } from "react-toastify";
import AdminNav from "../rendelesek/adminNav";

// Segédfüggvény a nap nevének kiszámításához magyarul
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

  // Az 5 fix ételhely kezdőállapota a pontos séma
  const [items, setItems] = useState([
    { type: "soup", name: "", price: "", category: "leves" },
    { type: "main", name: "", price: "", category: "A menü" },
    { type: "main", name: "", price: "", category: "B menü" },
    { type: "main", name: "", price: "", category: "C menü" },
    { type: "fix", name: "", price: "", category: "Állandó" },
  ]);

  // Input mezők változásának kezelése az items tömbben
  const handleItemChange = (index, field, value) => {
    const newItems = [...items];
    newItems[index][field] = field === "price" ? Number(value) : value;
    setItems(newItems);
  };

  // Mentés gomb lefutása
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!date) return toast.error("Kérlek, válassz ki egy dátumot!");

    setLoading(true);

    const payload = {
      weeksMenu: [
        {
          date: date,
          dayName: getHungarianDayName(date),
          isClosed: isClosed,

          items: isClosed ? [] : items,
        },
      ],
    };

    try {
      // Postolás
      const response = await fetch("/api/admin/upload", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const resData = await response.json();

      if (!response.ok) {
        throw new Error(resData.error || "Hiba a mentés során");
      }

      toast.success(`${getHungarianDayName(date)}i menü sikeresen feltöltve!`);

      // Form kiürítése (kivéve a dátumot, hátha a következőt akarja tölteni)
      setItems([
        { type: "soup", name: "", price: "", category: "leves" },
        { type: "main", name: "", price: "", category: "A menü" },
        { type: "main", name: "", price: "", category: "B menü" },
        { type: "main", name: "", price: "", category: "C menü" },
        { type: "fix", name: "", price: "", category: "Állandó" },
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
    <section className="py-6 px-4 w-[100%] gap-3  mx-auto min-h-screen bg-neutral-900 text-gray-100  flex flex-col md:flex-row">
      <div className="w-[100%] md:w-[300px]">
        <AdminNav></AdminNav>{" "}
      </div>
      <div className="bg-neutral-900 mx-auto w-[100%] ">
        <h2 className="text-2xl font-bold text-teal-400 mb-6 uppercase tracking-wider border-b border-neutral-800 pb-4">
          Napi menü feltöltése
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Felső vezérlők: Dátum és Zárva státusz */}
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
                className="bg-neutral-100 border border-neutral-700 text-gray-900 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-teal-500 transition-colors cursor-pointer"
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

          {/* Ételek bevitele (Csak ha nincs zárva az adott nap) */}
          {!isClosed && (
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-2">
                Napi Ételek listája
              </h3>

              {items.map((item, index) => (
                <div
                  key={index}
                  className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center bg-neutral-900/50 p-3 rounded-xl border border-neutral-800/60 hover:border-neutral-700/50 transition-colors"
                >
                  {/* Fix kategória badge */}
                  <div className="md:col-span-2">
                    <span className="inline-block px-3 py-1 bg-teal-900/30 text-teal-400 border border-teal-500/20 text-xs font-bold uppercase rounded-full tracking-wider w-full text-center">
                      {item.category}
                    </span>
                  </div>

                  {/* Étel neve input */}
                  <div className="md:col-span-7">
                    <input
                      type="text"
                      required
                      placeholder={`${item.category} neve...`}
                      value={item.name}
                      onChange={(e) =>
                        handleItemChange(index, "name", e.target.value)
                      }
                      className="w-full bg-neutral-900 border border-neutral-700 text-gray-100 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-teal-500 transition-colors"
                    />
                  </div>

                  {/* Ár input */}
                  <div className="md:col-span-3 relative flex items-center">
                    <input
                      type="number"
                      required
                      placeholder="Ár..."
                      value={item.price}
                      onChange={(e) =>
                        handleItemChange(index, "price", e.target.value)
                      }
                      className="w-full bg-neutral-900 border border-neutral-700 text-gray-100 rounded-lg pl-3 pr-8 py-2 text-sm focus:outline-none focus:border-teal-500 transition-colors [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                    />
                    <span className="absolute right-3 text-xs font-bold text-gray-500">
                      Ft
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Mentés gomb */}
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
      </div>
    </section>
  );
}
