// src/app/listos/page.tsx
"use client";

import React from "react";
import { MainLayout } from "@/components/luwak/MainLayout";
import { useAuth } from "@/components/auth/AuthProvider";
import { useOrders } from "@/components/orders/OrdersProvider";
import type { UserRole } from "@/types/luwak";
import { Lock } from "lucide-react";

// Tipo flexible de orden para no pelear con TypeScript
type AnyOrder = {
  id: string;
  status?: string;
  number?: number;
  code?: string;
  shortCode?: string;
  createdByName?: string;
  userName?: string;
  summary?: string;
  description?: string;
  total?: number;
  totalAmount?: number;
  dateLabel?: string;
  timeLabel?: string;
  createdAt?: string | Date;
};

export default function ListosPage() {
  const { user } = useAuth();
  const { orders } = useOrders();

  if (!user) return null;

  const allowedRoles: UserRole[] = ["admin", "mesero", "cajero", "ayudante", "chef"];

  // ⚠️ Si el rol NO está permitido → tarjeta de Acceso restringido
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
              Usted no tiene acceso a la sección de <strong>LISTOS</strong>.
              Consulte con el administrador si cree que esto es un error.
            </p>
          </div>
        </div>
      </MainLayout>
    );
  }

  // Nos aseguramos de que orders sea un array y lo tratamos como AnyOrder[]
  const safeOrders: AnyOrder[] = Array.isArray(orders) ? (orders as AnyOrder[]) : [];

  const readyOrders = safeOrders.filter((o) =>
    o.status === "ready" ||
    o.status === "listo" ||
    o.status === "completed"
  );

  return (
    <MainLayout>
      <div className="space-y-4">
        <h1 className="text-xl font-semibold text-[#6B4423]">
          Órdenes listas (rojo) y listas para cobrar / entregar
        </h1>

        {readyOrders.length === 0 ? (
          <p className="text-sm text-gray-500">
            No hay órdenes en estado <strong>Listo</strong> por el momento.
          </p>
        ) : (
          <div className="overflow-x-auto bg-white rounded-xl shadow border border-[#efe2d2]">
            <table className="min-w-full text-sm">
              <thead className="bg-[#f7eee4] text-[#6B4423]">
                <tr>
                  <th className="px-3 py-2 text-left"># de Pedido</th>
                  <th className="px-3 py-2 text-left">ID Único</th>
                  <th className="px-3 py-2 text-left">Nombre usuario</th>
                  <th className="px-3 py-2 text-left">Descripción</th>
                  <th className="px-3 py-2 text-left">Costo Total</th>
                  <th className="px-3 py-2 text-left">Estado</th>
                  <th className="px-3 py-2 text-left">Fecha</th>
                  <th className="px-3 py-2 text-left">Hora</th>
                  <th className="px-3 py-2 text-left">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {readyOrders.map((order, index) => (
                  <tr key={order.id} className="border-t border-[#f1e3d4]">
                    {/* # de Pedido */}
                    <td className="px-3 py-2">
                      {order.number ?? index + 1}
                    </td>

                    {/* ID Único */}
                    <td className="px-3 py-2">
                      {order.code ?? order.shortCode ?? order.id}
                    </td>

                    {/* Usuario */}
                    <td className="px-3 py-2">
                      {order.createdByName ?? order.userName ?? "—"}
                    </td>

                    {/* Descripción */}
                    <td className="px-3 py-2">
                      {order.summary ?? order.description ?? "—"}
                    </td>

                    {/* Total */}
                    <td className="px-3 py-2">
                      S/{" "}
                      {(
                        order.total ??
                        order.totalAmount ??
                        0
                      ).toFixed(2)}
                    </td>

                    {/* Estado */}
                    <td className="px-3 py-2">
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-red-100 text-red-700">
                        Listo 🟥
                      </span>
                    </td>

                    {/* Fecha */}
                    <td className="px-3 py-2">
                      {order.dateLabel
                        ? order.dateLabel
                        : order.createdAt
                        ? new Date(order.createdAt).toLocaleDateString("es-PE")
                        : "—"}
                    </td>

                    {/* Hora */}
                    <td className="px-3 py-2">
                      {order.timeLabel
                        ? order.timeLabel
                        : order.createdAt
                        ? new Date(order.createdAt).toLocaleTimeString("es-PE", {
                            hour: "2-digit",
                            minute: "2-digit",
                          })
                        : "—"}
                    </td>

                    {/* Acciones */}
                    <td className="px-3 py-2">
                      <button
                        type="button"
                        className="px-2.5 py-1 rounded-md text-xs font-semibold bg-[#6B4423] text-white hover:bg-[#53351c] transition"
                      >
                        Ver detalle
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </MainLayout>
  );
}
