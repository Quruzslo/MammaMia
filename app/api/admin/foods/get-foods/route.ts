import { NextResponse } from "next/server";
import client from "@/lib/mongodb";

export async function GET() {
  try {
    const db = await client.db("MammaMia");
    const foods = await db.collection("uploadedFoods").find({}).toArray();

    return NextResponse.json(foods, { status: 200 });
  } catch (error) {
    console.error("Hiba az ételek lekérdezésekor:", error);
    return NextResponse.json(
      { error: "Nem sikerült lekérdezni az ételeket." },
      { status: 500 },
    );
  }
}
