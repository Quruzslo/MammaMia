"use client";

import { useState } from "react";

import PanelSchema from "../admin-components/PanelSchema";

import FoodForm from "./foodForm";
import FoodGrid from "./foodGrid";
import EditFoodModal from "./editFoodModal";

interface FoodItem {
  _id?: string;
  name: string;
  price: number;
  category?: string;
  type: string;
  image?: string;
}

export default function Foods() {
  const [itemList, setItemList] = useState<FoodItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [editingFood, setEditingFood] = useState<FoodItem | null>(null);

  return (
    <PanelSchema>
      <div className="flex flex-col lg:flex-row gap-6 w-full">
        {/* Új étel feltöltő Form */}
        <FoodForm setItemList={setItemList} setLoading={setLoading} />

        {/* Statisztika / Információ */}
        <div className="w-full lg:w-1/2 bg-neutral-800/40 border border-neutral-800 p-6 rounded-md flex flex-col justify-between">
          <div>
            <h3 className="text-lg font-bold mb-2 text-gray-300">
              Ételtár összegzése
            </h3>
            <p className="text-sm text-gray-400">
              Az itt elmentett ételeket a heti étlap összeállításakor egyetlen
              kattintással behívhatod.
            </p>
          </div>
          <div className="mt-4 p-4 bg-neutral-900/60 rounded border border-neutral-800">
            <span className="text-xs uppercase text-gray-500 font-bold block">
              Összes mentett étel
            </span>
            <span className="text-3xl font-extrabold text-green-400">
              {itemList.length} db
            </span>
          </div>
        </div>
      </div>

      {/* Ételek grid listája */}
      <div className="flex flex-col gap-4">
        <h2 className="text-xl font-bold text-gray-200">
          Elmentett Ételek ({itemList.length})
        </h2>

        {loading ? (
          <p className="text-gray-400">Ételek betöltése...</p>
        ) : itemList.length === 0 ? (
          <p className="text-gray-500 italic">
            Még nincs mentett étel az ételtárban.
          </p>
        ) : (
          <FoodGrid
            itemList={itemList}
            setItemList={setItemList}
            onEdit={(food) => setEditingFood(food)}
          />
        )}
      </div>
      <EditFoodModal
        food={editingFood}
        onClose={() => setEditingFood(null)}
        setItemList={setItemList}
      />
    </PanelSchema>
  );
}
