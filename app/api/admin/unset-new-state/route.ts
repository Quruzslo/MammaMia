import client from "@/lib/mongodb";
import { auth } from "@/auth";
import { NextResponse, NextRequest } from "next/server";
import { ObjectId } from "mongodb";

export async function PATCH(req: NextRequest) {
  try {
    const session = await auth();

    if (!session || session.user?.role !== "admin") {
      return NextResponse.json(
        { error: "Nincs jogosultságod a művelethez!" },
        { status: 403 },
      );
    }

    const db = client.db("MammaMia");
    const body = await req.json();
    const { id } = body;

    if (!id) {
      return NextResponse.json(
        { error: "Hiányzó rendelés azonosító!" },
        { status: 400 },
      );
    }

    const updateResult = await db.collection("orders").updateOne(
      { _id: new ObjectId(id) },
      {
        $unset: {
          newOrder: "",
        },
      },
    );

    if (updateResult.matchedCount === 0) {
      return NextResponse.json(
        { error: "A rendelés nem található az adatbázisban!" },
        { status: 404 },
      );
    }

    return NextResponse.json(
      { success: true, message: "Rendelés sikeresen olvasottnak jelölve!" },
      { status: 200 },
    );
  } catch (error) {
    console.error("Hiba:", error);
    return NextResponse.json(
      { error: "Belső szerverhiba történt!" },
      { status: 500 },
    );
  }
}
