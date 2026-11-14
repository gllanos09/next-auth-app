import { NextResponse } from "next/server";
import { registerUser } from "@/lib/users";

export async function POST(req: Request) {
  const { name, email, password } = await req.json().catch(() => ({}));

  if (!name || !email || !password) {
    return NextResponse.json({ error: "Todos los campos son obligatorios" }, { status: 400 });
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: "Correo no válido" }, { status: 400 });
  }
  if (String(password).length < 8) {
    return NextResponse.json({ error: "La contraseña debe tener al menos 8 caracteres" }, { status: 400 });
  }

  try {
    const user = await registerUser(name, email, password);
    return NextResponse.json({ user }, { status: 201 });
  } catch (e) {
    return NextResponse.json({ error: (e as Error).message }, { status: 409 });
  }
}
