import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import Image from 'next/image';

const providerName: Record<string, string> = {
  google: 'Google',
  github: 'GitHub',
  credentials: 'Credenciales',
};

export default async function ProfilePage() {
  const session = await getServerSession(authOptions);
  const name = session?.user?.name ?? '—';
  const initials = name
    .split(/\s+/)
    .slice(0, 2)
    .map((p) => p[0])
    .join('')
    .toUpperCase();
  const provider = session?.provider ? providerName[session.provider] ?? session.provider : '—';

  return (
    <div className="flex-1 w-full max-w-5xl mx-auto px-6 py-10 lg:py-14">
      <h1 className="font-display text-4xl font-semibold tracking-tight">Perfil</h1>
      <p className="mt-2 text-muted max-w-2xl leading-relaxed">
        Estos datos no vienen de un formulario: se leen de la sesión que el
        proveedor de identidad firmó al autenticarte.
      </p>

      {/* Credencial del usuario */}
      <div className="card-in mt-10 max-w-xl bg-surface border border-line rounded-2xl overflow-hidden shadow-[0_16px_40px_-20px_rgba(16,29,51,0.35)]">
        <div className="bg-ink text-paper px-7 py-4 flex items-center justify-between gap-4">
          <span className="font-display text-lg font-semibold tracking-tight">
            Credencial de acceso
          </span>
          <span className="font-mono text-[11px] opacity-80">MyAuthApp</span>
        </div>
        <div className="px-7 py-6 flex items-center gap-6">
          {session?.user?.image ? (
            <Image
              height={100}
              width={100}
              src={session.user.image}
              alt={`Foto de perfil de ${name}`}
              className="w-20 h-20 rounded-full border border-line"
            />
          ) : (
            <span
              aria-hidden
              className="w-20 h-20 rounded-full bg-paper border border-line font-display text-2xl font-semibold flex items-center justify-center"
            >
              {initials}
            </span>
          )}
          <div className="min-w-0">
            <p className="font-display text-2xl font-semibold tracking-tight truncate">
              {name}
            </p>
            <p className="text-muted text-sm break-all">{session?.user?.email}</p>
            <span className="mt-2 inline-flex items-center gap-2 rounded-full bg-granted-bg text-granted text-xs px-3 py-1">
              <span className="w-1.5 h-1.5 rounded-full bg-granted" aria-hidden />
              Sesión activa
            </span>
          </div>
        </div>
        <div className="border-t border-line px-7 py-3.5 flex flex-wrap justify-between gap-2 font-mono text-[12px] text-muted">
          <span>emitida por: {provider}</span>
          <span>verificación: JWT firmado</span>
        </div>
      </div>
    </div>
  );
}
