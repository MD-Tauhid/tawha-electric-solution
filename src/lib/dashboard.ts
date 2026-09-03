import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth-utils";

export interface DashboardStats {
  totalCustomers: number;
  totalProjects: number;
  ongoingProjects: number;
  completedProjects: number;
  totalProjectValue: number;
  totalBilled: number;
  totalCollected: number;
  totalOutstanding: number;
}

export interface MonthlyRevenue {
  month: string;
  revenue: number;
  label: string;
}

export interface ProjectsByStatus {
  status: string;
  count: number;
  label: string;
}

export interface PaymentOverview {
  category: string;
  amount: number;
  label: string;
}

export interface RecentActivity {
  id: string;
  action: string;
  entity: string;
  entityId: string | null;
  details: Record<string, unknown> | null;
  createdAt: Date;
}

/**
 * Get dashboard summary statistics.
 * All financial calculations are done server-side.
 */
export async function getDashboardStats(): Promise<DashboardStats> {
  await requireAdmin();

  const [
    totalCustomers,
    totalProjects,
    ongoingProjects,
    completedProjects,
    projectValueAgg,
    billAgg,
    paymentAgg,
  ] = await Promise.all([
    prisma.customer.count(),
    prisma.project.count(),
    prisma.project.count({ where: { status: "ONGOING" } }),
    prisma.project.count({ where: { status: "COMPLETED" } }),
    prisma.project.aggregate({
      _sum: { totalValue: true },
    }),
    prisma.bill.aggregate({
      _sum: { payableAmount: true },
      where: { status: { not: "CANCELLED" } },
    }),
    prisma.payment.aggregate({
      _sum: { amount: true },
    }),
  ]);

  const totalProjectValue = Number(projectValueAgg._sum.totalValue ?? 0);
  const totalBilled = Number(billAgg._sum.payableAmount ?? 0);
  const totalCollected = Number(paymentAgg._sum.amount ?? 0);
  const totalOutstanding = totalBilled - totalCollected;

  return {
    totalCustomers,
    totalProjects,
    ongoingProjects,
    completedProjects,
    totalProjectValue,
    totalBilled,
    totalCollected,
    totalOutstanding,
  };
}

/**
 * Get monthly revenue data for the last 12 months.
 * Groups payments by month for chart display.
 */
export async function getMonthlyRevenue(): Promise<MonthlyRevenue[]> {
  await requireAdmin();

  const now = new Date();
  const twelveMonthsAgo = new Date(now);
  twelveMonthsAgo.setMonth(twelveMonthsAgo.getMonth() - 11);
  twelveMonthsAgo.setDate(1);
  twelveMonthsAgo.setHours(0, 0, 0, 0);

  const payments = await prisma.payment.findMany({
    where: {
      paymentDate: {
        gte: twelveMonthsAgo,
      },
    },
    select: {
      amount: true,
      paymentDate: true,
    },
    orderBy: { paymentDate: "asc" },
  });

  // Build monthly buckets
  const months: MonthlyRevenue[] = [];
  for (let i = 11; i >= 0; i--) {
    const d = new Date(now);
    d.setMonth(d.getMonth() - i);
    const year = d.getFullYear();
    const month = d.getMonth();
    const monthKey = `${year}-${String(month + 1).padStart(2, "0")}`;
    const label = d.toLocaleDateString("en-US", {
      month: "short",
      year: "2-digit",
    });
    months.push({ month: monthKey, revenue: 0, label });
  }

  for (const payment of payments) {
    const d = new Date(payment.paymentDate);
    const monthKey = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
    const bucket = months.find((m) => m.month === monthKey);
    if (bucket) {
      bucket.revenue += Number(payment.amount);
    }
  }

  return months;
}

/**
 * Get project counts grouped by status.
 */
export async function getProjectsByStatus(): Promise<ProjectsByStatus[]> {
  await requireAdmin();

  const statusLabels: Record<string, string> = {
    PLANNED: "Planned",
    ONGOING: "Ongoing",
    COMPLETED: "Completed",
    CANCELLED: "Cancelled",
  };

  const results = await prisma.project.groupBy({
    by: ["status"],
    _count: { id: true },
  });

  const allStatuses = ["PLANNED", "ONGOING", "COMPLETED", "CANCELLED"];

  return allStatuses.map((status) => {
    const found = results.find((r) => r.status === status);
    return {
      status,
      count: found ? found._count.id : 0,
      label: statusLabels[status] || status,
    };
  });
}

/**
 * Get payment overview: total payable, total collected, outstanding.
 * Used for a pie/bar chart showing paid vs outstanding.
 */
export async function getPaymentOverview(): Promise<PaymentOverview[]> {
  await requireAdmin();

  const billAgg = await prisma.bill.aggregate({
    _sum: { payableAmount: true },
    where: { status: { not: "CANCELLED" } },
  });

  const paymentAgg = await prisma.payment.aggregate({
    _sum: { amount: true },
  });

  const totalBilled = Number(billAgg._sum.payableAmount ?? 0);
  const totalCollected = Number(paymentAgg._sum.amount ?? 0);
  const outstanding = Math.max(0, totalBilled - totalCollected);

  return [
    {
      category: "collected",
      amount: totalCollected,
      label: "Collected",
    },
    {
      category: "outstanding",
      amount: outstanding,
      label: "Outstanding",
    },
  ];
}

/**
 * Get recent activity from the activity log.
 * Falls back to recent entity creation if activity log is empty.
 */
export async function getRecentActivity(
  limit = 10
): Promise<RecentActivity[]> {
  await requireAdmin();

  // Check if activity log has entries
  const activityCount = await prisma.activityLog.count();

  if (activityCount > 0) {
    const logs = await prisma.activityLog.findMany({
      orderBy: { createdAt: "desc" },
      take: limit,
    });

    return logs.map((log) => ({
      id: log.id,
      action: log.action,
      entity: log.entity,
      entityId: log.entityId,
      details: log.details as Record<string, unknown> | null,
      createdAt: log.createdAt,
    }));
  }

  // Fallback: derive recent activity from entity creation
  const recentItems: RecentActivity[] = [];

  const [recentProjects, recentBills, recentPayments, recentCustomers] =
    await Promise.all([
      prisma.project.findMany({
        orderBy: { createdAt: "desc" },
        take: 3,
        select: {
          id: true,
          name: true,
          projectNumber: true,
          createdAt: true,
        },
      }),
      prisma.bill.findMany({
        orderBy: { createdAt: "desc" },
        take: 3,
        select: {
          id: true,
          billNumber: true,
          createdAt: true,
        },
      }),
      prisma.payment.findMany({
        orderBy: { createdAt: "desc" },
        take: 3,
        select: {
          id: true,
          amount: true,
          method: true,
          createdAt: true,
        },
      }),
      prisma.customer.findMany({
        orderBy: { createdAt: "desc" },
        take: 2,
        select: {
          id: true,
          name: true,
          createdAt: true,
        },
      }),
    ]);

  for (const project of recentProjects) {
    recentItems.push({
      id: `project-${project.id}`,
      action: "CREATED",
      entity: "PROJECT",
      entityId: project.id,
      details: { name: project.name, projectNumber: project.projectNumber },
      createdAt: project.createdAt,
    });
  }

  for (const bill of recentBills) {
    recentItems.push({
      id: `bill-${bill.id}`,
      action: "CREATED",
      entity: "BILL",
      entityId: bill.id,
      details: { billNumber: bill.billNumber },
      createdAt: bill.createdAt,
    });
  }

  for (const payment of recentPayments) {
    recentItems.push({
      id: `payment-${payment.id}`,
      action: "RECEIVED",
      entity: "PAYMENT",
      entityId: payment.id,
      details: {
        amount: Number(payment.amount),
        method: payment.method,
      },
      createdAt: payment.createdAt,
    });
  }

  for (const customer of recentCustomers) {
    recentItems.push({
      id: `customer-${customer.id}`,
      action: "CREATED",
      entity: "CUSTOMER",
      entityId: customer.id,
      details: { name: customer.name },
      createdAt: customer.createdAt,
    });
  }

  // Sort by date descending and limit
  recentItems.sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  return recentItems.slice(0, limit);
}
