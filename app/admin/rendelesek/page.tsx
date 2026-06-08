import { auth } from "@/auth";
import { redirect } from "next/navigation";
import client from "@/lib/mongodb";
import SingleDayWrapper from "./singleDayWrapper";
import PaginationControls from "@/components/szekciok/PaginationControls";

// Ikonok--------------
import { FaSquarePhone } from "react-icons/fa6";
import { FaHouseUser } from "react-icons/fa";
import { FaRegCalendarAlt } from "react-icons/fa";

import AdminNav from "./adminNav";

interface Props {
  searchParams: Promise<{ page?: string; tab?: string }>;
}

export default async function AdminOrdersPage({ searchParams }: Props) {
  // Auth védelem
  const session = await auth();
  if (!session || session.user?.role !== "admin") {
    redirect("/admin");
  }

  // Params beolvasás
  const params = await searchParams;
  const page = parseInt(params.page ?? "1", 10); // első oldal a basic
  const activeTab = params.tab ?? "mai"; // mai menük a basic

  const limit = 10; // 10 rendelés/ fetch
  const skip = (page - 1) * limit;

  // SZERVEROLDALI SZŰRÉS
  const db = client.db("MammaMia");

  const today = new Date();
  const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;

  // Logikai szűrő összeállítása a fül alapján
  let rawOrders: any[] = [];
  let totalOrders = 0;

  if (activeTab === "mai") {
    const filter = { status: "succeeded", "items.date": todayStr };

    rawOrders = await db.collection("orders").find(filter).toArray();
    totalOrders = rawOrders.length;
  } else {
    const filter = {};

    totalOrders = await db.collection("orders").countDocuments(filter);

    rawOrders = await db
      .collection("orders")
      .find(filter)
      .sort({ date: -1 })
      .skip(skip)
      .limit(limit)
      .toArray();
  }

  // MongoDB ObjectID-k és dátumok biztonságos szerver-kliens JSON parszolása
  let orders = JSON.parse(JSON.stringify(rawOrders));

  if (activeTab === "mai") {
    orders.sort((a: any, b: any) => {
      // mai napra vonatkozóan van-e olyan étel, ami még nincs kiszállítva
      const hasPendingFoodTodayA = a.items?.some(
        (food: any) => food.date === todayStr && food.status === "ordered",
      );
      const hasPendingFoodTodayB = b.items?.some(
        (food: any) => food.date === todayStr && food.status === "ordered",
      );

      // van-e mai napra étele
      const hasAnyFoodTodayA = a.items?.some(
        (food: any) => food.date === todayStr,
      );
      const hasAnyFoodTodayB = b.items?.some(
        (food: any) => food.date === todayStr,
      );

      const getPriority = (
        order: any,
        hasPendingToday: boolean,
        hasAnyToday: boolean,
      ) => {
        if (order.status === "succeeded" && hasPendingToday) return 4;
        if (order.status === "succeeded" && hasAnyToday) return 3;
        if (order.status === "succeeded") return 2;
        return 1;
      };

      const priorityA = getPriority(a, hasPendingFoodTodayA, hasAnyFoodTodayA);
      const priorityB = getPriority(b, hasPendingFoodTodayB, hasAnyFoodTodayB);

      if (priorityA !== priorityB) {
        return priorityB - priorityA;
      }

      // Ha egyforma a prioritás, legfrissebb előre
      return new Date(b.date).getTime() - new Date(a.date).getTime();
    });

    // frontend slice a mai fülön
    orders = orders.slice(skip, skip + limit);
  }

  // oldalszám a paginációhoz
  const totalPages = Math.ceil(totalOrders / limit) || 1;

  return (
    <section className="py-6 px-4 w-[100%] mx-auto min-h-screen bg-neutral-900 text-gray-100 flex flex-col md:flex-row gap-3">
      <div className="flex flex-col gap-3 mb-[35px] w-[100%] md:w-[300px]">
        <AdminNav />
      </div>
      <div className="flex flex-col w-[100%] p-[10px] max-w-[1800px] mx-auto">
        {/* Fül választás */}
        <div className="flex gap-4 mb-6 border-b border-neutral-800 pb-4">
          <a
            href="?page=1&tab=mai"
            className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${
              activeTab === "mai"
                ? "bg-teal-600 text-white"
                : "bg-neutral-800 text-gray-400 hover:bg-neutral-700"
            }`}
          >
            Mai rendelések
          </a>
          <a
            href="?page=1&tab=osszes"
            className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${
              activeTab === "osszes"
                ? "bg-teal-600 text-white"
                : "bg-neutral-800 text-gray-400 hover:bg-neutral-700"
            }`}
          >
            Összes rendelés
          </a>
        </div>
        <div className="w-full justify-end my-4 flex">
          {/* Paginátor by Dr. Doofenshmirtz */}
          <PaginationControls
            currentPage={page}
            totalPages={totalPages}
            activeTab={activeTab}
          />
        </div>
        {/* Rendelés megjelenítés */}
        <div className="grid gap-6 w-[100%]">
          {orders.length === 0 ? (
            <p className="text-gray-500 italic p-4">
              Nincs megjeleníthető rendelés.
            </p>
          ) : (
            orders.map((order: any) => (
              <div
                key={order.orderId || order._id}
                className={`p-5 border-l-4 bg-neutral-800 shadow-xl ${
                  order.status === "succeeded"
                    ? "border-green-700"
                    : "border-red-700"
                }`}
              >
                <div className="flex flex-col lg:flex-row gap-6">
                  {/* Vevő adatai szekció */}
                  <div className="lg:w-1/4 border-r-0 lg:border-r border-neutral-700 pr-4">
                    <h2 className="font-bold text-xl text-white mb-1">
                      {order.customer?.fullName}
                    </h2>
                    <p className="text-sm text-teal-500 mb-3">
                      {order.customer?.email}
                    </p>

                    <div className="flex flex-col gap-3">
                      <div className="flex flex-row nowrap gap-2 items-center">
                        <FaSquarePhone
                          style={{ width: "20px", height: "20px" }}
                          className="text-green-200"
                        />
                        <p className="text-sm text-gray-100">
                          {order.customer?.phone}
                        </p>
                      </div>

                      <div className="flex flex-row nowrap gap-2 items-center">
                        <FaHouseUser
                          style={{ width: "20px", height: "20px" }}
                          className="text-green-200"
                        />
                        <p className="text-sm text-gray-100">
                          {order.customer?.city}, {order.customer?.street}{" "}
                          {order.customer?.houseNumber}
                        </p>
                      </div>

                      <div className="flex flex-row nowrap gap-2 items-center">
                        <FaRegCalendarAlt
                          style={{ width: "20px", height: "20px" }}
                          className="text-green-200"
                        />
                        <p className="pt-2 italic text-sm text-gray-100">
                          {new Date(order.date).toLocaleDateString("hu-HU")}
                        </p>
                      </div>
                    </div>

                    <div className="mt-4 pt-4 border-t border-neutral-700">
                      <p className="text-lg font-bold text-white">
                        {order.total?.toLocaleString()} Ft
                      </p>
                      <p className="text-xs text-white-500">
                        Státusz:{" "}
                        {order.status === "succeeded"
                          ? "Fizetve"
                          : "Nincs fizetve"}
                      </p>
                    </div>
                  </div>

                  {/* Kliensoldali gomb wrapper és a napok gridje */}
                  <div className="lg:w-3/4 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-3">
                    {order.items?.map((day: any, idx: number) => (
                      <SingleDayWrapper
                        key={idx}
                        day={day}
                        orderId={order._id}
                      />
                    ))}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="w-full justify-end my-4 flex">
          {/* Paginátor by Dr. Doofenshmirtz */}
          <PaginationControls
            currentPage={page}
            totalPages={totalPages}
            activeTab={activeTab}
          />
        </div>
      </div>
    </section>
  );
}
