// src/app/ajustes/page.tsx
"use client";

import React, { useEffect, useState } from "react";
import { MainLayout } from "@/components/luwak/MainLayout";
import { useAuth } from "@/components/auth/AuthProvider";
import type { UserRole } from "@/types/luwak";
import { Lock } from "lucide-react";
import bcrypt from "bcryptjs";

const STORAGE_KEY = "luwak_admin_code_hash";

interface Empleado {
  id: string;
  nombre: string;
  apellido: string;
  dni: string;
  rol: UserRole;
  activo: boolean;
}

const mockEmpleados: Empleado[] = [
  { id: "emp-1", nombre: "Ana", apellido: "Pérez", dni: "12345678", rol: "mesero", activo: true },
  { id: "emp-2", nombre: "Luis", apellido: "Rojas", dni: "87654321", rol: "cajero", activo: true },
  { id: "emp-3", nombre: "María", apellido: "Gómez", dni: "45678912", rol: "ayudante", activo: false },
];

export default function AjustesPage() {
  const { user } = useAuth();
  const [nuevoCodigo, setNuevoCodigo] = useState("");
  const [hashGuardado, setHashGuardado] = useState<string | null>(null);
  const [mensaje, setMensaje] = useState("");
  const [empleados, setEmpleados] = useState<Empleado[]>(mockEmpleados);
  const [editing, setEditing] = useState<Empleado | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) setHashGuardado(stored);
  }, []);

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
              No tienes permiso para ver esta sección.
            </h1>
            <p className="text-sm text-gray-600">Solo los administradores pueden acceder a Ajustes.</p>
          </div>
        </div>
      </MainLayout>
    );
  }

  const handleGuardarCodigo = () => {
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
    // TODO: llamar a /next_api/ajustes_admin para persistir el código
  };

  const handleSaveEmpleado = () => {
    if (!editing) return;
    setEmpleados((prev) => prev.map((emp) => (emp.id === editing.id ? editing : emp)));
    setEditing(null);
    // TODO: llamar a /next_api/usuarios/{id} (PUT)
  };

  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="space-y-1">
          <h1 className="text-xl font-semibold text-[#6B4423]">Ajustes del sistema</h1>
          <p className="text-sm text-gray-600">Administración de empleados y código de administrador.</p>
        </div>

        <div className="rounded-xl border border-[#efe2d2] bg-white p-4 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-[#6B4423]">Empleados</h2>
            <p className="text-xs text-gray-500">Datos mock, listos para conectar a PostgREST.</p>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead className="bg-[#f7eee4] text-[#6B4423]">
                <tr>
                  <th className="px-3 py-2 text-left">Nombre</th>
                  <th className="px-3 py-2 text-left">Apellido</th>
                  <th className="px-3 py-2 text-left">DNI</th>
                  <th className="px-3 py-2 text-left">Rol</th>
                  <th className="px-3 py-2 text-left">Activo</th>
                  <th className="px-3 py-2 text-left">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {empleados.map((emp) => (
                  <tr key={emp.id} className="border-t border-[#f1e3d4]">
                    <td className="px-3 py-2">{emp.nombre}</td>
                    <td className="px-3 py-2">{emp.apellido}</td>
                    <td className="px-3 py-2 font-mono text-xs text-gray-600">{emp.dni}</td>
                    <td className="px-3 py-2 capitalize">{emp.rol}</td>
                    <td className="px-3 py-2">
                      <span
                        className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                          emp.activo
                            ? "bg-green-50 text-green-700 border border-green-200"
                            : "bg-gray-100 text-gray-600 border border-gray-200"
                        }`}
                      >
                        {emp.activo ? "Activo" : "Inactivo"}
                      </span>
                    </td>
                    <td className="px-3 py-2">
                      <button
                        type="button"
                        onClick={() => setEditing(emp)}
                        className="rounded-md border border-[#e4d6c5] px-3 py-1 text-xs font-semibold text-[#6B4423] hover:bg-[#f7eee4]"
                      >
                        Editar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="rounded-xl border border-[#efe2d2] bg-white p-4 shadow-sm space-y-3">
          <h2 className="text-lg font-semibold text-[#6B4423]">Código de administrador</h2>
          <p className="text-sm text-gray-600">Actualiza el código. En producción se persistirá en ajustes_admin.</p>
          <div className="space-y-2">
            <input
              id="codigo-admin"
              type="password"
              value={nuevoCodigo}
              onChange={(e) => setNuevoCodigo(e.target.value)}
              className="mt-1 w-full rounded-lg border border-[#e4d6c5] px-3 py-2 text-sm text-[#6B4423] shadow-sm focus:border-[#6B4423] focus:outline-none"
              placeholder="Ingrese el nuevo código"
            />
            <button
              type="button"
              onClick={handleGuardarCodigo}
              className="rounded-lg bg-[#6B4423] px-4 py-2 text-sm font-semibold text-white hover:bg-[#53351c]"
            >
              Guardar código
            </button>
          </div>

          {mensaje && (
            <p className="text-sm text-green-700 bg-green-50 border border-green-100 rounded-lg px-3 py-2">{mensaje}</p>
          )}

          {hashGuardado && (
            <p className="text-xs text-gray-500 break-all">Hash almacenado: {hashGuardado}</p>
          )}
        </div>
      </div>

      {editing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
          <div className="w-full max-w-lg rounded-2xl bg-white shadow-2xl border border-[#efe2d2]">
            <div className="flex items-center justify-between border-b border-[#f1e3d4] px-5 py-3">
              <h3 className="text-lg font-semibold text-[#6B4423]">Editar empleado</h3>
              <button
                type="button"
                onClick={() => setEditing(null)}
                className="rounded-full border border-[#f0e3d5] p-2 text-[#6B4423] hover:bg-[#f7eee4]"
              >
                Cerrar
              </button>
            </div>

            <div className="grid gap-3 px-5 py-4 md:grid-cols-2">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-[#6B4423]" htmlFor="nombre-emp">
                  Nombre
                </label>
                <input
                  id="nombre-emp"
                  type="text"
                  value={editing.nombre}
                  onChange={(e) => setEditing({ ...editing, nombre: e.target.value })}
                  className="w-full rounded-lg border border-[#e4d6c5] px-3 py-2 text-sm text-[#6B4423] shadow-sm focus:border-[#6B4423] focus:outline-none"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-semibold text-[#6B4423]" htmlFor="apellido-emp">
                  Apellido
                </label>
                <input
                  id="apellido-emp"
                  type="text"
                  value={editing.apellido}
                  onChange={(e) => setEditing({ ...editing, apellido: e.target.value })}
                  className="w-full rounded-lg border border-[#e4d6c5] px-3 py-2 text-sm text-[#6B4423] shadow-sm focus:border-[#6B4423] focus:outline-none"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-semibold text-[#6B4423]" htmlFor="dni-emp">
                  DNI
                </label>
                <input
                  id="dni-emp"
                  type="text"
                  value={editing.dni}
                  onChange={(e) => setEditing({ ...editing, dni: e.target.value })}
                  className="w-full rounded-lg border border-[#e4d6c5] px-3 py-2 text-sm text-[#6B4423] shadow-sm focus:border-[#6B4423] focus:outline-none"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-semibold text-[#6B4423]" htmlFor="rol-emp">
                  Rol
                </label>
                <select
                  id="rol-emp"
                  value={editing.rol}
                  onChange={(e) =>
                    setEditing({ ...editing, rol: e.target.value as UserRole })
                  }
                  className="w-full rounded-lg border border-[#e4d6c5] px-3 py-2 text-sm text-[#6B4423] shadow-sm focus:border-[#6B4423] focus:outline-none"
                >
                  <option value="admin">admin</option>
                  <option value="mesero">mesero</option>
                  <option value="cajero">cajero</option>
                  <option value="chef">chef</option>
                  <option value="ayudante">ayudante</option>
                </select>
              </div>
              <div className="flex items-center gap-2 md:col-span-2">
                <input
                  id="activo-emp"
                  type="checkbox"
                  checked={editing.activo}
                  onChange={(e) => setEditing({ ...editing, activo: e.target.checked })}
                  className="h-4 w-4 rounded border-[#e4d6c5] text-[#6B4423] focus:ring-[#6B4423]"
                />
                <label htmlFor="activo-emp" className="text-sm text-gray-700">
                  Empleado activo
                </label>
              </div>
            </div>

            <div className="flex justify-end gap-2 border-t border-[#f1e3d4] px-5 py-3">
              <button
                type="button"
                onClick={() => setEditing(null)}
                className="rounded-lg border border-[#e4d6c5] px-4 py-2 text-sm font-semibold text-[#6B4423] hover:bg-[#f7eee4]"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleSaveEmpleado}
                className="rounded-lg bg-[#6B4423] px-4 py-2 text-sm font-semibold text-white hover:bg-[#53351c]"
              >
                Guardar
              </button>
            </div>
          </div>
        </div>
      )}
    </MainLayout>
  );
}
