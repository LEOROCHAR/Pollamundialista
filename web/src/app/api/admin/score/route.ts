import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/require-auth";

function outcome(home: number, away: number) {
  if (home > away) return "HOME";
  if (home < away) return "AWAY";
  return "DRAW";
}

export async function POST() {
  await requireAdmin();

  const rules = await prisma.scoringRuleset.findFirst({
    where: { isActive: true },
    orderBy: { updatedAt: "desc" },
  });
  if (!rules) {
    return NextResponse.json({ error: "No hay reglas activas" }, { status: 400 });
  }

  const finishedMatches = await prisma.match.findMany({
    where: {
      status: "FINISHED",
      homeScore: { not: null },
      awayScore: { not: null },
    },
    select: { id: true, stage: true, homeScore: true, awayScore: true },
  });

  const bonusByStage = (rules.bonusByStage as Record<string, unknown> | null) ?? {};

  const now = new Date();
  let updated = 0;

  for (const match of finishedMatches) {
    const actualOutcome = outcome(match.homeScore!, match.awayScore!);
    const stageBonus =
      typeof bonusByStage[match.stage] === "number" ? (bonusByStage[match.stage] as number) : 0;

    const predictions = await prisma.prediction.findMany({
      where: { matchId: match.id },
      select: { id: true, predictedHomeScore: true, predictedAwayScore: true },
    });

    const updates = predictions.map((p) => {
      const isExact =
        p.predictedHomeScore === match.homeScore && p.predictedAwayScore === match.awayScore;
      const isOutcomeCorrect =
        outcome(p.predictedHomeScore, p.predictedAwayScore) === actualOutcome;

      let base = 0;
      if (isExact) base = rules.pointsExactScore;
      else if (isOutcomeCorrect) base = rules.pointsCorrectOutcome;

      const points = base > 0 ? base + stageBonus : 0;

      return prisma.prediction.update({
        where: { id: p.id },
        data: { pointsAwarded: points, scoredAt: now },
      });
    });

    await prisma.$transaction(updates);
    updated += updates.length;
  }

  return NextResponse.json({ ok: true, updatedPredictions: updated });
}

