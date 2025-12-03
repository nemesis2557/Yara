// src/components/notes/NotesProvider.tsx
"use client";

import React, {
  createContext,
  useContext,
  useState,
  type ReactNode,
} from "react";

export interface Note {
  id: string;
  text: string;
  createdAt: string;
  createdById?: string;
  createdByName?: string;
}

interface NotesContextValue {
  notes: Note[];
  addNote: (note: Omit<Note, "id" | "createdAt">) => void;
  updateNote: (id: string, text: string) => void;
  deleteNote: (id: string) => void;
  clearNotes: () => void;
}

const NotesContext = createContext<NotesContextValue | undefined>(undefined);

export function NotesProvider({ children }: { children: ReactNode }) {
  const [notes, setNotes] = useState<Note[]>([]);

  const addNote: NotesContextValue["addNote"] = (noteInput) => {
    setNotes((prev) => [
      {
        id:
          typeof crypto !== "undefined" && "randomUUID" in crypto
            ? crypto.randomUUID()
            : String(Date.now()),
        createdAt: new Date().toISOString(),
        ...noteInput,
      },
      ...prev,
    ]);
  };

  const updateNote: NotesContextValue["updateNote"] = (id, text) => {
    setNotes((prev) =>
      prev.map((n) => (n.id === id ? { ...n, text } : n))
    );
  };

  const deleteNote: NotesContextValue["deleteNote"] = (id) => {
    setNotes((prev) => prev.filter((n) => n.id !== id));
  };

  const clearNotes = () => setNotes([]);

  return (
    <NotesContext.Provider
      value={{ notes, addNote, updateNote, deleteNote, clearNotes }}
    >
      {children}
    </NotesContext.Provider>
  );
}

export function useNotes() {
  const ctx = useContext(NotesContext);
  if (!ctx) {
    throw new Error("useNotes debe usarse dentro de <NotesProvider>");
  }
  return ctx;
}
