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
