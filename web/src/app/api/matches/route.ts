import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";

import { prisma } from "@/lib/prisma";
import { authOptions } from "@/lib/auth";

export async function GET() {
  const session = await getServerSession(authOptions);
  const matches = await prisma.match.findMany({
    orderBy: { kickoffAt: "asc" },
  });

  let predictionsByMatchId: Record<string, { predictedHomeScore: number; predictedAwayScore: number }> =
    {};
  if (session?.user?.id) {
    const preds = await prisma.prediction.findMany({
      where: { userId: session.user.id, matchId: { in: matches.map((m) => m.id) } },
      select: { matchId: true, predictedHomeScore: true, predictedAwayScore: true },
    });
    predictionsByMatchId = Object.fromEntries(
      preds.map((p) => [
        p.matchId,
        { predictedHomeScore: p.predictedHomeScore, predictedAwayScore: p.predictedAwayScore },
      ]),
    );
  }

  return NextResponse.json({
    matches: matches.map((m) => ({
      id: m.id,
      externalId: m.externalId,
      stage: m.stage,
      status: m.status,
      kickoffAt: m.kickoffAt,
      city: m.city,
      venue: m.venue,
      homeTeam: m.homeTeam,
      awayTeam: m.awayTeam,
      homeScore: m.homeScore,
      awayScore: m.awayScore,
      prediction: predictionsByMatchId[m.id] ?? null,
    })),
  });
}

