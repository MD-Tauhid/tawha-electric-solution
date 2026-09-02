"use client";

import { ErrorState } from "@/components/shared/error-state";

export default function CustomersError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <ErrorState
      title="Failed to load customers"
      message={error.message || "Could not load customer data. Please try again."}
      onRetry={reset}
    />
  );
}
