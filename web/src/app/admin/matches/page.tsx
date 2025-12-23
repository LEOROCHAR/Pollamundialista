import { getServerSession } from "next-auth";

import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { AdminMatchesClient } from "@/app/admin/matches/matches-client";

export default async function AdminMatchesPage() {
  const session = await getServerSession(authOptions);
  if (session?.user?.role !== "ADMIN") {
    return (
      <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
        <div className="text-lg font-bold">Acceso restringido</div>
        <p className="mt-2 text-sm text-white/70">Necesitas rol ADMIN.</p>
      </div>
    );
  }

  const matches = await prisma.match.findMany({
    orderBy: { kickoffAt: "asc" },
  });

  return (
    <div className="space-y-6">
      <div>
        <div className="text-sm font-semibold text-emerald-200/90">Admin · Partidos</div>
        <h1 className="mt-1 text-3xl font-black tracking-tight">Editar partidos y resultados</h1>
        <p className="mt-2 max-w-2xl text-sm text-white/70">
          Cambia el marcador y el estado. Luego recalcula para reflejar puntos en tablas.
        </p>
      </div>

      <AdminMatchesClient
        initial={matches.map((m) => ({
          id: m.id,
          stage: m.stage,
          status: m.status,
          kickoffAt: m.kickoffAt.toISOString(),
          homeTeam: m.homeTeam,
          awayTeam: m.awayTeam,
          homeScore: m.homeScore,
          awayScore: m.awayScore,
        }))}
      />
    </div>
  );
}

