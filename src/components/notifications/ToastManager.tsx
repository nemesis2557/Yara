// src/components/notifications/ToastManager.tsx
"use client";

import React, { createContext, useContext, type ReactNode } from "react";
import { toast as sonnerToast } from "sonner";

type ToastType = "success" | "error" | "info" | "warning";

interface ToastContextValue {
  toast: (message: string, type?: ToastType) => void;
}

const ToastContext = createContext<ToastContextValue | undefined>(undefined);

export function ToastProvider({ children }: { children: ReactNode }) {
  const toast: ToastContextValue["toast"] = (message, type = "info") => {
    const common = { duration: 4000 };
    switch (type) {
      case "success":
        sonnerToast.success(message, common);
        break;
      case "error":
        sonnerToast.error(message, common);
        break;
      case "warning":
        sonnerToast.warning(message, common);
        break;
      default:
        sonnerToast(message, common);
        break;
    }
  };

  return <ToastContext.Provider value={{ toast }}>{children}</ToastContext.Provider>;
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast debe usarse dentro de <ToastProvider>");
  return ctx;
}
