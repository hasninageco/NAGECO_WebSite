import type { NextConfig } from "next";
import path from "node:path";

const lowMemoryBuild = process.env.LOW_MEMORY_BUILD === "1";

const nextConfig: NextConfig = {
  output: "standalone",
  outputFileTracingRoot: path.resolve(__dirname),
  allowedDevOrigins: ["10.0.30.3"],
  eslint: {
    ignoreDuringBuilds: lowMemoryBuild
  },
  typescript: {
    ignoreBuildErrors: lowMemoryBuild
  },
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "localhost"
      },
      {
        protocol: "http",
        hostname: "127.0.0.1"
      },
      {
        protocol: "https",
        hostname: "**"
      }
    ]
  }
};

export default nextConfig;