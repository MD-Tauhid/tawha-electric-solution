import { LoadingSpinner } from "@/components/shared/loading-spinner";

interface PageLoadingProps {
  message?: string;
}

export function PageLoading({ message = "Loading..." }: PageLoadingProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16">
      <LoadingSpinner size="lg" />
      <p className="mt-4 text-sm text-muted-foreground">{message}</p>
    </div>
  );
}
