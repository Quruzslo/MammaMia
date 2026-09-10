import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db("MammaMia");
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
