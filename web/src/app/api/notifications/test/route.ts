import { NextResponse } from "next/server";
import { z } from "zod";

import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/require-auth";
import { sendTestEmail, sendTestPush } from "@/lib/notifications";

const schema = z.object({
  channel: z.enum(["email", "push"]),
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

  try {
    if (parsed.data.channel === "email") {
      if (!user.email) {
        return NextResponse.json({ error: "Tu cuenta no tiene email" }, { status: 400 });
      }
      await sendTestEmail(user.email);
      return NextResponse.json({ ok: true });
    }

    const sub = await prisma.pushSubscription.findFirst({
      where: { userId: user.id },
      orderBy: { createdAt: "desc" },
    });
    if (!sub) {
      return NextResponse.json(
        { error: "No hay suscripción push registrada para este usuario" },
        { status: 400 },
      );
    }
    await sendTestPush({ endpoint: sub.endpoint, keys: { p256dh: sub.p256dh, auth: sub.auth } });
    return NextResponse.json({ ok: true });
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Error enviando notificación" },
      { status: 500 },
    );
  }
}

