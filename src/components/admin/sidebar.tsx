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
        "admin-sidebar flex h-full flex-col",
        className
      )}
    >
      {/* Logo */}
      <div className="flex h-20 items-center px-5">
        <Link href="/admin" className="flex items-center gap-2.5" onClick={onNavigate}>
          <Zap className="h-5 w-5 fill-[#101936] text-[#101936]" />
          <div className="flex flex-col">
            <span className="font-semibold text-[#101936] text-base leading-tight">
              Tawha
            </span>
            <span className="text-[11px] text-[#66718f] leading-tight">
              Electrical Solution
            </span>
          </div>
        </Link>
      </div>

      {/* Navigation */}
      <ScrollArea className="flex-1 px-3 py-5">
        <nav className="flex flex-col gap-1.5">
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
      <div className="px-5 py-5">
        <p className="text-[10px] uppercase tracking-[0.16em] text-[#66718f]">Admin workspace</p>
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
        className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-[#66718f] cursor-not-allowed opacity-50"
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
        "admin-nav-item flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-150",
        isActive
          ? "admin-nav-active font-semibold"
          : ""
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
