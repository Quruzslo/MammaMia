import { NextResponse } from "next/server";
import { auth } from "@/auth";
import clientPromise from "@/lib/mongodb";

export async function GET() {
  try {
    // Next-Auth session ellenőrzése
    const session = await auth();

    if (!session || !session.user?.email) {
      return NextResponse.json(
        { message: "Nem vagy belépve!" },
        { status: 401 },
      );
    }

    // Adatbázis és email kinyerése
    const client = await clientPromise;
    const db = client.db("MammaMia");
    const userEmail = session.user.email;

    const existingUser = await db
      .collection("users")
      .findOne({ email: userEmail });

    return NextResponse.json(existingUser, { status: 200 });
  } catch (error) {
    console.error("Szerver hiba:", error);
    return NextResponse.json(
      { message: "Szerverhiba történt." },
      { status: 500 },
    );
  }
}
