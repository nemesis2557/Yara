// src/app/inicio/page.tsx
"use client";

import React from "react";
import { MainLayout } from "@/components/luwak/MainLayout";
import { useAuth } from "@/components/auth/AuthProvider";
import type { UserRole } from "@/types/luwak";
import { Lock } from "lucide-react";
// importa aquí lo que uses para mostrar órdenes del chef, etc.

export default function InicioPage() {
  const { user } = useAuth();

  if (!user) return null;

  // ADMIN / AYUDANTE / MESERO / CHEF
  const allowedRoles: UserRole[] = ["admin", "ayudante", "mesero", "chef"];

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
              Usted no tiene acceso a la sección de <strong>INICIO</strong>.
              Consulte con el administrador si cree que esto es un error.
            </p>
          </div>
        </div>
      </MainLayout>
    );
  }

  // 👇 Aquí decides qué ver según el rol
  const isChef = user.role === "chef";

  return (
    <MainLayout>
      {isChef ? (
        // 🔥 Vista especial para el CHEF: cards de órdenes, etc
        <div>
          {/* Tus cards de órdenes para el chef */}
          <h1 className="text-xl font-semibold text-[#6B4423] mb-4">
            Órdenes en cocina
          </h1>
          {/* TODO: acá metes el componente que ya tenías */}
        </div>
      ) : (
        // 👤 Vista normal para admin / mesero / ayudante
        <div>
          <h1 className="text-xl font-semibold text-[#6B4423] mb-4">
            Bienvenido a INICIO
          </h1>
          {/* TODO: aquí tu contenido normal de inicio (productos, etc.) */}
        </div>
      )}
    </MainLayout>
  );
}
