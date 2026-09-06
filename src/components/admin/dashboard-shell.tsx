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
    <div className={cn("flex-1 space-y-2 sm:space-y-3 lg:space-y-5 p-2 sm:p-3 lg:p-5", className)} {...props}>
      {/* {(title || actions) && (
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            {title && (
              <h1 className="text-2xl font-bold tracking-tight text-card-foreground">
                {title}
              </h1>
            )}
            {description && (
              <p className="mt-1 text-sm text-muted-foreground">{description}</p>
            )}
          </div>
          {actions && <div className="flex items-center gap-2">{actions}</div>}
        </div>
      )} */}
      {children}
    </div>
  );
}
