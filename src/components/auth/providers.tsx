"use client";

import { SessionProvider } from "next-auth/react";
import { ToastProvider } from "@/components/shared/toast-provider";

export function AuthProviders({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      {children}
      <ToastProvider />
    </SessionProvider>
  );
}
