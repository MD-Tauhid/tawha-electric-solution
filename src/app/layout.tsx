import type { Metadata } from "next";
<<<<<<< HEAD
import { AuthProviders } from "@/components/auth/providers";
=======
>>>>>>> 268d6e8e8b2c7468f6ea5fe11b6659b201d661fe
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
<<<<<<< HEAD
      <body>
        <AuthProviders>{children}</AuthProviders>
      </body>
=======
      <body>{children}</body>
>>>>>>> 268d6e8e8b2c7468f6ea5fe11b6659b201d661fe
    </html>
  );
}
