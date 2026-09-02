import * as React from "react";
import { cn } from "@/lib/utils";

interface DashboardShellProps extends React.HTMLAttributes<HTMLDivElement> {
  title?: string;
  description?: string;
  actions?: React.ReactNode;
}

export function DashboardShell({
  title,
  description,
  actions,
  children,
  className,
  ...props
}: DashboardShellProps) {
  return (
    <div className={cn("flex-1 space-y-4 p-4 sm:p-6", className)} {...props}>
      {(title || actions) && (
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            {title && (
              <h1 className="text-2xl font-bold tracking-tight">{title}</h1>
            )}
            {description && (
              <p className="text-sm text-muted-foreground">{description}</p>
            )}
          </div>
          {actions && <div className="flex items-center gap-2">{actions}</div>}
        </div>
      )}
      {children}
    </div>
  );
}
