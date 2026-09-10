// app/api/user-orders/route.ts
import clientPromise from "@/lib/mongodb";
import { NextResponse } from "next/server";
import { auth } from "@/auth";

export const POST = auth(async function POST(request) {
  try {
    const session = request.auth;

    // 1. Ha nincs érvényes munkamenet
    if (!session || !session.user) {
      return NextResponse.json(
        { error: "Nincs érvényes munkamenet! Jelentkezz be újra." },
        { status: 401 },
      );
    }

    //  auth.ts-ből származó hitelesített ID
    const secureUserId = (session.user as any).userId;

    if (!secureUserId) {
      return NextResponse.json(
        { error: "A session-ben nem található userId!" },
        { status: 400 },
      );
    }

    const { userId } = await request.json();

    if (!userId) {
      return NextResponse.json(
        { error: "Hiányzó felhasználó azonosító a kérésből!" },
        { status: 400 },
      );
    }

    if (secureUserId !== userId) {
      return NextResponse.json(
        { error: "Manipulált kérés! Hozzáférés megtagadva." },
        { status: 403 },
      );
    }

    const client = await clientPromise;
    const db = client.db("MammaMia");
    const ordersCollection = db.collection("orders");

    const userOrders = await ordersCollection
      .find({ userId: secureUserId, status: "succeeded" })
      .sort({ date: -1 })
      .toArray();

    return NextResponse.json(userOrders, { status: 200 });
  } catch (error) {
    console.error("Hiba az orders API-ban:", error);
    return NextResponse.json(
      { error: "Szerver hiba történt." },
      { status: 500 },
    );
  }
});
