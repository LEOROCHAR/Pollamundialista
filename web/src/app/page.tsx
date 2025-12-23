import Link from "next/link";
import { Trophy, Users, CalendarDays, Bell, ShieldCheck } from "lucide-react";

export default function Home() {
  return (
    <div className="relative overflow-hidden">
      <div className="pointer-events-none absolute inset-0 opacity-60">
        <div className="absolute -top-40 left-1/2 h-[600px] w-[600px] -translate-x-1/2 rounded-full bg-emerald-500/15 blur-3xl" />
        <div className="absolute -bottom-40 right-0 h-[520px] w-[520px] rounded-full bg-cyan-500/10 blur-3xl" />
      </div>

      <div className="relative">
        <div className="grid gap-10 md:grid-cols-2 md:items-center">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-semibold text-white/80">
              <Trophy className="h-4 w-4 text-emerald-300" />
              Mundial FIFA 2026 · Grupos · Predicciones · Rankings
            </div>

            <h1 className="mt-5 text-4xl font-black tracking-tight md:text-5xl">
              Organiza tu <span className="text-emerald-300">polla mundialista</span> sin caos.
            </h1>
            <p className="mt-4 max-w-xl text-base leading-7 text-white/70">
              Crea grupos con código, registra predicciones antes del kickoff, asigna reglas de
              puntuación y mira tablas por grupo y global (con calendario público o API simulada).
            </p>

            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/app"
                className="inline-flex items-center justify-center rounded-full bg-emerald-600 px-5 py-3 text-sm font-semibold text-white hover:bg-emerald-500"
              >
                Ir al dashboard
              </Link>
              <Link
                href="/register"
                className="inline-flex items-center justify-center rounded-full border border-white/15 bg-white/5 px-5 py-3 text-sm font-semibold text-white hover:bg-white/10"
              >
                Crear cuenta
              </Link>
            </div>
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
            <div className="grid gap-4">
              <Feature
                icon={<Users className="h-5 w-5 text-emerald-300" />}
                title="Grupos con código único"
                description="Invita a “Familia Rocha” u “Oficina DataTeam” con un acceso simple."
              />
              <Feature
                icon={<CalendarDays className="h-5 w-5 text-emerald-300" />}
                title="Calendario y cierre de predicciones"
                description="No se puede cambiar una vez empieza el partido."
              />
              <Feature
                icon={<Bell className="h-5 w-5 text-emerald-300" />}
                title="Notificaciones"
                description="Email/push al cierre, inicio del partido y actualización de puntajes (MVP con stubs)."
              />
              <Feature
                icon={<ShieldCheck className="h-5 w-5 text-emerald-300" />}
                title="Admin y reglas editables"
                description="Editar partidos/resultados y ajustar puntuación, con re-cálculo."
              />
            </div>
          </div>
        </div>

        <div className="mt-12 rounded-3xl border border-white/10 bg-gradient-to-r from-white/5 to-white/0 p-6 text-sm text-white/70">
          Este repo incluye un <b>MVP funcional</b> con datos simulados del Mundial 2026 y una base
          lista para conectar a una API pública oficial cuando exista.
        </div>
      </div>
    </div>
  );
}

function Feature({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="flex items-start gap-3">
      <div className="mt-0.5 inline-flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-500/10 ring-1 ring-emerald-500/20">
        {icon}
      </div>
      <div>
        <div className="text-sm font-semibold text-white">{title}</div>
        <div className="text-sm text-white/65">{description}</div>
      </div>
    </div>
  );
}
