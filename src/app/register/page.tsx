'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import AuthShell from '@/components/AuthShell';

const inputCls =
  'w-full border border-line rounded-md px-3.5 py-2.5 text-ink bg-surface placeholder:text-muted/70 focus:border-cobalt transition-colors';

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const update = (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (form.password !== form.confirm) {
      setError('Las contraseñas no coinciden. Escribe la misma en ambos campos.');
      return;
    }
    setLoading(true);
    const res = await fetch('/api/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: form.name, email: form.email, password: form.password }),
    });
    setLoading(false);
    if (res.ok) {
      router.push('/signIn?registered=1');
    } else {
      const data = await res.json().catch(() => ({}));
      setError(data.error ?? 'No se pudo registrar');
    }
  };

  const field = (
    name: 'name' | 'email' | 'password' | 'confirm',
    label: string,
    type: string,
    placeholder: string,
    minLength?: number,
  ) => (
    <label className="text-sm">
      <span className="block mb-1.5 text-muted">{label}</span>
      <input
        name={name}
        type={type}
        placeholder={placeholder}
        value={form[name]}
        onChange={update}
        required
        minLength={minLength}
        className={inputCls}
      />
    </label>
  );

  return (
    <AuthShell
      title="Crea tu credencial"
      lead="Tu contraseña nunca se guarda en texto plano: antes de almacenarse se cifra con bcrypt, de modo que ni siquiera el servidor puede leerla."
    >
      <h2 className="font-display text-2xl font-semibold tracking-tight mb-5">
        Registro
      </h2>
      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        {field('name', 'Nombre completo', 'text', 'Nombre y apellidos')}
        {field('email', 'Correo electrónico', 'email', 'nombre@tecsup.edu.pe')}
        {field('password', 'Contraseña', 'password', 'Mínimo 8 caracteres', 8)}
        {field('confirm', 'Confirmar contraseña', 'password', 'Repite la contraseña')}
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
          {loading ? 'Registrando…' : 'Crear cuenta'}
        </button>
      </form>
      <p className="text-sm text-muted text-center mt-4">
        ¿Ya tienes cuenta?{' '}
        <Link href="/signIn" className="text-cobalt hover:underline">
          Inicia sesión
        </Link>
      </p>
    </AuthShell>
  );
}
