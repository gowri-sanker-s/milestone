import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // for upload thing
  images: {
    domains: ["images.unsplash.com","static.wixstatic.com"],

    remotePatterns: [
      {
        protocol: "https",
        hostname: "utfs.io",
        port: "",
      },
    ],
  },
};

export default nextConfig;
