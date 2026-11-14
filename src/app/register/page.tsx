'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

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
      setError('Las contraseñas no coinciden');
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

  const input = 'border border-gray-300 rounded px-3 py-2 text-gray-800';

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-96">
        <h1 className="text-2xl text-gray-800 font-bold mb-6 text-center">Registro</h1>
        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <input name="name" placeholder="Nombre completo" value={form.name} onChange={update} required className={input} />
          <input name="email" type="email" placeholder="Correo electrónico" value={form.email} onChange={update} required className={input} />
          <input name="password" type="password" placeholder="Contraseña (mín. 8 caracteres)" value={form.password} onChange={update} required minLength={8} className={input} />
          <input name="confirm" type="password" placeholder="Confirmar contraseña" value={form.confirm} onChange={update} required className={input} />
          {error && <p className="rounded bg-red-100 text-red-700 text-sm p-2">{error}</p>}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-800 transition disabled:opacity-60"
          >
            {loading ? 'Registrando...' : 'Crear cuenta'}
          </button>
        </form>
        <p className="text-sm text-gray-600 text-center mt-3">
          ¿Ya tienes cuenta?{' '}
          <Link href="/signIn" className="text-blue-600 hover:underline">Inicia sesión</Link>
        </p>
      </div>
    </div>
  );
}
