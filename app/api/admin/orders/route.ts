import { auth } from "@/auth";
import { NextResponse } from "next/server";
import client from "@/lib/mongodb";

export async function GET() {
  const session = await auth();

  if (!session || session.user?.role !== "admin") {
    return NextResponse.json(
      { error: "Hozzáférés megtagadva" },
      { status: 403 },
    );
  }
  const { role, email } = session.user;

  try {
    const db = client.db("MammaMia");

    const orders = await db
      .collection("orders")
      .find({})
      .sort({ date: -1 })
      .toArray();

    return NextResponse.json(orders);
  } catch (error: any) {
    console.error("Adatbázis hiba ", error);
    return NextResponse.json({ error: "Szerverhiba történt" }, { status: 500 });
  }
}
