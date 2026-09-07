import {
  DollarSign,
  TrendingUp,
  TrendingDown,
  AlertCircle,
  Users,
  FolderKanban,
} from "lucide-react";
import type { DashboardStats } from "@/lib/dashboard";
import { StatsCard } from "../stats-card";

interface DashboardStatsOverviewProps {
  stats: DashboardStats;
}

function formatCurrency(value: number): string {
  return `৳ ${value.toLocaleString(undefined, {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  })}`;
}

interface FinancialCardProps {
  title: string;
  value: string;
  description: string;
  icon: React.ReactNode;
  iconColor?: string;
}

function FinancialCard({
  title,
  value,
  description,
  icon,
  iconColor = "text-muted-foreground",
}: FinancialCardProps) {
  return (
    <div className="admin-panel rounded-2xl border p-4">
      <div className="flex items-start justify-between">
        <div className="min-w-0">
          <p className="text-sm font-medium text-muted-foreground truncate">
            {title}
          </p>
          <p className="text-2xl font-bold tracking-tight text-card-foreground">
            {value}
          </p>
        </div>
        <div
          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-muted ${iconColor}`}
        >
          {icon}
        </div>
      </div>
      <p className="text-xs text-muted-foreground">{description}</p>
    </div>
  );
}

export function DashboardStatsOverview({ stats }: DashboardStatsOverviewProps) {
  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-6">
      <StatsCard
        title="Total Customers"
        value={stats.totalCustomers}
        description="Registered customers"
        icon={<Users className="h-5 w-5" />}
      />
      <StatsCard
        title="Total Projects"
        value={stats.totalProjects}
        description={`${stats.ongoingProjects} ongoing, ${stats.completedProjects} completed`}
        icon={<FolderKanban className="h-5 w-5" />}
      />
      <FinancialCard
        title="Total Project Value"
        value={formatCurrency(stats.totalProjectValue)}
        description="Across all projects"
        icon={<DollarSign className="h-5 w-5" />}
      />
      <FinancialCard
        title="Total Billed"
        value={formatCurrency(stats.totalBilled)}
        description="Payable amounts"
        icon={<TrendingUp className="h-5 w-5" />}
      />
      <FinancialCard
        title="Total Collected"
        value={formatCurrency(stats.totalCollected)}
        description="Payments received"
        icon={<TrendingUp className="h-5 w-5" />}
        iconColor="text-emerald-600"
      />
      <FinancialCard
        title="Outstanding"
        value={formatCurrency(stats.totalOutstanding)}
        description="Pending collection"
        icon={
          stats.totalOutstanding > 0 ? (
            <AlertCircle className="h-5 w-5" />
          ) : (
            <TrendingDown className="h-5 w-5" />
          )
        }
        iconColor={
          stats.totalOutstanding > 0 ? "text-destructive" : "text-emerald-600"
        }
      />
    </div>
  );
}
