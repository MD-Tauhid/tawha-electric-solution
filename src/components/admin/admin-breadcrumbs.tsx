"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

/**
 * Map of path segments to human-readable labels.
 * Segments not in this map are converted from slug to title case.
 */
const segmentLabels: Record<string, string> = {
  admin: "Admin",
  customers: "Customers",
  services: "Services",
  projects: "Projects",
  proposals: "Proposals",
  bills: "Bills",
  payments: "Payments",
  settings: "Settings",
  new: "New",
  edit: "Edit",
};

export function AdminBreadcrumbs() {
  const pathname = usePathname();

  // Skip breadcrumbs for the admin root and login
  if (pathname === "/admin" || pathname === "/admin/login") {
    return null;
  }

  // Split pathname and filter out empty segments
  const segments = pathname.split("/").filter(Boolean);

  // Build breadcrumb items
  const items: Array<{ label: string; href: string; isCurrent: boolean }> = [];

  let currentPath = "";
  for (let i = 0; i < segments.length; i++) {
    const segment = segments[i];
    currentPath += `/${segment}`;

    // Skip the "admin" root segment from breadcrumbs
    if (segment === "admin" && i === 0) {
      continue;
    }

    const isCurrent = i === segments.length - 1;

    // For UUID-like segments (id), we don't show them in breadcrumbs
    // Instead, we'll show the parent entity
    if (segment.length > 20 && segment.includes("-")) {
      // This looks like a CUID/UUID, skip it
      continue;
    }

    const label =
      segmentLabels[segment] ||
      segment.charAt(0).toUpperCase() + segment.slice(1);

    items.push({
      label,
      href: currentPath,
      isCurrent,
    });
  }

  if (items.length === 0) {
    return null;
  }

  return (
    <Breadcrumb className="mb-3">
      <BreadcrumbList>
        <BreadcrumbItem>
          <Link
            href="/admin"
            className="transition-colors hover:text-foreground"
          >
            Dashboard
          </Link>
        </BreadcrumbItem>
        {items.map((item) => (
          <BreadcrumbItem key={item.href}>
            <BreadcrumbSeparator />
            {item.isCurrent ? (
              <BreadcrumbPage>{item.label}</BreadcrumbPage>
            ) : (
              <Link
                href={item.href}
                className="transition-colors hover:text-foreground"
              >
                {item.label}
              </Link>
            )}
          </BreadcrumbItem>
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
