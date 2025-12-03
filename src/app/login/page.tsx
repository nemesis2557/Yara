// src/app/login/page.tsx
"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect } from "react";
import { LoginForm } from "@/components/auth/LoginForm";
import { useAuth } from "@/components/auth/AuthProvider";

function LoginPageInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user } = useAuth();

  const redirectTo = searchParams.get("redirect") || "/inicio";

  // ⚠️ Redirección debe hacerse en un efecto, no en el render
  useEffect(() => {
    if (user) {
      router.replace(redirectTo);
    }
  }, [user, redirectTo, router]);

  // Mientras se hace la redirección (o si ya está logueado) no mostramos el form
  if (user) {
    return null;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#4b2e16] p-4">
      <LoginForm
        onSuccess={() => {
          router.replace(redirectTo);
        }}
      />
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={null}>
      <LoginPageInner />
    </Suspense>
  );
}
