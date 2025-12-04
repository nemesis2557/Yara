"use client";

import { useMemo, useState } from "react";
import { useOrders } from "@/components/orders/OrdersProvider";
import type { OrderStatus } from "@/types/luwak";

export const ADMIN_CODE_PLACEHOLDER = "0000";

interface DateRange {
  from: Date | null;
  to: Date | null;
}

function isWithinRange(date: Date, range: DateRange) {
  const time = date.getTime();
  if (range.from && time < new Date(range.from).setHours(0, 0, 0, 0)) {
    return false;
  }
  if (range.to && time > new Date(range.to).setHours(23, 59, 59, 999)) {
    return false;
  }
  return true;
}

export function useOrdersData() {
  const { orders, updateOrderStatus, registerPayment, cancelOrder } = useOrders();
  const [statusFilter, setStatusFilter] = useState<OrderStatus | "all">("all");
  const [dateRange, setDateRange] = useState<DateRange>({
    from: null,
    to: null,
  });

  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      if (statusFilter !== "all" && order.status !== statusFilter) return false;
      if (!isWithinRange(new Date(order.createdAt), dateRange)) return false;
      return true;
    });
  }, [orders, statusFilter, dateRange]);

  const markAsCooking = (orderId: string) => {
    updateOrderStatus(orderId, "cooking");
    // TODO: api.patch(`/next_api/pedidos/${orderId}`, { status: "cooking" })
  };

  const markAsReady = (orderId: string) => {
    updateOrderStatus(orderId, "ready");
    // TODO: api.patch(`/next_api/pedidos/${orderId}`, { status: "ready" })
  };

  const markAsPaid = (orderId: string) => {
    updateOrderStatus(orderId, "paid");
    // TODO: api.patch(`/next_api/pedidos/${orderId}`, { status: "paid" })
  };

  const cancelOrderWithAdminCode = (orderId: string, adminCode: string) => {
    const isValidCode = adminCode.trim() === ADMIN_CODE_PLACEHOLDER;
    if (!isValidCode) {
      return { success: false, message: "Código de administrador incorrecto." } as const;
    }
    cancelOrder(orderId);
    return { success: true, message: "Pedido cancelado" } as const;
  };

  return {
    orders,
    filteredOrders,
    statusFilter,
    dateRange,
    setFilterByStatus: setStatusFilter,
    setFilterByDateRange: setDateRange,
    markAsCooking,
    markAsReady,
    markAsPaid,
    cancelOrderWithAdminCode,
    registerPayment, // re-exported for convenience
  };
}
