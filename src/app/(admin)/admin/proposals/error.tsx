"use client";

import { ErrorState } from "@/components/shared/error-state";

export default function ProposalsError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <ErrorState
      title="Failed to load proposals"
      message={error.message || "Could not load proposal data. Please try again."}
      onRetry={reset}
    />
  );
}
