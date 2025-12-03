"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import type { UserRole } from "@/types/luwak";

export const ADMIN_CODE = "1234"; // código para cancelar/editar pedidos, etc.

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
}

interface AuthContextValue {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

// --- Usuarios de prueba ---
const TEST_USERS: { email: string; password: string; user: User }[] = [
  {
    email: "admin@luwak.test",
    password: "admin123",
    user: {
      id: "u-admin",
      name: "Admin Luwak",
      email: "admin@luwak.test",
      role: "admin",
    },
  },
  {
    email: "mesero@luwak.test",
    password: "mesero123",
    user: {
      id: "u-mesero",
      name: "Mesero Juan",
      email: "mesero@luwak.test",
      role: "mesero",
    },
  },
  {
    email: "caja@luwak.test",
    password: "caja123",
    user: {
      id: "u-cajero",
      name: "Cajero Luis",
      email: "caja@luwak.test",
      role: "cajero", // IMPORTANTE: coincide con UserRole = "cajero"
    },
  },
  {
    email: "chef@luwak.test",
    password: "chef123",
    user: {
      id: "u-chef",
      name: "Chef María",
      email: "chef@luwak.test",
      role: "chef",
    },
  },
  {
    email: "ayudante@luwak.test",
    password: "ayudante123",
    user: {
      id: "u-ayudante",
      name: "Ayudante Pedro",
      email: "ayudante@luwak.test",
      role: "ayudante",
    },
  },
];

const STORAGE_KEY = "luwak_auth_user";

function loadUserFromStorage(): User | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as User;
  } catch {
    return null;
  }
}

function saveUserToStorage(user: User | null) {
  if (typeof window === "undefined") return;
  try {
    if (user) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
    } else {
      localStorage.removeItem(STORAGE_KEY);
    }
  } catch {
    // ignore
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Cargar usuario guardado
  useEffect(() => {
    const stored = loadUserFromStorage();
    if (stored) {
      setUser(stored);
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    // aquí en el futuro se reemplaza por llamada a backend / Supabase
    const match = TEST_USERS.find(
      (u) =>
        u.email.toLowerCase() === email.toLowerCase() &&
        u.password === password,
    );

    if (!match) {
      throw { errorMessage: "Credenciales inválidas" };
    }

    setUser(match.user);
    saveUserToStorage(match.user);
  };

  const logout = () => {
    setUser(null);
    saveUserToStorage(null);
  };

  const value: AuthContextValue = {
    user,
    isLoading,
    login,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return ctx;
}
