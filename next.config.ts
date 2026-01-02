import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  typescript: {
    // Allows production builds to finish even with type errors
    ignoreBuildErrors: true,
  },
  eslint: {
    // Speed up builds by skipping linting
    ignoreDuringBuilds: true,
  },
  // Ensure we are using the turbopack experimental features correctly if needed
  experimental: {
    turbo: {
      // Custom turbo rules can go here
    },
  },
};

export default nextConfig;