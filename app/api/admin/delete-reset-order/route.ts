import client from "@/lib/mongodb";
import { auth } from "@/auth";
import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";

export async function PATCH(req: Request) {
  const session = await auth();

  if (!session || session.user?.role !== "admin") {
    return NextResponse.json(
      { error: "Hozzáférés megtagadva" },
      { status: 403 },
    );
  }

  try {
    const db = client.db("MammaMia");
    const body = await req.json();
    const { orderId, targetStatus } = body;

    if (!orderId || !targetStatus) {
      return NextResponse.json({ error: "Hiányzó adatok" }, { status: 400 });
    }

    if (!ObjectId.isValid(orderId)) {
      return NextResponse.json(
        { error: "Érvénytelen ID formátum" },
        { status: 400 },
      );
    }

    const updateQuery: any = {
      $set: { status: targetStatus },
    };

    if (targetStatus === "deleted") {
      updateQuery.$set.deletedAt = new Date();
    } else {
      updateQuery.$unset = { deletedAt: "" };
    }

    const result = await db
      .collection("orders")
      .updateOne({ _id: new ObjectId(orderId) }, updateQuery);

    if (result.matchedCount === 0) {
      return NextResponse.json(
        { error: "A rendelés nem található" },
        { status: 404 },
      );
    }

    return NextResponse.json({
      message: `Státusz sikeresen frissítve: ${targetStatus}`,
    });
  } catch (error) {
    console.error("Hiba a státusz frissítésekor:", error);
    return NextResponse.json({ error: "Szerverhiba" }, { status: 500 });
  }
}
