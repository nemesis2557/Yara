// src/app/pedidos/page.tsx
"use client";

import React from "react";
import { MainLayout } from "@/components/luwak/MainLayout";
import { useAuth } from "@/components/auth/AuthProvider";
import type { UserRole } from "@/types/luwak";
import { Lock } from "lucide-react";
// 🔹 Aquí luego importas useOrders y tu tabla real

export default function PedidosPage() {
  const { user } = useAuth();
  if (!user) return null;

  // MESERO / ADMIN / AYUDANTE pueden ver PEDIDOS
  const allowedRoles: UserRole[] = ["admin", "mesero", "ayudante"];

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
              Usted no tiene acceso a la sección de <strong>PEDIDOS</strong>.
            </p>
          </div>
        </div>
      </MainLayout>
    );
  }

  // ✅ Aquí ya es rol permitido
  return (
    <MainLayout>
      {/* 🔽 Pega aquí tu tabla grande de historial de pedidos */}
      <h1 className="text-xl font-semibold text-[#6B4423] mb-4">
        Historial de pedidos
      </h1>
      <p className="text-sm text-gray-600">
        Aquí va la tabla de pedidos (plomo, amarillo, rojo, verde).
      </p>
    </MainLayout>
  );
}
