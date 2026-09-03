import {
  DollarSign,
  TrendingUp,
  TrendingDown,
  AlertCircle,
} from "lucide-react";
import type { DashboardStats } from "@/lib/dashboard";

interface DashboardStatsOverviewProps {
  stats: DashboardStats;
}

function formatCurrency(value: number): string {
  return `$${value.toLocaleString(undefined, {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  })}`;
}

export function DashboardStatsOverview({ stats }: DashboardStatsOverviewProps) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <div className="rounded-lg border bg-white p-6 shadow-sm">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-sm font-medium text-muted-foreground">
              Total Project Value
            </p>
            <p className="text-2xl font-bold">
              {formatCurrency(stats.totalProjectValue)}
            </p>
            <p className="text-xs text-muted-foreground">
              Across all projects
            </p>
          </div>
          <div className="text-muted-foreground">
            <DollarSign className="h-5 w-5" />
          </div>
        </div>
      </div>

      <div className="rounded-lg border bg-white p-6 shadow-sm">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-sm font-medium text-muted-foreground">
              Total Billed
            </p>
            <p className="text-2xl font-bold">
              {formatCurrency(stats.totalBilled)}
            </p>
            <p className="text-xs text-muted-foreground">
              Payable amounts
            </p>
          </div>
          <div className="text-muted-foreground">
            <TrendingUp className="h-5 w-5" />
          </div>
        </div>
      </div>

      <div className="rounded-lg border bg-white p-6 shadow-sm">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-sm font-medium text-muted-foreground">
              Total Collected
            </p>
            <p className="text-2xl font-bold text-green-600">
              {formatCurrency(stats.totalCollected)}
            </p>
            <p className="text-xs text-muted-foreground">
              Payments received
            </p>
          </div>
          <div className="text-green-600">
            <TrendingUp className="h-5 w-5" />
          </div>
        </div>
      </div>

      <div className="rounded-lg border bg-white p-6 shadow-sm">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-sm font-medium text-muted-foreground">
              Outstanding
            </p>
            <p
              className={`text-2xl font-bold ${
                stats.totalOutstanding > 0
                  ? "text-destructive"
                  : "text-green-600"
              }`}
            >
              {formatCurrency(stats.totalOutstanding)}
            </p>
            <p className="text-xs text-muted-foreground">
              Pending collection
            </p>
          </div>
          <div
            className={
              stats.totalOutstanding > 0
                ? "text-destructive"
                : "text-green-600"
            }
          >
            {stats.totalOutstanding > 0 ? (
              <AlertCircle className="h-5 w-5" />
            ) : (
              <TrendingDown className="h-5 w-5" />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
