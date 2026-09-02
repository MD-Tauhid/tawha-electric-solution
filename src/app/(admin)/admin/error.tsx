"use client";

import { ErrorState } from "@/components/shared/error-state";

export default function DashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <ErrorState
      title="Failed to load dashboard"
      message={error.message || "Could not load dashboard data. Please try again."}
      onRetry={reset}
    />
  );
}
