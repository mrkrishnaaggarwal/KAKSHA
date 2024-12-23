import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  webpack: (config) => {
    config.resolve.fallback = { fs: false }; // Example for missing node modules
    return config;
  },
  /* config options here */
};

export default nextConfig;
