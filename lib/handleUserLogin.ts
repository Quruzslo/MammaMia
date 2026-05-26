// lib/authHelpers.ts
import client from "@/lib/mongodb";
import { v4 as uuidv4 } from "uuid";

export async function initUserInDatabase(user: any) {
  const db = client.db("MammaMia");

  const usersCollection = db.collection("users");

  const existingUser = await usersCollection.findOne({ email: user.email });

  if (!existingUser) {
    await usersCollection.insertOne({
      name: user.name,
      email: user.email,
      userId: uuidv4(),
      role: "user",
      createdAt: new Date(),
      tel: "",
      city: "",
      street: "",
      houseNumber: "",
    });
  }
}

export async function getUserByEmail(email: string) {
  await client.connect();
  const db = client.db("MammaMia");
  return db.collection("users").findOne({ email });
}

// export async function getAdminByEmail(email) {
//   if (!email) return null;

//   try {
//     const clientPromise = await client;
//     const db = clientPromise.db("MammaMia"); // Biztosítsd, hogy ez a te adatbázisod neve

//     // Megkeressük az admint az email címe alapján
//     // Tipp: Ha az adminokat külön kollekcióban tárolod, akkor "admins", ha a sima userek között, akkor "users"
//     const admin = await db.collection("users").findOne({
//       email: email.toLowerCase(),
//     });

//     if (!admin) {
//       console.warn(`Nem található felhasználó ezzel az email címmel: ${email}`);
//       return null;
//     }

//     // Átalakítjuk a struktúrát úgy, ahogy az auth.js-ben várod
//     return {
//       userId: admin.userId || admin._id.toString(), // Ha nincs külön userId, a MongoDB ID-t szöveggé alakítjuk
//       email: admin.email,
//       name: admin.name || "Admin",
//       passwordHash: admin.passwordHash || admin.password, // Attól függően, mi a mezőneved a DB-ben
//       role: admin.role || "admin",
//     };
//   } catch (error) {
//     console.error("Hiba történt a getAdminByEmail futása során:", error);
//     throw error;
//   }
// }
