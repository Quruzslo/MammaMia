import { NextResponse } from "next/server";
import Stripe from "stripe";
import { MongoClient } from "mongodb";

// Stripe init
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

// MongoDB kliens példányosítása
const uri = process.env.MONGO_URI!;
const client = new MongoClient(uri);

export async function POST(req: Request) {
  try {
    const { paymentIntentId, formData, cartItems, user } = await req.json();

    await client.connect();
    const db = client.db("MammaMia");

    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

    if (paymentIntent.status === "succeeded") {
      const newOrder = {
        orderId: Date.now(),
        paymentIntentId: paymentIntent.id,
        status: paymentIntent.status,
        customer: formData,
        userId: user?.id ?? null,
        items: cartItems,
        total: paymentIntent.amount,
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
  } finally {
    await client.close();
  }
}
