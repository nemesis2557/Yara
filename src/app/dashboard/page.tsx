// src/app/dashboard/page.tsx
"use client";

import React from "react";
import { MainLayout } from "@/components/luwak/MainLayout";
import { useAuth } from "@/components/auth/AuthProvider";
import type { UserRole } from "@/types/luwak";
import { Lock } from "lucide-react";

export default function DashboardPage() {
  const { user } = useAuth();
  if (!user) return null;

  const allowedRoles: UserRole[] = ["admin"];

  if (!allowedRoles.includes(user.role)) {
    return (
      <MainLayout>
        <div className="min-h-[60vh] flex items-center justify-center">
          <div className="max-w-md w-full bg-white rounded-xl shadow p-6 border border-red-100 text-center">
            <div className="flex justify-center mb-3">
              <div className="w-10 h-10 rounded-full bg-red-50 flex items-center justify-center">
                <Lock className="w-5 h-5 text-red-500" />
              </div>
            </div>
            <h1 className="text-lg font-semibold text-red-700 mb-1">
              Acceso restringido
            </h1>
            <p className="text-sm text-gray-600">
              Usted no tiene acceso a esta sección de <strong>DASHBOARD</strong>.
              Consulte con el administrador si cree que esto es un error.
            </p>
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      {/* Aquí va tu contenido real del dashboard (métricas, gráficos, etc.) */}
      <div className="space-y-4">
        <h1 className="text-xl font-semibold text-[#6B4423]">
          Dashboard administrativo
        </h1>
        <p className="text-sm text-gray-600">
          Aquí podrás ver estadísticas de ventas, pedidos, etc. (pendiente de implementar).
        </p>
      </div>
    </MainLayout>
  );
}
