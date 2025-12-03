// src/app/ajustes/page.tsx
"use client";

import React from "react";
import { MainLayout } from "@/components/luwak/MainLayout";
import { useAuth } from "@/components/auth/AuthProvider";
import type { UserRole } from "@/types/luwak";
import { Lock } from "lucide-react";

export default function AjustesPage() {
  const { user } = useAuth();

  if (!user) return null;

  // Solo ADMIN puede ver AJUSTES
  const allowedRoles: UserRole[] = ["admin"];

  // Si el rol NO está permitido → mostramos acceso restringido
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
              Usted no tiene acceso a la sección de <strong>AJUSTES</strong>.
              Consulte con el administrador si cree que esto es un error.
            </p>
          </div>
        </div>
      </MainLayout>
    );
  }

  // ✅ Contenido visible solo para ADMIN
  return (
    <MainLayout>
      <div className="space-y-4">
        <h1 className="text-xl font-semibold text-[#6B4423]">
          Ajustes del sistema
        </h1>
        <p className="text-sm text-gray-600">
          Aquí irán las configuraciones de la cafetería, usuarios, etc.
        </p>
        {/* Aquí luego agregamos las secciones reales de ajustes */}
      </div>
    </MainLayout>
  );
}
