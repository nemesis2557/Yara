// src/types/luwak.ts

export type UserRole = "admin" | "mesero" | "cajero" | "chef" | "ayudante";

export interface AppUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
}

export type OrderStatus =
  | "pending"    // 🟫 En cola
  | "cooking"    // 🟨 Cocinando
  | "ready"      // 🟥 Listo
  | "paid"       // 🟩 Pagado
  | "cancelled"; // ❌ Cancelado

export type PaymentMethod = "efectivo" | "yape" | null;

export interface OrderItem {
  id: string;
  productId: string;
  name: string;
  quantity: number;
  unitPrice: number; // precio con IGV incluido
  variant?: string | null;
}

export interface Order {
  id: string;            // UUID interno
  orderNumber: number;   // número secuencial del día
  description: string;   // snippet: "Hamburguesa soda"
  total: number;         // total con IGV incluido
  status: OrderStatus;
  createdAt: string;     // ISO date
  createdById: string;
  createdByName: string;
  items: OrderItem[];
  paymentMethod: PaymentMethod;
}

export interface ItemCarrito {
  id: string;
  nombre: string;
  precio: number;
  cantidad: number;
  variante?: string | null;
}

export interface NoteCompra {
  id: string;
  text: string;
  createdAt: string;
  createdById: string;
  createdByName: string;
  role: UserRole;
}
