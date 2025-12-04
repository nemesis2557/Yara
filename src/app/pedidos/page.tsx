// src/app/pedidos/page.tsx
"use client";

import React, { useMemo, useState } from "react";
import { MainLayout } from "@/components/luwak/MainLayout";
import { useAuth } from "@/components/auth/AuthProvider";
import type { UserRole } from "@/types/luwak";
import type { Order, OrderStatus } from "@/types/luwak";
import { Lock } from "lucide-react";
import {
  ADMIN_CODE_PLACEHOLDER,
  useOrdersData,
} from "@/hooks/data/useOrdersData";

const statusLabel: Record<OrderStatus, string> = {
  pending: "Pendiente",
  cooking: "Cocinando",
  ready: "Listo",
  paid: "Pagado",
  cancelled: "Cancelado",
};

const statusClass: Record<OrderStatus, string> = {
  pending: "bg-orange-50 text-orange-700 border-orange-200",
  cooking: "bg-yellow-50 text-yellow-700 border-yellow-200",
  ready: "bg-red-50 text-red-700 border-red-200",
  paid: "bg-green-50 text-green-700 border-green-200",
  cancelled: "bg-gray-100 text-gray-600 border-gray-200",
};

export default function PedidosPage() {
  const { user } = useAuth();
  const {
    orders,
    markAsCooking,
    markAsReady,
    cancelOrderWithAdminCode,
  } = useOrdersData();
  const [detailOrder, setDetailOrder] = useState<Order | null>(null);
  const [orderToCancel, setOrderToCancel] = useState<Order | null>(null);
  const [adminCode, setAdminCode] = useState("");
  const [cancelError, setCancelError] = useState("");

  const kitchenOrders = orders.filter((o) =>
    ["pending", "cooking", "ready"].includes(o.status),
  );

  const listOrders = useMemo(
    () => orders.filter((o) => o.status !== "cancelled"),
    [orders],
  );

  if (!user) return null;

  // MESERO / ADMIN / AYUDANTE pueden ver PEDIDOS
  const allowedRoles: UserRole[] = ["admin", "mesero", "ayudante", "chef"];

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

  const isKitchen =
    user.role === "chef" || user.role === "ayudante" || user.role === "admin";

  const renderItems = (order: Order) => (
    <ul className="mt-2 space-y-1 text-sm text-gray-700">
      {order.items.map((item) => (
        <li key={item.id} className="flex items-center justify-between">
          <span>
            {item.quantity}x {item.name}
            {item.variant ? ` (${item.variant})` : ""}
          </span>
          <span className="font-semibold text-[#6B4423]">
            S/ {(item.unitPrice * item.quantity).toFixed(2)}
          </span>
        </li>
      ))}
    </ul>
  );

  const handleAdvance = (order: Order) => {
    if (order.status === "pending") {
      markAsCooking(order.id);
    } else if (order.status === "cooking") {
      markAsReady(order.id);
    }
  };

  if (isKitchen) {
    return (
      <MainLayout>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-semibold text-[#6B4423]">
              Pedidos en cocina
            </h1>
            <p className="text-sm text-gray-500">
              Pendientes, cocinando y listos
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {kitchenOrders.length === 0 && (
              <div className="col-span-full rounded-lg border border-dashed border-[#d6c8b8] bg-white p-6 text-center text-sm text-gray-600">
                No hay pedidos en cocina por ahora.
              </div>
            )}

            {kitchenOrders.map((order) => (
              <article
                key={order.id}
                className="rounded-xl border border-[#efe2d2] bg-white p-4 shadow-sm"
              >
                <div className="flex items-center justify-between gap-2">
                  <div>
                    <p className="text-xs text-gray-500">
                      Pedido #{order.orderNumber.toString().padStart(3, "0")}
                    </p>
                    <h3 className="text-lg font-semibold text-[#6B4423]">
                      {order.description}
                    </h3>
                    <p className="text-xs text-gray-500">
                      Creado por {order.createdByName}
                    </p>
                  </div>
                  <span
                    className={`rounded-full border px-3 py-1 text-xs font-semibold ${statusClass[order.status]}`}
                  >
                    {statusLabel[order.status]}
                  </span>
                </div>

                <div className="mt-2 text-xs text-gray-500 flex items-center gap-2">
                  <span>
                    {new Date(order.createdAt).toLocaleTimeString("es-PE", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                  <span className="text-[#d0b79b]">•</span>
                  <span>Total S/ {order.total.toFixed(2)}</span>
                </div>

                {renderItems(order)}

                <div className="mt-4 flex flex-wrap gap-2">
                  {order.status === "pending" && (
                    <button
                      type="button"
                      onClick={() => handleAdvance(order)}
                      className="rounded-lg bg-orange-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-orange-700"
                    >
                      Marcar como cocinando
                    </button>
                  )}
                  {order.status === "cooking" && (
                    <button
                      type="button"
                      onClick={() => handleAdvance(order)}
                      className="rounded-lg bg-green-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-green-700"
                    >
                      Marcar como listo
                    </button>
                  )}
                  {order.status === "ready" && (
                    <span className="rounded-lg bg-red-50 px-3 py-1.5 text-xs font-semibold text-red-700">
                      Esperando cobro
                    </span>
                  )}
                </div>
              </article>
            ))}
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="space-y-4">
        <div className="flex flex-col gap-1 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-xl font-semibold text-[#6B4423]">
              Historial de pedidos
            </h1>
            <p className="text-sm text-gray-600">
              Gestiona estados y cancela con código admin cuando sea necesario.
            </p>
          </div>
        </div>

        <div className="overflow-x-auto rounded-xl border border-[#efe2d2] bg-white shadow-sm">
          <table className="min-w-full text-sm">
            <thead className="bg-[#f7eee4] text-[#6B4423]">
              <tr>
                <th className="px-3 py-2 text-left"># de Pedido</th>
                <th className="px-3 py-2 text-left">ID Único Pedido</th>
                <th className="px-3 py-2 text-left">Creado por</th>
                <th className="px-3 py-2 text-left">Resumen</th>
                <th className="px-3 py-2 text-left">Costo Total</th>
                <th className="px-3 py-2 text-left">Estado</th>
                <th className="px-3 py-2 text-left">Fecha</th>
                <th className="px-3 py-2 text-left">Hora</th>
                <th className="px-3 py-2 text-left">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {listOrders.length === 0 && (
                <tr>
                  <td colSpan={9} className="px-3 py-6 text-center text-gray-500">
                    No hay pedidos por mostrar.
                  </td>
                </tr>
              )}

              {listOrders
                .slice()
                .sort(
                  (a, b) =>
                    new Date(b.createdAt).getTime() -
                    new Date(a.createdAt).getTime(),
                )
                .map((order) => (
                  <tr key={order.id} className="border-t border-[#f1e3d4]">
                    <td className="px-3 py-2 font-semibold text-[#6B4423]">
                      #{order.orderNumber.toString().padStart(3, "0")}
                    </td>
                    <td className="px-3 py-2 font-mono text-xs text-gray-600">
                      {order.id}
                    </td>
                    <td className="px-3 py-2">{order.createdByName}</td>
                    <td className="px-3 py-2">{order.description}</td>
                    <td className="px-3 py-2 font-semibold text-[#6B4423]">
                      S/ {order.total.toFixed(2)}
                    </td>
                    <td className="px-3 py-2">
                      <span
                        className={`inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-semibold ${statusClass[order.status]}`}
                      >
                        {statusLabel[order.status]}
                      </span>
                    </td>
                    <td className="px-3 py-2">
                      {new Date(order.createdAt).toLocaleDateString("es-PE")}
                    </td>
                    <td className="px-3 py-2">
                      {new Date(order.createdAt).toLocaleTimeString("es-PE", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </td>
                    <td className="px-3 py-2 space-y-1 min-w-[160px]">
                      <div className="flex flex-wrap gap-2">
                        <button
                          type="button"
                          onClick={() => setDetailOrder(order)}
                          className="rounded-md border border-[#e4d6c5] px-2 py-1 text-xs font-semibold text-[#6B4423] hover:bg-[#f7eee4]"
                        >
                          Ver detalle
                        </button>
                        {(order.status === "pending" || order.status === "cooking") && (
                          <button
                            type="button"
                            onClick={() => handleAdvance(order)}
                            className="rounded-md bg-[#6B4423] px-2 py-1 text-xs font-semibold text-white hover:bg-[#53351c]"
                          >
                            Avanzar estado
                          </button>
                        )}
                        <button
                          type="button"
                          onClick={() => {
                            setOrderToCancel(order);
                            setAdminCode("");
                            setCancelError("");
                          }}
                          className="rounded-md border border-red-200 px-2 py-1 text-xs font-semibold text-red-700 hover:bg-red-50"
                        >
                          Cancelar
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>

      {detailOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
          <div className="w-full max-w-2xl rounded-2xl bg-white shadow-2xl border border-[#efe2d2]">
            <div className="flex items-center justify-between border-b border-[#f1e3d4] px-5 py-3">
              <div>
                <p className="text-xs text-gray-500">Pedido #{detailOrder.orderNumber}</p>
                <h3 className="text-lg font-semibold text-[#6B4423]">Detalle del pedido</h3>
              </div>
              <button
                type="button"
                onClick={() => setDetailOrder(null)}
                className="rounded-full border border-[#f0e3d5] p-2 text-[#6B4423] hover:bg-[#f7eee4]"
              >
                Cerrar
              </button>
            </div>

            <div className="grid gap-4 px-5 py-4 md:grid-cols-2">
              <div className="space-y-2 text-sm text-gray-700">
                <p className="text-xs text-gray-500">
                  Creado por {detailOrder.createdByName}
                </p>
                <p className="font-semibold text-[#6B4423]">{detailOrder.description}</p>
                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <span>{new Date(detailOrder.createdAt).toLocaleDateString("es-PE")}</span>
                  <span>•</span>
                  <span>
                    {new Date(detailOrder.createdAt).toLocaleTimeString("es-PE", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </div>
              </div>
              <div className="rounded-lg border border-[#f1e3d4] bg-[#fdf8f3] p-3 text-sm text-gray-700">
                <p className="font-semibold text-[#6B4423] mb-2">Productos</p>
                <ul className="space-y-1">
                  {detailOrder.items.map((item) => (
                    <li
                      key={item.id}
                      className="flex items-center justify-between text-sm"
                    >
                      <span>
                        {item.quantity}x {item.name}
                        {item.variant ? ` (${item.variant})` : ""}
                      </span>
                      <span className="font-semibold text-[#6B4423]">
                        S/ {(item.quantity * item.unitPrice).toFixed(2)}
                      </span>
                    </li>
                  ))}
                </ul>
                <div className="mt-3 flex items-center justify-between text-sm font-semibold text-[#6B4423]">
                  <span>Total</span>
                  <span>S/ {detailOrder.total.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {orderToCancel && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
          <div className="w-full max-w-md rounded-2xl bg-white shadow-2xl border border-[#efe2d2]">
            <div className="border-b border-[#f1e3d4] px-5 py-3">
              <h3 className="text-lg font-semibold text-[#6B4423]">Cancelar pedido</h3>
              <p className="text-sm text-gray-600">
                Solo un administrador puede cancelar pedidos. Ingresa el código de administrador.
              </p>
            </div>

            <div className="space-y-3 px-5 py-4">
              <p className="text-sm text-gray-700">
                Pedido #{orderToCancel.orderNumber} — {orderToCancel.description}
              </p>
              <label className="text-xs font-semibold text-[#6B4423]" htmlFor="admin-code-input">
                Código administrador (placeholder {ADMIN_CODE_PLACEHOLDER})
              </label>
              <input
                id="admin-code-input"
                type="password"
                value={adminCode}
                onChange={(e) => setAdminCode(e.target.value)}
                className="w-full rounded-lg border border-[#e4d6c5] px-3 py-2 text-sm text-[#6B4423] shadow-sm focus:border-[#6B4423] focus:outline-none"
                placeholder="Ingresa el código"
              />
              {cancelError && (
                <p className="text-xs text-red-600 bg-red-50 border border-red-100 rounded-lg px-2 py-1">
                  {cancelError}
                </p>
              )}
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setOrderToCancel(null)}
                  className="rounded-lg border border-[#e4d6c5] px-4 py-2 text-sm font-semibold text-[#6B4423] hover:bg-[#f7eee4]"
                >
                  Cerrar
                </button>
                <button
                  type="button"
                  onClick={() => {
                    const result = cancelOrderWithAdminCode(orderToCancel.id, adminCode);
                    if (!result.success) {
                      setCancelError(result.message);
                      return;
                    }
                    setOrderToCancel(null);
                  }}
                  className="rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700"
                >
                  Confirmar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </MainLayout>
  );
}
