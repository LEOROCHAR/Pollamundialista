import { prisma } from "@/lib/prisma";

export default async function GlobalLeaderboardPage() {
  const sums = await prisma.prediction.groupBy({
    by: ["userId"],
    where: { pointsAwarded: { not: null } },
    _sum: { pointsAwarded: true },
    orderBy: { _sum: { pointsAwarded: "desc" } },
    take: 50,
  });

  const users = await prisma.user.findMany({
    where: { id: { in: sums.map((s) => s.userId) } },
    select: { id: true, name: true, email: true },
  });
  const byId = Object.fromEntries(users.map((u) => [u.id, u]));

  return (
    <div className="space-y-6">
      <div>
        <div className="text-sm font-semibold text-emerald-200/90">Global</div>
        <h1 className="mt-1 text-3xl font-black tracking-tight">Tabla global</h1>
        <p className="mt-2 max-w-2xl text-sm text-white/70">
          Ranking general (suma de puntos de partidos ya puntuados).
        </p>
      </div>

      <div className="overflow-hidden rounded-3xl border border-white/10 bg-white/5">
        <div className="grid grid-cols-12 bg-black/20 px-5 py-3 text-xs font-semibold text-white/60">
          <div className="col-span-2">#</div>
          <div className="col-span-8">Jugador</div>
          <div className="col-span-2 text-right">Pts</div>
        </div>
        {sums.map((row, idx) => (
          <div
            key={row.userId}
            className="grid grid-cols-12 items-center border-t border-white/10 px-5 py-4 text-sm"
          >
            <div className="col-span-2 text-white/60">{idx + 1}</div>
            <div className="col-span-8 font-semibold">
              {byId[row.userId]?.name ?? byId[row.userId]?.email ?? "Usuario"}
            </div>
            <div className="col-span-2 text-right font-extrabold text-emerald-200">
              {row._sum.pointsAwarded ?? 0}
            </div>
          </div>
        ))}
        {!sums.length ? (
          <div className="px-5 py-6 text-sm text-white/70">
            Todavía no hay puntajes (se calculan cuando se cargan resultados).
          </div>
        ) : null}
      </div>
    </div>
  );
}

