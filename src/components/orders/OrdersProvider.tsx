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
  registerPayment: (
    orderId: string,
    payload: {
        method: PaymentMethod;
        numeroOperacion?: string;
        fotoYapeUrl?: string;
        nombreCliente?: string;
        cashierId: string;
        cashierName: string;
      },
    ) => void;
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

  useEffect(() => {
    if (orders.length === 0 && user) {
      const seedOrders: Order[] = [
        {
          id: nanoid(),
          orderNumber: 1,
          description: "Café americano + croissant",
          total: 18,
          status: "pending",
          createdAt: new Date().toISOString(),
          createdById: user.id,
          createdByName: user.name || "Mesero",
          items: [
            {
              id: nanoid(),
              productId: "cafe-1",
              name: "Café americano",
              quantity: 1,
              unitPrice: 8,
              variant: "Mediano",
            },
            {
              id: nanoid(),
              productId: "pan-1",
              name: "Croissant",
              quantity: 1,
              unitPrice: 10,
            },
          ],
          paymentMethod: null,
        },
        {
          id: nanoid(),
          orderNumber: 2,
          description: "Latte vainilla",
          total: 12,
          status: "cooking",
          createdAt: new Date(Date.now() - 10 * 60 * 1000).toISOString(),
          createdById: user.id,
          createdByName: user.name || "Mesero",
          items: [
            {
              id: nanoid(),
              productId: "cafe-2",
              name: "Latte vainilla",
              quantity: 1,
              unitPrice: 12,
              variant: "Grande",
            },
          ],
          paymentMethod: null,
        },
        {
          id: nanoid(),
          orderNumber: 3,
          description: "Capuccino + brownie",
          total: 22,
          status: "ready",
          createdAt: new Date(Date.now() - 25 * 60 * 1000).toISOString(),
          createdById: user.id,
          createdByName: user.name || "Mesero",
          items: [
            {
              id: nanoid(),
              productId: "cafe-3",
              name: "Capuccino",
              quantity: 1,
              unitPrice: 12,
            },
            {
              id: nanoid(),
              productId: "postre-1",
              name: "Brownie",
              quantity: 1,
              unitPrice: 10,
            },
          ],
          paymentMethod: null,
        },
        {
          id: nanoid(),
          orderNumber: 4,
          description: "Moka frío",
          total: 15,
          status: "paid",
          createdAt: new Date(Date.now() - 60 * 60 * 1000).toISOString(),
          createdById: user.id,
          createdByName: user.name || "Mesero",
          items: [
            {
              id: nanoid(),
              productId: "cafe-4",
              name: "Moka frío",
              quantity: 1,
              unitPrice: 15,
            },
          ],
          paymentMethod: "efectivo",
          paidAt: new Date(Date.now() - 55 * 60 * 1000).toISOString(),
          paymentDetails: {
            method: "efectivo",
            cashierId: user.id,
            cashierName: user.name || "Cajero",
          },
        },
      ];

      setOrders(seedOrders);
    }
  }, [orders.length, user]);

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

    const registerPayment = (
      orderId: string,
      {
        method,
        numeroOperacion,
        fotoYapeUrl,
        nombreCliente,
        cashierId,
        cashierName,
      }: {
        method: PaymentMethod;
        numeroOperacion?: string;
        fotoYapeUrl?: string;
        nombreCliente?: string;
        cashierId: string;
        cashierName: string;
      },
    ) => {
    setOrders((prev) =>
      prev.map((o) =>
        o.id === orderId
          ? {
              ...o,
              status: "paid",
              paymentMethod: method,
              paidAt: new Date().toISOString(),
              paymentDetails: {
                method,
                numeroOperacion,
                fotoYapeUrl,
                nombreCliente,
                cashierId,
                cashierName,
              },
            }
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
    [orders, notes, createOrderFromCart, updateOrderStatus, registerPayment, cancelOrder, addNote, deleteNote],
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
