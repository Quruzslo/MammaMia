// // scripts/add-tenant-to-users.js
// import { MongoClient, ObjectId } from "mongodb";
// import dotenv from "dotenv";

// // Betöltjük a környezeti változókat (.env.local vagy .env)
// dotenv.config({ path: ".env.local" });

// async function migrateUsersTenantId() {
//   const uri = process.env.MONGO_URI;
//   const tenantIdStr = process.env.TENANT_ID;

//   if (!uri) {
//     console.error("❌ HIBA: MONGODB_URI nincs beállítva az .env.local-ban!");
//     process.exit(1);
//   }

//   if (!tenantIdStr) {
//     console.error("❌ HIBA: TENANT_ID nincs beállítva az .env.local-ban!");
//     process.exit(1);
//   }

//   const client = new MongoClient(uri);

//   try {
//     console.log("⏳ Csatlakozás a MongoDB-hez...");
//     await client.connect();

//     const db = client.db("MammaMia");
//     const usersCollection = db.collection("users");

//     const tenantObjectId = new ObjectId(tenantIdStr);

//     console.log(`⏳ Userek frissítése ezzel a tenantId-val: ${tenantIdStr}...`);

//     // Frissítjük az összes olyan usert, ahol még nincs tenantId
//     const result = await usersCollection.updateMany(
//       { tenantId: { $exists: false } }, // Csak azokat frissíti, ahol még hiányzik
//       { $set: { tenantId: tenantObjectId } },
//     );

//     console.log(`✅ Sikeres frissítés!`);
//     console.log(`   - Megtalált elemek anélkül: ${result.matchedCount}`);
//     console.log(`   - Módosított userek száma: ${result.modifiedCount}`);
//   } catch (error) {
//     console.error("❌ Hiba történt a migrálás során:", error);
//   } finally {
//     await client.close();
//     console.log("🔌 Adatbázis-kapcsolat lezárva.");
//   }
// }

// migrateUsersTenantId();
