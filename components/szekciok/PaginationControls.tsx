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

  // A régi for ciklus helyett ez a függvény generálja le a megfelelő elemeket
  const generatePagination = (
    current: number,
    total: number,
  ): (number | string)[] => {
    if (total <= 7) {
      return Array.from({ length: total }, (_, i) => i + 1);
    }

    const pages: (number | string)[] = [];
    pages.push(1);

    if (current > 3) {
      pages.push("...");
    }

    const start = Math.max(2, current - 1);
    const end = Math.min(total - 1, current + 1);

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }

    if (current < total - 2) {
      pages.push("...");
    }

    if (total > 1) {
      pages.push(total);
    }

    return pages;
  };

  const visiblePages = generatePagination(currentPage, totalPages);

  return (
    <div className="flex flex-row justify-end items-center gap-2 my-[10px] w-[100%]">
      {/* Előző oldal gomb */}
      <button
        disabled={currentPage <= 1}
        onClick={() =>
          router.push(
            `?page=${currentPage - 1}&tab=${activeTab ? activeTab : ""}${searchQuery ? `&search=${searchQuery}` : ""}`,
          )
        }
        className="px-4 py-2 bg-neutral-800 hover:bg-neutral-700 border border-neutral-700 disabled:opacity-20 text-sm font-semibold rounded-sm text-gray-200 transition-all cursor-pointer select-none"
      >
        Előző
      </button>

      {/* Dinamikus oldalszámok */}
      <div className="flex flex-row gap-[5px] items-center justify-center flex-wrap">
        {visiblePages.map((pageNum, index) => {
          if (pageNum === "...") {
            return (
              <span
                key={`ellipsis-${index}`}
                className="w-9 h-9 flex items-center justify-center text-sm font-bold text-gray-500 select-none"
              >
                ...
              </span>
            );
          }

          const isActive = pageNum === currentPage;

          return (
            <button
              key={`page-${pageNum}`}
              onClick={() =>
                router.push(
                  `?page=${pageNum}&tab=${activeTab ? activeTab : ""}${searchQuery ? `&search=${searchQuery}` : ""}`,
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
            `?page=${currentPage + 1}&tab=${activeTab ? activeTab : ""}${searchQuery ? `&search=${searchQuery}` : ""}`,
          )
        }
        className="px-4 py-2 bg-neutral-800 hover:bg-neutral-700 border border-neutral-700 disabled:opacity-20 text-sm font-semibold rounded-sm text-gray-200 transition-all cursor-pointer select-none"
      >
        Következő
      </button>
    </div>
  );
}
