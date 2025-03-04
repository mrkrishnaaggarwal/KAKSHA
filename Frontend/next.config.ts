import { withNextVideo } from "next-video/process";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  webpack: (config) => {
    config.resolve.fallback = { fs: false };
    return config;
  },
  images: {
    domains: ['images.unsplash.com'],
  },
};

export default withNextVideo(nextConfig);
