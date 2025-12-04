// src/app/pedidos/page.tsx
"use client";

import React, { useMemo, useState } from "react";
import { MainLayout } from "@/components/luwak/MainLayout";
import { useAuth } from "@/components/auth/AuthProvider";
import type { UserRole } from "@/types/luwak";
import type { Order, OrderStatus } from "@/types/luwak";
import { useOrders } from "@/components/orders/OrdersProvider";
import { Lock } from "lucide-react";

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
  const { orders, updateOrderStatus } = useOrders();
  const [statusFilter, setStatusFilter] = useState<OrderStatus | "all">("all");
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");

  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      if (statusFilter !== "all" && order.status !== statusFilter) return false;
      if (startDate) {
        const created = new Date(order.createdAt).toISOString().slice(0, 10);
        if (created < startDate) return false;
      }
      if (endDate) {
        const created = new Date(order.createdAt).toISOString().slice(0, 10);
        if (created > endDate) return false;
      }
      return true;
    });
  }, [orders, statusFilter, startDate, endDate]);

  const kitchenOrders = orders.filter((o) =>
    ["pending", "cooking", "ready"].includes(o.status),
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

  const isKitchen = user.role === "chef" || user.role === "ayudante";

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
      updateOrderStatus(order.id, "cooking");
    } else if (order.status === "cooking") {
      updateOrderStatus(order.id, "ready");
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
        <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
          <div>
            <h1 className="text-xl font-semibold text-[#6B4423]">
              Historial de pedidos
            </h1>
            <p className="text-sm text-gray-600">
              Filtra por estado y fecha para ver la actividad.
            </p>
          </div>

          <div className="flex flex-wrap gap-2 text-sm">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as OrderStatus | "all")}
              className="rounded-lg border border-[#d8cab9] bg-white px-3 py-2 text-[#6B4423] shadow-sm focus:border-[#6B4423] focus:outline-none"
            >
              <option value="all">Todos los estados</option>
              <option value="pending">Pendiente</option>
              <option value="cooking">Cocinando</option>
              <option value="ready">Listo</option>
              <option value="paid">Pagado</option>
              <option value="cancelled">Cancelado</option>
            </select>

            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="rounded-lg border border-[#d8cab9] bg-white px-3 py-2 text-[#6B4423] shadow-sm focus:border-[#6B4423] focus:outline-none"
            />
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="rounded-lg border border-[#d8cab9] bg-white px-3 py-2 text-[#6B4423] shadow-sm focus:border-[#6B4423] focus:outline-none"
            />
          </div>
        </div>

        <div className="overflow-x-auto rounded-xl border border-[#efe2d2] bg-white shadow-sm">
          <table className="min-w-full text-sm">
            <thead className="bg-[#f7eee4] text-[#6B4423]">
              <tr>
                <th className="px-3 py-2 text-left"># Pedido</th>
                <th className="px-3 py-2 text-left">Resumen</th>
                <th className="px-3 py-2 text-left">Estado</th>
                <th className="px-3 py-2 text-left">Total</th>
                <th className="px-3 py-2 text-left">Creado por</th>
                <th className="px-3 py-2 text-left">Fecha</th>
                <th className="px-3 py-2 text-left">Hora</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-3 py-6 text-center text-gray-500">
                    No hay pedidos con los filtros seleccionados.
                  </td>
                </tr>
              )}

              {filteredOrders.map((order) => (
                <tr key={order.id} className="border-t border-[#f1e3d4]">
                  <td className="px-3 py-2 font-semibold text-[#6B4423]">
                    #{order.orderNumber.toString().padStart(3, "0")}
                  </td>
                  <td className="px-3 py-2">{order.description}</td>
                  <td className="px-3 py-2">
                    <span
                      className={`inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-semibold ${statusClass[order.status]}`}
                    >
                      {statusLabel[order.status]}
                    </span>
                  </td>
                  <td className="px-3 py-2 font-semibold text-[#6B4423]">
                    S/ {order.total.toFixed(2)}
                  </td>
                  <td className="px-3 py-2">{order.createdByName}</td>
                  <td className="px-3 py-2">
                    {new Date(order.createdAt).toLocaleDateString("es-PE")}
                  </td>
                  <td className="px-3 py-2">
                    {new Date(order.createdAt).toLocaleTimeString("es-PE", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
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
