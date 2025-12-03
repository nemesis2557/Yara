"use client";

import * as React from "react";
import { ThemeProvider as NextThemesProvider } from "next-themes";

interface LuwakThemeProviderProps {
  children: React.ReactNode;
  attribute: "class" | "data-theme";
  defaultTheme: string;
  enableSystem?: boolean;
  disableTransitionOnChange?: boolean;
}

export function ThemeProvider({
  children,
  ...props
}: LuwakThemeProviderProps) {
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>;
}
