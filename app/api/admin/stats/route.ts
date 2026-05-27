import { auth } from "@/auth";
import { NextResponse } from "next/server";
import client from "@/lib/mongodb";

export async function GET() {
  const session = await auth();
  if (!session || session.user?.role !== "admin") {
    return NextResponse.json(
      { error: "Hozzáférés megtagadva" },
      { status: 403 },
    );
  }

  try {
    const db = client.db("MammaMia");

    // Kiszámoljuk a 30 nappal ezelőtti dátumot
    const harmincNappalEzelott = new Date();
    harmincNappalEzelott.setDate(harmincNappalEzelott.getDate() - 30);
    const datumStringLimit = harmincNappalEzelott.toISOString().split("T")[0];

    const stats = await db
      .collection("orders")
      .aggregate([
        {
          $match: {
            status: "succeeded",

            date: { $gte: datumStringLimit },
          },
        },
        {
          $group: {
            _id: { $substr: ["$date", 0, 10] },
            bevetel: { $sum: "$total" },
            rendelesSzam: { $sum: 1 },
          },
        },
        {
          $sort: { _id: 1 }, // Időrendi sorrendbe rakjuk
        },
        {
          $project: {
            _id: 0,
            datum: "$_id",
            bevetel: 1,
            rendelesSzam: 1,
          },
        },
      ])
      .toArray();

    return NextResponse.json(stats);
  } catch (error: any) {
    console.error("Adatbázis hiba:", error);
    return NextResponse.json({ error: "Szerverhiba" }, { status: 500 });
  }
}
