import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/require-auth";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ groupId: string }> },
) {
  const user = await requireUser();
  const { groupId } = await params;

  const membership = await prisma.groupMember.findUnique({
    where: { groupId_userId: { groupId, userId: user.id } },
    include: { group: true },
  });
  if (!membership) {
    return NextResponse.json({ error: "No perteneces a este grupo" }, { status: 403 });
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
      image: m.user.image,
      groupRole: m.role,
      points: pointsByUserId[m.user.id] ?? 0,
    }))
    .sort((a, b) => b.points - a.points || a.name.localeCompare(b.name));

  return NextResponse.json({
    group: { id: membership.group.id, name: membership.group.name },
    leaderboard,
  });
}

