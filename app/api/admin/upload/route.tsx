import { auth } from "@/auth";
import { NextResponse } from "next/server";
import client from "@/lib/mongodb";
import { revalidateTag, revalidatePath } from "next/cache";

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

    // Ha nincs még ilyen dátum, létrehozza. Ha van, felülírja (javítja)!
    const result = await db.collection("foods").updateOne(
      { date: targetDay.date },
      {
        $set: {
          dayName: targetDay.dayName,
          isClosed: targetDay.isClosed,
          items: targetDay.items,
        },
      },
      { upsert: true }, //  Ha nincs ilyen dátum, automatikusan beszúrja újként!
    );

    // 5. Next.js cache ürítés, hogy a frontend azonnal lássa a változást

    // revalidateTag("foods-list");
    revalidatePath("/api/foods");

    // Megnézzük, hogy új beszúrás (upserted) vagy frissítés történt-e a szebb üzenethez
    const isNew = result.upsertedCount > 0;

    return NextResponse.json(
      {
        success: true,
        message: isNew
          ? `${targetDay.dayName}i menü sikeresen rögzítve!`
          : `${targetDay.dayName}i menü sikeresen frissítve/javítva!`,
      },
      { status: isNew ? 201 : 200 },
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
