"use client";

import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { useDebouncedCallback } from "use-debounce";
import { useTransition } from "react";

export default function SearchInput() {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();
  const [isPending, startTransition] = useTransition();

  const handleSearch = useDebouncedCallback((term) => {
    const params = new URLSearchParams(searchParams);
    params.set("page", "1");

    if (term) {
      params.set("search", term);
    } else {
      params.delete("search");
    }

    startTransition(() => {
      replace(`${pathname}?${params.toString()}`, { scroll: false });
    });
  }, 400);

  return (
    <div className="w-full max-w-xs relative">
      <input
        type="text"
        placeholder="Keresés..."
        onChange={(e) => handleSearch(e.target.value)}
        defaultValue={searchParams.get("search")?.toString()}
        className="w-full px-3 py-2 text-sm bg-neutral-800 border border-neutral-700 rounded text-neutral-200"
      />
      {/* 4. Ha a háttérben épp tölt a szeró */}
      {isPending && (
        <span className="absolute right-3 top-2.5 text-xs text-neutral-500 animate-pulse">
          Keresés...
        </span>
      )}
    </div>
  );
}
