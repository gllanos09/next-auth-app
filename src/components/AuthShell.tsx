/**
 * Marco compartido de las pantallas de acceso: panel informativo a la
 * izquierda (datos reales del laboratorio) y formulario a la derecha.
 */
export default function AuthShell({
  title,
  lead,
  children,
}: {
  title: string;
  lead: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex-1 grid lg:grid-cols-[1.1fr_1fr] max-w-5xl w-full mx-auto px-6 py-10 lg:py-16 gap-10 lg:gap-16 items-center">
      <section className="max-w-md">
        <h1 className="font-display text-4xl lg:text-5xl font-semibold tracking-tight leading-[1.08] text-balance">
          {title}
        </h1>
        <p className="mt-4 text-muted leading-relaxed">{lead}</p>

        <dl className="mt-8 border-t border-line divide-y divide-line font-mono text-[13px]">
          <div className="py-2.5 flex justify-between gap-4">
            <dt className="text-muted">rutas protegidas</dt>
            <dd>/dashboard, /profile</dd>
          </div>
          <div className="py-2.5 flex justify-between gap-4">
            <dt className="text-muted">sesión</dt>
            <dd>JWT firmado</dd>
          </div>
          <div className="py-2.5 flex justify-between gap-4">
            <dt className="text-muted">contraseñas</dt>
            <dd>bcrypt, 10 rondas</dd>
          </div>
          <div className="py-2.5 flex justify-between gap-4">
            <dt className="text-muted">intentos fallidos</dt>
            <dd>3 → bloqueo 5 min</dd>
          </div>
        </dl>
      </section>

      <section className="card-in bg-surface border border-line rounded-xl shadow-[0_12px_32px_-16px_rgba(16,29,51,0.25)] p-7 sm:p-8 w-full max-w-md justify-self-center lg:justify-self-end">
        {children}
      </section>
    </div>
  );
}
