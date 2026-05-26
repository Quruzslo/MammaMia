// app/api/auth/[...nextauth]/route.ts
import { handlers } from "@/auth"; // Itt importálod be az auth.ts-ből!

export const { GET, POST } = handlers;
