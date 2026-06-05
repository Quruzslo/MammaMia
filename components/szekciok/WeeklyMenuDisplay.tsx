"use client";

import { LiaCartPlusSolid } from "react-icons/lia";
import { motion } from "framer-motion";

interface DayItem {
  name: string;
  category: string;
  price: number;
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
  onAddToCart: (item: DayItem, date: string, dayName: string) => void;
}

// Motion animáció
const cardMotionVariants = {
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
          // kártyákon 5% treshold
          viewport={{ once: false, amount: 0.05 }}
          className="relative bg-white rounded-sm px-[10px] py-[50px] md:p-10 shadow-[0_0_18px_10px_rgba(0,0,0,0.06)]"
        >
          {/* ================= 1. DÁTUM BADGE ================= */}
          <div className="absolute -top-5 -left-2 md:-top-6 md:-left-6 rotate-[-4deg] bg-stone-900 text-white px-6 py-2 rounded-sm shadow-xl z-20 border-2 border-dashed border-stone-600 transition-transform hover:rotate-0">
            <span className="block text-xl md:text-2xl font-black uppercase tracking-widest">
              {nap.dayName}
            </span>
            <span className="block text-sm text-stone-300 font-medium tracking-wider">
              {nap.date}
            </span>
          </div>

          {/* ================= 2. LEJÁRT MENÜ BADGE ================= */}
          {!nap.orderable && (
            <div className="absolute top-[5px] right-[5px] bg-red-400/70 text-center p-[5px] z-10 shadow-xl flex items-center justify-center">
              <p className="text-white uppercase font-black text-[15px] tracking-widest">
                Lejárt menü
              </p>
            </div>
          )}

          {/* ================= 3. ZÁRVA OVERLAY ================= */}
          {nap.isClosed && (
            <div className="absolute inset-0 bg-transparent backdrop-blur-[2px] z-10 flex items-center justify-center rounded-sm p-[10px]">
              <div className="bg-red-600 text-white px-10 py-3 text-4xl font-black uppercase tracking-[0.2em] shadow-[10px_10px_20px_2px_rgba(0,0,0,0.6)] border-4 border-white">
                Zárva
              </div>
            </div>
          )}

          {/* ================= 4. ÉTELEK GRID ================= */}
          <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-2">
            {nap.items.map((item, ind) => (
              <div
                key={ind}
                className={`group flex flex-col justify-between p-[10px] bg-white rounded-[5px] transition-all duration-300 border border-stone-200 hover:-translate-y-1 active:shadow-[10px_10px_20px_2px_rgba(0,0,0,0.6)] md:hover:shadow-[10px_10px_20px_2px_rgba(0,0,0,0.6)] ${
                  nap.orderable ? "opacity-100" : "opacity-40 grayscale"
                }`}
              >
                <div>
                  <span className="inline-block p-[5px] mb-4 text-[10px] font-extrabold uppercase tracking-widest text-white bg-black rounded-sm">
                    {item.category}
                  </span>
                  <h4 className="text-lg font-bold text-stone-800 leading-tight mb-4 group-hover:text-teal-700 transition-colors">
                    {item.name}
                  </h4>
                </div>

                <div className="flex flex-col md:flex-row items-center justify-between mt-6 pt-4 border-t border-stone-200 border-dashed">
                  <p className="text-[15px] font-black text-stone-700">
                    {item.price.toLocaleString()}{" "}
                    <span className="text-sm font-semibold text-stone-400">
                      Ft
                    </span>
                  </p>

                  {nap.orderable && !nap.isClosed ? (
                    <button
                      onClick={() => onAddToCart(item, nap.date, nap.dayName)}
                      className="w-11 h-11 flex items-center justify-center rounded-full bg-stone-900 text-white hover:bg-teal-500 hover:scale-110 active:scale-95 transition-all duration-200 shadow-md focus:outline-none focus:ring-4 focus:ring-teal-500/30"
                      title="Kosárba rakom"
                    >
                      <LiaCartPlusSolid size={22} />
                    </button>
                  ) : (
                    <div className="px-3 py-1.5 rounded-sm bg-stone-100 border border-stone-200 flex items-center justify-center">
                      <span className="text-[10px] font-bold uppercase text-stone-400">
                        {nap.orderable ? "-" : "Már nem rendelhető"}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      ))}
    </div>
  );
}
