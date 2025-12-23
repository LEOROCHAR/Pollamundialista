"use client";

import { useMemo, useState } from "react";

type MatchRow = {
  id: string;
  stage: string;
  status: string;
  kickoffAt: string;
  homeTeam: string;
  awayTeam: string;
  homeScore: number | null;
  awayScore: number | null;
};

export function AdminMatchesClient({ initial }: { initial: MatchRow[] }) {
  const [matches, setMatches] = useState<MatchRow[]>(initial);
  const [savingId, setSavingId] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const sorted = useMemo(
    () => [...matches].sort((a, b) => new Date(a.kickoffAt).getTime() - new Date(b.kickoffAt).getTime()),
    [matches],
  );

  async function save(matchId: string, patch: Partial<MatchRow>) {
    setSavingId(matchId);
    setMessage(null);
    try {
      const res = await fetch(`/api/admin/matches/${matchId}`, {
        method: "PATCH",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(patch),
      });
      if (!res.ok) {
        const data = (await res.json().catch(() => null)) as { error?: string } | null;
        setMessage(data?.error ?? "No se pudo guardar.");
        return;
      }
      const data = (await res.json()) as { match: MatchRow };
      setMatches((prev) => prev.map((m) => (m.id === matchId ? { ...m, ...data.match } : m)));
      setMessage("Guardado.");
    } finally {
      setSavingId(null);
      setTimeout(() => setMessage(null), 1500);
    }
  }

  async function rescore() {
    setMessage(null);
    const res = await fetch("/api/admin/score", { method: "POST" });
    const data = (await res.json().catch(() => null)) as
      | { ok?: boolean; updatedPredictions?: number; error?: string }
      | null;
    if (!res.ok) {
      setMessage(data?.error ?? "No se pudo recalcular.");
      return;
    }
    setMessage(`Puntos recalculados. Predicciones actualizadas: ${data?.updatedPredictions ?? 0}`);
    setTimeout(() => setMessage(null), 2500);
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <button
          className="inline-flex w-fit rounded-full bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-500"
          onClick={rescore}
          type="button"
        >
          Recalcular puntos
        </button>
        {message ? <div className="text-sm text-white/70">{message}</div> : null}
      </div>

      <div className="space-y-3">
        {sorted.map((m) => (
          <div key={m.id} className="rounded-3xl border border-white/10 bg-white/5 p-5">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2 text-xs text-white/60">
                  <span className="rounded-full border border-white/10 bg-black/20 px-2 py-1 font-semibold">
                    {m.stage}
                  </span>
                  <span className="rounded-full border border-white/10 bg-black/20 px-2 py-1 font-semibold">
                    {m.status}
                  </span>
                  <span>{new Date(m.kickoffAt).toLocaleString("es-ES")}</span>
                </div>
                <div className="mt-2 text-lg font-extrabold tracking-tight">
                  {m.homeTeam} vs {m.awayTeam}
                </div>
              </div>

              <div className="flex flex-col items-start gap-2 md:items-end">
                <div className="flex items-center gap-2">
                  <input
                    className="h-10 w-14 rounded-xl border border-white/10 bg-black/20 px-2 text-center text-sm outline-none ring-emerald-500/40 focus:ring-2"
                    inputMode="numeric"
                    value={m.homeScore ?? ""}
                    onChange={(e) =>
                      setMatches((prev) =>
                        prev.map((x) =>
                          x.id === m.id
                            ? { ...x, homeScore: e.target.value === "" ? null : Number(e.target.value) }
                            : x,
                        ),
                      )
                    }
                  />
                  <span className="text-white/60">-</span>
                  <input
                    className="h-10 w-14 rounded-xl border border-white/10 bg-black/20 px-2 text-center text-sm outline-none ring-emerald-500/40 focus:ring-2"
                    inputMode="numeric"
                    value={m.awayScore ?? ""}
                    onChange={(e) =>
                      setMatches((prev) =>
                        prev.map((x) =>
                          x.id === m.id
                            ? { ...x, awayScore: e.target.value === "" ? null : Number(e.target.value) }
                            : x,
                        ),
                      )
                    }
                  />
                  <select
                    className="h-10 rounded-xl border border-white/10 bg-black/20 px-2 text-sm outline-none ring-emerald-500/40 focus:ring-2"
                    value={m.status}
                    onChange={(e) =>
                      setMatches((prev) =>
                        prev.map((x) => (x.id === m.id ? { ...x, status: e.target.value } : x)),
                      )
                    }
                  >
                    <option value="SCHEDULED">SCHEDULED</option>
                    <option value="LIVE">LIVE</option>
                    <option value="FINISHED">FINISHED</option>
                  </select>
                  <button
                    className="h-10 rounded-xl bg-emerald-600 px-3 text-sm font-semibold text-white hover:bg-emerald-500 disabled:opacity-60"
                    onClick={() =>
                      save(m.id, { homeScore: m.homeScore, awayScore: m.awayScore, status: m.status })
                    }
                    disabled={savingId === m.id}
                    type="button"
                  >
                    {savingId === m.id ? "Guardando..." : "Guardar"}
                  </button>
                </div>
                <div className="text-xs text-white/60">Tip: marca FINISHED para puntuar.</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

