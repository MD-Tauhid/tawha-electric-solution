"use client";

import { ErrorState } from "@/components/shared/error-state";

export default function ServicesError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <ErrorState
      title="Failed to load services"
      message={error.message || "Could not load service data. Please try again."}
      onRetry={reset}
    />
  );
}
