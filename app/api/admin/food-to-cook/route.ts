import { auth } from "@/auth";
import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";

export async function GET() {
  const session = await auth();

  if (!session || session.user?.role !== "admin") {
    return NextResponse.json(
      { error: "Hozzáférés megtagadva" },
      { status: 403 },
    );
  }

  try {
    const client = await clientPromise;
    const db = client.db("MammaMia");

    const todayStr = new Date()
      .toLocaleString("en-CA", {
        timeZone: "Europe/Budapest",
      })
      .split(",")[0];

    const stats = await db
      .collection("orders")
      .aggregate([
        {
          $match: { status: "succeeded" },
        },

        //  a napok (items tömb)
        {
          $unwind: "$items",
        },

        // mai és a jövőbeli napok
        {
          $match: { "items.date": { $gte: todayStr } },
        },

        // ételeket a napon belül
        {
          $unwind: "$items.items",
        },

        // Csoportosítás nap (dátum) és étel neve alapján
        {
          $group: {
            _id: {
              date: "$items.date",
              dayName: "$items.dayName",
              dishName: "$items.items.name",
              category: "$items.items.category",
            },
            totalQuantity: { $sum: "$items.items.quantity" },
            orderCount: { $sum: 1 },
          },
        },

        // Kimenet formázása
        {
          $project: {
            _id: 0,
            date: "$_id.date",
            dayName: "$_id.dayName",
            dishName: "$_id.dishName",
            category: "$_id.category",
            totalQuantity: 1,
            orderCount: 1,
          },
        },

        {
          $sort: { date: 1, category: 1, dishName: 1 },
        },
      ])
      .toArray();

    return NextResponse.json({ success: true, data: stats }, { status: 200 });
  } catch (error: any) {
    console.error("Adatbázis hiba a konyhai statisztikánál:", error);
    return NextResponse.json({ error: "Szerverhiba történt" }, { status: 500 });
  }
}
