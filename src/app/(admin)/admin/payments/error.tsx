"use client";

import { AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DashboardShell } from "@/components/admin/dashboard-shell";

export default function PaymentsError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <DashboardShell title="Payments" description="Error loading payments">
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-destructive/10">
          <AlertTriangle className="h-6 w-6 text-destructive" />
        </div>
        <h3 className="mt-4 text-lg font-semibold">Something went wrong</h3>
        <p className="mt-2 max-w-sm text-sm text-muted-foreground">
          {error.message || "Failed to load payments. Please try again."}
        </p>
        <Button onClick={reset} variant="outline" className="mt-4">
          Try Again
        </Button>
      </div>
    </DashboardShell>
  );
}
