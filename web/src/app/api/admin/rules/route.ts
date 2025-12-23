import { NextResponse } from "next/server";
import { z } from "zod";

import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/require-auth";

const schema = z.object({
  pointsCorrectOutcome: z.number().int().min(0).max(20).optional(),
  pointsExactScore: z.number().int().min(0).max(50).optional(),
  bonusByStage: z.record(z.string(), z.number().int().min(0).max(50)).optional(),
});

export async function GET() {
  await requireAdmin();
  const rules = await prisma.scoringRuleset.findFirst({
    where: { isActive: true },
    orderBy: { updatedAt: "desc" },
  });
  return NextResponse.json({ rules });
}

export async function PATCH(req: Request) {
  await requireAdmin();

  const body = await req.json().catch(() => null);
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Datos inválidos", details: parsed.error.flatten() },
      { status: 400 },
    );
  }

  const rules = await prisma.scoringRuleset.findFirst({
    where: { isActive: true },
    orderBy: { updatedAt: "desc" },
  });
  if (!rules) {
    return NextResponse.json({ error: "No hay reglas activas" }, { status: 400 });
  }

  const updated = await prisma.scoringRuleset.update({
    where: { id: rules.id },
    data: {
      ...parsed.data,
      bonusByStage: parsed.data.bonusByStage ?? undefined,
    },
  });

  return NextResponse.json({ rules: updated });
}

