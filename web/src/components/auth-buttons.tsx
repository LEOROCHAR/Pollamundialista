"use client";

import { signIn, signOut } from "next-auth/react";

export function SignInButton({ callbackUrl }: { callbackUrl?: string }) {
  return (
    <button
      className="rounded-full bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-500"
      onClick={() => signIn(undefined, { callbackUrl })}
      type="button"
    >
      Entrar
    </button>
  );
}

export function SignOutButton() {
  return (
    <button
      className="rounded-full border border-white/15 bg-white/5 px-4 py-2 text-sm font-semibold text-white hover:bg-white/10"
      onClick={() => signOut({ callbackUrl: "/" })}
      type="button"
    >
      Salir
    </button>
  );
}

