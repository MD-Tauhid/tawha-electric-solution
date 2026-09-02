"use client";

import * as React from "react";
import { MobileSidebar } from "@/components/admin/mobile-sidebar";
import { UserMenu } from "@/components/admin/user-menu";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";

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
  return (
    <header className="sticky top-0 z-40 flex h-16 items-center gap-4 border-b bg-white px-4 sm:px-6">
      <MobileSidebar />
      <Separator orientation="vertical" className="h-6 lg:hidden" />
      {breadcrumbs.length > 0 && (
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/admin">Admin</BreadcrumbLink>
            </BreadcrumbItem>
            {breadcrumbs.map((crumb, index) => (
              <React.Fragment key={index}>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  {crumb.href ? (
                    <BreadcrumbLink href={crumb.href}>
                      {crumb.label}
                    </BreadcrumbLink>
                  ) : (
                    <BreadcrumbPage>{crumb.label}</BreadcrumbPage>
                  )}
                </BreadcrumbItem>
              </React.Fragment>
            ))}
          </BreadcrumbList>
        </Breadcrumb>
      )}
      <div className="flex-1" />
      <UserMenu user={user} />
    </header>
  );
}
