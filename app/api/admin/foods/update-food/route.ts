import { auth } from "@/auth";
import { NextRequest, NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";
import {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
} from "@aws-sdk/client-s3";
import { validateFoodInput } from "@/app/admin/etelek/foodValidation";

const r2 = new S3Client({
  region: "auto",
  endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID || "",
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY || "",
  },
});

export async function PATCH(req: NextRequest) {
  try {
    const session = await auth();
    if (!session || session.user?.role !== "admin") {
      return NextResponse.json(
        { error: "Jogosulatlan hozzáférés" },
        { status: 401 },
      );
    }

    // FormData feldolgozása
    const formData = await req.formData();
    const id = formData.get("id") as string;
    const rawName = formData.get("name") as string;
    const type = formData.get("type") as string;
    const rawAllergens = formData.get("allergens") as string;
    let allergens: string[] = [];
    if (rawAllergens) {
      try {
        allergens = JSON.parse(rawAllergens);
      } catch {
        allergens = [];
      }
    }

    const rawPrice = formData.get("price");
    const price = Number(rawPrice);
    const file = formData.get("file") as File | null;

    const name = rawName ? rawName.trim() : "";

    if (!id || !ObjectId.isValid(id)) {
      return NextResponse.json(
        { error: "Érvénytelen vagy hiányzó étel azonosító (ID)!" },
        { status: 400 },
      );
    }

    const validation = validateFoodInput({ name, price, file });
    if (!validation.isValid) {
      return NextResponse.json({ error: validation.error }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db("MammaMia");

    // Régi étel meglétének ellenőrzése
    const existingFood = await db
      .collection("uploadedFoods")
      .findOne({ _id: new ObjectId(id) });

    if (!existingFood) {
      return NextResponse.json(
        { error: "A megadott étel nem található!" },
        { status: 404 },
      );
    }

    let updatedImage: string | undefined = undefined;

    // Ha van ÚJ kép feltöltve
    if (file && file.size > 0) {
      const allowedMimeTypes = [
        "image/jpeg",
        "image/png",
        "image/webp",
        "image/gif",
      ];
      if (!allowedMimeTypes.includes(file.type)) {
        return NextResponse.json(
          {
            error:
              "Érvénytelen fájltípus! Csak JPG, PNG, WEBP és GIF képek engedélyezettek.",
          },
          { status: 400 },
        );
      }

      // Régi kép törlése R2-ből (ha nem a placeholder volt)
      if (
        existingFood.image &&
        !existingFood.image.includes("placeholder-img.jpg")
      ) {
        try {
          const publicUrl = process.env.NEXT_PUBLIC_R2_PUBLIC_URL || "";
          const oldKey = existingFood.image.replace(`${publicUrl}/`, "");

          if (oldKey) {
            await r2.send(
              new DeleteObjectCommand({
                Bucket: process.env.R2_BUCKET_NAME,
                Key: oldKey,
              }),
            );
          }
        } catch (r2Error) {
          console.error("Nem sikerült törölni a régi képet R2-ből:", r2Error);
        }
      }

      // Új kép ékezetmentesítése
      const buffer = Buffer.from(await file.arrayBuffer());

      const sanitizedOriginalName = file.name
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[^a-zA-Z0-9.-]/g, "_")
        .toLowerCase();

      const fileName = `foods/${Date.now()}-${sanitizedOriginalName}`;

      await r2.send(
        new PutObjectCommand({
          Bucket: process.env.R2_BUCKET_NAME,
          Key: fileName,
          Body: buffer,
          ContentType: file.type,
        }),
      );

      updatedImage = `${process.env.NEXT_PUBLIC_R2_PUBLIC_URL}/${fileName}`;
    }

    const updateData: Record<string, any> = {
      name,
      type,
      price,
      allergens,
      updatedAt: new Date(),
    };

    if (updatedImage) {
      updateData.image = updatedImage;
    }

    await db
      .collection("uploadedFoods")
      .updateOne({ _id: new ObjectId(id) }, { $set: updateData });

    return NextResponse.json(
      {
        success: true,
        message: "Sikeres frissítés!",
        updatedFood: {
          ...existingFood,
          ...updateData,
          _id: id,
        },
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Hiba a frissítés során:", error);
    return NextResponse.json(
      { error: "Szerver oldali hiba történt" },
      { status: 500 },
    );
  }
}
