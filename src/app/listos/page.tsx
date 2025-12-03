// src/app/listos/page.tsx
"use client";

import React, { useMemo, useState } from "react";
import { MainLayout } from "@/components/luwak/MainLayout";
import { useAuth } from "@/components/auth/AuthProvider";
import { useOrders } from "@/components/orders/OrdersProvider";
import type { UserRole, Order } from "@/types/luwak";
import { Lock } from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import Image from "next/image";

export default function ListosPage() {
  const { user } = useAuth();
  const { orders, registerPayment } = useOrders();
  const [selected, setSelected] = useState<Order | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<"efectivo" | "yape" | null>(
    null,
  );
  const [numeroOperacion, setNumeroOperacion] = useState("");
  const [nombreCliente, setNombreCliente] = useState("");
  const [fotoYapeUrl, setFotoYapeUrl] = useState<string | undefined>(undefined);

  const readyOrders = useMemo(
    () => orders.filter((o) => o.status === "ready"),
    [orders],
  );

  const resetModal = () => {
    setPaymentMethod(null);
    setNumeroOperacion("");
    setFotoYapeUrl(undefined);
    setNombreCliente("");
    setSelected(null);
  };

  const canConfirm = useMemo(() => {
    if (!selected) return false;
    if (paymentMethod === "efectivo") return true;
    if (paymentMethod === "yape") {
      return Boolean(numeroOperacion || fotoYapeUrl);
    }
    return false;
  }, [selected, paymentMethod, numeroOperacion, fotoYapeUrl]);

  if (!user) return null;

  const allowedRoles: UserRole[] = ["admin", "mesero", "cajero", "ayudante", "chef"];

  // ⚠️ Si el rol NO está permitido → tarjeta de Acceso restringido
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
              Usted no tiene acceso a la sección de <strong>LISTOS</strong>.
              Consulte con el administrador si cree que esto es un error.
            </p>
          </div>
        </div>
      </MainLayout>
    );
  }

  const handleConfirm = () => {
    if (!selected || !paymentMethod) return;
    registerPayment(selected.id, {
      method: paymentMethod,
      numeroOperacion: numeroOperacion || undefined,
      fotoYapeUrl,
      nombreCliente: nombreCliente || undefined,
      cashierId: user.id,
      cashierName: user.name || user.username || "Usuario",
    });
    resetModal();
  };

  const handleFile = (fileList: FileList | null) => {
    if (!fileList || fileList.length === 0) return;
    const file = fileList[0];
    const url = URL.createObjectURL(file);
    setFotoYapeUrl(url);
  };

  return (
    <MainLayout>
      <div className="space-y-4">
        <h1 className="text-xl font-semibold text-[#6B4423]">
          Órdenes listas (rojo) y listas para cobrar / entregar
        </h1>

        {readyOrders.length === 0 ? (
          <p className="text-sm text-gray-500">
            No hay órdenes en estado <strong>Listo</strong> por el momento.
          </p>
        ) : (
          <div className="overflow-x-auto bg-white rounded-xl shadow border border-[#efe2d2]">
            <table className="min-w-full text-sm">
              <thead className="bg-[#f7eee4] text-[#6B4423]">
                <tr>
                  <th className="px-3 py-2 text-left"># de Pedido</th>
                  <th className="px-3 py-2 text-left">Nombre usuario</th>
                  <th className="px-3 py-2 text-left">Descripción</th>
                  <th className="px-3 py-2 text-left">Costo Total</th>
                  <th className="px-3 py-2 text-left">Estado</th>
                  <th className="px-3 py-2 text-left">Fecha</th>
                  <th className="px-3 py-2 text-left">Hora</th>
                  <th className="px-3 py-2 text-left">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {readyOrders.map((order, index) => (
                  <tr key={order.id} className="border-t border-[#f1e3d4]">
                    {/* # de Pedido */}
                    <td className="px-3 py-2">#{order.orderNumber ?? index + 1}</td>

                    {/* Usuario */}
                    <td className="px-3 py-2">{order.createdByName ?? "—"}</td>

                    {/* Descripción */}
                    <td className="px-3 py-2">{order.description ?? "—"}</td>

                    {/* Total */}
                    <td className="px-3 py-2">{formatCurrency(order.total ?? 0)}</td>

                    {/* Estado */}
                    <td className="px-3 py-2">
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-red-100 text-red-700">
                        Listo
                      </span>
                    </td>

                    {/* Fecha */}
                    <td className="px-3 py-2">
                      {order.createdAt
                        ? new Date(order.createdAt).toLocaleDateString("es-PE")
                        : "—"}
                    </td>

                    {/* Hora */}
                    <td className="px-3 py-2">
                      {order.createdAt
                        ? new Date(order.createdAt).toLocaleTimeString("es-PE", {
                            hour: "2-digit",
                            minute: "2-digit",
                          })
                        : "—"}
                    </td>

                    {/* Acciones */}
                    <td className="px-3 py-2">
                      <button
                        type="button"
                        onClick={() => setSelected(order)}
                        className="px-2.5 py-1 rounded-md text-xs font-semibold bg-[#6B4423] text-white hover:bg-[#53351c] transition"
                      >
                        Ver detalle
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
          <div className="w-full max-w-2xl rounded-2xl bg-white shadow-2xl border border-[#efe2d2]">
            <div className="flex items-center justify-between border-b border-[#f1e3d4] px-5 py-3">
              <div>
                <p className="text-xs text-gray-500">Pedido #{selected.orderNumber}</p>
                <h3 className="text-lg font-semibold text-[#6B4423]">Cobro</h3>
              </div>
              <button
                type="button"
                onClick={resetModal}
                className="rounded-full border border-[#f0e3d5] p-2 text-[#6B4423] hover:bg-[#f7eee4]"
              >
                Cerrar
              </button>
            </div>

            <div className="grid gap-4 px-5 py-4 md:grid-cols-2">
              <div className="space-y-3">
                <h4 className="text-sm font-semibold text-[#6B4423]">
                  Detalle del pedido
                </h4>
                <div className="rounded-lg border border-[#f1e3d4] bg-[#fdf8f3] p-3 text-sm text-gray-700">
                  <p className="font-semibold text-[#6B4423]">{selected.description}</p>
                  <p className="text-xs text-gray-500">
                    Mesero: {selected.createdByName}
                  </p>
                  <hr className="my-2 border-[#f1e3d4]" />
                  <ul className="space-y-1">
                    {selected.items.map((item) => (
                      <li
                        key={item.id}
                        className="flex items-center justify-between text-sm"
                      >
                        <span>
                          {item.quantity}x {item.name}
                          {item.variant ? ` (${item.variant})` : ""}
                        </span>
                        <span className="font-semibold text-[#6B4423]">
                          {formatCurrency(item.unitPrice * item.quantity)}
                        </span>
                      </li>
                    ))}
                  </ul>
                  <div className="mt-3 flex items-center justify-between text-sm font-semibold text-[#6B4423]">
                    <span>Total</span>
                    <span>{formatCurrency(selected.total)}</span>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <h4 className="text-sm font-semibold text-[#6B4423]">
                  Selecciona el método de pago
                </h4>

                <div className="grid grid-cols-2 gap-2 text-sm">
                  <button
                    type="button"
                    onClick={() => setPaymentMethod("efectivo")}
                    className={`rounded-lg border px-3 py-2 font-semibold transition ${paymentMethod === "efectivo" ? "border-green-600 bg-green-50 text-green-700" : "border-[#e4d6c5] text-[#6B4423] hover:bg-[#f7eee4]"}`}
                  >
                    Efectivo
                  </button>
                  <button
                    type="button"
                    onClick={() => setPaymentMethod("yape")}
                    className={`rounded-lg border px-3 py-2 font-semibold transition ${paymentMethod === "yape" ? "border-purple-600 bg-purple-50 text-purple-700" : "border-[#e4d6c5] text-[#6B4423] hover:bg-[#f7eee4]"}`}
                  >
                    Yape
                  </button>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-semibold text-[#6B4423]">
                    Nombre del cliente (opcional)
                  </label>
                  <input
                    type="text"
                    value={nombreCliente}
                    onChange={(e) => setNombreCliente(e.target.value)}
                    className="w-full rounded-lg border border-[#e4d6c5] px-3 py-2 text-sm text-[#6B4423] shadow-sm focus:border-[#6B4423] focus:outline-none"
                  />
                </div>

                {paymentMethod === "yape" && (
                  <div className="space-y-3 rounded-lg border border-[#efe2d2] bg-[#fdf8f3] p-3 text-sm">
                    <div className="space-y-2">
                      <label className="text-xs font-semibold text-[#6B4423]">
                        Número de operación
                      </label>
                      <input
                        type="text"
                        value={numeroOperacion}
                        onChange={(e) => setNumeroOperacion(e.target.value)}
                        className="w-full rounded-lg border border-[#e4d6c5] px-3 py-2 text-sm text-[#6B4423] shadow-sm focus:border-[#6B4423] focus:outline-none"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-xs font-semibold text-[#6B4423]">
                        Foto o comprobante
                      </label>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleFile(e.target.files)}
                        className="text-xs text-gray-600"
                      />
                      {fotoYapeUrl && (
                        <div className="relative h-32 w-full overflow-hidden rounded-lg border border-[#e4d6c5]">
                          <Image
                            src={fotoYapeUrl}
                            alt="Comprobante Yape"
                            fill
                            className="object-cover"
                          />
                        </div>
                      )}
                    </div>

                    <p className="text-xs text-gray-600">
                      Requiere número de operación o foto para habilitar el botón.
                    </p>
                  </div>
                )}

                <button
                  type="button"
                  disabled={!canConfirm}
                  onClick={handleConfirm}
                  className={`w-full rounded-lg px-4 py-2 text-sm font-semibold text-white transition ${canConfirm ? "bg-[#6B4423] hover:bg-[#53351c]" : "cursor-not-allowed bg-gray-300"}`}
                >
                  Confirmar pago
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </MainLayout>
  );
}
