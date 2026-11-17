// app/providers/ClientProviders.tsx
"use client";

import { ReactNode } from "react";
import { ToastProvider } from "@/ context/ToastContext";
import { AuthProvider } from "@/shared/hooks/auth/useAuth";


export function ClientProviders({ children }: { children: ReactNode }) {
  return (
    <AuthProvider>
      <ToastProvider>
        {children}
      </ToastProvider>
    </AuthProvider>
  );
}