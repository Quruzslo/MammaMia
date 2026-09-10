import { auth } from "@/auth";
import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { revalidateTag, revalidatePath } from "next/cache";

export async function POST(request: Request) {
  const session = await auth();

  if (!session || session.user?.role !== "admin") {
    return NextResponse.json(
      { error: "Hozzáférés megtagadva" },
      { status: 403 },
    );
  }

  try {
    const { secret, weeksMenu } = await request.json();
    const targetDay = weeksMenu?.[0];

    if (!targetDay || !targetDay.date) {
      return NextResponse.json(
        { error: "Hibás adatszerkezet! A napi menü adatai hiányoznak." },
        { status: 400 },
      );
    }

    const client = await clientPromise;
    const db = client.db("MammaMia");

    const result = await db.collection("menu").updateOne(
      { date: targetDay.date },
      {
        $set: {
          dayName: targetDay.dayName,
          isClosed: targetDay.isClosed,
          items: targetDay.items,
        },
      },
      { upsert: true },
    );

    revalidatePath("/api/foods");

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
