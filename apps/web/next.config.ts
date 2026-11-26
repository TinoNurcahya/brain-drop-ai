import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  distDir: process.env.NEXT_DIST_DIR || ".next",
  transpilePackages: ["@braindrop/core", "@braindrop/ai-logic"],
};

export default nextConfig;
