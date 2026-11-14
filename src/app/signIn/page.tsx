'use client';

import { Suspense, useState } from 'react';
import Link from 'next/link';
import { signIn } from 'next-auth/react';
import { useSearchParams } from 'next/navigation';
import { FaGoogle, FaGithub } from 'react-icons/fa';
import AuthShell from '@/components/AuthShell';

const inputCls =
  'w-full border border-line rounded-md px-3.5 py-2.5 text-ink bg-surface placeholder:text-muted/70 focus:border-cobalt transition-colors';

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

  return (
    <AuthShell
      title="Identifícate para continuar"
      lead="El acceso al panel está restringido. Entra con tu correo y contraseña, o con tu cuenta de Google o GitHub mediante OAuth 2.0."
    >
      <h2 className="font-display text-2xl font-semibold tracking-tight mb-5">
        Iniciar sesión
      </h2>

      {registered && (
        <p
          role="status"
          className="mb-4 rounded-md bg-granted-bg text-granted text-sm px-3 py-2.5"
        >
          Cuenta creada correctamente. Ahora inicia sesión.
        </p>
      )}

      <form onSubmit={handleCredentials} className="flex flex-col gap-3">
        <label className="text-sm">
          <span className="block mb-1.5 text-muted">Correo electrónico</span>
          <input
            type="email"
            placeholder="nombre@tecsup.edu.pe"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className={inputCls}
          />
        </label>
        <label className="text-sm">
          <span className="block mb-1.5 text-muted">Contraseña</span>
          <input
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className={inputCls}
          />
        </label>
        {error && (
          <p
            role="alert"
            className="rounded-md bg-denied-bg text-denied text-sm px-3 py-2.5"
          >
            {error}
          </p>
        )}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-ink text-paper py-2.5 px-4 rounded-md hover:bg-cobalt transition-colors disabled:opacity-60 mt-1"
        >
          {loading ? 'Verificando…' : 'Entrar'}
        </button>
      </form>

      <p className="text-sm text-muted text-center mt-4">
        ¿No tienes cuenta?{' '}
        <Link href="/register" className="text-cobalt hover:underline">
          Regístrate
        </Link>
      </p>

      <div className="flex items-center gap-3 my-5 text-muted text-xs">
        <span className="flex-1 h-px bg-line" aria-hidden />
        o continúa con
        <span className="flex-1 h-px bg-line" aria-hidden />
      </div>

      <div className="flex flex-col gap-2.5">
        <button
          onClick={handleGoogleSignIn}
          className="w-full border border-line text-ink py-2.5 px-4 rounded-md hover:border-ink transition-colors flex items-center justify-center gap-2.5"
        >
          <FaGoogle aria-hidden />
          Continue with Google
        </button>
        <button
          onClick={handleGitHubSignIn}
          className="w-full border border-line text-ink py-2.5 px-4 rounded-md hover:border-ink transition-colors flex items-center justify-center gap-2.5"
        >
          <FaGithub aria-hidden />
          Continue with GitHub
        </button>
      </div>
    </AuthShell>
  );
}

export default function LoginPage() {
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  );
}
