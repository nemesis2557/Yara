// src/app/pagados/page.tsx
"use client";

import React from "react";
import { MainLayout } from "@/components/luwak/MainLayout";
import { useAuth } from "@/components/auth/AuthProvider";
import type { UserRole } from "@/types/luwak";
import { Lock } from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import { usePagosData } from "@/hooks/data/usePagosData";

export default function PagadosPage() {
  const { user } = useAuth();
  const { pagos } = usePagosData();
  if (!user) return null;

  // MESERO / ADMIN / CAJERO pueden ver PAGADOS
  const allowedRoles: UserRole[] = ["admin", "mesero", "cajero"];

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
              Usted no tiene acceso a la sección de <strong>PAGADOS</strong>.
            </p>
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="space-y-4">
        <h1 className="text-xl font-semibold text-[#6B4423] mb-1">Pedidos pagados</h1>
        <p className="text-sm text-gray-600">
          Histórico de cobros con detalle de método de pago y cajero.
        </p>

        <div className="overflow-x-auto rounded-xl border border-[#efe2d2] bg-white shadow-sm">
          <table className="min-w-full text-sm">
            <thead className="bg-[#f7eee4] text-[#6B4423]">
              <tr>
                <th className="px-3 py-2 text-left"># Pedido</th>
                <th className="px-3 py-2 text-left">Fecha</th>
                <th className="px-3 py-2 text-left">Total</th>
                <th className="px-3 py-2 text-left">Método</th>
                <th className="px-3 py-2 text-left">Cajero</th>
                <th className="px-3 py-2 text-left">N° operación</th>
                <th className="px-3 py-2 text-left">Cliente</th>
              </tr>
            </thead>
            <tbody>
              {pagos.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-3 py-6 text-center text-gray-500">
                    No hay pagos registrados.
                  </td>
                </tr>
              )}

              {pagos.map((pago) => (
                <tr key={pago.orderId} className="border-t border-[#f1e3d4]">
                  <td className="px-3 py-2 font-semibold text-[#6B4423]">
                    #{pago.orderNumber.toString().padStart(3, "0")}
                  </td>
                  <td className="px-3 py-2">
                    {pago.paidAt
                      ? new Date(pago.paidAt).toLocaleString("es-PE", {
                        day: "2-digit",
                        month: "2-digit",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })
                      : "—"}
                  </td>
                  <td className="px-3 py-2 font-semibold text-[#6B4423]">
                    {formatCurrency(pago.total)}
                  </td>
                  <td className="px-3 py-2">
                    <span className="inline-flex items-center rounded-full bg-green-50 px-2.5 py-1 text-xs font-semibold text-green-700">
                      {pago.payment?.method ?? "efectivo"}
                    </span>
                  </td>
                  <td className="px-3 py-2">
                    {pago.payment?.cashierName ?? "—"}
                  </td>
                  <td className="px-3 py-2">
                    {pago.payment?.numeroOperacion ?? "—"}
                  </td>
                  <td className="px-3 py-2">
                    {pago.payment?.nombreCliente ?? "—"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </MainLayout>
  );
}
