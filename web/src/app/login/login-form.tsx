"use client";

import { useMemo, useState } from "react";
import { signIn } from "next-auth/react";

export function LoginForm({ error }: { error?: string }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const errorText = useMemo(() => {
    if (!error) return null;
    if (error === "CredentialsSignin") return "Email o contraseña incorrectos.";
    return "No se pudo iniciar sesión. Reintenta.";
  }, [error]);

  return (
    <div className="mx-auto w-full max-w-md rounded-3xl border border-white/10 bg-white/5 p-6">
      <h1 className="text-2xl font-black tracking-tight">Iniciar sesión</h1>
      <p className="mt-2 text-sm text-white/70">Entra para crear grupos y dejar tus pronósticos.</p>

      {errorText ? (
        <div className="mt-4 rounded-2xl border border-rose-500/25 bg-rose-500/10 p-3 text-sm text-rose-200">
          {errorText}
        </div>
      ) : null}

      <form
        className="mt-6 space-y-3"
        onSubmit={async (e) => {
          e.preventDefault();
          setLoading(true);
          try {
            await signIn("credentials", {
              email,
              password,
              callbackUrl: "/app",
            });
          } finally {
            setLoading(false);
          }
        }}
      >
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
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </label>

        <button
          className="mt-2 w-full rounded-2xl bg-emerald-600 px-4 py-3 text-sm font-semibold text-white hover:bg-emerald-500 disabled:opacity-60"
          disabled={loading}
          type="submit"
        >
          {loading ? "Entrando..." : "Entrar"}
        </button>
      </form>

      <div className="mt-4">
        <button
          className="w-full rounded-2xl border border-white/15 bg-white/5 px-4 py-3 text-sm font-semibold text-white hover:bg-white/10"
          onClick={() => signIn("google", { callbackUrl: "/app" })}
          type="button"
        >
          Entrar con Google (opcional)
        </button>
      </div>
    </div>
  );
}

