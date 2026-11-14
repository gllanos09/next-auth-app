'use client';

import { signOut } from 'next-auth/react';

export default function LogoutButton() {
  return (
    <button
      onClick={() => signOut({ callbackUrl: '/signIn' })}
      className="border border-line text-ink text-sm py-1.5 px-3.5 rounded-md hover:border-denied hover:text-denied transition-colors"
    >
      Cerrar Sesión
    </button>
  );
}
