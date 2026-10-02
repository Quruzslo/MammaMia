"use client";
import { LiaCartPlusSolid } from "react-icons/lia";
import { useState } from "react";
import Image from "next/image";
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

export default function AlacarteItemCard({
  food,
  onAddToCart,
}: {
  food: Food;
  onAddToCart: (item: Food, count: number) => void;
}) {
  const [count, setCount] = useState(1);

  return (
    <div className="w-full flex flex-col justify-center gap-[15px]">
      <div className="flex flex-col sm:fex-row gap-[15px]">
        <div className="w-[100px] h-[100px] rounded-full border-2 border-sarga relative overflow-hidden shrink-0">
          <Image
            fill
            alt={food.name}
            src={food.image}
            className="object-cover"
          />
        </div>

        <div className="flex flex-col gap-[10px]">
          <h3 className="text-[30px] font-bold leading-tight">{food.name}</h3>
          <p className="text-[15px]">{food.description}</p>

          {food.allergens && food.allergens.length > 0 && (
            <p className="text-[13px] text-white/60 italic">
              Allergének: {food.allergens.join(", ")}
            </p>
          )}
          <span className="font-bold">{food.price} Ft.</span>
          <div className="flex flex-row nowrap bg-white w-fit rounded-full items-center pl-[10px] py-[5px] pr-[5px] gap-[10px] mt-2 border-1 border-sarga">
            <div className="flex flex-row text-black gap-[10px] items-center">
              <button
                type="button"
                className="rounded-full w-[25px] h-[25px] flex items-center justify-center text-[20px] text-white bg-sarga"
                onClick={() => setCount((prev) => Math.max(1, prev - 1))}
              >
                -
              </button>
              <span className="text-[15px] font-bold">{count}</span>
              <button
                type="button"
                className="rounded-full w-[25px] h-[25px] flex items-center justify-center text-[20px] text-white bg-sarga"
                onClick={() => setCount((prev) => prev + 1)}
              >
                +
              </button>
            </div>
            <button
              type="button"
              onClick={() => {
                onAddToCart(food, count);
                setCount(1);
              }}
              className="p-[8px] flex items-center justify-center rounded-full bg-stone-900 text-white hover:bg-sarga transition-all duration-200 shadow-md focus:outline-none"
              title="Kosárba rakom"
            >
              <LiaCartPlusSolid size={20} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
