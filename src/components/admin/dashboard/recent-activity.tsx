import Link from "next/link";
import {
  FolderKanban,
  Receipt,
  CreditCard,
  UserPlus,
} from "lucide-react";
import type { RecentActivity } from "@/lib/dashboard";

interface RecentActivityProps {
  activities: RecentActivity[];
}

const ENTITY_ICONS: Record<string, typeof FolderKanban> = {
  PROJECT: FolderKanban,
  BILL: Receipt,
  PAYMENT: CreditCard,
  CUSTOMER: UserPlus,
};

const ENTITY_COLORS: Record<string, string> = {
  PROJECT: "bg-blue-50 text-blue-600",
  BILL: "bg-amber-50 text-amber-600",
  PAYMENT: "bg-emerald-50 text-emerald-600",
  CUSTOMER: "bg-violet-50 text-violet-600",
};

const ENTITY_LINKS: Record<string, (entityId: string) => string> = {
  PROJECT: (id) => `/admin/projects/${id}`,
  BILL: (id) => `/admin/bills/${id}`,
  PAYMENT: (id) => `/admin/payments/${id}`,
  CUSTOMER: (id) => `/admin/customers/${id}`,
};

function formatAction(action: string): string {
  switch (action) {
    case "CREATED":
      return "Created";
    case "UPDATED":
      return "Updated";
    case "DELETED":
      return "Deleted";
    case "RECEIVED":
      return "Payment received";
    default:
      return action.charAt(0) + action.slice(1).toLowerCase();
  }
}

function formatEntityName(entity: string): string {
  switch (entity) {
    case "PROJECT":
      return "Project";
    case "BILL":
      return "Bill";
    case "PAYMENT":
      return "Payment";
    case "CUSTOMER":
      return "Customer";
    default:
      return entity.charAt(0) + entity.slice(1).toLowerCase();
  }
}

function formatTimeAgo(date: Date): string {
  const now = new Date();
  const diffMs = now.getTime() - new Date(date).getTime();
  const diffSeconds = Math.floor(diffMs / 1000);
  const diffMinutes = Math.floor(diffSeconds / 60);
  const diffHours = Math.floor(diffMinutes / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffDays > 30) {
    return new Date(date).toLocaleDateString();
  }
  if (diffDays > 0) {
    return `${diffDays}d ago`;
  }
  if (diffHours > 0) {
    return `${diffHours}h ago`;
  }
  if (diffMinutes > 0) {
    return `${diffMinutes}m ago`;
  }
  return "Just now";
}

function getActivityDescription(activity: RecentActivity): string {
  const entityName = formatEntityName(activity.entity);
  const action = formatAction(activity.action);

  if (activity.details) {
    const details = activity.details;

    if (activity.entity === "PROJECT" && "name" in details) {
      return `${action} project "${details.name}"`;
    }
    if (activity.entity === "BILL" && "billNumber" in details) {
      return `${action} bill ${details.billNumber}`;
    }
    if (activity.entity === "PAYMENT" && "amount" in details) {
      const amount = Number(details.amount);
      return `Payment of $${amount.toLocaleString()} received`;
    }
    if (activity.entity === "CUSTOMER" && "name" in details) {
      return `${action} customer "${details.name}"`;
    }
  }

  return `${action} ${entityName.toLowerCase()}`;
}

export function RecentActivitySection({ activities }: RecentActivityProps) {
  return (
    <div className="rounded-xl border border-border/60 bg-card p-6">
      <h2 className="text-base font-semibold text-card-foreground mb-4">Recent Activity</h2>
      {activities.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <p className="text-sm text-muted-foreground">
            No recent activity.
          </p>
        </div>
      ) : (
        <div className="space-y-1">
          {activities.map((activity) => {
            const Icon = ENTITY_ICONS[activity.entity] || FolderKanban;
            const colorClass =
              ENTITY_COLORS[activity.entity] || "bg-slate-50 text-slate-600";
            const linkFn = ENTITY_LINKS[activity.entity];
            const description = getActivityDescription(activity);

            const content = (
              <div className="flex items-start gap-3 px-2 py-2.5 rounded-lg">
                <div
                  className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${colorClass}`}
                >
                  <Icon className="h-4 w-4" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm text-card-foreground">{description}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {formatTimeAgo(activity.createdAt)}
                  </p>
                </div>
              </div>
            );

            if (linkFn && activity.entityId) {
              return (
                <Link
                  key={activity.id}
                  href={linkFn(activity.entityId)}
                  className="block hover:bg-accent/50 transition-colors"
                >
                  {content}
                </Link>
              );
            }

            return (
              <div key={activity.id}>
                {content}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
