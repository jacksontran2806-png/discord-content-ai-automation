import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  poweredByHeader: false,
  compress: true,
  // Trailing-slash variants would otherwise be a second URL for the same page.
  trailingSlash: false,
  async redirects() {
    return [
      {
        // One canonical host. www and apex serving the same pages is duplicate
        // content and splits any link equity between them.
        source: "/:path*",
        has: [{ type: "host", value: "www.hardwaretesthub.net" }],
        destination: "https://hardwaretesthub.net/:path*",
        permanent: true,
      },
    ];
  },
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
