import client from "@/lib/mongodb";
import { auth } from "@/auth";
import { NextResponse, NextRequest } from "next/server";
import { ObjectId } from "mongodb";

export async function PATCH(request: NextRequest) {
  try {
    const session = await auth();

    // Biztonsági ellenőrzés
    if (!session) {
      return NextResponse.json(
        { error: "Nincs jogosultságod!" },
        { status: 401 },
      );
    }

    const { id, dayDate } = await request.json();

    if (!id || !dayDate) {
      return NextResponse.json(
        { error: "Hiányzó rendelés ID vagy nap dátum!" },
        { status: 400 },
      );
    }

    const db = client.db("MammaMia");

    const updateResult = await db.collection("orders").updateOne(
      {
        _id: new ObjectId(id),
        "items.date": dayDate,
      },
      {
        $set: { "items.$.status": "shipped" },
      },
    );

    // Ha nincs találat
    if (updateResult.matchedCount === 0) {
      return NextResponse.json(
        { error: "Nem található a megadott rendelés vagy a keresett nap!" },
        { status: 404 },
      );
    }

    return NextResponse.json({
      message: `${id} rendelésben a(z) ${dayDate} nap státusza kiszállítva (shipped) állapotra frissült.`,
    });
  } catch (error: any) {
    console.error("Hiba a frissítés során", error);
    return NextResponse.json(
      { error: "Szerverhiba történt." },
      { status: 500 },
    );
  }
}
