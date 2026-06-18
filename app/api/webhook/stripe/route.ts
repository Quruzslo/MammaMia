export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import Stripe from "stripe";
import { ObjectId } from "mongodb";
import client from "@/lib/mongodb";

import { pusherServer } from "@/lib/pusherServer";

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

  const db = client.db("MammaMia");

  if (event.type === "payment_intent.succeeded") {
    const paymentIntent = event.data.object as Stripe.PaymentIntent;
    const mongoOrderId = paymentIntent.metadata.orderId;

    if (mongoOrderId) {
      try {
        const updateResult = await db.collection("orders").updateOne(
          { _id: new ObjectId(mongoOrderId) },
          {
            $set: {
              status: "succeeded",
              paymentIntentId: paymentIntent.id,
            },
            $unset: {
              deletedAt: "",
            },
          },
        );

        if (updateResult.modifiedCount === 1) {
          console.log(
            `Rendelés sikeresen kifizetve és aktiválva: ${mongoOrderId}`,
          );

          const frissRendeles = await db.collection("orders").findOne({
            _id: new ObjectId(mongoOrderId),
          });

          if (frissRendeles) {
            await pusherServer.trigger(
              "admin-orders",
              "uj-rendeles",
              frissRendeles,
            );
            console.log(
              "Pusher valós idejű esemény sikeresen kiküldve az adminnak!",
            );
          }
        } else {
          console.warn(
            `Nem található frissítendő rendelés ezzel az ID-val: ${mongoOrderId}`,
          );
        }
      } catch (dbError: any) {
        console.error(
          "Adatbázis hiba a webhookban (succeeded):",
          dbError.message,
        );
        return NextResponse.json(
          { error: "Adatbázis hiba, újrapróbáljuk a frissítést" },
          { status: 500 },
        );
      }
    }
  } else if (event.type === "payment_intent.payment_failed") {
    const paymentIntent = event.data.object as Stripe.PaymentIntent;
    const mongoOrderId = paymentIntent.metadata.orderId;

    if (mongoOrderId) {
      try {
        const deleteResult = await db.collection("orders").deleteOne({
          _id: new ObjectId(mongoOrderId),
        });

        if (deleteResult.deletedCount === 1) {
          console.log(
            `Sikertelen fizetés! A függő rendelés törölve a DB-ből: ${mongoOrderId}`,
          );
        } else {
          console.warn(
            `Sikertelen fizetés jött, de a rendelés nem található a DB-ben: ${mongoOrderId}`,
          );
        }
      } catch (dbError: any) {
        console.error("Adatbázis hiba a webhookban (failed):", dbError.message);
        return NextResponse.json(
          { error: "Adatbázis hiba a törlés során" },
          { status: 500 },
        );
      }
    }
  }

  return NextResponse.json({ received: true });
}
