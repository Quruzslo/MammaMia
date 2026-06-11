import { NextResponse } from "next/server";
import client from "@/lib/mongodb";
import { ObjectId } from "mongodb";
import { auth } from "@/auth";

export async function PATCH(req: Request) {
  try {
    // 1. Biztonsági ellenőrzés (csak admin módosíthat)
    const session = await auth();
    if (!session || session.user?.role !== "admin") {
      return NextResponse.json(
        { error: "Ehhez nem férhetsz hozzá" },
        { status: 401 },
      );
    }

    const body = await req.json();
    const { id, fullName, email, phone, city, street, houseNumber } = body;

    if (!id) {
      return NextResponse.json(
        { error: "Hiányzó rendelés ID" },
        { status: 400 },
      );
    }

    const db = client.db("MammaMia");

    // 2. Frissítés a MongoDB-ben az order _id alapján
    const result = await db.collection("orders").updateOne(
      { _id: new ObjectId(id) },
      {
        $set: {
          "customer.fullName": fullName,
          "customer.email": email,
          "customer.phone": phone,
          "customer.city": city,
          "customer.street": street,
          "customer.houseNumber": houseNumber,
        },
      },
    );

    if (result.matchedCount === 0) {
      return NextResponse.json(
        { error: "A rendelés nem található" },
        { status: 404 },
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Hiba a vevő adatainak frissítésekor:", error);
    return NextResponse.json(
      { error: "Szerver hiba történt" },
      { status: 500 },
    );
  }
}
