import Link from "next/link";
import { getServerSession } from "next-auth";

import { authOptions } from "@/lib/auth";
import { SignInButton, SignOutButton } from "@/components/auth-buttons";

export async function Navbar() {
  const session = await getServerSession(authOptions);
  const user = session?.user;

  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-gradient-to-r from-emerald-950 via-slate-950 to-emerald-950 backdrop-blur">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-3">
        <Link href="/" className="flex items-center gap-2">
          <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-600/20 ring-1 ring-emerald-500/30">
            <span className="text-lg font-black tracking-tight text-emerald-200">PM</span>
          </span>
          <div className="leading-tight">
            <div className="text-sm font-extrabold tracking-tight text-white">
              PollaMundialista
            </div>
            <div className="text-xs text-white/60">FIFA 2026</div>
          </div>
        </Link>

        <nav className="hidden items-center gap-6 text-sm font-medium text-white/80 md:flex">
          <Link href="/app" className="hover:text-white">
            Dashboard
          </Link>
          <Link href="/app/matches" className="hover:text-white">
            Partidos
          </Link>
          <Link href="/app/groups" className="hover:text-white">
            Grupos
          </Link>
          <Link href="/app/leaderboard" className="hover:text-white">
            Global
          </Link>
          {user?.role === "ADMIN" ? (
            <Link href="/admin" className="hover:text-white">
              Admin
            </Link>
          ) : null}
        </nav>

        <div className="flex items-center gap-3">
          {user ? (
            <>
              <div className="hidden text-right md:block">
                <div className="text-sm font-semibold text-white">
                  {user.name ?? user.email}
                </div>
                <div className="text-xs text-white/60">
                  {user.role === "ADMIN" ? "Administrador" : "Jugador"}
                </div>
              </div>
              <SignOutButton />
            </>
          ) : (
            <div className="flex items-center gap-3">
              <Link
                href="/register"
                className="hidden rounded-full border border-white/15 bg-white/5 px-4 py-2 text-sm font-semibold text-white hover:bg-white/10 md:inline-flex"
              >
                Crear cuenta
              </Link>
              <SignInButton callbackUrl="/app" />
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

