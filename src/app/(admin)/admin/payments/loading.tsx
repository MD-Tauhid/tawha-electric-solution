import { DashboardShell } from "@/components/admin/dashboard-shell";
import { Skeleton } from "@/components/ui/skeleton";

export default function PaymentsLoading() {
  return (
    <DashboardShell title="Payments" description="Loading payments...">
      <Skeleton className="h-10 w-full" />
      <div className="rounded-lg border bg-white">
        <div className="p-4 space-y-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-12 w-full" />
          ))}
        </div>
      </div>
    </DashboardShell>
  );
}
