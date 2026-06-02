import { NextResponse } from "next/server";
import Stripe from "stripe";
import { MongoClient } from "mongodb";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

const client = new MongoClient(process.env.MONGO_URI!);
const clientPromise = client.connect();

export async function POST(req: Request) {
  const body = await req.text();
  const sig = req.headers.get("stripe-signature");

  if (!sig) {
    return NextResponse.json({ error: "Missing signature" }, { status: 400 });
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET!,
    );
  } catch (err: any) {
    console.error("Webhook signature hiba:", err.message);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  if (event.type === "payment_intent.succeeded") {
    // Típus kényszerítése, hogy a TS ne panaszkodjon a metadata miatt
    const paymentIntent = event.data.object as Stripe.PaymentIntent;

    try {
      // A megosztott kapcsolat használata
      const mongoClient = await clientPromise;
      const db = mongoClient.db("MammaMia");

      const alreadyProcessed = await db
        .collection("orders")
        .findOne({ paymentIntentId: paymentIntent.id });

      if (!alreadyProcessed) {
        await db.collection("orders").insertOne({
          orderId: Date.now(),
          paymentIntentId: paymentIntent.id,
          status: paymentIntent.status,
          customer: paymentIntent.metadata.formData
            ? JSON.parse(paymentIntent.metadata.formData)
            : null,
          userId: paymentIntent.metadata.userId ?? null,
          items: paymentIntent.metadata.cartItems
            ? JSON.parse(paymentIntent.metadata.cartItems)
            : [],
          total: paymentIntent.amount / 100,
          currency: paymentIntent.currency,
          date: new Date().toISOString(),
        });
        console.log(`Rendelés mentve: ${paymentIntent.id}`);
      }
    } catch (dbError: any) {
      console.error("Adatbázis mentési hiba a webhookban:", dbError.message);
      // FONTOS: 500-as hibát adunk, így a Stripe újra megpróbálja később!
      return NextResponse.json(
        { error: "Adatbázis hiba, újrapróbáljuk a mentést" },
        { status: 500 },
      );
    }
  }

  // Sikeres feldolgozás (vagy olyan esemény, ami nem payment_intent.succeeded)
  return NextResponse.json({ received: true });
}
