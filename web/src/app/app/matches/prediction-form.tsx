"use client";

import { useState } from "react";

export function PredictionForm({
  matchId,
  locked,
  initialHome,
  initialAway,
}: {
  matchId: string;
  locked: boolean;
  initialHome: number | null;
  initialAway: number | null;
}) {
  const [home, setHome] = useState<string>(initialHome === null ? "" : String(initialHome));
  const [away, setAway] = useState<string>(initialAway === null ? "" : String(initialAway));
  const [status, setStatus] = useState<"idle" | "saving" | "saved" | "error">("idle");

  async function save() {
    setStatus("saving");
    try {
      const predictedHomeScore = Number(home);
      const predictedAwayScore = Number(away);
      if (!Number.isInteger(predictedHomeScore) || !Number.isInteger(predictedAwayScore)) {
        setStatus("error");
        return;
      }
      const res = await fetch("/api/predictions", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ matchId, predictedHomeScore, predictedAwayScore }),
      });
      if (!res.ok) throw new Error("save failed");
      setStatus("saved");
      setTimeout(() => setStatus("idle"), 1200);
    } catch {
      setStatus("error");
      setTimeout(() => setStatus("idle"), 1800);
    }
  }

  return (
    <div className="flex items-center gap-2">
      <input
        className="h-10 w-14 rounded-xl border border-white/10 bg-black/20 px-2 text-center text-sm outline-none ring-emerald-500/40 focus:ring-2 disabled:opacity-60"
        inputMode="numeric"
        placeholder="-"
        value={home}
        onChange={(e) => setHome(e.target.value.replace(/[^\d]/g, "").slice(0, 2))}
        disabled={locked}
      />
      <span className="text-white/60">-</span>
      <input
        className="h-10 w-14 rounded-xl border border-white/10 bg-black/20 px-2 text-center text-sm outline-none ring-emerald-500/40 focus:ring-2 disabled:opacity-60"
        inputMode="numeric"
        placeholder="-"
        value={away}
        onChange={(e) => setAway(e.target.value.replace(/[^\d]/g, "").slice(0, 2))}
        disabled={locked}
      />
      <button
        className="ml-2 h-10 rounded-xl bg-emerald-600 px-3 text-sm font-semibold text-white hover:bg-emerald-500 disabled:opacity-60"
        onClick={save}
        disabled={locked || status === "saving" || home === "" || away === ""}
        type="button"
      >
        {locked ? "Cerrado" : status === "saving" ? "Guardando..." : "Guardar"}
      </button>
      <span className="text-xs text-white/60">
        {status === "saved" ? "Listo" : status === "error" ? "Error" : ""}
      </span>
    </div>
  );
}

