import type { Metadata } from "next";
import { AuthProviders } from "@/components/auth/providers";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "Tawha Electrical Solution — Professional Electrical Services",
    template: "%s | Tawha Electrical Solution",
  },
  description:
    "Professional electrical engineering and services for residential, commercial, and industrial needs. Expert planning, wiring, circuit design, lighting, installation, and maintenance.",
  keywords: [
    "electrical services",
    "electrical engineering",
    "wiring",
    "installation",
    "maintenance",
    "lighting",
    "circuit planning",
    "electrical safety",
    "residential electrical",
    "commercial electrical",
    "industrial electrical",
    "Bangladesh electrical contractor",
  ],
  authors: [{ name: "Tawha Electrical Solution" }],
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "Tawha Electrical Solution",
    title: "Tawha Electrical Solution — Professional Electrical Services",
    description:
      "Expert electrical engineering and services. Planning, wiring, installation, maintenance for residential, commercial, and industrial spaces.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Tawha Electrical Solution — Professional Electrical Services",
    description:
      "Expert electrical engineering and services. Planning, wiring, installation, maintenance for residential, commercial, and industrial spaces.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <AuthProviders>{children}</AuthProviders>
      </body>
    </html>
  );
}
