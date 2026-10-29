import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // pdfkit loads its built-in font files (Helvetica, Times, etc.) from disk at runtime.
  // Bundling it breaks that, so keep it as a normal Node package.
  serverExternalPackages: ["pdfkit"],

  // Make sure the fonts and logo are included in the server build.
  // Needed on Vercel and other serverless hosts, harmless locally.
  outputFileTracingIncludes: {
    "/api/**": ["./public/fonts/**", "./public/brand/**"],
  },
};

export default nextConfig;
