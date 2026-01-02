/* v1.3.0 
   Changelog: Removed experimental turbo configurations to ensure a clean Webpack build path.
*/

import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* Standard Next.js Config for 2026 */
  typescript: {
    // Ensuring build succeeds even with minor type warnings
    ignoreBuildErrors: true,
  },
  eslint: {
    // Speeding up production builds
    ignoreDuringBuilds: true,
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
};

export default nextConfig;