import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    formats: ["image/avif", "image/webp"],
  },
  eslint: {
    // Warning: This allows production builds to successfully complete even with ESLint errors
    ignoreDuringBuilds: true,
  },
  /**
   * Serverless bundle size (e.g. Vercel): without excludes, file tracing can pull in
   * `.git`, `.next/cache/webpack/*.pack`, and other repo cruft and exceed deployment limits.
   */
  outputFileTracingExcludes: {
    "*": [
      ".git/**/*",
      ".next/cache/**/*",
      // Prisma client ships WASM compilers for every DB; this app only uses PostgreSQL.
      "node_modules/@prisma/client/runtime/query_compiler*_bg.mysql.*",
      "node_modules/@prisma/client/runtime/query_compiler*_bg.sqlite.*",
      "node_modules/@prisma/client/runtime/query_compiler*_bg.cockroachdb.*",
      "node_modules/@prisma/client/runtime/query_compiler*_bg.sqlserver.*",
    ],
  },
};

export default nextConfig;
