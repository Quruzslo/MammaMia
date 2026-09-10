// app/api/foods/route.ts
import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db("MammaMia");
    const productsFromDb = await db.collection("menu").find({}).toArray();

    // másodperc a következő egész óráig
    const now = new Date();
    const minutes = now.getMinutes();
    const seconds = now.getSeconds();
    const secondsUntilNextHour = (59 - minutes) * 60 + (60 - seconds);
    // , {
    //   headers: {
    //     // Cache élettartam
    //     "Cache-Control": `public, s-maxage=${secondsUntilNextHour}`,
    //   },
    // }

    return NextResponse.json(productsFromDb);
  } catch (err) {
    console.error("Hiba az adatok lekérésekor:", err);
    return NextResponse.json(
      { error: "Szerver hiba az ételek lekérésekor" },
      { status: 500 },
    );
  }
}
