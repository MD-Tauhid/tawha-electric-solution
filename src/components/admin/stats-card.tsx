import * as React from "react";
import { cn } from "@/lib/utils";

interface StatsCardProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string;
  value: string | number;
  description?: string;
  icon?: React.ReactNode;
}

export function StatsCard({
  title,
  value,
  description,
  icon,
  className,
  ...props
}: StatsCardProps) {
  return (
    <div
      className={cn(
        "rounded-lg border bg-white p-6 shadow-sm",
        className
      )}
      {...props}
    >
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <p className="text-2xl font-bold">{value}</p>
          {description && (
            <p className="text-xs text-muted-foreground">{description}</p>
          )}
        </div>
        {icon && (
          <div className="text-muted-foreground">{icon}</div>
        )}
      </div>
    </div>
  );
}
