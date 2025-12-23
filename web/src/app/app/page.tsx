import Link from "next/link";
import { getServerSession } from "next-auth";
import { CalendarDays, Users, Trophy } from "lucide-react";

import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export default async function AppHomePage() {
  const session = await getServerSession(authOptions);
  const userId = session?.user?.id;

  const [memberships, upcoming] = await Promise.all([
    prisma.groupMember.findMany({
      where: { userId },
      include: { group: true },
      orderBy: { joinedAt: "desc" },
      take: 6,
    }),
    prisma.match.findMany({
      where: { kickoffAt: { gte: new Date() } },
      orderBy: { kickoffAt: "asc" },
      take: 5,
    }),
  ]);

  return (
    <div className="space-y-8">
      <div>
        <div className="text-sm font-semibold text-emerald-200/90">Dashboard</div>
        <h1 className="mt-1 text-3xl font-black tracking-tight">Tu Mundial, tu liga.</h1>
        <p className="mt-2 max-w-2xl text-sm text-white/70">
          Crea o únete a grupos, deja tus predicciones y sigue las tablas. Las predicciones se
          cierran al inicio de cada partido.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card
          icon={<Users className="h-5 w-5 text-emerald-300" />}
          title="Grupos"
          subtitle="Crea o únete con un código."
          href="/app/groups"
          cta="Gestionar grupos"
        />
        <Card
          icon={<CalendarDays className="h-5 w-5 text-emerald-300" />}
          title="Partidos"
          subtitle="Pronósticos + calendario."
          href="/app/matches"
          cta="Ver partidos"
        />
        <Card
          icon={<Trophy className="h-5 w-5 text-emerald-300" />}
          title="Tabla global"
          subtitle="Ranking general."
          href="/app/leaderboard"
          cta="Ver ranking"
        />
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <section className="rounded-3xl border border-white/10 bg-white/5 p-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold">Tus grupos</h2>
            <Link href="/app/groups" className="text-sm font-semibold text-emerald-200">
              Ver todos
            </Link>
          </div>
          <div className="mt-4 space-y-2">
            {memberships.length ? (
              memberships.map((m) => (
                <Link
                  key={m.groupId}
                  href={`/app/groups/${m.groupId}`}
                  className="flex items-center justify-between rounded-2xl border border-white/10 bg-black/20 px-4 py-3 hover:bg-black/30"
                >
                  <div>
                    <div className="font-semibold">{m.group.name}</div>
                    <div className="text-xs text-white/60">
                      Código: <span className="font-mono">{m.group.accessCode}</span>
                    </div>
                  </div>
                  <div className="text-xs font-semibold text-white/70">{m.role}</div>
                </Link>
              ))
            ) : (
              <div className="text-sm text-white/70">
                Aún no estás en ningún grupo.{" "}
                <Link href="/app/groups" className="font-semibold text-emerald-200">
                  Crea o únete
                </Link>
                .
              </div>
            )}
          </div>
        </section>

        <section className="rounded-3xl border border-white/10 bg-white/5 p-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold">Próximos partidos</h2>
            <Link href="/app/matches" className="text-sm font-semibold text-emerald-200">
              Ver todos
            </Link>
          </div>
          <div className="mt-4 space-y-2">
            {upcoming.map((m) => (
              <Link
                key={m.id}
                href="/app/matches"
                className="block rounded-2xl border border-white/10 bg-black/20 px-4 py-3 hover:bg-black/30"
              >
                <div className="flex items-center justify-between gap-4">
                  <div className="font-semibold">
                    {m.homeTeam} vs {m.awayTeam}
                  </div>
                  <div className="text-xs text-white/60">{m.stage}</div>
                </div>
                <div className="mt-1 text-xs text-white/60">
                  {m.kickoffAt.toLocaleString("es-ES")}
                </div>
              </Link>
            ))}
            {!upcoming.length ? (
              <div className="text-sm text-white/70">No hay partidos cargados aún.</div>
            ) : null}
          </div>
        </section>
      </div>
    </div>
  );
}

function Card({
  icon,
  title,
  subtitle,
  href,
  cta,
}: {
  icon: React.ReactNode;
  title: string;
  subtitle: string;
  href: string;
  cta: string;
}) {
  return (
    <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
      <div className="flex items-start justify-between">
        <div className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-emerald-500/10 ring-1 ring-emerald-500/20">
          {icon}
        </div>
      </div>
      <div className="mt-4">
        <div className="text-lg font-bold">{title}</div>
        <div className="mt-1 text-sm text-white/70">{subtitle}</div>
      </div>
      <div className="mt-5">
        <Link
          href={href}
          className="inline-flex rounded-full bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-500"
        >
          {cta}
        </Link>
      </div>
    </div>
  );
}

