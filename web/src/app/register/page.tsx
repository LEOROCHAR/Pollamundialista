import Link from "next/link";

import { RegisterForm } from "@/app/register/register-form";

export default function RegisterPage() {
  return (
    <div className="mx-auto max-w-4xl">
      <div className="mb-6 text-sm text-white/70">
        ¿Ya tienes cuenta?{" "}
        <Link href="/login" className="font-semibold text-emerald-200 hover:text-emerald-100">
          Inicia sesión
        </Link>
      </div>
      <RegisterForm />
    </div>
  );
}

