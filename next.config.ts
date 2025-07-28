import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.pexels.com",
        pathname: "/**", // This allows all paths under this domain
      },
    ],
  },
  typescript: {
    ignoreBuildErrors: true,  // 🚫 This allows builds to succeed even if there are type errors
  },
  eslint: {
    ignoreDuringBuilds: true, // ✅ disables all ESLint errors during `next build`
  },
};

export default nextConfig;
