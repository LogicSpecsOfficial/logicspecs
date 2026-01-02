/* v1.3.1 
   Changelog: Deep Debug: Removed the unsupported eslint key to fix build warnings.
*/

import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    formats: ['image/avif', 'image/webp'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.supabase.co',
      },
    ],
  },
  /* 2026 AEO Optimization: Experimental features for AI crawlers */
  experimental: {
    optimizePackageImports: ['recharts', 'lucide-react'],
  }
};

export default nextConfig;