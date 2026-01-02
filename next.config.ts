import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  // In Next.js 16, eslint and experimental keys are handled differently
  // We remove the problematic keys to ensure a clean build
};

export default nextConfig;