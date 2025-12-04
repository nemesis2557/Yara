// src/app/dashboard/page.tsx
"use client";

import React, { useMemo } from "react";
import { MainLayout } from "@/components/luwak/MainLayout";
import { useAuth } from "@/components/auth/AuthProvider";
import type { UserRole, Order } from "@/types/luwak";
import { Lock } from "lucide-react";
import { useOrders } from "@/components/orders/OrdersProvider";
import { formatCurrency } from "@/lib/utils";

function getTodayIso() {
  return new Date().toISOString().slice(0, 10);
}

function groupStatus(orders: Order[]) {
  return orders.reduce(
    (acc, order) => {
      acc[order.status] = (acc[order.status] ?? 0) + 1;
      return acc;
    },
    {} as Record<string, number>,
  );
}

function buildTopProducts(orders: Order[]) {
  const tally: Record<string, { name: string; quantity: number }> = {};
  orders.forEach((order) => {
    order.items.forEach((item) => {
      const current = tally[item.name] ?? { name: item.name, quantity: 0 };
      tally[item.name] = {
        name: item.name,
        quantity: current.quantity + item.quantity,
      };
    });
  });

  return Object.values(tally)
    .sort((a, b) => b.quantity - a.quantity)
    .slice(0, 5);
}

export default function DashboardPage() {
  const { user } = useAuth();
  const { orders } = useOrders();

  const today = getTodayIso();

  const { salesToday, paidCount, ordersToday, ticketPromedio, statusCounts, topProducts } =
    useMemo(() => {
      const paidToday = orders.filter((o) => {
        const paidDate = (o.paidAt ?? o.createdAt).slice(0, 10);
        return o.status === "paid" && paidDate === today;
      });

      const ordersCreatedToday = orders.filter(
        (o) => o.createdAt.slice(0, 10) === today,
      );

      const sales = paidToday.reduce((sum, order) => sum + order.total, 0);
      const ticket = paidToday.length > 0 ? sales / paidToday.length : 0;

      return {
        salesToday: sales,
        paidCount: paidToday.length,
        ordersToday: ordersCreatedToday.length,
        ticketPromedio: ticket,
        statusCounts: groupStatus(orders),
        topProducts: buildTopProducts(paidToday),
      };
    }, [orders, today]);

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
            Resumen diario de ventas, pedidos y productos destacados.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <div className="rounded-xl border border-[#efe2d2] bg-white p-4 shadow-sm">
            <p className="text-xs text-gray-500">Ventas de hoy</p>
            <p className="text-2xl font-semibold text-[#6B4423]">
              {formatCurrency(salesToday)}
            </p>
          </div>
          <div className="rounded-xl border border-[#efe2d2] bg-white p-4 shadow-sm">
            <p className="text-xs text-gray-500">Pedidos cobrados hoy</p>
            <p className="text-2xl font-semibold text-[#6B4423]">{paidCount}</p>
          </div>
          <div className="rounded-xl border border-[#efe2d2] bg-white p-4 shadow-sm">
            <p className="text-xs text-gray-500">Pedidos creados hoy</p>
            <p className="text-2xl font-semibold text-[#6B4423]">{ordersToday}</p>
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
                    key={item.name}
                    className="flex items-center justify-between rounded-lg border border-[#f1e3d4] bg-[#fdf8f3] px-3 py-2"
                  >
                    <span>{item.name}</span>
                    <span className="font-semibold text-[#6B4423]">
                      {item.quantity} uds
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
