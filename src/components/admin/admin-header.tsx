"use client";

import * as React from "react";
import { Search } from "lucide-react";
import { usePathname } from "next/navigation";
import { MobileSidebar } from "@/components/admin/mobile-sidebar";
import { UserMenu } from "@/components/admin/user-menu";
import { navItems } from "@/config/navigation";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/shared/theme-toggle";

export interface BreadcrumbEntry {
  label: string;
  href?: string;
}

interface AdminHeaderProps {
  breadcrumbs?: BreadcrumbEntry[];
  user: {
    name?: string | null;
    email?: string | null;
    role?: string;
  };
}

export function AdminHeader({ breadcrumbs = [], user }: AdminHeaderProps) {
  const pathname = usePathname();
  const pageTitle = breadcrumbs.at(-1)?.label || getPageTitle(pathname);

  return (
    <header className="flex sticky top-0 left-0 right-0 items-center gap-3 px-3 py-3 sm:px-8 lg:px-10 backdrop-blur-xl z-40">
      <MobileSidebar />
      <Separator orientation="vertical" className="h-5 lg:hidden" />
      <div className="min-w-0">
        <h1 className="truncate text-2xl font-medium tracking-tight text-[#101936]">{pageTitle}</h1>
        {breadcrumbs.length > 1 && (
          <Breadcrumb className="hidden sm:block">
            <BreadcrumbList>
              {breadcrumbs.slice(0, -1).map((crumb, index) => (
                <React.Fragment key={index}>
                  <BreadcrumbItem>
                    {crumb.href ? <BreadcrumbLink href={crumb.href}>{crumb.label}</BreadcrumbLink> : <BreadcrumbPage>{crumb.label}</BreadcrumbPage>}
                  </BreadcrumbItem>
                  <BreadcrumbSeparator />
                </React.Fragment>
              ))}
            </BreadcrumbList>
          </Breadcrumb>
        )}
      </div>
      <div className="flex-1" />
      <div className="hidden items-center rounded-full bg-white/35 p-0.5 text-xs text-[#101936] sm:flex">
        <span className="rounded-full bg-white/70 px-5 py-1.5 shadow-sm">Day</span>
        <span className="px-5 py-1.5">Month</span>
      </div>
      <Button variant="ghost" size="icon" className="rounded-full text-[#101936] hover:bg-white/40" title="Search">
        <Search className="h-5 w-5" />
        <span className="sr-only">Search</span>
      </Button>
      <ThemeToggle className="text-[#101936] hover:bg-white/40" />
      <UserMenu user={user} />
    </header>
  );
}

function getPageTitle(pathname: string): string {
  if (pathname === "/admin") {
    return "Dashboard";
  }

  const segments = pathname.split("/").filter(Boolean);
  const section = segments[1];
  const sectionTitle = navItems.find((item) => item.href === `/admin/${section}`)?.title ?? "Admin";
  const resourceTitle = singularize(sectionTitle);
  const action = segments[2];

  if (action === "new") {
    return `New ${resourceTitle}`;
  }

  if (segments[3] === "edit") {
    return `Edit ${resourceTitle}`;
  }

  if (action && action !== "new" && action !== "edit") {
    return `${resourceTitle} Details`;
  }

  return sectionTitle;
}

function singularize(title: string): string {
  if (title === "Services") return "Service";
  if (title === "Settings") return title;
  return title.endsWith("s") ? title.slice(0, -1) : title;
}
