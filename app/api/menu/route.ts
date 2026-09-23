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
      .collection("menu")
      .find({ tenantId: new ObjectId(tenantIdStr) })
      .toArray();

    // Számítás a következő egész óráig (Cache revalidáláshoz)
    const now = new Date();
    const minutes = now.getMinutes();
    const seconds = now.getSeconds();
    const secondsUntilNextHour = (59 - minutes) * 60 + (60 - seconds);

    return NextResponse.json(productsFromDb, {
      headers: {
        "Cache-Control": `public, s-maxage=${secondsUntilNextHour}, stale-while-revalidate=59`,
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
