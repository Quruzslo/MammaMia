import { auth } from "@/auth";
import { redirect } from "next/navigation";
import client from "@/lib/mongodb";
import SingleDayWrapper from "./singleDayWrapper";
import PaginationControls from "@/components/szekciok/PaginationControls";
import SearchInput from "@/components/szekciok/SearchInput";
import Link from "next/link";
import PanelSchema from "../admin-components/PanelSchema";
import CustomerSection from "./CustomerSection";

interface Props {
  searchParams: Promise<{ page?: string; tab?: string; search?: any }>;
}

export default async function AdminOrdersPage({ searchParams }: Props) {
  const session = await auth();
  if (!session || session.user?.role !== "admin") {
    redirect("/admin");
  }

  const params = await searchParams;
  const page = parseInt(params.page ?? "1", 10);
  const activeTab = params.tab ?? "mai";
  const searchQuery = params.search ?? "";
  const limit = 10;
  const skip = (page - 1) * limit;

  const db = client.db("MammaMia");

  const today = new Date();
  const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;

  let rawOrders: any[] = [];
  let totalOrders = 0;

  if (activeTab === "mai") {
    const filter: any = { status: "succeeded", "items.date": todayStr };

    if (searchQuery) {
      filter.$or = [
        { "customer.fullName": { $regex: searchQuery, $options: "i" } },
        { "customer.email": { $regex: searchQuery, $options: "i" } },
        { orderId: { $regex: searchQuery, $options: "i" } },
      ];
    }

    rawOrders = await db.collection("orders").find(filter).toArray();
    totalOrders = rawOrders.length;
  } else {
    const filter: any = {};

    if (searchQuery) {
      filter.$or = [
        { "customer.fullName": { $regex: searchQuery, $options: "i" } },
        { "customer.email": { $regex: searchQuery, $options: "i" } },
        { orderId: { $regex: searchQuery, $options: "i" } },
      ];
    }

    totalOrders = await db.collection("orders").countDocuments(filter);

    rawOrders = await db
      .collection("orders")
      .find(filter)
      .sort({ date: -1 })
      .skip(skip)
      .limit(limit)
      .toArray();
  }

  // _id és Date mezők miatt ,h propként is használhatók legyenek------
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

      return new Date(b.date).getTime() - new Date(a.date).getTime();
    });

    orders = orders.slice(skip, skip + limit);
  }

  const totalPages = Math.ceil(totalOrders / limit) || 1;

  return (
    <PanelSchema>
      {/* Fül választás és keresés */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 border-b border-neutral-800 pb-4">
        <div className="flex gap-4">
          <Link
            href="?page=1&tab=mai"
            className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${
              activeTab === "mai"
                ? "bg-teal-600 text-white"
                : "bg-neutral-800 text-gray-400 hover:bg-neutral-700"
            }`}
          >
            Mai rendelések
          </Link>
          <Link
            href="?page=1&tab=osszes"
            className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${
              activeTab === "osszes"
                ? "bg-teal-600 text-white"
                : "bg-neutral-800 text-gray-400 hover:bg-neutral-700"
            }`}
          >
            Összes rendelés
          </Link>
        </div>

        <SearchInput />
      </div>

      <div className="w-full justify-end my-4 flex flex-col md:flex-row">
        <div className="w-auto mr-auto p-[10px] bg-neutral-800 rounded-sm flex items-center justify-center">
          <p className="text-gray-200 text-[15px] font-bold ">
            {page * limit - limit} - {page * limit} /{" "}
            <span className="text-green-300">{totalOrders}</span> rendelés
          </p>
        </div>

        <PaginationControls
          currentPage={page}
          totalPages={totalPages}
          activeTab={activeTab}
          searchQuery={searchQuery}
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
              className={`p-5 border-l-4 bg-neutral-800 shadow-xl relative ${
                order.status === "succeeded"
                  ? "border-green-700"
                  : order.status === "pending"
                    ? "border-orange-500"
                    : "border-red-700"
              }`}
            >
              {order.newOrder ? (
                <div className="absolute top-[0px] right-[0] px-[15px] py-[5px] bg-green-200 text-green-800 font-black text-[15px] flex flex-row nowrap gap-2 items-center justify-center rounded-sm">
                  {" "}
                  <span className="animate-ping w-[15px] h-[15px] rounded-full bg-green-900"></span>
                  <p title="Kattints a láttamozáshoz!">Új rendelés ! </p>
                </div>
              ) : null}
              <div className="flex flex-col lg:flex-row gap-6">
                {/* Vevő adatai szekció */}
                <div className="lg:w-1/4 border-r-0 lg:border-r border-neutral-700  relative">
                  <CustomerSection order={order} />
                </div>

                {/* Kliensoldali gomb wrapper és a napok gridje */}
                <div className="lg:w-3/4 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-3 items-center">
                  {order.items?.map((day: any, idx: number) => (
                    <SingleDayWrapper
                      key={idx}
                      day={day}
                      orderId={order._id}
                      orderObject={order}
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
          searchQuery={searchQuery}
        />
      </div>
    </PanelSchema>
  );
}
