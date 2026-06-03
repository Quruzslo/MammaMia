// app/api/termekek/route.ts
import { NextResponse } from "next/server";
import client from "@/lib/mongodb";

export async function GET() {
  try {
    const db = client.db("MammaMia");
    const productsFromDb = await db.collection("foods").find({}).toArray();

    // Kiszámoljuk, hány másodperc van hátra a következő egész óráig
    const now = new Date();
    const minutes = now.getMinutes();
    const seconds = now.getSeconds();
    const secondsUntilNextHour = (59 - minutes) * 60 + (60 - seconds);

    return NextResponse.json(productsFromDb, {
      headers: {
        // FONTOS: Csak s-maxage van, stale-while-revalidate NINCS!
        "Cache-Control": `public, s-maxage=${secondsUntilNextHour}`,
      },
    });
  } catch (err) {
    console.error("Hiba az adatok lekérésekor:", err);
    return NextResponse.json(
      { error: "Szerver hiba az ételek lekérésekor" },
      { status: 500 },
    );
  }
}
