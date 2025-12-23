import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";

export async function GET() {
  const sums = await prisma.prediction.groupBy({
    by: ["userId"],
    where: { pointsAwarded: { not: null } },
    _sum: { pointsAwarded: true },
    orderBy: { _sum: { pointsAwarded: "desc" } },
    take: 50,
  });

  const users = await prisma.user.findMany({
    where: { id: { in: sums.map((s) => s.userId) } },
    select: { id: true, name: true, email: true, image: true },
  });
  const byId = Object.fromEntries(users.map((u) => [u.id, u]));

  return NextResponse.json({
    leaderboard: sums.map((s) => ({
      userId: s.userId,
      name: byId[s.userId]?.name ?? byId[s.userId]?.email ?? "Usuario",
      image: byId[s.userId]?.image ?? null,
      points: s._sum.pointsAwarded ?? 0,
    })),
  });
}

