import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  typescript: {
    // !! FIGYELEM !!
    // Ez engedi, hogy a build sikeres legyen TypeScript hibák mellett is.
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
