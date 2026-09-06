"use client";

import { ErrorState } from "@/components/shared/error-state";

export default function SettingsError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <ErrorState
      title="Failed to load company settings"
      message={error.message || "Could not load company settings. Please try again."}
      onRetry={reset}
    />
  );
}