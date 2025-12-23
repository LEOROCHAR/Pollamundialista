import { getServerSession } from "next-auth";

import { authOptions } from "@/lib/auth";
import { AdminRulesClient } from "@/app/admin/rules/rules-client";

export default async function AdminRulesPage() {
  const session = await getServerSession(authOptions);
  if (session?.user?.role !== "ADMIN") {
    return (
      <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
        <div className="text-lg font-bold">Acceso restringido</div>
        <p className="mt-2 text-sm text-white/70">Necesitas rol ADMIN.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <div className="text-sm font-semibold text-emerald-200/90">Admin · Reglas</div>
        <h1 className="mt-1 text-3xl font-black tracking-tight">Reglas de puntuación</h1>
        <p className="mt-2 max-w-2xl text-sm text-white/70">
          Ajusta la puntuación base y bonus por fase. Si cambias reglas, recalcula puntos desde
          Admin · Partidos.
        </p>
      </div>

      <AdminRulesClient />
    </div>
  );
}

