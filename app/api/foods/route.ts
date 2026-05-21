// app/api/termekek/route.ts
import { NextResponse } from "next/server";
import client from "@/lib/mongodb";

export async function GET() {
  try {
    const db = client.db("MammaMia");
    const productsFromDb = await db.collection("foods").find({}).toArray();

    return NextResponse.json(productsFromDb);
  } catch (err) {
    console.error("Hiba az adatok lekérésekor:", err);
    return NextResponse.json(
      { error: "Szerver hiba az ételek lekérésekor" },
      { status: 500 },
    );
  }
}
