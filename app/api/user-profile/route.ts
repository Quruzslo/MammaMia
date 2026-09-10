import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import clientPromise from "@/lib/mongodb";

export async function PATCH(req: NextRequest) {
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

    // 3. Frontendről érkező adatok kinyerése
    const body = await req.json();
    const { city, street, houseNumber, tel } = body;

    // Alap validáció
    if (!city || !street || !houseNumber || !tel) {
      return NextResponse.json(
        { message: "Minden mező kitöltése kötelező!" },
        { status: 400 },
      );
    }

    // Frissítés a "users" kollekcióban
    // Az $set operátorral csak ezeket a mezőket frissítjük/adjuk hozzá a meglévő userhez
    const result = await db.collection("users").updateOne(
      { email: userEmail },
      {
        $set: {
          city,
          street,
          houseNumber,
          tel,
          updatedAt: new Date(),
        },
      },
    );

    // Ellenőrizzük, hogy talált-e ilyen usert az adatbázisban
    if (result.matchedCount === 0) {
      return NextResponse.json(
        { message: "A felhasználó nem található az adatbázisban." },
        { status: 404 },
      );
    }

    return NextResponse.json(
      { message: "Sikeres frissítés!" },
      { status: 200 },
    );
  } catch (error) {
    console.error("Szerver hiba:", error);
    return NextResponse.json(
      { message: "Szerverhiba történt." },
      { status: 500 },
    );
  }
}
