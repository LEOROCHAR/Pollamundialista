"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";

export function RegisterForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  return (
    <div className="mx-auto w-full max-w-md rounded-3xl border border-white/10 bg-white/5 p-6">
      <h1 className="text-2xl font-black tracking-tight">Crear cuenta</h1>
      <p className="mt-2 text-sm text-white/70">En menos de 1 minuto estás dentro.</p>

      {error ? (
        <div className="mt-4 rounded-2xl border border-rose-500/25 bg-rose-500/10 p-3 text-sm text-rose-200">
          {error}
        </div>
      ) : null}

      <form
        className="mt-6 space-y-3"
        onSubmit={async (e) => {
          e.preventDefault();
          setError(null);
          setLoading(true);
          try {
            const res = await fetch("/api/register", {
              method: "POST",
              headers: { "content-type": "application/json" },
              body: JSON.stringify({ name: name.trim() || undefined, email, password }),
            });
            if (!res.ok) {
              const data = (await res.json().catch(() => null)) as { error?: string } | null;
              setError(data?.error ?? "No se pudo crear la cuenta.");
              return;
            }
            await signIn("credentials", { email, password, callbackUrl: "/app" });
          } finally {
            setLoading(false);
          }
        }}
      >
        <label className="block text-sm font-semibold text-white/90">
          Nombre (opcional)
          <input
            className="mt-1 w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-sm outline-none ring-emerald-500/40 focus:ring-2"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Ej. Ana Rocha"
          />
        </label>

        <label className="block text-sm font-semibold text-white/90">
          Email
          <input
            className="mt-1 w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-sm outline-none ring-emerald-500/40 focus:ring-2"
            type="email"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </label>

        <label className="block text-sm font-semibold text-white/90">
          Contraseña
          <input
            className="mt-1 w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-sm outline-none ring-emerald-500/40 focus:ring-2"
            type="password"
            autoComplete="new-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={8}
          />
        </label>

        <button
          className="mt-2 w-full rounded-2xl bg-emerald-600 px-4 py-3 text-sm font-semibold text-white hover:bg-emerald-500 disabled:opacity-60"
          disabled={loading}
          type="submit"
        >
          {loading ? "Creando..." : "Crear cuenta"}
        </button>
      </form>
    </div>
  );
}

