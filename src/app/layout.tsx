import type { Metadata } from "next";
import { Geist, Geist_Mono, Fraunces } from "next/font/google";
import "./globals.css";
import Link from "next/link";
import LogoutButton from "@/components/LogoutButton";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import Image from "next/image";
import Provider from "@/components/SessionProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  axes: ["opsz"],
});

export const metadata: Metadata = {
  title: "MyAuthApp — Control de acceso",
  description: "Laboratorio 13: autenticación y seguridad con NextAuth.js",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await getServerSession(authOptions);

  return (
    <html lang="es">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${fraunces.variable} antialiased min-h-screen flex flex-col`}
      >
        <header className="w-full bg-surface border-b border-line">
          <div className="max-w-5xl mx-auto px-6 py-3 flex items-center justify-between gap-4">
            <Link href="/" className="flex items-baseline gap-2">
              <span className="font-display text-xl font-semibold tracking-tight">
                MyAuthApp
              </span>
              <span className="hidden sm:inline font-mono text-[11px] text-muted">
                nextauth · lab 13
              </span>
            </Link>
            <nav aria-label="principal">
              <ul className="flex items-center gap-5 text-sm">
                <li>
                  <Link href="/dashboard" className="text-ink hover:text-cobalt transition-colors">
                    Dashboard
                  </Link>
                </li>
                {session?.user && (
                  <li>
                    <Link href="/profile" className="text-ink hover:text-cobalt transition-colors">
                      Perfil
                    </Link>
                  </li>
                )}
                {session?.user && (
                  <li>
                    <LogoutButton />
                  </li>
                )}
                {session?.user?.image && (
                  <li>
                    <Image
                      height={100}
                      width={100}
                      src={session.user.image}
                      alt="Foto de perfil"
                      className="w-9 h-9 rounded-full border border-line"
                    />
                  </li>
                )}
              </ul>
            </nav>
          </div>
        </header>
        <Provider>
          <main className="flex-1 flex flex-col">{children}</main>
        </Provider>
        <footer className="border-t border-line">
          <div className="max-w-5xl mx-auto px-6 py-4 flex flex-wrap items-center justify-between gap-2">
            <p className="text-xs text-muted">
              Desarrollo de Aplicaciones Web Avanzado — Autenticación y Seguridad
            </p>
            <p className="font-mono text-[11px] text-muted">
              bcrypt + JWT + OAuth 2.0
            </p>
          </div>
        </footer>
      </body>
    </html>
  );
}
