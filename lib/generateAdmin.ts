import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });
import { MongoClient } from "mongodb";
import bcrypt from "bcryptjs";
import { v4 as uuidv4 } from "uuid";

const MONGO = process.env.MONGO_URI!;
const DB_NAME = "MammaMia";
const COLLECTION_NAME = "admins";

async function createAdmin() {
  const client = new MongoClient(MONGO);

  try {
    await client.connect();

    const db = client.db(DB_NAME);
    const usersCollection = db.collection(COLLECTION_NAME);

    // 1. Ellenőrzés
    const existingAdmin = await usersCollection.findOne({
      email: "admin@mammamia.hu",
    });
    if (existingAdmin) {
      console.log("Ez az admin már létezik az adatbázisban!");
      return;
    }

    console.log("Jelszó titkosítása...");
    const hashedPassword = await bcrypt.hash("admin123", 10);

    const newAdmin = {
      id: uuidv4(),
      name: "Mamma Mia",
      email: "admin@mammamia.hu",
      password: hashedPassword,
      provider: "credentials",
      role: "admin",
      createdAt: new Date(),
    };

    // 3. Mentés
    console.log(`Mentés a '${DB_NAME}.${COLLECTION_NAME}' kollekcióba...`);
    await usersCollection.insertOne(newAdmin);

    console.log("Admin sikeresen létrehozva!");
    console.log("Generált adatok:", {
      ...newAdmin,
      password: "[TITKOSÍTVA]",
    });
  } catch (error) {
    console.error("Hiba történt a generálás során:", error);
  } finally {
    await client.close();
    console.log("Adatbázis kapcsolat lezárva.");
  }
}
