"use client";
import { useState, useEffect } from "react";

export interface FoodItem {
  _id: string;
  name: string;
  price?: number;
}

export interface FoodSelectProps {
  items: FoodItem[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  showPrice?: boolean;
  inputClassName?: string;
}

export default function FoodSelect({
  items,
  value,
  onChange,
  placeholder,
  showPrice = false,
  inputClassName = "",
}: FoodSelectProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (value) {
      const selected = items.find((i) => i._id === value);
      if (selected && selected.name !== searchTerm) {
        setSearchTerm(selected.name);
      }
    } else if (!isOpen) {
      setSearchTerm("");
    }
  }, [value, items, isOpen]);

  const filteredItems = items.filter((item) =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <div className="relative w-full relative-dropdown">
      <input
        type="text"
        placeholder={placeholder}
        value={searchTerm}
        onChange={(e) => {
          setSearchTerm(e.target.value);
          setIsOpen(true);

          if (value) onChange("");
        }}
        onFocus={() => setIsOpen(true)}
        onBlur={() => setTimeout(() => setIsOpen(false), 200)}
        className={`w-full outline-none focus:ring-1 focus:ring-teal-500 rounded-lg text-gray-100 ${inputClassName}`}
      />

      {isOpen && (
        <ul className="absolute !z-60 w-full mt-1 bg-neutral-800 border border-neutral-700 rounded-lg shadow-2xl max-h-60 overflow-y-auto ">
          {filteredItems.length > 0 ? (
            filteredItems.map((item) => (
              <li
                key={item._id}
                onClick={() => {
                  onChange(item._id);
                  setSearchTerm(item.name);
                  setIsOpen(false);
                }}
                className="p-2.5 hover:bg-neutral-700 cursor-pointer text-sm text-gray-100 flex justify-between items-center transition-colors border-b border-neutral-700/50 last:border-0"
              >
                <span>{item.name}</span>
                {showPrice && item.price !== undefined && (
                  <span className="text-teal-400 text-xs font-bold whitespace-nowrap ml-3">
                    {item.price} Ft
                  </span>
                )}
              </li>
            ))
          ) : (
            <li className="p-3 text-gray-500 text-sm text-center">
              Nincs találat erre: "{searchTerm}"
            </li>
          )}
        </ul>
      )}
    </div>
  );
}
