'use client';

import { Suspense, useState } from 'react';
import Link from 'next/link';
import { signIn } from 'next-auth/react';
import { useSearchParams } from 'next/navigation';
import { FaGoogle, FaGithub } from 'react-icons/fa';

function LoginForm() {
  const params = useSearchParams();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const registered = params.get('registered');

  const handleGoogleSignIn = async () => {
    await signIn('google', { callbackUrl: '/dashboard' });
  };

  const handleGitHubSignIn = async () => {
    await signIn('github', { callbackUrl: '/dashboard' });
  };

  const handleCredentials = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    const result = await signIn('credentials', {
      email,
      password,
      redirect: false,
    });
    setLoading(false);

    if (result?.ok && !result.error) {
      // Navegación completa para que el layout (servidor) lea la nueva cookie de sesión
      window.location.href = '/dashboard';
    } else {
      setError(result?.error ?? 'No se pudo iniciar sesión');
    }
  };

  const input = 'border border-gray-300 rounded px-3 py-2 text-gray-800';

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-96">
        <h1 className="text-2xl text-gray-800 font-bold mb-6 text-center">
          Sign In
        </h1>

        {registered && (
          <p className="mb-4 rounded bg-green-100 text-green-800 text-sm p-2 text-center">
            Cuenta creada. Ahora inicia sesión.
          </p>
        )}

        <form onSubmit={handleCredentials} className="flex flex-col gap-3">
          <input
            type="email"
            placeholder="Correo electrónico"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className={input}
          />
          <input
            type="password"
            placeholder="Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className={input}
          />
          {error && (
            <p className="rounded bg-red-100 text-red-700 text-sm p-2">{error}</p>
          )}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-800 transition disabled:opacity-60"
          >
            {loading ? 'Verificando...' : 'Iniciar sesión'}
          </button>
        </form>

        <p className="text-sm text-gray-600 text-center mt-3">
          ¿No tienes cuenta?{' '}
          <Link href="/register" className="text-blue-600 hover:underline">
            Regístrate
          </Link>
        </p>

        <div className="flex items-center gap-2 my-5 text-gray-400 text-xs">
          <span className="flex-1 h-px bg-gray-200" />
          o continúa con
          <span className="flex-1 h-px bg-gray-200" />
        </div>

        <div className="flex flex-col gap-3">
          <button
            onClick={handleGoogleSignIn}
            className="w-full bg-gray-500 text-white py-2 px-4 rounded hover:bg-black transition flex items-center justify-center gap-2"
          >
            <FaGoogle />
            Continue with Google
          </button>
          <button
            onClick={handleGitHubSignIn}
            className="w-full bg-gray-800 text-white py-2 px-4 rounded hover:bg-black transition flex items-center justify-center gap-2"
          >
            <FaGithub />
            Continue with GitHub
          </button>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  );
}
