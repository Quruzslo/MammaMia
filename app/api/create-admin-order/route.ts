import { NextResponse } from "next/server";
import client from "@/lib/mongodb";
import crypto from "crypto";

export async function POST(request: Request) {
  try {
    const { cartItems, formData } = await request.json();

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

    const hasExpiredItem = cartItems.some((cartDay: any) => {
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
        },
        { status: 400 },
      );
    }

    const db = client.db("MammaMia");

    // releváns dátummal lekérdezés
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

    // Rendelés mentése egyedi ID-val
    const adminOrder = {
      orderId: crypto.randomUUID(),
      status: "succeeded",
      customer: formData,
      userId: "admin",
      items: cartItems.map((cartDay: any) => ({
        ...cartDay,
        status: "ordered",
      })),
      total: totalAmount,
      currency: "HUF",
      date: new Date().toISOString(),
    };

    await db.collection("orders").insertOne(adminOrder);

    return NextResponse.json({ message: "Rendelés rögzítve." });
  } catch (error: any) {
    console.error("Hiba történt:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
