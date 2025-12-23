import Link from "next/link";
import { getServerSession } from "next-auth";

import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export default async function GroupPage({ params }: { params: Promise<{ groupId: string }> }) {
  const { groupId } = await params;
  const session = await getServerSession(authOptions);
  const userId = session?.user?.id;

  const membership = await prisma.groupMember.findUnique({
    where: { groupId_userId: { groupId, userId: userId! } },
    include: { group: true },
  });
  if (!membership) {
    return (
      <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
        <div className="text-lg font-bold">No tienes acceso a este grupo</div>
        <p className="mt-2 text-sm text-white/70">
          Vuelve a tus{" "}
          <Link href="/app/groups" className="font-semibold text-emerald-200">
            grupos
          </Link>
          .
        </p>
      </div>
    );
  }

  const members = await prisma.groupMember.findMany({
    where: { groupId },
    include: { user: { select: { id: true, name: true, email: true, image: true } } },
  });
  const memberIds = members.map((m) => m.userId);
  const sums = await prisma.prediction.groupBy({
    by: ["userId"],
    where: { userId: { in: memberIds }, pointsAwarded: { not: null } },
    _sum: { pointsAwarded: true },
  });
  const pointsByUserId = Object.fromEntries(
    sums.map((s) => [s.userId, s._sum.pointsAwarded ?? 0]),
  );
  const leaderboard = members
    .map((m) => ({
      userId: m.user.id,
      name: m.user.name ?? m.user.email ?? "Usuario",
      points: pointsByUserId[m.user.id] ?? 0,
      role: m.role,
    }))
    .sort((a, b) => b.points - a.points || a.name.localeCompare(b.name));

  return (
    <div className="space-y-6">
      <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
        <div className="text-sm font-semibold text-emerald-200/90">Grupo</div>
        <h1 className="mt-1 text-3xl font-black tracking-tight">{membership.group.name}</h1>
        <p className="mt-2 text-sm text-white/70">
          Código de acceso:{" "}
          <span className="rounded-full bg-black/20 px-3 py-1 font-mono font-semibold">
            {membership.group.accessCode}
          </span>
        </p>
      </div>

      <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold">Tabla del grupo</h2>
          <Link href="/app/matches" className="text-sm font-semibold text-emerald-200">
            Ir a partidos
          </Link>
        </div>
        <div className="mt-4 overflow-hidden rounded-2xl border border-white/10">
          <div className="grid grid-cols-12 bg-black/20 px-4 py-2 text-xs font-semibold text-white/60">
            <div className="col-span-8">Jugador</div>
            <div className="col-span-2 text-right">Rol</div>
            <div className="col-span-2 text-right">Pts</div>
          </div>
          {leaderboard.map((row) => (
            <div
              key={row.userId}
              className="grid grid-cols-12 items-center border-t border-white/10 px-4 py-3 text-sm"
            >
              <div className="col-span-8 font-semibold">{row.name}</div>
              <div className="col-span-2 text-right text-xs text-white/60">{row.role}</div>
              <div className="col-span-2 text-right font-extrabold text-emerald-200">
                {row.points}
              </div>
            </div>
          ))}
          {!leaderboard.length ? (
            <div className="px-4 py-4 text-sm text-white/70">Sin miembros.</div>
          ) : null}
        </div>
      </div>
    </div>
  );
}

