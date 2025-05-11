import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [new URL('https://3n1sdy45eu.ufs.sh/**')],
  },
};

export default nextConfig;
