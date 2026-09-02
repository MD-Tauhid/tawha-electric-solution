import * as React from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";

type BreadcrumbProps = React.HTMLAttributes<HTMLElement>;

function Breadcrumb({ ...props }: BreadcrumbProps) {
  return <nav aria-label="Breadcrumb" {...props} />;
}

type BreadcrumbListProps = React.HTMLAttributes<HTMLOListElement>;

function BreadcrumbList({ className, ...props }: BreadcrumbListProps) {
  return (
    <ol
      className={cn(
        "flex flex-wrap items-center gap-1.5 break-words text-sm text-muted-foreground sm:gap-2.5",
        className
      )}
      {...props}
    />
  );
}

type BreadcrumbItemProps = React.HTMLAttributes<HTMLLIElement>;

function BreadcrumbItem({ className, ...props }: BreadcrumbItemProps) {
  return (
    <li
      className={cn("inline-flex items-center gap-1.5", className)}
      {...props}
    />
  );
}

interface BreadcrumbLinkProps extends React.ComponentProps<typeof Link> {
  asChild?: boolean;
}

function BreadcrumbLink({ className, ...props }: BreadcrumbLinkProps) {
  return (
    <Link
      className={cn(
        "transition-colors hover:text-foreground",
        className
      )}
      {...props}
    />
  );
}

type BreadcrumbPageProps = React.HTMLAttributes<HTMLSpanElement>;

function BreadcrumbPage({ className, ...props }: BreadcrumbPageProps) {
  return (
    <span
      role="link"
      aria-disabled="true"
      aria-current="page"
      className={cn("font-normal text-foreground", className)}
      {...props}
    />
  );
}

function BreadcrumbSeparator({
  children,
  className,
  ...props
}: React.HTMLAttributes<HTMLSpanElement>) {
  return (
    <span
      role="presentation"
      aria-hidden="true"
      className={cn(" [&>svg]:h-3.5 [&>svg]:w-3.5", className)}
      {...props}
    >
      {children ?? (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="m9 18 6-6-6-6" />
        </svg>
      )}
    </span>
  );
}

export {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
};
