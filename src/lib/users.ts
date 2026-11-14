import bcrypt from "bcryptjs";

/**
 * Almacén de usuarios en memoria (demo del laboratorio).
 * Las contraseñas SIEMPRE se guardan cifradas con bcrypt.
 * En producción se reemplazaría por una base de datos.
 */
export type StoredUser = {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
};

type Attempts = { count: number; lockedUntil: number | null };

export const MAX_ATTEMPTS = 3;
export const LOCK_TIME_MS = 5 * 60 * 1000; // 5 minutos

const globalStore = globalThis as unknown as {
  __users?: Map<string, StoredUser>;
  __attempts?: Map<string, Attempts>;
};

const users = (globalStore.__users ??= new Map<string, StoredUser>());
const attempts = (globalStore.__attempts ??= new Map<string, Attempts>());

// Usuario de prueba para que la app desplegada siempre tenga una cuenta válida
if (!users.has("demo@tecsup.edu.pe")) {
  users.set("demo@tecsup.edu.pe", {
    id: "demo",
    name: "Usuario Demo",
    email: "demo@tecsup.edu.pe",
    passwordHash: bcrypt.hashSync("Demo1234", 10),
  });
}

export async function registerUser(name: string, email: string, password: string) {
  const key = email.trim().toLowerCase();
  if (users.has(key)) throw new Error("El correo ya está registrado");
  const passwordHash = await bcrypt.hash(password, 10);
  const user: StoredUser = { id: crypto.randomUUID(), name: name.trim(), email: key, passwordHash };
  users.set(key, user);
  return { id: user.id, name: user.name, email: user.email };
}

/** Valida credenciales aplicando el bloqueo por intentos fallidos. */
export async function verifyCredentials(email: string, password: string) {
  const key = email.trim().toLowerCase();
  const now = Date.now();
  const state = attempts.get(key) ?? { count: 0, lockedUntil: null };

  if (state.lockedUntil && state.lockedUntil > now) {
    const min = Math.ceil((state.lockedUntil - now) / 60000);
    throw new Error(`Cuenta bloqueada por demasiados intentos. Intenta de nuevo en ${min} min.`);
  }
  if (state.lockedUntil && state.lockedUntil <= now) {
    state.count = 0;
    state.lockedUntil = null;
  }

  const user = users.get(key);
  const valid = user ? await bcrypt.compare(password, user.passwordHash) : false;

  if (!user || !valid) {
    state.count += 1;
    if (state.count >= MAX_ATTEMPTS) {
      state.lockedUntil = now + LOCK_TIME_MS;
      attempts.set(key, state);
      throw new Error("Demasiados intentos fallidos. Cuenta bloqueada por 5 minutos.");
    }
    attempts.set(key, state);
    throw new Error(`Credenciales incorrectas. Te quedan ${MAX_ATTEMPTS - state.count} intento(s).`);
  }

  attempts.delete(key);
  return { id: user.id, name: user.name, email: user.email };
}
