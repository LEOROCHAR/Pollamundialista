"use client";

import { useEffect, useState } from "react";

type Rules = {
  id: string;
  pointsCorrectOutcome: number;
  pointsExactScore: number;
  bonusByStage: Record<string, number> | null;
};

export function AdminRulesClient() {
  const [rules, setRules] = useState<Rules | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [bonusJson, setBonusJson] = useState("{}");

  async function load() {
    setLoading(true);
    setMessage(null);
    const res = await fetch("/api/admin/rules", { cache: "no-store" });
    const data = (await res.json().catch(() => null)) as { rules?: Rules; error?: string } | null;
    if (!res.ok) {
      setMessage(data?.error ?? "No se pudieron cargar las reglas.");
      setLoading(false);
      return;
    }
    if (data?.rules) {
      setRules(data.rules);
      setBonusJson(JSON.stringify(data.rules.bonusByStage ?? {}, null, 2));
    }
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, []);

  async function save() {
    if (!rules) return;
    setSaving(true);
    setMessage(null);
    try {
      const parsedBonus = JSON.parse(bonusJson) as Record<string, number>;
      const res = await fetch("/api/admin/rules", {
        method: "PATCH",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          pointsCorrectOutcome: rules.pointsCorrectOutcome,
          pointsExactScore: rules.pointsExactScore,
          bonusByStage: parsedBonus,
        }),
      });
      const data = (await res.json().catch(() => null)) as { rules?: Rules; error?: string } | null;
      if (!res.ok) {
        setMessage(data?.error ?? "No se pudo guardar.");
        return;
      }
      setMessage("Guardado.");
      if (data?.rules) setRules(data.rules);
    } catch {
      setMessage("El JSON de bonus no es válido.");
    } finally {
      setSaving(false);
      setTimeout(() => setMessage(null), 2000);
    }
  }

  if (loading) return <div className="text-sm text-white/70">Cargando reglas...</div>;

  if (!rules) {
    return (
      <div className="rounded-3xl border border-white/10 bg-white/5 p-6 text-sm text-white/70">
        No hay reglas activas.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {message ? (
        <div className="rounded-2xl border border-white/10 bg-black/20 p-3 text-sm text-white/80">
          {message}
        </div>
      ) : null}

      <div className="grid gap-4 md:grid-cols-2">
        <label className="rounded-3xl border border-white/10 bg-white/5 p-6">
          <div className="text-sm font-bold">Puntos por ganador/empate</div>
          <div className="mt-1 text-xs text-white/60">Si acierta el resultado (1X2).</div>
          <input
            className="mt-3 h-11 w-full rounded-2xl border border-white/10 bg-black/20 px-4 text-sm outline-none ring-emerald-500/40 focus:ring-2"
            type="number"
            value={rules.pointsCorrectOutcome}
            onChange={(e) =>
              setRules((r) => (r ? { ...r, pointsCorrectOutcome: Number(e.target.value) } : r))
            }
            min={0}
            max={20}
          />
        </label>

        <label className="rounded-3xl border border-white/10 bg-white/5 p-6">
          <div className="text-sm font-bold">Puntos por marcador exacto</div>
          <div className="mt-1 text-xs text-white/60">Si acierta el score exacto.</div>
          <input
            className="mt-3 h-11 w-full rounded-2xl border border-white/10 bg-black/20 px-4 text-sm outline-none ring-emerald-500/40 focus:ring-2"
            type="number"
            value={rules.pointsExactScore}
            onChange={(e) =>
              setRules((r) => (r ? { ...r, pointsExactScore: Number(e.target.value) } : r))
            }
            min={0}
            max={50}
          />
        </label>
      </div>

      <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
        <div className="text-sm font-bold">Bonus por fase (JSON)</div>
        <div className="mt-1 text-xs text-white/60">
          Se suma al puntaje base cuando hay acierto. Ejemplo:{" "}
          <span className="font-mono">{"{ \"FINAL\": 3, \"SEMIFINAL\": 2 }"}</span>
        </div>
        <textarea
          className="mt-3 h-48 w-full rounded-2xl border border-white/10 bg-black/20 p-4 font-mono text-xs outline-none ring-emerald-500/40 focus:ring-2"
          value={bonusJson}
          onChange={(e) => setBonusJson(e.target.value)}
        />
      </div>

      <div className="flex items-center gap-3">
        <button
          className="rounded-full bg-emerald-600 px-5 py-2 text-sm font-semibold text-white hover:bg-emerald-500 disabled:opacity-60"
          onClick={save}
          disabled={saving}
          type="button"
        >
          {saving ? "Guardando..." : "Guardar reglas"}
        </button>
        <button
          className="rounded-full border border-white/15 bg-white/5 px-5 py-2 text-sm font-semibold text-white hover:bg-white/10"
          onClick={load}
          type="button"
        >
          Recargar
        </button>
      </div>
    </div>
  );
}

