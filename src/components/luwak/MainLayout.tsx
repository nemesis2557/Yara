// src/components/luwak/MainLayout.tsx
"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Coffee, Menu, X, StickyNote, ChevronDown, Trash2, Edit3, Save, XCircle } from "lucide-react";
import { useAuth } from "@/components/auth/AuthProvider";
import type { UserRole } from "@/types/luwak";
import { useNotes } from "@/components/notes/NotesProvider";
import { useToast } from "@/components/notifications/ToastManager"; // <- ruta correcta a tu ToastManager

interface MainLayoutProps {
  leftPanel?: React.ReactNode;
  children: React.ReactNode;
}

const roleLabel: Record<UserRole, string> = {
  admin: "Administrador",
  mesero: "Mesero",
  cajero: "Cajero",
  chef: "Chef",
  ayudante: "Ayudante",
};

export function MainLayout({ leftPanel, children }: MainLayoutProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuth();
  const { notes = [], addNote, updateNote, deleteNote } = useNotes();
  const { toast } = useToast();

  const [menuOpen, setMenuOpen] = useState(false);
  const [notesOpen, setNotesOpen] = useState(false);

  const [newNoteText, setNewNoteText] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingText, setEditingText] = useState("");

  if (!user) return null;

  const links = (() => {
    const navConfig: { href: string; label: string; roles: UserRole[] }[] = [
      { href: "/inicio", label: "INICIO", roles: ["admin", "mesero", "ayudante", "chef"] },
      { href: "/pedidos", label: "PEDIDOS", roles: ["admin", "mesero", "ayudante"] },
      { href: "/listos", label: "LISTOS", roles: ["admin", "mesero", "cajero", "ayudante"] },
      { href: "/pagados", label: "PAGADOS", roles: ["admin", "mesero", "cajero"] },
      { href: "/dashboard", label: "DASHBOARD", roles: ["admin"] },
      { href: "/ajustes", label: "AJUSTES", roles: ["admin"] },
    ];

    return navConfig.filter((link) => link.roles.includes(user.role));
  })();

  const handleLogout = () => {
    logout();
    router.replace("/login");
    setMenuOpen(false);
  };

  const userInitial = user?.name?.[0]?.toUpperCase() ?? "U";

  // permisos notas
  const role = user.role;
  const canCreateNote = role === "admin" || role === "chef" || role === "ayudante";
  const canEditNote = canCreateNote;
  const canDeleteNote = role === "admin";

  // notas últimas 24h
  const now = Date.now();
  const visibleNotes = notes.filter((n) => {
    const created = new Date(n.createdAt).getTime();
    const hours24 = 24 * 60 * 60 * 1000;
    return now - created <= hours24;
  });

  const handleCreateNote = () => {
    if (!canCreateNote) {
      toast("Usted no tiene permiso para crear notas", "warning");
      return;
    }
    if (!newNoteText.trim()) {
      toast("La nota no puede estar vacía", "warning");
      return;
    }
    addNote({
      text: newNoteText.trim(),
      createdById: user.id,
      createdByName: user.name || "Usuario",
    });
    setNewNoteText("");
    toast("Nota creada correctamente", "success");
  };

  const startEditNote = (id: string, currentText: string) => {
    if (!canEditNote) {
      toast("Usted no tiene permiso para editar notas", "warning");
      return;
    }
    setEditingId(id);
    setEditingText(currentText);
  };

  const handleSaveEdit = (id: string) => {
    if (!editingText.trim()) {
      toast("El texto de la nota no puede estar vacío", "warning");
      return;
    }
    updateNote(id, editingText.trim());
    setEditingId(null);
    setEditingText("");
    toast("Nota actualizada", "success");
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditingText("");
  };

  const handleDeleteNote = (id: string) => {
    if (!canDeleteNote) {
      toast("Sólo el administrador puede eliminar notas", "error");
      return;
    }
    if (!confirm("¿Seguro que deseas eliminar esta nota?")) return;
    deleteNote(id);
    toast("Nota eliminada", "success");
  };

  return (
    <div className="min-h-screen bg-[#f5f2ed] flex flex-col relative">
      <header className="h-16 flex items-center px-4 sm:px-6 bg-white shadow-sm">
        <div className="flex items-center gap-2">
          <Coffee className="w-6 h-6 text-[#6B4423]" />
          <div className="flex flex-col">
            <span className="font-semibold text-[#6B4423] leading-tight">LUWAK Manager</span>
            <span className="text-[10px] text-gray-500 leading-tight">Sistema POS para cafetería</span>
          </div>
        </div>

        <nav className="hidden md:flex items-center gap-3 text-sm font-medium flex-1 justify-center">
          {links.map((link) => {
            const active = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`px-3 py-1.5 rounded-full transition ${active ? "bg-[#6B4423] text-white" : "text-[#6B4423] hover:bg-[#f0e3d5]"}`}
              >
                {link.label}
              </Link>
            );
          })}

          <button onClick={handleLogout} className="ml-4 px-3 py-1.5 rounded-full text-xs font-semibold text-white bg-red-600 hover:bg-red-700 transition">
            Cerrar sesión
          </button>
        </nav>

        <div className="ml-auto flex items-center gap-3">
          <div className="hidden sm:flex flex-col items-end text-xs">
            <div className="font-semibold text-[#6B4423]">{user.name || "Usuario"}</div>
            <div className="text-gray-500">{roleLabel[user.role] ?? user.role}</div>
          </div>

          <div className="w-8 h-8 rounded-full bg-[#6B4423] text-white flex items-center justify-center text-xs font-semibold">{userInitial}</div>

          <button onClick={() => setMenuOpen((o) => !o)} className="ml-1 md:hidden p-2 rounded-full border border-[#f0e3d5] hover:bg-[#f5ebe0]">
            {menuOpen ? <X className="w-4 h-4 text-[#6B4423]" /> : <Menu className="w-4 h-4 text-[#6B4423]" />}
          </button>
        </div>
      </header>

      <div className={`md:hidden bg-white border-b border-[#f0e3d5] shadow-sm overflow-hidden transition-all ${menuOpen ? "max-h-64" : "max-h-0"}`}>
        <nav className="flex flex-col px-4 py-2 text-sm">
          {links.map((link) => {
            const active = pathname === link.href;
            return (
              <button
                key={link.href}
                onClick={() => {
                  router.push(link.href);
                  setMenuOpen(false);
                }}
                className={`text-left px-3 py-2 rounded-lg mb-1 transition ${active ? "bg-[#6B4423] text-white" : "text-[#6B4423] hover:bg-[#f5ebe0]"}`}
              >
                {link.label}
              </button>
            );
          })}

          <button onClick={handleLogout} className="mt-2 px-3 py-2 rounded-lg text-left text-red-600 hover:bg-red-50 font-semibold">CERRAR SESIÓN</button>
        </nav>
      </div>

      <main className="flex-1 flex flex-col lg:flex-row">
        {leftPanel && (
          <>
            <section className="block lg:hidden w-full px-4 pt-4">{leftPanel}</section>
            <aside className="hidden lg:block w-full max-w-sm p-6">{leftPanel}</aside>
          </>
        )}

        <section className="flex-1 p-4 sm:p-6 pt-4 lg:pt-6">{children}</section>
      </main>

      <button onClick={() => setNotesOpen((o) => !o)} className="fixed bottom-6 right-6 w-14 h-14 rounded-full bg-[#6B4423] text-white shadow-xl flex items-center justify-center hover:bg-[#53351c] transition">
        <StickyNote className="w-6 h-6" />
      </button>

      {notesOpen && (
        <div className="fixed bottom-24 right-6 bg-white w-80 max-h-96 overflow-auto shadow-lg rounded-xl border border-[#e0d6c8] p-4 z-40">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-semibold text-[#6B4423] text-sm">Notas del Personal</h3>
            <button onClick={() => setNotesOpen(false)} className="text-xs text-gray-500 hover:text-gray-700 flex items-center gap-1">
              <ChevronDown className="w-4 h-4" />
            </button>
          </div>

          {canCreateNote && (
            <div className="mb-3 space-y-2">
              <textarea
                className="w-full border border-[#e0d6c8] rounded-md text-xs p-2 resize-none focus:outline-none focus:ring-1 focus:ring-[#6B4423]"
                rows={3}
                placeholder="Escribe una nota para todo el personal (visible 24h)..."
                value={newNoteText}
                onChange={(e) => setNewNoteText(e.target.value)}
              />
              <div className="flex justify-end">
                <button type="button" onClick={handleCreateNote} className="inline-flex items-center gap-1 px-3 py-1.5 rounded-md text-xs font-semibold bg-[#6B4423] text-white hover:bg-[#53351c] transition">
                  <Save className="w-3 h-3" /> Guardar nota
                </button>
              </div>
              <hr className="border-[#efe2d2]" />
            </div>
          )}

          {visibleNotes.length === 0 ? (
            <p className="text-xs text-gray-500">No hay notas en las últimas 24 horas.</p>
          ) : (
            <ul className="space-y-2">
              {visibleNotes.map((n) => {
                const isEditing = editingId === n.id;
                return (
                  <li key={n.id} className="bg-[#f9f5ef] border border-[#e7dfd4] rounded-lg p-2 text-xs">
                    <div className="flex justify-between gap-2 mb-1">
                      <span className="font-semibold text-[#6B4423]">{n.createdByName || "Personal"}</span>
                      <span className="text-[10px] text-gray-400">
                        {new Date(n.createdAt).toLocaleString("es-PE", { day: "2-digit", month: "2-digit", hour: "2-digit", minute: "2-digit" })}
                      </span>
                    </div>

                    {isEditing ? (
                      <textarea className="w-full border border-[#e0d6c8] rounded-md text-xs p-1.5 resize-none focus:outline-none focus:ring-1 focus:ring-[#6B4423]" rows={3} value={editingText} onChange={(e) => setEditingText(e.target.value)} />
                    ) : (
                      <p className="text-gray-700 whitespace-pre-wrap">{n.text}</p>
                    )}

                    {(canEditNote || canDeleteNote) && (
                      <div className="flex justify-end gap-2 mt-1">
                        {canEditNote && (
                          isEditing ? (
                            <>
                              <button type="button" onClick={() => handleSaveEdit(n.id)} className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-semibold bg-green-600 text-white hover:bg-green-700"><Save className="w-3 h-3" /> Guardar</button>
                              <button type="button" onClick={handleCancelEdit} className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-semibold bg-gray-300 text-gray-800 hover:bg-gray-400"><XCircle className="w-3 h-3" /> Cancelar</button>
                            </>
                          ) : (
                            <button type="button" onClick={() => startEditNote(n.id, n.text)} className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-semibold bg-[#6B4423] text-white hover:bg-[#53351c]"><Edit3 className="w-3 h-3" /> Editar</button>
                          )
                        )}

                        {canDeleteNote && !isEditing && <button type="button" onClick={() => handleDeleteNote(n.id)} className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-semibold bg-red-600 text-white hover:bg-red-700"><Trash2 className="w-3 h-3" /> Eliminar</button>}
                      </div>
                    )}
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
