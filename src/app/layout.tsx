import type { Metadata } from "next";
import { AuthProviders } from "@/components/auth/providers";
import "./globals.css";

export const metadata: Metadata = {
  title: "Tawha Electrical Solution",
  description:
    "Professional electrical services for residential, commercial, and industrial needs. Planning, wiring, installation, maintenance, and more.",
  keywords: [
    "electrical services",
    "wiring",
    "installation",
    "maintenance",
    "lighting",
    "circuit planning",
  ],
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
