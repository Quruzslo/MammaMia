import { NextResponse } from "next/server";
import Stripe from "stripe";
import client from "@/lib/mongodb"; // A központi singleton klienst használjuk

// Stripe init
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(req: Request) {
  try {
    const { paymentIntentId, formData, cartItems, userId } = await req.json();

    // Egyszerűen elkérjük az adatbázist a megosztott, cache-elt kliensből
    const db = client.db("MammaMia");

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
