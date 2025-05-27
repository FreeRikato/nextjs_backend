import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  env: {
    SALT_ROUNDS: "10",
    JWT_SECRET: "secret",
    JWT_EXPIRES_IN: "1h",
  }
};

export default nextConfig;
