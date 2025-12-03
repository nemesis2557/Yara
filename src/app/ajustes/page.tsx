// src/app/ajustes/page.tsx
"use client";

import React, { useEffect, useState } from "react";
import { MainLayout } from "@/components/luwak/MainLayout";
import { useAuth } from "@/components/auth/AuthProvider";
import type { UserRole } from "@/types/luwak";
import { Lock } from "lucide-react";
import bcrypt from "bcryptjs";

const STORAGE_KEY = "luwak_admin_code_hash";

export default function AjustesPage() {
  const { user } = useAuth();
  const [nuevoCodigo, setNuevoCodigo] = useState("");
  const [hashGuardado, setHashGuardado] = useState<string | null>(null);
  const [mensaje, setMensaje] = useState("");

  useEffect(() => {
    if (typeof window === "undefined") return;
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) setHashGuardado(stored);
  }, []);

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

  const handleGuardar = () => {
    if (!nuevoCodigo.trim()) {
      setMensaje("Ingrese un código válido.");
      return;
    }
    const hash = bcrypt.hashSync(nuevoCodigo, 8);
    if (typeof window !== "undefined") {
      localStorage.setItem(STORAGE_KEY, hash);
    }
    setHashGuardado(hash);
    setMensaje("Código de administrador actualizado (almacenado localmente).");
    setNuevoCodigo("");
  };

  return (
    <MainLayout>
      <div className="space-y-4">
        <h1 className="text-xl font-semibold text-[#6B4423]">Ajustes del sistema</h1>
        <p className="text-sm text-gray-600">
          Actualice el código administrador. En producción este valor debe persistirse en la tabla ajustes_admin.
        </p>

        <div className="rounded-xl border border-[#efe2d2] bg-white p-4 shadow-sm">
          <label className="text-sm font-semibold text-[#6B4423]" htmlFor="codigo-admin">
            Nuevo código admin
          </label>
          <input
            id="codigo-admin"
            type="password"
            value={nuevoCodigo}
            onChange={(e) => setNuevoCodigo(e.target.value)}
            className="mt-2 w-full rounded-lg border border-[#e4d6c5] px-3 py-2 text-sm text-[#6B4423] shadow-sm focus:border-[#6B4423] focus:outline-none"
            placeholder="Ingrese el nuevo código"
          />
          <button
            type="button"
            onClick={handleGuardar}
            className="mt-3 rounded-lg bg-[#6B4423] px-4 py-2 text-sm font-semibold text-white hover:bg-[#53351c]"
          >
            Guardar código
          </button>

          {mensaje && (
            <p className="mt-3 text-sm text-green-700 bg-green-50 border border-green-100 rounded-lg px-3 py-2">
              {mensaje}
            </p>
          )}

          {hashGuardado && (
            <p className="mt-2 text-xs text-gray-500 break-all">
              Hash almacenado: {hashGuardado}
            </p>
          )}
        </div>
      </div>
    </MainLayout>
  );
}
