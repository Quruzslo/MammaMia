import { auth } from "@/auth";
import { NextResponse } from "next/server";
import client from "@/lib/mongodb";
import { revalidateTag } from "next/cache";

export async function POST(request: Request) {
  // 1. Auth és Admin ellenőrzés a működő GET mintád alapján
  const session = await auth();

  if (!session || session.user?.role !== "admin") {
    return NextResponse.json(
      { error: "Hozzáférés megtagadva" },
      { status: 403 },
    );
  }

  try {
    // 2. Beolvassuk a frontendből érkező JSON-t
    const { secret, weeksMenu } = await request.json();

    // Mivel a form egyetlen napot küld a tömbben, kicsomagoljuk az aktuális napot
    const targetDay = weeksMenu?.[0];

    if (!targetDay || !targetDay.date) {
      return NextResponse.json(
        { error: "Hibás adatszerkezet! A napi menü adatai hiányoznak." },
        { status: 400 },
      );
    }

    // 3. Adatbázis kapcsolódás
    const db = client.db("MammaMia");

    // 4. DUPLIKÁCIÓ ELLENŐRZÉS - PONTOSAN MINT A PÉLDÁDBAN 🎯
    // Megnézzük, hogy létezik-e már menü erre a konkrét dátumra
    const alreadyProcessed = await db
      .collection("foods")
      .findOne({ date: targetDay.date });

    if (alreadyProcessed) {
      return NextResponse.json(
        {
          error: `Erre a napra (${targetDay.date}) már fel lett dolgozva a menü!`,
        },
        { status: 400 },
      );
    }

    // 5. ÚJ DOKUMENTUM ÖSSZEÁLLÍTÁSA ÉS BESZÚRÁSA (insertOne)
    const newMenuDay = {
      date: targetDay.date,
      dayName: targetDay.dayName,
      isClosed: targetDay.isClosed,
      items: targetDay.items,
    };

    await db.collection("foods").insertOne(newMenuDay);

    // 6. Next.js cache ürítés, hogy a frontend azonnal lássa a változást
    revalidateTag("foods-list");

    return NextResponse.json(
      {
        success: true,
        message: `${targetDay.dayName}i menü sikeresen rögzítve!`,
      },
      { status: 201 },
    );
  } catch (error: any) {
    console.error("Menü mentési hiba:", error);
    return NextResponse.json(
      {
        error: "Szerver hiba történt a menü mentése során.",
        details: error.message,
      },
      { status: 500 },
    );
  }
}
