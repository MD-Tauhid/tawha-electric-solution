"use client";

import { SessionProvider } from "next-auth/react";
import { ToastProvider } from "@/components/shared/toast-provider";
import { ThemeProvider } from "@/components/theme/theme-provider";

export function AuthProviders({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      <SessionProvider>
        {children}
        <ToastProvider />
      </SessionProvider>
    </ThemeProvider>
  );
}
