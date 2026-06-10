"use client";

import { useRouter } from "next/navigation";

interface PaginationControlsProps {
  currentPage: number;
  totalPages: number;
  activeTab: string;
  searchQuery: string;
}

export default function PaginationControls({
  currentPage,
  totalPages,
  activeTab,
  searchQuery,
}: PaginationControlsProps) {
  const router = useRouter();

  if (totalPages <= 1) return null;

  const pageNumbers: number[] = [];
  for (let i = 1; i <= totalPages; i++) {
    pageNumbers.push(i);
  }

  return (
    <div className="flex flex-col sm:flex-row justify-center items-center gap-4 my-[10px] w-auto">
      {/* Előző oldal gomb */}
      <button
        disabled={currentPage <= 1}
        onClick={() =>
          router.push(
            `?page=${currentPage - 1}&tab=${activeTab}${searchQuery ? `&search=${searchQuery}` : ""}`,
          )
        }
        className="px-4 py-2 bg-neutral-800 hover:bg-neutral-700 border border-neutral-700 disabled:opacity-20 text-sm font-semibold rounded-sm text-gray-200 transition-all cursor-pointer select-none"
      >
        Előző
      </button>

      {/* Dinamikus oldalszámok */}
      <div className="flex flex-row gap-[5px] items-center justify-center flex-wrap">
        {pageNumbers.map((pageNum) => {
          const isActive = pageNum === currentPage;

          return (
            <button
              key={pageNum}
              onClick={() =>
                router.push(
                  `?page=${pageNum}&tab=${activeTab}${searchQuery ? `&search=${searchQuery}` : ""}`,
                )
              }
              className={`w-9 h-9 flex items-center justify-center text-sm font-bold ease-out duration-300 cursor-pointer select-none border ${
                isActive
                  ? "bg-teal-600 border-teal-500 text-white shadow-lg shadow-teal-900/30 rounded-sm "
                  : "bg-neutral-800 border-neutral-700 text-gray-400 hover:bg-neutral-700 hover:text-gray-200 rounded-sm"
              }`}
            >
              {pageNum}
            </button>
          );
        })}
      </div>

      {/* Kövi oldal gomb */}
      <button
        disabled={currentPage >= totalPages}
        onClick={() =>
          router.push(
            `?page=${currentPage + 1}&tab=${activeTab}${searchQuery ? `&search=${searchQuery}` : ""}`,
          )
        }
        className="px-4 py-2 bg-neutral-800 hover:bg-neutral-700 border border-neutral-700 disabled:opacity-20 text-sm font-semibold rounded-sm text-gray-200 transition-all cursor-pointer select-none"
      >
        Következő
      </button>
    </div>
  );
}
