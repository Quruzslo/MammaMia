import { NextResponse } from "next/server";
import Stripe from "stripe";
import { MongoClient } from "mongodb";

// Stripe init
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
const uri = process.env.MONGO_URI!;
const client = new MongoClient(uri);
const clientPromise = client.connect();

export async function POST(req: Request) {
  try {
    const { paymentIntentId, formData, cartItems, userId } = await req.json();

    const mongoClient = await clientPromise;
    const db = mongoClient.db("MammaMia");

    // Ellenőrizzük, hogy ez a fizetés ne legyen kétszer feldolgozva
    const alreadyProcessed = await db
      .collection("orders")
      .findOne({ paymentIntentId });
    if (alreadyProcessed) {
      return NextResponse.json(
        { error: "Ez a rendelés már fel lett dolgozva!" },
        { status: 400 },
      );
    }

    // Lekérjük a Stripe-tól a valódi adatokat
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

    if (paymentIntent.status === "succeeded") {
      const newOrder = {
        orderId: Date.now(),
        paymentIntentId: paymentIntent.id,
        status: paymentIntent.status,
        customer: formData,
        userId: userId ?? null,
        items: cartItems,
        total: paymentIntent.amount / 100,
        currency: paymentIntent.currency,
        date: new Date().toISOString(),
      };

      await db.collection("orders").insertOne(newOrder);

      return NextResponse.json({ success: true, orderId: newOrder.orderId });
    } else {
      return NextResponse.json(
        { error: "Sikertelen fizetés" },
        { status: 400 },
      );
    }
  } catch (error: any) {
    console.error("Rendelés mentési hiba:", error);
    return NextResponse.json(
      { error: "Nem tudtuk elmenteni a rendelést", details: error.message },
      { status: 500 },
    );
  }
}
