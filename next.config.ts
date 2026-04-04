import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "tocgolezortnknflfian.supabase.co",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
    ],
  },
  experimental: {
    serverActions: {
      allowedOrigins: [
        "192.168.35.181:3000",
        "localhost:3000",
        "foon.app",
        "www.foon.app",
        "foon-official.vercel.app"
      ],
    },
  },
};

export default nextConfig;
