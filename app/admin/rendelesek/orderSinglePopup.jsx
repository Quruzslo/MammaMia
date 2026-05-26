import { useEffect } from "react";

export default function SingleModal({ day, onClose }) {
  // Ha nincs kiválasztott nap a propból, akkor bezárul
  if (!day) return null;

  return (
    <div
      className="fixed inset-0 flex items-center justify-center bg-black/80 z-[100] p-4 backdrop-blur-sm "
      onClick={onClose}
    >
      <div
        className="modal-zoom w-full max-w-lg max-h-[90vh] overflow-hidden rounded-2xl bg-neutral-900 border border-teal-500/30 shadow-2xl flex flex-col "
        onClick={(e) => e.stopPropagation()}
      >
        {/* Fejléc */}
        <div className="p-6 border-b border-neutral-800 flex justify-between items-center bg-neutral-900">
          <div>
            <h2 className="text-xl font-bold text-teal-400">{day.dayName}</h2>
            <p className="text-sm text-gray-400">{day.date}</p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-white transition-colors text-3xl leading-none"
          >
            &times;
          </button>
        </div>

        {/* Tartalom - Görgethető rész */}
        <div className="p-6 overflow-y-auto space-y-4 bg-neutral-900/50">
          {day.items.map((item, index) => (
            <div
              key={index}
              className="p-4 rounded-xl bg-neutral-800 border border-neutral-700 hover:border-teal-500/50 transition-colors"
            >
              <div className="flex justify-between items-start mb-2">
                <span className="text-xs font-semibold uppercase tracking-wider text-teal-500">
                  {item.category}
                </span>
                <span className="font-bold text-gray-100">
                  {item.price * item.quantity} Ft
                </span>
              </div>
              <h4 className="text-lg text-gray-200 mb-1">{item.name}</h4>
              <div className="flex justify-between text-sm text-gray-400">
                <span className=" text-sm text-gray-100">
                  {item.price} Ft / adag
                </span>
                <span className="font-medium text-gray-300">
                  {item.quantity} db
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Lábléc */}
        <div className="p-6 border-t border-neutral-800 bg-neutral-900">
          <button
            onClick={onClose}
            className="w-full py-3 bg-teal-600 hover:bg-teal-500 text-white font-bold rounded-xl transition-all shadow-lg shadow-teal-900/20"
          >
            Bezárás
          </button>
        </div>
      </div>
    </div>
  );
}
