import { getServerSession } from "next-auth";
import { CalendarDays } from "lucide-react";

import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { PredictionForm } from "@/app/app/matches/prediction-form";

export default async function MatchesPage() {
  const session = await getServerSession(authOptions);
  const userId = session?.user?.id;

  const matches = await prisma.match.findMany({
    orderBy: { kickoffAt: "asc" },
    include: {
      predictions: userId
        ? { where: { userId }, select: { predictedHomeScore: true, predictedAwayScore: true } }
        : false,
    },
  });

  const now = new Date();

  return (
    <div>
      <div className="flex items-start justify-between gap-6">
        <div>
          <div className="text-sm font-semibold text-emerald-200/90">Partidos</div>
          <h1 className="mt-1 text-3xl font-black tracking-tight">Calendario & pronósticos</h1>
          <p className="mt-2 max-w-2xl text-sm text-white/70">
            Puedes editar tu predicción hasta el inicio del partido. Después, queda bloqueada.
          </p>
        </div>
        <div className="hidden items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white/70 md:flex">
          <CalendarDays className="h-4 w-4 text-emerald-300" />
          API simulada de calendario (seed)
        </div>
      </div>

      <div className="mt-6 space-y-3">
        {matches.map((m) => {
          const pred = Array.isArray(m.predictions) ? m.predictions[0] : null;
          const locked = now >= m.kickoffAt;
          const hasResult = m.homeScore !== null && m.awayScore !== null;

          return (
            <div
              key={m.id}
              className="rounded-3xl border border-white/10 bg-white/5 p-5"
            >
              <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2 text-xs text-white/60">
                    <span className="rounded-full border border-white/10 bg-black/20 px-2 py-1 font-semibold">
                      {m.stage}
                    </span>
                    <span className="rounded-full border border-white/10 bg-black/20 px-2 py-1 font-semibold">
                      {m.status}
                    </span>
                    <span>
                      {m.kickoffAt.toLocaleString("es-ES")} · {m.city ?? "—"} · {m.venue ?? "—"}
                    </span>
                  </div>
                  <div className="mt-2 flex items-center gap-3">
                    <div className="text-lg font-extrabold tracking-tight">
                      {m.homeTeam} <span className="text-white/60">vs</span> {m.awayTeam}
                    </div>
                    {hasResult ? (
                      <div className="rounded-full bg-emerald-500/10 px-3 py-1 text-sm font-bold text-emerald-200 ring-1 ring-emerald-500/20">
                        {m.homeScore} - {m.awayScore}
                      </div>
                    ) : null}
                  </div>
                </div>

                <div className="flex flex-col items-start gap-2 md:items-end">
                  <div className="text-xs font-semibold text-white/60">Tu predicción</div>
                  <PredictionForm
                    matchId={m.id}
                    locked={locked}
                    initialHome={pred?.predictedHomeScore ?? null}
                    initialAway={pred?.predictedAwayScore ?? null}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

