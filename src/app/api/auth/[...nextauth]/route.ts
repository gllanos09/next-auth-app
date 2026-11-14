import NextAuth from "next-auth";
import { authOptions } from "@/lib/auth";

// authOptions vive en src/lib/auth.ts porque Next.js no permite
// exportar valores extra (como authOptions) desde un route handler.
const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
