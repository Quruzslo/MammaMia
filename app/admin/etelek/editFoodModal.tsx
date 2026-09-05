"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { IoClose } from "react-icons/io5";
import { validateFoodInput } from "./foodValidation";

export interface FoodItem {
  _id?: string;
  name: string;
  price: number;
  category?: string;
  type: string;
  allergens?: string[];
  image?: string;
}

interface EditFoodModalProps {
  food: FoodItem | null;
  onClose: () => void;
  setItemList: React.Dispatch<React.SetStateAction<FoodItem[]>>;
}

const ALLERGEN_OPTIONS = ["Glutén", "Hal", "Csonthéjas", "Laktóz", "Szója"];

export default function EditFoodModal({
  food,
  onClose,
  setItemList,
}: EditFoodModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form State
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [type, setType] = useState("Főétel");
  const [allergens, setAllergens] = useState<string[]>([]);
  const [file, setFile] = useState<File | null>(null);

  useEffect(() => {
    if (food) {
      setName(food.name || "");
      setPrice(food.price !== undefined ? String(food.price) : "");
      setType(food.type || "Főétel");
      setAllergens(food.allergens || []);
      setFile(null);
    }
  }, [food]);

  if (!food) return null;

  const handleAllergenChange = (allergen: string) => {
    setAllergens((prev) =>
      prev.includes(allergen)
        ? prev.filter((item) => item !== allergen)
        : [...prev, allergen],
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const validation = validateFoodInput({ name, price, file });
    if (!validation.isValid) {
      return alert(validation.error);
    }

    setIsSubmitting(true);

    try {
      const formData = new FormData();
      formData.append("id", food._id || "");
      formData.append("name", name);
      formData.append("price", price);
      formData.append("type", type);
      formData.append("allergens", JSON.stringify(allergens));
      if (file) formData.append("file", file);

      const res = await fetch("/api/admin/foods/update-food", {
        method: "PATCH",
        body: formData,
      });

      const data = await res.json();

      if (res.ok) {
        setItemList((prev) =>
          prev.map((item) => (item._id === food._id ? data.updatedFood : item)),
        );
        onClose();
      } else {
        alert(data.error || "Hiba történt a frissítés során.");
      }
    } catch (error) {
      console.error("Hiba a frissítéskor:", error);
      alert("Hálózati hiba történt!");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <div className="w-full max-w-lg bg-neutral-800 border border-neutral-700 p-6 rounded-lg shadow-xl relative max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
        >
          <IoClose size={24} />
        </button>

        <h2 className="text-xl font-bold mb-4 text-white">Étel Módosítása</h2>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="block text-xs uppercase font-bold text-gray-400 mb-1">
              Étel neve
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-neutral-900 border border-neutral-700 rounded px-3 py-2 text-sm text-white focus:outline-none focus:border-teal-500"
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
                className="w-full bg-neutral-900 border border-neutral-700 rounded px-3 py-2 text-sm text-white focus:outline-none focus:border-teal-500"
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
                className="w-full bg-neutral-900 border border-neutral-700 rounded px-3 py-2 text-sm text-white focus:outline-none focus:border-teal-500"
              >
                <option value="Leves">Leves</option>
                <option value="Főétel">Főétel</option>
                <option value="Köret">Köret</option>
                <option value="Desszert">Desszert</option>
                <option value="Állandó">Állandó</option>
              </select>
            </div>
          </div>

          {/* Allergén választó panel ---------- */}
          <div>
            <label className="block text-xs uppercase font-bold text-gray-400 mb-1">
              Allergének
            </label>
            <div className="grid grid-cols-2 gap-2 bg-neutral-900 border border-neutral-700 rounded p-3">
              {ALLERGEN_OPTIONS.map((item) => (
                <label
                  key={item}
                  className="flex items-center gap-2 text-sm text-gray-200 cursor-pointer hover:text-white"
                >
                  <input
                    type="checkbox"
                    checked={allergens.includes(item)}
                    onChange={() => handleAllergenChange(item)}
                    className="w-4 h-4 rounded bg-neutral-800 border-neutral-600 text-teal-500 focus:ring-teal-500 focus:ring-offset-neutral-900 accent-teal-500 cursor-pointer"
                  />
                  {item}
                </label>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs uppercase font-bold text-gray-400 mb-1">
              Új kép (Opcionális)
            </label>
            {food.image && !file && (
              <div className="relative w-16 h-16 mb-2 rounded overflow-hidden border border-neutral-700">
                <Image
                  src={food.image}
                  alt="Jelenlegi kép"
                  fill
                  className="object-cover"
                />
              </div>
            )}
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setFile(e.target.files?.[0] || null)}
              className="w-full text-xs text-gray-400 file:mr-2 file:py-2 file:px-3 file:rounded file:border-0 file:bg-neutral-700 file:text-gray-200 hover:file:bg-neutral-600"
            />
          </div>

          <div className="flex gap-3 mt-2">
            <button
              type="button"
              onClick={onClose}
              className="w-1/2 bg-neutral-700 hover:bg-neutral-600 text-white font-bold py-2 px-4 rounded transition-all"
            >
              Mégse
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-1/2 bg-green-600 hover:bg-green-500 text-white font-bold py-2 px-4 rounded transition-all disabled:opacity-50"
            >
              {isSubmitting ? "Mentés..." : "Módosítás mentése"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
