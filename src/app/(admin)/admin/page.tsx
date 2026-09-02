import { DashboardShell } from "@/components/admin/dashboard-shell";
import { StatsCard } from "@/components/admin/stats-card";
import {
  Users,
  FolderKanban,
  Receipt,
  CreditCard,
} from "lucide-react";

export default function AdminDashboard() {
  return (
    <DashboardShell
      title="Dashboard"
      description="Welcome to the Tawha Electrical admin panel."
    >
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Total Customers"
          value="—"
          description="Customer data coming soon"
          icon={<Users className="h-5 w-5" />}
        />
        <StatsCard
          title="Active Projects"
          value="—"
          description="Project tracking coming soon"
          icon={<FolderKanban className="h-5 w-5" />}
        />
        <StatsCard
          title="Pending Bills"
          value="—"
          description="Billing system coming soon"
          icon={<Receipt className="h-5 w-5" />}
        />
        <StatsCard
          title="Payments"
          value="—"
          description="Payment tracking coming soon"
          icon={<CreditCard className="h-5 w-5" />}
        />
      </div>

      <div className="mt-8 rounded-lg border bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold">Getting Started</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          The admin dashboard will display real-time analytics and business
          metrics once the following features are implemented:
        </p>
        <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
          <li className="flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-primary" />
            Customer management
          </li>
          <li className="flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-primary" />
            Service catalog
          </li>
          <li className="flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-primary" />
            Project tracking
          </li>
          <li className="flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-primary" />
            Billing and invoicing
          </li>
          <li className="flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-primary" />
            Payment processing
          </li>
        </ul>
      </div>
    </DashboardShell>
  );
}
