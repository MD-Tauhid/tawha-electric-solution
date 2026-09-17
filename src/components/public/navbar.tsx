"use client";

import * as React from "react";
import Link from "next/link";
import { Menu, Phone, X, Zap } from "lucide-react";
import { cn } from "@/lib/utils";

interface NavbarProps {
  companyName: string;
  phone: string;
}

const NAV_LINKS = [
  { label: "About", href: "#about" },
  { label: "Services", href: "#services" },
  { label: "Portfolio", href: "#portfolio" },
  { label: "Contact", href: "#contact" },
];

export function Navbar({ companyName, phone }: NavbarProps) {
  const [scrolled, setScrolled] = React.useState(false);
  const [mobileOpen, setMobileOpen] = React.useState(false);

  React.useEffect(() => {
    function handleScroll() {
      setScrolled(window.scrollY > 20);
    }
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        scrolled
          ? "bg-slate-900/90 backdrop-blur-md shadow-lg border-b border-slate-700/50"
          : "bg-transparent"
      )}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between sm:h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-600 group-hover:bg-blue-500 transition-colors">
              <Zap className="h-6 w-6 text-white" />
            </div>
            <div className="hidden sm:block">
              <p className="text-lg font-bold text-white leading-tight">
                {companyName.split(" ").slice(0, 2).join(" ")}
              </p>
              <p className="text-xs text-slate-400 leading-tight">
                {companyName.split(" ").slice(2).join(" ") || "Electrical"}
              </p>
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-1">
            {NAV_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="px-4 py-2 text-sm font-medium text-slate-300 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
              >
                {link.label}
              </a>
            ))}
          </nav>

          {/* Desktop CTA */}
          <div className="hidden md:flex items-center gap-3">
            <a
              href={`tel:${phone}`}
              className="flex items-center gap-2 text-sm text-slate-300 hover:text-white transition-colors"
            >
              <Phone className="h-4 w-4" />
              <span className="hidden lg:inline">{phone}</span>
            </a>
            <a
              href="#contact"
              className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-500 transition-all hover:shadow-lg hover:shadow-blue-600/25"
            >
              <Zap className="h-4 w-4" />
              Get a Quote
            </a>
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden inline-flex items-center justify-center rounded-lg p-2 text-slate-300 hover:text-white hover:bg-white/10"
            aria-label="Toggle menu"
          >
            {mobileOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden bg-slate-900/95 backdrop-blur-md border-t border-slate-700/50">
          <div className="px-4 py-4 space-y-1">
            {NAV_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className="block px-4 py-3 text-base font-medium text-slate-300 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
              >
                {link.label}
              </a>
            ))}
            <div className="pt-3 border-t border-slate-700/50 space-y-2">
              <a
                href={`tel:${phone}`}
                className="flex items-center gap-2 px-4 py-3 text-slate-300 hover:text-white"
              >
                <Phone className="h-4 w-4" />
                {phone}
              </a>
              <a
                href="#contact"
                onClick={() => setMobileOpen(false)}
                className="flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-3 text-sm font-semibold text-white hover:bg-blue-500 transition-colors"
              >
                <Zap className="h-4 w-4" />
                Get a Quote
              </a>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
