// components/WeekMenuDisplay.tsx
import { LiaCartPlusSolid } from "react-icons/lia";

interface WeeklyMenuDisplayProps {
  days: any[];
  onAddToCart: (item: any, date: string, dayName: string) => void;
}

export default function WeekMenuDisplay({
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
    <div className="space-y-8">
      {days.map((nap) => (
        <div
          key={nap.date}
          className={`flex flex-col lg:flex-row bg-neutral-800 rounded-xl overflow-hidden shadow-2xl border-l-4 ${
            nap.isClosed ? "border-red-500 opacity-75" : "border-teal-500"
          }`}
        >
          {/* Dátum és Nap szekció - Bal oldal */}
          <div className="lg:w-1/5 bg-neutral-900/50 p-[10px] flex flex-col justify-center items-center text-center border-b lg:border-b-0 lg:border-r border-neutral-700">
            <h3 className="text-2xl font-black text-teal-400 uppercase tracking-tighter">
              {nap.dayName}
            </h3>
            <span className="text-sm text-gray-400 mt-1">{nap.date}</span>
            {nap.isClosed && (
              <span className="mt-4 px-3 py-1 bg-red-500/10 text-red-500 border border-red-500/20 rounded-full text-xs font-bold uppercase">
                Zárva
              </span>
            )}
          </div>

          {/* Ételek Grid - Jobb oldal */}
          <div className="lg:w-4/5 p-[10px]">
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-5 md:gap-4">
              {nap.items.map((item: any, ind: number) => (
                <div
                  key={ind}
                  className="flex flex-col bg-neutral-900 rounded-lg border border-neutral-700 overflow-hidden hover:border-teal-500/50 transition-all group"
                >
                  <div className="p-4 flex-grow">
                    <span className="text-[10px] font-bold uppercase text-teal-500 tracking-widest block mb-1">
                      {item.category}
                    </span>
                    <h4 className="text-gray-100 font-semibold leading-snug min-h-[40px] mb-2">
                      {item.name}
                    </h4>
                    <p className="text-teal-400 font-bold">
                      {item.price.toLocaleString()} Ft
                    </p>
                  </div>

                  {/* Kosárba gomb */}
                  <button
                    disabled={nap.isClosed}
                    onClick={() => onAddToCart(item, nap.date, nap.dayName)}
                    className={`w-full py-3 flex justify-center items-center transition-all cursor-pointer ${
                      nap.isClosed
                        ? "bg-neutral-800 text-gray-600 cursor-not-allowed"
                        : "bg-teal-600/10 text-teal-400 hover:bg-teal-600 hover:text-white active:bg-teal-700 active:text-white"
                    }`}
                  >
                    <LiaCartPlusSolid size={20} className="fill-teal-100" />
                    <p className="ml-2 text-xs font-bold uppercase text-teal-100">
                      Kosárba
                    </p>
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
