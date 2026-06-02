import { NextResponse } from "next/server";
import Stripe from "stripe";
import { MongoClient } from "mongodb";

// Stripe init
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

// MongoDB kliens példányosítása
const uri = process.env.MONGO_URI!;
const client = new MongoClient(uri);

export async function POST(request: Request) {
  try {
    // Beolvassuk a form-adatokat, a kosarat és a user-id-t a frontendről
    const { cartItems, formData, userId } = await request.json();

    await client.connect();
    const db = client.db("MammaMia");

    // Biztonsági árszámítás az adatbázisból
    const productsFromDb = await db.collection("foods").find({}).toArray();
    let totalAmount = 0;

    cartItems.forEach((cartDay: any) => {
      const serverDay = productsFromDb.find((p) => p.date === cartDay.date);

      if (serverDay) {
        cartDay.items.forEach((cartItem: any) => {
          const serverProduct = serverDay.items.find(
            (i: any) => i.name === cartItem.name,
          );

          if (serverProduct) {
            totalAmount += serverProduct.price * cartItem.quantity;
          } else {
            console.warn(`Étel nem található ezen a napon: ${cartItem.name}`);
          }
        });
      } else {
        console.warn(`Dátum nem található: ${cartDay.date}`);
      }
    });

    if (totalAmount <= 0) {
      return NextResponse.json(
        { error: "Érvénytelen összeg!" },
        { status: 400 },
      );
    }

    // 1. LÉPÉS: RENDELÉS ELMENTÉSE PENDING STÁTUSSZAL A MONGODB-BE
    const pendingOrder = {
      orderId: Date.now(), // Egyedi belső azonosító
      status: "pending", // Alapértelmezetten függőben van, amíg a webhook nem igazolja a fizetést
      customer: formData,
      userId: userId === "guest" ? null : (userId ?? null), // "guest" string helyett null megy a DB-be
      items: cartItems, // A teljes, részletes kosár biztonságban elmentve nálunk
      total: totalAmount,
      currency: "HUF",
      date: new Date().toISOString(), // Ezt a dátumot figyeli a törlő index
    };

    const dbResult = await db.collection("orders").insertOne(pendingOrder);

    // Megkapjuk a MongoDB által generált 24 karakteres egyedi ID-t stringként
    const mongoOrderId = dbResult.insertedId.toString();

    // 2. LÉPÉS: PAYMENTINTENT LÉTREHOZÁSA CSAK AZ ORDER ID-VAL
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(totalAmount * 100),
      currency: "huf",
      // A Stripe-nak CSAK a MongoDB rekord ID-ját adjuk át, így elkerüljük az 500 karakteres limitet
      metadata: {
        orderId: mongoOrderId,
      },
    });

    // Visszaküldjük a frontendnek a titkot a kártya-űrlap kirajzolásához
    return NextResponse.json({ clientSecret: paymentIntent.client_secret });
  } catch (error: any) {
    console.error("Hiba történt:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  } finally {
    // Lezárjuk a kapcsolatot
    await client.close();
  }
}
