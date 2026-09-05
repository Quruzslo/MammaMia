"use client";

import Image from "next/image";
import { FaRegEdit } from "react-icons/fa";
import { MdOutlineDelete } from "react-icons/md";
import { useRouter } from "next/navigation";
import ALLERGEN_LIST from "./allergens";

export default function FoodGrid({
  itemList,
  setItemList,
  onEdit,
}: {
  itemList: any[];
  setItemList: any;
  onEdit?: (food: any) => void;
}) {
  const router = useRouter();

  const deleteFood = async (id: string, image: string) => {
    if (!confirm("Biztosan törölni szeretnéd ezt az ételt?")) return;

    try {
      const res = await fetch("/api/admin/foods/delete-food", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id, image }),
      });

      if (res.ok) {
        if (setItemList) {
          setItemList((prev: any) =>
            prev.filter((item: any) => item._id !== id),
          );
        }
      } else {
        const data = await res.json();
        alert(data.error || "Hiba történt a törlés során!");
      }
    } catch (err) {
      console.error("Hálózati hiba törléskor:", err);
    }
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
      {itemList.map((food: any) => (
        <div
          key={food._id}
          className="bg-neutral-800/80 rounded border border-neutral-700/80 overflow-hidden flex flex-col"
        >
          {food.image ? (
            <div className="relative w-full h-36 bg-neutral-900">
              <Image
                src={food.image}
                alt={food.name}
                fill
                className="object-cover"
              />
            </div>
          ) : (
            <div className="w-full h-36 bg-neutral-900 flex items-center justify-center text-gray-600 text-xs">
              Nincs kép
            </div>
          )}
          <div className="p-4 flex flex-col justify-between flex-1 gap-2">
            <div>
              <div className="flex justify-between items-start gap-2">
                <h3 className="font-bold text-sm text-gray-100">{food.name}</h3>
                <div className="flex flex-row gap-[15px] font-semibold p-[10px] rounded-full bg-neutral-700 text-teal-300 shrink-0 items-center">
                  <FaRegEdit
                    title="Módosítás"
                    size={20}
                    onClick={() => onEdit && onEdit(food)}
                    className="text-green-600 cursor-pointer hover:scale-[1.12] transition-transform"
                  />

                  <div className="w-[2px] h-[15px] z-10 bg-white/50 rounded-full"></div>

                  <MdOutlineDelete
                    title="Törlés"
                    onClick={() => deleteFood(food._id, food.image)}
                    size={20}
                    className="text-red-600 cursor-pointer hover:scale-[1.12] transition-transform"
                  />
                </div>
              </div>

              {/* Allergének megjelenítése */}
              {food.allergens && food.allergens.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {food.allergens.map((allergenName: string) => {
                    const allergen = ALLERGEN_LIST.find(
                      (a) => a.name === allergenName,
                    );
                    if (!allergen) return null;

                    const Icon = allergen.icon;

                    return (
                      <span
                        key={allergen.id}
                        className="flex items-center gap-1 px-2 py-0.5 text-[10px] rounded bg-neutral-900 border border-neutral-700 text-neutral-100 font-medium"
                      >
                        <Icon className="w-3 h-3" />
                        {allergen.name}
                      </span>
                    );
                  })}
                </div>
              )}
            </div>

            <div className="flex justify-between items-center mt-2 pt-2 border-t border-neutral-700/50">
              <span className="text-xs text-gray-200 capitalize">
                {food.type}
              </span>
              <span className="text-white font-bold text-base">
                {food.price} Ft
              </span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
