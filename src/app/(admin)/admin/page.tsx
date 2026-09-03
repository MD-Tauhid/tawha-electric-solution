import { Users, FolderKanban } from "lucide-react";
import { DashboardShell } from "@/components/admin/dashboard-shell";
import { StatsCard } from "@/components/admin/stats-card";
import { DashboardStatsOverview } from "@/components/admin/dashboard/dashboard-stats-overview";
import { MonthlyRevenueChart } from "@/components/admin/dashboard/monthly-revenue-chart";
import { ProjectsByStatusChart } from "@/components/admin/dashboard/projects-by-status-chart";
import { PaymentOverviewChart } from "@/components/admin/dashboard/payment-overview-chart";
import { RecentActivitySection } from "@/components/admin/dashboard/recent-activity";
import {
  getDashboardStats,
  getMonthlyRevenue,
  getProjectsByStatus,
  getPaymentOverview,
  getRecentActivity,
} from "@/lib/dashboard";

export default async function AdminDashboard() {
  const [
    stats,
    monthlyRevenue,
    projectsByStatus,
    paymentOverview,
    recentActivity,
  ] = await Promise.all([
    getDashboardStats(),
    getMonthlyRevenue(),
    getProjectsByStatus(),
    getPaymentOverview(),
    getRecentActivity(),
  ]);

  return (
    <DashboardShell
      title="Dashboard"
      description="Welcome to the Tawha Electrical admin panel."
    >
      {/* Top-level count stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
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
        <StatsCard
          title="Ongoing Projects"
          value={stats.ongoingProjects}
          description="Currently in progress"
          icon={<FolderKanban className="h-5 w-5 text-amber-500" />}
        />
        <StatsCard
          title="Completed Projects"
          value={stats.completedProjects}
          description="Successfully finished"
          icon={<FolderKanban className="h-5 w-5 text-green-500" />}
        />
      </div>

      {/* Financial overview */}
      <DashboardStatsOverview stats={stats} />

      {/* Charts row */}
      <div className="grid gap-4 lg:grid-cols-2">
        <MonthlyRevenueChart data={monthlyRevenue} />
        <ProjectsByStatusChart data={projectsByStatus} />
      </div>

      {/* Payment overview and recent activity */}
      <div className="grid gap-4 lg:grid-cols-2">
        <PaymentOverviewChart data={paymentOverview} />
        <RecentActivitySection activities={recentActivity} />
      </div>
    </DashboardShell>
  );
}
