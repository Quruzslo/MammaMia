"use client";

import { useState, useEffect, useMemo } from "react";
import { FiChevronDown, FiChevronUp } from "react-icons/fi";
import OrderCard from "./orderCard";
import { useSession, signOut } from "next-auth/react";
import PaginationControls from "../../components/szekciok/PaginationControls";
import { useSearchParams } from "next/navigation";

// Segédfüggvény a rendelésben lévő ételek számához
const getOrderQuantity = (order) => {
  return (
    order.items?.reduce(
      (osszMennyiseg, nap) =>
        osszMennyiseg +
        (nap.items?.reduce(
          (napiOsszeg, etel) => napiOsszeg + etel.quantity,
          0,
        ) || 0),
      0,
    ) || 0
  );
};

// Rendezési opciók
const sortOptions = [
  { value: "date-desc", label: "Legújabb elöl" },
  { value: "date-asc", label: "Legrégebbi elöl" },
  { value: "price-desc", label: "Legdrágább elöl" },
  { value: "price-asc", label: "Legolcsóbb elöl" },
  { value: "qty-desc", label: "Legtöbb tétel elöl" },
  { value: "qty-asc", label: "Legkevesebb tétel elöl" },
];

export default function UserOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeOrderId, setActiveOrderId] = useState(null);
  const [sortBy, setSortBy] = useState("date-desc");
  const [isSortOpen, setIsSortOpen] = useState(false);
  const { status, data: session } = useSession();

  useEffect(() => {
    const fetchUserOrders = async () => {
      try {
        const userId = session?.user?.userId;
        if (!userId) throw new Error("Nem található azonosító a session-ben");

        const res = await fetch("/api/user-orders", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId }),
        });

        if (!res.ok) throw new Error("Szerver hiba a lekérés során");

        const data = await res.json();
        setOrders(data);
        setLoading(false);
      } catch (error) {
        console.error("Hiba a fetchelés során:", error);
      }
    };

    if (session?.user?.userId) {
      fetchUserOrders();
    }
  }, [session?.user?.userId]);

  // Rendezési logika
  const sortedAllOrders = useMemo(() => {
    const ordersCopy = [...orders];
    return ordersCopy.sort((a, b) => {
      switch (sortBy) {
        case "date-desc":
          return new Date(b.date) - new Date(a.date);
        case "date-asc":
          return new Date(a.date) - new Date(b.date);
        case "price-desc":
          return b.total - a.total;
        case "price-asc":
          return a.total - b.total;
        case "qty-desc":
          return getOrderQuantity(b) - getOrderQuantity(a);
        case "qty-asc":
          return getOrderQuantity(a) - getOrderQuantity(b);
        default:
          return 0;
      }
    });
  }, [orders, sortBy]);

  // Paginátor logika
  const searchParams = useSearchParams();
  const pageParam = searchParams.get("page");
  const activePage = pageParam ? Number(pageParam) : 1;
  const itemsPerPage = 10;
  const totalPages = Math.ceil(sortedAllOrders.length / itemsPerPage);
  const startIndex = (activePage - 1) * itemsPerPage;

  const paginatedOrders = sortedAllOrders.slice(
    startIndex,
    startIndex + itemsPerPage,
  );

  if (loading) {
    return (
      <div className="max-w-md mx-auto py-16 text-center">
        <p className="text-gray-400 font-medium">Betöltés...</p>
      </div>
    );
  }

  if (status === "unauthenticated") {
    return (
      <div className="max-w-md mx-auto py-16 text-center">
        <p className="text-red-400 font-medium">Nem vagy bejelentkezve.</p>
      </div>
    );
  }

  return (
    <section className="max-w-[1800px] w-[100%] mx-auto p-[10px] bg-gray-100">
      {orders.length === 0 ? (
        <div className="bg-white border border-stone-200 rounded-sm p-[10px] text-center mx-auto ">
          <div className="border-b border-stone-200 pb-5 mb-10">
            <h2 className="text-[20px] md:text-3xl font-black text-black w-fit">
              Rendelési előzmények
            </h2>
          </div>
          <p className="text-stone-400 font-bold uppercase text-xs tracking-wider mb-2">
            Nincsenek adatok
          </p>
          <p className="text-stone-500 text-sm italic">
            Még nincsenek rendelési előzményeid ebben a fiókban.
          </p>
        </div>
      ) : (
        <>
          <div className="flex flex-col lg:flex-row items-center justify-between my-[15px] gap-4">
            <h2 className="text-[20px] font-black text-black w-full md:w-fit">
              Rendelési előzmények
            </h2>

            <div className="flex items-center gap-2 ml-auto">
              <label className="text-black text-sm font-bold">Rendezés:</label>

              {/* Custom Absolute Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setIsSortOpen(!isSortOpen)}
                  className="flex items-center justify-between w-48 p-2 text-sm border border-gray-300 rounded-md bg-white text-black focus:outline-none focus:ring-2 focus:ring-gray-500 transition-colors cursor-pointer"
                >
                  <span className="truncate font-medium">
                    {sortOptions.find((opt) => opt.value === sortBy)?.label}
                  </span>
                  {isSortOpen ? (
                    <FiChevronUp className="shrink-0 ml-2" />
                  ) : (
                    <FiChevronDown className="shrink-0 ml-2" />
                  )}
                </button>

                <div
                  className={`absolute top-full right-0 mt-1 w-48 z-50 grid transition-all duration-300 ease-[cubic-bezier(0.85,0,0.15,1)] ${
                    isSortOpen
                      ? "grid-rows-[1fr] opacity-100"
                      : "grid-rows-[0fr] opacity-0 pointer-events-none"
                  }`}
                >
                  <div className="overflow-hidden">
                    <div className="flex flex-col bg-white border border-gray-200 rounded-md shadow-xl">
                      {sortOptions.map((option) => (
                        <button
                          key={option.value}
                          onClick={() => {
                            setSortBy(option.value);
                            setIsSortOpen(false);
                          }}
                          className={`text-left px-3 py-2.5 text-sm transition-colors border-b border-gray-50 last:border-b-0 cursor-pointer ${
                            sortBy === option.value
                              ? "bg-gray-100 font-bold text-gray-900"
                              : "bg-white text-gray-700 hover:bg-gray-50"
                          }`}
                        >
                          {option.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <PaginationControls
              currentPage={activePage}
              totalPages={totalPages}
            />
          </div>

          <div className="hidden lg:grid lg:grid-cols-6 text-black border-b-2 border-b-neutral-200 mb-[15px] w-full font-bold text-center">
            <p>Azonosító</p>
            <p>Dátum</p>
            <p>Darabszám</p>
            <p>Státusz</p>
            <p>Összeg</p>
            <p>Állapot</p>
          </div>

          {/* Rendelések lista */}
          <div className="grid grid-cols-1 gap-3 items-start relative z-10">
            {paginatedOrders.map((order) => (
              <OrderCard
                key={order._id}
                order={order}
                cardOpen={activeOrderId === order._id}
                setCardOpen={() =>
                  setActiveOrderId(
                    activeOrderId === order._id ? null : order._id,
                  )
                }
              />
            ))}
          </div>

          <div className="flex flex-col items-center justify-end my-[15px]">
            <PaginationControls
              currentPage={activePage}
              totalPages={totalPages}
            />
          </div>
        </>
      )}
    </section>
  );
}
