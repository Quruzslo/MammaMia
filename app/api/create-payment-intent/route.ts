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
    //  BEOLVASSUK A FORM-ADATOKAT ÉS A USER-ID-T IS A FRONTENDRŐL
    const { cartItems, formData, userId } = await request.json();

    await client.connect();
    const db = client.db("MammaMia");
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

    //  LÉTREHOZZUK A PAYMENTINTENT-ET A METADATÁKKAL EGYÜTT .---------
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(totalAmount * 100),
      currency: "huf",
      // --- INNENTŐL KÜLDJÜK ÁT A STRIPENAK A HÁTTÉR-MENTÉSHEZ AZ ADATOKAT ---
      metadata: {
        userId: userId ?? "guest",
        cartItems: JSON.stringify(cartItems),
        formData: JSON.stringify(formData),
      },
    });

    return NextResponse.json({ clientSecret: paymentIntent.client_secret });
  } catch (error: any) {
    console.error("Hiba történt:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  } finally {
    await client.close();
  }
}
