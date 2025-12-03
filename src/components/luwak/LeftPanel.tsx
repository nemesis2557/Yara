'use client';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { ItemCarrito } from '@/types/luwak';
import { Trash2, X } from 'lucide-react';

interface LeftPanelProps {
  items: ItemCarrito[];
  onRemoveItem: (index: number) => void;
  onClearCart: () => void;
  onConfirmOrder: () => void;
  isLoading?: boolean;
}

export function LeftPanel({
  items,
  onRemoveItem,
  onClearCart,
  onConfirmOrder,
  isLoading = false,
}: LeftPanelProps) {

  const subtotal = items.reduce(
    (sum, item) => sum + item.precio * item.cantidad,
    0
  );

  const igv = subtotal * 0.18;
  const total = subtotal; // Tus precios ya incluyen IGV

  return (
    <Card className="sticky top-20 overflow-hidden">

      {/* HEADER */}
      <div className="relative h-32 bg-gradient-to-r from-[#6B4423] to-[#8B5A3C]">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center text-white">
            <h3 className="text-lg font-bold">LUWAK Cafetería</h3>
            <p className="text-sm opacity-90">Resumen del pedido</p>
          </div>
        </div>
      </div>

      {/* BODY */}
      <div className="p-4">
        <h4 className="font-semibold text-gray-900 mb-3">Pedido actual</h4>

        {items.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <p className="text-sm">No hay productos en el carrito</p>
          </div>
        ) : (
          <>
            {/* LISTADO DE ITEMS */}
            <div className="space-y-3 max-h-[400px] overflow-y-auto mb-4">
              {items.map((item, index) => (
                <div key={index} className="flex gap-3 p-3 bg-gray-50 rounded-lg">
                  <div className="flex-1">
                    <p className="font-medium text-sm text-gray-900">
                      {item.nombre}
                    </p>

                    {item.variante && (
                      <p className="text-xs text-gray-500 mt-0.5">
                        Variante: {item.variante}
                      </p>
                    )}

                    <p className="text-xs text-gray-600 mt-1">
                      {item.cantidad} x S/ {item.precio.toFixed(2)}
                    </p>

                    <p className="text-sm font-semibold text-[#6B4423] mt-1">
                      S/ {(item.precio * item.cantidad).toFixed(2)}
                    </p>
                  </div>

                  <button
                    onClick={() => onRemoveItem(index)}
                    className="text-red-500 hover:text-red-700 p-1"
                    disabled={isLoading}
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>

            <Separator className="my-4" />

            {/* TOTALES */}
            <div className="space-y-2 text-sm">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal:</span>
                <span>S/ {subtotal.toFixed(2)}</span>
              </div>

              <div className="flex justify-between text-gray-600">
                <span>IGV (18%):</span>
                <span>S/ {igv.toFixed(2)}</span>
              </div>

              <Separator />

              <div className="flex justify-between font-bold text-lg text-gray-900">
                <span>Total:</span>
                <span>S/ {total.toFixed(2)}</span>
              </div>

              <p className="text-xs text-gray-500 italic mt-2">
                * Precios incluyen IGV (18%)
              </p>
            </div>

            {/* BOTONES */}
            <div className="mt-6 space-y-2">
              <Button
                onClick={onClearCart}
                variant="outline"
                className="w-full"
                disabled={isLoading}
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Cancelar pedido
              </Button>

              <Button
                onClick={onConfirmOrder}
                className="w-full bg-[#2D5016] hover:bg-[#3D6026] text-white"
                disabled={isLoading}
              >
                Confirmar pedido
              </Button>
            </div>
          </>
        )}
      </div>
    </Card>
  );
}
