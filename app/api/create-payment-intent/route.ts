import { NextResponse } from "next/server";
import Stripe from "stripe";
import client from "@/lib/mongodb";
import crypto from "crypto";

// Stripe init
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(request: Request) {
  try {
    // Beolvassuk a form-adatokat, a kosarat és a user-id-t a frontendről
    const { cartItems, formData, userId } = await request.json();

    if (!cartItems || !Array.isArray(cartItems) || cartItems.length === 0) {
      return NextResponse.json(
        { error: "A kosár tartalma hiányzik vagy érvénytelen!" },
        { status: 400 },
      );
    }

    const todayBudapestStr = new Date().toLocaleDateString("en-CA", {
      timeZone: "Europe/Budapest",
    });

    const currentHourBudapest = parseInt(
      new Date().toLocaleTimeString("en-GB", {
        timeZone: "Europe/Budapest",
        hour: "2-digit",
      }),
      10,
    );

    const hasExpiredItem = cartItems.find((cartDay: any) => {
      const isPastDate = cartDay.date < todayBudapestStr;
      const isTodayPastNoon =
        cartDay.date === todayBudapestStr && currentHourBudapest >= 12;

      return isPastDate || isTodayPastNoon;
    });

    if (hasExpiredItem) {
      return NextResponse.json(
        {
          error:
            "A kosaradban lejárt menü, vagy aznapi (de már 12:00 utáni) rendelés található! Kérjük, frissítsd a kosarad.",
          item: hasExpiredItem.date,
        },

        { status: 400 },
      );
    }

    const db = client.db("MammaMia");

    // OPTIMALIZÁLÁS: Csak azokat a dátumokat kérjük le, amik ténylegesen a kosárban vannak
    const cartDates = cartItems.map((item: any) => item.date);
    const productsFromDb = await db
      .collection("foods")
      .find({ date: { $in: cartDates } })
      .toArray();

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

    // pending státusszak mentjük és csak az id-t adjuk át a paymentIntentnek(méret korlát miatt)
    const pendingOrder = {
      orderId: crypto.randomUUID(),
      status: "pending",
      customer: formData,
      userId: userId === "guest" ? null : (userId ?? null),
      items: cartItems.map((cartDay: any) => ({
        ...cartDay,
        status: "ordered",
      })),
      total: totalAmount,
      currency: "HUF",
      date: new Date().toISOString(),
    };

    const dbResult = await db.collection("orders").insertOne(pendingOrder);
    const mongoOrderId = dbResult.insertedId.toString();

    // PAYMENTINTENT
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
