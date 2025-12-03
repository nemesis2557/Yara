"use client";
import { useState } from "react";
import { StickyNote, X } from "lucide-react";

export default function FloatingNotesPanel() {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* BOTÓN FLOTANTE */}
      <button
        onClick={() => setOpen(true)}
        className="fixed bottom-4 right-4 z-50 bg-[#6B4423] hover:bg-[#54351a] text-white p-4 rounded-full shadow-xl"
      >
        <StickyNote className="w-6 h-6" />
      </button>

      {/* PANEL EMERGENTE */}
      {open && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center">
          <div className="bg-white w-full sm:max-w-md rounded-t-2xl sm:rounded-2xl p-6 shadow-xl">
            {/* HEADER */}
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold text-[#6B4423]">
                📝 Notas del Chef / Admin / Ayudante
              </h2>

              <button
                onClick={() => setOpen(false)}
                className="text-[#6B4423] hover:text-red-600"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* CONTENIDO (Aquí luego colocamos las notas reales) */}
            <div className="text-gray-700 text-sm space-y-2">
              <p>
                Aquí aparecerán las notas enviadas por el personal autorizado.
              </p>
              <p className="text-gray-500 italic">
                (Más adelante conectamos esta sección con la base de datos)
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
