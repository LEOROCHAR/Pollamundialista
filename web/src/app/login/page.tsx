import Link from "next/link";

import { LoginForm } from "@/app/login/login-form";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const sp = await searchParams;
  const error = typeof sp.error === "string" ? sp.error : undefined;

  return (
    <div className="mx-auto max-w-4xl">
      <div className="mb-6 text-sm text-white/70">
        ¿No tienes cuenta?{" "}
        <Link href="/register" className="font-semibold text-emerald-200 hover:text-emerald-100">
          Regístrate
        </Link>
      </div>
      <LoginForm error={error} />
    </div>
  );
}

