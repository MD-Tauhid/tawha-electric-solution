import {
  LayoutDashboard,
  Users,
  Wrench,
  FolderKanban,
  FileText,
  Receipt,
  CreditCard,
  Settings,
  type LucideIcon,
} from "lucide-react";

export interface NavItem {
  title: string;
  href: string;
  icon: LucideIcon;
  disabled?: boolean;
}

export const navItems: NavItem[] = [
  {
    title: "Dashboard",
    href: "/admin",
    icon: LayoutDashboard,
  },
  {
    title: "Customers",
    href: "/admin/customers",
    icon: Users,
  },
  {
    title: "Services",
    href: "/admin/services",
    icon: Wrench,
  },
  {
    title: "Projects",
    href: "/admin/projects",
    icon: FolderKanban,
  },
  {
    title: "Proposals",
    href: "/admin/proposals",
    icon: FileText,
  },
  {
    title: "Bills",
    href: "/admin/bills",
    icon: Receipt,
  },
  {
    title: "Payments",
    href: "/admin/payments",
    icon: CreditCard,
  },
  {
    title: "Settings",
    href: "/admin/settings",
    icon: Settings,
  },
];

export const secondaryNavItems: NavItem[] = [];
