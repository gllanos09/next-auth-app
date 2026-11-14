// En Next.js 16 "middleware.ts" pasó a llamarse "proxy.ts" (misma funcionalidad).
// Protege /dashboard y /profile: sin sesión redirige a /signIn.
import { withAuth } from "next-auth/middleware";

export default withAuth({
  pages: { signIn: "/signIn" },
});

export const config = { matcher: ["/dashboard", "/profile"] };
