"use client";

import { useMemo, useState } from "react";
import { MessageCircle, X } from "lucide-react";
import { useOrders } from "@/components/orders/OrdersProvider";
import { useAuth } from "@/components/auth/AuthProvider";

export function NotesFab() {
  const { notes } = useOrders();
  const { user } = useAuth();
  const [open, setOpen] = useState(false);

  // Solo notas creadas por chef / ayudante / admin
  const notasVisibles = useMemo(
    () =>
      notes
        .filter((n) =>
          ["chef", "ayudante", "admin"].includes(n.role as string)
        )
        .sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        ),
    [notes]
  );

  // Si no hay user igual mostramos el botón, solo que el texto dirá que no hay notas
  return (
    <>
      {/* Botón flotante abajo a la derecha */}
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="
          fixed bottom-4 right-4 z-40
          rounded-full shadow-lg
          bg-[#6B4423] text-white
          w-12 h-12
          flex items-center justify-center
          hover:bg-[#8b5a3c]
          focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#6B4423]
        "
      >
        <MessageCircle className="w-6 h-6" />
      </button>

      {/* Panel de notas (card) */}
      {open && (
        <div
          className="
            fixed bottom-20 right-4 z-40
            w-[calc(100%-2rem)] max-w-md
            sm:max-w-sm sm:bottom-20 sm:right-6
            md:max-w-md
          "
        >
          <div className="bg-white rounded-2xl shadow-xl border border-[#f0e3d5] overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 bg-[#fdf5ee]">
              <div>
                <h3 className="text-sm font-semibold text-[#6B4423]">
                  Notas de cocina
                </h3>
                <p className="text-[11px] text-gray-600">
                  Chef, ayudantes y admin pueden dejar notas aquí.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="p-1 rounded-full hover:bg-black/5"
              >
                <X className="w-4 h-4 text-gray-600" />
              </button>
            </div>

            {/* Contenido */}
            <div className="max-h-72 sm:max-h-80 overflow-y-auto px-4 py-3 space-y-2">
              {notasVisibles.length === 0 ? (
                <p className="text-xs text-gray-500">
                  No hay notas de cocina todavía.
                </p>
              ) : (
                notasVisibles.map((note) => (
                  <div
                    key={note.id}
                    className="border border-[#f0e3d5] rounded-xl px-3 py-2 bg-[#fffaf5]"
                  >
                    <p className="text-xs text-gray-800 whitespace-pre-wrap">
                      {note.text}
                    </p>
                    <div className="mt-1 flex items-center justify-between">
                      <span className="text-[10px] text-[#6B4423] font-medium">
                        {note.createdByName} ({note.role})
                      </span>
                      <span className="text-[10px] text-gray-400">
                        {new Date(note.createdAt).toLocaleTimeString("es-PE", {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
