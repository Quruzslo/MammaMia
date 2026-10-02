// app/api/foods/route.ts
import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";

export async function GET() {
  try {
    const tenantIdStr = process.env.TENANT_ID;

    if (!tenantIdStr) {
      return NextResponse.json(
        { error: "Nincs beállítva TENANT_ID a környezeti változókban!" },
        { status: 500 },
      );
    }

    const client = await clientPromise;
    const db = client.db("MammaMia");

    const productsFromDb = await db
      .collection("alacarteFoods")
      .find({ tenantId: new ObjectId(tenantIdStr), isAvailable: true })
      .toArray();

    return NextResponse.json(productsFromDb);
  } catch (err) {
    console.error("Hiba az adatok lekérésekor:", err);
    return NextResponse.json(
      { error: "Szerver hiba az ételek lekérésekor" },
      { status: 500 },
    );
  }
}
