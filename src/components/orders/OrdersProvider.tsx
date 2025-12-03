"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  ReactNode,
} from "react";
import { nanoid } from "nanoid";
import type {
  Order,
  OrderItem,
  OrderStatus,
  PaymentMethod,
  ItemCarrito,
  NoteCompra,
} from "@/types/luwak";
import { useAuth } from "@/components/auth/AuthProvider";

interface OrdersContextValue {
  orders: Order[];
  notes: NoteCompra[];
  createOrderFromCart: (cartItems: ItemCarrito[]) => Order | null;
  updateOrderStatus: (orderId: string, status: OrderStatus) => void;
  registerPayment: (orderId: string, method: PaymentMethod) => void;
  cancelOrder: (orderId: string) => void;
  addNote: (text: string) => void;
  deleteNote: (noteId: string) => void;
}

const OrdersContext = createContext<OrdersContextValue | null>(null);

const ORDERS_KEY = "luwak_orders";
const NOTES_KEY = "luwak_notes";

function loadFromStorage<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

function saveToStorage<T>(key: string, value: T) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {}
}

export function OrdersProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [orders, setOrders] = useState<Order[]>(() =>
    loadFromStorage<Order[]>(ORDERS_KEY, []),
  );
  const [notes, setNotes] = useState<NoteCompra[]>(() =>
    loadFromStorage<NoteCompra[]>(NOTES_KEY, []),
  );

  useEffect(() => {
    saveToStorage(ORDERS_KEY, orders);
  }, [orders]);

  useEffect(() => {
    saveToStorage(NOTES_KEY, notes);
  }, [notes]);

  const getNextOrderNumber = () => {
    const today = new Date().toISOString().slice(0, 10);
    const todayOrders = orders.filter(
      (o) => o.createdAt.slice(0, 10) === today,
    );
    if (todayOrders.length === 0) return 1;
    return Math.max(...todayOrders.map((o) => o.orderNumber)) + 1;
  };

  const createOrderFromCart = (cartItems: ItemCarrito[]): Order | null => {
    if (!user || cartItems.length === 0) return null;

    const total = cartItems.reduce(
      (sum, item) => sum + item.precio * item.cantidad,
      0,
    );

    const items: OrderItem[] = cartItems.map((item) => ({
      id: nanoid(),
      productId: item.id,
      name: item.nombre,
      quantity: item.cantidad,
      unitPrice: item.precio,
      variant: item.variante ?? null,
    }));

    const description =
      items.length === 1
        ? items[0].name
        : `${items[0].name} + ${items.length - 1} ítem(s) más`;

    const newOrder: Order = {
      id: nanoid(),
      orderNumber: getNextOrderNumber(),
      description,
      total,
      status: "pending",
      createdAt: new Date().toISOString(),
      createdById: user.id,
      createdByName: user.name,
      items,
      paymentMethod: null,
    };

    setOrders((prev) => [...prev, newOrder]);
    return newOrder;
  };

  const updateOrderStatus = (orderId: string, status: OrderStatus) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, status } : o)),
    );
  };

  const registerPayment = (orderId: string, method: PaymentMethod) => {
    setOrders((prev) =>
      prev.map((o) =>
        o.id === orderId
          ? { ...o, status: "paid", paymentMethod: method }
          : o,
      ),
    );
  };

  const cancelOrder = (orderId: string) => {
    setOrders((prev) =>
      prev.map((o) =>
        o.id === orderId ? { ...o, status: "cancelled" } : o,
      ),
    );
  };

  const addNote = (text: string) => {
    if (!user) return;
    const note: NoteCompra = {
      id: nanoid(),
      text,
      createdAt: new Date().toISOString(),
      createdById: user.id,
      createdByName: user.name,
      role: user.role,
    };
    setNotes((prev) => [...prev, note]);
  };

  const deleteNote = (noteId: string) => {
    setNotes((prev) => prev.filter((n) => n.id !== noteId));
  };

  const value: OrdersContextValue = useMemo(
    () => ({
      orders,
      notes,
      createOrderFromCart,
      updateOrderStatus,
      registerPayment,
      cancelOrder,
      addNote,
      deleteNote,
    }),
    [orders, notes],
  );

  return (
    <OrdersContext.Provider value={value}>
      {children}
    </OrdersContext.Provider>
  );
}

export function useOrders() {
  const ctx = useContext(OrdersContext);
  if (!ctx) throw new Error("useOrders must be used within OrdersProvider");
  return ctx;
}
