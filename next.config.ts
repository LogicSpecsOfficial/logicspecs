const nextConfig = {
  typescript: {
    // !! WARN !!
    // Dangerously allow production builds to successfully complete 
    // even if your project has type errors.
    // !! WARN !!
    ignoreBuildErrors: true,
  },
  // If you want to skip ESLint too:
  eslint: {
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;