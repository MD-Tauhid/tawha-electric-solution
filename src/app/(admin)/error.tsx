"use client";

import { ErrorState } from "@/components/shared/error-state";

export default function AdminError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <ErrorState
        title="Admin Error"
        message={error.message || "An unexpected error occurred in the admin panel."}
        onRetry={reset}
      />
    </div>
  );
}
