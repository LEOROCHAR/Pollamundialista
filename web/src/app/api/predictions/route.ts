import { NextResponse } from "next/server";
import { z } from "zod";

import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/require-auth";

const schema = z.object({
  matchId: z.string().min(5),
  predictedHomeScore: z.number().int().min(0).max(20),
  predictedAwayScore: z.number().int().min(0).max(20),
});

export async function POST(req: Request) {
  const user = await requireUser();
  const body = await req.json().catch(() => null);
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Datos inválidos", details: parsed.error.flatten() },
      { status: 400 },
    );
  }

  const match = await prisma.match.findUnique({
    where: { id: parsed.data.matchId },
    select: { id: true, kickoffAt: true },
  });
  if (!match) {
    return NextResponse.json({ error: "Partido no encontrado" }, { status: 404 });
  }

  const now = new Date();
  if (now >= match.kickoffAt) {
    return NextResponse.json(
      { error: "Predicciones cerradas para este partido" },
      { status: 403 },
    );
  }

  const prediction = await prisma.prediction.upsert({
    where: { userId_matchId: { userId: user.id, matchId: match.id } },
    create: {
      userId: user.id,
      matchId: match.id,
      predictedHomeScore: parsed.data.predictedHomeScore,
      predictedAwayScore: parsed.data.predictedAwayScore,
    },
    update: {
      predictedHomeScore: parsed.data.predictedHomeScore,
      predictedAwayScore: parsed.data.predictedAwayScore,
      pointsAwarded: null,
      scoredAt: null,
    },
    select: {
      id: true,
      matchId: true,
      predictedHomeScore: true,
      predictedAwayScore: true,
      updatedAt: true,
    },
  });

  return NextResponse.json({ prediction }, { status: 200 });
}

