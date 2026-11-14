import "next-auth";
import "next-auth/jwt";

declare module "next-auth" {
  interface Session {
    /** Proveedor con el que se inició la sesión: google | github | credentials */
    provider?: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    provider?: string;
  }
}
