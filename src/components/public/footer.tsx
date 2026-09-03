import Link from "next/link";
import {
  Zap,
  Phone,
  Mail,
  MapPin,
  Facebook,
  Instagram,
  MessageCircle,
} from "lucide-react";
import type { PublicCompanySettings } from "@/lib/public-data";

interface FooterProps {
  settings: PublicCompanySettings;
}

export function Footer({ settings }: FooterProps) {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-slate-950 border-t border-slate-800">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Main footer */}
        <div className="grid gap-12 py-16 sm:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div className="lg:col-span-1">
            <Link href="/" className="flex items-center gap-2 group">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-600 group-hover:bg-blue-500 transition-colors">
                <Zap className="h-6 w-6 text-white" />
              </div>
              <div>
                <p className="text-lg font-bold text-white leading-tight">
                  {settings.companyName.split(" ").slice(0, 2).join(" ")}
                </p>
                <p className="text-xs text-slate-400 leading-tight">
                  {settings.companyName.split(" ").slice(2).join(" ") ||
                    "Electrical"}
                </p>
              </div>
            </Link>
            <p className="mt-4 text-sm text-slate-400 leading-relaxed">
              Professional electrical services for residential, commercial, and
              industrial needs. Licensed, certified, and committed to safety.
            </p>

            {/* Social */}
            <div className="mt-6 flex gap-3">
              {settings.whatsapp && (
                <a
                  href={settings.whatsapp}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-800 text-slate-400 hover:text-green-400 hover:bg-slate-700 transition-colors"
                  aria-label="WhatsApp"
                >
                  <MessageCircle className="h-4 w-4" />
                </a>
              )}
              {settings.facebook && (
                <a
                  href={settings.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-800 text-slate-400 hover:text-blue-400 hover:bg-slate-700 transition-colors"
                  aria-label="Facebook"
                >
                  <Facebook className="h-4 w-4" />
                </a>
              )}
              {settings.instagram && (
                <a
                  href={settings.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-800 text-slate-400 hover:text-pink-400 hover:bg-slate-700 transition-colors"
                  aria-label="Instagram"
                >
                  <Instagram className="h-4 w-4" />
                </a>
              )}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">
              Quick Links
            </h3>
            <ul className="space-y-3">
              {[
                { label: "About Us", href: "#about" },
                { label: "Services", href: "#services" },
                { label: "Portfolio", href: "#portfolio" },
                { label: "Contact", href: "#contact" },
              ].map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    className="text-sm text-slate-400 hover:text-white transition-colors"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">
              Services
            </h3>
            <ul className="space-y-3">
              {[
                "Electrical Planning",
                "Wiring & Installation",
                "Circuit Design",
                "Lighting Solutions",
                "Maintenance & Repair",
                "Safety Inspections",
              ].map((service) => (
                <li key={service}>
                  <a
                    href="#services"
                    className="text-sm text-slate-400 hover:text-white transition-colors"
                  >
                    {service}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">
              Contact Info
            </h3>
            <ul className="space-y-4">
              {settings.phone && (
                <li>
                  <a
                    href={`tel:${settings.phone}`}
                    className="flex items-center gap-3 text-sm text-slate-400 hover:text-white transition-colors"
                  >
                    <Phone className="h-4 w-4 shrink-0 text-blue-400" />
                    {settings.phone}
                  </a>
                </li>
              )}
              {settings.email && (
                <li>
                  <a
                    href={`mailto:${settings.email}`}
                    className="flex items-center gap-3 text-sm text-slate-400 hover:text-white transition-colors"
                  >
                    <Mail className="h-4 w-4 shrink-0 text-blue-400" />
                    {settings.email}
                  </a>
                </li>
              )}
              {settings.address && (
                <li className="flex items-start gap-3 text-sm text-slate-400">
                  <MapPin className="h-4 w-4 shrink-0 mt-0.5 text-blue-400" />
                  {settings.address}
                </li>
              )}
              {settings.businessHours && (
                <li className="text-sm text-slate-500">
                  {settings.businessHours}
                </li>
              )}
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-slate-800 py-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-slate-500">
            © {currentYear} {settings.companyName}. All rights reserved.
          </p>
          <div className="flex gap-6">
            <span className="text-xs text-slate-600">
              Licensed Electrical Contractors
            </span>
            <span className="text-xs text-slate-600">
              Code-Compliant Work
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
