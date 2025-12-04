import type { Metadata } from "next";
import { ThemeProvider } from "@/components/ThemeProvider";
import { Toaster } from "@/components/ui/sonner";
import GlobalClientEffects from "@/components/GlobalClientEffects";
import { AuthProvider } from "@/components/auth/AuthProvider";
import { OrdersProvider } from "@/components/orders/OrdersProvider";
import { ToastProvider } from "@/components/notifications/ToastManager";
import { NotesProvider } from "@/components/notes/NotesProvider";
import "./globals.css";

export const metadata: Metadata = {
  title: "LUWAK Manager - Sistema POS",
  description: "Sistema de gestión para cafetería LUWAK",
  icons: {
    icon: "/img-header/LogoLuwak.WEBP", // ← FAVICON AÑADIDO
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body className="font-sans antialiased">
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem={false}
          disableTransitionOnChange
        >
          <NotesProvider>
            <AuthProvider>
              <OrdersProvider>
                <ToastProvider>{children}</ToastProvider>
              </OrdersProvider>
            </AuthProvider>

            <GlobalClientEffects />

            <Toaster
              position="top-center"
              richColors
              closeButton
              duration={4000}
            />
          </NotesProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
