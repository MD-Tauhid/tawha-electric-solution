"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Zap } from "lucide-react";
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
        "flex h-full flex-col bg-card border-r border-border",
        className
      )}
    >
      {/* Logo */}
      <div className="flex h-16 items-center border-b border-border px-5">
        <Link href="/admin" className="flex items-center gap-2.5" onClick={onNavigate}>
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <Zap className="h-5 w-5" />
          </div>
          <div className="flex flex-col">
            <span className="font-semibold text-card-foreground text-sm leading-tight">
              Tawha Electrical
            </span>
            <span className="text-[11px] text-muted-foreground leading-tight">
              Admin Panel
            </span>
          </div>
        </Link>
      </div>

      {/* Navigation */}
      <ScrollArea className="flex-1 px-3 py-3">
        <nav className="flex flex-col gap-0.5">
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
      <div className="border-t border-border px-5 py-3">
        <p className="text-[11px] text-muted-foreground">
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
          "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-muted-foreground cursor-not-allowed opacity-50"
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
        "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-150",
        isActive
          ? "bg-primary/10 text-primary font-semibold"
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
