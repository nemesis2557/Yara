"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useAuth } from "@/components/auth/AuthProvider";
import { Loader2 } from "lucide-react";

export default function RootPage() {
  const router = useRouter();
  const { user, isLoading } = useAuth();

  useEffect(() => {
    if (isLoading) return;
    if (user) {
      router.replace("/inicio");
    } else {
      router.replace("/login");
    }
  }, [user, isLoading, router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0b1020]">
      <div className="flex flex-col items-center gap-3 text-white/80">
        <Loader2 className="w-6 h-6 animate-spin" />
        <p>Redirigiendo…</p>
      </div>
    </div>
  );
}
