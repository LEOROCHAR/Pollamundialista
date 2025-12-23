"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

type GroupListItem = {
  id: string;
  name: string;
  accessCode: string;
  role: string;
};

export function GroupsClient() {
  const [groups, setGroups] = useState<GroupListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [createName, setCreateName] = useState("");
  const [joinCode, setJoinCode] = useState("");
  const [error, setError] = useState<string | null>(null);

  async function refresh() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/groups", { cache: "no-store" });
      const data = (await res.json()) as { groups: GroupListItem[] };
      setGroups(data.groups ?? []);
    } catch {
      setError("No se pudieron cargar tus grupos.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    refresh();
  }, []);

  const hasGroups = useMemo(() => groups.length > 0, [groups]);

  return (
    <div className="grid gap-6 md:grid-cols-2">
      <section className="rounded-3xl border border-white/10 bg-white/5 p-6">
        <h2 className="text-lg font-bold">Crear grupo</h2>
        <p className="mt-1 text-sm text-white/70">Ej. “Familia Rocha”, “Oficina DataTeam”.</p>
        <form
          className="mt-4 flex gap-2"
          onSubmit={async (e) => {
            e.preventDefault();
            setError(null);
            const res = await fetch("/api/groups", {
              method: "POST",
              headers: { "content-type": "application/json" },
              body: JSON.stringify({ name: createName }),
            });
            if (!res.ok) {
              const data = (await res.json().catch(() => null)) as { error?: string } | null;
              setError(data?.error ?? "No se pudo crear el grupo.");
              return;
            }
            setCreateName("");
            await refresh();
          }}
        >
          <input
            className="w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-sm outline-none ring-emerald-500/40 focus:ring-2"
            placeholder="Nombre del grupo"
            value={createName}
            onChange={(e) => setCreateName(e.target.value)}
            minLength={2}
            required
          />
          <button className="rounded-2xl bg-emerald-600 px-4 py-3 text-sm font-semibold hover:bg-emerald-500">
            Crear
          </button>
        </form>
      </section>

      <section className="rounded-3xl border border-white/10 bg-white/5 p-6">
        <h2 className="text-lg font-bold">Unirse con código</h2>
        <p className="mt-1 text-sm text-white/70">Pega el código (8 caracteres).</p>
        <form
          className="mt-4 flex gap-2"
          onSubmit={async (e) => {
            e.preventDefault();
            setError(null);
            const res = await fetch("/api/groups/join", {
              method: "POST",
              headers: { "content-type": "application/json" },
              body: JSON.stringify({ code: joinCode }),
            });
            const data = (await res.json().catch(() => null)) as { error?: string } | null;
            if (!res.ok) {
              setError(data?.error ?? "No se pudo unir al grupo.");
              return;
            }
            setJoinCode("");
            await refresh();
          }}
        >
          <input
            className="w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-sm uppercase tracking-widest outline-none ring-emerald-500/40 focus:ring-2"
            placeholder="CÓDIGO"
            value={joinCode}
            onChange={(e) => setJoinCode(e.target.value.toUpperCase())}
            minLength={4}
            required
          />
          <button className="rounded-2xl border border-white/15 bg-white/5 px-4 py-3 text-sm font-semibold hover:bg-white/10">
            Unirme
          </button>
        </form>
      </section>

      <section className="md:col-span-2 rounded-3xl border border-white/10 bg-white/5 p-6">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold">Tus grupos</h2>
          <button
            className="rounded-full border border-white/15 bg-white/5 px-4 py-2 text-sm font-semibold hover:bg-white/10 disabled:opacity-60"
            onClick={refresh}
            disabled={loading}
            type="button"
          >
            {loading ? "Actualizando..." : "Actualizar"}
          </button>
        </div>

        {error ? (
          <div className="mt-4 rounded-2xl border border-rose-500/25 bg-rose-500/10 p-3 text-sm text-rose-200">
            {error}
          </div>
        ) : null}

        <div className="mt-4 grid gap-3 md:grid-cols-2">
          {loading ? (
            <div className="text-sm text-white/70">Cargando...</div>
          ) : hasGroups ? (
            groups.map((g) => (
              <Link
                key={g.id}
                href={`/app/groups/${g.id}`}
                className="rounded-3xl border border-white/10 bg-black/20 p-5 hover:bg-black/30"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0">
                    <div className="truncate text-base font-bold">{g.name}</div>
                    <div className="mt-1 text-xs text-white/60">
                      Código: <span className="font-mono">{g.accessCode}</span>
                    </div>
                  </div>
                  <div className="rounded-full bg-white/5 px-2 py-1 text-xs font-semibold text-white/70">
                    {g.role}
                  </div>
                </div>
              </Link>
            ))
          ) : (
            <div className="text-sm text-white/70">Aún no estás en ningún grupo.</div>
          )}
        </div>
      </section>
    </div>
  );
}

