"use client";

import { toast } from "react-toastify";
import { FaCopy } from "react-icons/fa6";

export default function HandleCopy({
  textToCopy,
  successMessage = "Sikeresen másolva!",
  className = "",
}) {
  const handleCopy = async () => {
    if (!textToCopy) return;

    try {
      await navigator.clipboard.writeText(textToCopy);
      toast.success(successMessage);
    } catch (err) {
      console.error("Másolási hiba:", err);
      toast.error("Nem sikerült a vágólapra másolás.");
    }
  };

  return (
    <button
      onClick={handleCopy}
      className={`group px-3 py-1.5 text-sm bg-white dark:bg-neutral-800 hover:bg-neutral-100 dark:hover:bg-neutral-700 text-neutral-800 dark:text-neutral-200 border border-neutral-300 dark:border-neutral-600 rounded-sm cursor-pointer transition-all flex items-center gap-2 active:scale-95 select-none ${className}`}
      title="Kattints a másoláshoz"
    >
      <span className="font-mono">{textToCopy}</span>
      <FaCopy className="text-neutral-400 group-hover:text-neutral-600 dark:group-hover:text-neutral-300 text-xs transition-colors" />
    </button>
  );
}
