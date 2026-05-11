import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  allowedDevOrigins: ["aebe-99-6-225-98.ngrok-free.app"],
  webpack: (config, { isServer }) => {
    config.module.rules.push({
      test: /\.geojson$/,
      type: "json",
    });
    return config;
  },
};

export default nextConfig;
