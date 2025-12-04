"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Minus, Plus, X } from "lucide-react";
import { toast } from "sonner";

import { MainLayout } from "@/components/luwak/MainLayout";
import { LeftPanel } from "@/components/luwak/LeftPanel";
import { useAuth } from "@/components/auth/AuthProvider";
import { useOrders } from "@/components/orders/OrdersProvider";
import type { ItemCarrito, UserRole } from "@/types/luwak";
import { CATEGORIAS, PRODUCTOS, type Categoria, type CategoriaSlug, type Producto } from "@/data/menu";



/* ─────────────────────────────────────
   Utilidades de rol
   ───────────────────────────────────── */

function PageLoader() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f5f2ed]">
      <span className="text-sm text-[#6B4423]">Cargando…</span>
    </div>
  );
}

function roleIsPOS(role: UserRole) {
  return role === "mesero" || role === "admin";
}

function roleIsKitchen(role: UserRole) {
  return role === "chef" || role === "ayudante";
}

/* ─────────────────────────────────────
   Tablero de cocina (chef / ayudante)
   ───────────────────────────────────── */

function ChefBoard() {
  const { orders, updateOrderStatus } = useOrders();
  const { user } = useAuth();

  if (!user) return null;

  const visibles = orders.filter(
    (o) =>
      o.status === "pending" ||
      o.status === "cooking" ||
      o.status === "ready",
  );

  const handleClick = (orderId: string) => {
    const order = orders.find((o) => o.id === orderId);
    if (!order) return;

    if (order.status === "pending") {
      updateOrderStatus(orderId, "cooking");
    } else if (order.status === "cooking") {
      updateOrderStatus(orderId, "ready");
      toast.success(`Orden #${order.orderNumber} lista`, {
        description: order.description,
      });
    }
  };

  const colorClass = (status: string) => {
    switch (status) {
      case "pending":
        return "border-[#6b6b6b] bg-[#f2f2f2]";
      case "cooking":
        return "border-yellow-400 bg-yellow-50";
      case "ready":
        return "border-red-500 bg-red-50";
      default:
        return "border-gray-200 bg-white";
    }
  };

  const statusLabel = (status: string) => {
    switch (status) {
      case "pending":
        return "En cola 🟫";
      case "cooking":
        return "Cocinando 🟨";
      case "ready":
        return "Listo 🟥";
      default:
        return status;
    }
  };

  return (
    <MainLayout>
      <div className="space-y-4">
        <div className="bg-white rounded-xl shadow px-4 py-3">
          <h1 className="text-lg font-bold text-[#6B4423] mb-1">
            Panel de cocina
          </h1>
          <p className="text-xs text-gray-600">
            Toca una tarjeta para cambiar de estado: 🟫 → 🟨 → 🟥.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3">
          {visibles.length === 0 ? (
            <p className="text-xs text-gray-500 px-1">
              No hay pedidos en cola.
            </p>
          ) : (
            visibles.map((order) => (
              <button
                key={order.id}
                type="button"
                onClick={() => handleClick(order.id)}
                className={`text-left rounded-xl border ${colorClass(
                  order.status,
                )} p-3 sm:p-4 shadow-sm hover:shadow-md transition`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-semibold text-[#6B4423]">
                    Pedido #{order.orderNumber}
                  </span>
                  <span className="text-[11px] font-medium">
                    {statusLabel(order.status)}
                  </span>
                </div>

                <div className="text-[11px] text-gray-800 mb-1">
                  {order.items && order.items.length > 0 ? (
                    <ul className="list-disc list-inside space-y-0.5">
                      {order.items.map((it) => (
                        <li key={it.id}>
                          {it.quantity}x {it.name}
                          {it.variant ? ` (${it.variant})` : ""}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <span>{order.description}</span>
                  )}
                </div>

                <div className="text-[11px] text-gray-500 mt-1">
                  Mesero: {order.createdByName}
                </div>
              </button>
            ))
          )}
        </div>
      </div>
    </MainLayout>
  );
}

/* ─────────────────────────────────────
   Página principal /inicio
   ───────────────────────────────────── */

export default function InicioPage() {
  const router = useRouter();
  const { user, isLoading } = useAuth();
  const { createOrderFromCart } = useOrders();

  const [items, setItems] = useState<ItemCarrito[]>([]);
  const [categoriaActiva, setCategoriaActiva] =
    useState<CategoriaSlug>("premium");
  const [productoSeleccionado, setProductoSeleccionado] =
    useState<Producto | null>(null);
  const [varianteSeleccionada, setVarianteSeleccionada] =
    useState<string | null>(null);
  const [cantidad, setCantidad] = useState<number>(1);

  useEffect(() => {
    if (!isLoading && !user) {
      router.replace("/login?redirect=/inicio");
    }
  }, [user, isLoading, router]);

  const productosVisibles = useMemo(
    () => PRODUCTOS.filter((p) => p.categoria === categoriaActiva),
    [categoriaActiva],
  );

  const precioActual = productoSeleccionado
    ? productoSeleccionado.precio * cantidad
    : 0;

  if (isLoading || !user) return <PageLoader />;

  // Si es chef o ayudante → solo ve tablero de cocina
  if (roleIsKitchen(user.role)) {
    return <ChefBoard />;
  }

  // Manejo básico del draft de orden (para LeftPanel)
  const handleRemoveItem = (index: number) => {
    setItems((prev) => prev.filter((_, i) => i !== index));
  };

  const handleProductClick = (prod: Producto) => {
    setProductoSeleccionado(prod);
    setCantidad(1);
    setVarianteSeleccionada(prod.variantes?.[0] ?? null);
  };

  const handleCloseModal = () => {
    setProductoSeleccionado(null);
    setCantidad(1);
    setVarianteSeleccionada(null);
  };

  const handleAddItem = () => {
    if (!productoSeleccionado || !roleIsPOS(user.role)) return;

    setItems((prev) => {
      const idx = prev.findIndex(
        (item) =>
          item.id === productoSeleccionado.id &&
          item.variante === (varianteSeleccionada ?? null),
      );

      if (idx >= 0) {
        const updated = [...prev];
        updated[idx] = {
          ...updated[idx],
          cantidad: updated[idx].cantidad + cantidad,
        };
        return updated;
      }

      return [
        ...prev,
        {
          id: productoSeleccionado.id,
          nombre: productoSeleccionado.nombre,
          precio: productoSeleccionado.precio,
          cantidad,
          variante: varianteSeleccionada ?? null,
        },
      ];
    });

    toast.success(`${productoSeleccionado.nombre} agregado al pedido`, {
      description: `Cantidad: ${cantidad}${
        varianteSeleccionada ? ` • ${varianteSeleccionada}` : ""
      }`,
    });

    handleCloseModal();
  };

  const incrementarCantidad = () => setCantidad((prev) => prev + 1);
  const decrementarCantidad = () =>
    setCantidad((prev) => (prev > 1 ? prev - 1 : 1));

  const handleClearCart = () => {
    setItems([]);
  };

  const handleConfirmOrder = () => {
    if (!roleIsPOS(user.role)) return;
    if (items.length === 0) {
      toast.error("No hay productos en el pedido.");
      return;
    }

    const order = createOrderFromCart(items);
    if (!order) return;

    setItems([]);
    toast.success(`Orden #${order.orderNumber} creada con éxito`, {
      description: order.description,
    });
  };

  const subtotal = items.reduce(
    (sum, item) => sum + item.precio * item.cantidad,
    0,
  );
  const igv = subtotal * 0.18;
  const total = subtotal; // IGV implícito en el precio

  const leftPanelEnabled = roleIsPOS(user.role);

  return (
    <MainLayout
      leftPanel={
        leftPanelEnabled ? (
          <LeftPanel
            items={items}
            onRemoveItem={handleRemoveItem}
            onClearCart={handleClearCart}
            onConfirmOrder={handleConfirmOrder}
            isLoading={false}
          />
        ) : undefined
      }
    >
      <div className="space-y-4 lg:space-y-6">
        {/* Encabezado simple */}
        <div className="flex items-baseline justify-between">
          <h1 className="text-xl sm:text-2xl font-bold text-[#6B4423]">
            Carta LUWAK
          </h1>
          {leftPanelEnabled && (
            <p className="text-xs sm:text-sm text-gray-500 text-right">
              Total actual: S/ {total.toFixed(2)} (IGV implícito: S/{" "}
              {igv.toFixed(2)}).
            </p>
          )}
        </div>

        {/* Barra de categorías */}
        <div className="bg-white rounded-xl shadow px-3 sm:px-4 py-2 sm:py-3">
          <div className="flex flex-wrap gap-2 text-[11px] sm:text-xs">
            {CATEGORIAS.map((cat) => {
              const active = cat.slug === categoriaActiva;
              return (
                <button
                  key={cat.slug}
                  type="button"
                  onClick={() => setCategoriaActiva(cat.slug)}
                  className={`px-3 py-1.5 rounded-full border transition ${
                    active
                      ? "bg-[#6B4423] text-white border-[#6B4423]"
                      : "bg-[#f5ebe0] text-[#6B4423] border-transparent hover:bg-[#e7d3bc]"
                  }`}
                >
                  {cat.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Grid de productos */}
        <div className="bg-white rounded-xl shadow px-3 sm:px-4 py-3 sm:py-4">
          <h2 className="text-sm sm:text-lg font-semibold mb-3">Productos</h2>

          <div className="grid grid-cols-1 xs:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4">
            {productosVisibles.map((prod) => {
              const clickable = roleIsPOS(user.role);

              return (
                <article
                  key={prod.id}
                  onClick={() => {
                    if (!clickable) return;
                    handleProductClick(prod);
                  }}
                  className={`rounded-xl overflow-hidden border border-[#f0e3d5] bg-[#fdf8f3] flex flex-col transition ${
                    clickable
                      ? "cursor-pointer hover:shadow-md"
                      : "opacity-70 cursor-not-allowed"
                  }`}
                >
                  {/* Imagen */}
                  <div className="relative h-24 sm:h-28 w-full bg-[#e3d4c3]">
                    {prod.imagen ? (
                      <Image
                        src={prod.imagen}
                        alt={prod.nombre}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="flex items-center justify-center h-full text-[11px] text-[#6B4423] px-2 text-center">
                        {prod.nombre}
                      </div>
                    )}
                  </div>

                  {/* Info */}
                  <div className="flex-1 flex flex-col px-3 py-2">
                    <div className="text-[13px] font-semibold text-[#6B4423] line-clamp-2">
                      {prod.nombre}
                    </div>

                    {prod.descripcion && (
                      <p className="mt-1 text-[11px] text-gray-600 line-clamp-2">
                        {prod.descripcion}
                      </p>
                    )}

                    {prod.variantes && (
                      <p className="mt-1 text-[10px] text-[#8b5a3c] italic line-clamp-1">
                        {prod.variantes.join(" • ")}
                      </p>
                    )}

                    <div className="mt-2 text-xs text-[#8b5a3c] font-semibold">
                      S/ {prod.precio.toFixed(2)}
                    </div>

                    <div className="mt-1 text-[10px] text-gray-500">
                      {clickable
                        ? "Toca para elegir cantidad y variante"
                        : "Solo lectura"}
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </div>

      {productoSeleccionado && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 px-4">
          <div className="relative bg-white w-full max-w-3xl rounded-2xl shadow-xl overflow-hidden">
            <button
              type="button"
              onClick={handleCloseModal}
              aria-label="Cerrar detalle"
              className="absolute right-3 top-3 z-20 inline-flex h-10 w-10 items-center justify-center rounded-full bg-white/90 text-[#6B4423] shadow-md ring-1 ring-[#e4d6c5] hover:bg-white"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="grid md:grid-cols-2 gap-0">
              <div className="relative h-52 md:h-full min-h-[260px] bg-[#f5ebe0]">
                {productoSeleccionado.imagen ? (
                  <Image
                    src={productoSeleccionado.imagen}
                    alt={productoSeleccionado.nombre}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center p-6 text-center text-sm text-[#6B4423]">
                    {productoSeleccionado.nombre}
                  </div>
                )}
              </div>

              <div className="p-5 space-y-4">
                <div className="space-y-1">
                  <p className="text-xs uppercase tracking-wide text-[#8b5a3c]">
                    Detalle del producto
                  </p>
                  <h3 className="text-xl font-semibold text-[#6B4423]">
                    {productoSeleccionado.nombre}
                  </h3>
                  <p className="text-sm text-gray-600">
                    Precio base: S/ {productoSeleccionado.precio.toFixed(2)}
                  </p>
                  {productoSeleccionado.descripcion && (
                    <p className="text-sm text-gray-600">
                      {productoSeleccionado.descripcion}
                    </p>
                  )}
                </div>

                <div className="flex items-center justify-between rounded-lg border border-[#ead9c8] bg-[#fdf8f3] px-3 py-2">
                  <div className="text-sm text-gray-700">Cantidad</div>
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={decrementarCantidad}
                      className="h-9 w-9 rounded-full border border-[#e0cdb8] text-[#6B4423] hover:bg-[#f1e3d4] disabled:opacity-50"
                      disabled={cantidad <= 1}
                    >
                      <Minus className="h-4 w-4 mx-auto" />
                    </button>
                    <span className="min-w-[32px] text-center text-base font-semibold text-[#6B4423]">
                      {cantidad}
                    </span>
                    <button
                      type="button"
                      onClick={incrementarCantidad}
                      className="h-9 w-9 rounded-full border border-[#e0cdb8] text-[#6B4423] hover:bg-[#f1e3d4]"
                    >
                      <Plus className="h-4 w-4 mx-auto" />
                    </button>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-[#6B4423]">
                      Variantes / sabores
                    </p>
                    <span className="text-xs text-gray-500">
                      Opcional según el producto
                    </span>
                  </div>
                  {productoSeleccionado.variantes?.length ? (
                    <div className="flex flex-wrap gap-2">
                      {productoSeleccionado.variantes.map((variante) => {
                        const active = varianteSeleccionada === variante;
                        return (
                          <button
                            key={variante}
                            type="button"
                            onClick={() => setVarianteSeleccionada(variante)}
                            className={`px-3 py-1.5 rounded-full border text-sm transition ${
                              active
                                ? "bg-[#6B4423] text-white border-[#6B4423]"
                                : "bg-[#f5ebe0] text-[#6B4423] border-[#e0cdb8] hover:bg-[#e9d7c6]"
                            }`}
                          >
                            {variante}
                          </button>
                        );
                      })}
                    </div>
                  ) : (
                    <p className="text-xs text-gray-500">
                      Este producto no tiene variantes configuradas.
                    </p>
                  )}
                </div>

                <div className="flex items-center justify-between rounded-lg bg-[#f5f0eb] px-3 py-2">
                  <div className="text-sm text-gray-600">Precio total</div>
                  <div className="text-lg font-semibold text-[#2D5016]">
                    S/ {precioActual.toFixed(2)}
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleAddItem}
                  disabled={!leftPanelEnabled}
                  className={`w-full rounded-lg px-4 py-2 text-sm font-semibold text-white transition ${
                    leftPanelEnabled
                      ? "bg-[#2D5016] hover:bg-[#3D6026]"
                      : "bg-gray-400 cursor-not-allowed"
                  }`}
                >
                  Agregar al pedido
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </MainLayout>
  );
}
