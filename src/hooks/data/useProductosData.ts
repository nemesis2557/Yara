"use client";

import { useMemo } from "react";
import { useOrders } from "@/components/orders/OrdersProvider";

export interface ProductoMock {
  id: string;
  nombre: string;
  categoria: string;
  precio_base: number;
}

export function useProductosData() {
  const { orders } = useOrders();

  const productos = useMemo<ProductoMock[]>(
    () => [
      { id: "cafe-americano", nombre: "Café americano", categoria: "Bebidas", precio_base: 8 },
      { id: "latte-vainilla", nombre: "Latte vainilla", categoria: "Bebidas", precio_base: 12 },
      { id: "capuccino", nombre: "Capuccino", categoria: "Bebidas", precio_base: 12 },
      { id: "moka-frio", nombre: "Moka frío", categoria: "Bebidas", precio_base: 15 },
      { id: "brownie", nombre: "Brownie", categoria: "Postres", precio_base: 10 },
      { id: "croissant", nombre: "Croissant", categoria: "Panadería", precio_base: 10 },
    ],
    [],
  );

  const topVendidosHoy = (date: Date = new Date(), sourceOrders = orders) => {
    const target = date.toISOString().slice(0, 10);
    const tally: Record<string, { nombre: string; unidades: number }> = {};

    sourceOrders
      .filter((order) => order.status === "paid" && order.createdAt.slice(0, 10) === target)
      .forEach((order) => {
        order.items.forEach((item) => {
          const current = tally[item.name] ?? { nombre: item.name, unidades: 0 };
          tally[item.name] = {
            nombre: item.name,
            unidades: current.unidades + item.quantity,
          };
        });
      });

    return Object.values(tally)
      .sort((a, b) => b.unidades - a.unidades)
      .slice(0, 5);
  };

  return { productos, topVendidosHoy };
}
