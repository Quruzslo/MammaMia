import clientPromise from "@/lib/mongodb";
import { auth } from "@/auth";
import { NextResponse, NextRequest } from "next/server";
import { ObjectId } from "mongodb";
import { S3Client, DeleteObjectCommand } from "@aws-sdk/client-s3";

const r2 = new S3Client({
  region: "auto",
  endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID || "",
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY || "",
  },
});

export async function DELETE(req: NextRequest) {
  try {
    const session = await auth();
    if (!session || session.user?.role !== "admin") {
      return NextResponse.json(
        { error: "Ehhez nincs jogosultságod!" },
        { status: 401 },
      );
    }

    const { id, ...food } = await req.json();

    if (!id || !ObjectId.isValid(id)) {
      return NextResponse.json(
        { error: "Érvénytelen vagy hiányzó étel ID!" },
        { status: 400 },
      );
    }

    const client = await clientPromise;
    const db = client.db("MammaMia");

    // 2. Kép törlése az R2-ből
    if (food.image && !food.image.includes("placeholder")) {
      const imageKey = food.image.replace(
        `${process.env.NEXT_PUBLIC_R2_PUBLIC_URL}/`,
        "",
      );

      try {
        await r2.send(
          new DeleteObjectCommand({
            Bucket: process.env.R2_BUCKET_NAME,
            Key: imageKey,
          }),
        );
      } catch (r2Error) {
        console.error("Hiba az R2 kép törlésekor:", r2Error);
      }
    }

    const result = await db.collection("uploadedFoods").deleteOne({
      _id: new ObjectId(id),
    });

    if (result.deletedCount === 0) {
      return NextResponse.json(
        { error: "Az étel nem található az adatbázisban!" },
        { status: 404 },
      );
    }

    return NextResponse.json(
      { success: true, message: "Étel sikeresen törölve!" },
      { status: 200 },
    );
  } catch (err) {
    console.error("Törlési hiba:", err);
    return NextResponse.json(
      { error: "Szerver oldali hiba történt a törlés során!" },
      { status: 500 },
    );
  }
}
