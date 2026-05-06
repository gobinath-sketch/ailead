import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  basePath: "/AILeads",
  async redirects() {
    return [
      {
        source: "/",
        destination: "/AILeads",
        basePath: false,
        permanent: false,
      },
    ];
  },
};

export default nextConfig;
