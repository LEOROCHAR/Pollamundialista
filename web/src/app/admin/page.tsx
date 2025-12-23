import Link from "next/link";
import { getServerSession } from "next-auth";
import { Settings, CalendarDays, Trophy } from "lucide-react";

import { authOptions } from "@/lib/auth";

export default async function AdminHomePage() {
  const session = await getServerSession(authOptions);
  if (session?.user?.role !== "ADMIN") {
    return (
      <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
        <div className="text-lg font-bold">Acceso restringido</div>
        <p className="mt-2 text-sm text-white/70">
          Necesitas rol <span className="font-mono">ADMIN</span>.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <div className="text-sm font-semibold text-emerald-200/90">Admin</div>
        <h1 className="mt-1 text-3xl font-black tracking-tight">Panel de administración</h1>
        <p className="mt-2 max-w-2xl text-sm text-white/70">
          Gestiona partidos, resultados, reglas de puntuación y re-cálculo de puntos.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <AdminCard
          href="/admin/matches"
          title="Partidos"
          subtitle="Crear/editar y cargar resultados."
          icon={<CalendarDays className="h-5 w-5 text-emerald-300" />}
        />
        <AdminCard
          href="/admin/rules"
          title="Reglas"
          subtitle="Puntuación y bonus por fase."
          icon={<Settings className="h-5 w-5 text-emerald-300" />}
        />
        <AdminCard
          href="/admin/matches"
          title="Scoring"
          subtitle="Recalcular puntos tras resultados."
          icon={<Trophy className="h-5 w-5 text-emerald-300" />}
        />
      </div>
    </div>
  );
}

function AdminCard({
  href,
  title,
  subtitle,
  icon,
}: {
  href: string;
  title: string;
  subtitle: string;
  icon: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className="rounded-3xl border border-white/10 bg-white/5 p-6 hover:bg-white/10"
    >
      <div className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-emerald-500/10 ring-1 ring-emerald-500/20">
        {icon}
      </div>
      <div className="mt-4 text-lg font-bold">{title}</div>
      <div className="mt-1 text-sm text-white/70">{subtitle}</div>
    </Link>
  );
}

