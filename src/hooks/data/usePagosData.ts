"use client";

import { useMemo } from "react";
import { useOrders } from "@/components/orders/OrdersProvider";
import type { PaymentInfo } from "@/types/luwak";

export interface PagoRecord {
  orderId: string;
  orderNumber: number;
  total: number;
  paidAt?: string;
  payment: PaymentInfo | null;
}

export function usePagosData() {
  const { orders, registerPayment } = useOrders();

  const pagos = useMemo<PagoRecord[]>(() => {
    return orders
      .filter((order) => order.status === "paid")
      .map((order) => ({
        orderId: order.id,
        orderNumber: order.orderNumber,
        total: order.total,
        paidAt: order.paidAt,
        payment: order.paymentDetails ?? null,
      }))
      .sort((a, b) => {
        const dateA = new Date(a.paidAt ?? "").getTime();
        const dateB = new Date(b.paidAt ?? "").getTime();
        return dateB - dateA;
      });
  }, [orders]);

  const registerPaymentMock = (
    orderId: string,
    payload: PaymentInfo & { nombreCliente?: string },
  ) => {
    registerPayment(orderId, payload);
    // TODO: api.post("/next_api/pagos", { orderId, ...payload })
  };

  return { pagos, registerPayment: registerPaymentMock };
}
