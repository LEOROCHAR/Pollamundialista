import { NextResponse } from "next/server";
import { z } from "zod";

import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/require-auth";

const schema = z.object({
  status: z.enum(["SCHEDULED", "LIVE", "FINISHED"]).optional(),
  homeScore: z.number().int().min(0).max(20).nullable().optional(),
  awayScore: z.number().int().min(0).max(20).nullable().optional(),
  kickoffAt: z.string().datetime().optional(),
  city: z.string().min(1).max(80).optional(),
  venue: z.string().min(1).max(120).optional(),
  homeTeam: z.string().min(1).max(80).optional(),
  awayTeam: z.string().min(1).max(80).optional(),
  stage: z
    .enum([
      "GROUP",
      "ROUND_OF_32",
      "ROUND_OF_16",
      "QUARTERFINAL",
      "SEMIFINAL",
      "THIRD_PLACE",
      "FINAL",
    ])
    .optional(),
});

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ matchId: string }> },
) {
  await requireAdmin();
  const { matchId } = await params;

  const body = await req.json().catch(() => null);
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Datos inválidos", details: parsed.error.flatten() },
      { status: 400 },
    );
  }

  const updated = await prisma.match.update({
    where: { id: matchId },
    data: {
      ...parsed.data,
      kickoffAt: parsed.data.kickoffAt ? new Date(parsed.data.kickoffAt) : undefined,
    },
  });

  return NextResponse.json({ match: updated });
}

