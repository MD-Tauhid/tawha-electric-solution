import { cn } from "@/lib/utils";

type StatusType =
  | "PLANNED"
  | "ONGOING"
  | "COMPLETED"
  | "CANCELLED"
  | "DRAFT"
  | "ISSUED"
  | "PARTIALLY_PAID"
  | "PAID"
  | "RESIDENTIAL"
  | "COMMERCIAL"
  | "INDUSTRIAL"
  | "RESTAURANT"
  | "OTHER"
  | "CASH"
  | "BANK_TRANSFER"
  | "MOBILE_BANKING"
  | "CHEQUE";

const STATUS_CONFIG: Record<
  string,
  { label: string; className: string }
> = {
  // Project statuses
  PLANNED: {
    label: "Planned",
    className: "bg-slate-100 text-slate-700 border-slate-200",
  },
  ONGOING: {
    label: "Ongoing",
    className: "bg-blue-50 text-blue-700 border-blue-200",
  },
  COMPLETED: {
    label: "Completed",
    className: "bg-emerald-50 text-emerald-700 border-emerald-200",
  },
  CANCELLED: {
    label: "Cancelled",
    className: "bg-red-50 text-red-700 border-red-200",
  },
  // Bill statuses
  DRAFT: {
    label: "Draft",
    className: "bg-slate-100 text-slate-700 border-slate-200",
  },
  ISSUED: {
    label: "Issued",
    className: "bg-blue-50 text-blue-700 border-blue-200",
  },
  PARTIALLY_PAID: {
    label: "Partially Paid",
    className: "bg-amber-50 text-amber-700 border-amber-200",
  },
  PAID: {
    label: "Paid",
    className: "bg-emerald-50 text-emerald-700 border-emerald-200",
  },
  // Customer types
  RESIDENTIAL: {
    label: "Residential",
    className: "bg-blue-50 text-blue-700 border-blue-200",
  },
  COMMERCIAL: {
    label: "Commercial",
    className: "bg-purple-50 text-purple-700 border-purple-200",
  },
  INDUSTRIAL: {
    label: "Industrial",
    className: "bg-amber-50 text-amber-700 border-amber-200",
  },
  RESTAURANT: {
    label: "Restaurant",
    className: "bg-orange-50 text-orange-700 border-orange-200",
  },
  OTHER: {
    label: "Other",
    className: "bg-slate-100 text-slate-700 border-slate-200",
  },
  // Payment methods
  CASH: {
    label: "Cash",
    className: "bg-emerald-50 text-emerald-700 border-emerald-200",
  },
  BANK_TRANSFER: {
    label: "Bank Transfer",
    className: "bg-blue-50 text-blue-700 border-blue-200",
  },
  MOBILE_BANKING: {
    label: "Mobile Banking",
    className: "bg-violet-50 text-violet-700 border-violet-200",
  },
  CHEQUE: {
    label: "Cheque",
    className: "bg-cyan-50 text-cyan-700 border-cyan-200",
  },
};

interface StatusBadgeProps {
  status: StatusType | string;
  className?: string;
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const config = STATUS_CONFIG[status] || {
    label: status.replace(/_/g, " ").toLowerCase().replace(/\b\w/g, (c) => c.toUpperCase()),
    className: "bg-slate-100 text-slate-700 border-slate-200",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium",
        config.className,
        className
      )}
    >
      {config.label}
    </span>
  );
}
