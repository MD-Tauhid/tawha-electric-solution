"use client";

import { ErrorState } from "@/components/shared/error-state";

export default function ProjectsError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <ErrorState
      title="Failed to load projects"
      message={error.message || "Could not load project data. Please try again."}
      onRetry={reset}
    />
  );
}
