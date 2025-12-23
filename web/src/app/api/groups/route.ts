import { NextResponse } from "next/server";
import { z } from "zod";

import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/require-auth";
import { generateAccessCode } from "@/lib/access-code";

const createSchema = z.object({
  name: z.string().min(2).max(80),
});

export async function GET() {
  const user = await requireUser();

  const memberships = await prisma.groupMember.findMany({
    where: { userId: user.id },
    include: {
      group: true,
    },
    orderBy: { joinedAt: "desc" },
  });

  return NextResponse.json({
    groups: memberships.map((m) => ({
      id: m.group.id,
      name: m.group.name,
      accessCode: m.group.accessCode,
      role: m.role,
      joinedAt: m.joinedAt,
    })),
  });
}

export async function POST(req: Request) {
  const user = await requireUser();
  const body = await req.json().catch(() => null);
  const parsed = createSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Datos inválidos", details: parsed.error.flatten() },
      { status: 400 },
    );
  }

  // Retry in case of rare code collision
  for (let i = 0; i < 5; i++) {
    const accessCode = generateAccessCode();
    try {
      const group = await prisma.$transaction(async (tx) => {
        const created = await tx.group.create({
          data: {
            name: parsed.data.name,
            accessCode,
            createdById: user.id,
          },
        });
        await tx.groupMember.create({
          data: {
            groupId: created.id,
            userId: user.id,
            role: "OWNER",
          },
        });
        return created;
      });

      return NextResponse.json(
        { group: { id: group.id, name: group.name, accessCode: group.accessCode } },
        { status: 201 },
      );
    } catch {
      // code collision -> retry
    }
  }

  return NextResponse.json(
    { error: "No se pudo crear el grupo. Reintenta." },
    { status: 500 },
  );
}

