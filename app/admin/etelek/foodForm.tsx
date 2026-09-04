"use client";
import { useState, useEffect } from "react";
import { validateFoodInput } from "./foodValidation";

interface FoodItem {
  _id?: string;
  name: string;
  price: number;
  category: string;
  type: string;
  image?: string;
}

export default function FoodForm({ setItemList, setLoading }: any) {
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  // Form State
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  // const [category, setCategory] = useState("A menü");
  const [type, setType] = useState("main");
  const [file, setFile] = useState<File | null>(null);

  const fetchFoods = async () => {
    try {
      const res = await fetch("/api/admin/foods/get-foods");
      if (res.ok) {
        const data = await res.json();
        setItemList(data);
      }
    } catch (error) {
      console.error("Hiba az ételek lekérésekor:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFoods();
  }, []);

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    const validation = validateFoodInput({ name, price, file });
    if (!validation.isValid) {
      return alert(validation.error);
    }

    setIsSubmitting(true);
    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("price", price);
      formData.append("type", type);
      if (file) formData.append("file", file);

      const res = await fetch("/api/admin/foods/upload-food", {
        method: "POST",
        body: formData,
      });

      if (res.ok) {
        setName("");
        setPrice("");
        setFile(null);
        await fetchFoods();
      } else {
        alert("Hiba történt a feltöltés során.");
      }
    } catch (error) {
      console.error("Hiba a feltöltés során:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full lg:w-1/2 bg-neutral-800/60 border border-neutral-700/60 p-6 rounded-md">
      <h2 className="text-xl font-bold mb-4 text-white">Új Étel Hozzáadása</h2>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div>
          <label className="block text-xs uppercase font-bold text-gray-400 mb-1">
            Étel neve
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Pl. Rántott csirkemell párolt rizzsel"
            className="w-full bg-neutral-900 border border-neutral-700 rounded px-3 py-2 text-sm focus:outline-none focus:border-teal-500"
            required
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs uppercase font-bold text-gray-400 mb-1">
              Ár (Ft)
            </label>
            <input
              type="number"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              placeholder="1870"
              className="w-full bg-neutral-900 border border-neutral-700 rounded px-3 py-2 text-sm focus:outline-none focus:border-teal-500"
              required
            />
          </div>

          <div>
            <label className="block text-xs uppercase font-bold text-gray-400 mb-1">
              Típus
            </label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value)}
              className="w-full bg-neutral-900 border border-neutral-700 rounded px-3 py-2 text-sm focus:outline-none focus:border-teal-500"
            >
              <option value="Leves">Leves</option>
              <option value="Főétel">Főétel</option>
              <option value="Köret">Köret</option>
              <option value="Desszert">Desszert</option>
              <option value="Állandó">Állandó</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs uppercase font-bold text-gray-400 mb-1">
              Kép az ételhez
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setFile(e.target.files?.[0] || null)}
              className="w-full text-xs text-gray-400 file:mr-2 file:py-2 file:px-3 file:rounded file:border-0 file:bg-neutral-700 file:text-gray-200 hover:file:bg-neutral-600"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="mt-2 w-full bg-green-600 hover:bg-green-500 text-white font-bold py-2 px-4 rounded transition-all duration-200 disabled:opacity-50"
        >
          {isSubmitting ? "Feltöltés..." : "Étel mentése "}
        </button>
      </form>
    </div>
  );
}
