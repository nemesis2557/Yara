// src/app/dashboard/page.tsx
"use client";

import React, { useEffect, useMemo, useState } from "react";
import { MainLayout } from "@/components/luwak/MainLayout";
import { useAuth } from "@/components/auth/AuthProvider";
import type { UserRole } from "@/types/luwak";
import { Lock } from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import { useOrdersData } from "@/hooks/data/useOrdersData";
import { useProductosData } from "@/hooks/data/useProductosData";

export default function DashboardPage() {
  const { user } = useAuth();
  const {
    filteredOrders,
    setFilterByStatus,
    statusFilter,
    setFilterByDateRange,
  } = useOrdersData();
  const { topVendidosHoy } = useProductosData();

  const [dateMode, setDateMode] = useState<"today" | "month" | "custom">(
    "today",
  );
  const [customFrom, setCustomFrom] = useState("");
  const [customTo, setCustomTo] = useState("");

  useEffect(() => {
    if (dateMode === "today") {
      const today = new Date();
      setFilterByDateRange({ from: today, to: today });
      return;
    }

    if (dateMode === "month") {
      const now = new Date();
      const start = new Date(now.getFullYear(), now.getMonth(), 1);
      setFilterByDateRange({ from: start, to: now });
      return;
    }

    setFilterByDateRange({
      from: customFrom ? new Date(customFrom) : null,
      to: customTo ? new Date(customTo) : null,
    });
  }, [customFrom, customTo, dateMode, setFilterByDateRange]);

  const { salesTotal, paidCount, ordersTotal, ticketPromedio, statusCounts, topProducts } =
    useMemo(() => {
      const paid = filteredOrders.filter((o) => o.status === "paid");
      const sales = paid.reduce((sum, order) => sum + order.total, 0);
      const ticket = paid.length > 0 ? sales / paid.length : 0;
      const statusTally = filteredOrders.reduce(
        (acc, order) => {
          acc[order.status] = (acc[order.status] ?? 0) + 1;
          return acc;
        },
        {} as Record<string, number>,
      );

      return {
        salesTotal: sales,
        paidCount: paid.length,
        ordersTotal: filteredOrders.length,
        ticketPromedio: ticket,
        statusCounts: statusTally,
        topProducts: topVendidosHoy(new Date(), filteredOrders),
      };
    }, [filteredOrders, topVendidosHoy]);

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
      <div className="space-y-6">
        <div className="space-y-1">
          <h1 className="text-xl font-semibold text-[#6B4423]">Dashboard administrativo</h1>
          <p className="text-sm text-gray-600">
            KPIs diarios con filtros de estado y fecha para pedidos y ventas.
          </p>
        </div>

        <div className="grid gap-3 md:grid-cols-3 lg:grid-cols-4">
          <div className="rounded-xl border border-[#efe2d2] bg-white p-4 shadow-sm">
            <p className="text-xs font-semibold text-[#6B4423]">Filtro por estado</p>
            <select
              value={statusFilter}
              onChange={(e) => setFilterByStatus(e.target.value as typeof statusFilter)}
              className="mt-2 w-full rounded-lg border border-[#e4d6c5] bg-white px-3 py-2 text-sm text-[#6B4423] shadow-sm focus:border-[#6B4423] focus:outline-none"
            >
              <option value="all">Todos</option>
              <option value="pending">Pendiente</option>
              <option value="cooking">Cocinando</option>
              <option value="ready">Listo</option>
              <option value="paid">Pagado</option>
              <option value="cancelled">Cancelado</option>
            </select>
          </div>

          <div className="rounded-xl border border-[#efe2d2] bg-white p-4 shadow-sm md:col-span-2 lg:col-span-1">
            <p className="text-xs font-semibold text-[#6B4423]">Filtro de fecha</p>
            <div className="mt-2 flex flex-wrap gap-2 text-xs font-semibold">
              {(
                [
                  { label: "Hoy", value: "today" },
                  { label: "Este mes", value: "month" },
                  { label: "Rango", value: "custom" },
                ] as const
              ).map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => setDateMode(option.value)}
                  className={`rounded-full border px-3 py-1 transition ${
                    dateMode === option.value
                      ? "border-[#6B4423] bg-[#f5ebe0] text-[#6B4423]"
                      : "border-[#e4d6c5] text-[#6B4423] hover:bg-[#f7eee4]"
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
            {dateMode === "custom" && (
              <div className="mt-3 flex flex-col gap-2 text-sm">
                <input
                  type="date"
                  value={customFrom}
                  onChange={(e) => setCustomFrom(e.target.value)}
                  className="rounded-lg border border-[#e4d6c5] px-3 py-2 text-[#6B4423] shadow-sm focus:border-[#6B4423] focus:outline-none"
                />
                <input
                  type="date"
                  value={customTo}
                  onChange={(e) => setCustomTo(e.target.value)}
                  className="rounded-lg border border-[#e4d6c5] px-3 py-2 text-[#6B4423] shadow-sm focus:border-[#6B4423] focus:outline-none"
                />
              </div>
            )}
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <div className="rounded-xl border border-[#efe2d2] bg-white p-4 shadow-sm">
            <p className="text-xs text-gray-500">Ventas del periodo</p>
            <p className="text-2xl font-semibold text-[#6B4423]">
              {formatCurrency(salesTotal)}
            </p>
          </div>
          <div className="rounded-xl border border-[#efe2d2] bg-white p-4 shadow-sm">
            <p className="text-xs text-gray-500">Pedidos en rango</p>
            <p className="text-2xl font-semibold text-[#6B4423]">{ordersTotal}</p>
          </div>
          <div className="rounded-xl border border-[#efe2d2] bg-white p-4 shadow-sm">
            <p className="text-xs text-gray-500">Pedidos pagados</p>
            <p className="text-2xl font-semibold text-[#6B4423]">{paidCount}</p>
          </div>
          <div className="rounded-xl border border-[#efe2d2] bg-white p-4 shadow-sm">
            <p className="text-xs text-gray-500">Ticket promedio</p>
            <p className="text-2xl font-semibold text-[#6B4423]">
              {formatCurrency(ticketPromedio)}
            </p>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="rounded-xl border border-[#efe2d2] bg-white p-4 shadow-sm">
            <h3 className="text-sm font-semibold text-[#6B4423] mb-3">
              Pedidos por estado
            </h3>
            <div className="grid grid-cols-2 gap-2 text-sm text-gray-700">
              {(["pending", "cooking", "ready", "paid", "cancelled"] as const).map(
                (status) => (
                  <div
                    key={status}
                    className="flex items-center justify-between rounded-lg border border-[#f1e3d4] bg-[#fdf8f3] px-3 py-2"
                  >
                    <span className="capitalize">{status}</span>
                    <span className="font-semibold text-[#6B4423]">
                      {statusCounts[status] ?? 0}
                    </span>
                  </div>
                ),
              )}
            </div>
          </div>

          <div className="rounded-xl border border-[#efe2d2] bg-white p-4 shadow-sm">
            <h3 className="text-sm font-semibold text-[#6B4423] mb-3">
              Top productos vendidos (pagados)
            </h3>
            {topProducts.length === 0 ? (
              <p className="text-sm text-gray-500">Aún no hay datos de ventas.</p>
            ) : (
              <ul className="space-y-2 text-sm text-gray-700">
                {topProducts.map((item) => (
                  <li
                    key={item.nombre}
                    className="flex items-center justify-between rounded-lg border border-[#f1e3d4] bg-[#fdf8f3] px-3 py-2"
                  >
                    <span>{item.nombre}</span>
                    <span className="font-semibold text-[#6B4423]">
                      {item.unidades} UNT
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
