import { NextResponse } from "next/server";
import { z } from "zod";

import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/require-auth";

const schema = z.object({
  code: z.string().min(4).max(20),
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

  const accessCode = parsed.data.code.trim().toUpperCase();
  const group = await prisma.group.findUnique({ where: { accessCode } });
  if (!group) {
    return NextResponse.json({ error: "Código no válido" }, { status: 404 });
  }

  const existing = await prisma.groupMember.findUnique({
    where: { groupId_userId: { groupId: group.id, userId: user.id } },
  });
  if (existing) {
    return NextResponse.json(
      { group: { id: group.id, name: group.name, accessCode: group.accessCode } },
      { status: 200 },
    );
  }

  await prisma.groupMember.create({
    data: {
      groupId: group.id,
      userId: user.id,
      role: "MEMBER",
    },
  });

  return NextResponse.json(
    { group: { id: group.id, name: group.name, accessCode: group.accessCode } },
    { status: 201 },
  );
}

