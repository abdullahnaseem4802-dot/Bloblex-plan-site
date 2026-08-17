import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // hide the floating dev-tools badge (the "N" circle) in local development
  devIndicators: false,
};

export default nextConfig;
