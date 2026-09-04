import { auth } from "@/auth";
import { NextRequest, NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { validateFoodInput } from "@/app/admin/etelek/foodValidation";

// Cloudflare R2 kliens
const r2 = new S3Client({
  region: "auto",
  endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID || "",
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY || "",
  },
});

export async function POST(req: NextRequest) {
  try {
    // 1. Admin jogosultság ellenőrzése
    const session = await auth();
    if (!session || session.user?.role !== "admin") {
      return NextResponse.json(
        { error: "Jogosulatlan hozzáférés" },
        { status: 401 },
      );
    }

    // 2. FormData feldolgozása
    const formData = await req.formData();
    const rawName = formData.get("name") as string;
    const type = formData.get("type") as string;
    const rawPrice = formData.get("price");
    const price = Number(rawPrice);
    const file = formData.get("file") as File | null;

    const name = rawName ? rawName.trim() : "";

    const validation = validateFoodInput({ name, price, file });
    if (!validation.isValid) {
      return NextResponse.json({ error: validation.error }, { status: 400 });
    }

    let imageUrl = "/placeholder-img.jpg";

    // 4. Képfeldolgozás és biztonsági szűrés
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

      const buffer = Buffer.from(await file.arrayBuffer());

      const lastDotIndex = file.name.lastIndexOf(".");
      const extension =
        lastDotIndex !== -1
          ? file.name.slice(lastDotIndex + 1).toLowerCase()
          : "jpg";
      const rawBaseName =
        lastDotIndex !== -1 ? file.name.slice(0, lastDotIndex) : file.name;

      const sanitizedBaseName = rawBaseName
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[^a-zA-Z0-9-]/g, "_")
        .toLowerCase();

      // 3. Tiszta formátum: foods/1712345678900-gulyasleves.jpg
      const fileName = `foods/${Date.now()}-${sanitizedBaseName}.${extension}`;

      await r2.send(
        new PutObjectCommand({
          Bucket: process.env.R2_BUCKET_NAME,
          Key: fileName,
          Body: buffer,
          ContentType: file.type,
        }),
      );

      imageUrl = `${process.env.NEXT_PUBLIC_R2_PUBLIC_URL}/${fileName}`;
    }

    // 5. Adatbázisba mentés
    const client = await clientPromise;
    const db = client.db("MammaMia");

    const newFood = {
      name,
      type,
      price,
      image: imageUrl,
      uploadedAt: new Date(),
    };

    const result = await db.collection("uploadedFoods").insertOne(newFood);

    return NextResponse.json(
      {
        success: true,
        id: result.insertedId,
        insertedFood: { _id: result.insertedId.toString(), ...newFood },
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("Hiba a feltöltés során:", error);
    return NextResponse.json(
      { error: "Szerver oldali hiba történt" },
      { status: 500 },
    );
  }
}
