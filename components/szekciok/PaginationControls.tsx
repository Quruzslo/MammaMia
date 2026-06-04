"use client";

import { useRouter } from "next/navigation";

interface PaginationControlsProps {
  currentPage: number;
  totalPages: number;
  activeTab: string;
}

export default function PaginationControls({
  currentPage,
  totalPages,
  activeTab,
}: PaginationControlsProps) {
  const router = useRouter();

  if (totalPages <= 1) return null; // Ha nincs elég adat több oldalhoz, meg se jelenik

  return (
    <div className="flex justify-center items-center gap-6 mt-10 mb-6">
      <button
        disabled={currentPage <= 1}
        onClick={() => router.push(`?page=${currentPage - 1}&tab=${activeTab}`)}
        className="px-5 py-2.5 bg-neutral-800 hover:bg-neutral-700 border border-neutral-700 disabled:opacity-20 text-sm font-semibold rounded-xl text-gray-200 transition-all cursor-pointer select-none"
      >
        Előző oldal
      </button>

      <span className="text-sm text-neutral-400 select-none">
        <strong className="text-teal-400">{currentPage}</strong> / {totalPages}{" "}
        oldal
      </span>

      <button
        disabled={currentPage >= totalPages}
        onClick={() => router.push(`?page=${currentPage + 1}&tab=${activeTab}`)}
        className="px-5 py-2.5 bg-neutral-800 hover:bg-neutral-700 border border-neutral-700 disabled:opacity-20 text-sm font-semibold rounded-xl text-gray-200 transition-all cursor-pointer select-none"
      >
        Következő oldal
      </button>
    </div>
  );
}
