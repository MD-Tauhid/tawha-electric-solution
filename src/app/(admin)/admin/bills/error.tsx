"use client";

import { ErrorState } from "@/components/shared/error-state";

export default function BillsError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <ErrorState
      title="Failed to load bills"
      message={error.message || "Could not load bill data. Please try again."}
      onRetry={reset}
    />
  );
}
