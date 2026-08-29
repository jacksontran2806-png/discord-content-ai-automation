import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  poweredByHeader: false,
  compress: true,
  // Trailing-slash variants would otherwise be a second URL for the same page.
  trailingSlash: false,
  async headers() {
    return [
      {
        // API responses are not documents — keep them out of the index entirely.
        source: "/api/:path*",
        headers: [{ key: "X-Robots-Tag", value: "noindex, nofollow" }],
      },
    ];
  },
};

export default nextConfig;
