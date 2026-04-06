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
   * Netlify (and other serverless) bundle size: without excludes, file tracing can pull in
   * `.git`, `.next/cache/webpack/*.pack`, and other repo cruft into `___netlify-server-handler`
   * and exceed the 250 MB function limit.
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
