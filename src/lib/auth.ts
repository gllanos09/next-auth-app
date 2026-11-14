import type { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import GitHubProvider from "next-auth/providers/github";
import CredentialsProvider from "next-auth/providers/credentials";
import { verifyCredentials } from "@/lib/users";

export const authOptions: NextAuthOptions = {
  // Configure one or more authentication providers
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    }),
    GitHubProvider({
      clientId: process.env.GITHUB_ID as string,
      clientSecret: process.env.GITHUB_SECRET as string,
    }),
    CredentialsProvider({
      name: "Credenciales",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Contraseña", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Ingresa tu correo y contraseña");
        }
        return verifyCredentials(credentials.email, credentials.password);
      },
    }),
  ],
  session: { strategy: "jwt" },
  callbacks: {
    // Guarda en el JWT con qué proveedor se autenticó el usuario
    async jwt({ token, account }) {
      if (account) token.provider = account.provider;
      return token;
    },
    async session({ session, token }) {
      session.provider = token.provider;
      return session;
    },
  },
  pages: { signIn: "/signIn" },
  secret: process.env.NEXTAUTH_SECRET,
};
