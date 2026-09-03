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
  PROJECT: "bg-blue-100 text-blue-700",
  BILL: "bg-amber-100 text-amber-700",
  PAYMENT: "bg-green-100 text-green-700",
  CUSTOMER: "bg-purple-100 text-purple-700",
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
    <div className="rounded-lg border bg-white p-6 shadow-sm">
      <h2 className="text-lg font-semibold mb-4">Recent Activity</h2>
      {activities.length === 0 ? (
        <p className="text-sm text-muted-foreground py-8 text-center">
          No recent activity.
        </p>
      ) : (
        <div className="space-y-4">
          {activities.map((activity) => {
            const Icon = ENTITY_ICONS[activity.entity] || FolderKanban;
            const colorClass =
              ENTITY_COLORS[activity.entity] || "bg-gray-100 text-gray-700";
            const linkFn = ENTITY_LINKS[activity.entity];
            const description = getActivityDescription(activity);

            const content = (
              <div className="flex items-start gap-3">
                <div
                  className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${colorClass}`}
                >
                  <Icon className="h-4 w-4" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm">{description}</p>
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
                  className="block hover:bg-muted/50 rounded-lg p-2 -mx-2 transition-colors"
                >
                  {content}
                </Link>
              );
            }

            return (
              <div key={activity.id} className="p-2 -mx-2">
                {content}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
