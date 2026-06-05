import { NextResponse } from "next/server";
import Stripe from "stripe";
import client from "@/lib/mongodb";

// Stripe init
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(request: Request) {
  try {
    // Beolvassuk a form-adatokat, a kosarat és a user-id-t a frontendről
    const { cartItems, formData, userId } = await request.json();

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

    // RENDELÉS ELMENTÉSE PENDING STÁTUSSZAL A MONGODB-BE
    const pendingOrder = {
      orderId: Date.now(),
      status: "pending",
      customer: formData,
      userId: userId === "guest" ? null : (userId ?? null),
      items: cartItems,
      total: totalAmount,
      currency: "HUF",
      date: new Date().toISOString(),
    };

    const dbResult = await db.collection("orders").insertOne(pendingOrder);
    const mongoOrderId = dbResult.insertedId.toString();

    // PAYMENTINTENT LÉTREHOZÁSA CSAK AZ ORDER ID-VAL
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(totalAmount * 100),
      currency: "huf",
      metadata: {
        orderId: mongoOrderId,
      },
    });

    return NextResponse.json({ clientSecret: paymentIntent.client_secret });
  } catch (error: any) {
    console.error("Hiba történt:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
