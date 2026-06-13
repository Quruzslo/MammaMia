export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import Stripe from "stripe";
import { ObjectId } from "mongodb";
import client from "@/lib/mongodb";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

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
    const paymentIntent = event.data.object as Stripe.PaymentIntent;

    // Kiszedjük a Stripe-ból azt a MongoDB ID-t, amit a fizetés indításakor rátettünk
    const mongoOrderId = paymentIntent.metadata.orderId;

    if (mongoOrderId) {
      try {
        const db = client.db("MammaMia");

        const updateResult = await db.collection("orders").updateOne(
          { _id: new ObjectId(mongoOrderId) },
          {
            $set: {
              status: "succeeded",
              paymentIntentId: paymentIntent.id,
            },
          },
        );

        if (updateResult.modifiedCount === 1) {
          console.log(
            `Rendelés sikeresen kifizetve és aktiválva: ${mongoOrderId}`,
          );
        } else {
          console.warn(
            `Nem található frissítendő rendelés ezzel az ID-val: ${mongoOrderId}`,
          );
        }
      } catch (dbError: any) {
        console.error("Adatbázis hiba a webhookban:", dbError.message);
        return NextResponse.json(
          { error: "Adatbázis hiba, újrapróbáljuk a frissítést" },
          { status: 500 },
        );
      }
    }
  }

  return NextResponse.json({ received: true });
}
