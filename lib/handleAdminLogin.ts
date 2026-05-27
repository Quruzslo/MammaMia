// import bcrypt from "bcryptjs";

// import client from "@/lib/mongodb";

// export async function verifyAdminCredentials(email: string, password: string) {
//   const admin = await client.admins.findUnique({ where: { email } });
//   if (!admin) return null;

//   // 2. Összehasonlítjuk a beírt jelszót a DB-ben lévő hash-elt jelszóval
//   const isPasswordValid = await bcrypt.compare(password, admin.passwordHash);
//   if (!isPasswordValid) return null;

//   return {
//     id: admin.id.toString(),
//     email: admin.email,
//     name: admin.name,
//   };
// }
