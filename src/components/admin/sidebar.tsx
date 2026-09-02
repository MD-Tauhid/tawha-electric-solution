"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { navItems, type NavItem } from "@/config/navigation";
import { ScrollArea } from "@/components/admin/scroll-area";

interface SidebarProps {
  className?: string;
  onNavigate?: () => void;
}

export function Sidebar({ className, onNavigate }: SidebarProps) {
  const pathname = usePathname();

  return (
    <div
      className={cn(
        "flex h-full flex-col bg-white border-r border-border",
        className
      )}
    >
      {/* Logo */}
      <div className="flex h-16 items-center border-b border-border px-6">
        <Link href="/admin" className="flex items-center gap-2" onClick={onNavigate}>
          <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary text-primary-foreground font-bold text-sm">
            TE
          </div>
          <span className="font-semibold text-foreground text-lg">
            Tawha Electrical
          </span>
        </Link>
      </div>

      {/* Navigation */}
      <ScrollArea className="flex-1 px-3 py-4">
        <nav className="flex flex-col gap-1">
          {navItems.map((item) => (
            <SidebarItem
              key={item.href}
              item={item}
              isActive={isActive(item.href, pathname)}
              onClick={onNavigate}
            />
          ))}
        </nav>
      </ScrollArea>

      {/* Footer */}
      <div className="border-t border-border p-4">
        <p className="text-xs text-muted-foreground text-center">
          Tawha Electrical Solution
        </p>
      </div>
    </div>
  );
}

function SidebarItem({
  item,
  isActive,
  onClick,
}: {
  item: NavItem;
  isActive: boolean;
  onClick?: () => void;
}) {
  const Icon = item.icon;

  if (item.disabled) {
    return (
      <div
        className={cn(
          "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-muted-foreground cursor-not-allowed opacity-50"
        )}
      >
        <Icon className="h-4 w-4 shrink-0" />
        <span>{item.title}</span>
      </div>
    );
  }

  return (
    <Link
      href={item.href}
      onClick={onClick}
      className={cn(
        "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
        isActive
          ? "bg-primary/10 text-primary"
          : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
      )}
    >
      <Icon className="h-4 w-4 shrink-0" />
      <span>{item.title}</span>
    </Link>
  );
}

function isActive(href: string, pathname: string): boolean {
  if (href === "/admin") {
    return pathname === "/admin";
  }
  return pathname.startsWith(href);
}
