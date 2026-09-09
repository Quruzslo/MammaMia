"use client";

import { LiaCartPlusSolid } from "react-icons/lia";
import { motion } from "framer-motion";
import Image from "next/image";
import { useState } from "react";

interface DayItem {
  name: string;
  category: string;
  price: number;
  imageUrls?: string[];
  imageUrl?: string;
  allergens?: string[];
}

interface Day {
  date: string;
  dayName: string;
  isClosed: boolean;
  orderable: boolean;
  items: DayItem[];
}

interface WeeklyMenuDisplayProps {
  days: Day[];
  onAddToCart: (
    item: DayItem,
    date: string,
    dayName: string,
    quantity: number,
  ) => void;
}

const cardMotionVariants: {} = {
  hidden: {
    opacity: 0,
    y: 60,
    scale: 0.96,
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      type: "spring",
      damping: 16,
      stiffness: 90,
      bounce: 0.2,
    },
  },
};

// -------------------------------------------------------------
// Kártya comp
// -------------------------------------------------------------
function MenuItemCard({
  item,
  nap,
  onAddToCart,
}: {
  item: DayItem;
  nap: Day;
  onAddToCart: (
    item: DayItem,
    date: string,
    dayName: string,
    quantity: number,
  ) => void;
}) {
  const [count, setCount] = useState(1);

  const imagesToDisplay = item.imageUrls?.length
    ? item.imageUrls
    : item.imageUrl
      ? [item.imageUrl]
      : [];

  return (
    <div
      className={`group flex flex-col justify-between p-[10px] bg-white rounded-[15px] transition-all duration-300 border-1 border-stone-400 hover:-translate-y-1 active:shadow-[10px_10px_20px_2px_rgba(0,0,0,0.6)] md:hover:shadow-[10px_10px_20px_2px_rgba(0,0,0,0.6)] ${
        nap.orderable ? "opacity-100" : "opacity-40 grayscale"
      }`}
    >
      <div className="h-full w-full stretch flex flex-col">
        <span className="inline-block p-[5px] mb-3 text-[10px] w-fit transition-all duration-300 font-extrabold uppercase tracking-widest text-white bg-black rounded-sm group-hover:-translate-y-1 group-active:shadow-[10px_10px_20px_2px_rgba(0,0,0,0.6)] md:group-hover:shadow-[10px_10px_20px_2px_rgba(0,0,0,0.6)]">
          {item.category}
        </span>

        {/* Képek */}
        {imagesToDisplay.length > 0 && (
          <div
            className={`grid gap-[5px] mb-4 w-full ${
              imagesToDisplay.length === 1
                ? "grid-cols-2"
                : imagesToDisplay.length === 2
                  ? "grid-cols-2"
                  : "grid-cols-3"
            }`}
          >
            {imagesToDisplay.map((img, imgInd) => (
              <div
                key={imgInd}
                className="relative aspect-square w-full max-h-[250px] md:max-h-[100px] rounded-md overflow-hidden shadow-[0px_5px_10px_0px_rgba(0,0,0,0.6)]"
              >
                <Image
                  src={img}
                  fill
                  alt={`${item.name} ${imgInd + 1}`}
                  className="object-cover group-hover:scale-110 transition-transform duration-500"
                />
              </div>
            ))}
          </div>
        )}

        <h4 className="text-sm md:text-base font-bold text-stone-800 leading-tight mb-auto">
          {item.name}
        </h4>
        <div className="flex flex-row flex-wrap gap-[5px] mt-auto">
          {item.allergens?.map((all) => (
            <div
              className="text-[10px] text-white bg-sarga px-[5px] py-[2px] skew-x-[-10deg] rounded-sm"
              key={all}
            >
              <span className="inline-block skew-x-[10deg]">{all}</span>
            </div>
          ))}
        </div>
        <p className="text-[15px] text-stone-700 font-bold">
          {item.price.toLocaleString()} ft
        </p>
      </div>

      <div className="flex flex-row items-center justify-between mt-2 md:mt-4 pt-3 border-t border-stone-200">
        {nap.orderable && !nap.isClosed ? (
          <div className="flex flex-row nowrap bg-white rounded-full items-center pl-[25px] py-[5px] pr-[5px] gap-[15px] mx-auto border-1 border-sarga">
            <div className="flex flex-row text-black gap-[10px] items-center">
              <button
                type="button"
                className=" rounded-full w-[25px] h-[25px] flex items-center justify-center text-[20px]  text-white bg-sarga"
                onClick={() => setCount((prev) => Math.max(1, prev - 1))}
              >
                -
              </button>
              <span className="text-[15px] font-bold ">{count}</span>
              <button
                type="button"
                className=" rounded-full w-[25px] h-[25px] flex items-center justify-center text-[20px]  text-white bg-sarga"
                onClick={() => setCount((prev) => prev + 1)}
              >
                +
              </button>
            </div>
            <button
              type="button"
              onClick={() => {
                onAddToCart(item, nap.date, nap.dayName, count);
              }}
              className="p-[8px] flex items-center justify-center rounded-full bg-stone-900 text-white hover:bg-sarga transition-all duration-200 shadow-md focus:outline-none"
              title="Kosárba rakom"
            >
              <LiaCartPlusSolid size={20} />
            </button>
          </div>
        ) : (
          <div className="px-2 py-1 rounded-sm bg-stone-100 border border-stone-200">
            <span className="text-[12px] font-bold uppercase text-stone-400">
              {nap.orderable ? "-" : "Nem rendelhető"}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}

// -------------------------------------------------------------
//  Fő komponens
// -------------------------------------------------------------
export default function WeeklyMenuDisplay({
  days,
  onAddToCart,
}: WeeklyMenuDisplayProps) {
  if (days.length === 0) {
    return (
      <p className="text-center text-gray-500 py-10">
        Erre a hétre még nem töltöttek fel menüt.
      </p>
    );
  }

  return (
    <div className="space-y-16 p-[10px]">
      {days.map((nap) => (
        <motion.div
          key={nap.date}
          variants={cardMotionVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: false, amount: 0.05 }}
          className="relative bg-white rounded-[15px] px-[10px] py-[50px] md:p-10 shadow-[0_0_18px_10px_rgba(0,0,0,0.06)]"
        >
          {/* dátum badge */}
          <div className="absolute -top-5 -left-2 md:-top-6 md:-left-6 rotate-[-4deg] bg-stone-900 text-white px-6 py-2 rounded-sm shadow-xl z-20 border-2 border-dashed border-stone-600 transition-transform hover:rotate-0">
            <span className="block text-xl md:text-2xl font-black uppercase tracking-widest">
              {nap.dayName}
            </span>
            <span className="block text-sm text-stone-300 font-medium tracking-wider">
              {nap.date}
            </span>
          </div>

          {/* lejárt menü badge */}
          {!nap.orderable && (
            <div className="absolute top-[5px] rounded-tr-[10px]  right-[5px] bg-red-400/70 text-center p-[5px] z-10 shadow-xl flex items-center justify-center">
              <p className="text-white uppercase font-black text-[15px] tracking-widest">
                Lejárt menü
              </p>
            </div>
          )}

          {/* zárva */}
          {nap.isClosed && (
            <div className="absolute inset-0 bg-white/60 backdrop-blur-[2px] z-10 flex items-center justify-center rounded-sm">
              <div className="bg-red-400 text-white px-6 py-3 text-[25px] font-black uppercase tracking-[0.2em] shadow-[10px_10px_20px_2px_rgba(0,0,0,0.6)] rounded-lg">
                Zárva
              </div>
            </div>
          )}

          {/* ételek grid */}
          {!nap.orderable ? (
            <div className="w-full flex flex-col items-center mt-6">
              <input
                type="checkbox"
                id={`toggle-${nap.date}`}
                className="peer hidden"
              />

              {/* Lenyitó gomb */}
              <label
                htmlFor={`toggle-${nap.date}`}
                className="cursor-pointer bg-stone-800 text-center text-white px-6 py-2 rounded-full font-bold uppercase text-sm tracking-wider hover:bg-stone-700 transition-colors mb-2 select-none peer-checked:mb-6"
              >
                Menü mutatása / elrejtése
              </label>

              <div className="w-full grid grid-rows-[0fr] peer-checked:grid-rows-[1fr] transition-[grid-template-rows] duration-300 ease">
                <div className="overflow-hidden">
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-3 pt-2">
                    {nap.items.map((item, ind) => (
                      <MenuItemCard
                        key={`${nap.date}-${item.name}-${ind}`}
                        item={item}
                        nap={nap}
                        onAddToCart={onAddToCart}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-[30px] md:gap-[10px]">
              {nap.items.map((item, ind) => (
                <MenuItemCard
                  key={`${nap.date}-${item.name}-${ind}`}
                  item={item}
                  nap={nap}
                  onAddToCart={onAddToCart}
                />
              ))}
            </div>
          )}
        </motion.div>
      ))}
    </div>
  );
}
