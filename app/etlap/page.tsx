"use client";

import { useEffect, useState, useMemo, useContext } from "react";
import { PiBowlFood } from "react-icons/pi";
import { cartContext } from "@/components/contexts/cartProvider";
import { toast } from "react-toastify";
import AlacarteItemCard from "./alacarteItemCard";

interface Food {
  _id: string;
  tenantId: string;
  name: string;
  type: string;
  description: string;
  price: number;
  allergens: string[];
  image: string;
  isAvailable: boolean;
  uploadedAt: string;
  updatedAt: string;
  subCategory: string;
  foodType: string;
}

export default function Etlap() {
  const [foods, setFoods] = useState<Food[]>([]);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedSubCategory, setSelectedSubCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  const { addToCart } = useContext(cartContext);

  useEffect(() => {
    async function fetching() {
      try {
        const res = await fetch("/api/alacarte", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (!res.ok) {
          throw new Error(`HTTP hiba! Státusz: ${res.status}`);
        }

        const data = await res.json();
        setFoods(data);
      } catch (err) {
        console.error("Hiba az adatok lekérésekor:", err);
      }
    }

    fetching();
  }, []);

  // Főkategória váltása esetén nullázzuk az alkategória szűrőt
  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    setSelectedSubCategory("all");
  };

  const categories = useMemo(() => {
    if (!foods || foods.length === 0) return ["all"];
    const uniqueTypes = Array.from(new Set(foods.map((food) => food.type)));
    return ["all", ...uniqueTypes];
  }, [foods]);

  // Csak a kiválasztott főkategóriához tartozó alkategóriák kigyűjtése
  const subCategories = useMemo(() => {
    if (!foods || foods.length === 0 || selectedCategory === "all") return [];

    const categoryFoods = foods.filter(
      (food) => food.type === selectedCategory,
    );
    const uniqueSubTypes = Array.from(
      new Set(categoryFoods.map((food) => food.subCategory).filter(Boolean)),
    );

    if (uniqueSubTypes.length === 0) return [];

    return ["all", ...uniqueSubTypes];
  }, [foods, selectedCategory]);

  const filtered = useMemo(() => {
    return foods.filter((food) => {
      const categoryFilter =
        selectedCategory === "all" || food.type === selectedCategory;

      const subCategoryFilter =
        selectedCategory === "all" ||
        selectedSubCategory === "all" ||
        food.subCategory === selectedSubCategory;

      const queryFilter =
        food.name
          .toLowerCase()
          .trim()
          .includes(searchQuery.toLowerCase().trim()) ||
        food.description
          .toLowerCase()
          .trim()
          .includes(searchQuery.toLowerCase().trim());

      return categoryFilter && subCategoryFilter && queryFilter;
    });
  }, [foods, selectedCategory, selectedSubCategory, searchQuery]);

  const handleAddToCartWithNotification = (item: Food, count: number) => {
    addToCart(item, null, null, count);

    toast(
      <div className="flex items-center gap-3">
        <PiBowlFood size={24} className="fill-sarga" />
        <div>
          <h5 className="font-bold text-white text-sm">{item.name}</h5>
          <p className="text-xs text-gray-400">
            Hozzáadva a kosárhoz: {count} db
          </p>
        </div>
      </div>,
      {
        className:
          "bg-neutral-900 border border-sarga/50 rounded-xl p-4 shadow-2xl",
        progressClassName: "!bg-sarga",
      },
    );
  };

  return (
    <section className="w-[90%] mx-auto py-[50px] flex flex-col">
      <h1 className="text-[20px] lg:text-[35px] relative font-bold mb-6 text-center text-white underlined w-fit mx-auto">
        Étlap
      </h1>

      <div className="flex flex-col gap-6 mb-8 w-full">
        <div className="flex flex-col md:flex-row gap-[25px] items-center justify-between w-full">
          {/* Keresőmező */}
          <div className="w-full md:w-1/3">
            <input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              type="text"
              placeholder="Étel keresése..."
              className="w-full px-4 py-2 rounded-full bg-white/10 text-white placeholder-gray-400 border border-white/20 focus:outline-none focus:border-sarga transition-all"
            />
          </div>

          {/* Főkategória gombok */}
          <div className="flex flex-wrap gap-2 justify-center">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => handleCategoryChange(category)}
                className={`px-4 py-2 rounded-full text-sm font-semibold capitalize transition-all ${
                  selectedCategory === category
                    ? "bg-sarga text-slate-900 shadow-md scale-105"
                    : "bg-white/10 text-white hover:bg-white/20"
                }`}
              >
                {category === "all" ? "Összes" : category}
              </button>
            ))}
          </div>
        </div>

        {/* Alkategória */}
        {selectedCategory !== "all" && subCategories.length > 1 && (
          <div className="flex flex-wrap gap-2 justify-center pt-2 border-t border-white/10">
            {subCategories.map((subCategory) => (
              <button
                key={subCategory}
                onClick={() => setSelectedSubCategory(subCategory)}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold capitalize transition-all ${
                  selectedSubCategory === subCategory
                    ? "bg-sarga text-slate-900 shadow-md scale-105"
                    : "bg-white/10 text-white hover:bg-white/20 opacity-80"
                }`}
              >
                {subCategory === "all" ? "Összes alkategória" : subCategory}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Ételek listája */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-[50px]">
        {filtered.length > 0 ? (
          filtered.map((food) => (
            <AlacarteItemCard
              key={food._id}
              food={food}
              onAddToCart={handleAddToCartWithNotification}
            />
          ))
        ) : (
          <p className="text-center text-gray-400 col-span-2 py-8">
            Nincs a keresésnek megfelelő étel.
          </p>
        )}
      </div>
    </section>
  );
}
