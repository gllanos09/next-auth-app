import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

const providerName: Record<string, string> = {
  google: 'Google (OAuth 2.0)',
  github: 'GitHub (OAuth 2.0)',
  credentials: 'Credenciales (bcrypt)',
};

const flow: [string, string][] = [
  ['Solicitud', 'Pediste una ruta protegida y el proxy comprobó tu cookie de sesión.'],
  ['Identificación', 'Te autenticaste con un proveedor: Google, GitHub o credenciales.'],
  ['Callback', 'NextAuth verificó la respuesta en /api/auth/callback y creó el JWT.'],
  ['Sesión activa', 'Cada página del servidor lee tu sesión con getServerSession().'],
];

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);
  const provider = session?.provider ? providerName[session.provider] ?? session.provider : '—';

  return (
    <div className="flex-1 w-full max-w-5xl mx-auto px-6 py-10 lg:py-14">
      <div className="flex flex-wrap items-baseline justify-between gap-3">
        <h1 className="font-display text-4xl font-semibold tracking-tight">
          Bienvenido, {session?.user?.name}
        </h1>
        <span className="inline-flex items-center gap-2 rounded-full bg-granted-bg text-granted text-sm px-3.5 py-1">
          <span className="w-2 h-2 rounded-full bg-granted" aria-hidden />
          Acceso concedido
        </span>
      </div>
      <p className="mt-2 text-muted max-w-2xl leading-relaxed">
        Esta página solo existe para sesiones válidas: el proxy la bloquea antes de
        renderizarse si no hay un JWT firmado en la cookie.
      </p>

      <div className="mt-10 grid md:grid-cols-[1fr_1.3fr] gap-8 items-start">
        <section className="card-in bg-surface border border-line rounded-xl p-6">
          <h2 className="font-display text-xl font-semibold tracking-tight">
            Tu sesión
          </h2>
          <dl className="mt-4 divide-y divide-line font-mono text-[13px]">
            <div className="py-2.5 flex justify-between gap-4">
              <dt className="text-muted">usuario</dt>
              <dd className="text-right break-all">{session?.user?.name ?? '—'}</dd>
            </div>
            <div className="py-2.5 flex justify-between gap-4">
              <dt className="text-muted">correo</dt>
              <dd className="text-right break-all">{session?.user?.email ?? '—'}</dd>
            </div>
            <div className="py-2.5 flex justify-between gap-4">
              <dt className="text-muted">proveedor</dt>
              <dd className="text-right">{provider}</dd>
            </div>
            <div className="py-2.5 flex justify-between gap-4">
              <dt className="text-muted">estrategia</dt>
              <dd className="text-right">JWT</dd>
            </div>
          </dl>
        </section>

        <section>
          <h2 className="font-display text-xl font-semibold tracking-tight">
            Cómo llegaste hasta aquí
          </h2>
          <ol className="mt-4 border-l border-line">
            {flow.map(([t, d], i) => (
              <li key={t} className="relative pl-8 pb-6 last:pb-0">
                <span
                  aria-hidden
                  className="absolute -left-[13px] top-0 w-[26px] h-[26px] rounded-full bg-ink text-paper font-mono text-xs flex items-center justify-center"
                >
                  {i + 1}
                </span>
                <h3 className="font-medium leading-[26px]">{t}</h3>
                <p className="text-sm text-muted mt-0.5 leading-relaxed">{d}</p>
              </li>
            ))}
          </ol>
        </section>
      </div>
    </div>
  );
}
